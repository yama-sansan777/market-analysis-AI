// 日本語テキストから英語を自動生成する辞書
const translationDict = {
    // 評価関連
    '買い': 'Buy',
    '売り': 'Sell',
    'ホールド': 'Hold',
    '中立': 'Neutral',
    
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
    
    // 重要な文章レベルの翻訳
    'S&P 500は史上最高値圏にありますが、内部指標は深刻な悪化を示しています。プロ投資家の熱狂と個人投資家の慎重さの乖離は逆張りの売りシグナルです。短期トレーダーはリスク管理を最優先し、高値追いを控えるべき局面です。': 'S&P 500 is near all-time highs, but internal indicators show serious deterioration. The divergence between professional investor euphoria and individual investor caution is a contrarian sell signal. Short-term traders should prioritize risk management and avoid chasing highs in this phase.',
    
    // Put/Call Ratio関連
    '当日レシオ': 'Daily Ratio',
    '21日移動平均': '21-day Moving Average',
    
    // 株式関連
    '主な値下がり銘柄': 'major declining stock',
    '主な値上がり銘柄': 'major advancing stock',
    
    // 市場データ
    'S&P 500 (7/25終値)': 'S&P 500 (7/25 close)',
    'S&P 500 先物': 'S&P 500 futures',
    'VIX指数': 'VIX index',
    '米国10年債利回り': 'US 10-year yield',
    
    // 日付・調査
    '2025年7月28日': 'July 28, 2025',
    '7月28日 市場分析': 'July 28 Market Analysis',
    '2025年7月24日調査': 'July 24, 2025 survey',
    '2025年7月23日調査': 'July 23, 2025 survey',
    
    // 基本用語
    '値上がり銘柄数が値下がり銘柄数を上回っていますが': 'advancing stocks outnumber declining stocks, but',
    '一部主要銘柄の急落はラリーの脆弱性を示唆しています': 'sharp declines in some major stocks suggest rally fragility',
    'インデックスは「Greed（強欲）」の領域にあり': 'the index is in "Greed" territory',
    '広範な楽観論と自己満足を反映しています': 'reflecting widespread optimism and complacency',
    '歴史的には調整の前兆です': 'historically a precursor to correction',
    '心理的な節目。利益確定売りの壁': 'psychological level. Profit-taking wall',
    '短期的な心理的支持線。割り込むと弱気転換': 'short-term psychological support. Break below signals bearish reversal',
    '警戒感の萌芽': 'emergence of caution',
    '日次レシオの急上昇は、一部投資家が下落ヘッジを始めている兆候です': 'sharp rise in daily ratio signals some investors are starting downside hedging'
};

// 日本語テキストを英語に自動翻訳する関数
function autoTranslateText(japaneseText) {
    if (!japaneseText) return '';
    
    let englishText = japaneseText;
    
    // 長いフレーズから短いものの順で置換（より正確な翻訳のため）
    const sortedEntries = Object.entries(translationDict).sort((a, b) => b[0].length - a[0].length);
    
    sortedEntries.forEach(([japanese, english]) => {
        if (english) { // 空文字列でない場合のみ置換
            const regex = new RegExp(japanese.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            englishText = englishText.replace(regex, english);
        }
    });
    
    // 特定の日本語パターンの変換
    englishText = englishText
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
        .trim();
        
    return englishText;
}

// オブジェクトを再帰的に翻訳する関数
function translateObjectRecursively(obj) {
    if (typeof obj === 'string') {
        return autoTranslateText(obj);
    } else if (Array.isArray(obj)) {
        return obj.map(item => translateObjectRecursively(item));
    } else if (obj !== null && typeof obj === 'object') {
        const translated = {};
        for (const [key, value] of Object.entries(obj)) {
            translated[key] = translateObjectRecursively(value);
        }
        return translated;
    }
    return obj;
}

// 日本語データから英語データを自動生成する関数
function generateEnglishData(japaneseData) {
    return translateObjectRecursively(japaneseData);
}

// 多言語対応データから現在の言語のデータを取得
function getLocalizedData(rawData) {
    console.log('Raw data received:', rawData);
    
    // 現在の言語設定を取得（lang.jsから）
    const currentLang = window.currentLang || 'ja';
    console.log('Current language:', currentLang);
    
    // 新しい多言語構造の場合
    if (rawData.languages) {
        console.log('Multilingual structure detected');
        
        // 英語データを常に日本語データから自動生成（既存の不完全な英語データを上書き）
        if (currentLang === 'en' && rawData.languages.ja) {
            console.log('Generating English data from Japanese...');
            rawData.languages.en = generateEnglishData(rawData.languages.ja);
            
            // 基本情報も英語化
            if (rawData.date) {
                rawData.languages.en.date = autoTranslateText(rawData.date);
            }
            if (rawData.session) {
                rawData.languages.en.session = autoTranslateText(rawData.session);
            }
        }
        
        const langData = rawData.languages[currentLang] || rawData.languages.ja;
        console.log('Selected language data:', langData);
        
        const result = {
            ...rawData,
            ...langData
        };
        console.log('Final localized data:', result);
        return result;
    }
    
    // 従来の構造の場合はそのまま返す
    console.log('Legacy structure detected, returning as-is');
    return rawData;
}

// HTML要素にテキストやリストを流し込む関数
function populateHtmlElements(data) {
    // ヘッダー
    document.getElementById('session').textContent = data.session;
    document.getElementById('date').innerHTML = `<i class="ri-calendar-2-line text-gray-500"></i> ${data.date}`;
    
    // サマリー
    const summaryEval = document.getElementById('summary-evaluation');
    summaryEval.textContent = data.summary.evaluation;
    summaryEval.className = 'text-7xl md:text-9xl font-bold';
    summaryEval.classList.add(data.summary.evaluation === '売り' ? 'text-red-600' : 'text-blue-600');
    
    document.getElementById('summary-score').innerHTML = `${data.summary.score}<span class="text-4xl text-gray-500">/10</span>`;
    document.getElementById('summary-stars').innerHTML = Array.from({ length: 10 }, (_, i) => i < data.summary.score ? '<span>★</span>' : '<span class="text-gray-300">★</span>').join('');
    document.getElementById('summary-headline').textContent = data.summary.headline;
    document.getElementById('summary-text').textContent = data.summary.text;

    // ダッシュボード
    document.getElementById('breadth-summary').textContent = data.dashboard.breadth.summary;
    document.getElementById('sentiment-summary').textContent = data.dashboard.sentimentVISummary;
    document.getElementById('resistance-value').textContent = data.dashboard.priceLevels.resistance.value;
    document.getElementById('resistance-desc').textContent = data.dashboard.priceLevels.resistance.description;
    document.getElementById('support-value').textContent = data.dashboard.priceLevels.support.value;
    document.getElementById('support-desc').textContent = data.dashboard.priceLevels.support.description;
    
    const pcRatio = data.dashboard.putCallRatio;
    const currentLang = window.currentLang || 'ja';
    const dailyRatioLabel = currentLang === 'en' ? 'Daily Ratio' : '当日レシオ';
    const movingAverageLabel = currentLang === 'en' ? '(21-day Moving Average)' : '(21日移動平均)';
    
    document.getElementById('put-call-ratio-container').innerHTML = `
        <div class="flex items-end justify-center gap-4">
            <p class="text-8xl font-bold text-gray-800">${pcRatio.dailyValue}</p>
            <div class="text-left mb-2">
                 <p class="text-xl font-semibold text-gray-500">${dailyRatioLabel}</p>
                 <p class="text-xl font-bold text-gray-700">${pcRatio.movingAverage} <span class="text-base font-medium text-gray-500">${movingAverageLabel}</span></p>
            </div>
        </div>
        <p class="mt-5 px-6 py-2 inline-block bg-red-100 text-red-800 rounded-full text-lg font-semibold">${pcRatio.status}</p>`;
    document.getElementById('put-call-ratio-summary').textContent = pcRatio.summary;
    
    // 詳細分析タブ
    document.getElementById('internals-headline').textContent = data.details.internals.headline;
    document.getElementById('internals-text').textContent = data.details.internals.text;
    document.getElementById('technicals-headline').textContent = data.details.technicals.headline;
    document.getElementById('technicals-text').textContent = data.details.technicals.text;
    
    // ファンダメンタルズ & 心理
    const fundamentals = data.details.fundamentals;
    document.getElementById('fundamentals-headline').textContent = fundamentals.headline;
    document.getElementById('fundamentals-text').textContent = fundamentals.text;
    document.getElementById('fundamentals-list').innerHTML = fundamentals.points.map(point => `<li class="flex items-start"><span class="text-blue-500 mr-4 mt-1"><i class="ri-checkbox-circle-fill ri-xl"></i></span><div>${point}</div></li>`).join('');

    // VIX
    const vix = fundamentals.vix;
    const vixTitle = currentLang === 'en' ? 'VIX (Fear Index)' : 'VIX (恐怖指数)';
    
    document.getElementById('vix-container').innerHTML = `
        <div class="bg-gray-50 rounded-lg p-6 border border-gray-200 h-full">
            <h4 class="text-2xl font-bold text-gray-800 mb-1">${vixTitle}</h4>
            <div class="flex items-baseline gap-4 mb-2">
                <p class="text-5xl font-bold text-red-600">${vix.value}</p>
                <p class="text-xl font-semibold text-red-600">${vix.change}</p>
            </div>
            <p class="mt-2 text-gray-600 text-lg leading-relaxed">${vix.summary}</p>
        </div>`;

    // AAII Sentiment Survey
    const aaii = fundamentals.aaiiSurvey;
    const aaiiTitle = currentLang === 'en' ? 'AAII Individual Investor Sentiment' : 'AAII 個人投資家センチメント';
    const bullishLabel = currentLang === 'en' ? 'Bullish' : '強気';
    const neutralLabel = currentLang === 'en' ? 'Neutral' : '中立';
    const bearishLabel = currentLang === 'en' ? 'Bearish' : '弱気';
    
    document.getElementById('aaii-container').innerHTML = `
        <div class="bg-gray-50 rounded-lg p-6 border border-gray-200 h-full">
            <h4 class="text-2xl font-bold text-gray-800 mb-1">${aaiiTitle}</h4>
            <p class="text-gray-500 mb-4">${aaii.date}</p>
            <div class="space-y-3">
                <div class="flex items-center">
                    <span class="w-24 font-semibold text-bullish">${bullishLabel}</span>
                    <div class="w-full bg-gray-200 rounded-full h-6"><div class="bg-bullish h-6 rounded-full text-center text-white font-bold" style="width: ${aaii.bullish}%">${aaii.bullish}%</div></div>
                </div>
                <div class="flex items-center">
                    <span class="w-24 font-semibold text-neutral">${neutralLabel}</span>
                    <div class="w-full bg-gray-200 rounded-full h-6"><div class="bg-neutral h-6 rounded-full text-center text-white font-bold" style="width: ${aaii.neutral}%">${aaii.neutral}%</div></div>
                </div>
                <div class="flex items-center">
                    <span class="w-24 font-semibold text-bearish">${bearishLabel}</span>
                    <div class="w-full bg-gray-200 rounded-full h-6"><div class="bg-bearish h-6 rounded-full text-center text-white font-bold" style="width: ${aaii.bearish}%">${aaii.bearish}%</div></div>
                </div>
            </div>
            <p class="mt-4 text-gray-600 text-lg leading-relaxed">${aaii.summary}</p>
        </div>
    `;
    
    // Investors Intelligence
    const ii = fundamentals.investorsIntelligence;
    const iiTitle = currentLang === 'en' ? 'Investors Intelligence Bull/Bear Index' : 'Investors Intelligence ブルベア指数';
    const bullsLabel = currentLang === 'en' ? 'Bulls' : '強気 (Bulls)';
    const bearsLabel = currentLang === 'en' ? 'Bears' : '弱気 (Bears)';
    
    document.getElementById('ii-container').innerHTML = `
        <div class="bg-gray-50 rounded-lg p-6 border border-gray-200 h-full">
            <h4 class="text-2xl font-bold text-gray-800 mb-1">${iiTitle}</h4>
             <p class="text-gray-500 mb-4">${ii.date}</p>
            <div class="space-y-3">
                <div class="flex items-center">
                    <span class="w-28 font-semibold text-bullish">${bullsLabel}</span>
                    <div class="w-full bg-gray-200 rounded-full h-6"><div class="bg-bullish h-6 rounded-full text-center text-white font-bold" style="width: ${ii.bullish}%">${ii.bullish}%</div></div>
                </div>
                <div class="flex items-center">
                    <span class="w-28 font-semibold text-bearish">${bearsLabel}</span>
                    <div class="w-full bg-gray-200 rounded-full h-6"><div class="bg-bearish h-6 rounded-full text-center text-white font-bold" style="width: ${ii.bearish}%">${ii.bearish}%</div></div>
                </div>
            </div>
             <p class="mt-4 text-gray-600 text-lg leading-relaxed">${ii.summary}</p>
        </div>`;

    // 投資戦略
    document.getElementById('strategy-headline').textContent = data.details.strategy.headline;
    document.getElementById('strategy-basic').innerHTML = data.details.strategy.basic;
    document.getElementById('strategy-risk').innerHTML = data.details.strategy.risk;

    // サイドバー
    document.getElementById('market-overview-container').innerHTML = data.marketOverview.map(market => `
        <div class="flex justify-between items-baseline">
            <div><p class="font-semibold text-xl text-gray-800">${market.name}</p><p class="text-base ${market.isDown ? 'text-red-600' : 'text-green-600'}">${market.change}</p></div>
            <p class="text-3xl font-bold text-gray-900">${market.value}</p>
        </div>`).join('');

    document.getElementById('hot-stocks-container').innerHTML = data.hotStocks.map(stock => `
        <div>
            <div class="flex justify-between items-center mb-1"><p class="text-lg font-bold text-gray-800">${stock.name}</p><p class="text-lg font-semibold ${stock.isDown ? 'text-red-600' : 'text-green-600'}">${stock.price}</p></div>
            <p class="text-base text-gray-600">${stock.description}</p>
        </div>`).join('');
}

// グローバル変数でチャートインスタンスを管理
let chartInstances = {
    breadthChart: null,
    sentimentGauge: null,
    contributionChart: null,
    technicalChart: null
};

// 既存のチャートを破棄する関数
function destroyExistingCharts() {
    // ECharts インスタンスの破棄
    if (chartInstances.breadthChart) {
        chartInstances.breadthChart.dispose();
        chartInstances.breadthChart = null;
    }
    if (chartInstances.sentimentGauge) {
        chartInstances.sentimentGauge.dispose();
        chartInstances.sentimentGauge = null;
    }
    
    // Chart.js インスタンスの破棄
    if (chartInstances.contributionChart) {
        chartInstances.contributionChart.destroy();
        chartInstances.contributionChart = null;
    }
    if (chartInstances.technicalChart) {
        chartInstances.technicalChart.destroy();
        chartInstances.technicalChart = null;
    }
}

// 全てのチャートを初期化・描画する関数
function initializeAllCharts(data) {
    const FONT_SIZE_TITLE = 20, FONT_SIZE_LEGEND = 16, FONT_SIZE_AXIS = 14;

    // 既存のチャートを破棄
    destroyExistingCharts();

    // 1. 市場の健全性 (ドーナツグラフ)
    chartInstances.breadthChart = echarts.init(document.getElementById('breadthChart'));
    const currentLang = window.currentLang || 'ja';
    const chartLabels = {
        health: currentLang === 'en' ? 'Market Health' : '市場の健全性',
        decliners: currentLang === 'en' ? 'Decliners' : '値下がり',
        advancers: currentLang === 'en' ? 'Advancers' : '値上がり'
    };
    chartInstances.breadthChart.setOption({
        tooltip: { trigger: 'item' },
        legend: { bottom: '5%', left: 'center', textStyle: { fontSize: FONT_SIZE_LEGEND } },
        series: [{
            name: chartLabels.health, type: 'pie', radius: ['50%', '70%'], avoidLabelOverlap: false,
            label: { show: false, position: 'center' },
            emphasis: { label: { show: true, fontSize: '30', fontWeight: 'bold' } },
            labelLine: { show: false },
            data: [
                { value: data.dashboard.breadth.decliners, name: chartLabels.decliners, itemStyle: { color: '#ef4444' } },
                { value: data.dashboard.breadth.advancers, name: chartLabels.advancers, itemStyle: { color: '#3b82f6' } },
            ]
        }]
    });

    // 2. 市場心理 (ゲージ) - CNN Fear & Greed Index
    chartInstances.sentimentGauge = echarts.init(document.getElementById('sentimentGauge'));
    chartInstances.sentimentGauge.setOption({
        series: [{
            type: 'gauge', center: ['50%', '60%'], startAngle: 180, endAngle: 0, min: 0, max: 100, splitNumber: 10,
            itemStyle: { color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [ { offset: 0, color: '#ef4444' }, { offset: 0.5, color: '#f59e0b' }, { offset: 1, color: '#10b981' }]}},
            progress: { show: true, width: 18 }, pointer: { show: true, length: '60%', width: 6 },
            axisLine: { lineStyle: { width: 18 } }, axisTick: { distance: -25, length: 7, lineStyle: { width: 1, color: '#999' } },
            splitLine: { distance: -30, length: 12, lineStyle: { width: 2, color: '#999' } },
            axisLabel: { distance: -10, color: '#999', fontSize: 16 },
            detail: { valueAnimation: true, fontSize: 40, fontWeight: 'bold', offsetCenter: [0, '40%'] },
            data: [{ value: data.dashboard.sentimentVI }]
        }]
    });

    // 3. 寄与度チャート (横棒グラフ)
    const contributionLabel = currentLang === 'en' ? 'S&P 500 Impact' : 'S&P 500への影響';
    
    chartInstances.contributionChart = new Chart(document.getElementById('contributionChart'), {
        type: 'bar',
        data: {
            labels: data.details.internals.chartData.labels,
            datasets: [{
                label: contributionLabel,
                data: data.details.internals.chartData.values,
                backgroundColor: d => d.raw < 0 ? 'rgba(239, 68, 68, 0.7)' : 'rgba(59, 130, 246, 0.7)',
                borderColor: d => d.raw < 0 ? 'rgba(239, 68, 68, 1)' : 'rgba(59, 130, 246, 1)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y', responsive: true, maintainAspectRatio: false,
            scales: { 
                x: { ticks: { font: { size: FONT_SIZE_AXIS }, callback: (v) => v + '%' }}, 
                y: { ticks: { font: { size: FONT_SIZE_AXIS }}}
            },
            plugins: { 
                legend: { display: false }
            }
        }
    });

    // 4. テクニカルチャート (折れ線) with アドバンス・デクライン・ライン
    const ma50Label = currentLang === 'en' ? '50-day Moving Average' : '50日移動平均線';
    const adlLabel = currentLang === 'en' ? 'Advance-Decline Line (ADL)' : 'アドバンス・デクライン・ライン (ADL)';
    
    chartInstances.technicalChart = new Chart(document.getElementById('technicalChart'), {
        type: 'line',
        data: {
            labels: data.details.technicals.chartData.labels,
            datasets: [
                { 
                    label: 'S&P 500', 
                    data: data.details.technicals.chartData.sp500, 
                    borderColor: '#1F2937', 
                    backgroundColor: 'rgba(31, 41, 55, 0.1)', 
                    fill: true, 
                    tension: 0.2, 
                    borderWidth: 2.5,
                    yAxisID: 'y' // 主Y軸（価格）
                },
                { 
                    label: ma50Label, 
                    data: data.details.technicals.chartData.ma50, 
                    borderColor: '#f59e0b', 
                    borderDash: [5, 5], 
                    fill: false, 
                    pointRadius: 0, 
                    borderWidth: 2,
                    yAxisID: 'y'
                },
                {
                    label: adlLabel,
                    data: data.details.technicals.chartData.adl,
                    borderColor: '#8b5cf6', // 紫色
                    fill: false,
                    pointRadius: 2,
                    borderWidth: 2,
                    yAxisID: 'y1' // 第2Y軸（ADL）
                }
            ]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: { 
                x: { ticks: { font: { size: FONT_SIZE_AXIS }}},
                y: { // 主Y軸 (左) - 価格用
                    type: 'linear',
                    display: true,
                    position: 'left',
                    ticks: { font: { size: FONT_SIZE_AXIS }}
                },
                y1: { // 第2Y軸 (右) - ADL用
                    type: 'linear',
                    display: true,
                    position: 'right',
                    ticks: { font: { size: FONT_SIZE_AXIS }},
                    grid: { // 両方の軸のグリッド線でチャートが乱雑になるのを防ぐ
                        drawOnChartArea: false, 
                    },
                } 
            },
            plugins: { 
                legend: { 
                    position: 'top', 
                    labels: { font: {size: FONT_SIZE_LEGEND}, padding: 15 }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            }
        }
    });
    
    window.addEventListener('resize', () => {
        if (chartInstances.breadthChart) {
            chartInstances.breadthChart.resize();
        }
        if (chartInstances.sentimentGauge) {
            chartInstances.sentimentGauge.resize();
        }
    });
}

// タブ機能を初期化する関数
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const tabId = button.dataset.tab;
            tabPanels.forEach(panel => {
                panel.id === tabId ? panel.classList.add('active') : panel.classList.remove('active');
            });
        });
    });
}