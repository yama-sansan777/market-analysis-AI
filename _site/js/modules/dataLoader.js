/**
 * データローダーモジュール
 */
class DataLoader {
  constructor() {
    this.cache = new Map();
    this.translator = new Translator();
    this.config = APP_CONFIG?.api || {};
  }

  /**
   * 最新データを取得
   * @returns {Promise<Object>} 最新データ
   */
  async loadLatestData() {
    const cacheKey = 'latest';
    
    try {
      // キャッシュをチェック
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        const now = Date.now();
        if (now - cached.timestamp < 60000) { // 1分間キャッシュ
          console.log('Using cached latest data');
          return this.processData(cached.data);
        }
      }

      console.log('Loading latest data...');
      const response = await this.fetchWithRetry('/live_data/latest.json');
      const data = await response.json();
      
      // キャッシュに保存
      this.cache.set(cacheKey, {
        data: data,
        timestamp: Date.now()
      });
      
      return this.processData(data);
    } catch (error) {
      Utils.handleError(error, 'Failed to load latest data');
      throw error;
    }
  }

  /**
   * アーカイブデータを取得
   * @param {string} filename ファイル名
   * @returns {Promise<Object>} アーカイブデータ
   */
  async loadArchiveData(filename) {
    const cacheKey = `archive_${filename}`;
    
    try {
      // キャッシュをチェック
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        const now = Date.now();
        if (now - cached.timestamp < 300000) { // 5分間キャッシュ
          console.log('Using cached archive data:', filename);
          return this.processData(cached.data);
        }
      }

      console.log('Loading archive data:', filename);
      const response = await this.fetchWithRetry(`/archive_data/${filename}`);
      const data = await response.json();
      
      // キャッシュに保存
      this.cache.set(cacheKey, {
        data: data,
        timestamp: Date.now()
      });
      
      return this.processData(data);
    } catch (error) {
      Utils.handleError(error, `Failed to load archive data: ${filename}`);
      throw error;
    }
  }

  /**
   * マニフェストデータを取得
   * @returns {Promise<Array>} マニフェストデータ
   */
  async loadManifest() {
    const cacheKey = 'manifest';
    
    try {
      // キャッシュをチェック
      if (this.cache.has(cacheKey)) {
        const cached = this.cache.get(cacheKey);
        const now = Date.now();
        if (now - cached.timestamp < 300000) { // 5分間キャッシュ
          console.log('Using cached manifest data');
          return cached.data;
        }
      }

      console.log('Loading manifest data...');
      const response = await this.fetchWithRetry('/archive_data/manifest.json');
      const data = await response.json();
      
      // キャッシュに保存
      this.cache.set(cacheKey, {
        data: data,
        timestamp: Date.now()
      });
      
      return data;
    } catch (error) {
      Utils.handleError(error, 'Failed to load manifest data');
      throw error;
    }
  }

  /**
   * リトライ機能付きfetch
   * @param {string} url URL
   * @param {number} retries リトライ回数
   * @returns {Promise<Response>} レスポンス
   */
  async fetchWithRetry(url, retries = 3) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout || 10000);
    
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (retries > 0 && !controller.signal.aborted) {
        console.warn(`Fetch failed, retrying... (${retries} attempts left)`);
        await this.delay(1000); // 1秒待機
        return this.fetchWithRetry(url, retries - 1);
      }
      
      throw error;
    }
  }

  /**
   * データの処理（多言語対応）
   * @param {Object} rawData 生データ
   * @returns {Object} 処理されたデータ
   */
  processData(rawData) {
    if (!rawData) return null;
    
    console.log('Processing data for language:', window.currentLang);
    
    const currentLang = window.currentLang || 'ja';
    
    // 新しい多言語構造の場合
    if (rawData.languages) {
      console.log('Multilingual structure detected');
      
      // 英語データを日本語データから自動生成
      if (currentLang === 'en' && rawData.languages.ja) {
        console.log('Generating English data from Japanese...');
        rawData.languages.en = this.translator.generateEnglishData(rawData.languages.ja);
        
        // 基本情報も英語化
        if (rawData.date) {
          rawData.languages.en.date = this.translator.translateText(rawData.date);
        }
        if (rawData.session) {
          rawData.languages.en.session = this.translator.translateText(rawData.session);
        }
      }
      
      const langData = rawData.languages[currentLang] || rawData.languages.ja;
      
      const result = {
        ...rawData,
        ...langData
      };
      
      console.log('Data processed successfully');
      return result;
    }
    
    // 従来の構造の場合はそのまま返す
    console.log('Legacy structure detected, returning as-is');
    return rawData;
  }

  /**
   * キャッシュをクリア
   * @param {string} key 特定のキー（省略時は全てクリア）
   */
  clearCache(key = null) {
    if (key) {
      this.cache.delete(key);
      console.log('Cache cleared for key:', key);
    } else {
      this.cache.clear();
      console.log('All cache cleared');
    }
  }

  /**
   * キャッシュサイズを取得
   * @returns {number} キャッシュサイズ
   */
  getCacheSize() {
    return this.cache.size;
  }

  /**
   * 遅延処理
   * @param {number} ms ミリ秒
   * @returns {Promise} プロミス
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * データの検証
   * @param {Object} data データ
   * @returns {boolean} 検証結果
   */
  validateData(data) {
    if (!data) return false;
    
    // 基本的な構造チェック
    const requiredFields = ['summary', 'dashboard'];
    return requiredFields.every(field => data.hasOwnProperty(field));
  }

  /**
   * エラー回復処理
   * @param {Error} error エラー
   * @returns {Object|null} フォールバックデータ
   */
  handleDataError(error) {
    console.error('Data loading error:', error);
    
    // キャッシュからフォールバックデータを取得
    const fallbackKeys = ['latest', 'manifest'];
    for (const key of fallbackKeys) {
      if (this.cache.has(key)) {
        console.log('Using fallback data from cache:', key);
        return this.cache.get(key).data;
      }
    }
    
    return null;
  }
}

// グローバルに公開
if (typeof window !== 'undefined') {
  window.DataLoader = DataLoader;
}

// モジュールとしてエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DataLoader;
}