#!/bin/bash

# Deep Research PM2セットアップスクリプト

echo "🚀 Deep Research PM2セットアップを開始します..."

# PM2がインストールされているかチェック
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2がインストールされていません。インストールしています..."
    npm install -g pm2
    echo "✅ PM2のインストールが完了しました"
fi

# ログディレクトリの作成
mkdir -p logs
echo "📁 ログディレクトリを作成しました"

# 環境変数ファイルの確認
if [ ! -f ".env" ]; then
    echo "⚠️ .envファイルが見つかりません。"
    echo "以下の環境変数を設定してください:"
    echo "  - GEMINI_API_KEY"
    echo "  - GOOGLE_API_KEY"
    echo "  - SEARCH_ENGINE_ID"
    exit 1
fi

# 既存のプロセスを停止
echo "🛑 既存のDeep Researchプロセスを停止しています..."
pm2 stop deep-research-scheduler 2>/dev/null || true
pm2 delete deep-research-scheduler 2>/dev/null || true

# ecosystem.config.jsの設定で新しいプロセスを開始
echo "▶️ Deep Research スケジューラーを開始しています..."
pm2 start ecosystem.config.js --env production

# PM2プロセスの状態確認
echo "📊 PM2プロセスの状態:"
pm2 status

# PM2の自動起動設定
echo "🔧 PM2の自動起動を設定しています..."
pm2 startup
pm2 save

echo ""
echo "✅ Deep Research PM2セットアップが完了しました！"
echo ""
echo "📋 使用可能なコマンド:"
echo "  pm2 status                     - プロセス状態確認"
echo "  pm2 logs deep-research-scheduler  - ログの確認"
echo "  pm2 restart deep-research-scheduler - プロセス再起動"
echo "  pm2 stop deep-research-scheduler    - プロセス停止"
echo "  pm2 monit                      - リアルタイム監視"
echo ""
echo "🔗 ログファイルの場所:"
echo "  ./logs/deep-research-out.log      - 標準出力ログ"
echo "  ./logs/deep-research-error.log    - エラーログ"
echo "  ./logs/deep-research-combined.log - 統合ログ"
echo "  ./logs/scheduler.log              - スケジューラーログ"
echo ""