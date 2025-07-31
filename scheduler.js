const cron = require('node-cron');
const { runFullAnalysis } = require('./auto_market_analysis.js');

console.log('🚀 スケジューラーが起動しました。');
console.log('毎日、日本時間の午前8時に市場分析を自動実行します。');
console.log('このウィンドウを閉じるとスケジューラーは停止します。');

// Cronジョブのスケジュール設定
// 日本時間の月曜日から金曜日の毎朝8:00に実行
// 書式: '分 時 日 月 曜日'
cron.schedule('0 8 * * 1-5', () => {
    console.log(`[SCHEDULE] 定時実行タスクを開始します: ${new Date().toLocaleString()}`);
    runFullAnalysis();
}, {
    scheduled: true,
    timezone: "Asia/Tokyo"
});