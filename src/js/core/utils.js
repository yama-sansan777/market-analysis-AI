/**
 * ユーティリティ関数集
 */
const Utils = {
  /**
   * デバウンス関数
   * @param {Function} func 実行する関数
   * @param {number} wait 待機時間（ミリ秒）
   * @returns {Function} デバウンスされた関数
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * スロットル関数
   * @param {Function} func 実行する関数
   * @param {number} limit 制限時間（ミリ秒）
   * @returns {Function} スロットルされた関数
   */
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * 日本語の日付文字列をDateオブジェクトに変換
   * @param {string} dateString - "2025年7月25日" 形式の日付文字列
   * @returns {Date|null} Dateオブジェクトまたはnull
   */
  parseJapaneseDate(dateString) {
    if (!dateString) return null;
    const match = dateString.match(/(\\d{4})年(\\d{1,2})月(\\d{1,2})日/);
    if (!match) return null;
    
    const [, year, month, day] = match.map(num => parseInt(num, 10));
    return new Date(year, month - 1, day);
  },

  /**
   * 日付をフォーマット
   * @param {Date} date Dateオブジェクト
   * @param {string} format フォーマット文字列
   * @returns {string} フォーマットされた日付文字列
   */
  formatDate(date, format = 'YYYY-MM-DD') {
    if (!date || !(date instanceof Date)) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day);
  },

  /**
   * 数値をパーセント表示にフォーマット
   * @param {number} value 数値
   * @param {number} decimals 小数点以下の桁数
   * @returns {string} パーセント表示の文字列
   */
  formatPercent(value, decimals = 1) {
    if (typeof value !== 'number') return '0%';
    return `${value.toFixed(decimals)}%`;
  },

  /**
   * 数値を千単位区切りでフォーマット
   * @param {number} value 数値
   * @param {number} decimals 小数点以下の桁数
   * @returns {string} フォーマットされた数値文字列
   */
  formatNumber(value, decimals = 0) {
    if (typeof value !== 'number') return '0';
    return value.toLocaleString('ja-JP', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  },

  /**
   * オブジェクトの深いクローンを作成
   * @param {any} obj クローンするオブジェクト
   * @returns {any} クローンされたオブジェクト
   */
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => this.deepClone(item));
    if (typeof obj === 'object') {
      const cloned = {};
      Object.keys(obj).forEach(key => {
        cloned[key] = this.deepClone(obj[key]);
      });
      return cloned;
    }
  },

  /**
   * ローカルストレージに安全に保存
   * @param {string} key キー
   * @param {any} value 値
   * @returns {boolean} 成功したかどうか
   */
  setLocalStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('LocalStorage save failed:', error);
      return false;
    }
  },

  /**
   * ローカルストレージから安全に取得
   * @param {string} key キー
   * @param {any} defaultValue デフォルト値
   * @returns {any} 取得された値またはデフォルト値
   */
  getLocalStorage(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('LocalStorage get failed:', error);
      return defaultValue;
    }
  },

  /**
   * URLパラメータを取得
   * @param {string} name パラメータ名
   * @returns {string|null} パラメータ値
   */
  getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  },

  /**
   * エラーメッセージを安全に表示
   * @param {Error|string} error エラーオブジェクトまたは文字列
   * @param {string} context エラーのコンテキスト
   */
  handleError(error, context = '') {
    const message = error instanceof Error ? error.message : String(error);
    const fullMessage = context ? `${context}: ${message}` : message;
    
    console.error(fullMessage, error);
    
    // プロダクション環境では詳細なエラーを隠す
    if (APP_CONFIG?.debug?.enabled) {
      console.error('Error details:', error);
    }
  },

  /**
   * 要素が画面内に表示されているかチェック
   * @param {Element} element DOM要素
   * @returns {boolean} 表示されているかどうか
   */
  isElementVisible(element) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  /**
   * アニメーション付きでスクロール
   * @param {Element} element スクロール先の要素
   * @param {number} offset オフセット（px）
   */
  scrollToElement(element, offset = 0) {
    if (!element) return;
    
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

// グローバルに公開
if (typeof window !== 'undefined') {
  window.Utils = Utils;
}

// モジュールとしてエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Utils;
}