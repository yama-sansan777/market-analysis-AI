# 🔄 既存システムから自動化システムへの移行ガイド

## 📋 移行手順

### **Step 1: バックアップ作成**
```bash
# 既存ファイルのバックアップ
cp -r archive_data archive_data_backup
cp -r live_data live_data_backup
cp index.html index_backup.html
```

### **Step 2: 新しいシステムのテスト**
```bash
# 強化版システムのテスト実行
npm run analyze

# 結果確認
ls -la _data/
cat _data/reportData.json
```

### **Step 3: 段階的移行**
1. **手動実行でテスト**
   ```bash
   npm run manual
   ```

2. **自動スケジュール開始**
   ```bash
   npm start
   ```

3. **監視と調整**
   ```bash
   # ログ確認
   tail -f logs/combined.log
   ```

## ⚠️ 注意事項

### **データ整合性の確保**
- 既存のJSONファイル形式との互換性確認
- 多言語対応のテスト
- アーカイブ機能の動作確認

### **エラーハンドリング**
- フォールバック機能のテスト
- エラー通知の設定確認
- ログファイルの監視

### **パフォーマンス監視**
- API制限の確認
- 処理時間の測定
- リソース使用量の監視

## 🔧 トラブルシューティング

### **よくある問題と解決策**

#### **1. API制限エラー**
```bash
# 解決策: APIキーの制限確認
# Alpha Vantage: 1分間に5回まで
# Gemini: 1分間に60回まで
```

#### **2. データ形式エラー**
```bash
# 解決策: スキーマ検証の確認
node -e "require('./ai_validator').validateAIResponse()"
```

#### **3. 静的サイト生成エラー**
```bash
# 解決策: テンプレートファイルの確認
ls -la templates/
cat templates/index.hbs
```

## 📊 移行チェックリスト

- [ ] バックアップ作成完了
- [ ] APIキー設定完了
- [ ] 依存関係インストール完了
- [ ] テスト実行成功
- [ ] 手動実行テスト成功
- [ ] 自動スケジュール設定完了
- [ ] ログ監視設定完了
- [ ] エラー通知設定完了
- [ ] フォールバック機能テスト完了
- [ ] 本番環境での動作確認完了

## 🎯 移行完了後の運用

### **日常的な監視**
```bash
# ログ確認
tail -f logs/combined.log

# エラー確認
grep "ERROR" logs/error.log

# データ確認
ls -la _data/
```

### **定期メンテナンス**
- 週次: ログファイルの確認
- 月次: API使用量の確認
- 四半期: システム全体の見直し