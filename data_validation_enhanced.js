const fs = require('fs');
const path = require('path');
const axios = require('axios');

class DataValidationEnhanced {
  constructor() {
    this.validationRules = {
      price: {
        min: 0.01,
        max: 100000,
        decimalPlaces: 2
      },
      percentage: {
        min: -100,
        max: 1000,
        decimalPlaces: 2
      },
      volume: {
        min: 0,
        max: 1000000000000
      },
      date: {
        format: 'YYYY-MM-DD',
        maxAge: 7 // 7日以内
      }
    };
    
    this.referenceData = {
      stockPrices: {},
      bondYields: {},
      indices: {}
    };
  }

  // メインデータ検証
  async validateArticleData(articleData) {
    console.log('🔍 記事データの詳細検証を開始...');
    
    const validationResults = {
      overall: 'valid',
      errors: [],
      warnings: [],
      corrections: []
    };

    try {
      // 1. 価格データの検証
      await this.validatePriceData(articleData, validationResults);
      
      // 2. 市場指標の検証
      await this.validateMarketIndicators(articleData, validationResults);
      
      // 3. 数値データの妥当性チェック
      this.validateNumericalData(articleData, validationResults);
      
      // 4. 日付データの検証
      this.validateDateData(articleData, validationResults);
      
      // 5. テキストデータの品質チェック
      this.validateTextQuality(articleData, validationResults);

      // 結果の集計
      if (validationResults.errors.length > 0) {
        validationResults.overall = 'invalid';
      } else if (validationResults.warnings.length > 0) {
        validationResults.overall = 'warning';
      }

      console.log(`✅ 検証完了: ${validationResults.overall}`);
      return validationResults;

    } catch (error) {
      console.error('❌ データ検証エラー:', error);
      validationResults.overall = 'error';
      validationResults.errors.push({
        type: 'VALIDATION_ERROR',
        message: error.message
      });
      return validationResults;
    }
  }

  // 価格データの検証
  async validatePriceData(articleData, results) {
    console.log('💰 価格データを検証中...');
    
    // 注目銘柄の価格検証
    if (articleData.languages?.ja?.hotStocks) {
      for (const stock of articleData.languages.ja.hotStocks) {
        const priceValidation = await this.validateStockPrice(stock);
        if (!priceValidation.isValid) {
          results.errors.push({
            type: 'INVALID_PRICE',
            field: `hotStocks.${stock.name}.price`,
            current: stock.price,
            expected: priceValidation.expected,
            message: priceValidation.message
          });
        }
      }
    }

    // 市場概況の価格検証
    if (articleData.languages?.ja?.marketOverview) {
      for (const market of articleData.languages.ja.marketOverview) {
        const priceValidation = await this.validateMarketPrice(market);
        if (!priceValidation.isValid) {
          results.warnings.push({
            type: 'PRICE_WARNING',
            field: `marketOverview.${market.name}.value`,
            current: market.value,
            expected: priceValidation.expected,
            message: priceValidation.message
          });
        }
      }
    }
  }

  // 個別銘柄の価格検証
  async validateStockPrice(stock) {
    try {
      // 現在価格の取得（Alpha Vantage API使用）
      const currentPrice = await this.getCurrentStockPrice(stock.name);
      
      if (!currentPrice) {
        return {
          isValid: false,
          expected: 'N/A',
          message: '現在価格が取得できません'
        };
      }

      // 価格の妥当性チェック
      const price = this.extractPriceFromText(stock.price);
      if (!price) {
        return {
          isValid: false,
          expected: `$${currentPrice.toFixed(2)}`,
          message: '価格形式が不正です'
        };
      }

      // 価格差の計算
      const priceDiff = Math.abs(price - currentPrice);
      const priceDiffPercent = (priceDiff / currentPrice) * 100;

      if (priceDiffPercent > 5) { // 5%以上の差がある場合
        return {
          isValid: false,
          expected: `$${currentPrice.toFixed(2)}`,
          message: `価格差が大きすぎます (差: ${priceDiffPercent.toFixed(1)}%)`
        };
      }

      return {
        isValid: true,
        expected: `$${currentPrice.toFixed(2)}`,
        message: '価格は妥当です'
      };

    } catch (error) {
      return {
        isValid: false,
        expected: 'N/A',
        message: `価格検証エラー: ${error.message}`
      };
    }
  }

  // 市場指標の価格検証
  async validateMarketPrice(market) {
    try {
      let expectedValue = null;
      
      switch (market.name) {
        case 'S&P 500':
          expectedValue = await this.getSP500Price();
          break;
        case 'NASDAQ':
          expectedValue = await this.getNasdaqPrice();
          break;
        case '10年債利回り':
          expectedValue = await this.get10YearBondYield();
          break;
        default:
          return { isValid: true, expected: 'N/A', message: '検証対象外' };
      }

      if (!expectedValue) {
        return {
          isValid: false,
          expected: 'N/A',
          message: '現在値が取得できません'
        };
      }

      const currentValue = this.extractNumberFromText(market.value);
      if (currentValue === null) {
        return {
          isValid: false,
          expected: expectedValue,
          message: '数値形式が不正です'
        };
      }

      // 市場指標の妥当性チェック
      const validation = this.validateMarketIndicator(market.name, currentValue, expectedValue);
      
      return {
        isValid: validation.isValid,
        expected: validation.expected,
        message: validation.message
      };

    } catch (error) {
      return {
        isValid: false,
        expected: 'N/A',
        message: `検証エラー: ${error.message}`
      };
    }
  }

  // 市場指標の妥当性チェック
  validateMarketIndicator(name, current, expected) {
    let tolerance = 0;
    
    switch (name) {
      case 'S&P 500':
        tolerance = 50; // ±50ポイント
        break;
      case 'NASDAQ':
        tolerance = 100; // ±100ポイント
        break;
      case '10年債利回り':
        tolerance = 0.5; // ±0.5%
        break;
      default:
        tolerance = expected * 0.1; // 10%
    }

    const diff = Math.abs(current - expected);
    
    if (diff > tolerance) {
      return {
        isValid: false,
        expected: expected,
        message: `値が期待範囲を超えています (差: ${diff.toFixed(2)})`
      };
    }

    return {
      isValid: true,
      expected: expected,
      message: '値は妥当です'
    };
  }

  // 数値データの妥当性チェック
  validateNumericalData(articleData, results) {
    console.log('📊 数値データを検証中...');
    
    // スコアの検証
    if (articleData.languages?.ja?.summary?.score) {
      const score = articleData.languages.ja.summary.score;
      if (score < 1 || score > 10) {
        results.errors.push({
          type: 'INVALID_SCORE',
          field: 'summary.score',
          current: score,
          expected: '1-10の範囲',
          message: 'スコアは1-10の範囲内である必要があります'
        });
      }
    }

    // 市場の広がりの検証
    if (articleData.languages?.ja?.dashboard?.breadth) {
      const breadth = articleData.languages.ja.dashboard.breadth;
      
      if (breadth.advancers < 0 || breadth.decliners < 0) {
        results.errors.push({
          type: 'INVALID_BREADTH',
          field: 'dashboard.breadth',
          current: { advancers: breadth.advancers, decliners: breadth.decliners },
          expected: '0以上の値',
          message: '上昇・下落銘柄数は0以上である必要があります'
        });
      }
    }

    // センチメント指数の検証
    if (articleData.languages?.ja?.dashboard?.sentimentVI) {
      const sentiment = articleData.languages.ja.dashboard.sentimentVI;
      if (sentiment < 0 || sentiment > 100) {
        results.errors.push({
          type: 'INVALID_SENTIMENT',
          field: 'dashboard.sentimentVI',
          current: sentiment,
          expected: '0-100の範囲',
          message: 'センチメント指数は0-100の範囲内である必要があります'
        });
      }
    }
  }

  // 日付データの検証
  validateDateData(articleData, results) {
    console.log('📅 日付データを検証中...');
    
    const today = new Date();
    const articleDate = new Date(articleData.date);
    
    if (isNaN(articleDate.getTime())) {
      results.errors.push({
        type: 'INVALID_DATE',
        field: 'date',
        current: articleData.date,
        expected: '有効な日付形式',
        message: '日付形式が不正です'
      });
      return;
    }

    const daysDiff = Math.abs(today - articleDate) / (1000 * 60 * 60 * 24);
    
    if (daysDiff > 7) {
      results.warnings.push({
        type: 'OLD_DATE',
        field: 'date',
        current: articleData.date,
        expected: '7日以内の日付',
        message: '記事の日付が古すぎます'
      });
    }
  }

  // テキストデータの品質チェック
  validateTextQuality(articleData, results) {
    console.log('📝 テキスト品質を検証中...');
    
    // ヘッドラインの長さチェック
    if (articleData.languages?.ja?.summary?.headline) {
      const headline = articleData.languages.ja.summary.headline;
      if (headline.length < 10 || headline.length > 100) {
        results.warnings.push({
          type: 'HEADLINE_LENGTH',
          field: 'summary.headline',
          current: headline.length,
          expected: '10-100文字',
          message: 'ヘッドラインの長さが適切ではありません'
        });
      }
    }

    // 本文の長さチェック
    if (articleData.languages?.ja?.summary?.text) {
      const text = articleData.languages.ja.summary.text;
      if (text.length < 100 || text.length > 2000) {
        results.warnings.push({
          type: 'TEXT_LENGTH',
          field: 'summary.text',
          current: text.length,
          expected: '100-2000文字',
          message: '本文の長さが適切ではありません'
        });
      }
    }

    // 重複テキストのチェック
    this.checkDuplicateText(articleData, results);
  }

  // 重複テキストのチェック
  checkDuplicateText(articleData, results) {
    const textFields = [
      articleData.languages?.ja?.summary?.headline,
      articleData.languages?.ja?.summary?.text,
      articleData.languages?.ja?.dashboard?.breadth?.summary,
      articleData.languages?.ja?.dashboard?.sentimentVISummary
    ].filter(Boolean);

    const duplicates = this.findDuplicateText(textFields);
    
    if (duplicates.length > 0) {
      results.warnings.push({
        type: 'DUPLICATE_TEXT',
        field: 'multiple',
        current: duplicates,
        expected: 'ユニークなテキスト',
        message: '重複するテキストが検出されました'
      });
    }
  }

  // 重複テキストの検出
  findDuplicateText(texts) {
    const duplicates = [];
    const seen = new Set();
    
    for (const text of texts) {
      const normalized = text.toLowerCase().trim();
      if (seen.has(normalized)) {
        duplicates.push(text);
      } else {
        seen.add(normalized);
      }
    }
    
    return duplicates;
  }

  // 価格テキストから数値を抽出
  extractPriceFromText(priceText) {
    if (!priceText) return null;
    
    // $450, 450$, ¥450, 450円 などの形式から数値を抽出
    const match = priceText.match(/[\$¥]?(\d+(?:\.\d{1,2})?)/);
    return match ? parseFloat(match[1]) : null;
  }

  // テキストから数値を抽出
  extractNumberFromText(text) {
    if (!text) return null;
    
    // 数値のみを抽出
    const match = text.match(/(\d+(?:\.\d{1,2})?)/);
    return match ? parseFloat(match[1]) : null;
  }

  // 現在の株価を取得
  async getCurrentStockPrice(symbol) {
    try {
      // シンボルの正規化
      const normalizedSymbol = this.normalizeStockSymbol(symbol);
      
      // Alpha Vantage APIから現在価格を取得
      const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${normalizedSymbol}&apikey=${apiKey}`;
      
      const response = await axios.get(url);
      const data = response.data;
      
      if (data['Global Quote'] && data['Global Quote']['05. price']) {
        return parseFloat(data['Global Quote']['05. price']);
      }
      
      return null;
    } catch (error) {
      console.error(`株価取得エラー (${symbol}):`, error.message);
      return null;
    }
  }

  // 株価シンボルの正規化
  normalizeStockSymbol(symbol) {
    // 日本語名から英語シンボルへの変換
    const symbolMap = {
      'NVIDIA': 'NVDA',
      'Apple': 'AAPL',
      'Microsoft': 'MSFT',
      'Google': 'GOOGL',
      'Amazon': 'AMZN',
      'Tesla': 'TSLA',
      'Meta': 'META',
      'Netflix': 'NFLX'
    };
    
    return symbolMap[symbol] || symbol;
  }

  // S&P 500価格を取得
  async getSP500Price() {
    try {
      const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=SPY&apikey=${apiKey}`;
      
      const response = await axios.get(url);
      const data = response.data;
      
      if (data['Global Quote'] && data['Global Quote']['05. price']) {
        return parseFloat(data['Global Quote']['05. price']);
      }
      
      return null;
    } catch (error) {
      console.error('S&P 500価格取得エラー:', error.message);
      return null;
    }
  }

  // NASDAQ価格を取得
  async getNasdaqPrice() {
    try {
      const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=QQQ&apikey=${apiKey}`;
      
      const response = await axios.get(url);
      const data = response.data;
      
      if (data['Global Quote'] && data['Global Quote']['05. price']) {
        return parseFloat(data['Global Quote']['05. price']);
      }
      
      return null;
    } catch (error) {
      console.error('NASDAQ価格取得エラー:', error.message);
      return null;
    }
  }

  // 10年債利回りを取得
  async get10YearBondYield() {
    try {
      const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
      const url = `https://www.alphavantage.co/query?function=TREASURY_YIELD&interval=daily&maturity=10year&apikey=${apiKey}`;
      
      const response = await axios.get(url);
      const data = response.data;
      
      if (data.data && data.data.length > 0) {
        return parseFloat(data.data[0].value);
      }
      
      return null;
    } catch (error) {
      console.error('10年債利回り取得エラー:', error.message);
      return null;
    }
  }

  // 検証結果のレポート生成
  generateValidationReport(validationResults) {
    console.log('📋 検証レポートを生成中...');
    
    const report = {
      timestamp: new Date().toISOString(),
      overall: validationResults.overall,
      summary: {
        totalErrors: validationResults.errors.length,
        totalWarnings: validationResults.warnings.length,
        totalCorrections: validationResults.corrections.length
      },
      details: {
        errors: validationResults.errors,
        warnings: validationResults.warnings,
        corrections: validationResults.corrections
      },
      recommendations: this.generateRecommendations(validationResults)
    };
    
    // レポートファイルに保存
    const reportPath = './logs/validation_report.json';
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('✅ 検証レポート生成完了');
    return report;
  }

  // 推奨事項の生成
  generateRecommendations(validationResults) {
    const recommendations = [];
    
    if (validationResults.errors.length > 0) {
      recommendations.push({
        priority: 'high',
        action: 'エラーの修正',
        description: `${validationResults.errors.length}件のエラーを修正してください`
      });
    }
    
    if (validationResults.warnings.length > 0) {
      recommendations.push({
        priority: 'medium',
        action: '警告の確認',
        description: `${validationResults.warnings.length}件の警告を確認してください`
      });
    }
    
    if (validationResults.errors.some(e => e.type === 'INVALID_PRICE')) {
      recommendations.push({
        priority: 'high',
        action: '価格データの再取得',
        description: 'APIから最新の価格データを再取得してください'
      });
    }
    
    return recommendations;
  }
}

module.exports = DataValidationEnhanced;
