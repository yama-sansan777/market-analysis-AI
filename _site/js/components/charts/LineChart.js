/**
 * ライン（折れ線）チャートコンポーネント（Chart.js使用）
 */
class LineChart extends ChartBase {
  constructor(containerId, options = {}) {
    super(containerId, options);
    this.type = 'line';
  }

  /**
   * ラインチャートの初期化
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
        type: 'line',
        data: this.processData(data),
        options: this.createLineOptions(data)
      });
      
      console.log('LineChart initialized:', this.containerId);
    } catch (error) {
      console.error('LineChart initialization failed:', error);
      this.showError('ラインチャートの初期化に失敗しました');
    }
  }

  /**
   * データの処理
   * @param {Object} data 元データ
   * @returns {Object} Chart.js用データ
   */
  processData(data) {
    const colors = this.getColors();
    
    return {
      labels: data.labels || [],
      datasets: this.createDatasets(data, colors)
    };
  }

  /**
   * データセットの作成
   * @param {Object} data 元データ
   * @param {Object} colors カラー設定
   * @returns {Array} データセット配列
   */
  createDatasets(data, colors) {
    const datasets = [];
    const currentLang = window.currentLang || 'ja';
    
    // S&P 500 メインライン
    if (data.sp500) {
      datasets.push({
        label: 'S&P 500',
        data: data.sp500,
        borderColor: colors.primary,
        backgroundColor: `${colors.primary}20`,
        fill: true,
        tension: 0.2,
        borderWidth: 2.5,
        pointRadius: 3,
        pointHoverRadius: 5,
        yAxisID: 'y'
      });
    }
    
    // 移動平均線
    if (data.ma50) {
      const ma50Label = currentLang === 'en' ? '50-day Moving Average' : '50日移動平均線';
      datasets.push({
        label: ma50Label,
        data: data.ma50,
        borderColor: '#f59e0b',
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0,
        borderWidth: 2,
        yAxisID: 'y'
      });
    }
    
    // ADL（Advance-Decline Line）
    if (data.adl) {
      const adlLabel = currentLang === 'en' ? 'Advance-Decline Line (ADL)' : 'アドバンス・デクライン・ライン (ADL)';
      datasets.push({
        label: adlLabel,
        data: data.adl,
        borderColor: '#8b5cf6',
        fill: false,
        pointRadius: 2,
        borderWidth: 2,
        yAxisID: 'y1'
      });
    }
    
    return datasets;
  }

  /**
   * ラインチャートのオプションを作成
   * @param {Object} data チャートデータ
   * @returns {Object} Chart.jsオプション
   */
  createLineOptions(data) {
    const commonOptions = this.getCommonOptions();
    const fontSizes = this.getFontSizes();
    
    return {
      ...commonOptions,
      scales: {
        x: {
          ticks: {
            font: {
              size: fontSizes.axis
            }
          },
          grid: {
            color: '#e5e7eb'
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          ticks: {
            font: {
              size: fontSizes.axis
            }
          },
          grid: {
            color: '#e5e7eb'
          },
          title: {
            display: true,
            text: 'Price',
            font: {
              size: fontSizes.title
            }
          }
        },
        y1: data.adl ? {
          type: 'linear',
          display: true,
          position: 'right',
          ticks: {
            font: {
              size: fontSizes.axis
            }
          },
          grid: {
            drawOnChartArea: false
          },
          title: {
            display: true,
            text: 'ADL',
            font: {
              size: fontSizes.title
            }
          }
        } : undefined
      },
      elements: {
        point: {
          hoverRadius: 6
        },
        line: {
          tension: 0.2
        }
      }
    };
  }

  /**
   * チャートデータの更新
   * @param {Object} data 新しいデータ
   */
  updateChartData(data) {
    if (!this.chart || !data) return;
    
    this.chart.data = this.processData(data);
    this.chart.options = this.createLineOptions(data);
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
}

// グローバルに公開
if (typeof window !== 'undefined') {
  window.LineChart = LineChart;
}

// モジュールとしてエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LineChart;
}