// extract_from_latest.js
// latest.htmlからデータを抽出し、多言語対応JSONファイルを作成

const fs = require('fs');
const path = require('path');

function extractFromLatestHtml() {
    try {
        console.log('📖 latest.htmlからデータを抽出中...');
        
        const htmlContent = fs.readFileSync('./latest.html', 'utf8');
        
        // JavaScriptのreportDataオブジェクトを抽出
        const reportDataMatch = htmlContent.match(/const reportData = ({[\s\S]*?});/);
        
        if (!reportDataMatch) {
            throw new Error('reportDataオブジェクトが見つかりません');
        }
        
        // JSONとして解析
        const reportDataString = reportDataMatch[1];
        const reportData = eval('(' + reportDataString + ')');
        
        console.log('✅ データ抽出完了');
        console.log(`📅 日付: ${reportData.date}`);
        console.log(`📊 セッション: ${reportData.session}`);
        console.log(`📈 評価: ${reportData.summary.evaluation}`);
        
        // 新しいファイル名を生成（今日の日付）
        const today = new Date();
        const dateStr = `${today.getFullYear()}.${today.getMonth() + 1}.${today.getDate()}`;
        const fileName = `${dateStr}.json`;
        
        // 多言語対応構造に変換
        const multilingualData = convertToMultilingualFormat(reportData);
        
        // archive_dataフォルダに保存
        const outputPath = path.join('./archive_data', fileName);
        fs.writeFileSync(outputPath, JSON.stringify(multilingualData, null, 2));
        
        console.log(`💾 新しいファイルを作成: ${fileName}`);
        console.log(`📁 保存先: ${outputPath}`);
        
        return { fileName, outputPath, data: multilingualData };
        
    } catch (error) {
        console.error('❌ エラーが発生しました:', error.message);
        throw error;
    }
}

function convertToMultilingualFormat(reportData) {
    // 標準的な多言語対応構造に変換
    return {
        date: reportData.date,
        session: reportData.session,
        languages: {
            ja: {
                session: reportData.session,
                date: reportData.date,
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
                            value: "$" + reportData.dashboard.priceLevels.resistance.value,
                            description: reportData.dashboard.priceLevels.resistance.description
                        },
                        support: {
                            value: "$" + reportData.dashboard.priceLevels.support.value,
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
                        chartData: {
                            labels: reportData.details.internals.chartData.labels,
                            values: reportData.details.internals.chartData.values
                        }
                    },
                    technicals: {
                        headline: reportData.details.technicals.headline,
                        text: reportData.details.technicals.text,
                        chartData: {
                            labels: reportData.details.technicals.chartData.labels,
                            sp500: reportData.details.technicals.chartData.sp500,
                            ma50: reportData.details.technicals.chartData.ma50,
                            adl: reportData.details.technicals.chartData.adl
                        }
                    },
                    fundamentals: {
                        headline: reportData.details.fundamentals.headline,
                        text: reportData.details.fundamentals.text,
                        vix: {
                            value: reportData.details.fundamentals.vix.value,
                            change: reportData.details.fundamentals.vix.change,
                            summary: reportData.details.fundamentals.vix.summary
                        },
                        aaiiSurvey: {
                            date: reportData.details.fundamentals.aaiiSurvey.date,
                            bullish: reportData.details.fundamentals.aaiiSurvey.bullish,
                            neutral: reportData.details.fundamentals.aaiiSurvey.neutral,
                            bearish: reportData.details.fundamentals.aaiiSurvey.bearish,
                            summary: reportData.details.fundamentals.aaiiSurvey.summary
                        },
                        investorsIntelligence: {
                            date: reportData.details.fundamentals.investorsIntelligence.date,
                            bullish: reportData.details.fundamentals.investorsIntelligence.bullish,
                            bearish: reportData.details.fundamentals.investorsIntelligence.bearish,
                            correction: reportData.details.fundamentals.investorsIntelligence.correction,
                            summary: reportData.details.fundamentals.investorsIntelligence.summary
                        },
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
                session: reportData.session.replace('市場分析', 'Market Analysis'),
                date: reportData.date,
                summary: {
                    evaluation: translateEvaluation(reportData.summary.evaluation),
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
                            value: "$" + reportData.dashboard.priceLevels.resistance.value,
                            description: translateText(reportData.dashboard.priceLevels.resistance.description)
                        },
                        support: {
                            value: "$" + reportData.dashboard.priceLevels.support.value,
                            description: translateText(reportData.dashboard.priceLevels.support.description)
                        }
                    },
                    putCallRatio: {
                        dailyValue: reportData.dashboard.putCallRatio.dailyValue,
                        movingAverage: reportData.dashboard.putCallRatio.movingAverage,
                        status: translatePutCallStatus(reportData.dashboard.putCallRatio.status),
                        summary: translateText(reportData.dashboard.putCallRatio.summary)
                    }
                },
                details: {
                    internals: {
                        headline: translateText(reportData.details.internals.headline),
                        text: translateText(reportData.details.internals.text),
                        chartData: {
                            labels: reportData.details.internals.chartData.labels,
                            values: reportData.details.internals.chartData.values
                        }
                    },
                    technicals: {
                        headline: translateText(reportData.details.technicals.headline),
                        text: translateText(reportData.details.technicals.text),
                        chartData: {
                            labels: reportData.details.technicals.chartData.labels,
                            sp500: reportData.details.technicals.chartData.sp500,
                            ma50: reportData.details.technicals.chartData.ma50,
                            adl: reportData.details.technicals.chartData.adl
                        }
                    },
                    fundamentals: {
                        headline: translateText(reportData.details.fundamentals.headline),
                        text: translateText(reportData.details.fundamentals.text),
                        vix: {
                            value: reportData.details.fundamentals.vix.value,
                            change: reportData.details.fundamentals.vix.change,
                            summary: translateText(reportData.details.fundamentals.vix.summary)
                        },
                        aaiiSurvey: {
                            date: translateDate(reportData.details.fundamentals.aaiiSurvey.date),
                            bullish: reportData.details.fundamentals.aaiiSurvey.bullish,
                            neutral: reportData.details.fundamentals.aaiiSurvey.neutral,
                            bearish: reportData.details.fundamentals.aaiiSurvey.bearish,
                            summary: translateText(reportData.details.fundamentals.aaiiSurvey.summary)
                        },
                        investorsIntelligence: {
                            date: translateDate(reportData.details.fundamentals.investorsIntelligence.date),
                            bullish: reportData.details.fundamentals.investorsIntelligence.bullish,
                            bearish: reportData.details.fundamentals.investorsIntelligence.bearish,
                            correction: reportData.details.fundamentals.investorsIntelligence.correction,
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
                    name: translateMarketName(item.name)
                })),
                hotStocks: reportData.hotStocks.map(stock => ({
                    ...stock,
                    price: translateText(stock.price),
                    description: translateText(stock.description)
                }))
            }
        }
    };
}

function translateEvaluation(evaluation) {
    const map = {
        "買い": "buy",
        "売り": "sell",
        "中立": "neutral",
        "ホールド": "hold"
    };
    return map[evaluation] || evaluation;
}

function translatePutCallStatus(status) {
    const map = {
        "極度の自己満足シグナル": "extreme complacency signal",
        "警戒感の萌芽": "emerging caution",
        "中立": "neutral",
        "弱気シグナル": "bearish signal"
    };
    return map[status] || status;
}

function translateDate(dateStr) {
    if (!dateStr) return "";
    return dateStr
        .replace(/年/g, ', ')
        .replace(/月/g, '/')
        .replace(/日/g, '')
        .replace(/調査/g, ' Survey');
}

function translateMarketName(name) {
    const map = {
        "S&P 500 (7/25終値)": "S&P 500 (7/25 Close)",
        "S&P 500 先物": "S&P 500 Futures",
        "VIX指数": "VIX Index",
        "米国10年債利回り": "US 10Y Treasury"
    };
    return map[name] || name;
}

function translateText(text) {
    // 基本的な金融用語の翻訳マップ
    const translations = {
        // 完全なフレーズ翻訳（優先）
        "記録更新の裏に潜む疲弊の兆候：市場は自らの成功の重みに耐えられるか？": "Signs of Exhaustion Behind Record Highs: Can the Market Bear the Weight of Its Own Success?",
        "S&P 500は史上最高値圏にありますが、内部指標は深刻な悪化を示しています。プロ投資家の熱狂と個人投資家の慎重さの乖離は逆張りの売りシグナルです。短期トレーダーはリスク管理を最優先し、高値追いを控えるべき局面です。": "While the S&P 500 is near all-time highs, internal indicators show serious deterioration. The divergence between professional investor euphoria and retail investor caution is a contrarian sell signal. Short-term traders should prioritize risk management and avoid chasing highs in this phase.",
        "値上がり銘柄数が値下がり銘柄数を上回っていますが、一部主要銘柄の急落はラリーの脆弱性を示唆しています。": "Advancing issues exceed declining issues, but sharp declines in some major stocks suggest rally fragility.",
        "インデックスは「Greed（強欲）」の領域にあり、広範な楽観論と自己満足を反映しています。歴史的には調整の前兆です。": "The index is in 'Greed' territory, reflecting widespread optimism and complacency. Historically, this is a precursor to correction.",
        "日次レシオの急上昇は、一部投資家が下落ヘッジを始めている兆候です。": "The sharp rise in daily ratio is a sign some investors are beginning downside hedging.",
        "プロの熱狂と個人の冷静：危険なセンチメントの乖離": "Professional Euphoria vs. Retail Caution: Dangerous Sentiment Divergence",
        "プロ投資家は極端に楽観的（歴史的には天井のサイン）である一方、個人は懐疑的です。この「スマートマネーの熱狂」と「ダムマネーの躊躇」の組み合わせは、ラリーの基盤が極めて脆弱であることを示しています。": "Professional investors are extremely optimistic (historically a peak signal) while retail investors remain skeptical. This combination of 'smart money euphoria' and 'dumb money hesitation' indicates the rally's foundation is extremely fragile.",
        "上昇トレンドは継続、しかし過熱感とダイバージェンスが転換を示唆": "Uptrend Continues, But Overheating and Divergence Suggest Reversal",
        "S&P 500は史上最高値圏にありますが、RSIは「買われすぎ」を示し、MACDは勢いの鈍化を示唆しています。より深刻なのは、指数が上昇する一方で市場の幅（A/Dライン）が追随していない「質の悪い」上昇であることです。": "While the S&P 500 is near all-time highs, RSI shows 'overbought' conditions and MACD suggests momentum deceleration. More seriously, this is a 'poor quality' advance where the index rises while market breadth (A/D Line) fails to follow.",
        "好決算と金利期待が支える楽観論、VIXの低さは油断の証": "Optimism Supported by Earnings and Rate Expectations, Low VIX Shows Complacency",
        "市場の楽観論は好調な企業決算とFRBの利下げ期待に支えられています。しかし、VIXの低水準は危険な自己満足を反映しており、来週のFOMCや主要決算といったイベントリスクに対し脆弱な状態です。": "Market optimism is supported by strong corporate earnings and expectations for Fed rate cuts. However, the low VIX level reflects dangerous complacency, leaving the market vulnerable to event risks like next week's FOMC and major earnings.",
        "守りを固め、利益を確保し、次の機会を待つ": "Strengthen Defense, Secure Profits, and Wait for the Next Opportunity",
        "既存ロングは部分的な利益確定を検討し、ストップロスを6,350直下に設定。新規ポジションは高値追いを避け、6,250〜6,300への調整を待つのが賢明です。": "Consider partial profit-taking on existing longs and set stop-losses just below 6,350. For new positions, it's wise to avoid chasing highs and wait for a pullback to 6,250-6,300.",
        "最大のリスクはFOMOによる「メルトアップ」相場です。弱気見方は、S&P 500が6,450を力強く上抜け、かつ市場の幅が改善した場合に無効となります。": "The biggest risk is a FOMO-driven 'melt-up' market. The bearish view would be invalidated if the S&P 500 strongly breaks above 6,450 with improving market breadth.",
        
        // 個別用語
        "史上最高値圏": "near all-time highs",
        "内部指標": "internal indicators", 
        "深刻な悪化": "serious deterioration",
        "プロ投資家": "professional investors",
        "個人投資家": "retail investors",
        "熱狂": "euphoria",
        "慎重さ": "caution",
        "乖離": "divergence",
        "逆張り": "contrarian",
        "売りシグナル": "sell signal",
        "短期トレーダー": "short-term traders",
        "リスク管理": "risk management",
        "最優先": "top priority",
        "高値追い": "chasing highs",
        "控えるべき": "should avoid",
        "局面": "phase",
        "値上がり銘柄数": "advancing issues",
        "値下がり銘柄数": "declining issues",
        "上回って": "exceed",
        "主要銘柄": "major stocks",
        "急落": "sharp decline",
        "ラリー": "rally",
        "脆弱性": "fragility",
        "示唆": "suggest",
        "インデックス": "index",
        "強欲": "greed", 
        "領域": "territory",
        "広範な楽観論": "widespread optimism",
        "自己満足": "complacency",
        "反映": "reflect",
        "歴史的": "historically",
        "調整の前兆": "precursor to correction",
        "心理的な節目": "psychological level",
        "利益確定売り": "profit-taking",
        "の壁": " resistance",
        "短期的な心理的支持線": "short-term psychological support",
        "割り込む": "break below",
        "弱気転換": "bearish reversal",
        "警戒感の萌芽": "emerging caution",
        "日次レシオ": "daily ratio",
        "急上昇": "sharp rise",
        "一部投資家": "some investors",
        "下落ヘッジ": "downside hedging",
        "始めている": "are beginning",
        "兆候": "sign",
        "VIXは52週間の安値圏にあり、市場の極端な自己満足を示しています。予期せぬニュースがボラティリティの急上昇を引き起こす可能性があります。": "VIX is near 52-week lows, showing extreme market complacency. Unexpected news could trigger a volatility spike.",
        "個人投資家はラリーに懐疑的でセンチメントはほぼ中立。広範な支持を欠いていることを示す警告サインです。": "Retail investors are skeptical of the rally with sentiment nearly neutral. This is a warning sign showing lack of broad support.",
        "プロ投資家の極端な強気は強力な逆張り指標であり、「スマートマネー」が熱狂状態にあることを示唆します。": "Professional investors' extreme bullishness is a powerful contrarian indicator, suggesting 'smart money' is in euphoric state.",
        "好調な第2四半期決算が、市場ラリーのファンダメンタルズ面での支えとなっている。": "Strong Q2 earnings are providing fundamental support for the market rally.",
        "FRBによる利下げ期待が、流動性とリスク選好を後押ししている。": "Fed rate cut expectations are boosting liquidity and risk appetite.",
        "低いVIX指数とプロ投資家の極端な強気の組み合わせは、ネガティブなサプライズに非常に脆弱な環境を生み出している。": "The combination of low VIX and extreme professional bullishness creates an environment highly vulnerable to negative surprises.",
        "決算失望で-8.5%の急落。市場内部の亀裂を象徴。": "Sharp 8.5% decline on earnings disappointment. Symbolizes cracks in market internals.",
        "-18.5%の暴落。特定のセクターの弱さを示す。": "18.5% plunge. Shows weakness in specific sectors.",
        "好決算を発表し、市場のセンチメントを一部下支え。": "Announced strong earnings, partially supporting market sentiment.",
        "主な値下がり銘柄": "Major Declining Stock",
        "主な値上がり銘柄": "Major Advancing Stock",
        "短期的な心理的支持線。割り込むと弱気転換。": "Short-term psychological support. Break below triggers bearish reversal."
    };
    
    let translatedText = text;
    
    // 翻訳マップを適用（完全一致を優先）
    // 長いフレーズから短いフレーズの順にソートして、より具体的な翻訳を優先
    const sortedTranslations = Object.entries(translations).sort((a, b) => b[0].length - a[0].length);
    
    for (const [japanese, english] of sortedTranslations) {
        // シンプルな文字列置換を使用
        if (translatedText.includes(japanese)) {
            translatedText = translatedText.split(japanese).join(english);
        }
    }
    
    // まだ日本語が残っている場合は、基本的な英語プレフィックスを付ける
    if (/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(translatedText)) {
        return "[EN] " + text;
    }
    
    return translatedText;
}

// スクリプト実行
if (require.main === module) {
    try {
        const result = extractFromLatestHtml();
        console.log('\n🎉 処理完了!');
        console.log(`📄 作成されたファイル: ${result.fileName}`);
        console.log('\n次のステップ:');
        console.log(`1. node update_latest.js ${result.fileName}`);
        console.log('2. サイトで内容を確認');
    } catch (error) {
        process.exit(1);
    }
}

module.exports = { extractFromLatestHtml, convertToMultilingualFormat };