# Claude Code学習用 - 米国市場開始前予測サイト運用ガイド

## システム概要

### 目的
米国市場開始前（日本時間 夜9:00頃）に、S&P500やテック株の予測を提供する多言語対応サイト

### 技術スタック
- **フロントエンド**: HTML, CSS, JavaScript
- **データ管理**: JSON形式
- **更新スクリプト**: Node.js
- **多言語対応**: 日本語（ja）と英語（en）

## ファイル構造と役割

```
market-analysis-AI/
├── live_data/
│   └── latest.json              # 最新記事（多言語対応）
├── archive_data/
│   ├── manifest.json            # アーカイブ一覧（最大50件）
│   ├── 2025.7.27.json          # 過去記事（多言語対応）
│   └── ...
├── article_template_multilingual.json  # 多言語対応テンプレート
├── update_latest.js             # 更新スクリプト
├── update_latest.bat            # Windows実行バッチ
├── lang.js                      # 多言語文字列管理
├── indicators.html              # 技術指標ページ
└── USAGE_GUIDE_MULTILINGUAL.md # 運用ガイド
```

## データ構造仕様

### 最新記事（live_data/latest.json）
```json
{
  "date": "2025年7月27日",
  "session": "米国株予測",
  "languages": {
    "ja": {
      "summary": {
        "evaluation": "買い|売り|中立",
        "score": 0-100,
        "headline": "米国市場開始前予測のヘッドライン",
        "text": "詳細な分析と予測根拠"
      },
      "dashboard": {
        "breadth": {
          "summary": "市場環境の要約"
        },
        "sentimentVISummary": "投資家心理の要約"
      }
    },
    "en": {
      "summary": {
        "evaluation": "buy|sell|neutral",
        "score": 0-100,
        "headline": "Pre-market prediction headline",
        "text": "Detailed analysis and prediction rationale"
      },
      "dashboard": {
        "breadth": {
          "summary": "Market environment summary"
        },
        "sentimentVISummary": "Investor sentiment summary"
      }
    }
  }
}
```

### アーカイブ記事（archive_data/YYYY.M.D.json）
- 最新記事と同じ構造
- ファイル名: `YYYY.M.D.json`形式
- 例: `2025.7.27.json`

### マニフェスト（archive_data/manifest.json）
```json
[
  {
    "file": "2025.7.27.json",
    "date": "2025年7月27日",
    "session": "米国株予測",
    "evaluation": "買い",
    "headline": "米国市場開始前予測：S&P500上昇期待",
    "summary": "詳細な分析と予測根拠"
  }
]
```

## 更新ワークフロー

### 1. 新規記事作成
1. `article_template_multilingual.json`をコピー
2. `archive_data/YYYY.M.D.json`として保存
3. 日本語版と英語版の内容を入力
4. `update_latest.bat YYYY.M.D.json`で公開

### 2. 自動処理内容
1. 現在の`live_data/latest.json`を`archive_data/`にアーカイブ
2. 新しい記事を`live_data/latest.json`にコピー
3. `archive_data/manifest.json`を更新（最新を先頭に追加）

### 3. エラーハンドリング
- ファイル存在チェック
- JSON構文チェック
- 必須項目チェック
- 日付形式チェック

## 多言語対応

### 言語切り替え
- `lang.js`で管理
- `data-lang`属性で動的切り替え
- 日本語（ja）と英語（en）の2言語

### 必須翻訳項目
- 評価: 買い/売り/中立 ↔ buy/sell/neutral
- ヘッドライン: 米国市場開始前予測
- 本文: 分析と予測根拠
- ダッシュボード: 市場環境と投資家心理

## 品質管理

### 事前チェック
1. JSON構文エラーなし
2. 必須項目全て入力済み
3. 日本語版と英語版のスコア一致
4. 翻訳品質確認

### テスト手順
```bash
# 構文チェック
node -e "JSON.parse(require('fs').readFileSync('archive_data/テストファイル.json', 'utf8'))"

# 更新テスト
node update_latest.js テストファイル.json

# 結果確認
cat live_data/latest.json
```

## 運用スケジュール

### 更新タイミング
- **頻度**: 1日1回
- **時間**: 米国市場開始前（日本時間 夜9:00頃）
- **公開期限**: 分析完了後、遅くとも日本時間 夜10:00まで

### 定期メンテナンス
- **週次**: アーカイブファイル整理
- **月次**: manifest.json最適化（50件制限）
- **四半期**: テンプレート更新確認

## トラブルシューティング

### よくあるエラー
1. **ファイルが見つかりません**: パスとファイル名確認
2. **JSON構文エラー**: カンマ、ブラケット確認
3. **必須項目不足**: テンプレート全項目入力確認
4. **サイト更新されない**: ブラウザキャッシュクリア

### 対処法
1. ファイル名とパスを確認
2. JSON構文をチェック
3. 必須項目が全て入力されているか確認
4. ブラウザのハードリフレッシュ（Ctrl+F5）

## 技術仕様

### ファイル命名規則
- **形式**: `YYYY.M.D.json`
- **例**: `2025.7.27.json`
- **避けるべき**: ハイフン、セッション情報、日本語ファイル名

### データ整合性
- 日本語版と英語版のスコアは必ず一致
- 評価は3値（買い/売り/中立）
- スコアは0-100の数値

### パフォーマンス
- アーカイブは最大50件
- 最新記事は常に`live_data/latest.json`
- マニフェストは日付順（最新が先頭）

---

**最終更新**: 2025年1月
**バージョン**: 1.0
**対象**: Claude Code学習用 