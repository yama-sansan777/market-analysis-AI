/**
 * インデックスページのメインスクリプト
 */
class IndexPage {
  constructor() {
    this.dataLoader = new DataLoader();
    this.translator = new Translator();
    this.languageSwitcher = null;
    this.charts = {};
    this.currentData = null;
    
    this.init();
  }

  /**
   * ページの初期化
   */
  async init() {
    try {
      console.log('Initializing IndexPage...');
      
      // 言語システムの初期化
      this.initLanguageSystem();
      
      // データの読み込み
      await this.loadData();
      
      // UIの初期化
      this.initUI();
      
      // イベントリスナーの設定
      this.bindEvents();
      
      console.log('IndexPage initialized successfully');
    } catch (error) {
      Utils.handleError(error, 'IndexPage initialization failed');
      this.showError('ページの初期化に失敗しました');
    }
  }

  /**
   * 言語システムの初期化
   */
  initLanguageSystem() {
    // グローバル言語変数の設定
    window.currentLang = Utils.getLocalStorage('language', 'ja');
    
    // 言語切り替えの初期化
    this.languageSwitcher = new LanguageSwitcher({
      containerSelector: '#language-switcher'
    });
    this.languageSwitcher.init();
    
    // 言語変更イベントの監視
    this.languageSwitcher.onLanguageChange((newLang, oldLang) => {
      console.log('Language changed:', oldLang, '->', newLang);
      this.handleLanguageChange(newLang);
    });
  }

  /**
   * データの読み込み
   */
  async loadData() {
    try {
      // URLパラメータでファイルが指定されている場合
      const dataFile = Utils.getUrlParameter('datafile');
      
      if (dataFile) {
        console.log('Loading specific data file:', dataFile);
        this.currentData = await this.dataLoader.loadArchiveData(dataFile);
      } else {
        console.log('Loading latest data...');
        this.currentData = await this.dataLoader.loadLatestData();
      }
      
      if (!this.currentData) {
        throw new Error('No data loaded');
      }
      
      console.log('Data loaded successfully:', this.currentData);
    } catch (error) {
      Utils.handleError(error, 'Data loading failed');
      
      // エラー時はフォールバックデータを試行
      this.currentData = this.dataLoader.handleDataError(error);
      if (!this.currentData) {
        throw error;
      }
    }
  }

  /**
   * UIの初期化
   */
  initUI() {
    // HTML要素にデータを設定
    this.populateHtmlElements();
    
    // チャートの初期化
    this.initializeCharts();
    
    // タブ機能の初期化
    this.initializeTabs();
  }

  /**
   * HTML要素にデータを設定
   */
  populateHtmlElements() {
    if (!this.currentData) return;
    
    const data = this.currentData;
    
    // ヘッダー情報
    this.setElementText('session', data.session);
    this.setElementHTML('date', `<i class="ri-calendar-2-line text-gray-500"></i> ${data.date}`);
    
    // サマリー情報
    this.populateSummary(data.summary);
    
    // ダッシュボード情報
    this.populateDashboard(data.dashboard);
    
    // 詳細情報
    this.populateDetails(data.details);
    
    // 市場概要
    this.populateMarketOverview(data.marketOverview);
    
    // 注目銘柄
    this.populateHotStocks(data.hotStocks);
  }

  /**
   * サマリー情報の設定
   */
  populateSummary(summary) {
    if (!summary) return;
    
    const evalElement = document.getElementById('summary-evaluation');
    if (evalElement) {
      evalElement.textContent = summary.evaluation;
      evalElement.className = `px-3 py-1 rounded-full font-medium text-sm ${this.getEvaluationClass(summary.evaluation)}`;
    }
    
    this.setElementText('summary-score', summary.score);
    this.setElementText('summary-headline', summary.headline);
    this.setElementText('summary-text', summary.text);
  }

  /**
   * ダッシュボード情報の設定
   */
  populateDashboard(dashboard) {
    if (!dashboard) return;
    
    // 市場幅
    if (dashboard.breadth) {
      this.setElementText('breadth-advancers', dashboard.breadth.advancers?.toLocaleString());
      this.setElementText('breadth-decliners', dashboard.breadth.decliners?.toLocaleString());
      this.setElementText('breadth-summary', dashboard.breadth.summary);
    }
    
    // センチメント
    this.setElementText('sentiment-summary', dashboard.sentimentVISummary);
    
    // 価格レベル
    if (dashboard.priceLevels) {
      this.setElementText('resistance-value', dashboard.priceLevels.resistance?.value);
      this.setElementText('resistance-desc', dashboard.priceLevels.resistance?.description);
      this.setElementText('support-value', dashboard.priceLevels.support?.value);
      this.setElementText('support-desc', dashboard.priceLevels.support?.description);
    }
    
    // Put/Call Ratio
    if (dashboard.putCallRatio) {
      this.setElementText('put-call-daily', dashboard.putCallRatio.dailyValue);
      this.setElementText('put-call-ma', dashboard.putCallRatio.movingAverage);
      this.setElementText('put-call-status', dashboard.putCallRatio.status);
      this.setElementText('put-call-summary', dashboard.putCallRatio.summary);
    }
  }

  /**
   * 詳細情報の設定
   */
  populateDetails(details) {
    if (!details) return;
    
    // 各セクションの設定
    const sections = ['internals', 'technicals', 'fundamentals', 'strategy'];
    
    sections.forEach(section => {
      const sectionData = details[section];
      if (sectionData) {
        this.setElementText(`${section}-headline`, sectionData.headline);
        this.setElementText(`${section}-text`, sectionData.text);
        
        if (section === 'strategy') {
          this.setElementText('strategy-basic', sectionData.basic);
          this.setElementText('strategy-risk', sectionData.risk);
        }
        
        if (section === 'fundamentals') {
          this.populateFundamentals(sectionData);
        }
      }
    });
  }

  /**
   * ファンダメンタルズの詳細設定
   */
  populateFundamentals(fundamentals) {
    // VIX情報
    if (fundamentals.vix) {
      this.setElementText('vix-value', fundamentals.vix.value);
      this.setElementText('vix-change', fundamentals.vix.change);
      this.setElementText('vix-status', fundamentals.vix.status);
      this.setElementText('vix-summary', fundamentals.vix.summary);
    }
    
    // AAII調査
    if (fundamentals.aaiiSurvey) {
      this.setElementText('aaii-date', fundamentals.aaiiSurvey.date);
      this.setElementText('aaii-bullish', `${fundamentals.aaiiSurvey.bullish}%`);
      this.setElementText('aaii-neutral', `${fundamentals.aaiiSurvey.neutral}%`);
      this.setElementText('aaii-bearish', `${fundamentals.aaiiSurvey.bearish}%`);
      this.setElementText('aaii-summary', fundamentals.aaiiSurvey.summary);
    }
    
    // Investors Intelligence
    if (fundamentals.investorsIntelligence) {
      this.setElementText('ii-date', fundamentals.investorsIntelligence.date);
      this.setElementText('ii-bullish', `${fundamentals.investorsIntelligence.bullish}%`);
      this.setElementText('ii-bearish', `${fundamentals.investorsIntelligence.bearish}%`);
      this.setElementText('ii-correction', `${fundamentals.investorsIntelligence.correction}%`);
      this.setElementText('ii-summary', fundamentals.investorsIntelligence.summary);
    }
  }

  /**
   * 市場概要の設定
   */
  populateMarketOverview(marketOverview) {
    if (!marketOverview || !Array.isArray(marketOverview)) return;
    
    const container = document.getElementById('market-overview-list');
    if (!container) return;
    
    container.innerHTML = marketOverview.map(item => `
      <div class="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
        <span class="font-medium">${item.name}</span>
        <div class="text-right">
          <div class="font-bold">${item.value}</div>
          <div class="text-xs ${item.isDown ? 'text-red-600' : 'text-green-600'}">
            ${item.change}
          </div>
        </div>
      </div>
    `).join('');
  }

  /**
   * 注目銘柄の設定
   */
  populateHotStocks(hotStocks) {
    if (!hotStocks || !Array.isArray(hotStocks)) return;
    
    const container = document.getElementById('hot-stocks-list');
    if (!container) return;
    
    container.innerHTML = hotStocks.map(stock => `
      <div class="p-3 border border-gray-200 rounded-lg">
        <div class="flex justify-between items-start mb-2">
          <h4 class="font-bold text-sm">${stock.name}</h4>
          <span class="text-xs px-2 py-1 rounded ${stock.isDown ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}">
            ${stock.price}
          </span>
        </div>
        <p class="text-xs text-gray-600">${stock.description}</p>
      </div>
    `).join('');
  }

  /**
   * チャートの初期化
   */
  initializeCharts() {
    if (!this.currentData) return;
    
    try {
      // 市場幅チャート（ECharts）
      if (this.currentData.dashboard?.breadth) {
        this.initBreadthChart();
      }
      
      // センチメントゲージ（ECharts）
      if (this.currentData.dashboard?.sentimentVI) {
        this.initSentimentGauge();
      }
      
      // 寄与度チャート（Chart.js）
      if (this.currentData.details?.internals?.chartData) {
        this.initContributionChart();
      }
      
      // テクニカルチャート（Chart.js）
      if (this.currentData.details?.technicals?.chartData) {
        this.initTechnicalChart();
      }
      
      console.log('Charts initialized successfully');
    } catch (error) {
      Utils.handleError(error, 'Chart initialization failed');
    }
  }

  /**
   * 市場幅チャートの初期化
   */
  initBreadthChart() {
    const breadthData = this.currentData.dashboard.breadth;
    
    this.charts.breadthChart = new GaugeChart('breadthChart');
    this.charts.breadthChart.init({
      value: (breadthData.advancers / (breadthData.advancers + breadthData.decliners)) * 100,
      title: '市場幅'
    });
  }

  /**
   * センチメントゲージの初期化
   */
  initSentimentGauge() {
    this.charts.sentimentGauge = new GaugeChart('sentimentGauge');
    this.charts.sentimentGauge.init({
      value: this.currentData.dashboard.sentimentVI,
      title: 'センチメント'
    });
  }

  /**
   * 寄与度チャートの初期化
   */
  initContributionChart() {
    this.charts.contributionChart = new BarChart('contributionChart');
    this.charts.contributionChart.initHorizontal(
      this.currentData.details.internals.chartData
    );
  }

  /**
   * テクニカルチャートの初期化
   */
  initTechnicalChart() {
    this.charts.technicalChart = new LineChart('technicalChart');
    this.charts.technicalChart.init(
      this.currentData.details.technicals.chartData
    );
  }

  /**
   * タブ機能の初期化
   */
  initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        // 全てのタブを非アクティブに
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));
        
        // クリックされたタブをアクティブに
        button.classList.add('active');
        
        const tabId = button.dataset.tab;
        const targetPanel = document.getElementById(tabId);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  }

  /**
   * イベントリスナーの設定
   */
  bindEvents() {
    // ウィンドウリサイズ
    window.addEventListener('resize', Utils.throttle(() => {
      this.handleResize();
    }, 250));
    
    // データリロード（デバッグ用）
    if (APP_CONFIG?.debug?.enabled) {
      document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'r') {
          e.preventDefault();
          this.reloadData();
        }
      });
    }
  }

  /**
   * 言語変更の処理
   */
  async handleLanguageChange(newLanguage) {
    try {
      // データの再読み込み
      await this.loadData();
      
      // UIの更新
      this.populateHtmlElements();
      
      // チャートの更新
      this.updateCharts();
      
    } catch (error) {
      Utils.handleError(error, 'Language change handling failed');
    }
  }

  /**
   * チャートの更新
   */
  updateCharts() {
    Object.values(this.charts).forEach(chart => {
      if (chart && typeof chart.update === 'function') {
        chart.update(this.currentData);
      }
    });
  }

  /**
   * リサイズ処理
   */
  handleResize() {
    Object.values(this.charts).forEach(chart => {
      if (chart && typeof chart.resize === 'function') {
        chart.resize();
      }
    });
  }

  /**
   * データの再読み込み
   */
  async reloadData() {
    try {
      console.log('Reloading data...');
      this.dataLoader.clearCache();
      await this.loadData();
      this.populateHtmlElements();
      this.updateCharts();
      console.log('Data reloaded successfully');
    } catch (error) {
      Utils.handleError(error, 'Data reload failed');
    }
  }

  /**
   * エラー表示
   */
  showError(message) {
    const errorContainer = document.getElementById('error-container');
    if (errorContainer) {
      errorContainer.innerHTML = `
        <div class="alert alert-error">
          <i class="ri-error-warning-line"></i>
          ${message}
        </div>
      `;
      errorContainer.classList.remove('hidden');
    }
  }

  /**
   * ユーティリティメソッド
   */
  setElementText(id, text) {
    const element = document.getElementById(id);
    if (element && text !== undefined) {
      element.textContent = text;
    }
  }

  setElementHTML(id, html) {
    const element = document.getElementById(id);
    if (element && html !== undefined) {
      element.innerHTML = html;
    }
  }

  getEvaluationClass(evaluation) {
    if (!evaluation) return 'bg-gray-100 text-gray-700';
    
    const evalLower = evaluation.toLowerCase();
    if (evalLower.includes('買い') || evalLower.includes('buy')) {
      return 'bg-blue-100 text-blue-700';
    }
    if (evalLower.includes('売り') || evalLower.includes('sell')) {
      return 'bg-red-100 text-red-700';
    }
    return 'bg-gray-100 text-gray-700';
  }

  /**
   * 破棄処理
   */
  destroy() {
    // チャートの破棄
    Object.values(this.charts).forEach(chart => {
      if (chart && typeof chart.destroy === 'function') {
        chart.destroy();
      }
    });
    
    // 言語切り替えの破棄
    if (this.languageSwitcher) {
      this.languageSwitcher.destroy();
    }
    
    // キャッシュのクリア
    this.dataLoader.clearCache();
    
    console.log('IndexPage destroyed');
  }
}

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', () => {
  window.indexPage = new IndexPage();
});

// グローバルに公開
if (typeof window !== 'undefined') {
  window.IndexPage = IndexPage;
}