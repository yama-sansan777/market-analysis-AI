module.exports = {
  apps: [
    {
      name: 'deep-research-scheduler',
      script: 'scheduler.js',
      cwd: '/path/to/market-analysis-AI',
      
      // 実行設定
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      
      // 環境設定
      env: {
        NODE_ENV: 'production',
        LOG_LEVEL: 'info'
      },
      env_development: {
        NODE_ENV: 'development',
        LOG_LEVEL: 'debug'
      },
      
      // ログ設定
      log_type: 'json',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      out_file: './logs/deep-research-out.log',
      error_file: './logs/deep-research-error.log',
      log_file: './logs/deep-research-combined.log',
      
      // ログローテーション設定
      max_log_files: 10,
      max_log_size: '10M',
      
      // プロセス設定
      time: true,
      merge_logs: true,
      
      // 自動再起動の設定
      min_uptime: '10s',
      max_restarts: 5,
      
      // cron機能を使用しているため、時間ベースの再起動は無効化
      restart_delay: 4000,
      
      // 監視とヘルスチェック
      health_check_grace_period: 30000,
      
      // 実行時間の制限なし（cron jobのため）
      exec_timeout: 0,
      
      // PM2 Plus統合（オプション）
      pmx: false,
      
      // Git統合（オプション）
      post_update: ['npm install', 'echo "Deep Research dependencies updated"'],
      
      // 通知設定（将来拡張用）
      notification: {
        enabled: false
      }
    }
  ],

  // デプロイ設定（将来拡張用）
  deploy: {
    production: {
      user: 'deploy',
      host: ['your-server.com'],
      ref: 'origin/main',
      repo: 'git@github.com:yama-sansan777/market-analysis-AI.git',
      path: '/var/www/market-analysis-AI',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    },
    development: {
      user: 'dev',
      host: 'localhost',
      ref: 'origin/develop',
      repo: 'git@github.com:yama-sansan777/market-analysis-AI.git',
      path: '/var/www/dev/market-analysis-AI',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env development'
    }
  }
};