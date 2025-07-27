// update_latest.js
// 1. live_data/latest.json を日付ファイル名で archive_data/ へ移動
// 2. manifest.json へ自動追記
// 3. live_data/ に新しい latest.json を配置しておくこと（手動）

const fs = require('fs');
const path = require('path');

// 最新記事のJSONファイルを読み込み
function updateLatestArticle() {
    try {
        // 最新記事のJSONファイルを読み込み（例：articles/article_20250127.json）
        const articlesDir = './articles';
        const files = fs.readdirSync(articlesDir);
        const jsonFiles = files.filter(file => file.endsWith('.json'));
        
        if (jsonFiles.length === 0) {
            console.log('記事ファイルが見つかりません');
            return;
        }
        
        // 最新の記事ファイルを取得（ファイル名の日付でソート）
        const latestFile = jsonFiles.sort().pop();
        const latestArticlePath = path.join(articlesDir, latestFile);
        
        console.log(`最新記事ファイル: ${latestFile}`);
        
        // 最新記事の内容を読み込み
        const latestArticle = JSON.parse(fs.readFileSync(latestArticlePath, 'utf8'));
        
        // 多言語対応のlatest.json構造を作成
        const latestData = {
            date: latestArticle.date || latestArticle.ja?.date || new Date().toISOString().split('T')[0],
            ja: {
                title: latestArticle.ja?.title || latestArticle.title,
                summary: latestArticle.ja?.summary || latestArticle.summary,
                evaluation: latestArticle.ja?.evaluation || latestArticle.evaluation,
                content: latestArticle.ja?.content || latestArticle.content
            },
            en: {
                title: latestArticle.en?.title || latestArticle.title,
                summary: latestArticle.en?.summary || latestArticle.summary,
                evaluation: latestArticle.en?.evaluation || latestArticle.evaluation,
                content: latestArticle.en?.content || latestArticle.content
            }
        };
        
        // latest.jsonに書き込み
        fs.writeFileSync('./latest.json', JSON.stringify(latestData, null, 2));
        
        console.log('✅ latest.jsonを更新しました');
        console.log(`📅 日付: ${latestData.date}`);
        console.log(`🇯🇵 日本語タイトル: ${latestData.ja.title}`);
        console.log(`🇺🇸 英語タイトル: ${latestData.en.title}`);
        
    } catch (error) {
        console.error('❌ エラーが発生しました:', error.message);
    }
}

// スクリプト実行
updateLatestArticle(); 