const winston = require('winston');
const path = require('path');

// ログディレクトリ設定
const logDir = path.join(__dirname, '../logs');

// カスタムフォーマット
const customFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, module, stack, ...meta }) => {
    let logMessage = `${timestamp} [${level.toUpperCase()}]`;
    if (module) logMessage += ` [${module}]`;
    logMessage += `: ${message}`;
    if (stack) logMessage += `\n${stack}`;
    if (Object.keys(meta).length > 0) {
      logMessage += `\nMeta: ${JSON.stringify(meta, null, 2)}`;
    }
    return logMessage;
  })
);

// メインロガー設定
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: customFormat,
  transports: [
    // コンソール出力
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    
    // エラーログ (error.log)
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    // 警告ログ (warn.log)
    new winston.transports.File({
      filename: path.join(logDir, 'warn.log'),
      level: 'warn',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    // 成功ログ (success.log) - info レベルで成功メッセージを記録
    new winston.transports.File({
      filename: path.join(logDir, 'success.log'),
      level: 'info',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      format: winston.format.combine(
        customFormat,
        winston.format((info) => {
          // 成功メッセージのみをフィルター
          return info.message.includes('✅') || info.message.includes('成功') || info.message.includes('完了') ? info : false;
        })()
      )
    }),
    
    // 全体ログ (combined.log)
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 10485760, // 10MB
      maxFiles: 10
    }),
    
    // デバッグログ (debug.log)
    new winston.transports.File({
      filename: path.join(logDir, 'debug.log'),
      level: 'debug',
      maxsize: 5242880, // 5MB
      maxFiles: 3
    })
  ]
});

// モジュール別ログ作成関数
function createModuleLogger(moduleName) {
  return {
    debug: (message, meta = {}) => {
      logger.debug(message, { module: moduleName, ...meta });
    },
    
    info: (message, meta = {}) => {
      logger.info(message, { module: moduleName, ...meta });
    },
    
    success: (message, meta = {}) => {
      logger.info(`✅ ${message}`, { module: moduleName, ...meta });
    },
    
    warn: (message, meta = {}) => {
      logger.warn(message, { module: moduleName, ...meta });
    },
    
    error: (message, error = null, meta = {}) => {
      const errorMeta = error ? { 
        error: error.message, 
        stack: error.stack,
        ...meta 
      } : meta;
      logger.error(message, { module: moduleName, ...errorMeta });
    },
    
    // API呼び出し専用ログ
    apiCall: (apiName, status, duration, meta = {}) => {
      const message = `API Call: ${apiName} | Status: ${status} | Duration: ${duration}ms`;
      if (status === 'success') {
        logger.info(`✅ ${message}`, { module: moduleName, api: apiName, duration, ...meta });
      } else {
        logger.error(`❌ ${message}`, { module: moduleName, api: apiName, duration, ...meta });
      }
    },
    
    // データ処理専用ログ
    dataProcess: (operation, itemCount, status, meta = {}) => {
      const message = `Data Process: ${operation} | Items: ${itemCount} | Status: ${status}`;
      if (status === 'success') {
        logger.info(`✅ ${message}`, { module: moduleName, operation, itemCount, ...meta });
      } else {
        logger.error(`❌ ${message}`, { module: moduleName, operation, itemCount, ...meta });
      }
    },
    
    // システム状態ログ
    systemStatus: (component, status, meta = {}) => {
      const message = `System Status: ${component} | Status: ${status}`;
      if (status === 'healthy' || status === 'ok') {
        logger.info(`✅ ${message}`, { module: moduleName, component, ...meta });
      } else {
        logger.warn(`⚠️ ${message}`, { module: moduleName, component, ...meta });
      }
    }
  };
}

// スケジューラー専用ログ
function createSchedulerLogger() {
  const schedulerLogger = createModuleLogger('SCHEDULER');
  
  return {
    ...schedulerLogger,
    
    scheduleStart: (taskName, time) => {
      schedulerLogger.info(`スケジュール開始: ${taskName} at ${time}`, { taskName, scheduledTime: time });
    },
    
    scheduleComplete: (taskName, duration) => {
      schedulerLogger.success(`スケジュール完了: ${taskName} (${duration}ms)`, { taskName, duration });
    },
    
    scheduleError: (taskName, error, duration) => {
      schedulerLogger.error(`スケジュールエラー: ${taskName} (${duration}ms)`, error, { taskName, duration });
    }
  };
}

// ログディレクトリの作成
const fs = require('fs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

module.exports = {
  logger,
  createModuleLogger,
  createSchedulerLogger
};