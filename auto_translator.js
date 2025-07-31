// 自動翻訳システム
class AutoTranslator {
    constructor() {
        this.translationCache = new Map();
        this.initializeTranslationDictionary();
    }

    // 翻訳辞書の初期化
    initializeTranslationDictionary() {
        this.dictionary = {
            // 評価関連
            '買い': 'Buy',
            '売り': 'Sell',
            'ホールド': 'Hold',
            '中立': 'Neutral',
            '強気': 'Bullish',
            '弱気': 'Bearish',
            
            // 市場状況
            '史上最高値圏': 'near all-time highs',
            '史上最高値': 'all-time high',
            '市場': 'market',
            '投資家': 'investors',
            'プロ投資家': 'professional investors',
            '個人投資家': 'individual investors',
            '短期トレーダー': 'short-term traders',
            'リスク管理': 'risk management',
            '最高値圏': 'near all-time highs',
            '記録更新の裏に潜む疲弊の兆候': 'signs of exhaustion lurking behind record-breaking performance',
            '市場は自らの成功の重みに耐えられるか': 'can the market withstand the weight of its own success',
            '記録更新': 'record-breaking',
            '市場の健全性': 'Market Health',
            '市場心理': 'Market Sentiment',
            'テクニカル分析': 'Technical Analysis',
            'ファンダメンタルズ': 'Fundamentals',
            '投資戦略': 'Investment Strategy',
            
            // 価格レベル
            '上値抵抗線': 'Resistance Level',
            '下値支持線': 'Support Level',
            'レジスタンス': 'Resistance',
            'サポート': 'Support',
            
            // 指標関連
            'エクイティ Put Call Ratio': 'Equity Put Call Ratio',
            'VIX': 'VIX',
            '恐怖指数': 'Fear Index',
            'CNN Fear & Greed': 'CNN Fear & Greed',
            'AAII 個人投資家センチメント': 'AAII Individual Investor Sentiment',
            'Investors Intelligence ブルベア指数': 'Investors Intelligence Bull/Bear Index',
            '強気 (Bulls)': 'Bulls',
            '弱気 (Bears)': 'Bears',
            
            // 時間関連
            '前日終値': 'Previous Close',
            '当日レシオ': 'Daily Ratio',
            '21日移動平均': '21-day Moving Average',
            '50日移動平均線': '50-day Moving Average',
            'アドバンス・デクライン・ライン (ADL)': 'Advance-Decline Line (ADL)',
            
            // センチメント
            '強気': 'Bullish',
            '弱気': 'Bearish',
            '中立': 'Neutral',
            
            // 詳細分析
            '市場の内部構造': 'Market Internal Structure',
            'テクニカル分析': 'Technical Analysis',
            'ファンダメンタルズ & 心理': 'Fundamentals & Psychology',
            '投資戦略': 'Investment Strategy',
            
            // 戦略関連
            '基本戦略': 'Basic Strategy',
            'リスク管理': 'Risk Management',
            
            // 市場概況
            '市場概況': 'Market Overview',
            '注目銘柄': 'Notable Stocks',
            'Top Movers': 'Top Movers',
            
            // フッター
            'この分析は提供された情報に基づく予測であり、投資成果を保証するものではありません。': 'This analysis is a prediction based on provided information and does not guarantee investment results.',
            'Copyright &copy; 2025 Market Insight. All Rights Reserved.': 'Copyright &copy; 2025 Market Insight. All Rights Reserved.',
            
            // ナビゲーション
            '本日の市況分析': 'Today\'s Market Analysis',
            '分析アーカイブ': 'Analysis Archive',
            'テクニカル指標解説': 'Technical Indicator Guide',
            '市場用語集': 'Market Glossary',
            'サイトについて': 'About Site',
            
            // ボタン
            'ログイン': 'Login',
            '無料登録': 'Free Registration',
            '詳細を見る': 'View Details',
            
            // メインコンテンツ
            'S&P 500 インタラクティブ市場分析': 'S&P 500 Interactive Market Analysis',
            '短期トレーダーのためのデータ駆動型インサイト': 'Data-driven insights for short-term traders',
            '総合評価': 'Overall Rating',
            
            // 重要な文章レベルの翻訳
            'S&P 500は史上最高値圏にありますが、内部指標は深刻な悪化を示しています。プロ投資家の熱狂と個人投資家の慎重さの乖離は逆張りの売りシグナルです。短期トレーダーはリスク管理を最優先し、高値追いを控えるべき局面です。': 'S&P 500 is near all-time highs, but internal indicators show serious deterioration. The divergence between professional investor euphoria and individual investor caution is a contrarian sell signal. Short-term traders should prioritize risk management and avoid chasing highs in this phase.',
            
            // 詳細なフレーズ翻訳
            'S&P 500は史上最高値圏にありますが、内部指標は深刻な悪化を示しています': 'S&P 500 is near all-time highs, but internal indicators show serious deterioration',
            'プロ投資家の熱狂と個人投資家の慎重さの乖離は逆張りの売りシグナルです': 'the divergence between professional investor euphoria and individual investor caution is a contrarian sell signal',
            '短期トレーダーはリスク管理を最優先し、高値追いを控えるべき局面です': 'short-term traders should prioritize risk management and avoid chasing highs in this phase',
            '値上がり銘柄数が値下がり銘柄数を上回っていますが': 'advancing stocks outnumber declining stocks, but',
            '一部主要銘柄の急落はラリーの脆弱性を示唆しています': 'sharp declines in some major stocks suggest rally fragility',
            'インデックスは「Greed（強欲）」の領域にあり': 'the index is in "Greed" territory',
            '広範な楽観論と自己満足を反映しています': 'reflecting widespread optimism and complacency',
            '歴史的には調整の前兆です': 'historically a precursor to correction',
            '心理的な節目。利益確定売りの壁': 'psychological level. Profit-taking wall',
            '短期的な心理的支持線。割り込むと弱気転換': 'short-term psychological support. Break below signals bearish reversal',
            '警戒感の萌芽': 'emergence of caution',
            '日次レシオの急上昇は、一部投資家が下落ヘッジを始めている兆候です': 'sharp rise in daily ratio signals some investors are starting downside hedging',
            
            // ヘッドライン
            'プロの熱狂と個人の冷静：危険なセンチメントの乖離': 'Professional euphoria vs individual caution: dangerous sentiment divergence',
            '上昇トレンドは継続、しかし過熱感とダイバージェンスが転換を示唆': 'uptrend continues, but overheated conditions and divergence suggest reversal',
            '好決算と金利期待が支える楽観論、VIXの低さは油断の証': 'optimism supported by strong earnings and rate expectations, low VIX shows complacency',
            '守りを固め、利益を確保し、次の機会を待つ': 'consolidate defense, secure profits, wait for next opportunity',
            
            // 長文テキスト
            'プロ投資家は極端に楽観的（歴史的には天井のサイン）である一方、個人は懐疑的です': 'professional investors are extremely optimistic (historically a top signal) while individuals remain skeptical',
            'この「スマートマネーの熱狂」と「ダムマネーの躊躇」の組み合わせは、ラリーの基盤が極めて脆弱であることを示しています': 'this combination of "smart money euphoria" and "dumb money hesitation" shows the rally\'s foundation is extremely fragile',
            '指数が上昇する一方で市場の幅（A/Dライン）が追随していない「質の悪い」上昇であることです': 'it\'s a "poor quality" rise where the index rises while market breadth (A/D line) fails to follow',
            '市場の楽観論は好調な企業決算とFRBの利下げ期待に支えられています': 'market optimism is supported by strong corporate earnings and Fed rate cut expectations',
            'VIXの低水準は危険な自己満足を反映しており、来週のFOMCや主要決算といったイベントリスクに対し脆弱な状態です': 'low VIX levels reflect dangerous complacency, making markets vulnerable to event risks like next week\'s FOMC and major earnings',
            
            // VIX関連
            'VIXは52週間の安値圏にあり、市場の極端な自己満足を示しています': 'VIX is near 52-week lows, showing extreme market complacency',
            '予期せぬニュースがボラティリティの急上昇を引き起こす可能性があります': 'unexpected news could trigger a sharp volatility spike',
            
            // センチメント調査
            '個人投資家はラリーに懐疑的でセンチメントはほぼ中立': 'individual investors are skeptical of the rally with sentiment nearly neutral',
            '広範な支持を欠いていることを示す警告サインです': 'a warning sign showing lack of broad support',
            'プロ投資家の極端な強気は強力な逆張り指標であり': 'extreme bullishness among professional investors is a powerful contrarian indicator',
            '「スマートマネー」が熱狂状態にあることを示唆します': 'suggesting "smart money" is in a euphoric state',
            
            // ファンダメンタルズ
            '好調な第2四半期決算が、市場ラリーのファンダメンタルズ面での支えとなっている': 'strong Q2 earnings provide fundamental support for the market rally',
            'FRBによる利下げ期待が、流動性とリスク選好を後押ししている': 'Fed rate cut expectations are boosting liquidity and risk appetite',
            '低いVIX指数とプロ投資家の極端な強気の組み合わせは、ネガティブなサプライズに非常に脆弱な環境を生み出している': 'the combination of low VIX and extreme professional bullishness creates an environment highly vulnerable to negative surprises',
            
            // 戦略
            '既存ロングは部分的な利益確定を検討し、ストップロスを6,350直下に設定': 'consider partial profit-taking on existing longs, set stop-loss just below 6,350',
            '新規ポジションは高値追いを避け、6,250〜6,300への調整を待つのが賢明です': 'for new positions, avoid chasing highs and wait for pullback to 6,250-6,300',
            '最大のリスクはFOMOによる「メルトアップ」相場です': 'the biggest risk is a FOMO-driven "melt-up" market',
            '弱気見方は、S&P 500が6,450を力強く上抜け、かつ市場の幅が改善した場合に無効となります': 'bearish view becomes invalid if S&P 500 breaks strongly above 6,450 with improving market breadth',
            
            // 一般的な助詞・語尾（空文字列に変換）
            'について': '',
            'による': '',
            'によって': '',
            'である': '',
            'です': '',
            'ます': '',
            'した': '',
            'する': '',
            'しています': '',
            'としている': '',
            'と': ' and ',
            'が': ' ',
            'は': ' ',
            'を': ' ',
            'に': ' ',
            'の': ' ',
            'で': ' '
        };
    }

    // 日本語テキストを英語に翻訳
    translateText(japaneseText) {
        if (!japaneseText || typeof japaneseText !== 'string') {
            return japaneseText;
        }

        // キャッシュをチェック
        if (this.translationCache.has(japaneseText)) {
            return this.translationCache.get(japaneseText);
        }

        let englishText = japaneseText;
        
        // 長いフレーズから短いものの順で置換（より正確な翻訳のため）
        const sortedEntries = Object.entries(this.dictionary).sort((a, b) => b[0].length - a[0].length);
        
        sortedEntries.forEach(([japanese, english]) => {
            if (english) { // 空文字列でない場合のみ置換
                const regex = new RegExp(japanese.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
                englishText = englishText.replace(regex, english);
            }
        });
        
        // 特定の日本語パターンの変換
        englishText = this.applyTextTransformations(englishText);
        
        // キャッシュに保存
        this.translationCache.set(japaneseText, englishText);
        
        return englishText;
    }

    // テキスト変換の適用
    applyTextTransformations(text) {
        return text
            // 日付フォーマット
            .replace(/(\d+)年(\d+)月(\d+)日/g, (match, year, month, day) => {
                const months = ['January', 'February', 'March', 'April', 'May', 'June',
                               'July', 'August', 'September', 'October', 'November', 'December'];
                return `${months[parseInt(month)-1]} ${parseInt(day)}, ${year}`;
            })
            .replace(/(\d+)月(\d+)日/g, (match, month, day) => {
                const months = ['January', 'February', 'March', 'April', 'May', 'June',
                               'July', 'August', 'September', 'October', 'November', 'December'];
                return `${months[parseInt(month)-1]} ${parseInt(day)}`;
            })
            // 数値と単位
            .replace(/(\d+)日移動平均/g, '$1-day moving average')
            .replace(/(\d+)日/g, '$1-day')
            .replace(/移動平均/g, 'moving average')
            // 句読点
            .replace(/。/g, '. ')
            .replace(/、/g, ', ')
            .replace(/：/g, ': ')
            .replace(/；/g, '; ')
            .replace(/（/g, ' (')
            .replace(/）/g, ') ')
            .replace(/「/g, '"')
            .replace(/」/g, '"')
            // 不要な日本語助詞の削除
            .replace(/\s+(に|の|を|が|は|で|と)\s+/g, ' ')
            // 余分な空白を削除
            .replace(/\s+/g, ' ')
            // 英語の文法調整
            .replace(/\s+and\s+and\s+/g, ' and ')
            .replace(/\s+of\s+of\s+/g, ' of ')
            // 文の始まりを大文字に
            .replace(/^\s*([a-z])/g, (match, p1) => match.replace(p1, p1.toUpperCase()))
            .replace(/\.\s+([a-z])/g, (match, p1) => match.replace(p1, p1.toUpperCase()))
            .replace(/:\s+([a-z])/g, (match, p1) => match.replace(p1, p1.toUpperCase()))
            // 最終的なクリーンアップ
            .replace(/\s+([.,:;!?])/g, '$1') // 句読点前の空白除去
            .replace(/\(\s+/g, '(') // 括弧内の余分な空白
            .replace(/\s+\)/g, ')') // 括弧内の余分な空白
            .replace(/\s+$/g, '') // 文末の空白除去
            .replace(/^\s+/g, '') // 文頭の空白除去
            .trim();
    }

    // オブジェクトを再帰的に翻訳
    translateObject(obj) {
        if (typeof obj === 'string') {
            return this.translateText(obj);
        } else if (Array.isArray(obj)) {
            return obj.map(item => this.translateObject(item));
        } else if (obj !== null && typeof obj === 'object') {
            const translated = {};
            for (const [key, value] of Object.entries(obj)) {
                // キーも翻訳（必要に応じて）
                const translatedKey = this.shouldTranslateKey(key) ? this.translateText(key) : key;
                translated[translatedKey] = this.translateObject(value);
            }
            return translated;
        }
        return obj;
    }

    // キーを翻訳すべきかどうかを判定
    shouldTranslateKey(key) {
        // 特定のキーは翻訳しない
        const skipKeys = ['id', 'date', 'session', 'evaluation', 'score', 'stars', 'headline', 'text', 'summary', 'details'];
        return !skipKeys.includes(key);
    }

    // JSONデータを完全に翻訳
    translateJsonData(japaneseData) {
        console.log('Translating JSON data from Japanese to English...');
        
        // データの構造を保持しながら翻訳
        const translatedData = {
            ...japaneseData,
            languages: {
                ja: japaneseData.languages?.ja || japaneseData,
                en: this.translateObject(japaneseData.languages?.ja || japaneseData)
            }
        };

        // 日付とセッション情報も翻訳
        if (translatedData.date) {
            translatedData.languages.en.date = this.translateText(translatedData.date);
        }
        if (translatedData.session) {
            translatedData.languages.en.session = this.translateText(translatedData.session);
        }

        console.log('Translation completed:', translatedData);
        return translatedData;
    }

    // キャッシュをクリア
    clearCache() {
        this.translationCache.clear();
    }
}

// グローバルインスタンスを作成
window.autoTranslator = new AutoTranslator();

// 既存の関数との互換性を保つ
window.autoTranslateText = (text) => window.autoTranslator.translateText(text);
window.translateObjectRecursively = (obj) => window.autoTranslator.translateObject(obj); 