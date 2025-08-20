# 多言語対応サイト運用ガイド

## 概要
このガイドでは、英語と日本語の切り替え対応サイトの効率的な運用方法について説明します。

## ファイル構造

### テンプレートファイル
- `article_template_multilingual.json` - 多言語対応の完全テンプレート
- `article_template_simple.json` - 従来構造の簡易テンプレート

### 更新スクリプト
- `update_latest.js` - 最新記事の更新スクリプト
- `update_latest.bat` - Windows用バッチファイル

## 運用方法

### 1. 新しい記事の作成

#### 方法A: 多言語対応テンプレートを使用（推奨）
```bash
# テンプレートをコピー
cp article_template_multilingual.json archive_data/2025.7.27pm.json

# ファイルを編集（日本語と英語の両方を記入）
# 編集後、更新スクリプトを実行
node update_latest.js 2025.7.27pm.json
```

#### 方法B: 簡易テンプレートを使用
```bash
# テンプレートをコピー
cp article_template_simple.json archive_data/2025.7.27pm.json

# 日本語版のみ編集
# 更新スクリプトが自動的に英語版を生成
node update_latest.js 2025.7.27pm.json
```

### 2. 記事の更新

#### Windowsの場合
```bash
# バッチファイルを使用
update_latest.bat 2025.7.27pm.json
```

#### その他のOS
```bash
# Node.jsスクリプトを直接実行
node update_latest.js 2025.7.27pm.json
```

### 3. データ構造の説明

#### 多言語対応構造（推奨）
```json
{
  "date": "2025年7月27日",
  "session": "7月27日 市場分析",
  "languages": {
    "ja": {
      // 日本語版のデータ
    },
    "en": {
      // 英語版のデータ
    }
  }
}
```

#### 従来構造
```json
{
  "date": "2025年7月27日",
  "session": "7月27日 市場分析",
  "summary": {
    // 日本語版のデータ
  }
}
```

## 運用のベストプラクティス

### 1. 記事作成時の注意点
- **多言語対応テンプレート**を使用することを強く推奨
- 日本語と英語の内容は必ず一致させる
- 日付形式は統一する（例：2025年7月27日）

### 2. 更新時の確認事項
- ファイル名は日付形式で統一（例：2025.7.27pm.json）
- アーカイブファイルが正しく生成されているか確認
- manifest.jsonが更新されているか確認

### 3. トラブルシューティング

#### エラーが発生した場合
1. ファイルパスが正しいか確認
2. JSON形式が正しいか確認
3. 必要なディレクトリが存在するか確認

#### 英語版が表示されない場合
1. `languages`構造が正しく設定されているか確認
2. 英語版のデータが存在するか確認

## ファイル命名規則

### 記事ファイル
- 形式：`YYYY.M.DD[am|pm].json`
- 例：`2025.7.27pm.json`

### アーカイブファイル
- 形式：`YYYY.M.DD.json`
- 例：`2025.7.27.json`

## 運用フロー例

### 朝の分析更新
1. `article_template_multilingual.json`をコピー
2. ファイル名を`2025.7.27am.json`に変更
3. 日本語版と英語版の両方を編集
4. `node update_latest.js 2025.7.27am.json`を実行
5. ブラウザで確認

### 午後の分析更新
1. `article_template_multilingual.json`をコピー
2. ファイル名を`2025.7.27pm.json`に変更
3. 日本語版と英語版の両方を編集
4. `node update_latest.js 2025.7.27pm.json`を実行
5. ブラウザで確認

## 注意事項

- 英語版の翻訳は必ず手動で行い、自動生成に依存しない
- データの整合性を常に確認する
- 定期的にバックアップを取る
- 更新前に必ずテスト環境で確認する 