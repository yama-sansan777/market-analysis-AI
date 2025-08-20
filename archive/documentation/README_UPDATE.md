# YOHOU Nikkei AI - 最新記事更新ツール

## 概要

このツールは、新しい市場分析記事を `live_data/latest.json` に反映し、古い記事を自動的にアーカイブするための自動化スクリプトです。

## 運用フロー

1. **現在の記事をアーカイブ**: `live_data/latest.json` を `archive_data/（日付）（am/pm）.json` としてコピー
2. **新しい記事で上書き**: 新しい記事で `live_data/latest.json` を上書き
3. **manifest.json更新**: `archive_data/manifest.json` の先頭に新記事情報を追記

## 使用方法

### Windows の場合

```bash
# バッチファイルを使用（推奨）
update_latest.bat 2025.07.08am.json

# または直接Node.jsスクリプトを実行
node update_latest.js 2025.07.08am.json
```

### Linux/Mac の場合

```bash
# シェルスクリプトを使用（推奨）
chmod +x update_latest.sh
./update_latest.sh 2025.07.08am.json

# または直接Node.jsスクリプトを実行
node update_latest.js 2025.07.08am.json
```

## 実行例

```bash
# 2025年7月8日午前の記事を最新記事として設定
update_latest.bat 2025.07.08am.json
```

実行すると以下の処理が自動で行われます：

1. 現在の `live_data/latest.json` を `archive_data/2025.07.08am.json` として保存
2. `2025.07.08am.json` を `live_data/latest.json` としてコピー
3. `archive_data/manifest.json` の先頭に新しい記事情報を追加

## ファイル構造

```
market-analysis-AI/
├── live_data/
│   └── latest.json          # 現在の最新記事
├── archive_data/
│   ├── manifest.json        # 記事情報のインデックス
│   ├── 2025.07.08am.json   # アーカイブされた記事
│   └── ...                  # その他のアーカイブ記事
├── 2025.07.08am.json       # 新しい記事ファイル
├── update_latest.js         # メインスクリプト
├── update_latest.bat        # Windows用バッチファイル
└── update_latest.sh         # Linux/Mac用シェルスクリプト
```

## 注意事項

- 新しい記事ファイルは、ルートディレクトリに配置してください
- 記事ファイルは有効なJSON形式である必要があります
- `manifest.json` は最大50件まで保持されます（古い記事は自動削除）
- アーカイブファイル名は自動的に日付とセッション（am/pm）で生成されます

## トラブルシューティング

### よくあるエラー

1. **ファイルが見つかりません**
   - 記事ファイルが正しい場所にあるか確認
   - ファイル名のスペルを確認

2. **JSON形式エラー**
   - 記事ファイルが有効なJSON形式か確認
   - 必須フィールド（session, date, summary等）が含まれているか確認

3. **権限エラー**
   - ファイルの書き込み権限を確認
   - 管理者権限で実行を試行

### ログの確認

スクリプト実行時には詳細なログが表示されます。エラーが発生した場合は、表示されるメッセージを確認してください。

## 手動での復旧

自動化ツールでエラーが発生した場合の手動復旧手順：

1. `live_data/latest.json` のバックアップを確認
2. `archive_data/manifest.json` の整合性を確認
3. 必要に応じて手動でファイルを移動・修正

## サポート

問題が発生した場合は、以下を確認してください：

- Node.jsがインストールされているか
- ファイルパスが正しいか
- ファイルの権限設定が適切か 