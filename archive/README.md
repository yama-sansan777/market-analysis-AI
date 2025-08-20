# アーカイブフォルダ

このフォルダには、プロジェクトの整理により移動された未使用・重複・開発用ファイルが含まれています。

## フォルダ構成

### `/backup-files/`
- バックアップされたHTMLファイル
- `archive-backup.html` - 旧アーカイブページ
- `pickup-backup.html` - pickup.html旧版
- `pickup2.html` - pickup.htmlの統合前版
- `old-index.html` - index.html旧版
- `reportData.json` - 重複データファイル

### `/development-files/`
- 開発・自動化用スクリプト
- AI検証、自動翻訳、市場データ収集など
- テンプレートファイル（JSON）
- 実行設定ファイル

### `/documentation/`
- プロジェクト文書
- セットアップガイド、使用方法
- 移行ガイド、自動化ガイドなど

### `/unused-files/`
- 使用されていないHTMLページ
- disclaimer.html, latest.html など
- docsフォルダ
- test-multilang.html

## 注意事項

### 削除推奨（権限の問題で移動できなかったフォルダ）
以下のフォルダは手動で削除することを推奨します：
- `_site/` - 重複した古いサイトファイル
- `src/` - 使用されていない開発用フォルダ構造
- `public/` - 空のpublicフォルダ
- `logs/` - 開発用ログファイル
- `utils/` - 使用されていないユーティリティ

### 必要に応じて復元可能
アーカイブされたファイルは、必要に応じて元の位置に戻すことができます。

## 現在の本番環境

整理後、以下のファイル・フォルダが本番環境として残されています：

### HTMLページ
- `index.html` - メインページ
- `pickup.html` - クレイマー保有銘柄
- `nvidia.html` - NVIDIA詳細ページ
- `about.html`, `ipo.html`, `indicators.html`, `terms.html`

### システムファイル
- `lang.js` - 言語システム
- `translations/` - 翻訳ファイル
- `image/` - 画像リソース
- `archive_data/`, `live_data/`, `_data/` - データファイル

### 開発環境
- `package.json`, `node_modules/` - Node.js設定
- `update_latest.*` - データ更新スクリプト
- `CLAUDE.md` - プロジェクト文書
- `env.example` - 環境設定例