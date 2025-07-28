@echo off
chcp 65001 > nul
echo ========================================
echo YOHOU US Stock AI - 最新記事更新ツール
echo ========================================
echo.

if "%~1"=="" (
    echo 使用方法: update_latest.bat ^<新しい記事のファイル名^>
    echo.
    echo 例: update_latest.bat 2025.7.27pm.json
    echo.
    echo 利用可能な記事ファイル:
    if exist "archive_data\*.json" (
        dir /b archive_data\*.json
    ) else (
        echo archive_data フォルダにJSONファイルが見つかりません
    )
    echo.
    pause
    exit /b 1
)

if not exist "archive_data\%~1" (
    echo エラー: ファイルが見つかりません: archive_data\%~1
    echo.
    echo 利用可能な記事ファイル:
    if exist "archive_data\*.json" (
        dir /b archive_data\*.json
    ) else (
        echo archive_data フォルダにJSONファイルが見つかりません
    )
    echo.
    pause
    exit /b 1
)

echo 新しい記事ファイル: %~1
echo.
echo この操作により以下が実行されます:
echo 1. 現在の live_data/latest.json をアーカイブ
echo 2. %~1 から多言語対応の latest.json を生成
echo 3. archive_data/manifest.json を更新
echo.
set /p "confirm=続行しますか? (y/N): "

if /i "%confirm%"=="y" (
    echo.
    node update_latest.js "%~1"
    if errorlevel 1 (
        echo.
        echo ✗ 更新中にエラーが発生しました。
    ) else (
        echo.
        echo ✓ 更新が正常に完了しました！
        echo ブラウザで index.html を確認してください。
    )
) else (
    echo 操作をキャンセルしました。
)

echo.
pause 