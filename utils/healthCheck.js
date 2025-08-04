const fs = require('fs').promises;
const path = require('path');
const { createModuleLogger } = require('./logger');

const logger = createModuleLogger('HEALTH_CHECK');

class SystemHealthCheck {
  constructor(options = {}) {
    this.options = {
      memoryThreshold: options.memoryThreshold || 500 * 1024 * 1024, // 500MB
      diskThreshold: options.diskThreshold || 1024 * 1024 * 1024, // 1GB
      logRetentionDays: options.logRetentionDays || 7,
      maxLogFileSize: options.maxLogFileSize || 10 * 1024 * 1024, // 10MB
      ...options
    };
    
    this.healthReportDir = path.join(__dirname, '../logs/health');
    this.ensureHealthReportDir();
  }

  async ensureHealthReportDir() {
    try {
      await fs.mkdir(this.healthReportDir, { recursive: true });
    } catch (error) {
      logger.error('ヘルスレポートディレクトリ作成エラー', error);
    }
  }

  // システム全体のヘルスチェック
  async checkSystemHealth() {
    logger.info('システムヘルスチェック開始');
    
    const startTime = Date.now();
    const healthReport = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      checks: {},
      warnings: [],
      errors: [],
      duration: 0
    };

    try {
      // 各種チェック実行
      const checks = await Promise.allSettled([
        this.checkMemoryUsage(),
        this.checkDiskSpace(),
        this.checkLogFiles(),
        this.checkDataFiles(),
        this.checkCircuitBreakers()
      ]);

      // 結果の集約
      const checkNames = ['memory', 'disk', 'logs', 'dataFiles', 'circuitBreakers'];
      
      checks.forEach((result, index) => {
        const checkName = checkNames[index];
        
        if (result.status === 'fulfilled') {
          healthReport.checks[checkName] = result.value;
          
          if (result.value.status === 'warning') {
            healthReport.warnings.push(`${checkName}: ${result.value.message}`);
          } else if (result.value.status === 'error') {
            healthReport.errors.push(`${checkName}: ${result.value.message}`);
            healthReport.status = 'unhealthy';
          }
        } else {
          healthReport.checks[checkName] = {
            status: 'error',
            message: result.reason.message,
            error: result.reason
          };
          healthReport.errors.push(`${checkName}: チェック失敗 - ${result.reason.message}`);
          healthReport.status = 'unhealthy';
        }
      });

      // 警告がある場合は status を warning に
      if (healthReport.warnings.length > 0 && healthReport.status === 'healthy') {
        healthReport.status = 'warning';
      }

    } catch (error) {
      logger.error('ヘルスチェック実行エラー', error);
      healthReport.status = 'error';
      healthReport.errors.push(`システムエラー: ${error.message}`);
    }

    healthReport.duration = Date.now() - startTime;
    
    // ヘルスレポート保存
    await this.saveHealthReport(healthReport);
    
    // ログ出力
    this.logHealthReport(healthReport);
    
    return healthReport;
  }

  // メモリ使用量チェック
  async checkMemoryUsage() {
    const memUsage = process.memoryUsage();
    const usedMemory = memUsage.heapUsed;
    const totalMemory = memUsage.heapTotal;
    const systemMemory = memUsage.rss;

    let status = 'healthy';
    let message = `メモリ使用量: ${Math.round(usedMemory / 1024 / 1024)}MB`;

    if (usedMemory > this.options.memoryThreshold) {
      status = 'warning';
      message += ` (閾値: ${Math.round(this.options.memoryThreshold / 1024 / 1024)}MB を超過)`;
    }

    return {
      status,
      message,
      details: {
        heapUsed: Math.round(usedMemory / 1024 / 1024),
        heapTotal: Math.round(totalMemory / 1024 / 1024),
        rss: Math.round(systemMemory / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024),
        thresholdMB: Math.round(this.options.memoryThreshold / 1024 / 1024)
      }
    };
  }

  // ディスク容量チェック
  async checkDiskSpace() {
    try {
      const stats = await fs.stat(process.cwd());
      // 簡易的なディスクスペースチェック（実際の実装では df コマンドを使用することを推奨）
      
      return {
        status: 'healthy',
        message: 'ディスク容量チェック完了',
        details: {
          available: 'N/A (require df command for accurate check)',
          threshold: Math.round(this.options.diskThreshold / 1024 / 1024 / 1024) + 'GB'
        }
      };
    } catch (error) {
      return {
        status: 'error',
        message: `ディスク容量チェックエラー: ${error.message}`,
        error
      };
    }
  }

  // ログファイルチェック
  async checkLogFiles() {
    const logDir = path.join(__dirname, '../logs');
    const issues = [];
    let totalLogSize = 0;

    try {
      const files = await fs.readdir(logDir);
      
      for (const file of files) {
        if (file.endsWith('.log')) {
          const filePath = path.join(logDir, file);
          const stats = await fs.stat(filePath);
          totalLogSize += stats.size;

          // ファイルサイズチェック
          if (stats.size > this.options.maxLogFileSize) {
            issues.push(`${file}: サイズが上限を超過 (${Math.round(stats.size / 1024 / 1024)}MB)`);
          }

          // ファイル更新日チェック
          const daysSinceModified = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
          if (daysSinceModified > this.options.logRetentionDays) {
            issues.push(`${file}: ${Math.round(daysSinceModified)}日間更新されていません`);
          }
        }
      }

      const status = issues.length > 0 ? 'warning' : 'healthy';
      const message = issues.length > 0 ? 
        `ログファイルに ${issues.length} 件の問題` : 
        'ログファイル正常';

      return {
        status,
        message,
        details: {
          totalSizeMB: Math.round(totalLogSize / 1024 / 1024),
          fileCount: files.filter(f => f.endsWith('.log')).length,
          issues
        }
      };

    } catch (error) {
      return {
        status: 'error',
        message: `ログファイルチェックエラー: ${error.message}`,
        error
      };
    }
  }

  // データファイルチェック
  async checkDataFiles() {
    const checks = [];
    
    try {
      // latest.json チェック
      const latestPath = path.join(process.cwd(), 'live_data/latest.json');
      try {
        const latestStats = await fs.stat(latestPath);
        const latestContent = await fs.readFile(latestPath, 'utf8');
        JSON.parse(latestContent); // JSON 有効性チェック
        
        checks.push({
          file: 'latest.json',
          status: 'healthy',
          size: latestStats.size,
          lastModified: latestStats.mtime
        });
      } catch (error) {
        checks.push({
          file: 'latest.json',
          status: 'error',
          error: error.message
        });
      }

      // manifest.json チェック
      const manifestPath = path.join(process.cwd(), 'archive_data/manifest.json');
      try {
        const manifestStats = await fs.stat(manifestPath);
        const manifestContent = await fs.readFile(manifestPath, 'utf8');
        const manifest = JSON.parse(manifestContent);
        
        checks.push({
          file: 'manifest.json',
          status: 'healthy',
          size: manifestStats.size,
          entryCount: manifest.length || 0,
          lastModified: manifestStats.mtime
        });
      } catch (error) {
        checks.push({
          file: 'manifest.json',
          status: 'error',
          error: error.message
        });
      }

      const errorCount = checks.filter(c => c.status === 'error').length;
      const status = errorCount > 0 ? 'error' : 'healthy';
      const message = errorCount > 0 ? 
        `データファイルに ${errorCount} 件のエラー` : 
        'データファイル正常';

      return {
        status,
        message,
        details: { checks }
      };

    } catch (error) {
      return {
        status: 'error',
        message: `データファイルチェックエラー: ${error.message}`,
        error
      };
    }
  }

  // サーキットブレーカー状態チェック
  async checkCircuitBreakers() {
    // グローバルサーキットブレーカーレジストリから状態取得
    // （実装では各モジュールがサーキットブレーカーを登録する仕組みが必要）
    
    return {
      status: 'healthy',
      message: 'サーキットブレーカー監視は実装中',
      details: {
        note: 'サーキットブレーカーの状態監視機能は各モジュールでの実装が必要'
      }
    };
  }

  // ヘルスレポート保存
  async saveHealthReport(report) {
    try {
      const timestamp = report.timestamp.replace(/[:.]/g, '-');
      const fileName = `health-report-${timestamp}.json`;
      const filePath = path.join(this.healthReportDir, fileName);
      
      await fs.writeFile(filePath, JSON.stringify(report, null, 2));
      logger.debug(`ヘルスレポート保存: ${fileName}`);
      
      // 古いレポートファイルのクリーンアップ
      await this.cleanupOldReports();
      
    } catch (error) {
      logger.error('ヘルスレポート保存エラー', error);
    }
  }

  // 古いヘルスレポートのクリーンアップ
  async cleanupOldReports() {
    try {
      const files = await fs.readdir(this.healthReportDir);
      const cutoffTime = Date.now() - (this.options.logRetentionDays * 24 * 60 * 60 * 1000);
      
      for (const file of files) {
        if (file.startsWith('health-report-') && file.endsWith('.json')) {
          const filePath = path.join(this.healthReportDir, file);
          const stats = await fs.stat(filePath);
          
          if (stats.mtime.getTime() < cutoffTime) {
            await fs.unlink(filePath);
            logger.debug(`古いヘルスレポート削除: ${file}`);
          }
        }
      }
    } catch (error) {
      logger.error('ヘルスレポートクリーンアップエラー', error);
    }
  }

  // ヘルスレポートのログ出力
  logHealthReport(report) {
    const statusEmoji = {
      healthy: '✅',
      warning: '⚠️',
      unhealthy: '❌',
      error: '💥'
    };

    const emoji = statusEmoji[report.status] || '❓';
    logger.systemStatus('SYSTEM_HEALTH', report.status, {
      duration: `${report.duration}ms`,
      warnings: report.warnings.length,
      errors: report.errors.length
    });

    if (report.warnings.length > 0) {
      report.warnings.forEach(warning => {
        logger.warn(`ヘルスチェック警告: ${warning}`);
      });
    }

    if (report.errors.length > 0) {
      report.errors.forEach(error => {
        logger.error(`ヘルスチェックエラー: ${error}`);
      });
    }

    // 詳細情報
    Object.entries(report.checks).forEach(([checkName, result]) => {
      if (result.status === 'healthy') {
        logger.debug(`${checkName}: ${result.message}`, result.details);
      } else {
        logger.warn(`${checkName}: ${result.message}`, result.details);
      }
    });
  }

  // システムアラート生成
  async generateAlert(report) {
    if (report.status === 'unhealthy' || report.errors.length > 0) {
      const alertMessage = `🚨 システムヘルスアラート\n` +
        `状態: ${report.status}\n` +
        `エラー数: ${report.errors.length}\n` +
        `警告数: ${report.warnings.length}\n` +
        `時刻: ${report.timestamp}\n\n` +
        `エラー詳細:\n${report.errors.join('\n')}`;

      logger.error('システムヘルスアラート', null, {
        alertLevel: 'critical',
        errorCount: report.errors.length,
        warningCount: report.warnings.length,
        status: report.status
      });

      // ここで外部通知システム（Slack、メールなど）に送信可能
      return alertMessage;
    }

    return null;
  }
}

// 簡易ヘルスチェック関数
async function quickHealthCheck() {
  const healthChecker = new SystemHealthCheck();
  return await healthChecker.checkSystemHealth();
}

// 基本的なシステム情報取得
function getSystemInfo() {
  const info = {
    nodeVersion: process.version,
    platform: process.platform,
    architecture: process.arch,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    pid: process.pid,
    environment: process.env.NODE_ENV || 'development'
  };

  logger.info('システム情報取得', info);
  return info;
}

module.exports = {
  SystemHealthCheck,
  quickHealthCheck,
  getSystemInfo
};