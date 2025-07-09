@echo off
chcp 65001 >nul
echo ========================================
echo YOHOU Nikkei AI - 最新記事更新ツール
echo ========================================
echo.

if "%1"=="" (
    echo 使用方法: update_latest.bat <新しい記事のファイル名>
    echo.
    echo 例: update_latest.bat 2025.07.08am.json
    echo.
    echo 利用可能な記事ファイル:
    dir *.json /b
    echo.
    pause
    exit /b 1
)

if not exist "%1" (
    echo エラー: ファイルが見つかりません: %1
    echo.
    echo 利用可能な記事ファイル:
    dir *.json /b
    echo.
    pause
    exit /b 1
)

echo 新しい記事ファイル: %1
echo.
echo この操作により以下が実行されます:
echo 1. 現在の live_data/latest.json をアーカイブ
echo 2. %1 を live_data/latest.json としてコピー
echo 3. archive_data/manifest.json を更新
echo.
set /p confirm="続行しますか? (y/N): "

if /i "%confirm%"=="y" (
    echo.
    node update_latest.js "%1"
    if %errorlevel% equ 0 (
        echo.
        echo ✓ 更新が正常に完了しました！
        echo ブラウザで index.html を確認してください。
    ) else (
        echo.
        echo ✗ 更新中にエラーが発生しました。
    )
) else (
    echo 操作をキャンセルしました。
)

echo.
pause 