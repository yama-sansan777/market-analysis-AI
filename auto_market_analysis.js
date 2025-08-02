require('dotenv').config();
const fs = require('fs/promises');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { collectAllMarketData } = require('./market_data_collector.js');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Geminiに分析を依頼するためのプロンプト（指示文）を作成する関数
function buildAnalysisPrompt(marketData) {
  // あなたのHTMLが要求する全てのデータ構造を定義します
  const jsonStructure = `
  {
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
        "summary": "string (市場の健全性に関する短いコメント)"
      },
      "sentimentVI": ${marketData.fear_and_greed_index},
      "sentimentVISummary": "string (Fear & Greed Indexに関するコメント)",
      "priceLevels": {
        "resistance": {
          "value": "string (例: $5,100)",
          "description": "string (抵抗線の根拠)"
        },
        "support": {
          "value": "string (例: $5,050)",
          "description": "string (支持線の根拠)"
        }
      },
      "putCallRatio": {
        "dailyValue": "string (例: 0.75)",
        "movingAverage": "string (例: 0.65)",
        "status": "'弱気シグナル' | '強気シグナル' | '中立'",
        "summary": "string (Put/Call Ratioに関する短いコメント)"
      }
    },
    "marketOverview": [
      { "name": "S&P 500 (終値)", "value": "${marketData.sp500_price}", "change": "string (例: -45.10 (-0.88%))", "isDown": "boolean" },
      { "name": "S&P 500 先物", "value": "string (例: 5,065.50)", "change": "string (例: -30.50)", "isDown": "boolean" },
      { "name": "VIX指数", "value": "string", "change": "string", "isDown": "boolean" },
      { "name": "米国10年債利回り", "value": "string", "change": "string", "isDown": "boolean" }
    ],
    "hotStocks": [
      { "name": "NVIDIA (NVDA)", "price": "'主な値下がり銘柄' | '主な値上がり銘柄'", "description": "string (注目理由)", "isDown": "boolean" },
      { "name": "Apple (AAPL)", "price": "'主な値下がり銘柄' | '主な値上がり銘柄'", "description": "string (注目理由)", "isDown": "boolean" },
      { "name": "JPMorgan Chase (JPM)", "price": "'主な値下がり銘柄' | '主な値上がり銘柄'", "description": "string (注目理由)", "isDown": "boolean" }
    ]
  }
  `;

  return `
  あなたは優秀な金融アナリストです。以下の最新市場データを分析し、日本の短期トレーダー向けの市場分析レポートを生成してください。

  # 市場データ:
  - S&P 500 最新終値: ${marketData.sp500_price} (日付: ${marketData.sp500_date})
  - CNN Fear & Greed Index: ${marketData.fear_and_greed_index} (0=Extreme Fear, 100=Extreme Greed)

  # 指示:
  - 必ず日本語で回答してください。
  - 以下のJSON構造とデータ型に厳密に従って、分析結果のみを出力してください。
  - isDownフィールドは、前日比で値が下がった場合にtrue、上がった場合にfalseを設定してください。
  - JSONオブジェクト以外の余計なテキスト（解説やマークダウンなど）は絶対に出力しないでください。

  # 出力JSON構造:
  ${jsonStructure}
  `;
}

// 以下の部分は変更ありません
async function analyzeWithGemini(marketData) {
    console.log('----------');
    console.log('[STEP 2] Geminiによる市場分析を開始します。');

    if (!marketData) {
        console.error('[ERROR] 分析対象の市場データがありません。');
        return null;
    }

    try {
        const prompt = buildAnalysisPrompt(marketData);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Geminiの出力をパース（解釈）してJSONオブジェクトに変換
        // Markdown形式のコードブロックを除去
        let cleanText = text.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim();
        const analysisResult = JSON.parse(cleanText);
        console.log('[SUCCESS] Geminiによる分析が完了しました。');
        return analysisResult;

    } catch (error) {
        console.error('[ERROR] Geminiでの分析中にエラーが発生しました:', error);
        return null;
    }
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
        
        // _dataフォルダがなければ作成
        await fs.mkdir('_data', { recursive: true });
        const outputPath = '_data/reportData.json';
        await fs.writeFile(outputPath, JSON.stringify(analysisJson, null, 2));

        console.log(`[SUCCESS] 分析結果を ${outputPath} に保存しました。`);
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