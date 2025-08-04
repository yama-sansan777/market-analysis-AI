const { createModuleLogger } = require('./logger');

const logger = createModuleLogger('ERROR_RESILIENCE');

/**
 * リトライ機能付きAPI呼び出し
 * @param {Function} operation - 実行する関数
 * @param {Object} options - リトライオプション
 * @returns {Promise} - 結果またはエラー
 */
async function withRetry(operation, options = {}) {
    const {
        maxRetries = 3,
        baseDelay = 1000,
        maxDelay = 10000,
        backoffMultiplier = 2,
        retryCondition = (error) => true,
        operationName = 'Unknown Operation'
    } = options;

    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
        const startTime = Date.now();
        
        try {
            logger.debug(`${operationName} 実行開始 (試行 ${attempt}/${maxRetries + 1})`);
            
            const result = await operation();
            const duration = Date.now() - startTime;
            
            if (attempt > 1) {
                logger.success(`${operationName} 成功 (${attempt}回目の試行で成功, ${duration}ms)`, {
                    attempt,
                    duration,
                    totalAttempts: attempt
                });
            } else {
                logger.debug(`${operationName} 成功 (${duration}ms)`, { duration });
            }
            
            return result;
            
        } catch (error) {
            const duration = Date.now() - startTime;
            lastError = error;
            
            logger.warn(`${operationName} 失敗 (試行 ${attempt}/${maxRetries + 1}): ${error.message}`, {
                attempt,
                duration,
                errorType: error.constructor.name,
                errorCode: error.code
            });
            
            // 最後の試行の場合、エラーを投げる
            if (attempt > maxRetries) {
                logger.error(`${operationName} 最終的に失敗 (${maxRetries + 1}回試行)`, {
                    totalAttempts: attempt,
                    finalError: error.message
                });
                break;
            }
            
            // リトライ条件をチェック
            if (!retryCondition(error)) {
                logger.warn(`${operationName} リトライ条件に合致せず、中断`, {
                    attempt,
                    errorType: error.constructor.name
                });
                break;
            }
            
            // バックオフ計算
            const delay = Math.min(baseDelay * Math.pow(backoffMultiplier, attempt - 1), maxDelay);
            logger.debug(`${delay}ms待機してリトライします...`);
            await sleep(delay);
        }
    }
    
    throw lastError;
}

/**
 * タイムアウト機能付き実行
 * @param {Function} operation - 実行する関数
 * @param {number} timeoutMs - タイムアウト時間(ms)
 * @param {string} operationName - 操作名
 * @returns {Promise} - 結果またはタイムアウトエラー
 */
async function withTimeout(operation, timeoutMs, operationName = 'Operation') {
    const startTime = Date.now();
    
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new TimeoutError(`${operationName} がタイムアウトしました (${timeoutMs}ms)`));
        }, timeoutMs);
    });
    
    try {
        logger.debug(`${operationName} タイムアウト設定: ${timeoutMs}ms`);
        
        const result = await Promise.race([operation(), timeoutPromise]);
        const duration = Date.now() - startTime;
        
        logger.debug(`${operationName} 完了 (${duration}ms)`, { duration, timeoutMs });
        return result;
        
    } catch (error) {
        const duration = Date.now() - startTime;
        
        if (error instanceof TimeoutError) {
            logger.error(`${operationName} タイムアウト (${duration}ms)`, { 
                duration, 
                timeoutMs,
                errorType: 'TimeoutError'
            });
        }
        
        throw error;
    }
}

/**
 * サーキットブレーカーパターン実装
 */
class CircuitBreaker {
    constructor(options = {}) {
        this.failureThreshold = options.failureThreshold || 5;
        this.recoveryTimeout = options.recoveryTimeout || 60000; // 1分
        this.monitoringWindow = options.monitoringWindow || 300000; // 5分
        this.name = options.name || 'CircuitBreaker';
        
        this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
        this.failureCount = 0;
        this.lastFailureTime = null;
        this.successCount = 0;
        this.totalCalls = 0;
        
        logger.info(`🔌 サーキットブレーカー初期化: ${this.name}`, {
            failureThreshold: this.failureThreshold,
            recoveryTimeout: this.recoveryTimeout
        });
    }
    
    async execute(operation, operationName = 'Operation') {
        this.totalCalls++;
        
        // OPENステートの場合、即座に失敗
        if (this.state === 'OPEN') {
            if (Date.now() - this.lastFailureTime > this.recoveryTimeout) {
                this.state = 'HALF_OPEN';
                logger.info(`🔄 サーキットブレーカー HALF_OPEN状態に移行: ${this.name}`);
            } else {
                const error = new CircuitBreakerError(`サーキットブレーカーがOPEN状態: ${this.name}`);
                logger.warn(`⚡ サーキットブレーカーによる実行拒否: ${operationName}`, {
                    state: this.state,
                    failureCount: this.failureCount
                });
                throw error;
            }
        }
        
        try {
            const result = await operation();
            this.onSuccess();
            return result;
            
        } catch (error) {
            this.onFailure(error, operationName);
            throw error;
        }
    }
    
    onSuccess() {
        this.successCount++;
        
        if (this.state === 'HALF_OPEN') {
            this.state = 'CLOSED';
            this.failureCount = 0;
            logger.success(`🔌 サーキットブレーカー CLOSED状態に復帰: ${this.name}`, {
                successCount: this.successCount
            });
        }
    }
    
    onFailure(error, operationName) {
        this.failureCount++;
        this.lastFailureTime = Date.now();
        
        logger.warn(`⚡ サーキットブレーカー失敗記録: ${operationName}`, {
            failureCount: this.failureCount,
            threshold: this.failureThreshold,
            errorMessage: error.message
        });
        
        if (this.failureCount >= this.failureThreshold) {
            this.state = 'OPEN';
            logger.error(`🚨 サーキットブレーカー OPEN状態に移行: ${this.name}`, {
                failureCount: this.failureCount,
                threshold: this.failureThreshold
            });
        }
    }
    
    getStats() {
        return {
            name: this.name,
            state: this.state,
            failureCount: this.failureCount,
            successCount: this.successCount,
            totalCalls: this.totalCalls,
            failureRate: this.totalCalls > 0 ? (this.failureCount / this.totalCalls * 100).toFixed(2) + '%' : '0%'
        };
    }
}

/**
 * カスタムエラークラス
 */
class TimeoutError extends Error {
    constructor(message) {
        super(message);
        this.name = 'TimeoutError';
        this.code = 'TIMEOUT';
    }
}

class CircuitBreakerError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CircuitBreakerError';
        this.code = 'CIRCUIT_BREAKER_OPEN';
    }
}

class RetryExhaustedError extends Error {
    constructor(message, originalError) {
        super(message);
        this.name = 'RetryExhaustedError';
        this.code = 'RETRY_EXHAUSTED';
        this.originalError = originalError;
    }
}

/**
 * ユーティリティ関数
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * よく使われるリトライ条件
 */
const retryConditions = {
    networkErrors: (error) => {
        const networkErrorCodes = ['ECONNRESET', 'ENOTFOUND', 'ECONNREFUSED', 'ETIMEDOUT'];
        return networkErrorCodes.includes(error.code) || error.message.includes('timeout');
    },
    
    httpErrors: (error) => {
        const retryableStatusCodes = [408, 429, 500, 502, 503, 504];
        return retryableStatusCodes.includes(error.status) || retryableStatusCodes.includes(error.statusCode);
    },
    
    apiErrors: (error) => {
        return retryConditions.networkErrors(error) || retryConditions.httpErrors(error);
    }
};

module.exports = {
    withRetry,
    withTimeout,
    CircuitBreaker,
    TimeoutError,
    CircuitBreakerError,
    RetryExhaustedError,
    sleep,
    retryConditions
};