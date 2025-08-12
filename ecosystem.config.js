require('dotenv').config();

module.exports = {
  apps: [
    {
      name: 'deep-research-scheduler',
      script: 'scheduler.js',
      cwd: 'C:\\Users\\TS2\\Desktop\\market-analysis-AI',
      
      // 実行設定（Cronジョブ用に最適化）
      instances: 1,
      exec_mode: 'fork',  // クラスターモードではなくforkモード
      autorestart: true,
      watch: false,
      max_memory_restart: '200M',  // メモリ制限を下げる
      
      // 環境設定
      env: {
        NODE_ENV: 'production',
        LOG_LEVEL: 'info',
        GEMINI_API_KEY: process.env.GEMINI_API_KEY,
        GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
        ALPHA_VANTAGE_API_KEY: process.env.ALPHA_VANTAGE_API_KEY
      },
      env_development: {
        NODE_ENV: 'development',
        LOG_LEVEL: 'debug',
        GEMINI_API_KEY: process.env.GEMINI_API_KEY,
        GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
        ALPHA_VANTAGE_API_KEY: process.env.ALPHA_VANTAGE_API_KEY
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
      
      // 自動再起動の設定（安定性向上）
      min_uptime: '30s',  // 最小稼働時間を増加
      max_restarts: 3,    // 最大再起動回数を制限
      restart_delay: 10000, // 再起動間隔を延長
      
      // プロセス安定性の向上
      kill_timeout: 5000,
      listen_timeout: 3000,
      
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