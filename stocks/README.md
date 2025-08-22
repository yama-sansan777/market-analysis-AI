# 個別銘柄ページ管理

このフォルダは個別銘柄の詳細ページを管理します。

## フォルダ構造

```
/stocks/
├── README.md          # このファイル
└── details/           # 個別銘柄の詳細ページ
    ├── nvidia.html    # NVIDIA (NVDA) - 完成
    ├── msft.html      # Microsoft (MSFT) - 準備中
    ├── lly.html       # Eli Lilly (LLY) - 準備中
    └── avgo.html      # Broadcom (AVGO) - 準備中
```

## ファイル命名規則

- ファイル名: `{ticker}.html` (小文字)
- 例: NVIDIA → `nvidia.html`, Microsoft → `msft.html`

## 対象銘柄（クレイマー保有銘柄）

pickup.htmlで使用される銘柄のみ：
- NVDA - NVIDIA Corp. ✅
- MSFT - Microsoft Corp.
- LLY - Eli Lilly and Co. 
- AVGO - Broadcom Inc.

## リンク設定

pickup.html の「詳細を見る」ボタンから以下のパスでリンク:
- `stocks/details/{ticker}.html`

## テンプレート要件

各個別銘柄ページには以下が必要:

### 1. ヘッダー
- 統一ヘッダーメニュー (相対パス `../../` で親ディレクトリを参照)
- ロゴ: `../../image/logo.png`
- ナビゲーションリンク: `../../{page}.html`

### 2. 言語システム
- `../../translations/load.js`
- `../../lang.js`

### 3. モバイル対応
- モバイルメニューのリンクも相対パス対応

## 新しい銘柄ページ追加手順

1. nvidia.html をテンプレートとしてコピー
2. 銘柄固有の情報を更新:
   - タイトル、会社名、ティッカーシンボル
   - 事業内容、財務データ、チャート
   - サブヘッダーの銘柄ロゴ・情報
3. pickup.html のリンク設定に追加

## 注意事項

- 全ての内部リンクは相対パス `../../` を使用
- 画像パスも相対パス対応
- 言語システムの統合を忘れずに