# 多言語対応サイト運用ガイド - 方法A（推奨）

## 概要

このガイドは、多言語対応テンプレートを使用した市場分析サイトの運用方法について説明します。日本語と英語の両方のコンテンツを同時に管理し、効率的な更新ワークフローを実現します。

## ファイル構造

```
market-analysis-AI/
├── live_data/
│   └── latest.json          # 最新記事（多言語対応）
├── archive_data/
│   ├── manifest.json        # アーカイブ一覧
│   ├── 2025.7.27pm.json    # 過去記事（多言語対応）
│   └── ...
├── article_template_multilingual.json  # 多言語対応テンプレート
├── update_latest.js         # 更新スクリプト
├── update_latest.bat        # Windows実行バッチ
└── USAGE_GUIDE_MULTILINGUAL.md  # このガイド
```

## 運用ワークフロー

### 1. 新規記事作成

#### ステップ1: テンプレートの準備
```bash
# テンプレートファイルをコピー
cp article_template_multilingual.json archive_data/新記事ファイル名.json
```

#### ステップ2: 記事内容の入力
`archive_data/新記事ファイル名.json`を編集：

```json
{
  "date": "2025年7月27日",
  "session": "米国株予測",
  "languages": {
    "ja": {
      "summary": {
        "evaluation": "買い",
        "score": 75,
        "headline": "米国市場開始前予測：S&P500上昇期待、テック株が牽引",
        "text": "米国市場開始前の分析では、S&P500は前日比0.5%上昇が期待される。テック株の好調が市場を牽引し..."
      },
      "dashboard": {
        "breadth": {
          "summary": "上昇銘柄が優勢、市場環境は良好"
        },
        "sentimentVISummary": "投資家心理は楽観的"
      }
    },
    "en": {
      "summary": {
        "evaluation": "buy",
        "score": 75,
        "headline": "Pre-Market Prediction: S&P 500 Expected to Rise, Tech Stocks Lead",
        "text": "Pre-market analysis suggests the S&P 500 is expected to rise 0.5% from the previous close. Tech stocks are leading the market..."
      },
      "dashboard": {
        "breadth": {
          "summary": "Advancing stocks dominate, market environment favorable"
        },
        "sentimentVISummary": "Investor sentiment remains optimistic"
      }
    }
  }
}
```

#### ステップ3: 記事の公開
```bash
# Windowsの場合
update_latest.bat 新記事ファイル名.json

# または直接実行
node update_latest.js 新記事ファイル名.json
```

### 2. 記事更新プロセス

#### 自動処理される内容
1. **現在の記事をアーカイブ**: `live_data/latest.json` → `archive_data/日付.json`
2. **新しい記事を公開**: `archive_data/新記事ファイル名.json` → `live_data/latest.json`
3. **マニフェスト更新**: `archive_data/manifest.json`に新しいエントリを追加

#### 実行例
```bash
# 記事ファイル: archive_data/2025.7.27.json
update_latest.bat 2025.7.27.json
```

**出力例:**
```
🔄 記事更新処理を開始: 2025.7.27.json
📁 現在の分析をアーカイブしました: 2025.7.26.json
📖 新しい記事を読み込み中: 2025.7.27.json
✅ latest.jsonを更新しました
📅 日付: 2025年7月27日
📊 セッション: 米国株予測
🇯🇵 日本語版: 米国市場開始前予測：S&P500上昇期待、テック株が牽引
🇺🇸 英語版: Pre-Market Prediction: S&P 500 Expected to Rise, Tech Stocks Lead
📋 manifest.jsonを更新しました
```

## ベストプラクティス

### 1. ファイル命名規則

#### 推奨形式
```
YYYY.M.D.json
例: 2025.7.27.json, 2025.7.28.json
```

#### 命名ルール
- **日付**: `YYYY.M.D`形式（例: `2025.7.27`）
- **セッション**: 米国株予測のため不要（削除可能）
- **拡張子**: `.json`

#### 避けるべき命名
```
❌ 2025-07-27.json    # ハイフン使用
❌ 2025.7.27am.json   # セッション情報不要
❌ 記事.json          # 日本語ファイル名
```

### 2. コンテンツ作成ガイドライン

#### 日本語版（ja）
- **評価**: `"買い"`, `"売り"`, `"中立"`
- **スコア**: 0-100の数値
- **ヘッドライン**: 米国市場開始前の予測を簡潔に表現
- **本文**: 米国市場開始前の分析と根拠、予測の理由

#### 英語版（en）
- **評価**: `"buy"`, `"sell"`, `"neutral"`
- **スコア**: 日本語版と同じ数値
- **ヘッドライン**: 米国市場開始前の予測を英語圏投資家向けに最適化
- **本文**: 米国市場開始前の分析と予測根拠を英語圏の市場慣習に合わせて表現

#### 必須項目チェックリスト
```json
{
  "date": "✓ 必須",
  "session": "✓ 必須",
  "languages": {
    "ja": {
      "summary": {
        "evaluation": "✓ 必須（買い/売り/中立）",
        "score": "✓ 必須（0-100）",
        "headline": "✓ 必須",
        "text": "✓ 必須"
      },
      "dashboard": {
        "breadth": {
          "summary": "✓ 必須"
        },
        "sentimentVISummary": "✓ 必須"
      }
    },
    "en": {
      "summary": {
        "evaluation": "✓ 必須（buy/sell/neutral）",
        "score": "✓ 必須（0-100）",
        "headline": "✓ 必須",
        "text": "✓ 必須"
      },
      "dashboard": {
        "breadth": {
          "summary": "✓ 必須"
        },
        "sentimentVISummary": "✓ 必須"
      }
    }
  }
}
```

### 3. 品質管理

#### 事前チェック
1. **JSON構文チェック**: エディタで構文エラーがないことを確認
2. **必須項目確認**: 上記チェックリストの全項目が入力済み
3. **翻訳品質**: 英語版が適切に翻訳されている
4. **データ整合性**: 日本語版と英語版のスコアが一致

#### テスト手順
```bash
# 1. 構文チェック
node -e "JSON.parse(require('fs').readFileSync('archive_data/テストファイル.json', 'utf8'))"

# 2. 更新テスト
node update_latest.js テストファイル.json

# 3. 結果確認
cat live_data/latest.json
```

### 4. エラーハンドリング

#### よくあるエラーと対処法

**エラー1: ファイルが見つかりません**
```
❌ ファイルが見つかりません: ./archive_data/存在しないファイル.json
```
**対処法**: ファイル名とパスを確認

**エラー2: JSON構文エラー**
```
❌ エラーが発生しました: Unexpected token in JSON
```
**対処法**: JSON構文をチェック、カンマやブラケットを確認

**エラー3: 必須項目が不足**
```
❌ エラーが発生しました: Cannot read property 'summary' of undefined
```
**対処法**: テンプレートの全必須項目が入力されているか確認

### 5. 運用スケジュール

#### 推奨タイムライン
- **米国株予測**: 1日1回の更新
- **更新タイミング**: 米国市場開始前（日本時間 夜9:00頃）
- **記事公開**: 分析完了後、遅くとも日本時間 夜10:00まで

#### 定期メンテナンス
- **週次**: アーカイブファイルの整理
- **月次**: manifest.jsonの最適化（50件制限）
- **四半期**: テンプレートの更新確認

## トラブルシューティング

### Q1: 記事が公開されない
**原因**: ファイルパスまたはJSON構文エラー
**解決法**: 
1. ファイル名とパスを確認
2. JSON構文をチェック
3. 必須項目が全て入力されているか確認

### Q2: 英語版が表示されない
**原因**: `languages.en`セクションが不完全
**解決法**: 英語版の全必須項目を入力

### Q3: アーカイブが作成されない
**原因**: 現在の`latest.json`に日付情報がない
**解決法**: 手動でアーカイブファイルを作成

### Q4: サイトが更新されない
**原因**: ブラウザキャッシュ
**解決法**: ブラウザのハードリフレッシュ（Ctrl+F5）

## 高度な運用

### 1. バッチ処理
複数記事の一括更新：
```bash
# 複数記事を順次更新
for file in archive_data/2025.7.27.json; do
    node update_latest.js $(basename $file)
done
```

### 2. 自動バックアップ
```bash
# 更新前の自動バックアップ
cp live_data/latest.json live_data/latest_backup_$(date +%Y%m%d_%H%M%S).json
```

### 3. 監視スクリプト
```javascript
// ファイル変更監視
const fs = require('fs');
fs.watch('./live_data/latest.json', (eventType, filename) => {
    console.log(`最新記事が更新されました: ${filename}`);
});
```

## サポート

### 緊急時の連絡先
- **技術的問題**: 開発チーム
- **コンテンツ問題**: 編集チーム
- **運用問題**: 運用チーム

### ログファイル
- **更新ログ**: コンソール出力を保存
- **エラーログ**: エラー詳細を記録

---

**最終更新**: 2025年1月
**バージョン**: 1.0
**対象**: 多言語対応テンプレート運用（方法A） 