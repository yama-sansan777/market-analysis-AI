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

// CNN Fear & Greed Index (株式市場)を取得する関数
async function getFearAndGreedIndex() {
    console.log('[INFO] CNN Fear & Greed Index (株式市場)を取得中...');
    try {
        // feargreedmeter.comから株式市場のFear & Greed Indexを取得
        const response = await axios.get('https://feargreedmeter.com/');
        const htmlContent = response.data;
        
        // HTMLから値を抽出（メインページに表示されている値）
        const valueMatch = htmlContent.match(/<div class="text-center text-4xl font-semibold mb-1 text-white">(\d+)<\/div>/);
        
        if (valueMatch && valueMatch[1]) {
            const fngValue = parseInt(valueMatch[1]);
            console.log(`[SUCCESS] CNN Fear & Greed Index (株式市場)を取得しました (値: ${fngValue})`);
            return fngValue;
        } else {
            throw new Error('HTMLから値を抽出できませんでした');
        }
    } catch (error) {
        console.error('[ERROR] CNN Fear & Greed Index取得に失敗しました:', error.message);
        console.log('[FALLBACK] デフォルト値58を使用します');
        return 58; // フォールバック値として実際の値を使用
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