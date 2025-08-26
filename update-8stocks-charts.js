/**
 * 8銘柄の修正されたdata-count値に基づいてチャートデータを調整
 */

const fs = require('fs');
const ChartPriceAdjuster = require('./chart-price-adjuster.js');

class EightStocksUpdater extends ChartPriceAdjuster {
    constructor() {
        super();
        // 修正対象の8銘柄のみを処理
        this.targetStocks = [
            'ctra.html', 'gev.html', 'cof.html', 'bmy.html',
            'sbux.html', 'dd.html', 'dov.html', 'txrh.html'
        ];
        this.backupPath = './chart-backup-8stocks/';
    }

    /**
     * 8銘柄のみを処理
     */
    async processTargetStocks() {
        console.log('🔧 Updating Charts for 8 Corrected Stocks\n');
        
        this.createBackup();
        
        console.log(`Processing ${this.targetStocks.length} target stocks\n`);

        let adjustedCount = 0;
        
        for (const filename of this.targetStocks) {
            console.log(`Processing: ${filename}`);
            
            const success = this.processFile(filename);
            if (success) {
                adjustedCount++;
            }
            
            // 小さな遅延
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        console.log('\n' + '='.repeat(50));
        console.log('📊 8-STOCK CHART UPDATE SUMMARY');
        console.log('='.repeat(50));
        console.log(`Target stocks: ${this.targetStocks.length}`);
        console.log(`Charts adjusted: ${adjustedCount}`);
        console.log(`Errors: ${this.errors.length}`);
        
        if (this.errors.length > 0) {
            console.log('\n❌ Errors:');
            this.errors.forEach(error => {
                console.log(`  • ${error.file}: ${error.error}`);
            });
        }
        
        console.log('\n✅ 8-stock chart adjustment completed!');
        console.log(`📁 Backup files saved in: ${this.backupPath}`);
        
        // 調整結果のサマリー表示
        this.showAdjustmentSummary();
    }

    /**
     * 調整結果のサマリー表示
     */
    showAdjustmentSummary() {
        console.log('\n📋 Price Adjustment Summary:');
        console.log('━'.repeat(60));
        
        this.targetStocks.forEach(filename => {
            try {
                const filePath = `./stocks/details/${filename}`;
                const content = fs.readFileSync(filePath, 'utf8');
                const currentPrice = this.extractCurrentPrice(content);
                
                if (currentPrice) {
                    const ticker = filename.replace('.html', '').toUpperCase();
                    console.log(`${ticker.padEnd(6)} | $${currentPrice.toString().padStart(8)} | Charts updated`);
                }
            } catch (error) {
                console.log(`${filename.padEnd(15)} | Error reading price`);
            }
        });
    }
}

// 実行
async function main() {
    const updater = new EightStocksUpdater();
    await updater.processTargetStocks();
}

if (require.main === module) {
    main().catch(console.error);
}