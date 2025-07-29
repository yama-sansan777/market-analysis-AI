/**
 * ゲージチャートコンポーネント（ECharts使用）
 */
class GaugeChart extends ChartBase {
  constructor(containerId, options = {}) {
    super(containerId, options);
    this.type = 'gauge';
  }

  /**
   * ゲージチャートの初期化
   * @param {Object} data チャートデータ
   * @param {number} data.value 値（0-100）
   * @param {string} data.title タイトル
   * @param {Object} data.config 追加設定
   */
  init(data) {
    try {
      this.showLoading();
      
      if (typeof echarts === 'undefined') {
        throw new Error('ECharts library not loaded');
      }
      
      this.chart = echarts.init(this.container);
      this.updateChartData(data);
      
      console.log('GaugeChart initialized:', this.containerId);
    } catch (error) {
      console.error('GaugeChart initialization failed:', error);
      this.showError('ゲージチャートの初期化に失敗しました');
    }
  }

  /**
   * チャートデータの更新
   * @param {Object} data 新しいデータ
   */
  updateChartData(data) {
    if (!this.chart || !data) return;
    
    const option = this.createGaugeOption(data);
    this.chart.setOption(option, true);
  }

  /**
   * ゲージチャートのオプションを作成
   * @param {Object} data チャートデータ
   * @returns {Object} EChartsオプション
   */
  createGaugeOption(data) {
    const colors = this.getColors();
    const value = data.value || 0;
    
    // 値に応じて色を決定
    const gaugeColor = this.getGaugeColor(value);
    
    return {
      series: [{
        type: 'gauge',
        center: ['50%', '60%'],
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        splitNumber: 10,
        
        // ゲージの見た目設定
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: colors.bullish },
              { offset: 0.5, color: '#f59e0b' },
              { offset: 1, color: colors.bearish }
            ]
          }
        },
        
        // プログレスバー
        progress: {
          show: true,
          width: 18,
          itemStyle: {
            color: gaugeColor
          }
        },
        
        // ポインター
        pointer: {
          show: true,
          length: '60%',
          width: 6,
          itemStyle: {
            color: '#666'
          }
        },
        
        // 軸線
        axisLine: {
          lineStyle: {
            width: 18,
            color: [[1, '#e5e7eb']]
          }
        },
        
        // 目盛り
        axisTick: {
          distance: -25,
          length: 7,
          lineStyle: {
            width: 1,
            color: '#999'
          }
        },
        
        // 分割線
        splitLine: {
          distance: -30,
          length: 12,
          lineStyle: {
            width: 2,
            color: '#999'
          }
        },
        
        // 軸ラベル
        axisLabel: {
          distance: -10,
          color: '#999',
          fontSize: 16,
          formatter: function(value) {
            if (value === 0) return 'Fear';
            if (value === 50) return 'Neutral';
            if (value === 100) return 'Greed';
            return '';
          }
        },
        
        // 詳細表示
        detail: {
          valueAnimation: true,
          fontSize: 40,
          fontWeight: 'bold',
          color: gaugeColor,
          offsetCenter: [0, '40%'],
          formatter: '{value}'
        },
        
        // データ
        data: [{
          value: value,
          name: data.title || 'Sentiment'
        }]
      }],
      
      // タイトル
      title: data.title ? {
        text: data.title,
        left: 'center',
        top: '85%',
        textStyle: {
          fontSize: 16,
          fontWeight: 'normal',
          color: '#666'
        }
      } : undefined
    };
  }

  /**
   * 値に応じてゲージの色を決定
   * @param {number} value 値（0-100）
   * @returns {string} カラーコード
   */
  getGaugeColor(value) {
    const colors = this.getColors();
    
    if (value <= 25) return colors.bullish;      // Fear: 緑
    if (value <= 45) return '#10b981';           // 中立寄りの緑
    if (value <= 55) return '#6b7280';           // Neutral: グレー
    if (value <= 75) return '#f59e0b';           // 中立寄りの黄色
    return colors.bearish;                       // Greed: 赤
  }

  /**
   * リサイズ処理
   */
  resize() {
    if (this.chart && typeof this.chart.resize === 'function') {
      // EChartsの場合は少し遅延を入れる
      setTimeout(() => {
        this.chart.resize();
      }, 100);
    }
  }

  /**
   * チャートの破棄
   */
  destroy() {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
    this.unbindResize();
  }
}

// グローバルに公開
if (typeof window !== 'undefined') {
  window.GaugeChart = GaugeChart;
}

// モジュールとしてエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GaugeChart;
}