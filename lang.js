// Language switching functionality
let currentLang = localStorage.getItem('language') || 'ja';

// Translation data
const translations = {
    ja: {
        // Navigation
        nav_today: '本日の市況分析',
        nav_archive: '分析アーカイブ',
        nav_indicators: 'テクニカル指標解説',
        nav_terms: '市場用語集',
        nav_about: 'サイトについて',
        
        // Buttons
        login: 'ログイン',
        register: '無料登録',
        view_details: '詳細を見る',
        
        // Archive page
        archive_title: '分析アーカイブ',
        archive_subtitle: '過去の市場分析レポートを閲覧できます。日付やキーワードで検索して、必要な情報を素早く見つけましょう。',
        keyword_placeholder: 'キーワードで検索',
        select_period: '期間を選択',
        select_evaluation: '評価を選択',
        period: '期間',
        period_all: '全期間',
        period_1w: '1週間',
        period_1m: '1ヶ月',
        period_3m: '3ヶ月',
        evaluation_stats: '評価別統計',
        no_reports: '表示するレポートがありません。',
        
        // Date picker
        day_sun: '日',
        day_mon: '月',
        day_tue: '火',
        day_wed: '水',
        day_thu: '木',
        day_fri: '金',
        day_sat: '土',
        today: '今日',
        cancel: 'キャンセル',
        apply: '適用',
        
        // Select options
        select_period: '期間を選択',
        select_evaluation: '評価を選択',
        
        // Evaluations
        eval_buy: '買い',
        eval_sell: '売り',
        eval_neutral: '中立',
        cases: '件',
        
        // Footer
        footer_copyright: '© 2025 YOHOU Nikkei AI. All rights reserved.',
        footer_disclaimer_short: '当サイトの情報は投資判断の参考として提供されるものであり、投資勧誘を目的としたものではありません。',
        
        // About page
        about_title: 'サイトについて',
        about_subtitle: 'YOHOU US Stock AIについて',
        about_description: '日本の短期株式トレーダー向けに、信頼性の高い市場分析を毎日2回配信するプロフェッショナルサービス',
        contact_title: 'さらに詳しい情報が必要ですか？',
        contact_description: 'YOHOU US Stock AIに関するご質問やご不明点がございましたら、お気軽にお問い合わせください。専門スタッフが丁寧にお答えします。',
        contact_form: 'お問い合わせフォーム',
        trial_button: '無料トライアルに申し込む',
        footer_contact: 'お問い合わせ',
        
        // Main page
        main_title: 'S&P 500 インタラクティブ市場分析',
        main_subtitle: '短期トレーダーのためのデータ駆動型インサイト',
        summary_title: '総合評価',
        
        // Terms page
        terms_title: '市場用語集',
        terms_subtitle: '投資に必要な市場用語をカテゴリ別に整理',
        search_placeholder: '用語で検索',
        
        // Indicators page
        indicators_title: 'テクニカル指標解説',
        indicators_subtitle: '主要なテクニカル指標の詳細解説',
        indicator_search_placeholder: '指標名で検索'
    },
    en: {
        // Navigation
        nav_today: 'Today\'s Market Analysis',
        nav_archive: 'Analysis Archive',
        nav_indicators: 'Technical Indicators',
        nav_terms: 'Market Terms',
        nav_about: 'About',
        
        // Buttons
        login: 'Login',
        register: 'Free Registration',
        view_details: 'View Details',
        
        // Archive page
        archive_title: 'Analysis Archive',
        archive_subtitle: 'Browse past market analysis reports. Search by date or keywords to quickly find the information you need.',
        keyword_placeholder: 'Search by keyword',
        select_period: 'Select Period',
        select_evaluation: 'Select Evaluation',
        period: 'Period',
        period_all: 'All Periods',
        period_1w: '1 Week',
        period_1m: '1 Month',
        period_3m: '3 Months',
        evaluation_stats: 'Evaluation Statistics',
        no_reports: 'No reports to display.',
        
        // Date picker
        day_sun: 'Sun',
        day_mon: 'Mon',
        day_tue: 'Tue',
        day_wed: 'Wed',
        day_thu: 'Thu',
        day_fri: 'Fri',
        day_sat: 'Sat',
        today: 'Today',
        cancel: 'Cancel',
        apply: 'Apply',
        
        // Select options
        select_period: 'Select Period',
        select_evaluation: 'Select Evaluation',
        
        // Evaluations
        eval_buy: 'Buy',
        eval_sell: 'Sell',
        eval_neutral: 'Neutral',
        cases: 'cases',
        
        // Footer
        footer_copyright: '© 2025 YOHOU Nikkei AI. All rights reserved.',
        footer_disclaimer_short: 'The information on this site is provided for reference in investment decisions and is not intended for investment solicitation.',
        
        // About page
        about_title: 'About',
        about_subtitle: 'About YOHOU US Stock AI',
        about_description: 'A professional service that delivers reliable market analysis twice daily for Japanese short-term stock traders',
        contact_title: 'Need more detailed information?',
        contact_description: 'If you have any questions or concerns about YOHOU US Stock AI, please feel free to contact us. Our specialist staff will answer you politely.',
        contact_form: 'Contact Form',
        trial_button: 'Apply for Free Trial',
        footer_contact: 'Contact Us',
        
        // Main page
        main_title: 'S&P 500 Interactive Market Analysis',
        main_subtitle: 'Data-driven insights for short-term traders',
        summary_title: 'Overall Assessment',
        
        // Terms page
        terms_title: 'Market Terms',
        terms_subtitle: 'Investment terms organized by category',
        search_placeholder: 'Search terms',
        
        // Indicators page
        indicators_title: 'Technical Indicators',
        indicators_subtitle: 'Detailed explanation of major technical indicators',
        indicator_search_placeholder: 'Search indicators'
    }
};

// Language switcher HTML
function createLanguageSwitcher() {
    const switcher = document.createElement('div');
    switcher.id = 'lang-switcher';
    switcher.className = 'fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-2';
    switcher.innerHTML = `
        <div class="flex items-center space-x-2">
            <button class="lang-btn ${currentLang === 'ja' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'} px-3 py-1 rounded text-sm font-medium transition-colors" data-lang="ja">日本語</button>
            <span class="text-gray-400">|</span>
            <button class="lang-btn ${currentLang === 'en' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'} px-3 py-1 rounded text-sm font-medium transition-colors" data-lang="en">English</button>
        </div>
    `;
    
    // Add event listeners
    switcher.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            switchLanguage(lang);
        });
    });
    
    return switcher;
}

// Switch language function
function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    
    // Update language switcher buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        const btnLang = btn.getAttribute('data-lang');
        if (btnLang === lang) {
            btn.className = 'lang-btn bg-primary text-white px-3 py-1 rounded text-sm font-medium transition-colors';
        } else {
            btn.className = 'lang-btn bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm font-medium transition-colors';
        }
    });
    
    // Update all translatable elements
    document.querySelectorAll('[data-lang]').forEach(element => {
        const key = element.getAttribute('data-lang');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Update placeholders
    document.querySelectorAll('[data-lang-placeholder]').forEach(element => {
        const key = element.getAttribute('data-lang-placeholder');
        if (translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });
    
    // Trigger custom event for dynamic content
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

// Initialize language system
function initLanguage() {
    // Add language switcher to page
    const switcher = createLanguageSwitcher();
    document.body.appendChild(switcher);
    
    // Apply current language
    switchLanguage(currentLang);
}

// Get translation function
function getTranslation(key, lang = currentLang) {
    return translations[lang][key] || key;
}

// Export functions for use in other scripts
window.initLanguage = initLanguage;
window.switchLanguage = switchLanguage;
window.currentLang = currentLang;
window.translations = translations;
window.getTranslation = getTranslation; 