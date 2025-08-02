const cron = require('node-cron');
const { exec } = require('child_process');
const { runFullAnalysis } = require('./auto_market_analysis.js');
const winston = require('winston');

// ログ設定
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}] ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/scheduler.log' })
    ]
});

logger.info('🚀 Deep Research スケジューラーが起動しました。');
logger.info('市場開放時間に合わせてDeep Research分析を自動実行します:');
logger.info('  📅 平日 午前9:30 (米国市場開場直後)');
logger.info('  📅 平日 午後6:00 (米国市場終了後)');
logger.info('PM2またはターミナルを終了するとスケジューラーは停止します。');

// GitHubに変更をプッシュする関数
function pushToGitHub() {
    return new Promise((resolve, reject) => {
        logger.info('📤 GitHubにDeep Research結果をプッシュしています...');
        
        // Git操作を順次実行
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const gitCommands = [
            'git add live_data/ archive_data/',
            `git commit -m "Deep Research: Auto-update market analysis data - ${timestamp}"`,
            'git push origin main'
        ];
        
        const executeCommand = (command, index = 0) => {
            if (index >= gitCommands.length) {
                logger.info('✅ GitHubプッシュが完了しました');
                resolve();
                return;
            }
            
            exec(gitCommands[index], { timeout: 30000 }, (error, stdout, stderr) => {
                if (error) {
                    logger.error(`❌ Git操作エラー (${gitCommands[index]}):`, error.message);
                    if (error.code === 'ETIMEDOUT') {
                        logger.error('Git操作がタイムアウトしました。ネットワーク接続を確認してください。');
                    }
                    reject(error);
                    return;
                }
                logger.info(`✓ ${gitCommands[index]} 完了`);
                if (stdout) logger.debug(`stdout: ${stdout}`);
                if (stderr) logger.warn(`stderr: ${stderr}`);
                executeCommand(command, index + 1);
            });
        };
        
        executeCommand();
    });
}

// 市場分析の実行とGitHubプッシュを行う関数
async function runAnalysisAndPush(taskType = '定時実行') {
    const startTime = new Date();
    logger.info(`========================================`);
    logger.info(`[SCHEDULE] ${taskType}タスクを開始します: ${startTime.toLocaleString()}`);
    logger.info(`========================================`);
    
    try {
        // 1. Deep Research市場分析を実行（JSONデータ更新）
        logger.info('📊 Step 1: Deep Research市場分析を実行中...');
        await runFullAnalysis();
        logger.info('✅ Deep Research分析が完了しました');
        
        // 2. GitHubにデータをプッシュ（サイトビルドはGitHub Actionsが自動実行）
        logger.info('📤 Step 2: GitHubプッシュを実行中...');
        await pushToGitHub();
        
        const endTime = new Date();
        const duration = Math.round((endTime - startTime) / 1000);
        
        logger.info('========================================');
        logger.info(`✅ すべてのタスクが完了しました (実行時間: ${duration}秒)`);
        logger.info('🔄 GitHub Actionsがサイトビルドとデプロイを自動実行します');
        logger.info('========================================');
        
    } catch (error) {
        const endTime = new Date();
        const duration = Math.round((endTime - startTime) / 1000);
        
        logger.error('========================================');
        logger.error(`❌ タスク実行中にエラーが発生しました (実行時間: ${duration}秒)`);
        logger.error(`エラー詳細: ${error.message}`);
        logger.error(`スタック: ${error.stack}`);
        logger.error('========================================');
        
        // エラー時の通知機能（将来拡張用）
        // await notifyError(error, taskType);
    }
}

// Cronジョブのスケジュール設定
logger.info('⏰ Cronジョブをスケジュール中...');

// 1. 市場開場直後の分析 (米国東部時間 9:30 AM = 日本時間 10:30 PM/11:30 PM)
// 夏時間: 10:30 PM JST, 冬時間: 11:30 PM JST
// ここでは夏時間を基準に 10:30 PM JST で設定
cron.schedule('30 22 * * 1-5', () => runAnalysisAndPush('市場開場後'), {
    scheduled: true,
    timezone: "Asia/Tokyo"
});

// 2. 市場終了後の分析 (米国東部時間 4:00 PM = 日本時間 5:00 AM/6:00 AM)
// 夏時間: 5:00 AM JST, 冬時間: 6:00 AM JST
// ここでは夏時間を基準に 5:00 AM JST で設定
cron.schedule('0 5 * * 2-6', () => runAnalysisAndPush('市場終了後'), {
    scheduled: true,
    timezone: "Asia/Tokyo"
});

// 3. 手動実行用の関数をグローバルに公開
global.runManualAnalysis = () => runAnalysisAndPush('手動実行');

logger.info('✅ Cronジョブのスケジュール設定が完了しました');
logger.info('📋 実行スケジュール:');
logger.info('  🌅 平日 22:30 (米国市場開場後の分析)');
logger.info('  🌙 平日 05:00 (米国市場終了後の分析)');
logger.info('');
logger.info('💡 手動実行する場合は以下のコマンドを実行してください:');
logger.info('   runManualAnalysis()');
logger.info('');