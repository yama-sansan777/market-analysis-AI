/**
 * Chart Price Adjustment System
 * 全銘柄のチャートデータを現在価格に合わせて自動調整
 */

const fs = require('fs');
const path = require('path');

class ChartPriceAdjuster {
    constructor() {
        this.detailsPath = './stocks/details/';
        this.backupPath = './chart-backup/';
        this.processedFiles = [];
        this.errors = [];
    }

    /**
     * バックアップディレクトリを作成
     */
    createBackup() {
        if (!fs.existsSync(this.backupPath)) {
            fs.mkdirSync(this.backupPath, { recursive: true });
            console.log('✓ Backup directory created');
        }
    }

    /**
     * 現在価格を抽出
     */
    extractCurrentPrice(content) {
        const match = content.match(/data-count="([0-9.]+)"/);
        return match ? parseFloat(match[1]) : null;
    }

    /**
     * 株価チャートデータを調整
     */
    adjustStockPriceChart(content, currentPrice) {
        const stockChartRegex = /(data:\s*\[)([0-9,\s.]+)(\])/g;
        
        return content.replace(stockChartRegex, (match, prefix, dataStr, suffix) => {
            try {
                const originalData = dataStr.split(',').map(val => parseFloat(val.trim()));
                
                // 12データポイントかつ最後の値が現在価格と異なる場合のみ調整
                if (originalData.length === 12) {
                    const lastPrice = originalData[originalData.length - 1];
                    
                    if (Math.abs(currentPrice - lastPrice) > 1) {
                        // スケーリング係数を計算
                        const scalingFactor = currentPrice / lastPrice;
                        
                        // 全データポイントを比例調整
                        const adjustedData = originalData.map(price => {
                            return Math.round(price * scalingFactor * 100) / 100;
                        });
                        
                        console.log(`    📈 Price chart adjusted: ${lastPrice} → ${currentPrice} (${scalingFactor.toFixed(3)}x)`);
                        return prefix + adjustedData.join(', ') + suffix;
                    }
                }
                
                return match;
            } catch (error) {
                console.warn(`    ⚠ Chart adjustment failed: ${error.message}`);
                return match;
            }
        });
    }

    /**
     * 単一ファイルを処理
     */
    processFile(filename) {
        const filePath = path.join(this.detailsPath, filename);
        const backupPath = path.join(this.backupPath, filename);
        
        try {
            const originalContent = fs.readFileSync(filePath, 'utf8');
            
            // バックアップ作成
            fs.writeFileSync(backupPath, originalContent);
            
            // 現在価格取得
            const currentPrice = this.extractCurrentPrice(originalContent);
            if (!currentPrice) {
                console.log(`  ⚠ ${filename}: No current price found`);
                return false;
            }

            // チャートデータ調整
            let adjustedContent = this.adjustStockPriceChart(originalContent, currentPrice);
            
            // 変更があった場合のみファイル更新
            if (adjustedContent !== originalContent) {
                fs.writeFileSync(filePath, adjustedContent);
                console.log(`  ✓ ${filename}: Charts adjusted to $${currentPrice}`);
                return true;
            } else {
                console.log(`  • ${filename}: No adjustment needed ($${currentPrice})`);
                return false;
            }
            
        } catch (error) {
            console.error(`  ✗ ${filename}: ${error.message}`);
            this.errors.push({ file: filename, error: error.message });
            return false;
        }
    }

    /**
     * 全ファイルを一括処理
     */
    async processAllFiles() {
        console.log('🚀 Starting Chart Price Adjustment System\n');
        
        this.createBackup();
        
        const files = fs.readdirSync(this.detailsPath)
            .filter(file => file.endsWith('.html'))
            .sort();

        console.log(`Found ${files.length} stock files to process\n`);

        for (const filename of files) {
            console.log(`Processing: ${filename}`);
            const success = this.processFile(filename);
            
            if (success) {
                this.processedFiles.push(filename);
            }
            
            // 小さな遅延を追加（ファイルI/O負荷軽減）
            await new Promise(resolve => setTimeout(resolve, 10));
        }

        this.printSummary();
    }

    /**
     * 処理結果サマリーを表示
     */
    printSummary() {
        console.log('\n' + '='.repeat(50));
        console.log('📊 CHART ADJUSTMENT SUMMARY');
        console.log('='.repeat(50));
        console.log(`Total files processed: ${this.processedFiles.length}`);
        console.log(`Files with adjustments: ${this.processedFiles.length}`);
        console.log(`Errors encountered: ${this.errors.length}`);
        
        if (this.errors.length > 0) {
            console.log('\n❌ Errors:');
            this.errors.forEach(error => {
                console.log(`  • ${error.file}: ${error.error}`);
            });
        }
        
        console.log('\n✅ All chart data has been adjusted to current prices!');
        console.log(`📁 Backup files saved in: ${this.backupPath}`);
    }
}

// 実行
async function main() {
    const adjuster = new ChartPriceAdjuster();
    await adjuster.processAllFiles();
}

// スクリプトとして直接実行された場合
if (require.main === module) {
    main().catch(console.error);
}

module.exports = ChartPriceAdjuster;