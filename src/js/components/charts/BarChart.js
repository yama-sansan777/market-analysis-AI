/**
 * バー（棒グラフ）チャートコンポーネント（Chart.js使用）
 */
class BarChart extends ChartBase {
  constructor(containerId, options = {}) {
    super(containerId, options);
    this.type = 'bar';
  }

  /**
   * バーチャートの初期化
   * @param {Object} data チャートデータ
   */
  init(data) {
    try {
      this.showLoading();
      
      if (typeof Chart === 'undefined') {
        throw new Error('Chart.js library not loaded');
      }
      
      const ctx = this.container.getContext ? this.container.getContext('2d') : null;
      if (!ctx) {
        // canvasが存在しない場合は動的に作成
        const canvas = document.createElement('canvas');
        canvas.id = this.containerId + '-canvas';
        this.container.innerHTML = '';
        this.container.appendChild(canvas);
        this.canvas = canvas;
      } else {
        this.canvas = this.container;
      }
      
      this.chart = new Chart(this.canvas, {
        type: 'bar',
        data: this.processData(data),
        options: this.createBarOptions(data)
      });
      
      console.log('BarChart initialized:', this.containerId);
    } catch (error) {
      console.error('BarChart initialization failed:', error);
      this.showError('バーチャートの初期化に失敗しました');
    }
  }

  /**
   * データの処理
   * @param {Object} data 元データ
   * @returns {Object} Chart.js用データ
   */
  processData(data) {
    const colors = this.getColors();
    const currentLang = window.currentLang || 'ja';
    
    return {
      labels: data.labels || [],
      datasets: [{
        label: currentLang === 'en' ? 'S&P 500 Impact' : 'S&P 500への影響',
        data: data.values || [],
        backgroundColor: (ctx) => {
          const value = ctx.raw;
          return value < 0 ? `${colors.bearish}B3` : `${colors.bullish}B3`;
        },
        borderColor: (ctx) => {
          const value = ctx.raw;
          return value < 0 ? colors.bearish : colors.bullish;
        },
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false
      }]
    };
  }

  /**
   * バーチャートのオプションを作成
   * @param {Object} data チャートデータ
   * @param {boolean} horizontal 横向きかどうか
   * @returns {Object} Chart.jsオプション
   */
  createBarOptions(data, horizontal = false) {
    const commonOptions = this.getCommonOptions();
    const fontSizes = this.getFontSizes();
    
    const options = {
      ...commonOptions,
      indexAxis: horizontal ? 'y' : 'x',
      scales: {
        x: {
          ticks: {
            font: {
              size: fontSizes.axis
            },
            callback: (value) => value + '%'
          },
          grid: {
            color: '#e5e7eb'
          }
        },
        y: {
          ticks: {
            font: {
              size: fontSizes.axis
            }
          },
          grid: {
            color: '#e5e7eb'
          }
        }
      },
      plugins: {
        ...commonOptions.plugins,
        legend: {
          ...commonOptions.plugins.legend,
          display: false  // バーチャートでは凡例を非表示
        },
        tooltip: {
          ...commonOptions.plugins.tooltip,
          callbacks: {
            label: (context) => {
              const label = context.dataset.label || '';
              const value = context.parsed.y || context.parsed.x;
              return `${label}: ${value}%`;
            }
          }
        }
      },
      elements: {
        bar: {
          borderRadius: 4
        }
      }
    };
    
    // 横向きの場合は軸を入れ替え
    if (horizontal) {
      [options.scales.x, options.scales.y] = [options.scales.y, options.scales.x];
    }
    
    return options;
  }

  /**
   * 横向きバーチャートとして初期化
   * @param {Object} data チャートデータ
   */
  initHorizontal(data) {
    try {
      this.showLoading();
      
      if (typeof Chart === 'undefined') {
        throw new Error('Chart.js library not loaded');
      }
      
      const ctx = this.container.getContext ? this.container.getContext('2d') : null;
      if (!ctx) {
        const canvas = document.createElement('canvas');
        canvas.id = this.containerId + '-canvas';
        this.container.innerHTML = '';
        this.container.appendChild(canvas);
        this.canvas = canvas;
      } else {
        this.canvas = this.container;
      }
      
      this.chart = new Chart(this.canvas, {
        type: 'bar',
        data: this.processData(data),
        options: this.createBarOptions(data, true)
      });
      
      console.log('Horizontal BarChart initialized:', this.containerId);
    } catch (error) {
      console.error('Horizontal BarChart initialization failed:', error);
      this.showError('横向きバーチャートの初期化に失敗しました');
    }
  }

  /**
   * チャートデータの更新
   * @param {Object} data 新しいデータ
   */
  updateChartData(data) {
    if (!this.chart || !data) return;
    
    this.chart.data = this.processData(data);
    this.chart.update('active');
  }

  /**
   * アニメーション付きでデータを更新
   * @param {Object} data 新しいデータ
   */
  animateUpdate(data) {
    if (!this.chart || !data) return;
    
    this.chart.data = this.processData(data);
    this.chart.update('resize');
  }

  /**
   * 色の設定を変更
   * @param {Object} colorConfig 色設定
   */
  updateColors(colorConfig) {
    if (!this.chart) return;
    
    const dataset = this.chart.data.datasets[0];
    dataset.backgroundColor = colorConfig.backgroundColor;
    dataset.borderColor = colorConfig.borderColor;
    
    this.chart.update('none');
  }
}

// グローバルに公開
if (typeof window !== 'undefined') {
  window.BarChart = BarChart;
}

// モジュールとしてエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BarChart;
}