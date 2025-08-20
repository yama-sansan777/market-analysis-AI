// convert_to_multilingual.js
// 現在のlatest.jsonを多言語対応構造に変換するスクリプト

const fs = require('fs');
const path = require('path');

function convertToMultilingual() {
    try {
        // 現在のlatest.jsonを読み込み
        const currentPath = './live_data/latest.json';
        if (!fs.existsSync(currentPath)) {
            console.log('❌ latest.jsonが見つかりません');
            return;
        }

        const currentData = JSON.parse(fs.readFileSync(currentPath, 'utf8'));
        
        // 新しい多言語構造を作成
        const multilingualData = {
            date: currentData.date,
            session: currentData.session,
            languages: {
                ja: currentData,
                en: generateEnglishVersion(currentData)
            }
        };

        // 新しい構造で保存
        fs.writeFileSync(currentPath, JSON.stringify(multilingualData, null, 2));
        
        console.log('✅ latest.jsonを多言語対応構造に変換しました');
        console.log(`📅 日付: ${multilingualData.date}`);
        console.log(`📊 セッション: ${multilingualData.session}`);
        console.log('🇯🇵 日本語版: 既存データを使用');
        console.log('🇺🇸 英語版: 自動生成（後で手動更新推奨）');

    } catch (error) {
        console.error('❌ 変換中にエラーが発生しました:', error.message);
    }
}

function generateEnglishVersion(japaneseData) {
    // 日本語データから英語版を生成（基本的な変換）
    return {
        session: japaneseData.session ? japaneseData.session.replace('市場分析', 'Market Analysis') : "Market Analysis",
        date: japaneseData.date,
        summary: {
            evaluation: japaneseData.summary?.evaluation === "買い" ? "buy" : 
                       japaneseData.summary?.evaluation === "売り" ? "sell" : 
                       japaneseData.summary?.evaluation === "中立" ? "neutral" : 
                       japaneseData.summary?.evaluation === "ホールド" ? "hold" : "neutral",
            score: japaneseData.summary?.score,
            headline: translateToEnglish(japaneseData.summary?.headline || "Market Analysis Headline"),
            text: translateToEnglish(japaneseData.summary?.text || "English version of market analysis to be provided.")
        },
        dashboard: japaneseData.dashboard ? {
            breadth: {
                advancers: japaneseData.dashboard.breadth?.advancers,
                decliners: japaneseData.dashboard.breadth?.decliners,
                summary: translateToEnglish(japaneseData.dashboard.breadth?.summary || "Market breadth analysis")
            },
            sentimentVI: japaneseData.dashboard.sentimentVI,
            sentimentVISummary: translateToEnglish(japaneseData.dashboard.sentimentVISummary || "Sentiment analysis"),
            priceLevels: {
                resistance: {
                    value: japaneseData.dashboard.priceLevels?.resistance?.value,
                    description: translateToEnglish(japaneseData.dashboard.priceLevels?.resistance?.description || "Resistance level description")
                },
                support: {
                    value: japaneseData.dashboard.priceLevels?.support?.value,
                    description: translateToEnglish(japaneseData.dashboard.priceLevels?.support?.description || "Support level description")
                }
            },
            putCallRatio: {
                dailyValue: japaneseData.dashboard.putCallRatio?.dailyValue,
                movingAverage: japaneseData.dashboard.putCallRatio?.movingAverage,
                status: translatePutCallStatus(japaneseData.dashboard.putCallRatio?.status || "neutral"),
                summary: translateToEnglish(japaneseData.dashboard.putCallRatio?.summary || "Put-call ratio analysis")
            }
        } : {},
        details: {
            internals: {
                headline: translateToEnglish(japaneseData.details?.internals?.headline || "Market Internals Analysis"),
                text: translateToEnglish(japaneseData.details?.internals?.text || "Market internals analysis content"),
                chartData: japaneseData.details?.internals?.chartData
            },
            technicals: {
                headline: translateToEnglish(japaneseData.details?.technicals?.headline || "Technical Analysis"),
                text: translateToEnglish(japaneseData.details?.technicals?.text || "Technical analysis content"),
                chartData: japaneseData.details?.technicals?.chartData
            },
            fundamentals: {
                headline: translateToEnglish(japaneseData.details?.fundamentals?.headline || "Fundamental Analysis"),
                text: translateToEnglish(japaneseData.details?.fundamentals?.text || "Fundamental analysis content"),
                vix: {
                    value: japaneseData.details?.fundamentals?.vix?.value,
                    change: japaneseData.details?.fundamentals?.vix?.change,
                    summary: translateToEnglish(japaneseData.details?.fundamentals?.vix?.summary || "VIX analysis")
                },
                aaiiSurvey: {
                    date: translateDateToEnglish(japaneseData.details?.fundamentals?.aaiiSurvey?.date),
                    bullish: japaneseData.details?.fundamentals?.aaiiSurvey?.bullish,
                    neutral: japaneseData.details?.fundamentals?.aaiiSurvey?.neutral,
                    bearish: japaneseData.details?.fundamentals?.aaiiSurvey?.bearish,
                    summary: translateToEnglish(japaneseData.details?.fundamentals?.aaiiSurvey?.summary || "AAII sentiment analysis")
                },
                investorsIntelligence: {
                    date: translateDateToEnglish(japaneseData.details?.fundamentals?.investorsIntelligence?.date),
                    bullish: japaneseData.details?.fundamentals?.investorsIntelligence?.bullish,
                    bearish: japaneseData.details?.fundamentals?.investorsIntelligence?.bearish,
                    correction: japaneseData.details?.fundamentals?.investorsIntelligence?.correction,
                    summary: translateToEnglish(japaneseData.details?.fundamentals?.investorsIntelligence?.summary || "Investors Intelligence analysis")
                },
                points: japaneseData.details?.fundamentals?.points?.map(point => translateToEnglish(point)) || []
            },
            strategy: {
                headline: translateToEnglish(japaneseData.details?.strategy?.headline || "Investment Strategy"),
                basic: translateToEnglish(japaneseData.details?.strategy?.basic || "Basic investment strategy recommendations"),
                risk: translateToEnglish(japaneseData.details?.strategy?.risk || "Risk management considerations")
            }
        },
        marketOverview: japaneseData.marketOverview?.map(market => ({
            name: translateMarketName(market.name),
            value: market.value,
            change: market.change,
            isDown: market.isDown
        })) || [],
        hotStocks: japaneseData.hotStocks?.map(stock => ({
            name: stock.name,
            price: translateToEnglish(stock.price),
            description: translateToEnglish(stock.description),
            isDown: stock.isDown
        })) || []
    };
}

// 基本的な翻訳機能（実際の翻訳は手動で行うことを推奨）
function translateToEnglish(text) {
    if (!text) return "";
    return "[EN] " + text;
}

function translatePutCallStatus(status) {
    const statusMap = {
        "中立": "neutral",
        "極度の自己満足シグナル": "extreme complacency signal",
        "強気": "bullish",
        "弱気": "bearish"
    };
    return statusMap[status] || status;
}

function translateDateToEnglish(dateStr) {
    if (!dateStr) return "";
    // 日本語の日付形式を英語に変換
    return dateStr
        .replace(/年/g, ', ')
        .replace(/月/g, '/')
        .replace(/日/g, '')
        .replace(/の週/g, ' week');
}

function translateMarketName(name) {
    const nameMap = {
        "S&P 500 (7/24終値)": "S&P 500 (7/24 Close)",
        "Nasdaq-100": "Nasdaq-100",
        "VIX指数": "VIX Index",
        "米国10年債利回り": "US 10Y Treasury"
    };
    return nameMap[name] || name;
}

// スクリプト実行
if (require.main === module) {
    convertToMultilingual();
}

module.exports = { convertToMultilingual, generateEnglishVersion };