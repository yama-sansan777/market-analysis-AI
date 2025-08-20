# プロジェクト構造リファクタリング計画

## 現在の問題点
- HTMLファイル内にCSS/JavaScriptが混在
- 共通コンポーネントの重複
- デバッグが困難な巨大なファイル
- 言語処理ロジックの分散

## 新しい構造設計

```
src/
├── css/
│   ├── common/
│   │   ├── reset.css
│   │   ├── variables.css
│   │   ├── utilities.css
│   │   └── components.css
│   ├── layout/
│   │   ├── header.css
│   │   ├── footer.css
│   │   └── navigation.css
│   └── pages/
│       ├── index.css
│       ├── archive.css
│       └── about.css
├── js/
│   ├── core/
│   │   ├── config.js
│   │   ├── api.js
│   │   └── utils.js
│   ├── components/
│   │   ├── charts/
│   │   │   ├── ChartBase.js
│   │   │   ├── GaugeChart.js
│   │   │   ├── LineChart.js
│   │   │   └── BarChart.js
│   │   ├── ui/
│   │   │   ├── Modal.js
│   │   │   ├── Tabs.js
│   │   │   └── DatePicker.js
│   │   └── language/
│   │       ├── Translator.js
│   │       ├── LanguageSwitcher.js
│   │       └── i18n.js
│   ├── modules/
│   │   ├── dataLoader.js
│   │   ├── marketAnalysis.js
│   │   └── archiveManager.js
│   └── pages/
│       ├── index.js
│       ├── archive.js
│       └── about.js
├── data/
│   ├── live/
│   │   └── latest.json
│   ├── archive/
│   │   └── [年月日].json
│   └── config/
│       ├── translations.json
│       └── settings.json
├── assets/
│   ├── images/
│   └── fonts/
└── templates/
    ├── components/
    │   ├── header.html
    │   ├── footer.html
    │   └── navigation.html
    └── layouts/
        └── main.html

public/
├── index.html
├── archive.html
├── about.html
└── [その他のHTMLファイル]
```

## リファクタリングの利点

### 1. バグ修正の容易さ
- **モジュール分離**: 機能ごとに独立したファイル
- **責任の明確化**: 各ファイルが単一の責任を持つ
- **テスト可能性**: 個別のモジュールテストが可能

### 2. 保守性の向上
- **再利用性**: 共通コンポーネントの活用
- **拡張性**: 新機能の追加が容易
- **可読性**: コードの構造が明確

### 3. 開発効率の向上
- **デバッグ**: エラーの特定が迅速
- **コード検索**: 機能別のファイル配置
- **協業**: 複数人での開発が可能

## 実装順序
1. ディレクトリ構造の作成
2. 共通CSS/JSの抽出
3. チャートコンポーネントの分離
4. 言語処理システムの整理
5. HTMLファイルの整理とパス更新
6. テストと動作確認