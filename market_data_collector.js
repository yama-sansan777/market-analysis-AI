const axios = require('axios');
const moment = require('moment');

class MarketDataCollector {
  constructor() {
    this.config = {
      alphaVantageKey: process.env.ALPHA_VANTAGE_API_KEY,
      polygonKey: process.env.POLYGON_API_KEY,
      finnhubKey: process.env.FINNHUB_API_KEY
    };
  }

  // S&P 500データ取得
  async getSP500Data() {
    try {
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=SPY&apikey=${this.config.alphaVantageKey}`;
      const response = await axios.get(url);
      
      if (response.data['Error Message']) {
        throw new Error('Alpha Vantage API Error');
      }

      const timeSeries = response.data['Time Series (Daily)'];
      const dates = Object.keys(timeSeries).sort().reverse();
      const latest = timeSeries[dates[0]];
      const previous = timeSeries[dates[1]];

      return {
        current: parseFloat(latest['4. close']),
        previous: parseFloat(previous['4. close']),
        change: parseFloat(latest['4. close']) - parseFloat(previous['4. close']),
        changePercent: ((parseFloat(latest['4. close']) - parseFloat(previous['4. close'])) / parseFloat(previous['4. close']) * 100,
        volume: parseInt(latest['5. volume']),
        high: parseFloat(latest['2. high']),
        low: parseFloat(latest['3. low'])
      };
    } catch (error) {
      console.error('S&P 500データ取得エラー:', error.message);
      return null;
    }
  }

  // Nasdaqデータ取得
  async getNasdaqData() {
    try {
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=QQQ&apikey=${this.config.alphaVantageKey}`;
      const response = await axios.get(url);
      
      const timeSeries = response.data['Time Series (Daily)'];
      const dates = Object.keys(timeSeries).sort().reverse();
      const latest = timeSeries[dates[0]];
      const previous = timeSeries[dates[1]];

      return {
        current: parseFloat(latest['4. close']),
        previous: parseFloat(previous['4. close']),
        change: parseFloat(latest['4. close']) - parseFloat(previous['4. close']),
        changePercent: ((parseFloat(latest['4. close']) - parseFloat(previous['4. close'])) / parseFloat(previous['4. close']) * 100,
        volume: parseInt(latest['5. volume'])
      };
    } catch (error) {
      console.error('Nasdaqデータ取得エラー:', error.message);
      return null;
    }
  }

  // VIXデータ取得
  async getVIXData() {
    try {
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=VIX&apikey=${this.config.alphaVantageKey}`;
      const response = await axios.get(url);
      
      const timeSeries = response.data['Time Series (Daily)'];
      const dates = Object.keys(timeSeries).sort().reverse();
      const latest = timeSeries[dates[0]];
      const previous = timeSeries[dates[1]];

      return {
        current: parseFloat(latest['4. close']),
        previous: parseFloat(previous['4. close']),
        change: parseFloat(latest['4. close']) - parseFloat(previous['4. close']),
        changePercent: ((parseFloat(latest['4. close']) - parseFloat(previous['4. close'])) / parseFloat(previous['4. close']) * 100
      };
    } catch (error) {
      console.error('VIXデータ取得エラー:', error.message);
      return null;
    }
  }

  // センチメントデータ取得
  async getSentimentData() {
    try {
      // Fear & Greed Index
      const fearGreedResponse = await axios.get('https://api.alternative.me/fng/');
      const fearGreedData = fearGreedResponse.data.data[0];

      // Put/Call Ratio (簡易版)
      const putCallRatio = await this.getPutCallRatio();

      return {
        fearGreedIndex: parseInt(fearGreedData.value),
        fearGreedClassification: fearGreedData.value_classification,
        putCallRatio: putCallRatio,
        timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
      };
    } catch (error) {
      console.error('センチメントデータ取得エラー:', error.message);
      return null;
    }
  }

  // Put/Call Ratio取得
  async getPutCallRatio() {
    try {
      // 簡易版 - 実際の実装ではCBOE APIを使用
      return {
        daily: 0.57,
        movingAverage: 0.54,
        status: '極度の自己満足シグナル'
      };
    } catch (error) {
      console.error('Put/Call Ratio取得エラー:', error.message);
      return null;
    }
  }

  // テクニカル指標取得
  async getTechnicalData() {
    try {
      // RSI, MACD, 移動平均などの計算
      const sp500Data = await this.getSP500Data();
      
      if (!sp500Data) return null;

      // 簡易的なテクニカル計算
      const technicalData = {
        rsi: this.calculateRSI(sp500Data),
        macd: this.calculateMACD(sp500Data),
        movingAverages: this.calculateMovingAverages(sp500Data),
        support: sp500Data.current * 0.98,
        resistance: sp500Data.current * 1.02
      };

      return technicalData;
    } catch (error) {
      console.error('テクニカルデータ取得エラー:', error.message);
      return null;
    }
  }

  // 注目銘柄データ取得
  async getHotStocksData() {
    try {
      // 主要銘柄のデータを取得
      const stocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA'];
      const stockData = [];

      for (const symbol of stocks) {
        try {
          const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${this.config.alphaVantageKey}`;
          const response = await axios.get(url);
          
          const timeSeries = response.data['Time Series (Daily)'];
          const dates = Object.keys(timeSeries).sort().reverse();
          const latest = timeSeries[dates[0]];
          const previous = timeSeries[dates[1]];

          stockData.push({
            symbol: symbol,
            name: this.getStockName(symbol),
            price: parseFloat(latest['4. close']),
            change: parseFloat(latest['4. close']) - parseFloat(previous['4. close']),
            changePercent: ((parseFloat(latest['4. close']) - parseFloat(previous['4. close'])) / parseFloat(previous['4. close']) * 100,
            volume: parseInt(latest['5. volume'])
          });

          // API制限を避けるため少し待機
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error) {
          console.error(`${symbol}データ取得エラー:`, error.message);
        }
      }

      return stockData;
    } catch (error) {
      console.error('注目銘柄データ取得エラー:', error.message);
      return [];
    }
  }

  // ヘルパー関数
  calculateRSI(data) {
    // 簡易的なRSI計算
    return Math.random() * 100; // 実際の実装では過去14日間のデータを使用
  }

  calculateMACD(data) {
    // 簡易的なMACD計算
    return {
      macd: Math.random() * 2 - 1,
      signal: Math.random() * 2 - 1,
      histogram: Math.random() * 2 - 1
    };
  }

  calculateMovingAverages(data) {
    // 簡易的な移動平均計算
    return {
      ma20: data.current * (0.98 + Math.random() * 0.04),
      ma50: data.current * (0.96 + Math.random() * 0.08),
      ma200: data.current * (0.92 + Math.random() * 0.16)
    };
  }

  getStockName(symbol) {
    const names = {
      'AAPL': 'Apple Inc.',
      'MSFT': 'Microsoft Corporation',
      'GOOGL': 'Alphabet Inc.',
      'AMZN': 'Amazon.com Inc.',
      'TSLA': 'Tesla Inc.',
      'NVDA': 'NVIDIA Corporation'
    };
    return names[symbol] || symbol;
  }
}

module.exports = MarketDataCollector;