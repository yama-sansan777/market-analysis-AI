module.exports = function() {
  try {
    // live_data/latest.jsonをデフォルトデータとして読み込み
    const latest = require('../../live_data/latest.json');
    
    return {
      latest: latest,
      // データの基本情報を設定
      defaultLanguage: 'ja',
      supportedLanguages: ['ja', 'en']
    };
  } catch (error) {
    console.error('Error loading market data:', error);
    return {
      latest: null,
      defaultLanguage: 'ja',
      supportedLanguages: ['ja', 'en']
    };
  }
};