// .envファイルから環境変数を読み込む
require('dotenv').config();
const axios = require('axios');

// .envファイルからAPIキーと検索エンジンIDを取得
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const SEARCH_ENGINE_ID = process.env.SEARCH_ENGINE_ID;

/**
 * 指定されたクエリでWeb検索を実行し、結果の要約を返す関数
 * @param {string} query - 検索したいキーワード
 * @returns {Promise<string>} - 整形された検索結果の文字列
 */
async function searchWeb(query) {
  console.log(`[INFO] Web検索を実行中: "${query}"`);

  // APIキーまたは検索エンジンIDが設定されていない場合はエラーを返す
  if (!GOOGLE_API_KEY || !SEARCH_ENGINE_ID) {
    console.error('[ERROR] GOOGLE_API_KEYまたはSEARCH_ENGINE_IDが.envファイルに設定されていません。');
    return '検索APIの設定が不完全なため、Web検索を実行できませんでした。';
  }

  const url = 'https://www.googleapis.com/customsearch/v1';
  const params = {
    key: GOOGLE_API_KEY,
    cx: SEARCH_ENGINE_ID,
    q: query,
    num: 5, // 取得する検索結果の数（ここでは上位5件）
  };

  try {
    const response = await axios.get(url, { params });
    const items = response.data.items;

    if (!items || items.length === 0) {
      console.log(`[INFO] "${query}" に一致する検索結果はありませんでした。`);
      return '関連する検索結果は見つかりませんでした。';
    }

    // 検索結果を「1. タイトル: 要約」の形式に整形
    const formattedResults = items.map((item, index) => {
      return `${index + 1}. ${item.title}:\n   ${item.snippet.replace(/\n/g, ' ')}`;
    }).join('\n\n');
    
    console.log(`[SUCCESS] Web検索が完了しました: "${query}"`);
    return formattedResults;

  } catch (error) {
    console.error(`[ERROR] "${query}" のWeb検索中にエラーが発生しました:`, error.response ? error.response.data.error.message : error.message);
    return `Web検索中にエラーが発生しました: ${error.message}`;
  }
}

// このファイルが直接実行された場合にのみ、テストコードを実行する
if (require.main === module) {
  (async () => {
    console.log('--- 検索機能の単体テストを開始します ---');
    const testQuery = 'S&P 500 market analysis today';
    const results = await searchWeb(testQuery);
    console.log(`\n--- "${testQuery}" の検索結果 ---`);
    console.log(results);
    console.log('------------------------------------');
  })();
}

// searchWeb関数を他のファイルから使えるようにエクスポート
module.exports = { searchWeb };