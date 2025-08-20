const cron = require('node-cron');
const MarketAnalysisAutomation = require('./auto_market_analysis');
const { createSchedulerLogger } = require('./utils/logger');
const { withRetry, CircuitBreaker } = require('./utils/errorResilience');
const { SystemHealthCheck } = require('./utils/healthCheck');

class MarketAnalysisScheduler {
  constructor() {
    this.automation = new MarketAnalysisAutomation();
    this.logger = createSchedulerLogger();
    this.healthChecker = new SystemHealthCheck();
    
    // サーキットブレーカー設定
    this.analysisCircuitBreaker = new CircuitBreaker({
      name: 'MarketAnalysis',
      failureThreshold: 3,
      recoveryTimeout: 300000 // 5分
    });
    
    // 起動時のヘルスチェック
    this.performStartupHealthCheck();
  }

  // 毎日午前9時（日本時間）に実行
  startDailySchedule() {
    this.logger.scheduleStart('デイリー実行', '毎日午前9時（日本時間）');
    
    // 日本時間午前9時 = UTC午前0時
    cron.schedule('0 0 * * *', async () => {
      const startTime = Date.now();
      this.logger.scheduleStart('市場分析', new Date().toISOString());
      
      try {
        await this.runAnalysisWithResilience();
        const duration = Date.now() - startTime;
        this.logger.scheduleComplete('市場分析', duration);
      } catch (error) {
        const duration = Date.now() - startTime;
        this.logger.scheduleError('市場分析', error, duration);
      }
    }, {
      timezone: "Asia/Tokyo"
    });
    
    // 毎日12:00にヘルスチェック実行
    cron.schedule('0 12 * * *', async () => {
      this.logger.info('定期ヘルスチェック開始');
      try {
        const healthReport = await this.healthChecker.checkSystemHealth();
        if (healthReport.status !== 'healthy') {
          await this.healthChecker.generateAlert(healthReport);
        }
      } catch (error) {
        this.logger.error('ヘルスチェックエラー', error);
      }
    }, {
      timezone: "Asia/Tokyo"
    });
  }

  // 手動実行
  async runManual() {
    const startTime = Date.now();
    this.logger.info('手動実行開始');
    
    try {
      await this.runAnalysisWithResilience();
      const duration = Date.now() - startTime;
      this.logger.success(`手動実行完了 (${duration}ms)`);
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error('手動実行エラー', error, { duration });
      throw error;
    }
  }

  // テスト実行
  async runTest() {
    const startTime = Date.now();
    this.logger.info('テスト実行開始');
    
    try {
      // テスト用の軽量版を実行
      await this.automation.collectMarketData();
      const duration = Date.now() - startTime;
      this.logger.success(`テスト実行完了 (${duration}ms)`);
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error('テスト実行エラー', error, { duration });
      throw error;
    }
  }
  
  // エラー耐性付き分析実行
  async runAnalysisWithResilience() {
    return await this.analysisCircuitBreaker.execute(async () => {
      return await withRetry(
        () => this.automation.run(),
        {
          maxRetries: 2,
          baseDelay: 5000,
          retryCondition: (error) => {
            // ネットワークエラーやタイムアウトはリトライ
            return error.code === 'ECONNRESET' ||
                   error.code === 'ETIMEDOUT' ||
                   error.message.includes('timeout') ||
                   (error.response && error.response.status >= 500);
          },
          onRetry: (error, attempt) => {
            this.logger.warn(`分析処理リトライ: 試行 ${attempt}`, { error: error.message });
          }
        }
      );
    }, 180000); // 3分タイムアウト
  }
  
  // 起動時ヘルスチェック
  async performStartupHealthCheck() {
    try {
      this.logger.info('起動時ヘルスチェック実行中...');
      const healthReport = await this.healthChecker.checkSystemHealth();
      
      if (healthReport.status === 'healthy') {
        this.logger.success('システム正常: 全てのヘルスチェックをパス');
      } else {
        this.logger.warn(`システム状態: ${healthReport.status}`, {
          warnings: healthReport.warnings.length,
          errors: healthReport.errors.length
        });
        
        if (healthReport.status === 'unhealthy') {
          await this.healthChecker.generateAlert(healthReport);
        }
      }
    } catch (error) {
      this.logger.error('起動時ヘルスチェック失敗', error);
    }
  }
  
  // システム状態取得
  getSystemStatus() {
    return {
      circuitBreaker: this.analysisCircuitBreaker.getStatus(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString()
    };
  }
  
  // クリーンアップ
  cleanup() {
    if (this.analysisCircuitBreaker) {
      this.analysisCircuitBreaker.destroy();
    }
    this.logger.info('スケジューラークリーンアップ完了');
  }
}

// 実行
if (require.main === module) {
  const scheduler = new MarketAnalysisScheduler();
  
  // グレースフルシャットダウン
  process.on('SIGINT', () => {
    scheduler.logger.info('シャットダウンシグナル受信');
    scheduler.cleanup();
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    scheduler.logger.info('終了シグナル受信');
    scheduler.cleanup();
    process.exit(0);
  });
  
  const command = process.argv[2];
  
  switch (command) {
    case 'start':
      scheduler.startDailySchedule();
      scheduler.logger.success('スケジューラーが開始されました。Ctrl+Cで停止してください。');
      break;
    case 'manual':
      scheduler.runManual().catch(error => {
        scheduler.logger.error('手動実行失敗', error);
        process.exit(1);
      });
      break;
    case 'test':
      scheduler.runTest().catch(error => {
        scheduler.logger.error('テスト実行失敗', error);
        process.exit(1);
      });
      break;
    case 'health':
      scheduler.healthChecker.checkSystemHealth()
        .then(report => {
          console.log(JSON.stringify(report, null, 2));
          process.exit(report.status === 'healthy' ? 0 : 1);
        })
        .catch(error => {
          scheduler.logger.error('ヘルスチェック失敗', error);
          process.exit(1);
        });
      break;
    case 'status':
      const status = scheduler.getSystemStatus();
      console.log(JSON.stringify(status, null, 2));
      break;
    default:
      console.log('使用方法:');
      console.log('  node scheduler.js start   - スケジューラー開始');
      console.log('  node scheduler.js manual  - 手動実行');
      console.log('  node scheduler.js test    - テスト実行');
      console.log('  node scheduler.js health  - ヘルスチェック');
      console.log('  node scheduler.js status  - システム状態表示');
  }
}

module.exports = MarketAnalysisScheduler;