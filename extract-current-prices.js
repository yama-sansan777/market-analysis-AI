/**
 * 全銘柄ファイルから現在価格と銘柄情報を抽出するスクリプト
 */

const fs = require('fs');
const path = require('path');

const detailsPath = './stocks/details/';
const files = fs.readdirSync(detailsPath).filter(file => file.endsWith('.html'));

console.log(`Found ${files.length} stock detail files\n`);

const stockData = [];

files.forEach(filename => {
    try {
        const filePath = path.join(detailsPath, filename);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // data-count属性から価格データを抽出（順序: 株価, YTD, 時価総額, PER）
        const dataCountMatches = content.match(/data-count="([0-9.]+)"/g);
        
        if (dataCountMatches && dataCountMatches.length >= 4) {
            const values = dataCountMatches.slice(0, 4).map(match => {
                const value = match.match(/data-count="([0-9.]+)"/)[1];
                return parseFloat(value);
            });
            
            // 銘柄名抽出（title tagから）
            const titleMatch = content.match(/<title>([^|]+)/);
            const stockName = titleMatch ? titleMatch[1].trim() : filename.replace('.html', '');
            
            // チャートデータの存在確認
            const hasChartData = content.includes('data: [') && content.includes('Chart');
            
            stockData.push({
                file: filename,
                ticker: filename.replace('.html', '').toUpperCase(),
                name: stockName,
                currentPrice: values[0],
                ytdReturn: values[1],
                marketCap: values[2],
                peRatio: values[3],
                hasChart: hasChartData
            });
            
            console.log(`✓ ${filename.padEnd(20)} | $${values[0].toString().padStart(8)} | YTD: ${values[1]}% | Chart: ${hasChartData ? '✓' : '✗'}`);
        } else {
            console.log(`⚠ ${filename.padEnd(20)} | No data-count attributes found`);
        }
    } catch (error) {
        console.error(`✗ ${filename.padEnd(20)} | Error: ${error.message}`);
    }
});

console.log(`\n=== Summary ===`);
console.log(`Total files: ${files.length}`);
console.log(`Successfully processed: ${stockData.length}`);
console.log(`Files with charts: ${stockData.filter(s => s.hasChart).length}`);

// 価格順でソート
stockData.sort((a, b) => b.currentPrice - a.currentPrice);

console.log(`\n=== Top 10 by Price ===`);
stockData.slice(0, 10).forEach(stock => {
    console.log(`${stock.ticker.padEnd(6)} | $${stock.currentPrice.toString().padStart(8)} | ${stock.name}`);
});

// JSONファイルに出力
fs.writeFileSync('stock-prices-data.json', JSON.stringify(stockData, null, 2));
console.log(`\n✓ Data saved to stock-prices-data.json`);