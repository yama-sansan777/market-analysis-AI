const cron = require('node-cron');
const { exec } = require('child_process');
const { runFullAnalysis } = require('./auto_market_analysis.js');

console.log('🚀 スケジューラーが起動しました。');
console.log('毎日、日本時間の午前8時に市場分析を自動実行します。');
console.log('このウィンドウを閉じるとスケジューラーは停止します。');

// Eleventy サイトをリビルドする関数
function rebuildSite() {
    return new Promise((resolve, reject) => {
        console.log('🔨 Eleventyサイトをリビルドしています...');
        exec('npm run build', (error, stdout, stderr) => {
            if (error) {
                console.error('❌ Eleventyビルドエラー:', error);
                reject(error);
                return;
            }
            console.log('✅ Eleventyサイトのリビルドが完了しました');
            console.log(stdout);
            resolve();
        });
    });
}

// 市場分析の実行とサイトリビルドを行う関数
async function runAnalysisAndRebuild() {
    try {
        console.log(`[SCHEDULE] 定時実行タスクを開始します: ${new Date().toLocaleString()}`);
        
        // 1. 市場分析を実行
        await runFullAnalysis();
        
        // 2. Eleventyサイトをリビルド
        await rebuildSite();
        
        console.log('✅ すべてのタスクが完了しました');
    } catch (error) {
        console.error('❌ タスク実行中にエラーが発生しました:', error);
    }
}

// Cronジョブのスケジュール設定
// 日本時間の月曜日から金曜日の毎朝8:00に実行
// 書式: '分 時 日 月 曜日'
cron.schedule('0 8 * * 1-5', runAnalysisAndRebuild, {
    scheduled: true,
    timezone: "Asia/Tokyo"
});