#!/bin/bash

echo "========================================"
echo "YOHOU Nikkei AI - 最新記事更新ツール"
echo "========================================"
echo

if [ $# -eq 0 ]; then
    echo "使用方法: ./update_latest.sh <新しい記事のファイル名>"
    echo
    echo "例: ./update_latest.sh 2025.07.08am.json"
    echo
    echo "利用可能な記事ファイル:"
    ls -1 *.json 2>/dev/null || echo "JSONファイルが見つかりません"
    echo
    exit 1
fi

if [ ! -f "$1" ]; then
    echo "エラー: ファイルが見つかりません: $1"
    echo
    echo "利用可能な記事ファイル:"
    ls -1 *.json 2>/dev/null || echo "JSONファイルが見つかりません"
    echo
    exit 1
fi

echo "新しい記事ファイル: $1"
echo
echo "この操作により以下が実行されます:"
echo "1. 現在の live_data/latest.json をアーカイブ"
echo "2. $1 を live_data/latest.json としてコピー"
echo "3. archive_data/manifest.json を更新"
echo
read -p "続行しますか? (y/N): " confirm

if [[ $confirm =~ ^[Yy]$ ]]; then
    echo
    node update_latest.js "$1"
    if [ $? -eq 0 ]; then
        echo
        echo "✓ 更新が正常に完了しました！"
        echo "ブラウザで index.html を確認してください。"
    else
        echo
        echo "✗ 更新中にエラーが発生しました。"
    fi
else
    echo "操作をキャンセルしました。"
fi

echo 