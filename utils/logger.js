const winston = require('winston');
const path = require('path');
const fs = require('fs');

// ログディレクトリの作成
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// カスタムフォーマット定義
const customFormat = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack, module, ...meta }) => {
        const modulePrefix = module ? `[${module}] ` : '';
        const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
        const stackStr = stack ? `\n${stack}` : '';
        return `${timestamp} [${level.toUpperCase()}] ${modulePrefix}${message}${metaStr}${stackStr}`;
    })
);

// ログレベル設定
const logLevel = process.env.LOG_LEVEL || 'info';

// Winston logger設定
const logger = winston.createLogger({
    level: logLevel,
    format: customFormat,
    defaultMeta: { service: 'deep-research-analyzer' },
    transports: [
        // エラーログ専用ファイル
        new winston.transports.File({
            filename: path.join(logsDir, 'error.log'),
            level: 'error',
            maxsize: 10485760, // 10MB
            maxFiles: 5,
        }),
        
        // 警告ログファイル
        new winston.transports.File({
            filename: path.join(logsDir, 'warn.log'),
            level: 'warn',
            maxsize: 5242880, // 5MB
            maxFiles: 3,
        }),
        
        // 成功・情報ログファイル
        new winston.transports.File({
            filename: path.join(logsDir, 'success.log'),
            level: 'info',
            maxsize: 20971520, // 20MB
            maxFiles: 7,
        }),
        
        // 統合ログファイル
        new winston.transports.File({
            filename: path.join(logsDir, 'combined.log'),
            maxsize: 52428800, // 50MB
            maxFiles: 10,
        }),
        
        // デバッグログファイル（開発環境のみ）
        ...(process.env.NODE_ENV === 'development' ? [
            new winston.transports.File({
                filename: path.join(logsDir, 'debug.log'),
                level: 'debug',
                maxsize: 10485760, // 10MB
                maxFiles: 2,
            })
        ] : []),
        
        // コンソール出力
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(({ timestamp, level, message, module }) => {
                    const modulePrefix = module ? `[${module}] ` : '';
                    return `${timestamp} ${level} ${modulePrefix}${message}`;
                })
            )
        })
    ],
});

// モジュール専用ロガー作成関数
function createModuleLogger(moduleName) {
    return {
        debug: (message, meta = {}) => logger.debug(message, { module: moduleName, ...meta }),
        info: (message, meta = {}) => logger.info(message, { module: moduleName, ...meta }),
        warn: (message, meta = {}) => logger.warn(message, { module: moduleName, ...meta }),
        error: (message, meta = {}) => logger.error(message, { module: moduleName, ...meta }),
        
        // 成功ログ専用メソッド
        success: (message, meta = {}) => logger.info(`✅ ${message}`, { module: moduleName, ...meta }),
        
        // API呼び出し専用ログメソッド
        apiCall: (apiName, status, duration, meta = {}) => {
            const message = `${apiName} API call ${status} (${duration}ms)`;
            if (status === 'SUCCESS') {
                logger.info(`🔗 ${message}`, { module: moduleName, api: apiName, duration, ...meta });
            } else {
                logger.error(`❌ ${message}`, { module: moduleName, api: apiName, duration, ...meta });
            }
        },
        
        // プロセス開始/終了ログ
        processStart: (processName, meta = {}) => {
            logger.info(`🚀 ${processName} プロセス開始`, { module: moduleName, process: processName, ...meta });
        },
        
        processEnd: (processName, duration, success = true, meta = {}) => {
            const emoji = success ? '✅' : '❌';
            const status = success ? '成功' : '失敗';
            logger.info(`${emoji} ${processName} プロセス${status} (${duration}ms)`, { 
                module: moduleName, 
                process: processName, 
                duration, 
                success,
                ...meta 
            });
        },
        
        // データ処理ログ
        dataOperation: (operation, recordCount, meta = {}) => {
            logger.info(`📊 ${operation}: ${recordCount}件処理`, { 
                module: moduleName, 
                operation, 
                recordCount, 
                ...meta 
            });
        }
    };
}

// システム全体のヘルスチェックログ
function logSystemHealth() {
    const memUsage = process.memoryUsage();
    const uptime = process.uptime();
    
    logger.info('💓 システムヘルスチェック', {
        module: 'SYSTEM',
        memoryUsage: {
            rss: Math.round(memUsage.rss / 1024 / 1024) + 'MB',
            heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + 'MB',
            heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + 'MB'
        },
        uptime: Math.round(uptime) + 's',
        nodeVersion: process.version,
        platform: process.platform
    });
}

// エラー分析ログ
function logErrorAnalysis(error, context = {}) {
    logger.error('🔍 エラー分析', {
        module: 'ERROR_ANALYZER',
        errorName: error.name,
        errorMessage: error.message,
        errorCode: error.code,
        stack: error.stack,
        context
    });
}

module.exports = {
    logger,
    createModuleLogger,
    logSystemHealth,
    logErrorAnalysis
};