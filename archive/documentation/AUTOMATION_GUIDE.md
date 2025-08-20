# 🚀 完全自動化市場分析システム運用ガイド

## 📋 概要

このシステムは、Gemini Deep ResearchとClaude Codeを活用して、市場分析からサイト更新までを完全自動化します。

## 🏗️ システム構成

### **主要コンポーネント**
1. **`auto_market_analysis.js`** - メイン自動化スクリプト
2. **`market_data_collector.js`** - 市場データ収集
3. **`scheduler.js`** - スケジューラー
4. **`update_latest.js`** - サイト更新（既存）

### **API構成**
- **Gemini API** - Deep Research分析
- **Alpha Vantage** - リアルタイム株価
- **Polygon.io** - 市場データ
- **Fear & Greed Index** - センチメント
- **その他** - テクニカル指標

## ⚙️ セットアップ手順

### **1. 依存関係インストール**
```bash
npm install
```

### **2. 環境変数設定**
```bash
cp env.example .env
```

`.env`ファイルを編集：
```env
GEMINI_API_KEY=your_gemini_api_key_here
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key_here
POLYGON_API_KEY=your_polygon_api_key_here
```

### **3. APIキー取得**

#### **Gemini API**
1. [Google AI Studio](https://makersuite.google.com/app/apikey)にアクセス
2. APIキーを取得
3. `.env`に設定

#### **Alpha Vantage**
1. [Alpha Vantage](https://www.alphavantage.co/support/#api-key)で無料アカウント作成
2. APIキーを取得
3. `.env`に設定

#### **Polygon.io**
1. [Polygon.io](https://polygon.io/)でアカウント作成
2. APIキーを取得
3. `.env`に設定

## 🚀 実行方法

### **手動実行**
```bash
# 単発実行
npm run analyze

# 手動実行（スケジューラー経由）
npm run manual
```

### **自動スケジュール実行**
```bash
# スケジューラー開始（毎日午前9時実行）
npm start
```

### **テスト実行**
```bash
# データ収集テスト
npm run test
```

## 📊 ワークフロー

### **1. データ収集フェーズ**
```
市場データAPI → リアルタイム株価・指標取得
```

### **2. Gemini分析フェーズ**
```
収集データ → Gemini Deep Research → 構造化分析結果
```

### **3. JSON生成フェーズ**
```
分析結果 → テンプレート適用 → 多言語JSON生成
```

### **4. サイト更新フェーズ**
```
JSONファイル → アーカイブ → サイト更新
```

## 🔧 カスタマイズ

### **分析内容の調整**
`auto_market_analysis.js`の`buildAnalysisPrompt()`関数を編集：

```javascript
buildAnalysisPrompt(marketData) {
  return `
  カスタム分析プロンプト
  ${JSON.stringify(marketData, null, 2)}
  `;
}
```

### **スケジュール変更**
`scheduler.js`の`startDailySchedule()`関数を編集：

```javascript
// 毎日午前8時に変更する場合
cron.schedule('0 8 * * *', async () => {
  // 実行処理
}, {
  timezone: "Asia/Tokyo"
});
```

### **API追加**
`market_data_collector.js`に新しいAPI関数を追加：

```javascript
async getNewData() {
  // 新しいAPI実装
}
```

## 📈 監視・ログ

### **ログ確認**
```bash
# ログファイル確認
tail -f logs/market_analysis.log
```

### **エラー監視**
```bash
# エラーログ確認
grep "ERROR" logs/market_analysis.log
```

## 🔍 トラブルシューティング

### **よくある問題**

#### **1. API制限エラー**
```
解決策: APIキーの制限を確認し、必要に応じて有料プランにアップグレード
```

#### **2. Gemini応答エラー**
```
解決策: プロンプトの調整、APIキーの確認
```

#### **3. データ取得失敗**
```
解決策: ネットワーク接続確認、APIキーの有効性確認
```

### **デバッグ方法**
```bash
# 詳細ログで実行
DEBUG=* npm run analyze

# 特定のデータ収集テスト
node -e "require('./market_data_collector').getSP500Data()"
```

## 📊 パフォーマンス最適化

### **API制限対策**
- リクエスト間隔の調整
- キャッシュ機能の実装
- エラー時の再試行ロジック

### **処理速度向上**
- 並列処理の実装
- 不要なAPI呼び出しの削減
- データベースキャッシュの活用

## 🔒 セキュリティ

### **APIキー管理**
- `.env`ファイルをGitにコミットしない
- 定期的なAPIキーのローテーション
- 最小権限の原則

### **エラーハンドリング**
- 機密情報のログ出力禁止
- 適切なエラーメッセージ
- 自動復旧機能

## 📞 サポート

### **問題報告**
1. エラーログの確認
2. 環境設定の確認
3. APIキーの有効性確認
4. ネットワーク接続確認

### **改善提案**
- 新しいAPIの追加
- 分析ロジックの改善
- UI/UXの向上

## 🎯 ベストプラクティス

### **運用**
- 定期的なログ確認
- API使用量の監視
- バックアップの作成

### **開発**
- コードの可読性維持
- 適切なコメント記述
- テストケースの作成

### **品質管理**
- 分析結果の品質チェック
- 多言語翻訳の精度確認
- サイト表示の確認

---

**最終更新**: 2025年1月28日
**バージョン**: 1.0.0