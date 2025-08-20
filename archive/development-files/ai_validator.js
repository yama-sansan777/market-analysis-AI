const fs = require('fs');
const path = require('path');
const { z } = require('zod');

class AIValidator {
  constructor() {
    this.schema = this.createValidationSchema();
    this.maxRetries = 3;
    this.fallbackDataPath = './fallback_data.json';
  }

  // バリデーションスキーマ定義
  createValidationSchema() {
    return z.object({
      session: z.string().min(1),
      date: z.string().min(1),
      summary: z.object({
        evaluation: z.enum(['買い', '売り', '中立']),
        score: z.number().min(1).max(10),
        headline: z.string().min(1),
        text: z.string().min(50)
      }),
      dashboard: z.object({
        breadth: z.object({
          advancers: z.number(),
          decliners: z.number(),
          summary: z.string()
        }),
        sentimentVI: z.number(),
        sentimentVISummary: z.string(),
        priceLevels: z.object({
          resistance: z.object({
            value: z.string(),
            description: z.string()
          }),
          support: z.object({
            value: z.string(),
            description: z.string()
          })
        }),
        putCallRatio: z.object({
          dailyValue: z.string(),
          movingAverage: z.string(),
          status: z.string(),
          summary: z.string()
        })
      }),
      details: z.object({
        internals: z.object({
          headline: z.string(),
          text: z.string(),
          chartData: z.object({
            labels: z.array(z.string()),
            values: z.array(z.number())
          })
        }),
        technicals: z.object({
          headline: z.string(),
          text: z.string(),
          chartData: z.object({
            labels: z.array(z.string()),
            sp500: z.array(z.number()),
            ma50: z.array(z.number()),
            adl: z.array(z.number())
          })
        }),
        fundamentals: z.object({
          headline: z.string(),
          text: z.string(),
          vix: z.object({
            value: z.number(),
            change: z.string(),
            summary: z.string()
          }),
          aaiiSurvey: z.object({
            date: z.string(),
            bullish: z.number(),
            neutral: z.number(),
            bearish: z.number(),
            summary: z.string()
          }),
          investorsIntelligence: z.object({
            date: z.string(),
            bullish: z.number(),
            bearish: z.number(),
            correction: z.number(),
            summary: z.string()
          }),
          points: z.array(z.string())
        }),
        strategy: z.object({
          headline: z.string(),
          basic: z.string(),
          risk: z.string()
        })
      }),
      marketOverview: z.array(z.object({
        name: z.string(),
        value: z.string(),
        change: z.string(),
        isDown: z.boolean()
      })),
      hotStocks: z.array(z.object({
        name: z.string(),
        price: z.string(),
        description: z.string(),
        isDown: z.boolean()
      }))
    });
  }

  // AI応答の検証
  async validateAIResponse(response, retryCount = 0) {
    try {
      console.log(`🔍 AI応答検証中... (試行 ${retryCount + 1}/${this.maxRetries})`);
      
      // JSON解析
      let parsedResponse;
      try {
        parsedResponse = this.extractJSONFromResponse(response);
      } catch (error) {
        throw new Error(`JSON解析エラー: ${error.message}`);
      }

      // スキーマ検証
      const validatedData = this.schema.parse(parsedResponse);
      
      console.log('✅ AI応答検証成功');
      return {
        success: true,
        data: validatedData
      };

    } catch (error) {
      console.error(`❌ AI応答検証失敗: ${error.message}`);
      
      // 再試行ロジック
      if (retryCount < this.maxRetries - 1) {
        console.log(`🔄 再試行中... (${retryCount + 1}/${this.maxRetries})`);
        return {
          success: false,
          shouldRetry: true,
          error: error.message
        };
      } else {
        console.error('❌ 最大再試行回数に達しました');
        return {
          success: false,
          shouldRetry: false,
          error: error.message
        };
      }
    }
  }

  // レスポンスからJSONを抽出
  extractJSONFromResponse(response) {
    // マークダウンのコードブロックを除去
    let cleanedResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // 前後の空白を除去
    cleanedResponse = cleanedResponse.trim();
    
    // JSON解析
    try {
      return JSON.parse(cleanedResponse);
    } catch (error) {
      // JSONが見つからない場合、レスポンス全体を解析
      throw new Error('有効なJSONが見つかりません');
    }
  }

  // フォールバックデータの読み込み
  loadFallbackData() {
    try {
      if (fs.existsSync(this.fallbackDataPath)) {
        const fallbackData = JSON.parse(fs.readFileSync(this.fallbackDataPath, 'utf8'));
        console.log('🔄 フォールバックデータを使用');
        return fallbackData;
      }
    } catch (error) {
      console.error('フォールバックデータ読み込みエラー:', error);
    }
    
    // デフォルトのフォールバックデータ
    return this.createDefaultFallbackData();
  }

  // デフォルトフォールバックデータ作成
  createDefaultFallbackData() {
    const today = new Date();
    const dateStr = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
    
    return {
      session: `${dateStr} 市場分析`,
      date: dateStr,
      summary: {
        evaluation: "中立",
        score: 5,
        headline: "データ取得エラーにより分析を一時停止",
        text: "市場データの取得に問題が発生しました。システム管理者に連絡してください。"
      },
      dashboard: {
        breadth: {
          advancers: 0,
          decliners: 0,
          summary: "データ取得エラー"
        },
        sentimentVI: 50,
        sentimentVISummary: "データ取得エラー",
        priceLevels: {
          resistance: {
            value: "N/A",
            description: "データ取得エラー"
          },
          support: {
            value: "N/A",
            description: "データ取得エラー"
          }
        },
        putCallRatio: {
          dailyValue: "N/A",
          movingAverage: "N/A",
          status: "データ取得エラー",
          summary: "データ取得エラー"
        }
      },
      details: {
        internals: {
          headline: "データ取得エラー",
          text: "市場データの取得に問題が発生しました。",
          chartData: {
            labels: [],
            values: []
          }
        },
        technicals: {
          headline: "データ取得エラー",
          text: "テクニカルデータの取得に問題が発生しました。",
          chartData: {
            labels: [],
            sp500: [],
            ma50: [],
            adl: []
          }
        },
        fundamentals: {
          headline: "データ取得エラー",
          text: "ファンダメンタルデータの取得に問題が発生しました。",
          vix: {
            value: 0,
            change: "N/A",
            summary: "データ取得エラー"
          },
          aaiiSurvey: {
            date: "N/A",
            bullish: 0,
            neutral: 0,
            bearish: 0,
            summary: "データ取得エラー"
          },
          investorsIntelligence: {
            date: "N/A",
            bullish: 0,
            bearish: 0,
            correction: 0,
            summary: "データ取得エラー"
          },
          points: ["データ取得エラーが発生しました"]
        },
        strategy: {
          headline: "データ取得エラー",
          basic: "データ取得エラーにより戦略提案を一時停止しています。",
          risk: "データ取得エラーによりリスク分析を一時停止しています。"
        }
      },
      marketOverview: [
        {
          name: "S&P 500",
          value: "N/A",
          change: "N/A",
          isDown: false
        }
      ],
      hotStocks: [
        {
          name: "データ取得エラー",
          price: "N/A",
          description: "データ取得エラーにより情報を表示できません",
          isDown: false
        }
      ]
    };
  }

  // エラー通知
  async sendErrorNotification(error, context) {
    console.error('🚨 エラー通知:', {
      error: error,
      context: context,
      timestamp: new Date().toISOString()
    });
    
    // 実際の実装では、Slack、メール、Discord等に通知
    // ここではログファイルに記録
    const logEntry = {
      timestamp: new Date().toISOString(),
      error: error,
      context: context
    };
    
    const logPath = './logs/ai_errors.json';
    const logs = fs.existsSync(logPath) 
      ? JSON.parse(fs.readFileSync(logPath, 'utf8')) 
      : [];
    
    logs.push(logEntry);
    fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));
  }
}

module.exports = AIValidator;