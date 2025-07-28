// update_latest.js
// 1. 現在の live_data/latest.json を archive_data/ へ移動
// 2. 新しい記事ファイルから latest.json を生成
// 3. manifest.json を自動更新

const fs = require('fs');
const path = require('path');

function updateLatestArticle() {
    try {
        // コマンドライン引数から新しい記事ファイルを取得
        const newArticleFile = process.argv[2];
        
        if (!newArticleFile) {
            console.log('使用方法: node update_latest.js <新しい記事ファイル名>');
            console.log('例: node update_latest.js 2025.7.27pm.json');
            return;
        }

        console.log(`🔄 記事更新処理を開始: ${newArticleFile}`);

        // 新しい記事ファイルのパスを確認
        const newArticlePath = path.join('./archive_data', newArticleFile);
        if (!fs.existsSync(newArticlePath)) {
            console.log(`❌ ファイルが見つかりません: ${newArticlePath}`);
            return;
        }

        // 1. 現在のlatest.jsonをアーカイブに移動（存在する場合）
        const currentLatestPath = './live_data/latest.json';
        if (fs.existsSync(currentLatestPath)) {
            archiveCurrentLatest();
        }

        // 2. 新しい記事を読み込み
        console.log(`📖 新しい記事を読み込み中: ${newArticleFile}`);
        const newArticleData = JSON.parse(fs.readFileSync(newArticlePath, 'utf8'));

        // 3. 新しいlatest.jsonの構造を作成
        let latestData;
        
        if (newArticleData.languages) {
            // 既に多言語対応の構造の場合
            latestData = newArticleData;
        } else {
            // 従来の構造の場合、多言語対応構造に変換
            latestData = {
                date: newArticleData.date,
                session: newArticleData.session,
                languages: {
                    ja: newArticleData,
                    en: generateEnglishVersion(newArticleData)
                }
            };
        }

        // 4. latest.jsonに書き込み
        fs.writeFileSync(currentLatestPath, JSON.stringify(latestData, null, 2));

        console.log('✅ latest.jsonを更新しました');
        console.log(`📅 日付: ${latestData.date}`);
        console.log(`📊 セッション: ${latestData.session}`);
        
        if (latestData.languages) {
            console.log(`🇯🇵 日本語版: ${latestData.languages.ja.summary?.headline || '利用可能'}`);
            console.log(`🇺🇸 英語版: ${latestData.languages.en.summary?.headline || '利用可能'}`);
        }

    } catch (error) {
        console.error('❌ エラーが発生しました:', error.message);
        console.error(error.stack);
    }
}

function archiveCurrentLatest() {
    try {
        const currentLatestPath = './live_data/latest.json';
        const currentData = JSON.parse(fs.readFileSync(currentLatestPath, 'utf8'));
        
        // アーカイブファイル名を生成（日付から）
        const date = currentData.date || currentData.languages?.ja?.date;
        if (!date) {
            console.log('⚠️ 現在のファイルに日付情報がないため、アーカイブをスキップします');
            return;
        }

        // 日付から適切なファイル名を生成
        let archiveFileName;
        if (date.includes('年') && date.includes('月') && date.includes('日')) {
            // 日本語形式の日付を変換
            archiveFileName = date
                .replace(/年/g, '.')
                .replace(/月/g, '.')
                .replace(/日/g, '')
                .replace(/\s+/g, '') + '.json';
        } else {
            // その他の形式の場合は日付をそのまま使用
            archiveFileName = date.replace(/[-\/]/g, '.') + '.json';
        }

        const archivePath = path.join('./archive_data', archiveFileName);
        
        // 既存のファイルがある場合は上書きしない
        if (fs.existsSync(archivePath)) {
            console.log(`📁 アーカイブファイルは既に存在します: ${archiveFileName}`);
            return;
        }

        // アーカイブに保存
        fs.writeFileSync(archivePath, JSON.stringify(currentData, null, 2));
        console.log(`📁 現在の分析をアーカイブしました: ${archiveFileName}`);

        // manifest.jsonを更新
        updateManifest(archiveFileName, currentData);

    } catch (error) {
        console.error('⚠️ アーカイブ処理中にエラーが発生しました:', error.message);
    }
}

function updateManifest(fileName, data) {
    try {
        const manifestPath = './archive_data/manifest.json';
        let manifest = [];
        
        if (fs.existsSync(manifestPath)) {
            manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        }

        // 新しいエントリを作成
        const newEntry = {
            file: fileName,
            date: data.date || data.languages?.ja?.date,
            session: data.session || data.languages?.ja?.session,
            evaluation: data.summary?.evaluation || data.languages?.ja?.summary?.evaluation,
            headline: data.summary?.headline || data.languages?.ja?.summary?.headline,
            summary: data.summary?.text || data.languages?.ja?.summary?.text
        };

        // 同じファイル名のエントリがあれば削除
        manifest = manifest.filter(entry => entry.file !== fileName);
        
        // 新しいエントリを先頭に追加
        manifest.unshift(newEntry);

        // 最大50件に制限
        if (manifest.length > 50) {
            manifest = manifest.slice(0, 50);
        }

        // manifest.jsonを更新
        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
        console.log(`📋 manifest.jsonを更新しました`);

    } catch (error) {
        console.error('⚠️ manifest.json更新中にエラーが発生しました:', error.message);
    }
}

function generateEnglishVersion(japaneseData) {
    // 日本語データから英語版を生成（テンプレート）
    // 実際の翻訳は手動で行う必要があります
    return {
        session: japaneseData.session ? `${japaneseData.session} (EN)` : "Market Analysis (EN)",
        date: japaneseData.date,
        summary: {
            evaluation: japaneseData.summary?.evaluation === "買い" ? "buy" : 
                       japaneseData.summary?.evaluation === "売り" ? "sell" : "neutral",
            score: japaneseData.summary?.score,
            headline: "[EN] " + (japaneseData.summary?.headline || "Market Analysis Headline"),
            text: "[EN] " + (japaneseData.summary?.text || "English version of market analysis to be provided.")
        },
        dashboard: japaneseData.dashboard ? {
            ...japaneseData.dashboard,
            breadth: {
                ...japaneseData.dashboard.breadth,
                summary: "[EN] " + (japaneseData.dashboard.breadth?.summary || "Market breadth analysis")
            },
            sentimentVISummary: "[EN] " + (japaneseData.dashboard.sentimentVISummary || "Sentiment analysis")
        } : {},
        details: japaneseData.details,
        marketOverview: japaneseData.marketOverview,
        hotStocks: japaneseData.hotStocks
    };
}

// スクリプト実行
if (require.main === module) {
    updateLatestArticle();
} 