require('dotenv').config();
const fs = require('fs/promises');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { collectAllMarketData } = require('./market_data_collector.js');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Geminiに分析を依頼するためのプロンプト（指示文）を作成する関数
function buildAnalysisPrompt(marketData) {
  // あなたのHTMLが要求する全てのデータ構造を完全に定義します
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
      "breadth": { "advancers": "number", "decliners": "number", "summary": "string" },
      "sentimentVI": ${marketData.fear_and_greed_index},
      "sentimentVISummary": "string",
      "priceLevels": {
        "resistance": { "value": "string", "description": "string" },
        "support": { "value": "string", "description": "string" }
      },
      "putCallRatio": { "dailyValue": "string", "movingAverage": "string", "status": "string", "summary": "string" }
    },
    "details": {
      "internals": {
        "headline": "string (内部構造のヘッドライン)",
        "text": "string (内部構造の解説文)",
        "chartData": {
          "labels": ["string", "string", "string", "string", "string", "string"],
          "values": ["number", "number", "number", "number", "number", "number"]
        }
      },
      "technicals": {
        "headline": "string (テクニカル分析のヘッドライン)",
        "text": "string (テクニカル分析の解説文)",
        "chartData": {
          "labels": ["string", "string", "string", "string", "string"],
          "sp500": ["number", "number", "number", "number", "number"],
          "ma50": ["number", "number", "number", "number", "number"],
          "adl": ["number", "number", "number", "number", "number"]
        }
      },
      "fundamentals": {
        "headline": "string (ファンダメンタルズのヘッドライン)",
        "text": "string (ファンダメンタルズの解説文)",
        "vix": { "value": "number", "change": "string", "status": "string", "summary": "string" },
        "aaiiSurvey": { "date": "string", "bullish": "number", "neutral": "number", "bearish": "number", "summary": "string" },
        "investorsIntelligence": { "date": "string", "bullish": "number", "bearish": "number", "correction": "number", "summary": "string" },
        "points": ["string", "string"]
      },
      "strategy": {
        "headline": "string (投資戦略のヘッドライン)",
        "basic": "string (基本戦略の解説)",
        "risk": "string (リスク管理の解説)"
      }
    },
    "marketOverview": [
      { "name": "S&P 500 (終値)", "value": "${marketData.sp500_price}", "change": "string", "isDown": "boolean" },
      { "name": "S&P 500 先物", "value": "string", "change": "string", "isDown": "boolean" },
      { "name": "VIX指数", "value": "string", "change": "string", "isDown": "boolean" },
      { "name": "米国10年債利回り", "value": "string", "change": "string", "isDown": "boolean" }
    ],
    "hotStocks": [
      { "name": "string (注目銘柄1)", "price": "string", "description": "string", "isDown": "boolean" },
      { "name": "string (注目銘柄2)", "price": "string", "description": "string", "isDown": "boolean" },
      { "name": "string (注目銘柄3)", "price": "string", "description": "string", "isDown": "boolean" }
    ]
  }
  `;

  return `
  あなたは優秀な金融アナリストです。以下の最新市場データを分析し、日本の短期トレーダー向けの市場分析レポートを生成してください。
  # 指示:
  - 必ず日本語で回答してください。
  - 以下のJSON構造とデータ型に厳密に従って、分析結果のみを出力してください。
  - isDownフィールドは、前日比で値が下がった場合にtrue、上がった場合にfalseを設定してください。
  - チャートデータは、適切なラベルと値を推定して生成してください。
  - JSONオブジェクト以外の余計なテキスト（解説やマークダウンなど）は絶対に出力しないでください。
  # 市場データ:
  - S&P 500 最新終値: ${marketData.sp500_price} (日付: ${marketData.sp500_date})
  - CNN Fear & Greed Index: ${marketData.fear_and_greed_index}
  # 出力JSON構造:
  ${jsonStructure}
  `;
}

// 以下のコードは変更ありません
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
        const analysisResult = JSON.parse(text);
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