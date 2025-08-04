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
function buildAnalysisPrompt(marketData, searchResultsText) { // searchResultsText を引数に追加
  // 多言語構造に対応した完全なJSONスキーマを定義
  const jsonStructure = `
  {
    "date": "string (例: 2025年8月2日)",
    "session": "string (例: 8月2日 市場分析)",
    "languages": {
      "ja": {
        "session": "string (例: 8月2日 市場分析)",
        "date": "string (例: 2025年8月2日)",
        "summary": {
          "evaluation": "'売り' | '買い' | '中立'",
          "score": "number (1-10の整数)",
          "headline": "string (30字程度のヘッドライン)",
          "text": "string (200字程度の分析サマリー)"
        },
        "dashboard": {
          "breadth": { 
            "advancers": "number (値上がり銘柄数)", 
            "decliners": "number (値下がり銘柄数)", 
            "summary": "string (市場健全性に関するコメント)" 
          },
          "sentimentVI": ${marketData.fear_and_greed_index},
          "sentimentVISummary": "string (Fear & Greed Indexについてのコメント)",
          "priceLevels": {
            "resistance": { "value": "string (例: 5,100.00)", "description": "string (抵抗線の説明)" },
            "support": { "value": "string (例: 5,050.00)", "description": "string (支持線の説明)" }
          },
          "putCallRatio": { 
            "dailyValue": "string (例: 0.75)", 
            "movingAverage": "string (例: 0.65)", 
            "status": "string ('弱気シグナル' | '強気シグナル' | '中立')", 
            "summary": "string (Put/Call比率の解説)" 
          }
        },
        "details": {
          "internals": {
            "headline": "string (市場内部構造の見出し)",
            "text": "string (市場内部構造の詳細分析)",
            "chartData": {
              "labels": ["セクター1", "セクター2", "セクター3", "セクター4", "セクター5", "セクター6"],
              "values": [2.1, -1.5, 0.8, -0.3, 1.2, -0.7]
            }
          },
          "technicals": {
            "headline": "string (テクニカル分析の見出し)",
            "text": "string (テクニカル分析の詳細)",
            "chartData": {
              "labels": ["7/29", "7/30", "7/31", "8/1", "8/2"],
              "sp500": [5100, 5120, 5095, 5110, 5125],
              "ma50": [5090, 5092, 5094, 5096, 5098],
              "adl": [2500, 2480, 2460, 2470, 2485]
            }
          },
          "fundamentals": {
            "headline": "string (ファンダメンタルズ分析の見出し)",
            "text": "string (ファンダメンタルズ分析の詳細)",
            "vix": { 
              "value": 18.5, 
              "change": "+1.2 (+6.9%)", 
              "status": "上昇", 
              "summary": "string (VIX指数の状況説明)" 
            },
            "aaiiSurvey": { 
              "date": "2025年8月1日", 
              "bullish": 35, 
              "neutral": 30, 
              "bearish": 35, 
              "summary": "string (AAII調査の分析)" 
            },
            "investorsIntelligence": { 
              "date": "2025年8月1日", 
              "bullish": 45, 
              "bearish": 25, 
              "correction": 30, 
              "summary": "string (II調査の分析)" 
            },
            "points": [
              "string (ファンダメンタルズのポイント1)",
              "string (ファンダメンタルズのポイント2)"
            ]
          },
          "strategy": {
            "headline": "string (投資戦略の見出し)",
            "basic": "string (基本的な投資戦略の説明)",
            "risk": "string (リスク管理の説明)"
          }
        },
        "marketOverview": [
          { "name": "S&P 500 (終値)", "value": "${marketData.sp500_price}", "change": "string (例: +12.50 (+0.25%))", "isDown": false },
          { "name": "S&P 500 先物", "value": "string (例: 5,125.25)", "change": "string (例: +8.75)", "isDown": false },
          { "name": "VIX指数", "value": "string (例: 18.45)", "change": "string (例: +1.20)", "isDown": false },
          { "name": "米国10年債利回り", "value": "string (例: 4.25%)", "change": "string (例: +0.05%)", "isDown": false }
        ],
        "hotStocks": [
          { "name": "NVIDIA (NVDA)", "price": "string (例: $125.50)", "description": "string (注目理由の説明)", "isDown": false },
          { "name": "Apple (AAPL)", "price": "string (例: $185.25)", "description": "string (注目理由の説明)", "isDown": true },
          { "name": "Microsoft (MSFT)", "price": "string (例: $415.75)", "description": "string (注目理由の説明)", "isDown": false }
        ]
      }
    }
  }
  `;

  return `
  あなたは優秀な金融アナリストです。以下の「市場データ」と「最新のWeb検索結果」を**総合的に分析し**、単なる要約ではなく、深い洞察に基づいたレポートを生成してください。

  # 市場データ:
  - S&P 500 最新終値: ${marketData.sp500_price} (日付: ${marketData.sp500_date})
  - CNN Fear & Greed Index: ${marketData.fear_and_greed_index}

  # 最新のWeb検索結果:
  ${searchResultsText}

  # 重要な指示:
  - 必ず日本語で回答してください
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
            }, 45000, 'Gemini分析'); // 45秒タイムアウト
        }, 'Gemini分析');
    };

    try {
        const analysisResult = await withRetry(geminiOperation, {
            maxRetries: 2,
            baseDelay: 5000,
            maxDelay: 15000,
            backoffMultiplier: 3,
            retryCondition: (error) => {
                // API制限、レート制限、一時的なサービス不可のみリトライ
                return error.message.includes('quota') ||
                       error.message.includes('rate limit') ||
                       error.message.includes('service unavailable') ||
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
        
        // STEP 5: Eleventy用の_data/reportData.jsonも更新
        await fs.mkdir('_data', { recursive: true });
        const eleventyPath = '_data/reportData.json';
        // 日本語データのみを_data/reportData.jsonに保存（Eleventy互換性のため）
        await fs.writeFile(eleventyPath, JSON.stringify(analysisJson.languages.ja, null, 2));
        logger.dataOperation('Eleventy用データ保存', 1, { 
            filePath: eleventyPath 
        });
        
        logger.processEnd('分析結果ファイル保存', Date.now() - processStartTime, true);
        
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