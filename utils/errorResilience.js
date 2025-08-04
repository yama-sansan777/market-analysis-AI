const { createModuleLogger } = require('./logger');

const logger = createModuleLogger('ERROR_RESILIENCE');

// カスタムエラータイプ
class TimeoutError extends Error {
  constructor(message, timeout) {
    super(message);
    this.name = 'TimeoutError';
    this.timeout = timeout;
  }
}

class RetryExhaustedError extends Error {
  constructor(message, attempts, lastError) {
    super(message);
    this.name = 'RetryExhaustedError';
    this.attempts = attempts;
    this.lastError = lastError;
  }
}

class CircuitBreakerError extends Error {
  constructor(message, circuitName) {
    super(message);
    this.name = 'CircuitBreakerError';
    this.circuitName = circuitName;
  }
}

// タイムアウト付きPromise実行
async function withTimeout(promise, timeoutMs = 30000, errorMessage = 'Operation timed out') {
  const startTime = Date.now();
  
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => {
        const duration = Date.now() - startTime;
        logger.error(`タイムアウト: ${errorMessage} (${duration}ms)`, null, { timeout: timeoutMs, duration });
        reject(new TimeoutError(`${errorMessage} (${timeoutMs}ms)`, timeoutMs));
      }, timeoutMs);
    })
  ]);
}

// 指数バックオフ付きリトライ
async function withRetry(operation, options = {}) {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    backoffMultiplier = 2,
    maxDelay = 10000,
    retryCondition = (error) => true,
    onRetry = null
  } = options;

  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      const startTime = Date.now();
      const result = await operation();
      const duration = Date.now() - startTime;
      
      if (attempt > 1) {
        logger.success(`リトライ成功: 試行回数 ${attempt}/${maxRetries + 1} (${duration}ms)`, { 
          attempt, 
          maxRetries, 
          duration 
        });
      }
      
      return result;
    } catch (error) {
      lastError = error;
      
      // 最後の試行の場合
      if (attempt > maxRetries) {
        logger.error(`リトライ回数上限に達しました: ${maxRetries}回`, error, { 
          attempt, 
          maxRetries,
          finalError: error.message 
        });
        throw new RetryExhaustedError(
          `操作が${maxRetries}回のリトライ後に失敗しました: ${error.message}`,
          attempt - 1,
          error
        );
      }

      // リトライ条件チェック
      if (!retryCondition(error)) {
        logger.error('リトライ条件を満たさないため中止', error, { attempt, condition: 'failed' });
        throw error;
      }

      // 遅延計算
      const delay = Math.min(baseDelay * Math.pow(backoffMultiplier, attempt - 1), maxDelay);
      
      logger.warn(`リトライ実行: 試行 ${attempt}/${maxRetries + 1}, ${delay}ms後に再試行`, { 
        attempt, 
        maxRetries, 
        delay, 
        error: error.message 
      });

      // onRetryコールバック
      if (onRetry) {
        try {
          await onRetry(error, attempt);
        } catch (callbackError) {
          logger.error('onRetryコールバックエラー', callbackError);
        }
      }

      // 遅延
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// サーキットブレーカーパターン
class CircuitBreaker {
  constructor(options = {}) {
    this.name = options.name || 'CircuitBreaker';
    this.failureThreshold = options.failureThreshold || 5;
    this.recoveryTimeout = options.recoveryTimeout || 60000;
    this.monitoringPeriod = options.monitoringPeriod || 10000;
    
    // 状態管理
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.successCount = 0;
    this.totalRequests = 0;
    
    // ヘルスチェック用の統計
    this.stats = {
      requests: 0,
      failures: 0,
      successes: 0,
      timeouts: 0,
      circuitTrips: 0
    };

    this.logger = createModuleLogger(`CIRCUIT_BREAKER_${this.name}`);
    
    // 定期的な状態監視
    this.monitorInterval = setInterval(() => {
      this.logStatus();
    }, this.monitoringPeriod);
  }

  async execute(operation, timeoutMs = 30000) {
    this.totalRequests++;
    this.stats.requests++;

    // OPEN状態チェック
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime < this.recoveryTimeout) {
        this.stats.circuitTrips++;
        throw new CircuitBreakerError(
          `サーキットブレーカーが開いています: ${this.name}`,
          this.name
        );
      } else {
        // HALF_OPEN状態に移行
        this.state = 'HALF_OPEN';
        this.logger.info('HALF_OPEN状態に移行', { circuitName: this.name });
      }
    }

    try {
      const startTime = Date.now();
      const result = await withTimeout(operation, timeoutMs);
      const duration = Date.now() - startTime;

      // 成功処理
      this.onSuccess();
      this.logger.apiCall(this.name, 'success', duration);
      return result;

    } catch (error) {
      const duration = Date.now() - startTime;
      
      if (error instanceof TimeoutError) {
        this.stats.timeouts++;
      }
      
      this.onFailure();
      this.logger.apiCall(this.name, 'failure', duration, { error: error.message });
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    this.successCount++;
    this.stats.successes++;

    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED';
      this.logger.success('サーキットブレーカーがCLOSED状態に復旧', { circuitName: this.name });
    }
  }

  onFailure() {
    this.failureCount++;
    this.stats.failures++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      this.logger.error(
        `サーキットブレーカーがOPEN状態に移行: 失敗回数 ${this.failureCount}`,
        null,
        { 
          circuitName: this.name, 
          failureThreshold: this.failureThreshold,
          failureCount: this.failureCount
        }
      );
    }
  }

  getStatus() {
    return {
      name: this.name,
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      totalRequests: this.totalRequests,
      lastFailureTime: this.lastFailureTime,
      stats: { ...this.stats }
    };
  }

  logStatus() {
    const status = this.getStatus();
    const successRate = status.totalRequests > 0 ? 
      ((status.stats.successes / status.totalRequests) * 100).toFixed(2) : 0;

    this.logger.systemStatus(
      this.name,
      this.state.toLowerCase(),
      {
        successRate: `${successRate}%`,
        totalRequests: status.totalRequests,
        failures: status.stats.failures,
        timeouts: status.stats.timeouts
      }
    );
  }

  reset() {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.successCount = 0;
    this.totalRequests = 0;
    this.lastFailureTime = null;
    this.stats = {
      requests: 0,
      failures: 0,
      successes: 0,
      timeouts: 0,
      circuitTrips: 0
    };
    this.logger.info('サーキットブレーカーリセット', { circuitName: this.name });
  }

  destroy() {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
    }
  }
}

// 複数の非同期操作を並行実行（fail-fast）
async function executeParallel(operations, options = {}) {
  const { 
    maxConcurrency = 5,
    failFast = true,
    timeout = 30000 
  } = options;

  logger.info(`並行実行開始: ${operations.length}個の操作`, { 
    maxConcurrency, 
    failFast, 
    timeout 
  });

  const results = [];
  const errors = [];

  // 操作をバッチに分割
  for (let i = 0; i < operations.length; i += maxConcurrency) {
    const batch = operations.slice(i, i + maxConcurrency);
    
    const batchPromises = batch.map(async (op, index) => {
      try {
        const result = await withTimeout(op(), timeout);
        return { success: true, result, index: i + index };
      } catch (error) {
        const errorInfo = { success: false, error, index: i + index };
        if (failFast) {
          throw error;
        }
        return errorInfo;
      }
    });

    try {
      const batchResults = await Promise.all(batchPromises);
      
      for (const result of batchResults) {
        if (result.success) {
          results[result.index] = result.result;
        } else {
          errors.push(result);
        }
      }
    } catch (error) {
      if (failFast) {
        logger.error('並行実行でfail-fastエラー', error);
        throw error;
      }
    }
  }

  logger.success(`並行実行完了: 成功 ${results.length}個, エラー ${errors.length}個`);

  return {
    results,
    errors,
    hasErrors: errors.length > 0
  };
}

// API呼び出し専用のレジリエント実行
async function resilientApiCall(apiFunction, options = {}) {
  const {
    retryOptions = { maxRetries: 3, baseDelay: 1000 },
    timeout = 30000,
    circuitBreaker = null,
    apiName = 'Unknown API'
  } = options;

  const operation = async () => {
    if (circuitBreaker) {
      return await circuitBreaker.execute(apiFunction, timeout);
    } else {
      return await withTimeout(apiFunction(), timeout);
    }
  };

  return await withRetry(operation, {
    ...retryOptions,
    retryCondition: (error) => {
      // タイムアウトエラーと一時的なネットワークエラーはリトライ
      return error instanceof TimeoutError || 
             error.code === 'ECONNRESET' ||
             error.code === 'ENOTFOUND' ||
             error.code === 'ETIMEDOUT' ||
             (error.response && error.response.status >= 500);
    },
    onRetry: async (error, attempt) => {
      logger.warn(`API呼び出しリトライ: ${apiName}, 試行 ${attempt}`, { 
        apiName, 
        attempt, 
        error: error.message 
      });
    }
  });
}

module.exports = {
  withTimeout,
  withRetry,
  CircuitBreaker,
  executeParallel,
  resilientApiCall,
  TimeoutError,
  RetryExhaustedError,
  CircuitBreakerError
};