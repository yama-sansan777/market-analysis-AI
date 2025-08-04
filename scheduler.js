const cron = require('node-cron');
const { exec } = require('child_process');
const { runFullAnalysis } = require('./auto_market_analysis.js');
const { createModuleLogger, logSystemHealth } = require('./utils/logger');
const { performSystemHealthCheck, saveHealthReport } = require('./utils/healthCheck');

// モジュール専用ロガー
const logger = createModuleLogger('SCHEDULER');

logger.info('🚀 Deep Research スケジューラーが起動しました。');
logger.info('市場開放時間に合わせてDeep Research分析を自動実行します:');
logger.info('  📅 平日 22:30 (米国市場開場後の分析)');
logger.info('  📅 平日 05:00 (米国市場終了後の分析)');
logger.info('  🔍 毎日 12:00 (システムヘルスチェック)');
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

// 3. 定期ヘルスチェック (毎日12:00)
cron.schedule('0 12 * * *', async () => {
    logger.info('🔍 定期ヘルスチェックを開始します');
    try {
        const healthStatus = await performSystemHealthCheck();
        await saveHealthReport(healthStatus);
        
        if (healthStatus.overall !== 'HEALTHY') {
            logger.warn('システムヘルスチェックで問題を検出', {
                overall: healthStatus.overall,
                alertCount: healthStatus.alerts.length
            });
        } else {
            logger.success('システムヘルスチェック正常完了');
        }
    } catch (error) {
        logger.error('ヘルスチェック実行エラー', { error: error.message });
    }
}, {
    scheduled: true,
    timezone: "Asia/Tokyo"
});

// 4. 手動実行用の関数をグローバルに公開
global.runManualAnalysis = () => runAnalysisAndPush('手動実行');
global.runHealthCheck = async () => {
    logger.info('🔍 手動ヘルスチェックを実行します');
    const healthStatus = await performSystemHealthCheck();
    console.log(JSON.stringify(healthStatus, null, 2));
    return healthStatus;
};

// 5. 起動時にシステムヘルスチェックを実行
(async () => {
    try {
        logger.info('🔍 起動時ヘルスチェックを実行します');
        const healthStatus = await performSystemHealthCheck();
        
        if (healthStatus.overall === 'CRITICAL') {
            logger.error('起動時ヘルスチェックで重大な問題を検出', {
                alertCount: healthStatus.alerts.length
            });
        } else {
            logger.success('起動時ヘルスチェック完了', {
                overall: healthStatus.overall
            });
        }
    } catch (error) {
        logger.error('起動時ヘルスチェックエラー', { error: error.message });
    }
})();

logger.info('✅ Cronジョブのスケジュール設定が完了しました');
logger.info('📋 実行スケジュール:');
logger.info('  🌅 平日 22:30 (米国市場開場後の分析)');
logger.info('  🌙 平日 05:00 (米国市場終了後の分析)');
logger.info('  🔍 毎日 12:00 (システムヘルスチェック)');
logger.info('');
logger.info('💡 手動実行する場合は以下のコマンドを実行してください:');
logger.info('   runManualAnalysis() - Deep Research手動実行');
logger.info('   runHealthCheck() - ヘルスチェック手動実行');
logger.info('');