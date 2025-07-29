const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// 設定
const CONFIG = {
  geminiApiKey: process.env.GEMINI_API_KEY,
  alphaVantageKey: process.env.ALPHA_VANTAGE_API_KEY,
  polygonKey: process.env.POLYGON_API_KEY,
  outputDir: './archive_data',
  templateFile: './article_template_multilingual.json'
};

class MarketAnalysisAutomation {
  constructor() {
    this.genAI = new GoogleGenerativeAI(CONFIG.geminiApiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  // 1. 市場データ収集
  async collectMarketData() {
    console.log('📊 市場データを収集中...');
    
    const marketData = {
      sp500: await this.getSP500Data(),
      nasdaq: await this.getNasdaqData(),
      vix: await this.getVIXData(),
      sentiment: await this.getSentimentData(),
      technical: await this.getTechnicalData(),
      hotStocks: await this.getHotStocksData()
    };

    return marketData;
  }

  // 2. Gemini Deep Research実行
  async runGeminiAnalysis(marketData) {
    console.log('🤖 Gemini Deep Research実行中...');
    
    const prompt = this.buildAnalysisPrompt(marketData);
    
    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    
    return this.parseGeminiResponse(response.text());
  }

  // 3. JSON生成
  async generateArticleJSON(analysisResult, marketData) {
    console.log('📝 記事JSON生成中...');
    
    const template = JSON.parse(fs.readFileSync(CONFIG.templateFile, 'utf8'));
    const today = new Date();
    const fileName = `${today.getFullYear()}.${today.getMonth() + 1}.${today.getDate()}.json`;
    
    // テンプレートを分析結果で更新
    const articleData = this.updateTemplateWithAnalysis(template, analysisResult, marketData);
    
    // ファイル保存
    const filePath = path.join(CONFIG.outputDir, fileName);
    fs.writeFileSync(filePath, JSON.stringify(articleData, null, 2));
    
    return fileName;
  }

  // 4. サイト更新
  async updateWebsite(fileName) {
    console.log('🌐 サイト更新中...');
    
    // update_latest.jsを実行
    const { exec } = require('child_process');
    
    return new Promise((resolve, reject) => {
      exec(`node update_latest.js "${fileName}"`, (error, stdout, stderr) => {
        if (error) {
          console.error('更新エラー:', error);
          reject(error);
        } else {
          console.log('✅ サイト更新完了');
          resolve(stdout);
        }
      });
    });
  }

  // メイン実行関数
  async run() {
    try {
      console.log('🚀 自動市場分析開始...');
      
      // 1. データ収集
      const marketData = await this.collectMarketData();
      
      // 2. Gemini分析
      const analysisResult = await this.runGeminiAnalysis(marketData);
      
      // 3. JSON生成
      const fileName = await this.generateArticleJSON(analysisResult, marketData);
      
      // 4. サイト更新
      await this.updateWebsite(fileName);
      
      console.log('🎉 自動分析完了！');
      
    } catch (error) {
      console.error('❌ エラー:', error);
      throw error;
    }
  }

  // ヘルパー関数
  buildAnalysisPrompt(marketData) {
    return `
以下の市場データを基に、米国市場の詳細分析を行ってください。

市場データ:
${JSON.stringify(marketData, null, 2)}

以下の形式で分析結果を提供してください：

1. 評価: "買い"/"売り"/"中立"
2. スコア: 1-10
3. ヘッドライン: 簡潔で印象的なタイトル
4. サマリーテキスト: 200-300文字の分析
5. ダッシュボード分析
6. 詳細分析（内部構造、テクニカル、ファンダメンタルズ）
7. 戦略提案
8. 注目銘柄

日本語と英語の両方で提供してください。
    `;
  }

  parseGeminiResponse(response) {
    // Geminiの応答を構造化データに変換
    // 実装詳細は後述
    return {
      evaluation: "売り",
      score: 3,
      headline: "分析結果",
      // ... その他のフィールド
    };
  }

  updateTemplateWithAnalysis(template, analysis, marketData) {
    // テンプレートを分析結果で更新
    // 実装詳細は後述
    return template;
  }

  // API呼び出し関数（実装例）
  async getSP500Data() {
    // Alpha Vantage API使用例
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=SPY&apikey=${CONFIG.alphaVantageKey}`;
    const response = await axios.get(url);
    return response.data;
  }

  async getNasdaqData() {
    // 同様の実装
    return {};
  }

  async getVIXData() {
    // VIXデータ取得
    return {};
  }

  async getSentimentData() {
    // センチメントデータ取得
    return {};
  }

  async getTechnicalData() {
    // テクニカル指標取得
    return {};
  }

  async getHotStocksData() {
    // 注目銘柄データ取得
    return {};
  }
}

// 実行
if (require.main === module) {
  const automation = new MarketAnalysisAutomation();
  automation.run().catch(console.error);
}

module.exports = MarketAnalysisAutomation;