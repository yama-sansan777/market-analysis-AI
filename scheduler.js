const cron = require('node-cron');
const { exec } = require('child_process');
const { runFullAnalysis } = require('./auto_market_analysis.js');

console.log('🚀 スケジューラーが起動しました。');
console.log('毎日、日本時間の午前8時に市場分析を自動実行します。');
console.log('このウィンドウを閉じるとスケジューラーは停止します。');

// GitHubに変更をプッシュする関数
function pushToGitHub() {
    return new Promise((resolve, reject) => {
        console.log('📤 GitHubに変更をプッシュしています...');
        
        // Git操作を順次実行
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const gitCommands = [
            'git add live_data/ archive_data/',
            `git commit -m "Update market analysis data - ${timestamp}"`,
            'git push origin main'
        ];
        
        const executeCommand = (command, index = 0) => {
            if (index >= gitCommands.length) {
                console.log('✅ GitHubプッシュが完了しました');
                resolve();
                return;
            }
            
            exec(gitCommands[index], (error, stdout, stderr) => {
                if (error) {
                    console.error(`❌ Git操作エラー (${gitCommands[index]}):`, error);
                    reject(error);
                    return;
                }
                console.log(`✓ ${gitCommands[index]} 完了`);
                if (stdout) console.log(stdout);
                executeCommand(command, index + 1);
            });
        };
        
        executeCommand();
    });
}

// 市場分析の実行とGitHubプッシュを行う関数
async function runAnalysisAndPush() {
    try {
        console.log(`[SCHEDULE] 定時実行タスクを開始します: ${new Date().toLocaleString()}`);
        
        // 1. 市場分析を実行（JSONデータ更新）
        await runFullAnalysis();
        
        // 2. GitHubにデータをプッシュ（サイトビルドはGitHub Actionsが自動実行）
        await pushToGitHub();
        
        console.log('✅ すべてのタスクが完了しました');
        console.log('🔄 GitHub Actionsがサイトビルドとデプロイを自動実行します');
    } catch (error) {
        console.error('❌ タスク実行中にエラーが発生しました:', error);
    }
}

// Cronジョブのスケジュール設定
// 日本時間の月曜日から金曜日の毎朝8:00に実行
// 書式: '分 時 日 月 曜日'
cron.schedule('0 8 * * 1-5', runAnalysisAndPush, {
    scheduled: true,
    timezone: "Asia/Tokyo"
});