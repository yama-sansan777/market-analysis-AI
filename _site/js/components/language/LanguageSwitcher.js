/**
 * 言語切り替えコンポーネント
 */
class LanguageSwitcher {
  constructor(config = {}) {
    this.config = {
      storageKey: 'language',
      defaultLanguage: 'ja',
      supportedLanguages: ['ja', 'en'],
      containerSelector: '#language-switcher',
      ...config
    };
    
    this.currentLanguage = this.getCurrentLanguage();
    this.callbacks = [];
    this.isInitialized = false;
  }

  /**
   * 言語切り替えを初期化
   */
  init() {
    if (this.isInitialized) return;
    
    this.createSwitcherUI();
    this.bindEvents();
    this.updatePageLanguage();
    this.isInitialized = true;
    
    console.log('LanguageSwitcher initialized with language:', this.currentLanguage);
  }

  /**
   * 現在の言語を取得
   * @returns {string} 言語コード
   */
  getCurrentLanguage() {
    const stored = Utils.getLocalStorage(this.config.storageKey);
    return stored && this.config.supportedLanguages.includes(stored) 
      ? stored 
      : this.config.defaultLanguage;
  }

  /**
   * 言語切り替えUIを作成
   */
  createSwitcherUI() {
    const container = document.querySelector(this.config.containerSelector);
    if (!container) {
      console.warn('Language switcher container not found:', this.config.containerSelector);
      return;
    }

    const switcherHTML = `
      <div class="language-switcher-buttons">
        <button 
          class="lang-btn ${this.currentLanguage === 'ja' ? 'active' : ''}" 
          data-lang="ja"
          title="日本語"
        >
          日本語
        </button>
        <button 
          class="lang-btn ${this.currentLanguage === 'en' ? 'active' : ''}" 
          data-lang="en"
          title="English"
        >
          English
        </button>
      </div>
    `;

    container.innerHTML = switcherHTML;
    this.addSwitcherStyles();
  }

  /**
   * スタイルを追加
   */
  addSwitcherStyles() {
    const existingStyles = document.getElementById('language-switcher-styles');
    if (existingStyles) return;

    const styles = document.createElement('style');
    styles.id = 'language-switcher-styles';
    styles.textContent = `
      .language-switcher-buttons {
        display: flex;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 20px;
        padding: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
      }
      
      .lang-btn {
        padding: 8px 16px;
        border: none;
        background: transparent;
        color: #666;
        font-size: 13px;
        font-weight: 500;
        border-radius: 16px;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
      }
      
      .lang-btn:hover {
        background: rgba(37, 99, 235, 0.1);
        color: #2563EB;
      }
      
      .lang-btn.active {
        background: #2563EB;
        color: white;
        box-shadow: 0 2px 4px rgba(37, 99, 235, 0.3);
      }
      
      @media (max-width: 768px) {
        .language-switcher-buttons {
          padding: 2px;
        }
        
        .lang-btn {
          padding: 6px 12px;
          font-size: 12px;
        }
      }
    `;
    
    document.head.appendChild(styles);
  }

  /**
   * イベントを設定
   */
  bindEvents() {
    const buttons = document.querySelectorAll('.lang-btn');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => {
        const newLanguage = e.target.dataset.lang;
        if (newLanguage && newLanguage !== this.currentLanguage) {
          this.switchLanguage(newLanguage);
        }
      });
    });
  }

  /**
   * 言語を切り替え
   * @param {string} language 新しい言語コード
   */
  switchLanguage(language) {
    if (!this.config.supportedLanguages.includes(language)) {
      console.warn('Unsupported language:', language);
      return;
    }

    const oldLanguage = this.currentLanguage;
    this.currentLanguage = language;
    
    // ローカルストレージに保存
    Utils.setLocalStorage(this.config.storageKey, language);
    
    // グローバル変数を更新
    window.currentLang = language;
    
    // UIを更新
    this.updateSwitcherUI();
    this.updatePageLanguage();
    
    // イベントを発火
    this.notifyLanguageChange(language, oldLanguage);
    
    console.log('Language switched from', oldLanguage, 'to', language);
  }

  /**
   * スイッチャーUIを更新
   */
  updateSwitcherUI() {
    const buttons = document.querySelectorAll('.lang-btn');
    buttons.forEach(button => {
      const isActive = button.dataset.lang === this.currentLanguage;
      button.classList.toggle('active', isActive);
    });
  }

  /**
   * ページの言語表示を更新
   */
  updatePageLanguage() {
    // data-lang属性を持つ要素を更新
    this.updateDataLangElements();
    
    // HTMLのlang属性を更新
    document.documentElement.lang = this.currentLanguage;
  }

  /**
   * data-lang属性を持つ要素を更新
   */
  updateDataLangElements() {
    const elements = document.querySelectorAll('[data-lang]');
    elements.forEach(element => {
      const key = element.dataset.lang;
      const translation = this.getTranslation(key);
      if (translation) {
        if (element.tagName === 'INPUT' && element.type === 'text') {
          element.placeholder = translation;
        } else {
          element.textContent = translation;
        }
      }
    });
  }

  /**
   * 翻訳を取得（getTranslation関数との互換性のため）
   * @param {string} key 翻訳キー
   * @returns {string} 翻訳されたテキスト
   */
  getTranslation(key) {
    // グローバルのgetTranslation関数があれば使用
    if (typeof window.getTranslation === 'function') {
      return window.getTranslation(key);
    }
    
    // フォールバック処理
    return key;
  }

  /**
   * 言語変更の通知
   * @param {string} newLanguage 新しい言語
   * @param {string} oldLanguage 古い言語
   */
  notifyLanguageChange(newLanguage, oldLanguage) {
    // カスタムイベントを発火
    const event = new CustomEvent('languageChanged', {
      detail: { newLanguage, oldLanguage }
    });
    document.dispatchEvent(event);
    
    // 登録されたコールバックを実行
    this.callbacks.forEach(callback => {
      try {
        callback(newLanguage, oldLanguage);
      } catch (error) {
        console.error('Language change callback error:', error);
      }
    });
  }

  /**
   * 言語変更時のコールバックを登録
   * @param {Function} callback コールバック関数
   */
  onLanguageChange(callback) {
    if (typeof callback === 'function') {
      this.callbacks.push(callback);
    }
  }

  /**
   * コールバックを削除
   * @param {Function} callback 削除するコールバック関数
   */
  removeLanguageChangeCallback(callback) {
    const index = this.callbacks.indexOf(callback);
    if (index > -1) {
      this.callbacks.splice(index, 1);
    }
  }

  /**
   * 破棄処理
   */
  destroy() {
    const container = document.querySelector(this.config.containerSelector);
    if (container) {
      container.innerHTML = '';
    }
    
    const styles = document.getElementById('language-switcher-styles');
    if (styles) {
      styles.remove();
    }
    
    this.callbacks = [];
    this.isInitialized = false;
  }
}

// グローバルに公開
if (typeof window !== 'undefined') {
  window.LanguageSwitcher = LanguageSwitcher;
}

// モジュールとしてエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LanguageSwitcher;
}