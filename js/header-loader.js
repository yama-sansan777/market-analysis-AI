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
            
            // ヘッダー読み込み後にモバイルメニューの機能を初期化
            initializeMobileMenu();
            
            // 翻訳システムを再適用（ヘッダー内の要素に対して）
            if (window.applyTranslations) {
                window.applyTranslations();
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
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

// DOMが読み込まれたらヘッダーを読み込む
document.addEventListener('DOMContentLoaded', loadHeader);