require('dotenv').config();
const axios = require('axios');

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

// S&P 500の最新の終値を取得する関数
async function getSP500Data() {
    console.log('[INFO] S&P 500のデータを取得中...');
    try {
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=SPY&apikey=${ALPHA_VANTAGE_API_KEY}&outputsize=compact`;
        const response = await axios.get(url);
        
        // 最新の日付のデータを取得
        const timeSeries = response.data['Time Series (Daily)'];
        if (!timeSeries) {
            throw new Error('Alpha Vantageから有効な時系列データが取得できませんでした。APIキーやAPIの制限を確認してください。');
        }
        const latestDate = Object.keys(timeSeries)[0];
        const latestData = timeSeries[latestDate];

        console.log(`[SUCCESS] S&P 500のデータを取得しました (日付: ${latestDate})`);
        return {
            date: latestDate,
            close: latestData['4. close'],
        };
    } catch (error) {
        console.error('[ERROR] S&P 500データの取得に失敗しました:', error.message);
        return null;
    }
}

// Fear & Greed Indexを取得する関数（外部サイトから取得）
async function getFearAndGreedIndex() {
    console.log('[INFO] Fear & Greed Indexを取得中...');
    try {
        // 注: このAPIは非公式で、変更される可能性があります。
        const response = await axios.get('https://api.alternative.me/fng/?limit=1');
        const fngValue = response.data.data[0].value;
        console.log(`[SUCCESS] Fear & Greed Indexを取得しました (値: ${fngValue})`);
        return fngValue;
    } catch (error) {
        console.error('[ERROR] Fear & Greed Indexの取得に失敗しました:', error.message);
        return null;
    }
}

// すべての市場データを収集するメイン関数
async function collectAllMarketData() {
    console.log('----------');
    console.log('[STEP 1] 市場データの収集を開始します。');
    const sp500 = await getSP500Data();
    const fearAndGreed = await getFearAndGreedIndex();
    
    if (!sp500 || !fearAndGreed) {
        console.error('[FATAL] データ収集に失敗したため、処理を中断します。');
        return null;
    }

    return {
        sp500_price: sp500.close,
        sp500_date: sp500.date,
        fear_and_greed_index: fearAndGreed,
    };
}

module.exports = { collectAllMarketData };