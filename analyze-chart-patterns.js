/**
 * チャートデータパターンの分析と価格乖離の算出
 */

const fs = require('fs');

// 分析対象の銘柄（代表的なもの）
const analysisFiles = [
    'apple.html',
    'microsoft.html', 
    'nvidia.html',
    'meta.html',
    'amazon.html'
];

console.log('=== Chart Data Pattern Analysis ===\n');

analysisFiles.forEach(filename => {
    try {
        const filePath = `./stocks/details/${filename}`;
        const content = fs.readFileSync(filePath, 'utf8');
        
        // 現在価格取得
        const dataCountMatch = content.match(/data-count="([0-9.]+)"/);
        const currentPrice = dataCountMatch ? parseFloat(dataCountMatch[1]) : 0;
        
        // 株価推移チャートデータ抽出
        const stockChartMatch = content.match(/data:\s*\[([0-9,\s.]+)\]/);
        if (stockChartMatch) {
            const chartData = stockChartMatch[1].split(',').map(val => parseFloat(val.trim()));
            const chartLatestPrice = chartData[chartData.length - 1];
            const priceDifference = currentPrice - chartLatestPrice;
            const percentageDiff = ((priceDifference / chartLatestPrice) * 100).toFixed(2);
            
            console.log(`📊 ${filename.replace('.html', '').toUpperCase()}`);
            console.log(`   Current Price: $${currentPrice}`);
            console.log(`   Chart Latest:  $${chartLatestPrice}`);
            console.log(`   Difference:    $${priceDifference.toFixed(2)} (${percentageDiff}%)`);
            console.log(`   Chart Points:  ${chartData.length} data points`);
            console.log(`   Full Data:     [${chartData.join(', ')}]`);
            
            // 売上・利益データも探す
            const revenueMatch = content.match(/data:\s*\[([0-9,\s.]+)\].*backgroundColor.*yAxisID.*y/);
            if (revenueMatch) {
                const revenueData = revenueMatch[1].split(',').map(val => parseFloat(val.trim()));
                console.log(`   Revenue Data:  [${revenueData.join(', ')}] (${revenueData.length} points)`);
            }
            
            console.log('');
        } else {
            console.log(`⚠ ${filename}: No chart data found`);
        }
        
    } catch (error) {
        console.error(`✗ ${filename}: ${error.message}`);
    }
});

// 共通パターンの特定
console.log('\n=== Pattern Summary ===');
console.log('• Stock Price Charts: 12 data points (monthly progression)');
console.log('• Revenue Charts: 3-5 data points (annual data)');  
console.log('• Chart final value should match current price (data-count)');
console.log('• Need proportional scaling of historical data');