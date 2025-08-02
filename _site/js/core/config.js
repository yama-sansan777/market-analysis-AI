/**
 * アプリケーション設定
 */
const APP_CONFIG = {
  // API設定
  api: {
    baseUrl: '/api',
    timeout: 10000,
    retryAttempts: 3
  },
  
  // データファイルパス
  dataFiles: {
    latest: '/data/live/latest.json',
    manifest: '/data/archive/manifest.json',
    archiveBase: '/data/archive/'
  },
  
  // チャート設定
  charts: {
    defaultHeight: 400,
    responsive: true,
    maintainAspectRatio: false,
    fontSizes: {
      legend: 12,
      axis: 11,
      title: 14
    },
    colors: {
      primary: '#2563EB',
      secondary: '#DC2626',
      bullish: '#10b981',
      bearish: '#ef4444',
      neutral: '#6b7280'
    },
    animation: {
      duration: 800,
      easing: 'easeInOutQuart'
    }
  },
  
  // 言語設定
  i18n: {
    defaultLanguage: 'ja',
    supportedLanguages: ['ja', 'en'],
    storageKey: 'language',
    fallbackLanguage: 'ja'
  },
  
  // UI設定
  ui: {
    debounceDelay: 300,
    animationDuration: 300,
    breakpoints: {
      mobile: 768,
      tablet: 1024,
      desktop: 1280
    }
  },
  
  // デバッグ設定
  debug: {
    enabled: process?.env?.NODE_ENV === 'development',
    logLevel: 'info' // 'error', 'warn', 'info', 'debug'
  }
};

// 設定の凍結（不変にする）
Object.freeze(APP_CONFIG);

// グローバルに公開
if (typeof window !== 'undefined') {
  window.APP_CONFIG = APP_CONFIG;
}

// モジュールとしてエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = APP_CONFIG;
}