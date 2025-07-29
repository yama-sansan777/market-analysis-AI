/**
 * チャートベースクラス
 */
class ChartBase {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    this.chart = null;
    this.options = {
      responsive: true,
      maintainAspectRatio: false,
      height: APP_CONFIG?.charts?.defaultHeight || 400,
      ...options
    };
    
    if (!this.container) {
      throw new Error(`Chart container not found: ${containerId}`);
    }
    
    this.bindResize();
  }

  /**
   * チャートの初期化（サブクラスで実装）
   * @param {Object} data チャートデータ
   */
  init(data) {
    throw new Error('init method must be implemented by subclass');
  }

  /**
   * データの更新
   * @param {Object} newData 新しいデータ
   */
  update(data) {
    if (!this.chart) {
      console.warn('Chart not initialized');
      return;
    }
    
    this.updateChartData(data);
  }

  /**
   * チャートデータの更新（サブクラスで実装）
   * @param {Object} data 新しいデータ
   */
  updateChartData(data) {
    throw new Error('updateChartData method must be implemented by subclass');
  }

  /**
   * チャートの破棄
   */
  destroy() {
    if (this.chart) {
      if (typeof this.chart.destroy === 'function') {
        this.chart.destroy();
      } else if (typeof this.chart.dispose === 'function') {
        this.chart.dispose();
      }
      this.chart = null;
    }
    
    this.unbindResize();
  }

  /**
   * リサイズイベントの設定
   */
  bindResize() {
    this.resizeHandler = Utils.throttle(() => {
      this.resize();
    }, 250);
    
    window.addEventListener('resize', this.resizeHandler);
  }

  /**
   * リサイズイベントの削除
   */
  unbindResize() {
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
      this.resizeHandler = null;
    }
  }

  /**
   * チャートのリサイズ
   */
  resize() {
    if (this.chart && typeof this.chart.resize === 'function') {
      this.chart.resize();
    }
  }

  /**
   * ローディング状態の表示
   */
  showLoading() {
    this.container.innerHTML = `
      <div class="chart-loading">
        <div class="spinner"></div>
        <p>チャートを読み込み中...</p>
      </div>
    `;
  }

  /**
   * エラー状態の表示
   * @param {string} message エラーメッセージ
   */
  showError(message = 'チャートの読み込みに失敗しました') {
    this.container.innerHTML = `
      <div class="chart-error">
        <i class="ri-error-warning-line"></i>
        <p>${message}</p>
      </div>
    `;
  }

  /**
   * 共通のチャート設定を取得
   * @returns {Object} 共通設定
   */
  getCommonOptions() {
    const currentLang = window.currentLang || 'ja';
    
    return {
      responsive: this.options.responsive,
      maintainAspectRatio: this.options.maintainAspectRatio,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              size: APP_CONFIG?.charts?.fontSizes?.legend || 12
            },
            padding: 15,
            usePointStyle: true
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#333',
          borderWidth: 1,
          cornerRadius: 8,
          displayColors: true
        }
      },
      interaction: {
        mode: 'index',
        intersect: false
      },
      animation: {
        duration: APP_CONFIG?.charts?.animation?.duration || 800,
        easing: APP_CONFIG?.charts?.animation?.easing || 'easeInOutQuart'
      },
      locale: currentLang
    };
  }

  /**
   * カラーパレットを取得
   * @returns {Object} カラー設定
   */
  getColors() {
    return APP_CONFIG?.charts?.colors || {
      primary: '#2563EB',
      secondary: '#DC2626',
      bullish: '#10b981',
      bearish: '#ef4444',
      neutral: '#6b7280'
    };
  }

  /**
   * フォントサイズを取得
   * @returns {Object} フォントサイズ設定
   */
  getFontSizes() {
    return APP_CONFIG?.charts?.fontSizes || {
      legend: 12,
      axis: 11,
      title: 14
    };
  }
}

// グローバルに公開
if (typeof window !== 'undefined') {
  window.ChartBase = ChartBase;
}

// モジュールとしてエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ChartBase;
}