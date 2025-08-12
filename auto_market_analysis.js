require('dotenv').config();
const fs = require('fs/promises');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { collectAllMarketData } = require('./market_data_collector.js');
const { searchWeb } = require('./web_searcher.js'); // Web検索モジュールをインポート
const { createModuleLogger, logErrorAnalysis } = require('./utils/logger');
const { withRetry, withTimeout, CircuitBreaker, retryConditions } = require('./utils/errorResilience');

// モジュール専用ロガー
const logger = createModuleLogger('MARKET_ANALYZER');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Gemini API用サーキットブレーカー
const geminiCircuitBreaker = new CircuitBreaker({
    name: 'GeminiAPI',
    failureThreshold: 2,
    recoveryTimeout: 180000, // 3分
    monitoringWindow: 600000  // 10分
});

// Geminiに分析を依頼するためのプロンプト（指示文）を作成する関数
function buildAnalysisPrompt(marketData, searchResultsText) { 
  // 簡潔なJSONスキーマを定義
  const jsonStructure = `
  {
    "date": "${new Date().toLocaleDateString('ja-JP', {year: 'numeric', month: 'long', day: 'numeric'})}",
    "session": "${new Date().toLocaleDateString('ja-JP', {month: 'long', day: 'numeric'})} 市場分析",
    "languages": {
      "ja": {
        "session": "${new Date().toLocaleDateString('ja-JP', {month: 'long', day: 'numeric'})} 市場分析",
        "date": "${new Date().toLocaleDateString('ja-JP', {year: 'numeric', month: 'long', day: 'numeric'})}",
        "summary": { "evaluation": "買い|売り|中立", "score": 1-10, "headline": "短いヘッドライン", "text": "分析要約" },
        "dashboard": {
          "breadth": { "advancers": 2000, "decliners": 1500, "summary": "市場概況" },
          "sentimentVI": ${marketData.fear_and_greed_index},
          "sentimentVISummary": "Fear&Greedの解説",
          "priceLevels": { "resistance": {"value": "650", "description": "抵抗線"}, "support": {"value": "620", "description": "支持線"} },
          "putCallRatio": { "dailyValue": "0.80", "movingAverage": "0.75", "status": "弱気シグナル", "summary": "Put/Call解説" }
        },
        "details": {
          "internals": { "headline": "内部構造", "text": "セクター分析", "chartData": { "labels": ["Tech","Energy","Finance","Healthcare","Consumer","Materials"], "values": [2.1,-1.5,0.8,-0.3,1.2,-0.7] } },
          "technicals": { "headline": "テクニカル", "text": "チャート分析", "chartData": { "labels": ["8/7","8/8","8/9","8/10","8/11"], "sp500": [630,635,640,638,642],
              "ma50": [620,625,630,632,635], "adl": [1500,1520,1540,1530,1550] } },
          "fundamentals": { "headline": "ファンダメンタルズ", "text": "経済指標分析", "vix": {"value": 18, "change": "+1.2", "status": "上昇", "summary": "不安増大"}, "aaiiSurvey": {"date": "2025年8月11日", "bullish": 40, "neutral": 30, "bearish": 30, "summary": "中立"}, "investorsIntelligence": {"date": "2025年8月11日", "bullish": 45, "bearish": 25, "correction": 30, "summary": "強気優勢"}, "points": ["インフレ動向","FRB政策"] },
          "strategy": { "headline": "投資戦略", "basic": "慎重な楽観", "risk": "リスク管理必須" }
        },
        "marketOverview": [
          {"name": "S&P 500 (終値)", "value": "${marketData.sp500_price}", "change": "+5.00 (+0.75%)", "isDown": false},
          {"name": "NASDAQ (QQQ)", "value": "${marketData.nasdaq_price || 'N/A'}", "change": "+2.50 (+0.44%)", "isDown": false},
          {"name": "10年債利回り", "value": "${marketData.treasury_yield || '4.2'}%", "change": "+0.05", "isDown": false},
          {"name": "VIX指数", "value": "18.0", "change": "+1.2", "isDown": false}
        ],
        "hotStocks": [
          {"name": "NVIDIA (NVDA)", "price": "$450", "description": "AI関連", "isDown": false},
          {"name": "Apple (AAPL)", "price": "$185", "description": "iPhone好調", "isDown": false}
        ]
      }
    }
  }
  `;

  return `
  あなたは優秀な金融アナリストです。以下の「市場データ」と「最新のWeb検索結果」を**総合的に分析し**、単なる要約ではなく、深い洞察に基づいたレポートを生成してください。

  # 市場データ:
  - S&P 500 最新終値: ${marketData.sp500_price} (データ日付: ${marketData.sp500_date})
  - NASDAQ (QQQ) 最新終値: ${marketData.nasdaq_price || 'データ取得中'} (データ日付: ${marketData.nasdaq_date || '－'})
  - 米10年債利回り: ${marketData.treasury_yield || '4.2'}% (データ日付: ${marketData.treasury_date || '概算値'})
  - CNN Fear & Greed Index: ${marketData.fear_and_greed_index}
  - 分析実行日: ${new Date().toLocaleDateString('ja-JP', {year: 'numeric', month: 'long', day: 'numeric'})}

  # 最新のWeb検索結果:
  ${searchResultsText}

  # 重要な指示:
  - 必ず日本語で回答してください
  - 分析記事の日付は、分析実行日（${new Date().toLocaleDateString('ja-JP', {year: 'numeric', month: 'long', day: 'numeric'})}）を使用してください
  - 上記の「市場データ」と「最新のWeb検索結果」の両方を考慮して、なぜ市場がそのように動いたのかという**文脈**を含めて分析してください
  - 以下のJSON構造に厳密に従って出力してください
  - 全てのセクション（details.internals、details.technicals、details.fundamentals、details.strategy）を必ず含めてください
  - チャートデータ（chartData）は適切な値を推定して必ず生成してください
  - 市場概況とホットストックスには実際の価格と変動率を含めてください
  - JSONオブジェクト以外の余計なテキストは一切出力しないでください

  # 出力するJSON構造（この形式に厳密に従ってください）:
  ${jsonStructure}
  `;
}

// JSONパース処理を改善（Markdownコードブロック除去、エラーハンドリング強化）
async function analyzeWithGemini(marketData, searchResultsText) { // searchResultsText を引数に追加
    logger.processStart('GeminiによるDeep Research分析');
    
    if (!marketData) {
        logger.error('分析対象の市場データがありません');
        return null;
    }
    
    const geminiOperation = async () => {
        return await geminiCircuitBreaker.execute(async () => {
            return await withTimeout(async () => {
                return await performGeminiAnalysis(marketData, searchResultsText);
            }, 90000, 'Gemini分析'); // 90秒タイムアウト
        }, 'Gemini分析');
    };

    try {
        const analysisResult = await withRetry(geminiOperation, {
            maxRetries: 4,
            baseDelay: 10000,
            maxDelay: 60000,
            backoffMultiplier: 2,
            retryCondition: (error) => {
                // API制限、レート制限、一時的なサービス不可、503エラーもリトライ対象に追加
                return error.message.includes('quota') ||
                       error.message.includes('rate limit') ||
                       error.message.includes('service unavailable') ||
                       error.message.includes('Service Unavailable') ||
                       error.message.includes('overloaded') ||
                       error.message.includes('503') ||
                       error.message.includes('timeout') ||
                       retryConditions.networkErrors(error);
            },
            operationName: 'Gemini分析'
        });

        if (analysisResult) {
            logger.processEnd('GeminiによるDeep Research分析', Date.now(), true);
        }

        return analysisResult;

    } catch (error) {
        logger.processEnd('GeminiによるDeep Research分析', Date.now(), false);
        logErrorAnalysis(error, { 
            marketData: !!marketData, 
            searchResultsLength: searchResultsText?.length || 0 
        });
        
        // サーキットブレーカーの統計情報をログ出力
        const cbStats = geminiCircuitBreaker.getStats();
        logger.warn('Gemini APIサーキットブレーカー状態', cbStats);
        
        return null;
    }
}

/**
 * 実際のGemini API呼び出しを行う内部関数
 * @param {Object} marketData - 市場データ
 * @param {string} searchResultsText - Web検索結果
 * @returns {Promise<Object>} - 分析結果
 */
async function performGeminiAnalysis(marketData, searchResultsText) {
    const startTime = Date.now();
    const prompt = buildAnalysisPrompt(marketData, searchResultsText);
    
    logger.debug('Gemini APIプロンプト送信', { 
        promptLength: prompt.length,
        marketDataKeys: Object.keys(marketData),
        searchResultsLength: searchResultsText?.length || 0
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const duration = Date.now() - startTime;
    logger.apiCall('Gemini AI', 'SUCCESS', duration, {
        responseLength: text.length,
        promptLength: prompt.length
    });
    
    logger.debug('Gemini生レスポンス受信', { 
        responseLength: text.length,
        firstChars: text.substring(0, 200)
    });
    
    // Markdownコードブロックを確実に除去
    let cleanText = text.trim();
    
    // 複数のMarkdownパターンに対応
    cleanText = cleanText
        // ```json ... ``` パターン
        .replace(/^```json\s*/g, '')
        .replace(/^```JSON\s*/g, '')
        .replace(/```\s*$/g, '')
        // ``` ... ``` パターン
        .replace(/^```\s*/g, '')
        .replace(/```\s*$/g, '')
        // その他の余計なテキストを除去
        .replace(/^[^{]*/, '') // JSON開始前の余計なテキスト
        .replace(/[^}]*$/, '') // JSON終了後の余計なテキスト
        .trim();
    
    logger.debug('JSONクリーニング完了', { 
        originalLength: text.length,
        cleanedLength: cleanText.length,
        firstChars: cleanText.substring(0, 200)
    });
    
    // JSON構造検証
    if (!cleanText.startsWith('{') || !cleanText.endsWith('}')) {
        throw new Error('無効なJSON形式: 正しい{ }で囲まれていません');
    }
    
    const analysisResult = JSON.parse(cleanText);
    
    // データ構造検証
    if (!analysisResult.languages || !analysisResult.languages.ja) {
        throw new Error('必須の多言語構造（languages.ja）が見つかりません');
    }
    
    if (!analysisResult.languages.ja.details) {
        throw new Error('必須のdetailsセクションが見つかりません');
    }
    
    logger.success('Gemini分析完了', {
        duration,
        dataStructure: Object.keys(analysisResult),
        japaneseDataStructure: Object.keys(analysisResult.languages.ja)
    });
    
    return analysisResult;
}

// 簡易英語翻訳関数（基本的な用語の変換）
function generateEnglishVersion(jaData) {
    const translations = {
        '買い': 'Buy', '売り': 'Sell', '中立': 'Neutral', 'ホールド': 'Hold',
        '強気シグナル': 'Bullish Signal', '弱気シグナル': 'Bearish Signal',
        '市場分析': 'Market Analysis', '総合評価': 'Overall Assessment',
        '市場の健全性': 'Market Health', '市場心理': 'Market Sentiment',
        '主要な価格帯': 'Key Price Levels', '投資戦略': 'Investment Strategy',
        '基本戦略': 'Basic Strategy', 'リスク管理': 'Risk Management'
    };
    
    function translateText(text) {
        if (typeof text !== 'string') return text;
        let result = text;
        Object.entries(translations).forEach(([ja, en]) => {
            result = result.replace(new RegExp(ja, 'g'), en);
        });
        return result;
    }
    
    function translateObjectRecursively(obj) {
        if (typeof obj === 'string') {
            return translateText(obj);
        } else if (Array.isArray(obj)) {
            return obj.map(item => translateObjectRecursively(item));
        } else if (obj !== null && typeof obj === 'object') {
            const translated = {};
            for (const [key, value] of Object.entries(obj)) {
                translated[key] = translateObjectRecursively(value);
            }
            return translated;
        }
        return obj;
    }
    
    return translateObjectRecursively(jaData);
}

// manifest.jsonを更新する関数
function updateManifest(fileName, data) {
    try {
        const manifestPath = './archive_data/manifest.json';
        let manifest = [];
        
        if (require('fs').existsSync(manifestPath)) {
            manifest = JSON.parse(require('fs').readFileSync(manifestPath, 'utf8'));
        }

        // 新しいエントリを作成
        const newEntry = {
            file: fileName,
            date: data.date || data.languages?.ja?.date,
            session: data.session || data.languages?.ja?.session,
            evaluation: data.summary?.evaluation || data.languages?.ja?.summary?.evaluation,
            headline: data.summary?.headline || data.languages?.ja?.summary?.headline,
            summary: data.summary?.text || data.languages?.ja?.summary?.text
        };

        // 同じファイル名のエントリがあれば削除
        manifest = manifest.filter(entry => entry.file !== fileName);
        
        // 新しいエントリを先頭に追加
        manifest.unshift(newEntry);

        // 最大50件に制限
        if (manifest.length > 50) {
            manifest = manifest.slice(0, 50);
        }

        // manifest.jsonを更新
        require('fs').writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
        logger.success('📋 manifest.json更新完了', { fileName, entriesCount: manifest.length });

    } catch (error) {
        logger.error('⚠️ manifest.json更新中にエラー', { error: error.message, fileName });
    }
}

// メインの実行関数を更新
async function runFullAnalysis() {
    const processStartTime = Date.now();
    
    try {
        logger.info('=============================================');
        logger.info(`Deep Research プロセスを開始します: ${new Date().toLocaleString()}`);
        logger.info('=============================================');
        
        // STEP 1: 基本的な市場データを収集
        logger.processStart('市場データ収集');
        const marketData = await collectAllMarketData();
        if (!marketData) throw new Error('基本的な市場データの収集に失敗しました。');
        logger.processEnd('市場データ収集', Date.now() - processStartTime, true);

        // STEP 2: Web検索を実行
        logger.processStart('リアルタイムWeb検索');
        const searchQueries = [
            "S&P 500 market analysis today",
            "US stock market sentiment",
            "Federal Reserve latest comments",
        ];
        
        logger.info('Web検索クエリ実行', { 
            queryCount: searchQueries.length,
            queries: searchQueries 
        });
        
        // 複数の検索を並行して実行
        const searchPromises = searchQueries.map(query => searchWeb(query));
        const searchResults = await Promise.all(searchPromises);

        // 検索結果をプロンプト用に整形
        const searchResultsText = searchQueries.map((query, index) => {
            return `--- "${query}" の検索結果 ---\n${searchResults[index]}`;
        }).join('\n\n');
        
        logger.success('Web検索結果の統合完了', {
            totalResultsLength: searchResultsText.length,
            searchCount: searchResults.length
        });
        logger.processEnd('リアルタイムWeb検索', Date.now() - processStartTime, true);
        
        // STEP 3: AIによる分析
        const analysisJson = await analyzeWithGemini(marketData, searchResultsText);
        if (!analysisJson) throw new Error('分析結果のJSONが生成されませんでした。');
        
        // 英語版データを自動生成
        if (analysisJson.languages && analysisJson.languages.ja) {
            logger.info('英語版データを自動生成中...');
            analysisJson.languages.en = generateEnglishVersion(analysisJson.languages.ja);
            // 英語版の基本情報を設定
            analysisJson.languages.en.session = analysisJson.session.replace('市場分析', 'Market Analysis') + ' (EN)';
            analysisJson.languages.en.date = analysisJson.date;
            logger.success('英語版データ生成完了');
        }
        
        // STEP 4: 結果をファイルに保存
        logger.processStart('分析結果ファイル保存');
        
        // 正しい出力先に保存（live_data/latest.json）
        await fs.mkdir('live_data', { recursive: true });
        const outputPath = 'live_data/latest.json';
        await fs.writeFile(outputPath, JSON.stringify(analysisJson, null, 2));
        logger.dataOperation('JSONファイル保存', 1, { 
            filePath: outputPath,
            fileSize: JSON.stringify(analysisJson).length 
        });
        
        // STEP 6: Eleventy用の_data/reportData.jsonも更新
        await fs.mkdir('_data', { recursive: true });
        const eleventyPath = '_data/reportData.json';
        // 日本語データのみを_data/reportData.jsonに保存（Eleventy互換性のため）
        await fs.writeFile(eleventyPath, JSON.stringify(analysisJson.languages.ja, null, 2));
        logger.dataOperation('Eleventy用データ保存', 1, { 
            filePath: eleventyPath 
        });
        
        logger.processEnd('分析結果ファイル保存', Date.now() - processStartTime, true);
        
        // STEP 5: 新しく生成したデータをアーカイブにもコピー
        logger.processStart('新データアーカイブ処理');
        try {
            const newDate = analysisJson.date || analysisJson.languages?.ja?.date;
            if (newDate) {
                logger.info('📁 新しい分析データをアーカイブ中...', { date: newDate });
                
                let archiveFileName = newDate
                    .replace(/年/g, '.')
                    .replace(/月/g, '.')
                    .replace(/日/g, '')
                    .replace(/\s+/g, '') + '.json';
                
                await fs.mkdir('archive_data', { recursive: true });
                const archivePath = `archive_data/${archiveFileName}`;
                
                // 新しいデータをアーカイブに保存
                await fs.writeFile(archivePath, JSON.stringify(analysisJson, null, 2));
                logger.info(`📁 アーカイブ完了: ${archiveFileName}`);
                
                // manifest.jsonを更新
                updateManifest(archiveFileName, analysisJson);
                logger.success('📋 manifest.json更新完了');
            } else {
                logger.warn('日付情報が見つからないため、アーカイブをスキップします');
            }
        } catch (error) {
            logger.error('新データアーカイブ処理でエラーが発生しました', { error: error.message });
            // アーカイブエラーでも処理は続行
        }
        logger.processEnd('新データアーカイブ処理', Date.now() - processStartTime, true);
        
        // データ構造の検証レポート
        const jaData = analysisJson.languages.ja;
        const validationResults = {
            summary: !!jaData.summary,
            dashboard: !!jaData.dashboard,
            'details.internals': !!jaData.details?.internals,
            'details.technicals': !!jaData.details?.technicals,
            'details.fundamentals': !!jaData.details?.fundamentals,
            'details.strategy': !!jaData.details?.strategy,
            marketOverview: !!jaData.marketOverview,
            hotStocks: !!jaData.hotStocks
        };
        
        logger.info('データ構造検証結果', validationResults);

        const totalDuration = Date.now() - processStartTime;
        logger.info('=============================================');
        logger.success(`Deep Research プロセスが正常に完了しました (実行時間: ${totalDuration}ms)`, {
            totalDuration,
            timestamp: new Date().toLocaleString()
        });
        logger.info('=============================================');

    } catch (error) {
        const totalDuration = Date.now() - processStartTime;
        logger.error(`プロセス全体で致命的なエラーが発生しました (実行時間: ${totalDuration}ms)`, {
            totalDuration,
            errorMessage: error.message
        });
        
        logErrorAnalysis(error, { 
            processStep: 'runFullAnalysis',
            duration: totalDuration
        });
        
        // エラーの詳細をファイルに記録
        const errorLogPath = 'logs/critical_errors.log';
        const errorMessage = `${new Date().toISOString()}: CRITICAL ERROR - ${error.message}\n${error.stack}\n\n`;
        await fs.appendFile(errorLogPath, errorMessage).catch(() => {
            // ログファイル書き込みエラーは無視（ログシステム自体のエラーを避けるため）
        });
        
        throw error; // エラーを再スロー
    }
}

if (require.main === module) {
    runFullAnalysis();
}

module.exports = { runFullAnalysis };