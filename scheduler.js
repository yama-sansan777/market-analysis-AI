// 環境変数を最初に読み込み
require('dotenv').config();

const cron = require('node-cron');
const { exec } = require('child_process');
const { runFullAnalysis } = require('./auto_market_analysis.js');
const { createModuleLogger, logSystemHealth } = require('./utils/logger');
const { performSystemHealthCheck, saveHealthReport } = require('./utils/healthCheck');

// モジュール専用ロガー
const logger = createModuleLogger('SCHEDULER');

// 重要な環境変数のチェック
function validateEnvironment() {
    const requiredEnvVars = ['GEMINI_API_KEY', 'GOOGLE_API_KEY', 'ALPHA_VANTAGE_API_KEY'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
        logger.error(`❌ 必要な環境変数が設定されていません: ${missingVars.join(', ')}`);
        logger.error('💡 .envファイルを確認してください');
        return false;
    }
    
    logger.info('✅ 環境変数チェック完了 - すべてのAPIキーが設定済み');
    return true;
}

// 環境変数の検証
if (!validateEnvironment()) {
    logger.error('❌ 環境変数の検証に失敗しました。プロセスを終了します。');
    process.exit(1);
}

logger.info('🚀 Deep Research スケジューラーが起動しました。');
logger.info('市場開放時間に合わせてDeep Research分析を自動実行します:');
logger.info('  📅 平日 22:30 (米国市場開場後の分析)');
logger.info('  📅 平日 05:00 (米国市場終了後の分析)');
logger.info('  📰 毎日 14:00 (記事生成)');
logger.info('  🔍 毎日 15:00 (システムヘルスチェック)');
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

// リトライ機能付きのGitHubプッシュ関数
async function pushToGitHubWithRetry(maxRetries = 2, retryDelay = 10000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            logger.info(`📤 GitHubプッシュを実行中... (試行 ${attempt}/${maxRetries})`);
            await pushToGitHub();
            logger.info('✅ GitHubプッシュが完了しました');
            return true;
        } catch (error) {
            logger.error(`❌ GitHubプッシュ失敗 (試行 ${attempt}/${maxRetries}): ${error.message}`);
            
            if (attempt < maxRetries) {
                logger.info(`⏳ ${retryDelay/1000}秒後にリトライします...`);
                await new Promise(resolve => setTimeout(resolve, retryDelay));
            } else {
                logger.error('💀 GitHubプッシュのすべてのリトライが失敗しました');
                throw error;
            }
        }
    }
}

// リトライ機能付きの市場分析実行関数
async function runAnalysisWithRetry(maxRetries = 3, retryDelay = 5000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            logger.info(`📊 Deep Research分析を実行中... (試行 ${attempt}/${maxRetries})`);
            await runFullAnalysis();
            logger.info('✅ Deep Research分析が完了しました');
            return true;
        } catch (error) {
            logger.error(`❌ 分析実行失敗 (試行 ${attempt}/${maxRetries}): ${error.message}`);
            
            if (attempt < maxRetries) {
                logger.info(`⏳ ${retryDelay/1000}秒後にリトライします...`);
                await new Promise(resolve => setTimeout(resolve, retryDelay));
            } else {
                logger.error('💀 すべてのリトライが失敗しました');
                throw error;
            }
        }
    }
}

// 市場分析の実行とGitHubプッシュを行う関数（改良版）
async function runAnalysisAndPush(taskType = '定時実行') {
    const startTime = new Date();
    const taskId = `${taskType}-${startTime.getTime()}`;
    
    logger.info(`========================================`);
    logger.info(`[SCHEDULE] ${taskType}タスクを開始します`);
    logger.info(`タスクID: ${taskId}`);
    logger.info(`開始時刻: ${startTime.toLocaleString()}`);
    logger.info(`========================================`);
    
    try {
        // 1. 環境変数の再検証
        if (!validateEnvironment()) {
            throw new Error('環境変数の検証に失敗しました');
        }
        
        // 2. Deep Research市場分析を実行（リトライ機能付き）
        await runAnalysisWithRetry();
        
        // 3. GitHubにデータをプッシュ（リトライ機能付き）
        logger.info('📤 Step 2: GitHubプッシュを実行中...');
        await pushToGitHubWithRetry();
        
        const endTime = new Date();
        const duration = Math.round((endTime - startTime) / 1000);
        
        logger.info('========================================');
        logger.info(`✅ すべてのタスクが完了しました`);
        logger.info(`タスクID: ${taskId}`);
        logger.info(`実行時間: ${duration}秒`);
        logger.info('🔄 GitHub Actionsがサイトビルドとデプロイを自動実行します');
        logger.info('========================================');
        
        return { success: true, taskId, duration };
        
    } catch (error) {
        const endTime = new Date();
        const duration = Math.round((endTime - startTime) / 1000);
        
        logger.error('========================================');
        logger.error(`💥 タスク実行で致命的エラーが発生しました`);
        logger.error(`タスクID: ${taskId}`);
        logger.error(`実行時間: ${duration}秒`);
        logger.error(`エラー詳細: ${error.message}`);
        logger.error(`スタック: ${error.stack}`);
        logger.error('========================================');
        
        return { success: false, taskId, duration, error: error.message };
    }
}

// Cronジョブのスケジュール設定
logger.info('⏰ Cronジョブをスケジュール中...');

// 1. 市場開場直後の分析 (米国東部時間 9:30 AM = 日本時間 10:30 PM/11:30 PM)
// 夏時間: 10:30 PM JST, 冬時間: 11:30 PM JST
// ここでは夏時間を基準に 10:30 PM JST で設定
cron.schedule('30 22 * * 1-5', async () => {
    logger.info('⏰ 定時実行（市場開場後）が開始されました');
    const result = await runAnalysisAndPush('市場開場後');
    recordExecution(result);
    
    if (result.success) {
        logger.info('🎉 定時実行（市場開場後）が正常に完了しました');
    } else {
        logger.error('💥 定時実行（市場開場後）でエラーが発生しました');
    }
}, {
    scheduled: true,
    timezone: "Asia/Tokyo"
});

// 2. 市場終了後の分析 (米国東部時間 4:00 PM = 日本時間 5:00 AM/6:00 AM)
// 夏時間: 5:00 AM JST, 冬時間: 6:00 AM JST
// ここでは夏時間を基準に 5:00 AM JST で設定
cron.schedule('0 5 * * 2-6', async () => {
    logger.info('⏰ 定時実行（市場終了後）が開始されました');
    const result = await runAnalysisAndPush('市場終了後');
    recordExecution(result);
    
    if (result.success) {
        logger.info('🎉 定時実行（市場終了後）が正常に完了しました');
    } else {
        logger.error('💥 定時実行（市場終了後）でエラーが発生しました');
    }
}, {
    scheduled: true,
    timezone: "Asia/Tokyo"
});

// 実行履歴を記録する配列
const executionHistory = [];

// 実行履歴を記録する関数
function recordExecution(result) {
    const record = {
        timestamp: new Date().toISOString(),
        ...result
    };
    
    executionHistory.push(record);
    
    // 最新50件のみ保持
    if (executionHistory.length > 50) {
        executionHistory.shift();
    }
    
    logger.info(`📋 実行履歴に記録しました: ${record.taskId}`);
}

// 3. 記事生成用の定期実行 (毎日16:00)
cron.schedule('0 16 * * *', async () => {
    logger.info('⏰ 定時実行（記事生成）が開始されました');
    const result = await runAnalysisAndPush('記事生成');
    recordExecution(result);
    
    if (result.success) {
        logger.info('🎉 定時実行（記事生成）が正常に完了しました');
    } else {
        logger.error('💥 定時実行（記事生成）でエラーが発生しました');
    }
}, {
    scheduled: true,
    timezone: "Asia/Tokyo"
});

// 4. 定期ヘルスチェック (毎日17:00)
cron.schedule('0 17 * * *', async () => {
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

// 5. 手動実行用の関数をグローバルに公開
global.runManualAnalysis = async () => {
    logger.info('🎯 手動実行が開始されました');
    const result = await runAnalysisAndPush('手動実行');
    recordExecution(result);
    
    if (result.success) {
        logger.info('🎉 手動実行が正常に完了しました');
        console.log('✅ 手動実行成功');
    } else {
        logger.error('💥 手動実行でエラーが発生しました');
        console.log('❌ 手動実行失敗:', result.error);
    }
    
    return result;
};

global.runHealthCheck = async () => {
    logger.info('🔍 手動ヘルスチェックを実行します');
    const healthStatus = await performSystemHealthCheck();
    console.log(JSON.stringify(healthStatus, null, 2));
    return healthStatus;
};

// 実行履歴を確認する関数
global.getExecutionHistory = () => {
    console.log('📋 実行履歴:');
    console.log(JSON.stringify(executionHistory, null, 2));
    return executionHistory;
};

// 最新の実行状況を確認する関数
global.getLastExecution = () => {
    const lastExecution = executionHistory[executionHistory.length - 1];
    if (lastExecution) {
        console.log('📊 最新の実行状況:');
        console.log(JSON.stringify(lastExecution, null, 2));
    } else {
        console.log('📭 実行履歴がありません');
    }
    return lastExecution;
};

// 6. 起動時にシステムヘルスチェックを実行
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
logger.info('  📰 毎日 14:00 (記事生成)');
logger.info('  🔍 毎日 15:00 (システムヘルスチェック)');
logger.info('');
logger.info('💡 手動実行する場合は以下のコマンドを実行してください:');
logger.info('   runManualAnalysis() - Deep Research手動実行');
logger.info('   runHealthCheck() - ヘルスチェック手動実行');
logger.info('');