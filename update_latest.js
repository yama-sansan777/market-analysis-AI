const fs = require('fs');
const path = require('path');

// 設定
const LIVE_DATA_PATH = './live_data/latest.json';
const ARCHIVE_DATA_PATH = './archive_data';
const MANIFEST_PATH = './archive_data/manifest.json';

// 日付とセッションを取得する関数
function getDateAndSession() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = now.getHours();
    
    // 午前（9:00-12:00）か午後（13:00-15:00）かを判定
    const session = hour < 12 ? 'am' : 'pm';
    
    return {
        date: `${year}.${month}.${day}`,
        session: session,
        formattedDate: `${year}年${month}月${day}日`
    };
}

// ファイルをコピーする関数
function copyFile(source, destination) {
    try {
        const data = fs.readFileSync(source, 'utf8');
        fs.writeFileSync(destination, data);
        console.log(`✓ ファイルをコピーしました: ${source} → ${destination}`);
        return true;
    } catch (error) {
        console.error(`✗ ファイルコピーに失敗しました: ${error.message}`);
        return false;
    }
}

// JSONファイルを読み込む関数
function readJsonFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`✗ JSONファイルの読み込みに失敗しました: ${filePath} - ${error.message}`);
        return null;
    }
}

// JSONファイルを書き込む関数
function writeJsonFile(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        console.log(`✓ JSONファイルを書き込みました: ${filePath}`);
        return true;
    } catch (error) {
        console.error(`✗ JSONファイルの書き込みに失敗しました: ${filePath} - ${error.message}`);
        return false;
    }
}

// メイン処理
function updateLatestArticle(newArticlePath) {
    console.log('=== 最新記事の更新を開始します ===');
    
    // 1. 現在のlive_data/latest.jsonをアーカイブ
    const { date, session, formattedDate } = getDateAndSession();
    const archiveFileName = `${date}${session}.json`;
    const archivePath = path.join(ARCHIVE_DATA_PATH, archiveFileName);
    
    console.log(`\n1. 現在の記事をアーカイブ中...`);
    if (fs.existsSync(LIVE_DATA_PATH)) {
        if (!copyFile(LIVE_DATA_PATH, archivePath)) {
            console.error('アーカイブに失敗しました。処理を中止します。');
            return false;
        }
    } else {
        console.log('live_data/latest.jsonが見つかりません。新規記事として処理します。');
    }
    
    // 2. 新しい記事でlive_data/latest.jsonを上書き
    console.log(`\n2. 新しい記事で上書き中...`);
    if (!copyFile(newArticlePath, LIVE_DATA_PATH)) {
        console.error('新しい記事の上書きに失敗しました。処理を中止します。');
        return false;
    }
    
    // 3. manifest.jsonを更新
    console.log(`\n3. manifest.jsonを更新中...`);
    const manifest = readJsonFile(MANIFEST_PATH);
    if (!manifest) {
        console.error('manifest.jsonの読み込みに失敗しました。処理を中止します。');
        return false;
    }
    
    // 新しい記事の情報を取得
    const newArticleData = readJsonFile(newArticlePath);
    if (!newArticleData) {
        console.error('新しい記事の読み込みに失敗しました。処理を中止します。');
        return false;
    }
    
    // 新しい記事情報を作成
    const newEntry = {
        file: archiveFileName,
        date: formattedDate,
        session: newArticleData.session,
        evaluation: newArticleData.summary.evaluation,
        headline: newArticleData.summary.headline,
        summary: newArticleData.summary.text.substring(0, 100) + '...'
    };
    
    // manifest.jsonの先頭に追加
    manifest.unshift(newEntry);
    
    // 最大50件まで保持（古い記事を削除）
    if (manifest.length > 50) {
        manifest.splice(50);
        console.log('manifest.jsonを50件に制限しました。');
    }
    
    if (!writeJsonFile(MANIFEST_PATH, manifest)) {
        console.error('manifest.jsonの更新に失敗しました。');
        return false;
    }
    
    console.log(`\n=== 更新が完了しました ===`);
    console.log(`✓ アーカイブファイル: ${archiveFileName}`);
    console.log(`✓ 新しい記事: ${newArticlePath}`);
    console.log(`✓ 記事情報: ${newEntry.headline}`);
    
    return true;
}

// コマンドライン引数の処理
const args = process.argv.slice(2);
if (args.length === 0) {
    console.log('使用方法: node update_latest.js <新しい記事のパス>');
    console.log('例: node update_latest.js 2025.07.08am.json');
    process.exit(1);
}

const newArticlePath = args[0];

// ファイルの存在確認
if (!fs.existsSync(newArticlePath)) {
    console.error(`エラー: ファイルが見つかりません: ${newArticlePath}`);
    process.exit(1);
}

// メイン処理を実行
const success = updateLatestArticle(newArticlePath);
process.exit(success ? 0 : 1); 