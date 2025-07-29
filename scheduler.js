const cron = require('node-cron');
const MarketAnalysisAutomation = require('./auto_market_analysis');

console.log('🚀 スケジューラーが起動しました。');
console.log('毎日、日本時間の午後18時に市場分析を自動実行します。');
console.log('このウィンドウを閉じるとスケジューラーは停止します。');

class MarketAnalysisScheduler {
  constructor() {
    this.automation = new MarketAnalysisAutomation();
  }

  // 毎日午後18時（日本時間）に実行
  startDailySchedule() {
    console.log('📅 スケジューラー開始: 毎日午後18時（日本時間）に実行');
    
    // 日本時間の月曜日から金曜日の毎日18:00に実行
    // 書式: '分 時 日 月 曜日'
    cron.schedule('0 18 * * 1-5', async () => {
      console.log(`[SCHEDULE] 定時実行タスクを開始します: ${new Date().toLocaleString()}`);
      try {
        await this.automation.run();
        console.log('✅ スケジュール実行完了');
      } catch (error) {
        console.error('❌ スケジュール実行エラー:', error);
      }
    }, {
      scheduled: true,
      timezone: "Asia/Tokyo"
    });
  }

  // 手動実行
  async runManual() {
    console.log('🔧 手動実行開始...');
    try {
      await this.automation.run();
      console.log('✅ 手動実行完了');
    } catch (error) {
      console.error('❌ 手動実行エラー:', error);
    }
  }

  // テスト実行
  async runTest() {
    console.log('🧪 テスト実行開始...');
    try {
      // テスト用の軽量版を実行
      await this.automation.collectMarketData();
      console.log('✅ テスト実行完了');
    } catch (error) {
      console.error('❌ テスト実行エラー:', error);
    }
  }
}

// 実行
if (require.main === module) {
  const scheduler = new MarketAnalysisScheduler();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'start':
      scheduler.startDailySchedule();
      console.log('スケジューラーが開始されました。Ctrl+Cで停止してください。');
      break;
    case 'manual':
      scheduler.runManual();
      break;
    case 'test':
      scheduler.runTest();
      break;
    default:
      console.log('使用方法:');
      console.log('  node scheduler.js start   - スケジューラー開始');
      console.log('  node scheduler.js manual  - 手動実行');
      console.log('  node scheduler.js test    - テスト実行');
  }
}

module.exports = MarketAnalysisScheduler;