// ヘッダーコンポーネントを動的に読み込む関数
async function loadHeader() {
    try {
        // パスを自動検出（ルートまたはサブディレクトリ）
        const currentPath = window.location.pathname;
        const isInSubDir = currentPath.includes('/stocks/details/');
        const headerPath = isInSubDir ? '../../components/header.html' : 'components/header.html';
        
        const response = await fetch(headerPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const headerHTML = await response.text();
        
        // ヘッダーコンテナが存在する場合に挿入
        const headerContainer = document.getElementById('header-container');
        if (headerContainer) {
            headerContainer.innerHTML = headerHTML;
            
            // 現在のページをハイライト
            setActiveNavigation();

            // 言語スイッチャーの重複を除去（万一複数挿入された場合）
            const switchers = document.querySelectorAll('#header-lang-switcher');
            if (switchers.length > 1) {
                switchers.forEach((el, idx) => { if (idx > 0) el.remove(); });
            }
            
            // モバイルメニューの機能を最初に初期化（他の処理と独立）
            initializeMobileMenu();
            
            // 翻訳システムを再適用（ヘッダー内の要素に対して）
            if (window.applyTranslations) {
                // 翻訳適用後にメニューを表示
                setTimeout(() => {
                    window.applyTranslations();
                    // ヘッダー言語ボタンの外観とイベントを再設定
                    if (window.setupHeaderLanguageButtons) {
                        window.setupHeaderLanguageButtons();
                    }
                    // 翻訳が完了してからメニューを表示
                    const headerNav = document.querySelector('header nav');
                    const mobileMenu = document.getElementById('mobile-menu');
                    if (headerNav) headerNav.style.visibility = 'visible';
                    if (mobileMenu) mobileMenu.style.visibility = 'visible';
                }, 50);
            } else {
                // 翻訳システムがない場合は即座に表示
                const headerNav = document.querySelector('header nav');
                const mobileMenu = document.getElementById('mobile-menu');
                if (headerNav) headerNav.style.visibility = 'visible';
                if (mobileMenu) mobileMenu.style.visibility = 'visible';
                // 言語ボタン初期化（存在すれば）
                if (window.setupHeaderLanguageButtons) {
                    window.setupHeaderLanguageButtons();
                }
            }
        }
    } catch (error) {
        console.error('ヘッダーの読み込みに失敗しました:', error);
    }
}

// モバイルメニューの機能を初期化
function initializeMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        // とにかく見える状態を初期化（visibility隠し対策）
        mobileMenu.style.visibility = 'visible';
        // display は Tailwind の hidden クラスで制御する
        
        // 重複防止: 既存のイベントリスナーを削除
        const newButton = mobileMenuButton.cloneNode(true);
        mobileMenuButton.parentNode.replaceChild(newButton, mobileMenuButton);
        
        // 新しいイベントリスナーを追加
        newButton.addEventListener('click', () => {
            const menu = document.getElementById('mobile-menu');
            if (menu) {
                const willShow = menu.classList.contains('hidden');
                menu.classList.toggle('hidden');
                // 念のため visibility も制御（他スタイルの影響を排除）
                menu.style.visibility = willShow ? 'visible' : 'hidden';
                // display の直接制御は避けるが、hidden が外れても display: none が残っていた場合の保険
                if (willShow) {
                    menu.style.display = '';
                }
            }
        });
        
        // 初期化完了フラグを設定
        newButton.dataset.initialized = 'true';
        console.log('✅ Mobile menu initialized');
    } else {
        console.warn('⚠️ Mobile menu button or menu not found');
    }
}

// 現在のページをパスから判定する関数
function getCurrentPageFromPath(pathname) {
    // パスの最後の部分からファイル名を取得
    const fileName = pathname.split('/').pop() || 'index.html';
    
    // ファイル名から拡張子を除いてページ名を取得
    const pageName = fileName.replace('.html', '');
    
    // 空文字またはindex.htmlの場合はindexとして扱う
    if (!pageName || pageName === 'index') {
        return 'index';
    }
    
    return pageName;
}

// 現在のページをハイライトする関数
function setActiveNavigation() {
    const currentPath = window.location.pathname;
    const currentPage = getCurrentPageFromPath(currentPath);
    
    // デスクトップナビゲーション: 全てのリンクをリセット
    document.querySelectorAll('.nav-link').forEach(link => {
        link.className = 'nav-link text-gray-600 hover:text-primary';
    });
    
    // モバイルナビゲーション: 全てのリンクをリセット
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.className = 'mobile-nav-link block px-3 py-2 text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors';
    });
    
    // 現在のページに対応するデスクトップリンクをアクティブ化
    const activeDesktopLink = document.querySelector(`.nav-link[data-page="${currentPage}"]`);
    if (activeDesktopLink) {
        activeDesktopLink.className = 'nav-link text-primary font-medium border-b-2 border-primary pb-1';
    }
    
    // 現在のページに対応するモバイルリンクをアクティブ化
    const activeMobileLink = document.querySelector(`.mobile-nav-link[data-page="${currentPage}"]`);
    if (activeMobileLink) {
        activeMobileLink.className = 'mobile-nav-link block px-3 py-2 text-primary font-medium border-l-4 border-primary bg-blue-50';
    }
}

// DOMが読み込まれたらヘッダーを読み込む
document.addEventListener('DOMContentLoaded', loadHeader);