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
    // 包括的な英語翻訳辞書
    const translations = {
        // 評価
        "買い": "buy",
        "売り": "sell", 
        "ホールド": "hold",
        "中立": "neutral",
        "強気": "bullish",
        "弱気": "bearish",
        
        // 月名
        "1月": "January", "2月": "February", "3月": "March", "4月": "April",
        "5月": "May", "6月": "June", "7月": "July", "8月": "August", 
        "9月": "September", "10月": "October", "11月": "November", "12月": "December",
        
        // 共通市場用語
        "市場分析": "Market Analysis",
        "S&P 500": "S&P 500",
        "史上最高値": "all-time high",
        "最高値圏": "near all-time highs",
        "調整": "correction",
        "ラリー": "rally",
        "上昇トレンド": "uptrend",
        "下降トレンド": "downtrend",
        "ボラティリティ": "volatility",
        "レジスタンス": "resistance",
        "サポート": "support",
        "ブレイクアウト": "breakout",
        "プルバック": "pullback",
        "市場": "market",
        "指数": "index",
        "株価": "stock price",
        "投資家": "investors",
        "トレーダー": "traders",
        
        // テクニカル分析用語
        "テクニカル分析": "Technical Analysis",
        "ファンダメンタルズ": "Fundamentals",
        "心理": "Psychology",
        "センチメント": "sentiment",
        "内部構造": "Market Internals",
        "投資戦略": "Investment Strategy",
        "RSI": "RSI",
        "MACD": "MACD",
        "移動平均": "moving average",
        "移動平均線": "moving average line",
        "騰落銘柄数": "advancing/declining issues",
        "出来高": "volume",
        "過熱感": "overheated conditions",
        "買われすぎ": "overbought",
        "売られすぎ": "oversold",
        "ダイバージェンス": "divergence",
        "乖離": "divergence",
        
        // 心理・センチメント用語
        "恐怖指数": "Fear Index",
        "強欲": "Greed",
        "恐怖": "Fear",
        "極度の強欲": "Extreme Greed",
        "極度の恐怖": "Extreme Fear",
        "個人投資家": "individual investors",
        "機関投資家": "institutional investors",
        "プロ投資家": "professional investors",
        "スマートマネー": "smart money",
        "ダムマネー": "dumb money",
        "自己満足": "complacency",
        "警戒感": "caution",
        "楽観": "optimism",
        "悲観": "pessimism",
        "熱狂": "euphoria",
        "躊躇": "hesitation",
        
        // 価格・パフォーマンス用語
        "上値抵抗線": "resistance level",
        "下値支持線": "support level",
        "節目": "key level",
        "心理的": "psychological",
        "利益確定": "profit-taking",
        "売り": "selling",
        "買い": "buying",
        "急落": "sharp decline",
        "急上昇": "sharp rise",
        "暴落": "crash",
        "反発": "rebound",
        "下落": "decline",
        "上昇": "rise",
        
        // リスク管理用語
        "リスク管理": "Risk Management",
        "基本戦略": "Basic Strategy",
        "ストップロス": "stop loss",
        "損切り": "stop loss",
        "利確": "profit taking",
        "ポジション": "position",
        "ロング": "long",
        "ショート": "short",
        "ヘッジ": "hedge",
        "資本保全": "capital preservation",
        
        // 市場状況用語
        "市場概況": "Market Overview",
        "注目銘柄": "Notable Stocks",
        "主な値上がり銘柄": "Top Gainers",
        "主な値下がり銘柄": "Top Decliners",
        "決算": "earnings",
        "好決算": "strong earnings",
        "決算失望": "earnings disappointment",
        "業績": "performance",
        "収益": "earnings",
        "売上": "revenue",
        
        // 経済指標用語
        "経済指標": "economic indicators",
        "金利": "interest rates",
        "利下げ": "rate cut",
        "利上げ": "rate hike",
        "FRB": "Federal Reserve",
        "FOMC": "FOMC",
        "インフレ": "inflation",
        "デフレ": "deflation",
        "GDP": "GDP",
        "雇用": "employment",
        "失業率": "unemployment rate",
        
        // 時間的表現
        "短期": "short-term",
        "中期": "medium-term",
        "長期": "long-term",
        "短期的": "short-term",
        "中期的": "medium-term", 
        "長期的": "long-term",
        "一時的": "temporary",
        "継続的": "continuous",
        "持続的": "sustained",
        
        // 方向性表現
        "上昇": "rise",
        "下降": "decline",
        "横ばい": "sideways",
        "安定": "stable",
        "変動": "fluctuation",
        "推移": "trend",
        "動向": "movement",
        "転換": "reversal",
        "継続": "continuation",
        
        // 度合い表現
        "著しく": "significantly",
        "大幅に": "substantially",
        "わずかに": "slightly",
        "急激に": "sharply",
        "徐々に": "gradually",
        "大きく": "significantly",
        "小幅": "modest",
        "大幅": "substantial",
        
        // 未翻訳の用語を追加
        "記録更新": "record-breaking",
        "疲弊": "exhaustion",
        "兆候": "signs",
        "成功": "success",
        "重み": "weight",
        "耐えられる": "withstand",
        "圏": "range",
        "内部指標": "internal indicators",
        "深刻": "serious",
        "悪化": "deterioration",
        "示しています": "shows",
        "乖離": "divergence",
        "逆張り": "contrarian",
        "シグナル": "signal",
        "局面": "phase",
        "控える": "refrain from",
        "べき": "should",
        "値上がり銘柄数": "advancing stocks",
        "値下がり銘柄数": "declining stocks",
        "上回っている": "exceed",
        "一部": "some",
        "主要銘柄": "major stocks",
        "脆弱性": "fragility",
        "示唆": "suggests",
        "インデックス": "index",
        "領域": "territory",
        "広範": "broad",
        "論": "sentiment",
        "反映": "reflects",
        "歴史的": "historically",
        "前兆": "precursor",
        "節目": "milestone",
        "壁": "barrier",
        "支持線": "support line",
        "割り込む": "break below",
        "転換": "reversal",
        "萌芽": "emergence",
        "急上昇": "sharp rise",
        "始めている": "beginning to",
        "兆候": "signs",
        "極端": "extreme",
        "天井": "peak",
        "サイン": "sign",
        "懐疑的": "skeptical",
        "組み合わせ": "combination",
        "基盤": "foundation",
        "極めて": "extremely",
        "示しています": "indicates",
        "しかし": "however",
        "勢い": "momentum",
        "鈍化": "slowdown",
        "より": "more",
        "する一方で": "while",
        "追随": "follow",
        "質の悪い": "poor-quality",
        "であること": "being",
        "支える": "supports",
        "期待": "expectations",
        "低水準": "low levels",
        "危険": "dangerous",
        "脆弱": "vulnerable",
        "状態": "condition",
        "調査": "survey",  
        "ほぼ": "almost",
        "欠いている": "lacking",
        "警告": "warning",
        "強力": "powerful",
        "指標": "indicator",
        "状態": "state",
        "面": "aspect",
        "支え": "support",
        "後押し": "boost",
        "非常に": "extremely",
        "環境": "environment",
        "生み出している": "creating",
        "固め": "strengthen",
        "確保": "secure",
        "機会": "opportunity",
        "待つ": "wait",
        "既存": "existing",
        "部分的": "partial",
        "検討": "consider",
        "設定": "set",
        "新規": "new",
        "避け": "avoid",
        "待つ": "wait",
        "賢明": "wise",
        "最大": "maximum",
        "による": "due to",
        "相場": "market",
        "見方": "view",
        "力強く": "strongly",
        "上抜け": "break above",
        "かつ": "and",
        "改善": "improvement",
        "場合": "case",
        "無効": "invalid",
        "となります": "becomes",
        "終値": "closing price",
        "先物": "futures",
        "債利回り": "bond yield",
        "失望": "disappointment",
        "内部": "internal",
        "亀裂": "cracks",
        "象徴": "symbolizes",
        "セクター": "sector",
        "弱さ": "weakness",
        "発表": "announced",
        "下支え": "support"
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
        
        // 数値表現の翻訳
        translated = translated.replace(/(\d+)\s*円/g, '¥$1');
        translated = translated.replace(/(\d+)\s*ドル/g, '$$$1');
        translated = translated.replace(/(\d+)\s*%/g, '$1%');
        
        // 複合語の翻訳（長いフレーズから先に処理）
        const sortedTranslations = Object.entries(translations).sort((a, b) => b[0].length - a[0].length);
        
        sortedTranslations.forEach(([jp, en]) => {
            const regex = new RegExp(jp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
            translated = translated.replace(regex, en);
        });
        
        // 特殊パターンの翻訳
        translated = translated.replace(/(\d+)日移動平均/g, '$1-day moving average');
        translated = translated.replace(/(\d+)週間/g, '$1 weeks');
        translated = translated.replace(/(\d+)ヶ月/g, '$1 months');
        translated = translated.replace(/(\d+)年/g, '$1 years');
        translated = translated.replace(/前日比/g, 'compared to previous day');
        translated = translated.replace(/前週比/g, 'compared to previous week');
        translated = translated.replace(/前月比/g, 'compared to previous month');
        translated = translated.replace(/年初来/g, 'year-to-date');
        translated = translated.replace(/史上最高値/g, 'all-time high');
        
        // 企業名や固有名詞の処理
        translated = translated.replace(/テスラ/g, 'Tesla');
        translated = translated.replace(/アップル/g, 'Apple');
        translated = translated.replace(/マイクロソフト/g, 'Microsoft');
        translated = translated.replace(/グーグル/g, 'Google');
        translated = translated.replace(/アマゾン/g, 'Amazon');
        translated = translated.replace(/メタ/g, 'Meta');
        translated = translated.replace(/エヌビディア/g, 'NVIDIA');
        
        // 指標名の統一
        translated = translated.replace(/VIX指数/g, 'VIX Index');
        translated = translated.replace(/恐怖指数/g, 'Fear Index');
        translated = translated.replace(/Put Call Ratio/g, 'Put-Call Ratio');
        
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