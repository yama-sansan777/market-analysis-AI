# 多言語対応システム実装完了

## 概要
YOHOU US Stock AIサイトの完全な多言語対応（日本語・英語）が実装されました。

## 実装された変更点

### 1. データ構造の多言語対応
- `latest.json`の構造を変更:
```json
{
  "date": "2025年7月25日",
  "session": "7月25日 市場分析",
  "languages": {
    "ja": { /* 日本語版の全データ */ },
    "en": { /* 英語版の全データ */ }
  }
}
```

### 2. テンプレートファイル
- `multilingual_template.json`: 新しい記事作成時のテンプレート
- 日英両方の完全なデータ構造を含む

### 3. 更新スクリプト
- `update_latest.js`: 多言語対応に完全対応
- 従来の日本語のみのファイルから多言語構造を自動生成
- コマンドライン引数での運用：`node update_latest.js 2025.7.27pm.json`

### 4. フロントエンド
- `index.html`: 多言語データ構造に対応、言語切り替えボタン追加
- `archive.html`: 多言語対応、言語切り替えボタン追加
- 既存の`lang.js`システムと連携

### 5. バッチファイル
- `update_latest.bat`: Windows用、引数対応、エラーハンドリング強化
- `update_latest.sh`: Unix/Linux/Mac用、既存機能を維持

## 新しい運用方法

### 記事更新手順
```bash
# Windows
update_latest.bat 2025.7.27pm.json

# Unix/Linux/Mac  
./update_latest.sh 2025.7.27pm.json

# 直接実行
node update_latest.js 2025.7.27pm.json
```

### 新しい記事作成時
1. `multilingual_template.json`をコピー
2. 日本語と英語の両方のコンテンツを編集
3. `archive_data/`フォルダに保存
4. 更新スクリプトで`latest.json`に反映

## 後方互換性
- 従来の日本語のみのJSONファイルも自動的に多言語構造に変換
- 既存のアーカイブファイルはそのまま動作
- UIの既存翻訳システム（lang.js）をそのまま活用

## 注意事項
- 英語版コンテンツは現在「[EN]」プレフィックス付きで自動生成
- 実際の英語翻訳は手動で行うことを推奨
- `live_data/latest_backup.json`にバックアップを保存済み

## ファイル構成
```
market-analysis-AI/
├── multilingual_template.json (新規)
├── convert_to_multilingual.js (新規)
├── update_latest.js (更新済み)
├── index.html (更新済み)
├── archive.html (更新済み)
├── update_latest.bat (更新済み)
├── update_latest.sh (既存)
├── live_data/
│   ├── latest.json (多言語構造に変換済み)
│   └── latest_backup.json (バックアップ)
└── archive_data/
    └── (既存ファイルはそのまま)
```

これで日本語・英語の完全な切り替えが可能になり、グローバルなユーザーに対応できるようになりました。