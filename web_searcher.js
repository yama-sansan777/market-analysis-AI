// .envファイルから環境変数を読み込む
require('dotenv').config();
const axios = require('axios');
const { createModuleLogger } = require('./utils/logger');
const { withRetry, withTimeout, CircuitBreaker, retryConditions } = require('./utils/errorResilience');

// モジュール専用ロガー
const logger = createModuleLogger('WEB_SEARCHER');

// .envファイルからAPIキーと検索エンジンIDを取得
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const SEARCH_ENGINE_ID = process.env.SEARCH_ENGINE_ID;

// サーキットブレーカーの初期化
const searchCircuitBreaker = new CircuitBreaker({
    name: 'GoogleSearchAPI',
    failureThreshold: 3,
    recoveryTimeout: 120000, // 2分
    monitoringWindow: 300000  // 5分
});

/**
 * 指定されたクエリでWeb検索を実行し、結果の要約を返す関数（エラー耐性機能付き）
 * @param {string} query - 検索したいキーワード
 * @returns {Promise<string>} - 整形された検索結果の文字列
 */
async function searchWeb(query) {
  logger.info(`Web検索を実行中: "${query}"`);

  // APIキーまたは検索エンジンIDが設定されていない場合はエラーを返す
  if (!GOOGLE_API_KEY || !SEARCH_ENGINE_ID) {
    const errorMsg = 'GOOGLE_API_KEYまたはSEARCH_ENGINE_IDが設定されていません';
    logger.error('設定エラー', { 
      error: errorMsg,
      hasApiKey: !!GOOGLE_API_KEY,
      hasSearchEngineId: !!SEARCH_ENGINE_ID
    });
    return '検索APIの設定が不完全なため、Web検索を実行できませんでした。';
  }

  const searchOperation = async () => {
    return await searchCircuitBreaker.execute(async () => {
      return await withTimeout(async () => {
        return await performGoogleSearch(query);
      }, 15000, `Google検索: ${query}`);
    }, `Google検索: ${query}`);
  };

  try {
    return await withRetry(searchOperation, {
      maxRetries: 3,
      baseDelay: 2000,
      maxDelay: 8000,
      backoffMultiplier: 2,
      retryCondition: (error) => {
        // API制限エラーや一時的なネットワークエラーのみリトライ
        return retryConditions.apiErrors(error) || 
               error.message.includes('quota') ||
               error.message.includes('rate limit');
      },
      operationName: `Web検索: ${query}`
    });

  } catch (error) {
    logger.error(`Web検索が最終的に失敗: "${query}"`, {
      errorType: error.constructor.name,
      errorMessage: error.message,
      query: query
    });
    
    // サーキットブレーカーの統計情報をログ出力
    const cbStats = searchCircuitBreaker.getStats();
    logger.warn('Google検索APIサーキットブレーカー状態', cbStats);
    
    return `Web検索中にエラーが発生しました: ${error.message}`;
  }
}

/**
 * 実際のGoogle検索API呼び出しを行う内部関数
 * @param {string} query - 検索クエリ
 * @returns {Promise<string>} - 整形された検索結果
 */
async function performGoogleSearch(query) {
  const startTime = Date.now();
  const url = 'https://www.googleapis.com/customsearch/v1';
  const params = {
    key: GOOGLE_API_KEY,
    cx: SEARCH_ENGINE_ID,
    q: query,
    num: 5, // 取得する検索結果の数（ここでは上位5件）
  };

  logger.debug('Google Custom Search API呼び出し', { 
    url, 
    query, 
    resultCount: params.num 
  });

  const response = await axios.get(url, { 
    params,
    timeout: 12000, // axios レベルでのタイムアウト
    headers: {
      'User-Agent': 'Deep-Research-Market-Analyzer/1.0'
    }
  });

  const duration = Date.now() - startTime;
  logger.apiCall('Google Custom Search', 'SUCCESS', duration, {
    query,
    statusCode: response.status,
    resultCount: response.data.items?.length || 0
  });

  const items = response.data.items;

  if (!items || items.length === 0) {
    logger.warn(`検索結果が見つかりません: "${query}"`, { 
      query,
      totalResults: response.data.searchInformation?.totalResults || 0
    });
    return '関連する検索結果は見つかりませんでした。';
  }

  // 検索結果を「1. タイトル: 要約」の形式に整形
  const formattedResults = items.map((item, index) => {
    return `${index + 1}. ${item.title}:\n   ${item.snippet.replace(/\n/g, ' ')}`;
  }).join('\n\n');
  
  logger.success(`Web検索完了: "${query}"`, {
    query,
    resultCount: items.length,
    duration
  });

  return formattedResults;
}

// このファイルが直接実行された場合にのみ、テストコードを実行する
if (require.main === module) {
  (async () => {
    logger.info('検索機能の単体テストを開始します');
    const testQuery = 'S&P 500 market analysis today';
    
    try {
      const results = await searchWeb(testQuery);
      logger.success('テスト完了', { 
        query: testQuery,
        resultLength: results.length 
      });
      console.log(`\n--- "${testQuery}" の検索結果 ---`);
      console.log(results);
      console.log('------------------------------------');
    } catch (error) {
      logger.error('テスト失敗', { 
        query: testQuery,
        error: error.message 
      });
    }
  })();
}

// searchWeb関数を他のファイルから使えるようにエクスポート
module.exports = { searchWeb, searchCircuitBreaker };