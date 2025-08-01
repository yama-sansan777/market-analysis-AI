// 軽量な外部翻訳読み込みシステム（安全バージョン）
class SimpleTranslationLoader {
    constructor() {
        this.translations = {};
        this.currentLang = localStorage.getItem('language') || 'ja';
        this.isLoaded = false;
        this.loadPromise = null;
    }

    // 翻訳ファイルを非同期で読み込み（エラーハンドリング強化）
    async loadTranslations() {
        if (this.loadPromise) {
            return this.loadPromise;
        }

        this.loadPromise = this.performLoad();
        return this.loadPromise;
    }

    async performLoad() {
        try {
            console.log('🔄 Loading external translation files...');
            
            // 日本語と英語の翻訳ファイルを並行して読み込み
            const [jaResponse, enResponse] = await Promise.all([
                fetch('./translations/ja.json'),
                fetch('./translations/en.json')
            ]);

            if (!jaResponse.ok || !enResponse.ok) {
                throw new Error(`Translation files not found (JA: ${jaResponse.status}, EN: ${enResponse.status})`);
            }

            const [jaData, enData] = await Promise.all([
                jaResponse.json(),
                enResponse.json()
            ]);

            this.translations = {
                ja: jaData,
                en: enData
            };

            this.isLoaded = true;
            console.log('✅ External translations loaded successfully:', Object.keys(this.translations));
            
            return true;
        } catch (error) {
            console.warn('⚠️ Failed to load external translations:', error.message);
            console.log('🔄 Will fallback to embedded translations');
            this.isLoaded = false;
            return false;
        }
    }

    // 翻訳を取得（フォールバック付き）
    getTranslation(key, lang = this.currentLang) {
        // 外部翻訳が読み込まれている場合
        if (this.isLoaded && this.translations[lang] && this.translations[lang][key]) {
            return this.translations[lang][key];
        }

        // フォールバック: 既存のシステムを使用
        if (window.translations && window.translations[lang] && window.translations[lang][key]) {
            return window.translations[lang][key];
        }

        // 最終フォールバック: キーをそのまま返す
        return key;
    }

    // 現在の言語を設定
    setCurrentLang(lang) {
        this.currentLang = lang;
        console.log(`🌐 External translation system language set to: ${lang}`);
    }

    // 外部翻訳システムが利用可能かチェック
    isAvailable() {
        return this.isLoaded;
    }
}

// グローバルインスタンスを作成（但し、既存システムとは競合しない）
console.log('🔧 Creating SimpleTranslationLoader instance...');
window.externalTranslationLoader = new SimpleTranslationLoader();
console.log('✅ SimpleTranslationLoader created');

// 後方互換性のための安全な統合関数
window.loadExternalTranslations = async function() {
    try {
        const success = await window.externalTranslationLoader.loadTranslations();
        if (success) {
            console.log('🚀 External translation system ready');
            return true;
        } else {
            console.log('🔄 Using existing embedded translation system');
            return false;
        }
    } catch (error) {
        console.error('❌ Error loading external translations:', error);
        return false;
    }
};