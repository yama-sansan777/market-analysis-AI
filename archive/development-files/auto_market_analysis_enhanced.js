const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const AIValidator = require('./ai_validator');
const SSGIntegration = require('./ssg_integration');
const MarketDataCollector = require('./market_data_collector');
const winston = require('winston');

// ログ設定
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'market-analysis' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

class EnhancedMarketAnalysisAutomation {
  constructor() {
    this.config = {
      geminiApiKey: process.env.GEMINI_API_KEY,
      alphaVantageKey: process.env.ALPHA_VANTAGE_API_KEY,
      polygonKey: process.env.POLYGON_API_KEY,
      outputDir: './archive_data',
      dataDir: './_data',
      templateFile: './article_template_multilingual.json'
    };

    this.genAI = new GoogleGenerativeAI(this.config.geminiApiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    this.validator = new AIValidator();
    this.ssg = new SSGIntegration();
    this.dataCollector = new MarketDataCollector();
  }

  // メイン実行関数
  async run() {
    try {
      logger.info('🚀 強化版自動市場分析開始...');
      
      // 1. 市場データ収集
      const marketData = await this.collectMarketData();
      
      // 2. Gemini分析（検証付き）
      const analysisResult = await this.runGeminiAnalysisWithValidation(marketData);
      
      // 3. JSON生成
      const fileName = await this.generateArticleJSON(analysisResult, marketData);
      
      // 4. 静的サイト生成
      await this.generateStaticSite();
      
      // 5. サイト更新
      await this.updateWebsite(fileName);
      
      logger.info('🎉 強化版自動分析完了！');
      
    } catch (error) {
      logger.error('❌ エラー:', error);
      await this.handleError(error);
      throw error;
    }
  }

  // 市場データ収集（エラーハンドリング強化）
  async collectMarketData() {
    logger.info('📊 市場データを収集中...');
    
    try {
      const marketData = {
        sp500: await this.dataCollector.getSP500Data(),
        nasdaq: await this.dataCollector.getNasdaqData(),
        vix: await this.dataCollector.getVIXData(),
        sentiment: await this.dataCollector.getSentimentData(),
        technical: await this.dataCollector.getTechnicalData(),
        hotStocks: await this.dataCollector.getHotStocksData()
      };

      // データの妥当性チェック
      if (!this.validateMarketData(marketData)) {
        throw new Error('市場データの取得に失敗しました');
      }

      logger.info('✅ 市場データ収集完了');
      return marketData;
      
    } catch (error) {
      logger.error('市場データ収集エラー:', error);
      throw error;
    }
  }

  // 市場データの妥当性チェック
  validateMarketData(marketData) {
    const requiredFields = ['sp500', 'nasdaq', 'vix', 'sentiment'];
    
    for (const field of requiredFields) {
      if (!marketData[field]) {
        logger.warn(`⚠️ ${field}データが取得できませんでした`);
        return false;
      }
    }
    
    return true;
  }

  // Gemini分析（検証付き）
  async runGeminiAnalysisWithValidation(marketData) {
    logger.info('🤖 Gemini Deep Research実行中...');
    
    const prompt = this.buildEnhancedAnalysisPrompt(marketData);
    
    for (let attempt = 1; attempt <= this.validator.maxRetries; attempt++) {
      try {
        const result = await this.model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();
        
        // AI応答の検証
        const validationResult = await this.validator.validateAIResponse(responseText, attempt - 1);
        
        if (validationResult.success) {
          logger.info('✅ Gemini分析成功');
          return validationResult.data;
        } else if (validationResult.shouldRetry) {
          logger.warn(`🔄 再試行 ${attempt}/${this.validator.maxRetries}`);
          await this.delay(2000 * attempt); // 指数関数的バックオフ
          continue;
        } else {
          throw new Error('AI分析の検証に失敗しました');
        }
        
      } catch (error) {
        logger.error(`Gemini分析エラー (試行 ${attempt}):`, error);
        
        if (attempt === this.validator.maxRetries) {
          throw error;
        }
      }
    }
  }

  // 改善されたプロンプト
  buildEnhancedAnalysisPrompt(marketData) {
    return `
以下の市場データを分析し、指定されたJSON構造に従って日本語で出力してください。
JSONオブジェクト以外の余計なテキスト（解説、マークダウンのバッククオートなど）は一切含めないでください。

# 市場データ:
${JSON.stringify(marketData, null, 2)}

# 出力JSON構造:
{
  "session": "string (例: 2025年1月28日 市場分析)",
  "date": "string (例: 2025年1月28日)",
  "summary": {
    "evaluation": "買い | 売り | 中立",
    "score": "number (1-10)",
    "headline": "string (簡潔で印象的なタイトル)",
    "text": "string (200-300文字の分析)"
  },
  "dashboard": {
    "breadth": {
      "advancers": "number",
      "decliners": "number",
      "summary": "string"
    },
    "sentimentVI": "number",
    "sentimentVISummary": "string",
    "priceLevels": {
      "resistance": {
        "value": "string",
        "description": "string"
      },
      "support": {
        "value": "string",
        "description": "string"
      }
    },
    "putCallRatio": {
      "dailyValue": "string",
      "movingAverage": "string",
      "status": "string",
      "summary": "string"
    }
  },
  "details": {
    "internals": {
      "headline": "string",
      "text": "string",
      "chartData": {
        "labels": ["string"],
        "values": ["number"]
      }
    },
    "technicals": {
      "headline": "string",
      "text": "string",
      "chartData": {
        "labels": ["string"],
        "sp500": ["number"],
        "ma50": ["number"],
        "adl": ["number"]
      }
    },
    "fundamentals": {
      "headline": "string",
      "text": "string",
      "vix": {
        "value": "number",
        "change": "string",
        "summary": "string"
      },
      "aaiiSurvey": {
        "date": "string",
        "bullish": "number",
        "neutral": "number",
        "bearish": "number",
        "summary": "string"
      },
      "investorsIntelligence": {
        "date": "string",
        "bullish": "number",
        "bearish": "number",
        "correction": "number",
        "summary": "string"
      },
      "points": ["string"]
    },
    "strategy": {
      "headline": "string",
      "basic": "string",
      "risk": "string"
    }
  },
  "marketOverview": [
    {
      "name": "string",
      "value": "string",
      "change": "string",
      "isDown": "boolean"
    }
  ],
  "hotStocks": [
    {
      "name": "string",
      "price": "string",
      "description": "string",
      "isDown": "boolean"
    }
  ]
}
    `;
  }

  // JSON生成（SSG統合）
  async generateArticleJSON(analysisResult, marketData) {
    logger.info('📝 記事JSON生成中...');
    
    try {
      const template = JSON.parse(fs.readFileSync(this.config.templateFile, 'utf8'));
      const today = new Date();
      const fileName = `${today.getFullYear()}.${today.getMonth() + 1}.${today.getDate()}.json`;
      
      // テンプレートを分析結果で更新
      const articleData = this.updateTemplateWithAnalysis(template, analysisResult, marketData);
      
      // アーカイブファイル保存
      const archivePath = path.join(this.config.outputDir, fileName);
      fs.writeFileSync(archivePath, JSON.stringify(articleData, null, 2));
      
      // SSG用データファイル保存
      const dataPath = path.join(this.config.dataDir, 'reportData.json');
      if (!fs.existsSync(this.config.dataDir)) {
        fs.mkdirSync(this.config.dataDir, { recursive: true });
      }
      fs.writeFileSync(dataPath, JSON.stringify(articleData, null, 2));
      
      logger.info('✅ 記事JSON生成完了');
      return fileName;
      
    } catch (error) {
      logger.error('JSON生成エラー:', error);
      throw error;
    }
  }

  // 静的サイト生成
  async generateStaticSite() {
    logger.info('🏗️ 静的サイト生成中...');
    
    try {
      await this.ssg.generateSite();
      logger.info('✅ 静的サイト生成完了');
    } catch (error) {
      logger.error('静的サイト生成エラー:', error);
      throw error;
    }
  }

  // サイト更新
  async updateWebsite(fileName) {
    logger.info('🌐 サイト更新中...');
    
    try {
      const { exec } = require('child_process');
      
      return new Promise((resolve, reject) => {
        exec(`node update_latest.js "${fileName}"`, (error, stdout, stderr) => {
          if (error) {
            logger.error('更新エラー:', error);
            reject(error);
          } else {
            logger.info('✅ サイト更新完了');
            resolve(stdout);
          }
        });
      });
    } catch (error) {
      logger.error('サイト更新エラー:', error);
      throw error;
    }
  }

  // エラーハンドリング
  async handleError(error) {
    logger.error('🚨 エラー処理開始:', error);
    
    try {
      // エラー通知
      await this.validator.sendErrorNotification(error, {
        timestamp: new Date().toISOString(),
        context: 'EnhancedMarketAnalysisAutomation'
      });
      
      // フォールバックデータの使用
      const fallbackData = this.validator.loadFallbackData();
      
      // フォールバックデータを保存
      const dataPath = path.join(this.config.dataDir, 'reportData.json');
      if (!fs.existsSync(this.config.dataDir)) {
        fs.mkdirSync(this.config.dataDir, { recursive: true });
      }
      fs.writeFileSync(dataPath, JSON.stringify(fallbackData, null, 2));
      
      logger.info('🔄 フォールバックデータを適用しました');
      
    } catch (fallbackError) {
      logger.error('フォールバック処理エラー:', fallbackError);
    }
  }

  // ヘルパー関数
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  updateTemplateWithAnalysis(template, analysis, marketData) {
    // テンプレートを分析結果で更新
    // 実装詳細は既存のロジックを使用
    return {
      ...template,
      languages: {
        ja: analysis,
        en: this.generateEnglishVersion(analysis)
      }
    };
  }

  generateEnglishVersion(jaData) {
    // 簡易的な英語版生成
    return {
      session: `[EN] ${jaData.session}`,
      date: `[EN] ${jaData.date}`,
      summary: {
        evaluation: jaData.summary.evaluation === '買い' ? 'Buy' : 
                   jaData.summary.evaluation === '売り' ? 'Sell' : 'Neutral',
        score: jaData.summary.score,
        headline: `[EN] ${jaData.summary.headline}`,
        text: `[EN] ${jaData.summary.text}`
      }
      // 他のフィールドも同様に変換
    };
  }
}

// 実行
if (require.main === module) {
  const automation = new EnhancedMarketAnalysisAutomation();
  automation.run().catch(console.error);
}

module.exports = EnhancedMarketAnalysisAutomation;