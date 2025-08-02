require('dotenv').config();
const fs = require('fs/promises');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { collectAllMarketData } = require('./market_data_collector.js');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Geminiに分析を依頼するためのプロンプト（指示文）を作成する関数
function buildAnalysisPrompt(marketData) {
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
  あなたは優秀な金融アナリストです。以下の最新市場データを分析し、日本の短期トレーダー向けの詳細な市場分析レポートを生成してください。

  # 重要な指示:
  - 必ず日本語で回答してください
  - 以下のJSON構造に厳密に従って出力してください
  - 全てのセクション（details.internals、details.technicals、details.fundamentals、details.strategy）を必ず含めてください
  - チャートデータ（chartData）は適切な値を推定して必ず生成してください
  - 市場概況とホットストックスには実際の価格と変動率を含めてください
  - JSONオブジェクト以外の余計なテキストは一切出力しないでください

  # 市場データ:
  - S&P 500 最新終値: ${marketData.sp500_price} (日付: ${marketData.sp500_date})
  - CNN Fear & Greed Index: ${marketData.fear_and_greed_index}

  # 出力するJSON構造（この形式に厳密に従ってください）:
  ${jsonStructure}
  `;
}

// JSONパース処理を改善（Markdownコードブロック除去、エラーハンドリング強化）
async function analyzeWithGemini(marketData) {
    console.log('----------');
    console.log('[STEP 2] Geminiによる市場分析を開始します。');
    if (!marketData) {
        console.error('[ERROR] 分析対象の市場データがありません。');
        return null;
    }
    try {
        const prompt = buildAnalysisPrompt(marketData);
        console.log('[DEBUG] AIプロンプトを送信中...');
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log('[DEBUG] Geminiからの生レスポンス長:', text.length);
        console.log('[DEBUG] 生レスポンスの最初の200文字:', text.substring(0, 200));
        
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
        
        console.log('[DEBUG] クリーニング後のテキスト長:', cleanText.length);
        console.log('[DEBUG] クリーニング後の最初の200文字:', cleanText.substring(0, 200));
        
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
        
        console.log('[SUCCESS] Geminiによる分析が完了しました。');
        console.log('[DEBUG] 生成されたデータ構造:', Object.keys(analysisResult));
        console.log('[DEBUG] 日本語データ構造:', Object.keys(analysisResult.languages.ja));
        
        return analysisResult;
    } catch (error) {
        console.error('[ERROR] Geminiでの分析中にエラーが発生しました:', error.message);
        console.error('[ERROR] エラースタック:', error.stack);
        
        // デバッグ用にレスポンステキストをファイルに保存
        if (typeof text !== 'undefined') {
            const fs = require('fs/promises');
            const debugPath = 'debug_gemini_response.txt';
            await fs.writeFile(debugPath, `=== 生レスポンス ===\n${text}\n\n=== クリーニング後 ===\n${cleanText || 'undefined'}`);
            console.error(`[DEBUG] レスポンス内容を ${debugPath} に保存しました`);
        }
        
        return null;
    }
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

async function runFullAnalysis() {
    try {
        console.log('=============================================');
        console.log(`市場分析プロセスを開始します: ${new Date().toLocaleString()}`);
        console.log('=============================================');
        
        const marketData = await collectAllMarketData();
        const analysisJson = await analyzeWithGemini(marketData);
        
        if (!analysisJson) {
            throw new Error('分析結果のJSONが生成されませんでした。');
        }
        
        // 英語版データを自動生成
        if (analysisJson.languages && analysisJson.languages.ja) {
            console.log('[INFO] 英語版データを自動生成中...');
            analysisJson.languages.en = generateEnglishVersion(analysisJson.languages.ja);
            // 英語版の基本情報を設定
            analysisJson.languages.en.session = analysisJson.session.replace('市場分析', 'Market Analysis') + ' (EN)';
            analysisJson.languages.en.date = analysisJson.date;
        }
        
        // 正しい出力先に保存（live_data/latest.json）
        await fs.mkdir('live_data', { recursive: true });
        const outputPath = 'live_data/latest.json';
        await fs.writeFile(outputPath, JSON.stringify(analysisJson, null, 2));
        
        console.log(`[SUCCESS] 分析結果を ${outputPath} に保存しました。`);
        
        // データ構造の検証レポート
        const jaData = analysisJson.languages.ja;
        console.log('[INFO] データ構造検証:');
        console.log(`  - summary: ${jaData.summary ? '✓' : '✗'}`);
        console.log(`  - dashboard: ${jaData.dashboard ? '✓' : '✗'}`);
        console.log(`  - details.internals: ${jaData.details?.internals ? '✓' : '✗'}`);
        console.log(`  - details.technicals: ${jaData.details?.technicals ? '✓' : '✗'}`);
        console.log(`  - details.fundamentals: ${jaData.details?.fundamentals ? '✓' : '✗'}`);
        console.log(`  - details.strategy: ${jaData.details?.strategy ? '✓' : '✗'}`);
        console.log(`  - marketOverview: ${jaData.marketOverview ? '✓' : '✗'}`);
        console.log(`  - hotStocks: ${jaData.hotStocks ? '✓' : '✗'}`);
        
        console.log('=============================================');
        console.log(`市場分析プロセスが正常に完了しました: ${new Date().toLocaleString()}`);
        console.log('=============================================');
        
    } catch (error) {
        console.error(`[FATAL] プロセス全体で致命的なエラーが発生しました: ${error.message}`);
        const errorLogPath = 'error.log';
        const errorMessage = `${new Date().toISOString()}: ${error.stack}\n`;
        await fs.appendFile(errorLogPath, errorMessage);
        console.error(`エラーの詳細は ${errorLogPath} を確認してください。`);
    }
}
if (require.main === module) {
    runFullAnalysis();
}
module.exports = { runFullAnalysis };