const { createModuleLogger, logSystemHealth } = require('./logger');
const { searchCircuitBreaker } = require('../web_searcher');
const fs = require('fs/promises');
const path = require('path');

const logger = createModuleLogger('HEALTH_CHECK');

/**
 * システム全体のヘルスチェックを実行
 */
async function performSystemHealthCheck() {
    logger.info('🔍 システムヘルスチェックを開始します');
    
    const healthStatus = {
        timestamp: new Date().toISOString(),
        overall: 'HEALTHY',
        checks: {},
        metrics: {},
        alerts: []
    };

    try {
        // 1. メモリ使用量チェック
        healthStatus.checks.memory = await checkMemoryUsage();
        
        // 2. ディスク容量チェック
        healthStatus.checks.disk = await checkDiskSpace();
        
        // 3. ログファイルの状態チェック
        healthStatus.checks.logs = await checkLogFiles();
        
        // 4. API接続性チェック
        healthStatus.checks.apiConnectivity = await checkAPIConnectivity();
        
        // 5. サーキットブレーカー状態チェック
        healthStatus.checks.circuitBreakers = await checkCircuitBreakers();
        
        // 6. データファイル整合性チェック
        healthStatus.checks.dataIntegrity = await checkDataIntegrity();
        
        // 7. システムメトリクスの収集
        healthStatus.metrics = await collectSystemMetrics();
        
        // 総合健康状態の判定
        healthStatus.overall = determineOverallHealth(healthStatus.checks);
        
        // アラートの生成
        healthStatus.alerts = generateAlerts(healthStatus.checks);
        
        logger.success('システムヘルスチェック完了', {
            overall: healthStatus.overall,
            alertCount: healthStatus.alerts.length,
            checkResults: Object.keys(healthStatus.checks).map(key => ({
                check: key,
                status: healthStatus.checks[key].status
            }))
        });
        
        return healthStatus;
        
    } catch (error) {
        logger.error('ヘルスチェック実行中にエラーが発生', {
            error: error.message,
            stack: error.stack
        });
        
        healthStatus.overall = 'CRITICAL';
        healthStatus.alerts.push({
            level: 'CRITICAL',
            message: `ヘルスチェック実行エラー: ${error.message}`,
            timestamp: new Date().toISOString()
        });
        
        return healthStatus;
    }
}

/**
 * メモリ使用量をチェック
 */
async function checkMemoryUsage() {
    const memUsage = process.memoryUsage();
    const totalMemMB = memUsage.rss / 1024 / 1024;
    const heapUsedMB = memUsage.heapUsed / 1024 / 1024;
    const heapTotalMB = memUsage.heapTotal / 1024 / 1024;
    
    const memoryThreshold = 500; // 500MB
    const status = totalMemMB > memoryThreshold ? 'WARNING' : 'HEALTHY';
    
    return {
        status,
        details: {
            rss: Math.round(totalMemMB) + 'MB',
            heapUsed: Math.round(heapUsedMB) + 'MB',
            heapTotal: Math.round(heapTotalMB) + 'MB',
            external: Math.round(memUsage.external / 1024 / 1024) + 'MB'
        },
        threshold: memoryThreshold + 'MB',
        message: status === 'WARNING' ? 'メモリ使用量が閾値を超えています' : 'メモリ使用量は正常です'
    };
}

/**
 * ディスク容量をチェック
 */
async function checkDiskSpace() {
    try {
        // Node.jsでディスク容量を取得するのは複雑なので、ログファイルのサイズで代用
        const logsDir = path.join(__dirname, '..', 'logs');
        let totalLogSize = 0;
        
        try {
            const logFiles = await fs.readdir(logsDir);
            for (const file of logFiles) {
                const stats = await fs.stat(path.join(logsDir, file));
                totalLogSize += stats.size;
            }
        } catch (error) {
            // ログディレクトリが存在しない場合は0として処理
        }
        
        const totalLogSizeMB = totalLogSize / 1024 / 1024;
        const logSizeThreshold = 100; // 100MB
        const status = totalLogSizeMB > logSizeThreshold ? 'WARNING' : 'HEALTHY';
        
        return {
            status,
            details: {
                totalLogSize: Math.round(totalLogSizeMB) + 'MB',
                logFileCount: (await fs.readdir(logsDir).catch(() => [])).length
            },
            threshold: logSizeThreshold + 'MB',
            message: status === 'WARNING' ? 'ログファイルサイズが大きくなっています' : 'ディスク使用量は正常です'
        };
        
    } catch (error) {
        return {
            status: 'ERROR',
            details: { error: error.message },
            message: 'ディスク容量チェックでエラーが発生しました'
        };
    }
}

/**
 * ログファイルの状態をチェック
 */
async function checkLogFiles() {
    try {
        const logsDir = path.join(__dirname, '..', 'logs');
        const requiredLogFiles = ['error.log', 'success.log', 'combined.log'];
        const existingFiles = [];
        const missingFiles = [];
        
        for (const file of requiredLogFiles) {
            try {
                await fs.access(path.join(logsDir, file));
                existingFiles.push(file);
            } catch {
                missingFiles.push(file);
            }
        }
        
        const status = missingFiles.length > 0 ? 'WARNING' : 'HEALTHY';
        
        return {
            status,
            details: {
                existingFiles,
                missingFiles,
                totalFiles: existingFiles.length
            },
            message: status === 'WARNING' ? 
                `ログファイルが不足しています: ${missingFiles.join(', ')}` : 
                'ログファイルは正常です'
        };
        
    } catch (error) {
        return {
            status: 'ERROR',
            details: { error: error.message },
            message: 'ログファイルチェックでエラーが発生しました'
        };
    }
}

/**
 * API接続性をチェック
 */
async function checkAPIConnectivity() {
    const apiStatus = {
        googleSearch: 'UNKNOWN',
        gemini: 'UNKNOWN'
    };
    
    // 環境変数の存在確認
    const hasGoogleApiKey = !!process.env.GOOGLE_API_KEY;
    const hasSearchEngineId = !!process.env.SEARCH_ENGINE_ID;
    const hasGeminiApiKey = !!process.env.GEMINI_API_KEY;
    
    apiStatus.googleSearch = hasGoogleApiKey && hasSearchEngineId ? 'CONFIGURED' : 'NOT_CONFIGURED';
    apiStatus.gemini = hasGeminiApiKey ? 'CONFIGURED' : 'NOT_CONFIGURED';
    
    const allConfigured = Object.values(apiStatus).every(status => status === 'CONFIGURED');
    const status = allConfigured ? 'HEALTHY' : 'WARNING';
    
    return {
        status,
        details: {
            googleSearchAPI: apiStatus.googleSearch,
            geminiAPI: apiStatus.gemini,
            hasGoogleApiKey,
            hasSearchEngineId,
            hasGeminiApiKey
        },
        message: status === 'WARNING' ? 
            'API設定が不完全です' : 
            'API設定は正常です'
    };
}

/**
 * サーキットブレーカーの状態をチェック
 */
async function checkCircuitBreakers() {
    const circuitBreakers = [];
    
    // Web検索のサーキットブレーカー状態を取得
    if (typeof searchCircuitBreaker !== 'undefined') {
        circuitBreakers.push({
            name: 'GoogleSearchAPI',
            ...searchCircuitBreaker.getStats()
        });
    }
    
    const hasOpenCircuits = circuitBreakers.some(cb => cb.state === 'OPEN');
    const status = hasOpenCircuits ? 'WARNING' : 'HEALTHY';
    
    return {
        status,
        details: {
            circuitBreakers,
            openCircuits: circuitBreakers.filter(cb => cb.state === 'OPEN').length,
            totalCircuits: circuitBreakers.length
        },
        message: status === 'WARNING' ? 
            'サーキットブレーカーが開いています' : 
            'サーキットブレーカーは正常です'
    };
}

/**
 * データファイルの整合性をチェック
 */
async function checkDataIntegrity() {
    const dataFiles = [
        'live_data/latest.json',
        '_data/reportData.json'
    ];
    
    const fileStatus = {};
    let healthyFiles = 0;
    
    for (const file of dataFiles) {
        try {
            const content = await fs.readFile(file, 'utf8');
            const data = JSON.parse(content);
            
            // 基本的な構造チェック
            const hasRequiredStructure = data.session && data.date;
            
            fileStatus[file] = {
                exists: true,
                isValidJSON: true,
                hasRequiredStructure,
                fileSize: content.length
            };
            
            if (hasRequiredStructure) healthyFiles++;
            
        } catch (error) {
            fileStatus[file] = {
                exists: false,
                isValidJSON: false,
                hasRequiredStructure: false,
                error: error.message
            };
        }
    }
    
    const status = healthyFiles === dataFiles.length ? 'HEALTHY' : 'WARNING';
    
    return {
        status,
        details: {
            files: fileStatus,
            healthyFiles,
            totalFiles: dataFiles.length
        },
        message: status === 'WARNING' ? 
            'データファイルに問題があります' : 
            'データファイルは正常です'
    };
}

/**
 * システムメトリクスを収集
 */
async function collectSystemMetrics() {
    return {
        uptime: Math.round(process.uptime()),
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        processId: process.pid,
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
        timestamp: new Date().toISOString()
    };
}

/**
 * 総合健康状態を判定
 */
function determineOverallHealth(checks) {
    const statuses = Object.values(checks).map(check => check.status);
    
    if (statuses.includes('CRITICAL') || statuses.includes('ERROR')) {
        return 'CRITICAL';
    } else if (statuses.includes('WARNING')) {
        return 'WARNING';
    } else {
        return 'HEALTHY';
    }
}

/**
 * アラートを生成
 */
function generateAlerts(checks) {
    const alerts = [];
    
    for (const [checkName, checkResult] of Object.entries(checks)) {
        if (checkResult.status === 'CRITICAL' || checkResult.status === 'ERROR') {
            alerts.push({
                level: 'CRITICAL',
                check: checkName,
                message: checkResult.message,
                details: checkResult.details,
                timestamp: new Date().toISOString()
            });
        } else if (checkResult.status === 'WARNING') {
            alerts.push({
                level: 'WARNING',
                check: checkName,
                message: checkResult.message,
                details: checkResult.details,
                timestamp: new Date().toISOString()
            });
        }
    }
    
    return alerts;
}

/**
 * ヘルスチェック結果をファイルに保存
 */
async function saveHealthReport(healthStatus) {
    try {
        await fs.mkdir('logs/health', { recursive: true });
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `logs/health/health-report-${timestamp}.json`;
        
        await fs.writeFile(filename, JSON.stringify(healthStatus, null, 2));
        logger.dataOperation('ヘルスレポート保存', 1, { filename });
        
        return filename;
    } catch (error) {
        logger.error('ヘルスレポート保存エラー', { error: error.message });
        throw error;
    }
}

module.exports = {
    performSystemHealthCheck,
    saveHealthReport,
    checkMemoryUsage,
    checkDiskSpace,
    checkLogFiles,
    checkAPIConnectivity,
    checkCircuitBreakers,
    checkDataIntegrity,
    collectSystemMetrics
};