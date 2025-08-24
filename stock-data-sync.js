/**
 * Stock Data Synchronization System
 * pickup.htmlの株式データをdetailsフォルダの個別銘柄ページから自動同期
 */

class StockDataSynchronizer {
    constructor() {
        this.detailsPath = './stocks/details/';
        this.cacheKey = 'stockDataCache';
        this.cacheTimeout = 5 * 60 * 1000; // 5分間有効

        // ティッカーシンボルとファイル名の対応表
        this.tickerToFileMap = {
            'AAPL': 'apple.html',
            'MSFT': 'microsoft.html',
            'NVDA': 'nvidia.html',
            'AMZN': 'amazon.html',
            'META': 'meta.html',
            'TSLA': 'tesla.html',
            'GOOGL': 'googl.html',
            'BRK-B': 'berkshire.html',
            'LLY': 'lilly.html',
            'AVGO': 'avgo.html',
            'V': 'visa.html',
            'JPM': 'jpm.html',
            'UNH': 'unh.html',
            'XOM': 'exxon.html',
            'MA': 'mastercard.html',
            'PG': 'pg.html',
            'HD': 'hd.html',
            'JNJ': 'jnj.html',
            'ABBV': 'abbv.html',
            'COST': 'cost.html',
            'NFLX': 'netflix.html',
            'CRM': 'crm.html',
            'BAC': 'bac.html',
            'KO': 'ko.html',
            'ORCL': 'oracle.html',
            'CSCO': 'csco.html',
            'CVX': 'chevron.html',
            'WFC': 'wfc.html',
            'AMD': 'amd.html',
            'LIN': 'lin.html',
            'TMO': 'tmo.html',
            'ADBE': 'adobe.html',
            'MRK': 'mrk.html',
            'DHR': 'dhr.html',
            'PEP': 'pepsi.html',
            'ABT': 'abt.html',
            'TMUS': 'tmobile.html',
            'VZ': 'vz.html',
            'TXN': 'txn.html',
            'QCOM': 'qcom.html',
            'WMT': 'walmart.html',
            'INTU': 'intuit.html',
            'PM': 'pm.html',
            'ACN': 'acn.html',
            'COP': 'cop.html',
            'CMCSA': 'comcast.html',
            'NEE': 'nee.html',
            'UPS': 'ups.html',
            'RTX': 'rtx.html',
            'HON': 'hon.html',
            'SPGI': 'spgi.html',
            'TGT': 'target.html',
            'IBM': 'ibm.html',
            'AMGN': 'amgen.html',
            'LOW': 'lowes.html',
            'SBUX': 'sbux.html',
            'CAT': 'cat.html',
            'GS': 'gs.html',
            'BKNG': 'booking.html',
            'MDT': 'mdt.html',
            'BLK': 'blk.html',
            'AXP': 'axp.html',
            'GILD': 'gild.html',
            'MDLZ': 'mdlz.html',
            'CVS': 'cvs.html',
            'ADP': 'adp.html',
            'ADI': 'adi.html',
            'VRTX': 'vrtx.html',
            'MU': 'micron.html',
            'LRCX': 'lrcx.html',
            'PANW': 'panw.html',
            'SYK': 'stryker.html',
            'AMAT': 'amat.html',
            'CRWD': 'crwd.html',
            'C': 'citi.html',
            'SO': 'so.html',
            'MMC': 'mmc.html',
            'PLD': 'pld.html',
            'REGN': 'regn.html',
            'CME': 'cme.html',
            'KLAC': 'klac.html',
            'MO': 'mo.html',
            'DUK': 'duke.html',
            'SHW': 'shw.html',
            'ICE': 'ice.html',
            'CB': 'cb.html',
            'USB': 'usb.html',
            'ZTS': 'zts.html',
            'APH': 'aph.html',
            'MCO': 'mco.html',
            'TJX': 'tjx.html',
            'WM': 'wm.html',
            'GE': 'ge.html',
            'PYPL': 'paypal.html',
            'FI': 'fi.html',
            'PGR': 'progressive.html',
            'DIS': 'dis.html',
            'BMY': 'bmy.html',
            'EOG': 'eog.html',
            'ITW': 'itw.html',
            'NOC': 'noc.html',
            'MMM': 'mmm.html',
            'GM': 'gm.html',
            'F': 'ford.html',
            'BA': 'boeing.html',
            'INTC': 'intel.html',
            'CCI': 'cci.html',
            'EMR': 'emr.html',
            'TFC': 'tfc.html',
            'BSX': 'bsx.html',
            'COF': 'cof.html',
            'CTRA': 'ctra.html',
            'DD': 'dd.html',
            'DOV': 'dov.html',
            'GEV': 'gev.html',
            'TXRH': 'txrh.html',
            'ISRG': 'isrg.html',
            'EQIX': 'eqix.html',
            'ETN': 'etn.html',
            'FCX': 'fcx.html'
        };
    }

    /**
     * キャッシュからデータを取得
     */
    getCachedData() {
        try {
            const cached = localStorage.getItem(this.cacheKey);
            if (!cached) return null;

            const { data, timestamp } = JSON.parse(cached);
            const now = Date.now();
            
            if (now - timestamp > this.cacheTimeout) {
                localStorage.removeItem(this.cacheKey);
                return null;
            }
            
            return data;
        } catch (error) {
            console.warn('Cache read error:', error);
            return null;
        }
    }

    /**
     * データをキャッシュに保存
     */
    setCachedData(data) {
        try {
            const cacheData = {
                data,
                timestamp: Date.now()
            };
            localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
        } catch (error) {
            console.warn('Cache write error:', error);
        }
    }

    /**
     * 個別銘柄HTMLファイルからメトリクスを抽出
     */
    async fetchStockDetails(ticker) {
        const filename = this.tickerToFileMap[ticker];
        if (!filename) {
            console.warn(`No file mapping found for ticker: ${ticker}`);
            return null;
        }

        try {
            const response = await fetch(`${this.detailsPath}${filename}`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            return this.extractMetricsFromDOM(doc);
        } catch (error) {
            console.warn(`Could not fetch ${ticker} details (${filename}):`, error.message);
            return null;
        }
    }

    /**
     * DOMからdata-count属性の値を抽出
     * 順序: 株価, 年初来リターン, 時価総額, PER
     */
    extractMetricsFromDOM(doc) {
        const dataCountElements = doc.querySelectorAll('[data-count]');
        
        if (dataCountElements.length < 4) {
            console.warn('Expected at least 4 data-count elements, found:', dataCountElements.length);
        }

        // data-count要素を順序で取得
        const metrics = {
            price: this.parseFloat(dataCountElements[0]?.getAttribute('data-count')),
            ytdPerformance: this.parseFloat(dataCountElements[1]?.getAttribute('data-count')),
            marketCap: this.parseFloat(dataCountElements[2]?.getAttribute('data-count')),
            peRatio: this.parseFloat(dataCountElements[3]?.getAttribute('data-count'))
        };

        // PERが0の場合はnullに変換（N/Aとして扱う）
        if (metrics.peRatio === 0) {
            metrics.peRatio = null;
        }

        return metrics;
    }

    /**
     * 安全な数値パース
     */
    parseFloat(value) {
        if (!value) return 0;
        const parsed = parseFloat(value);
        return isNaN(parsed) ? 0 : parsed;
    }

    /**
     * 全銘柄の同期処理（並行処理）
     */
    async syncAllStocks(stocksData) {
        // キャッシュチェック
        const cachedData = this.getCachedData();
        if (cachedData) {
            console.log('Using cached stock data');
            return this.applyCachedData(stocksData, cachedData);
        }

        console.log('Fetching fresh stock data from details pages...');
        
        // 並行処理でデータ取得
        const syncPromises = stocksData.map(async (stock) => {
            const metrics = await this.fetchStockDetails(stock.ticker);
            return {
                ticker: stock.ticker,
                metrics
            };
        });

        try {
            const results = await Promise.all(syncPromises);
            const syncedData = {};

            // 結果を適用
            results.forEach(({ ticker, metrics }) => {
                if (metrics) {
                    syncedData[ticker] = metrics;
                    
                    const stock = stocksData.find(s => s.ticker === ticker);
                    if (stock) {
                        stock.price = metrics.price;
                        stock.performance = metrics.ytdPerformance;
                        stock.marketCap = metrics.marketCap;
                        stock.peRatio = metrics.peRatio;
                    }
                }
            });

            // キャッシュに保存
            this.setCachedData(syncedData);
            
            const successfulTickers = Object.keys(syncedData);
            console.log(`Successfully synced data for ${successfulTickers.length}/${stocksData.length} stocks:`, successfulTickers.join(', '));
            return stocksData;

        } catch (error) {
            console.error('Error during stock synchronization:', error);
            return stocksData; // エラー時は元のデータを返す
        }
    }

    /**
     * キャッシュデータの適用
     */
    applyCachedData(stocksData, cachedData) {
        stocksData.forEach(stock => {
            const metrics = cachedData[stock.ticker];
            if (metrics) {
                stock.price = metrics.price;
                stock.performance = metrics.ytdPerformance;
                stock.marketCap = metrics.marketCap;
                stock.peRatio = metrics.peRatio;
            }
        });
        return stocksData;
    }

    /**
     * 単一銘柄の同期（即座に実行）
     */
    async syncSingleStock(stock) {
        const metrics = await this.fetchStockDetails(stock.ticker);
        if (metrics) {
            stock.price = metrics.price;
            stock.performance = metrics.ytdPerformance;
            stock.marketCap = metrics.marketCap;
            stock.peRatio = metrics.peRatio;
        }
        return stock;
    }

    /**
     * キャッシュクリア
     */
    clearCache() {
        localStorage.removeItem(this.cacheKey);
        console.log('Stock data cache cleared');
    }
}

// グローバルに公開
window.StockDataSynchronizer = StockDataSynchronizer;