require('dotenv').config();
const fs = require('fs/promises');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { collectAllMarketData } = require('./market_data_collector.js');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Geminiに分析を依頼するためのプロンプト（指示文）を作成する関数
function buildAnalysisPrompt(marketData) {
  // あなたが提供したHTMLの`reportData`オブジェクトの構造を参考にします。
  // これにより、AIは常に同じ形式のJSONを返すようになります。
  const jsonStructure = `
  {
    "session": "string (例: 7月29日 市場分析)",
    "date": "string (例: 2025年7月29日)",
    "summary": {
      "evaluation": "'売り' | '買い' | '中立'",
      "score": "number (1から10)",
      "headline": "string (20字程度のヘッドライン)",
      "text": "string (200字程度の分析サマリー)"
    },
    "dashboard": {
      "sentimentVI": ${marketData.fear_and_greed_index},
      "sentimentVISummary": "string (Fear & Greed Indexに関するコメント)"
    }
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
  - JSONオブジェクト以外の余計なテキスト（例: 「はい、承知いたしました。」や、\`\`\`json ... \`\`\`のようなマークダウン）は絶対に出力しないでください。

  # 出力JSON構造:
  ${jsonStructure}
  `;
}

// Geminiに分析を依頼し、結果をJSONとして受け取る関数
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
        // マークダウンのコードブロックが含まれている場合は除去
        let cleanText = text.trim();
        if (cleanText.startsWith('```json')) {
            cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanText.startsWith('```')) {
            cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        
        const analysisResult = JSON.parse(cleanText);
        console.log('[SUCCESS] Geminiによる分析が完了しました。');
        return analysisResult;

    } catch (error) {
        console.error('[ERROR] Geminiでの分析中にエラーが発生しました:', error);
        console.error('--- Geminiからの生データ ---');
        // エラー時にGeminiが何を返したか確認できるようにログに残す
        // const text = error.response ? error.response.text() : "レスポンスがありません";
        // console.error(text);
        // console.error('--------------------------');
        return null;
    }
}

// メインの実行関数
async function runFullAnalysis() {
    try {
        console.log('=============================================');
        console.log(`市場分析プロセスを開始します: ${new Date().toLocaleString()}`);
        console.log('=============================================');
        
        // 1. データ収集
        const marketData = await collectAllMarketData();

        // 2. AIによる分析
        const analysisJson = await analyzeWithGemini(marketData);

        if (!analysisJson) {
            throw new Error('分析結果のJSONが生成されませんでした。');
        }
        
        // 3. 結果をファイルに保存
        console.log('----------');
        console.log('[STEP 3] 分析結果をファイルに保存します。');
        const outputPath = 'reportData.json';
        // JSONを整形して書き出す (null, 2 は読みやすくするためのインデント設定)
        await fs.writeFile(outputPath, JSON.stringify(analysisJson, null, 2));
        console.log(`[SUCCESS] 分析結果を ${outputPath} に保存しました。`);
        console.log('=============================================');
        console.log(`市場分析プロセスが正常に完了しました: ${new Date().toLocaleString()}`);
        console.log('=============================================');

    } catch (error) {
        console.error(`[FATAL] プロセス全体で致命的なエラーが発生しました: ${error.message}`);
        // エラーログをファイルに追記
        const errorLogPath = 'error.log';
        const errorMessage = `${new Date().toISOString()}: ${error.stack}\n`;
        await fs.appendFile(errorLogPath, errorMessage);
        console.error(`エラーの詳細は ${errorLogPath} を確認してください。`);
    }
}

// このファイルが直接実行された場合にのみ、runFullAnalysisを実行
if (require.main === module) {
    runFullAnalysis();
}

module.exports = { runFullAnalysis };