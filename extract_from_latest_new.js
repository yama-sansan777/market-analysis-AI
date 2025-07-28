const fs = require('fs');

function extractFromLatestHtml() {
    console.log('latest.htmlからデータを抽出しています...');
    
    try {
        // latest.htmlファイルを読み込み
        const htmlContent = fs.readFileSync('./latest.html', 'utf8');
        
        // reportDataオブジェクトを抽出
        const reportDataMatch = htmlContent.match(/const reportData = ({[\s\S]*?});/);
        if (!reportDataMatch) {
            throw new Error('reportData オブジェクトが見つかりません');
        }
        
        // JavaScriptオブジェクトとして評価
        const reportData = eval('(' + reportDataMatch[1] + ')');
        
        // 多言語形式に変換
        const multilingualData = convertToMultilingualFormat(reportData);
        
        // live_data/latest.jsonに保存
        fs.writeFileSync('./live_data/latest.json', JSON.stringify(multilingualData, null, 2), 'utf8');
        
        console.log('✓ データの抽出と変換が完了しました');
        console.log('✓ live_data/latest.json に保存されました');
        
        return multilingualData;
        
    } catch (error) {
        console.error('エラー:', error.message);
        throw error;
    }
}

function convertToMultilingualFormat(reportData) {
    // 英語翻訳辞書
    const translations = {
        // 評価
        "買い": "buy",
        "売り": "sell", 
        "ホールド": "hold",
        "中立": "neutral",
        
        // 月名
        "1月": "January", "2月": "February", "3月": "March", "4月": "April",
        "5月": "May", "6月": "June", "7月": "July", "8月": "August", 
        "9月": "September", "10月": "October", "11月": "November", "12月": "December",
        
        // 共通フレーズ
        "市場分析": "Market Analysis",
        "S&P 500": "S&P 500",
        "史上最高値": "all-time high",
        "調整": "correction",
        "ラリー": "rally",
        "上昇トレンド": "uptrend",
        "下降トレンド": "downtrend",
        "ボラティリティ": "volatility",
        "レジスタンス": "resistance",
        "サポート": "support",
        "ブレイクアウト": "breakout",
        "プルバック": "pullback"
    };
    
    function translateText(text) {
        if (!text) return text;
        
        let translated = text;
        
        // 日付の翻訳
        translated = translated.replace(/(\d{4})年(\d{1,2})月(\d{1,2})日/g, (match, year, month, day) => {
            const monthNames = ["January", "February", "March", "April", "May", "June",
                              "July", "August", "September", "October", "November", "December"];
            return `${monthNames[parseInt(month) - 1]} ${parseInt(day)}, ${year}`;
        });
        
        // セッション名の翻訳
        translated = translated.replace(/(\d{1,2})月(\d{1,2})日\s*市場分析/g, (match, month, day) => {
            const monthNames = ["January", "February", "March", "April", "May", "June",
                              "July", "August", "September", "October", "November", "December"];
            return `${monthNames[parseInt(month) - 1]} ${parseInt(day)} Market Analysis`;
        });
        
        // その他の翻訳
        Object.entries(translations).forEach(([jp, en]) => {
            const regex = new RegExp(jp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            translated = translated.replace(regex, en);
        });
        
        return translated;
    }
    
    // 多言語データ構造を作成
    const multilingualData = {
        date: reportData.date,
        session: reportData.session,
        languages: {
            ja: {
                summary: {
                    evaluation: reportData.summary.evaluation,
                    score: reportData.summary.score,
                    headline: reportData.summary.headline,
                    text: reportData.summary.text
                },
                dashboard: {
                    breadth: {
                        advancers: reportData.dashboard.breadth.advancers,
                        decliners: reportData.dashboard.breadth.decliners,
                        summary: reportData.dashboard.breadth.summary
                    },
                    sentimentVI: reportData.dashboard.sentimentVI,
                    sentimentVISummary: reportData.dashboard.sentimentVISummary,
                    priceLevels: {
                        resistance: {
                            value: reportData.dashboard.priceLevels.resistance.value,
                            description: reportData.dashboard.priceLevels.resistance.description
                        },
                        support: {
                            value: reportData.dashboard.priceLevels.support.value,
                            description: reportData.dashboard.priceLevels.support.description
                        }
                    },
                    putCallRatio: {
                        dailyValue: reportData.dashboard.putCallRatio.dailyValue,
                        movingAverage: reportData.dashboard.putCallRatio.movingAverage,
                        status: reportData.dashboard.putCallRatio.status,
                        summary: reportData.dashboard.putCallRatio.summary
                    }
                },
                details: {
                    internals: {
                        headline: reportData.details.internals.headline,
                        text: reportData.details.internals.text,
                        chartData: reportData.details.internals.chartData
                    },
                    technicals: {
                        headline: reportData.details.technicals.headline,
                        text: reportData.details.technicals.text,
                        chartData: reportData.details.technicals.chartData
                    },
                    fundamentals: {
                        headline: reportData.details.fundamentals.headline,
                        text: reportData.details.fundamentals.text,
                        vix: reportData.details.fundamentals.vix,
                        aaiiSurvey: reportData.details.fundamentals.aaiiSurvey,
                        investorsIntelligence: reportData.details.fundamentals.investorsIntelligence,
                        points: reportData.details.fundamentals.points
                    },
                    strategy: {
                        headline: reportData.details.strategy.headline,
                        basic: reportData.details.strategy.basic,
                        risk: reportData.details.strategy.risk
                    }
                },
                marketOverview: reportData.marketOverview,
                hotStocks: reportData.hotStocks
            },
            en: {
                summary: {
                    evaluation: translateText(reportData.summary.evaluation),
                    score: reportData.summary.score,
                    headline: translateText(reportData.summary.headline),
                    text: translateText(reportData.summary.text)
                },
                dashboard: {
                    breadth: {
                        advancers: reportData.dashboard.breadth.advancers,
                        decliners: reportData.dashboard.breadth.decliners,
                        summary: translateText(reportData.dashboard.breadth.summary)
                    },
                    sentimentVI: reportData.dashboard.sentimentVI,
                    sentimentVISummary: translateText(reportData.dashboard.sentimentVISummary),
                    priceLevels: {
                        resistance: {
                            value: reportData.dashboard.priceLevels.resistance.value,
                            description: translateText(reportData.dashboard.priceLevels.resistance.description)
                        },
                        support: {
                            value: reportData.dashboard.priceLevels.support.value,
                            description: translateText(reportData.dashboard.priceLevels.support.description)
                        }
                    },
                    putCallRatio: {
                        dailyValue: reportData.dashboard.putCallRatio.dailyValue,
                        movingAverage: reportData.dashboard.putCallRatio.movingAverage,
                        status: translateText(reportData.dashboard.putCallRatio.status),
                        summary: translateText(reportData.dashboard.putCallRatio.summary)
                    }
                },
                details: {
                    internals: {
                        headline: translateText(reportData.details.internals.headline),
                        text: translateText(reportData.details.internals.text),
                        chartData: reportData.details.internals.chartData
                    },
                    technicals: {
                        headline: translateText(reportData.details.technicals.headline),
                        text: translateText(reportData.details.technicals.text),
                        chartData: reportData.details.technicals.chartData
                    },
                    fundamentals: {
                        headline: translateText(reportData.details.fundamentals.headline),
                        text: translateText(reportData.details.fundamentals.text),
                        vix: {
                            ...reportData.details.fundamentals.vix,
                            status: translateText(reportData.details.fundamentals.vix.status),
                            summary: translateText(reportData.details.fundamentals.vix.summary)
                        },
                        aaiiSurvey: {
                            ...reportData.details.fundamentals.aaiiSurvey,
                            date: translateText(reportData.details.fundamentals.aaiiSurvey.date),
                            summary: translateText(reportData.details.fundamentals.aaiiSurvey.summary)
                        },
                        investorsIntelligence: {
                            ...reportData.details.fundamentals.investorsIntelligence,
                            date: translateText(reportData.details.fundamentals.investorsIntelligence.date),
                            summary: translateText(reportData.details.fundamentals.investorsIntelligence.summary)
                        },
                        points: reportData.details.fundamentals.points.map(point => translateText(point))
                    },
                    strategy: {
                        headline: translateText(reportData.details.strategy.headline),
                        basic: translateText(reportData.details.strategy.basic),
                        risk: translateText(reportData.details.strategy.risk)
                    }
                },
                marketOverview: reportData.marketOverview.map(item => ({
                    ...item,
                    name: translateText(item.name)
                })),
                hotStocks: reportData.hotStocks.map(stock => ({
                    ...stock,
                    name: translateText(stock.name),
                    price: translateText(stock.price),
                    description: translateText(stock.description)
                }))
            }
        }
    };
    
    return multilingualData;
}

// 直接実行された場合
if (require.main === module) {
    extractFromLatestHtml();
}

module.exports = { extractFromLatestHtml, convertToMultilingualFormat };