# GitHub Pages 自動デプロイ設定手順

## 🎯 概要
このプロジェクトは **完全自動化** されており、PC側で市場分析データを更新してGitHubにプッシュするだけで、GitHub Actionsが自動でサイトをビルド・デプロイします。

## 📋 初回設定手順

### 1. GitHub Pages の有効化
1. GitHubリポジトリのページを開く
2. **Settings** タブをクリック
3. 左メニューから **Pages** を選択
4. **Source** を **GitHub Actions** に設定

### 2. スケジューラーの実行
PC側で以下を実行してスケジューラーを起動：
```bash
npm start
# または
pm2 start scheduler.js --name "market-analysis-scheduler"
```

## 🔄 自動化フロー

### PC側（毎朝8時 JST）
1. 📊 市場データ収集
2. 🤖 AI分析実行
3. 📄 JSONファイル更新
4. 📤 GitHubへプッシュ

### GitHub側（自動）
1. 🔔 プッシュ検知
2. 🏗️ Eleventyビルド実行
3. 🚀 GitHub Pagesデプロイ
4. ✅ サイト更新完了

## 📁 監視対象ファイル
GitHub Actionsは以下のファイル変更時に起動：
- `live_data/**` - 最新分析データ
- `archive_data/**` - 過去データ
- `src/**` - テンプレートファイル
- `lang.js` - 言語システム
- `translations/**` - 翻訳ファイル
- `.eleventy.js` - ビルド設定
- `package.json` - 依存関係

## 🛠️ トラブルシューティング

### Actions が起動しない場合
1. GitHubリポジトリの **Actions** タブを確認
2. ワークフローが有効になっているか確認
3. Pagesの設定が **GitHub Actions** になっているか確認

### ビルドエラーの場合
1. **Actions** タブでエラーログを確認
2. `package.json` の依存関係が正しいか確認
3. Node.js バージョン（18）の互換性を確認

### スケジューラーが停止した場合
```bash
# PM2で確認
pm2 status

# 再起動
pm2 restart market-analysis-scheduler

# 手動実行
npm run manual
```

## 🔧 開発・テスト

### ローカル開発
```bash
npm run dev  # http://localhost:8080
```

### 手動ビルド
```bash
npm run build  # _site/ フォルダに生成
```

### 手動分析実行
```bash
npm run manual  # 市場分析を即座に実行
```

## 🌐 公開URL
サイトは以下のURLで公開されます：
```
https://[ユーザー名].github.io/[リポジトリ名]/
```

## ✅ 完了チェックリスト
- [ ] GitHub Pages設定完了
- [ ] スケジューラー起動確認
- [ ] 初回プッシュ実行
- [ ] Actions動作確認
- [ ] サイト公開確認