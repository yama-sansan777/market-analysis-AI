// update_latest.js
// 1. live_data/latest.json を日付ファイル名で archive_data/ へ移動
// 2. manifest.json へ自動追記
// 3. live_data/ に新しい latest.json を配置しておくこと（手動）

const fs = require('fs');
const path = require('path');

const LIVE_DATA_PATH = path.join(__dirname, 'live_data', 'latest.json');
const ARCHIVE_DATA_PATH = path.join(__dirname, 'archive_data');
const MANIFEST_PATH = path.join(ARCHIVE_DATA_PATH, 'manifest.json');

function readJsonFile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    console.error('JSON読み込み失敗:', filePath, e);
    return null;
  }
}

function writeJsonFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function archiveLatest() {
  if (!fs.existsSync(LIVE_DATA_PATH)) {
    console.error('live_data/latest.json が存在しません');
    return;
  }
  const latest = readJsonFile(LIVE_DATA_PATH);
  if (!latest) return;

  // ファイル名生成（例: 2025.07.14.json）
  const dateStr = latest.date.replace(/年|\.|\//g, '.').replace('月', '.').replace('日', '').replace(/\s.*/, '');
  const archiveFileName = `${dateStr}.json`;
  const archivePath = path.join(ARCHIVE_DATA_PATH, archiveFileName);

  // 既存latest.jsonをアーカイブへ移動
  fs.copyFileSync(LIVE_DATA_PATH, archivePath);
  console.log('アーカイブ:', archiveFileName);

  // manifest.jsonを更新
  let manifest = [];
  if (fs.existsSync(MANIFEST_PATH)) {
    manifest = readJsonFile(MANIFEST_PATH);
  }
  // manifest追記用データ
  manifest.unshift({
    file: archiveFileName,
    date: latest.date,
    session: latest.session || '',
    evaluation: latest.summary.evaluation || '',
    headline: latest.summary.headline || '',
    summary: latest.summary.text || ''
  });
  writeJsonFile(MANIFEST_PATH, manifest);
  console.log('manifest.json 追記完了');
}

archiveLatest(); 