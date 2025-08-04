/**
 * 自動翻訳システム
 */
class Translator {
  constructor() {
    this.translationDict = {
      // 評価関連
      '買い': 'Buy',
      '売り': 'Sell',
      'ホールド': 'Hold',
      '中立': 'Neutral',
      '弱気': 'Bearish',
      '強気': 'Bullish',
      
      // 市場状況
      '史上最高値圏': 'near all-time highs',
      '史上最高値': 'all-time high',
      '市場': 'market',
      '投資家': 'investors',
      'プロ投資家': 'professional investors',
      '個人投資家': 'individual investors',
      '短期トレーダー': 'short-term traders',
      'リスク管理': 'risk management',
      
      // 重要な文章レベルの翻訳
      'S&P 500は史上最高値圏にありますが、内部指標は深刻な悪化を示しています。プロ投資家の熱狂と個人投資家の慎重さの乖離は逆張りの売りシグナルです。短期トレーダーはリスク管理を最優先し、高値追いを控えるべき局面です。': 'S&P 500 is near all-time highs, but internal indicators show serious deterioration. The divergence between professional investor euphoria and individual investor caution is a contrarian sell signal. Short-term traders should prioritize risk management and avoid chasing highs in this phase.',
      
      // テクニカル分析
      'ベアリッシュ・ダイバージェンス': 'bearish divergence',
      '価格と市場の健全性との間に危険な': 'dangerous divergence between price and market health',
      'オプション市場の過度な楽観': 'excessive optimism in options market',
      '逆張りの売りシグナル': 'contrarian sell signal',
      '極度の自己満足': 'extreme complacency',
      
      // 市場データ
      'S&P 500 (7/25終値)': 'S&P 500 (7/25 close)',
      'VIX指数': 'VIX index',
      '米国10年債利回り': 'US 10-year yield',
      
      // 日付変換用
      '2025年7月28日': 'July 28, 2025',
      '7月28日 市場分析': 'July 28 Market Analysis',
      
      // Put/Call Ratio関連
      '当日レシオ': 'Daily Ratio',
      '21日移動平均': '21-day Moving Average',
      
      // 感情・センチメント
      '楽観的': 'optimistic',
      '悲観的': 'pessimistic',
      '慎重': 'cautious',
      '強欲': 'greed',
      '恐怖': 'fear',
      
      // 助詞・語尾（空文字列に変換）
      'について': '',
      'による': '',
      'によって': '',
      'である': '',
      'です': '',
      'ます': '',
      'した': '',
      'する': '',
      'しています': '',
      'としている': '',
      'と': ' and ',
      'が': ' ',
      'は': ' ',
      'を': ' ',
      'に': ' ',
      'の': ' ',
      'で': ' '
    };
  }

  /**
   * 日本語テキストを英語に自動翻訳
   * @param {string} japaneseText 日本語テキスト
   * @returns {string} 英語テキスト
   */
  translateText(japaneseText) {
    if (!japaneseText) return '';
    
    let englishText = japaneseText;
    
    // 長いフレーズから短いものの順で置換
    const sortedEntries = Object.entries(this.translationDict)
      .sort((a, b) => b[0].length - a[0].length);
    
    sortedEntries.forEach(([japanese, english]) => {
      if (english) {
        const regex = new RegExp(
          japanese.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 
          'g'
        );
        englishText = englishText.replace(regex, english);
      }
    });
    
    // 日本語の日付パターンを英語に変換
    englishText = this.convertDatePatterns(englishText);
    
    // 句読点と文章の整形
    englishText = this.formatEnglishText(englishText);
    
    return englishText;
  }

  /**
   * 日付パターンを英語に変換
   * @param {string} text テキスト
   * @returns {string} 変換されたテキスト
   */
  convertDatePatterns(text) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    return text.replace(/(\\d+)年(\\d+)月(\\d+)日/g, (match, year, month, day) => {
      const monthIndex = parseInt(month) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        return `${months[monthIndex]} ${parseInt(day)}, ${year}`;
      }
      return match;
    });
  }

  /**
   * 英語テキストの整形
   * @param {string} text テキスト
   * @returns {string} 整形されたテキスト
   */
  formatEnglishText(text) {
    return text
      .replace(/。/g, '. ')
      .replace(/、/g, ', ')
      .replace(/：/g, ': ')
      .replace(/（/g, ' (')
      .replace(/）/g, ') ')
      .replace(/\\s+/g, ' ')
      .replace(/^\\s*([a-z])/g, (match, p1) => match.replace(p1, p1.toUpperCase()))
      .replace(/\\.\\s+([a-z])/g, (match, p1) => match.replace(p1, p1.toUpperCase()))
      .trim();
  }

  /**
   * オブジェクトを再帰的に翻訳
   * @param {any} obj 翻訳するオブジェクト
   * @returns {any} 翻訳されたオブジェクト
   */
  translateObjectRecursively(obj) {
    if (typeof obj === 'string') {
      return this.translateText(obj);
    } else if (Array.isArray(obj)) {
      return obj.map(item => this.translateObjectRecursively(item));
    } else if (obj !== null && typeof obj === 'object') {
      const translated = {};
      for (const [key, value] of Object.entries(obj)) {
        translated[key] = this.translateObjectRecursively(value);
      }
      return translated;
    }
    return obj;
  }

  /**
   * 日本語データから英語データを自動生成
   * @param {Object} japaneseData 日本語データ
   * @returns {Object} 英語データ
   */
  generateEnglishData(japaneseData) {
    return this.translateObjectRecursively(japaneseData);
  }

  /**
   * 翻訳辞書に新しいエントリを追加
   * @param {string} japanese 日本語
   * @param {string} english 英語
   */
  addTranslation(japanese, english) {
    this.translationDict[japanese] = english;
  }

  /**
   * 翻訳辞書を拡張
   * @param {Object} newTranslations 新しい翻訳辞書
   */
  extendDictionary(newTranslations) {
    Object.assign(this.translationDict, newTranslations);
  }
}

// グローバルに公開
if (typeof window !== 'undefined') {
  window.Translator = Translator;
}

// モジュールとしてエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Translator;
}