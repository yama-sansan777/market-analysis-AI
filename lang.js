// Language switching functionality
let currentLang = localStorage.getItem('language') || 'ja';

// Translation data
const translations = {
    ja: {
        // Navigation
        nav_today: 'AI市況予報',
        nav_pickup: 'クレイマー保有銘柄',
        nav_archive: '分析アーカイブ',
        nav_ipo: 'IPOスケジュール',
        nav_indicators: 'テクニカル指標解説',
        nav_terms: '市場用語集',
        nav_about: 'サイトについて',
        
        // Pickup page
        pickup_title: 'クレイマー保有銘柄',
        pickup_subtitle: 'AIによる分析と市場トレンドに基づき、今注目すべき米国株をピックアップ',
        
        // Buttons
        login: 'ログイン',
        register: '無料登録',
        view_details: '詳細を見る',
        
        // Archive page
        archive_title: '分析アーカイブ',
        archive_subtitle: '過去の市場分析レポートを閲覧できます。日付やキーワードで検索して、必要な情報を素早く見つけましょう。',
        keyword_placeholder: 'キーワードで検索',
        select_period: '期間を選択',
        select_evaluation: '評価を選択',
        period: '期間',
        period_all: '全期間',
        period_1w: '1週間',
        period_1m: '1ヶ月',
        period_3m: '3ヶ月',
        evaluation_stats: '評価別統計',
        no_reports: '表示するレポートがありません。',
        
        // Date picker
        day_sun: '日',
        day_mon: '月',
        day_tue: '火',
        day_wed: '水',
        day_thu: '木',
        day_fri: '金',
        day_sat: '土',
        today: '今日',
        cancel: 'キャンセル',
        apply: '適用',
        
        // Select options
        select_evaluation: '評価を選択',
        
        // Evaluations
        eval_buy: '買い',
        eval_sell: '売り',
        eval_neutral: '中立',
        cases: '件',
        
        // Footer
        footer_copyright: '© 2025 Market Insight Japan. All rights reserved.',
        footer_disclaimer_short: '当サイトの情報は投資判断の参考として提供されるものであり、投資勧誘を目的としたものではありません。投資の最終判断はご自身でお願いします。',
        footer_content_title: 'コンテンツ',
        footer_site_info_title: 'サイト情報',
        footer_about_link: 'サイトについて',
        footer_analysis_method_link: '分析手法',
        footer_terms_link: '利用規約',
        footer_privacy_link: 'プライバシーポリシー',
        footer_contact_title: 'お問い合わせ',
        footer_contact_desc: 'ご質問やフィードバックがございましたら、お気軽にお問い合わせください。',
        footer_contact_button: 'お問い合わせ',
        
        // About page
        about_title: 'サイトについて',
        about_subtitle: 'YOHOU US Stock AIの概要、サービスの特徴、分析手法などの詳細情報をご紹介します。',
        
        // Service Overview section
        service_overview_title: 'サービス概要',
        service_overview_description: 'YOHOU US Stock AIは、最新の人工知能技術を活用して、S&P 500をはじめとする米国株式市場の動向を分析・予測する革新的なAIプラットフォームです。市場データをリアルタイムで処理し、高度な機械学習アルゴリズムによって、精度の高い市場分析と予測を提供します。',
        service_features_title: '主な特徴',
        service_feature_1: 'S&P 500、NASDAQ、ダウ平均など米国主要指数の詳細分析',
        service_feature_2: '市場の健全性、心理指標のリアルタイム評価',
        service_feature_3: 'セクター別の詳細な動向と相関分析',
        service_feature_4: '注目銘柄のピックアップと背景解説',
        target_users_title: '対象ユーザー',
        target_users_description: '当サービスは以下のような方々に最適です：',
        target_user_1: '米国株の短期トレーダー',
        target_user_2: '機関投資家のトレーディングデスク',
        target_user_3: '市場動向を詳細に把握したい個人投資家',
        
        // Analysis Method section
        analysis_method_title: '分析手法',
        analysis_method_description: 'YOHOU US Stock AIでは、複数の分析手法を組み合わせることで、市場の多角的な理解を提供しています。定量的なデータ分析と定性的な市場解釈を融合させ、バランスの取れた市場見通しを提供します。',
        data_collection_title: 'データ収集方法',
        data_collection_description: '当サービスでは、以下のデータソースを活用しています：',
        data_source_1: 'NYSE・NASDAQのリアルタイム取引データ',
        data_source_2: '各種経済指標と企業業績データ',
        data_source_3: 'グローバル市場の相関データ',
        key_indicators_title: '主要分析指標',
        indicator_market_health_title: '市場の健全性',
        indicator_market_health_desc: '騰落銘柄比率、出来高分析、セクター間の資金フロー',
        indicator_market_sentiment_title: '市場心理',
        indicator_market_sentiment_desc: '恐怖・強欲指数、ボラティリティ分析、投資家センチメント',
        indicator_technical_title: 'テクニカル分析',
        indicator_technical_desc: '移動平均、RSI、MACD、ボリンジャーバンド、一目均衡表',
        indicator_internal_title: '内部構造分析',
        indicator_internal_desc: '指数間乖離、時価総額別パフォーマンス、セクター寄与度',
        update_frequency_title: '更新頻度',
        update_frequency_description: '市場分析は毎営業日の前場終了後（11:30頃）と大引け後（15:30頃）の2回更新されます。重要な市場イベント発生時には臨時レポートも配信します。',
        
        // AI Technology section
        ai_technology_title: 'AI技術について',
        ai_technology_description: 'YOHOU US Stock AIは、最先端の人工知能技術を活用して、市場分析と予測を行っています。複数のAIモデルを組み合わせることで、より正確で信頼性の高い分析を実現しています。',
        deep_learning_title: 'ディープラーニングモデル',
        deep_learning_desc: '大量の市場データを学習し、複雑なパターンを認識して、市場動向を予測します。時系列分析と非線形パターンの検出に特化しています。',
        nlp_title: '自然言語処理（NLP）',
        nlp_desc: 'ニュース記事や市場レポートをリアルタイムで分析し、市場センチメントを評価します。テキストデータから重要な市場動向を抽出します。',
        ai_features_title: 'AIの特徴',
        ai_feature_1: '24時間365日の継続的な市場監視と分析',
        ai_feature_2: '数百万件のデータポイントをリアルタイムで処理',
        ai_feature_3: '市場の微細な変化を検知し、即時に分析に反映',
        ai_feature_4: '継続的な学習による予測精度の向上',
        
        // Company Information section
        company_info_title: '会社情報',
        company_info_description: 'YOHOU US Stock AIは、株式会社BizRom東京が運営する AI 駆動型の市場分析プラットフォームです。当社は金融AIの研究開発と AI を活用した市場分析に特化した企業です。',
        company_name: '会社名',
        company_name_value: '株式会社BizRom東京',
        company_established: '設立',
        company_established_value: '令和2年9月',
        company_business_title: '事業内容',
        company_business_1: '・金融市場分析サービスの提供',
        company_business_2: '・投資情報配信サービス',
        company_business_3: '・金融データ分析ツールの開発',
        company_business_4: '・市場分析セミナーの開催',
        company_bank_title: '取引金融機関',
        company_bank_value: 'みずほ銀行',
        
        // Terms and Conditions section
        terms_conditions_title: '利用条件',
        terms_of_use_title: '利用規約',
        terms_point_1: 'YOHOU US Stock AIが提供する情報は、投資判断の参考として提供されるものであり、投資勧誘を目的としたものではありません。',
        terms_point_2: '投資の最終判断はご自身の責任において行ってください。当社は情報の利用によって生じたいかなる損害についても責任を負いません。',
        terms_point_3: '当サービスのコンテンツの無断転載、複製、再配布は禁止されています。',
        terms_point_4: 'サービス内容は予告なく変更される場合があります。',
        terms_full_link: '利用規約の全文を読む',
        privacy_policy_title: 'プライバシーポリシー',
        privacy_point_1: '当社は、ユーザーのプライバシー保護を最優先事項と考えています。',
        privacy_point_2: '収集した個人情報は、サービス提供、品質向上、および法的義務の履行のためにのみ使用されます。',
        privacy_point_3: '当社は、ユーザーの同意なしに第三者に個人情報を提供することはありません。',
        privacy_point_4: '当サイトでは、サービス向上のためにCookieを使用しています。',
        privacy_full_link: 'プライバシーポリシーの全文を読む',
        disclaimer_title: '免責事項',
        disclaimer_point_1: '当サービスで提供される情報の正確性には万全を期していますが、その完全性、正確性、適時性、有用性等を保証するものではありません。',
        disclaimer_point_2: '市場分析は過去のデータや現在の市場状況に基づいており、将来の市場動向を保証するものではありません。',
        disclaimer_point_3: '当サービスの利用により直接的または間接的に生じたいかなる損害についても、当社は責任を負いません。',
        disclaimer_full_link: '免責事項の全文を読む',
        
        // Site Navigation section
        site_navigation_title: 'サイトナビゲーション',
        nav_today_analysis_title: 'AI市況予報',
        nav_today_analysis_desc: '最新の市場分析レポート',
        nav_archive_title: '分析アーカイブ',
        nav_archive_desc: '過去の市場分析レポート',
        nav_indicators_title: 'テクニカル指標解説',
        nav_indicators_desc: '各種指標の詳細解説',
        
        // Contact section
        contact_title: 'さらに詳しい情報が必要ですか？',
        contact_description: 'YOHOU US Stock AIに関するご質問やご不明点がございましたら、お気軽にお問い合わせください。専門スタッフが丁寧にお答えします。',
        contact_form: 'お問い合わせフォーム',
        trial_button: '無料トライアルに申し込む',
        
        // Main page
        main_title: 'S&P 500 インタラクティブ市場分析',
        main_subtitle: '短期トレーダーのためのデータ駆動型インサイト',
        summary_title: '総合評価',
        
        // Dashboard sections
        market_health_title: '市場の健全性 (前日終値)',
        market_sentiment_title: '市場心理 (CNN Fear & Greed)',
        price_levels_title: '主要な価格帯',
        resistance_level: '上値抵抗線 (レジスタンス)',
        support_level: '下値支持線 (サポート)',
        put_call_ratio_title: 'エクイティ Put Call Ratio',
        daily_ratio: '当日レシオ',
        moving_average_21: '21日移動平均',
        
        // Analysis tabs
        detailed_analysis_title: '詳細分析',
        tab_instructions: '下のタブをクリックして、分析内容を切り替えられます',
        tab_internals: '市場の内部構造',
        tab_technicals: 'テクニカル分析',
        tab_fundamentals: 'ファンダメンタルズ & 心理',
        tab_strategy: '投資戦略',
        
        // Strategy section
        basic_strategy: '基本戦略',
        risk_management: 'リスク管理',
        
        // Sidebar
        market_overview_title: '市場概況',
        hot_stocks_title: '注目銘柄 (Top Movers)',
        
        // Sentiment indicators
        vix_title: 'VIX (恐怖指数)',
        aaii_title: 'AAII 個人投資家センチメント',
        bullish: '強気',
        neutral: '中立',
        bearish: '弱気',
        ii_title: 'Investors Intelligence ブルベア指数',
        bulls: '強気 (Bulls)',
        bears: '弱気 (Bears)',
        
        // Chart labels
        chart_market_health: '市場の健全性',
        chart_decliners: '値下がり',
        chart_advancers: '値上がり',
        
        // Market Analysis specific terms
        hold_evaluation: 'ホールド',
        market_cracks: '記録更新の裏に潜む亀裂',
        health_deterioration: '市場の健全性低下',
        sentiment_divergence: 'センチメントの乖離',
        warning_signals: '警戒シグナル',
        negative_divergence: 'ネガティブ・ダイバージェンス',
        uptrend_fragility: '上昇トレンドの脆弱性',
        complacency_shift: '自己満足からの転換シグナル',
        professional_optimism: 'プロの楽観',
        retail_caution: '個人の警戒',
        options_fear: 'オプション市場の恐怖',
        triple_divergence: 'センチメントの三重乖離',
        market_fragility: '市場の脆弱性',
        breadth_divergence: '価格と市場の内部（ブレッド）の深刻なダイバージェンス',
        calm_before_storm: '嵐の前の静けさ',
        event_risk: 'イベントリスク',
        capital_preservation: 'キャピタル・プリザベーション',
        selective_action: '選択的行動',
        emerging_caution: '警戒感の萌芽',
        greed_territory: '強欲（Greed）の領域',
        psychological_milestone: '心理的な節目',
        pullback_support: 'プルバック・サポート水準',
        fibonacci_retracement: 'フィボナッチ・リトレースメント',
        defensive_line: '短期的な防衛ライン',
        put_hedging: '下落ヘッジ（プット買い）',
        rising_caution: '警戒感の高まり',
        narrow_leadership: '狭いリーダーシップ',
        mega_cap_tech: '巨大ハイテク株',
        advance_decline_line: 'アドバンス・デクライン・ライン',
        extreme_complacency: '極端な自己満足',
        high_impact_events: '高インパクトなイベントリスク',
        asymmetric_risk: '非対称なリスク構造',
        volatility_explosion: 'ボラティリティが爆発的に増大',
        
        // Footer
        footer_disclaimer: 'この分析は提供された情報に基づく予測であり、投資成果を保証するものではありません。',
        footer_copyright_text: 'Copyright © 2025 Market Insight. All Rights Reserved.',
        
        // Terms page
        terms_title: '市場用語集',
        terms_subtitle: '株式市場で使用される専門用語を解説します。基本用語からチャート用語、指標用語、取引用語まで、投資家のレベルに合わせた情報を提供します。',
        search_placeholder: '用語を検索',
        terms_imp_high: '重要度高',
        terms_imp_medium: '重要度中',
        terms_imp_low: '重要度低',
        terms_cat_all: 'すべて',
        terms_cat_basic: '基本用語',
        terms_cat_chart: 'チャート用語',
        terms_cat_indicator: '指標用語',
        terms_cat_trading: '取引用語',
        terms_sidebar_kana_index: '五十音順',
        terms_sidebar_kana_en: '英数',
        terms_sidebar_categories: 'カテゴリー',
        terms_sidebar_cat_all: 'すべての用語',
        terms_sidebar_frequent_terms: 'よく検索される用語',
        terms_ipo_short_desc: '新規株式公開',
        terms_per_short_desc: '株価収益率',
        terms_pbr_short_desc: '株価純資産倍率',
        terms_volume_title: '出来高',
        terms_volume_short_desc: '取引量の指標',
        terms_section_en: '英数',
        terms_section_a: 'あ行',
        terms_section_ka: 'か行',
        terms_section_sa: 'さ行',
        terms_section_ta: 'た行',
        terms_section_na: 'な行',
        terms_section_ha: 'は行',
        terms_section_ma: 'ま行',
        terms_section_ya: 'や行',
        terms_section_ra: 'ら行',
        terms_section_wa: 'わ行',
        terms_reusable_main_points: '主なポイント',
        terms_reusable_calculation: '計算方法',
        terms_reusable_example: '使用例',
        terms_reusable_related: '関連用語',
        term_ipo_title: 'IPO（新規株式公開）',
        term_ipo_desc: 'IPO（Initial Public Offering）とは、未上場企業が新たに株式を証券取引所に上場し、公開することです。企業は資金調達を行い、投資家は新たな投資機会を得ることができます。',
        term_ipo_point1: '企業が資金調達を行う重要な手段',
        term_ipo_point2: '株式の公開価格は主幹事証券会社によって決定される',
        term_ipo_point3: '抽選方式で一般投資家に割り当てられることが多い',
        term_ipo_point4: '上場初日は価格変動が大きくなる傾向がある',
        term_ipo_example: '「テクノロジー企業Aは来月IPOを予定しており、初値は公開価格を大きく上回ると予想されている」',
        term_ipo_related1: 'ブックビルディング',
        term_ipo_related2: '上場',
        term_ipo_related3: '時価総額',
        term_per_title: 'PER（株価収益率）',
        term_per_desc: 'PER（Price Earnings Ratio）は、株価を1株当たりの純利益（EPS）で割った値で、株価が収益の何倍かを示す指標です。企業の株価が割高か割安かを判断する際に使用されます。',
        term_per_formula: 'PER = 株価 ÷ 1株当たり純利益（EPS）',
        term_per_formula_example: '例：株価が3,000円、EPSが150円の場合、PERは20倍',
        term_per_example: '「この企業のPERは30倍と業界平均の20倍を大きく上回っており、株価が割高な可能性がある」',
        term_per_related1: 'PBR',
        term_per_related2: 'EPS',
        term_per_related3: 'ROE',
        term_pbr_title: 'PBR（株価純資産倍率）',
        term_pbr_desc: 'PBR（Price Book-value Ratio）は、株価を1株当たりの純資産（BPS）で割った値で、株価が純資産の何倍かを示す指標です。企業の資産価値に対する株価の割高・割安を判断する際に使用されます。',
        term_pbr_formula: 'PBR = 株価 ÷ 1株当たり純資産（BPS）',
        term_pbr_formula_example: '例：株価が3,000円、BPSが2,000円の場合、PBRは1.5倍',
        term_pbr_example: '「この企業のPBRは0.8倍と1倍を下回っており、純資産に対して株価が割安な状態にある」',
        term_pbr_related1: 'PER',
        term_pbr_related2: 'BPS',
        term_pbr_related3: '純資産',
        term_roe_title: 'ROE（自己資本利益率）',
        term_roe_desc: 'ROE（Return On Equity）は、企業の自己資本（株主資本）に対する当期純利益の割合を示す指標です。企業が株主から預かった資本をどれだけ効率的に利益に変換しているかを測定します。',
        term_roe_formula: 'ROE = 当期純利益 ÷ 自己資本 × 100（%）',
        term_roe_formula_example: '例：当期純利益が100億円、自己資本が1,000億円の場合、ROEは10%',
        term_roe_example: '「この企業のROEは15%と高く、株主資本を効率的に活用して利益を生み出している」',
        term_roe_related1: 'ROA',
        term_roe_related2: 'EPS',
        term_roe_related3: '自己資本',
        term_low_price_title: '安値（やすね）',
        term_low_price_desc: '安値とは、一定期間内における株価の最も低い価格のことを指します。日中安値、年初来安値、史上最安値など、参照する期間によって異なります。',
        term_low_price_point1: 'テクニカル分析において重要なサポートレベルとなることが多い',
        term_low_price_point2: '連続して安値を更新する場合は下降トレンドの強さを示す',
        term_low_price_point3: '前回の安値を割り込まずに反発する場合は、底打ちのサインとなることがある',
        term_low_price_point4: '年初来安値や史上最安値の更新は、投資家心理に大きな影響を与える',
        term_low_price_example: '「S&P 500は一時4,200ポイントの年初来安値を記録したが、その後は反発して上昇トレンドに転じた」',
        term_low_price_related1: '高値',
        term_low_price_related2: 'サポートライン',
        term_low_price_related3: '底値',
        term_uptrend_title: 'アップトレンド',
        term_uptrend_desc: 'アップトレンドとは、株価が全体的に上昇傾向にある状態を指します。高値と安値がともに切り上がっていく（前回の高値より高い高値、前回の安値より高い安値をつける）パターンが特徴です。',
        term_uptrend_point1: '高値と安値が切り上がりながら推移する',
        term_uptrend_point2: '移動平均線が上昇傾向を示し、株価が移動平均線の上に位置することが多い',
        term_uptrend_point3: '調整（一時的な下落）後も、前回の安値を割り込まずに上昇を再開する',
        term_uptrend_point4: '出来高は上昇局面で増加し、調整局面で減少する傾向がある',
        term_uptrend_example: '「この銘柄は3ヶ月間アップトレンドが続いており、押し目買いの好機を狙っている投資家が多い」',
        term_uptrend_related1: 'ダウントレンド',
        term_uptrend_related2: 'レンジ相場',
        term_uptrend_related3: 'トレンドライン',
        term_stock_index_title: '株価指数（かぶかしすう）',
        term_stock_index_desc: '株価指数とは、特定の市場や業種の株価全体の動向を表す指標です。複数の銘柄の株価を一定のルールで集計し、単一の数値として表します。市場全体の動きを把握するために使用されます。',
        term_stock_index_point1: 'S&P 500：米国の代表的な500銘柄の時価総額加重平均指数',
        term_stock_index_point2: 'NASDAQ Composite：NASDAQ取引所上場の全銘柄の時価総額加重平均指数',
        term_stock_index_point3: 'Russell 2000：米国の小型株2,000銘柄で構成される時価総額加重平均指数',
        term_stock_index_point4: 'Dow Jones Industrial Average：米国の代表的な30銘柄の株価平均',
        term_stock_index_example: '「本日のS&P 500は前日比0.8%高の4,850ポイントで取引を終えた」',
        term_stock_index_related1: 'S&P 500',
        term_stock_index_related2: 'NASDAQ',
        term_stock_index_related3: '指数化',
        term_shareholder_benefit_title: '株主優待（かぶぬしゆうたい）',
        term_shareholder_benefit_desc: '株主優待とは、企業が自社株主に対して提供する特典のことです。自社製品、商品券、割引券などが一般的で、配当とは別に株主に還元する仕組みです。',
        term_shareholder_benefit_point1: '権利確定日に株主名簿に記載されている株主に付与される',
        term_shareholder_benefit_point2: '保有株数に応じて優待内容が異なることが多い',
        term_shareholder_benefit_point3: '年1回または年2回実施する企業が多い',
        term_shareholder_benefit_point4: '長期保有株主向けの特別優待を設ける企業も増えている',
        term_shareholder_benefit_example: '「この飲食チェーンは100株以上保有する株主に対して、年2回5,000円相当の食事券を株主優待として提供している」',
        term_shareholder_benefit_related1: '配当',
        term_shareholder_benefit_related2: '権利確定日',
        term_shareholder_benefit_related3: '株主還元',
        term_stock_split_title: '株式分割（かぶしきぶんかつ）',
        term_stock_split_desc: '株式分割とは、企業が発行済み株式を分割して株式数を増やす手法です。株主が保有する株式数は増えますが、株価は分割比率に応じて下がるため、理論上は資産価値は変わりません。',
        term_stock_split_point1: '1株を2株、1株を3株など、様々な分割比率がある',
        term_stock_split_point2: '株価が高騰した銘柄の投資しやすさを向上させる目的で実施されることが多い',
        term_stock_split_point3: '株式の流動性向上につながる',
        term_stock_split_point4: '分割による株価の調整後、心理的に割安感が生まれ株価が上昇することもある',
        term_stock_split_example: '「テクノロジー企業Bは来月1:4の株式分割を実施し、現在の株価40,000円を10,000円程度に調整する予定だ」',
        term_stock_split_related1: '株式併合',
        term_stock_split_related2: '権利落ち',
        term_stock_split_related3: 'EPS',
        term_support_line_title: 'サポートライン',
        term_support_line_desc: 'サポートラインとは、チャート上で株価が下落した際に反発しやすい価格帯を結んだラインのことです。過去に何度か株価が反発した価格水準に引かれ、下値支持線とも呼ばれます。',
        term_support_line_point1: '過去の安値を結ぶことで形成される',
        term_support_line_point2: '株価がサポートラインに接近すると買い注文が入りやすい',
        term_support_line_point3: 'サポートラインを下抜けると、さらなる下落の可能性が高まる',
        term_support_line_point4: '下抜けた後に再び上抜けると、レジスタンスラインに転換することがある',
        term_support_line_example: '「S&P 500は4,600ポイント付近に強いサポートラインがあり、3度この水準で反発している」',
        term_support_line_related1: 'レジスタンスライン',
        term_support_line_related2: 'トレンドライン',
        term_support_line_related3: 'ブレイクアウト',
        term_limit_order_title: '指値注文（さしねちゅうもん）',
        term_limit_order_desc: '指値注文とは、株式の売買において、取引を行う価格を指定する注文方法です。買いの場合は指定価格以下、売りの場合は指定価格以上でないと約定しません。',
        term_limit_order_point1: '希望する価格で取引できるというメリットがある',
        term_limit_order_point2: '指定した価格に到達しない場合は約定しないリスクがある',
        term_limit_order_point3: '価格変動が激しい相場では約定しにくくなることがある',
        term_limit_order_point4: '寄り付き（取引開始時）や引け（取引終了時）に特殊な指値注文方法がある',
        term_limit_order_example: '「現在の株価は1,500円だが、1,450円で指値買い注文を出しておき、一時的な下落時に自動的に買えるようにした」',
        term_limit_order_related1: '成行注文',
        term_limit_order_related2: '逆指値注文',
        term_limit_order_related3: 'IOC注文',
        term_high_price_title: '高値（たかね）',
        term_high_price_desc: '高値とは、一定期間内における株価の最も高い価格のことを指します。日中高値、年初来高値、史上最高値など、参照する期間によって異なります。',
        term_high_price_point1: 'テクニカル分析において重要なレジスタンスレベルとなることが多い',
        term_high_price_point2: '連続して高値を更新する場合は上昇トレンドの強さを示す',
        term_high_price_point3: '前回の高値を超えられずに反落する場合は、天井のサインとなることがある',
        term_high_price_point4: '年初来高値や史上最高値の更新は、投資家心理に大きな影響を与える',
        term_high_price_example: '「S&P 500は一時5,100ポイントの年初来高値を記録したが、その後は利益確定売りで反落した」',
        term_high_price_related1: '安値',
        term_high_price_related2: 'レジスタンスライン',
        term_high_price_related3: '天井',
        term_downtrend_title: 'ダウントレンド',
        term_downtrend_desc: 'ダウントレンドとは、株価が全体的に下落傾向にある状態を指します。高値と安値がともに切り下がっていく（前回の高値より低い高値、前回の安値より低い安値をつける）パターンが特徴です。',
        term_downtrend_point1: '高値と安値が切り下がりながら推移する',
        term_downtrend_point2: '移動平均線が下降傾向を示し、株価が移動平均線の下に位置することが多い',
        term_downtrend_point3: '反発（一時的な上昇）後も、前回の高値を超えずに下落を再開する',
        term_downtrend_point4: '出来高は下落局面で増加し、反発局面で減少する傾向がある',
        term_downtrend_example: '「この銘柄は2ヶ月間ダウントレンドが続いており、反発を売る戦略が有効となっている」',
        term_downtrend_related1: 'アップトレンド',
        term_downtrend_related2: 'レンジ相場',
        term_downtrend_related3: 'トレンドライン',
        term_nikkei_title: 'S&P 500（エス・アンド・ピー・ファイブハンドレッド）',
        term_nikkei_desc: 'S&P 500は、米国の代表的な500銘柄で構成される時価総額加重平均株価指数です。米国株式市場全体の動向を示す代表的な指標として世界中で広く利用されています。',
        term_nikkei_point1: '株価平均型の指数で、株価の高い銘柄ほど影響力が大きい',
        term_nikkei_point2: '日本経済新聞社が算出・公表している',
        term_nikkei_point3: '構成銘柄は定期的に見直される',
        term_nikkei_point4: '先物やオプション取引の対象となっている',
        term_nikkei_example: '「好調な企業決算を受けて、S&P 500は4,900ポイント台を回復した」',
        term_nikkei_related1: 'NASDAQ',
        term_nikkei_related2: 'ダウ平均',
        term_nikkei_related3: 'S&P 500先物',
        term_dividend_title: '配当（はいとう）',
        term_dividend_desc: '配当とは、企業が利益の一部を株主に現金で還元する仕組みです。株主に対する重要な利益還元方法の一つで、通常は年1回（期末配当）または年2回（中間配当と期末配当）実施されます。',
        term_dividend_point1: '配当金額は1株あたりの金額で表示される',
        term_dividend_point2: '配当利回り = 年間配当金 ÷ 株価 × 100（%）で計算される',
        term_dividend_point3: '権利確定日に株主名簿に記載されている株主に支払われる',
        term_dividend_point4: '配当性向 = 配当金総額 ÷ 当期純利益 × 100（%）で、利益に対する配当の割合を示す',
        term_dividend_example: '「この企業は1株あたり年間60円の配当を実施しており、現在の株価3,000円に対して配当利回りは2%となる」',
        term_dividend_related1: '配当利回り',
        term_dividend_related2: '権利確定日',
        term_dividend_related3: '株主還元',
        term_gap_title: '窓（まど）/ ギャップ',
        term_gap_desc: '窓（ギャップ）とは、前日の終値と当日の始値の間に価格の空白部分ができる現象です。上昇ギャップ（前日終値より高い始値）と下落ギャップ（前日終値より低い始値）があります。',
        term_gap_point1: '重要な経済指標の発表や企業の決算発表後などに発生しやすい',
        term_gap_point2: '「窓は埋まる」という格言があり、後日その価格帯まで戻ることが多い',
        term_gap_point3: '上昇トレンド中の上昇ギャップは強気サイン、下降トレンド中の下落ギャップは弱気サイン',
        term_gap_point4: '大きなギャップが発生した場合、トレンド転換のサインとなることがある',
        term_gap_example: '「好決算を受けて、この銘柄は前日終値の1,500円から当日始値1,580円と大きな上昇ギャップで取引を開始した」',
        term_gap_related1: '窓埋め',
        term_gap_related2: '寄り付き',
        term_gap_related3: '前日比',
        term_ohlc_title: '四本値（よんほんち）',
        term_ohlc_desc: '四本値とは、一定期間（通常は1日）の株価を表す4つの値段のことで、始値、高値、安値、終値を指します。ローソク足チャートの基本となる価格情報です。',
        term_ohlc_point1: '始値：取引開始時の最初の約定価格',
        term_ohlc_point2: '高値：期間内の最も高い取引価格',
        term_ohlc_point3: '安値：期間内の最も低い取引価格',
        term_ohlc_point4: '終値：取引終了時の最後の約定価格（翌日の基準価格となる）',
        term_ohlc_example: '「本日のトヨタ自動車の四本値は、始値2,100円、高値2,150円、安値2,080円、終値2,120円だった」',
        term_ohlc_related1: 'ローソク足',
        term_ohlc_related2: '寄り付き',
        term_ohlc_related3: '引け',
        term_candlestick_title: 'ローソク足',
        term_candlestick_desc: 'ローソク足とは、株価の動きを視覚的に表現するチャート手法で、日本発祥のテクニカル分析ツールです。始値、高値、安値、終値の四本値を一つの図形で表現します。',
        term_candlestick_point1: '実体（ボディ）：始値と終値を結んだ長方形部分',
        term_candlestick_point2: 'ヒゲ（シャドウ）：高値・安値から実体までの線',
        term_candlestick_point3: '陽線（白/緑/青）：終値が始値より高い場合（上昇）',
        term_candlestick_point4: '陰線（黒/赤）：終値が始値より低い場合（下落）',
        term_candlestick_point5: '様々なパターン（はらみ線、包み線、十字線など）が相場の転換点を示す',
        term_candlestick_example: '「日足チャートで3本連続の大陽線が現れ、強い買い圧力が続いていることを示している」',
        term_candlestick_related1: '四本値',
        term_candlestick_related2: '陽線',
        term_candlestick_related3: '陰線',
        term_resistance_line_title: 'レジスタンスライン',
        term_resistance_line_desc: 'レジスタンスラインとは、チャート上で株価が上昇した際に反落しやすい価格帯を結んだラインのことです。過去に何度か株価が反落した価格水準に引かれ、上値抵抗線とも呼ばれます。',
        term_resistance_line_point1: '過去の高値を結ぶことで形成される',
        term_resistance_line_point2: '株価がレジスタンスラインに接近すると売り注文が入りやすい',
        term_resistance_line_point3: 'レジスタンスラインを上抜けると、さらなる上昇の可能性が高まる',
        term_resistance_line_point4: '上抜けた後に再び下抜けると、サポートラインに転換することがある',
        term_resistance_line_example: '「S&P 500は5,000ポイント付近に強いレジスタンスラインがあり、2度この水準で反落している」',
        term_resistance_line_related1: 'サポートライン',
        term_resistance_line_related2: 'トレンドライン',
        term_resistance_line_related3: 'ブレイクアウト',
        term_value_stock_title: '割安株（わりやすかぶ）',
        term_value_stock_desc: '割安株とは、企業の本来の価値（理論価値や適正価値）に比べて株価が割安に評価されていると考えられる株式のことです。バリュー投資の対象となります。',
        term_value_stock_point1: 'PER（株価収益率）が業界平均や市場平均より低い',
        term_value_stock_point2: 'PBR（株価純資産倍率）が1倍を下回る、または業界平均より低い',
        term_value_stock_point3: '配当利回りが市場平均より高い',
        term_value_stock_point4: '企業の成長性や収益性に対して株価が割安に放置されている状態',
        term_value_stock_example: '「この銀行株はPBR0.6倍、配当利回り4%と典型的な割安株の特徴を示している」',
        term_value_stock_related1: '割高株',
        term_value_stock_related2: 'バリュー投資',
        term_value_stock_related3: 'PER',

        // Indicators page
        indicators_title: 'テクニカル指標解説',
        indicators_subtitle: '株式市場の分析に役立つ主要なテクニカル指標について詳しく解説します。各指標の基本的な概念から実践的な活用方法まで、トレーダーのレベルに合わせた情報を提供します。',
        indicator_search_placeholder: '指標名で検索',
        
        // Difficulty levels
        difficulty_beginner: '初級',
        difficulty_intermediate: '中級', 
        difficulty_advanced: '上級',
        
        // Navigation sections
        table_of_contents: '目次',
        popular_indicators: '人気の指標',
        
        // Indicator categories
        trend_indicators: 'トレンド系指標',
        momentum_indicators: 'モメンタム系指標',
        volatility_indicators: 'ボラティリティ系指標',
        volume_indicators: '出来高系指標',
        oscillator_indicators: 'オシレーター系指標',
        combination_strategies: '複合戦略',
        
        // Common terms
        practical_trading_strategies: '実践的なトレード戦略',
        rsi_description: '相対力指数',
        calculation_method: '計算方法',
        chart_example: 'チャート例',
        usage_method: '使い方',
        
        // Moving Average descriptions
        ma_title: '移動平均線（Moving Average）',
        ma_description: '移動平均線は、一定期間の価格の平均値を結んだ線で、相場のトレンドを把握するための最も基本的な指標です。短期、中期、長期の移動平均線を組み合わせることで、トレンドの変化や強さを判断できます。',
        ma_sma_desc: '単純移動平均（SMA）：指定した期間の終値の合計を期間数で割った値',
        ma_ema_desc: '指数平滑移動平均（EMA）：直近の価格に重みを付けた移動平均',
        ma_ema_formula: 'EMA = 価格 × K + 前日のEMA × (1 - K)<br>K = 2 ÷ (期間数 + 1)',
        ma_chart_desc: 'S&P 500株価と20日/50日/200日移動平均線',
        ma_usage_1: '短期移動平均線が長期移動平均線を上抜けると買いシグナル（ゴールデンクロス）',
        ma_usage_2: '短期移動平均線が長期移動平均線を下抜けると売りシグナル（デッドクロス）',
        ma_usage_3: '価格が移動平均線を上回っていれば上昇トレンド、下回っていれば下降トレンド',
        ma_usage_4: '複数の移動平均線が並行して上昇/下降している場合、トレンドが強いことを示す',
        ma_strategy_desc: '移動平均線の組み合わせによる戦略例：',
        ma_strategy_1: '5日と20日の移動平均線のクロスを短期売買のシグナルとして利用',
        ma_strategy_2: '50日移動平均線をサポート/レジスタンスラインとして活用',
        ma_strategy_3: '200日移動平均線を長期トレンドの判断基準として利用',
        ma_strategy_4: '価格が移動平均線に接触した際の反発を狙ったトレード',
        
        // MACD descriptions
        macd_title: 'MACD（Moving Average Convergence Divergence）',
        macd_description: 'MACDは、短期と長期の指数移動平均線（EMA）の差を利用したトレンド系の指標です。トレンドの方向性や強さ、転換点を捉えるのに役立ちます。',
        macd_line_desc: 'MACD線 = 短期EMA - 長期EMA（通常12日と26日）',
        macd_signal_desc: 'シグナル線 = MACDの9日EMA',
        macd_histogram_desc: 'ヒストグラム = MACD線 - シグナル線',
        macd_chart_desc: '上：S&P 500株価、下：MACD（青線：MACD線、赤線：シグナル線、ヒストグラム）',
        macd_usage_1: 'MACD線がシグナル線を上抜けると買いシグナル',
        macd_usage_2: 'MACD線がシグナル線を下抜けると売りシグナル',
        macd_usage_3: 'MACD線とシグナル線がゼロラインを上回っていれば上昇トレンド',
        macd_usage_4: 'MACD線とシグナル線がゼロラインを下回っていれば下降トレンド',
        macd_usage_5: 'ヒストグラムの拡大はトレンドの加速、縮小はトレンドの減速を示す',
        macd_strategy_desc: 'MACDを活用した戦略例：',
        macd_strategy_1: 'ゼロラインクロス：MACD線がゼロラインを上抜け/下抜けした際にエントリー',
        macd_strategy_2: 'ダイバージェンス：価格が高値更新しているのにMACDが高値を更新しない場合は売りシグナル',
        macd_strategy_3: 'ヒストグラムの変化：ヒストグラムが縮小し始めたらトレンド終了の可能性を警戒',
        macd_strategy_4: '複数時間軸分析：日足と週足のMACDを組み合わせて、より信頼性の高いシグナルを探る',
        
        // Popular indicators
        popular_ma: '移動平均線',
        popular_macd_desc: '移動平均収束拡散法',
        popular_bb: 'ボリンジャーバンド',
        popular_bb_desc: '価格変動の範囲を示す',
        popular_rsi_desc: '相対力指数',
        
        // RSI descriptions
        rsi_title: 'RSI（Relative Strength Index：相対力指数）',
        rsi_description: 'RSIは、一定期間における値上がり幅と値下がり幅の比率から算出される指標で、相場の過熱感や買われ過ぎ・売られ過ぎの状態を判断するのに役立ちます。0〜100の範囲で表示され、通常は14日間の期間で計算されます。',
        rsi_formula_1: 'RSI = 100 - (100 / (1 + RS))',
        rsi_formula_2: 'RS（相対力）= 一定期間の平均上昇幅 ÷ 一定期間の平均下落幅',
        rsi_chart_desc: '上：S&P 500株価、下：RSI（14日間）',
        rsi_usage_1: 'RSIが70以上で買われ過ぎ（売りシグナル）',
        rsi_usage_2: 'RSIが30以下で売られ過ぎ（買いシグナル）',
        rsi_usage_3: 'RSIが50を上回ると上昇トレンド、下回ると下降トレンド',
        rsi_usage_4: 'RSIのトレンドラインブレイクは価格の転換点を示唆することがある',
        rsi_usage_5: 'RSIと価格のダイバージェンス（乖離）は、トレンド転換のサインとなる',
        rsi_strategy_desc: 'RSIを活用した戦略例：',
        rsi_strategy_1: '強いトレンド相場では、RSIの基準値を調整（上昇トレンドでは40-80、下降トレンドでは20-60など）',
        rsi_strategy_2: 'RSIが30を下回った後、再び30を上抜けたタイミングで買いエントリー',
        rsi_strategy_3: 'RSIが70を上回った後、再び70を下抜けたタイミングで売りエントリー',
        rsi_strategy_4: 'RSIと価格のポジティブダイバージェンス（価格が安値更新しているのにRSIが安値を更新しない）は強力な買いシグナル',
        rsi_strategy_5: 'RSIと価格のネガティブダイバージェンス（価格が高値更新しているのにRSIが高値を更新しない）は強力な売りシグナル',
        
        // Stochastics descriptions
        stochastics_title: 'ストキャスティクス（Stochastics）',
        stochastics_description: 'ストキャスティクスは、一定期間の価格レンジにおける現在の終値の位置を百分率で表した指標です。相場の勢いや方向性、買われ過ぎ・売られ過ぎの状態を判断するのに役立ちます。',
        stochastics_formula_1: '%K = 100 × ((現在の終値 - 期間内の最安値) ÷ (期間内の最高値 - 期間内の最安値))',
        stochastics_formula_2: '%D = %Kの3日間の単純移動平均',
        stochastics_chart_desc: '上：S&P 500株価、下：ストキャスティクス（青線：%K、赤線：%D）',
        stochastics_usage_1: '%Kが%Dを上抜けると買いシグナル',
        stochastics_usage_2: '%Kが%Dを下抜けると売りシグナル',
        stochastics_usage_3: '80以上で買われ過ぎ、20以下で売られ過ぎと判断',
        stochastics_usage_4: '買われ過ぎ・売られ過ぎの領域からの反転が強いシグナルとなる',
        stochastics_usage_5: 'ストキャスティクスと価格のダイバージェンスはトレンド転換の可能性を示唆',
        stochastics_strategy_desc: 'ストキャスティクスを活用した戦略例：',
        stochastics_strategy_1: 'スローストキャスティクス（%Dをさらに3日間移動平均したもの）を用いたノイズ軽減',
        stochastics_strategy_2: 'トレンド相場では、ストキャスティクスが20-50の範囲で推移する上昇トレンド、50-80の範囲で推移する下降トレンドに注目',
        stochastics_strategy_3: '複数時間軸のストキャスティクスを組み合わせた分析（日足が買われ過ぎでも週足が上昇中なら上昇継続の可能性）',
        stochastics_strategy_4: 'ストキャスティクスとRSIの組み合わせによる確認（両方が買われ過ぎ/売られ過ぎを示した場合の反転狙い）',
        
        // Bollinger Bands descriptions
        bollinger_title: 'ボリンジャーバンド（Bollinger Bands）',
        bollinger_description: 'ボリンジャーバンドは、移動平均線を中心に、一定期間の標準偏差を上下にプロットした指標です。価格のボラティリティ（変動幅）を視覚化し、相場の過熱感や反転の可能性を判断するのに役立ちます。',
        bollinger_formula_1: '中央線 = n期間の単純移動平均（通常20日）',
        bollinger_formula_2: '上限バンド = 中央線 + (n期間の標準偏差 × k)（通常k=2）',
        bollinger_formula_3: '下限バンド = 中央線 - (n期間の標準偏差 × k)（通常k=2）',
        bollinger_chart_desc: 'S&P 500株価とボリンジャーバンド（20日、±2σ）',
        bollinger_usage_1: '価格が上限バンドに接触/突破すると買われ過ぎ、下限バンドに接触/突破すると売られ過ぎの可能性',
        bollinger_usage_2: 'バンド幅の拡大はボラティリティの増加、縮小はボラティリティの減少を示す',
        bollinger_usage_3: 'バンド幅が極端に縮小した後は、大きな値動きが発生する可能性が高い（スクイーズ）',
        bollinger_usage_4: '価格が中央線を上抜けると上昇トレンド、下抜けると下降トレンドの可能性',
        bollinger_usage_5: 'W底（ダブルボトム）やM天井（ダブルトップ）のパターンに注目',
        bollinger_strategy_title: 'ボリンジャーバンドを活用した戦略例：',
        bollinger_strategy_1: 'バンドウォーク：強いトレンド相場では、価格が上限/下限バンドに沿って推移する傾向がある',
        bollinger_strategy_2: 'バンドタッチ戦略：レンジ相場では、上限バンドタッチで売り、下限バンドタッチで買いを検討',
        bollinger_strategy_3: 'ボリンジャーバウンス：下限バンドを下抜けた後に再び上抜けたタイミングで買い',
        bollinger_strategy_4: 'スクイーズブレイクアウト：バンド幅が極端に縮小した後のブレイクアウト方向に追随',
        bollinger_strategy_5: '%b指標の活用：価格のバンド内での相対的位置を0〜1で表した指標を併用',

        // ATR section
        atr_title: 'ATR（Average True Range：平均真実範囲）',
        atr_description: 'ATRは、一定期間の価格変動幅（真の値幅）の平均値を示す指標です。相場のボラティリティを数値化し、リスク管理やポジションサイジングに役立ちます。',
        atr_calculation_title: '計算方法',
        atr_tr_desc: '真の値幅（TR）= 以下の3つの値のうち最大値',
        atr_tr_1: '当日の高値 - 当日の安値',
        atr_tr_2: '|当日の高値 - 前日の終値|',
        atr_tr_3: '|当日の安値 - 前日の終値|',
        atr_formula: 'ATR = n日間のTRの指数移動平均（通常14日）',
        atr_chart_desc: '上：S&P 500株価、下：ATR（14日間）',
        atr_usage_title: '使い方',
        atr_usage_1: 'ATRの上昇はボラティリティの増加、下降はボラティリティの減少を示す',
        atr_usage_2: 'ATRの急上昇は、相場の転換点や重要なイベントの発生を示唆することがある',
        atr_usage_3: 'ATRを利用して、損切りレベルやリスク許容度に応じたポジションサイズを決定',
        atr_usage_4: 'ATRの倍数を使用した利確・損切り設定（例：エントリー価格から2ATR分の価格変動で損切り）',
        atr_strategy_desc: 'ATRを活用した戦略例：',
        atr_strategy_1: 'チャンドラーのATRストップ：トレンドフォロー戦略で、トレイリングストップをATRの倍数で設定',
        atr_strategy_2: 'ボラティリティブレイクアウト：ATRの低下後の上昇をブレイクアウトのシグナルとして利用',
        atr_strategy_3: 'リスク調整型ポジションサイジング：許容リスク額 ÷ (ATR × 価格単位) でポジションサイズを決定',
        atr_strategy_4: 'ATRチャネル：現在の価格から上下にATRの倍数を加減したチャネルを形成し、サポート/レジスタンスとして活用',

        // Volume indicators section
        volume_indicators: '出来高系指標',

        // OBV section
        obv_title: 'OBV（On-Balance Volume：オンバランスボリューム）',
        obv_description: 'OBVは、価格の上昇日には出来高を加算し、下落日には出来高を減算する累積指標です。価格の動きに先行して出来高が変化することがあるため、トレンドの転換点を予測するのに役立ちます。',
        obv_calculation_title: '計算方法',
        obv_calc_up: '価格が上昇した場合：OBV = 前日のOBV + 当日の出来高',
        obv_calc_down: '価格が下落した場合：OBV = 前日のOBV - 当日の出来高',
        obv_calc_unchanged: '価格が変わらない場合：OBV = 前日のOBV',
        obv_chart_desc: '上：S&P 500株価、下：OBV',
        obv_usage_title: '使い方',
        obv_usage_1: 'OBVが上昇トレンドにあれば、価格の上昇トレンドが確認される',
        obv_usage_2: 'OBVが下降トレンドにあれば、価格の下降トレンドが確認される',
        obv_usage_3: 'OBVと価格のダイバージェンスはトレンド転換の可能性を示唆',
        obv_usage_4: 'OBVのトレンドラインブレイクは、価格の動きに先行することがある',
        obv_strategy_desc: 'OBVを活用した戦略例：',
        obv_strategy_1: 'OBVのトレンドライン分析：OBVのトレンドラインブレイクを価格の転換点として利用',
        obv_strategy_2: 'OBVの移動平均線との関係：OBVが自身の移動平均線を上抜け/下抜けした際にシグナルとして利用',
        obv_strategy_3: 'ポジティブダイバージェンス：価格が下落しているのにOBVが上昇している場合は買いシグナル',
        obv_strategy_4: 'ネガティブダイバージェンス：価格が上昇しているのにOBVが下落している場合は売りシグナル',

        // VWAP section
        vwap_title: 'VWAP（Volume Weighted Average Price：出来高加重平均価格）',
        vwap_description: 'VWAPは、各価格帯での取引量を考慮した加重平均価格を示す指標です。主に機関投資家が取引コストを評価するために使用しますが、個人投資家もサポート/レジスタンスレベルやトレンドの方向性を判断するのに活用できます。',
        vwap_calculation_title: '計算方法',
        vwap_formula: 'VWAP = Σ(価格 × 出来高) ÷ Σ(出来高)',
        vwap_note: '通常、1日の取引時間内で計算され、翌日にリセットされる',
        vwap_chart_desc: 'S&P 500株価とVWAP',
        vwap_usage_title: '使い方',
        vwap_usage_1: '価格がVWAPを上回っていれば買い圧力が強く、下回っていれば売り圧力が強いと判断',
        vwap_usage_2: 'VWAPはサポート/レジスタンスとして機能することが多い',
        vwap_usage_3: '価格がVWAPから大きく乖離した場合、平均回帰の可能性を考慮',
        vwap_usage_4: '機関投資家は通常、VWAPより有利な価格での取引を目指すため、VWAPを基準に売買判断を行うことがある',
        vwap_strategy_desc: 'VWAPを活用した戦略例：',
        vwap_strategy_1: 'VWAP反発戦略：価格がVWAPに接触して反発した際にトレンド方向へのエントリー',
        vwap_strategy_2: 'VWAPクロス戦略：価格がVWAPを上抜け/下抜けした際にブレイクアウト方向へのエントリー',
        vwap_strategy_3: 'VWAP乖離戦略：価格がVWAPから大きく乖離した際に、平均回帰を狙った逆張りエントリー',
        vwap_strategy_4: '複数時間枠VWAP：日中の短期VWAPと複数日のVWAPを組み合わせた分析',

        // Oscillator indicators section
        oscillator_indicators: 'オシレーター系指標',

        // CCI section
        cci_title: 'CCI（Commodity Channel Index：商品チャネル指数）',
        cci_description: 'CCIは、価格が平均価格からどれだけ乖離しているかを測定する指標です。相場の過熱感や買われ過ぎ・売られ過ぎの状態を判断するのに役立ちます。',
        cci_calculation_title: '計算方法',
        cci_formula_main: 'CCI = (TP - SMA of TP) / (0.015 × MD)',
        cci_formula_tp: 'TP（典型的価格）= (高値 + 安値 + 終値) / 3',
        cci_formula_sma: 'SMA of TP = TPのn期間単純移動平均（通常20日）',
        cci_formula_md: 'MD = TPとSMA of TPの絶対偏差の平均',
        cci_chart_desc: '上：S&P 500株価、下：CCI（20日間）',
        cci_usage_title: '使い方',
        cci_usage_1: 'CCIが+100を上回ると買われ過ぎ、-100を下回ると売られ過ぎと判断',
        cci_usage_2: 'CCIがゼロラインを上抜けると上昇トレンド、下抜けると下降トレンドの可能性',
        cci_usage_3: 'CCIの極端な値（+200以上/-200以下）は、強いトレンドや反転の可能性を示唆',
        cci_usage_4: 'CCIと価格のダイバージェンスはトレンド転換のサインとなる',
        cci_strategy_desc: 'CCIを活用した戦略例：',
        cci_strategy_1: 'CCIゼロラインクロス戦略：CCIがゼロラインを上抜け/下抜けした際にトレンド方向へのエントリー',
        cci_strategy_2: 'CCI反転戦略：CCIが+100/-100を超えた後に反転した際に、反転方向へのエントリー',
        cci_strategy_3: 'CCIダイバージェンス戦略：CCIと価格のダイバージェンスを検出し、トレンド転換を狙う',
        cci_strategy_4: 'CCIトレンド継続戦略：強いトレンド相場では、CCIが+100/-100を超えた状態が継続することを利用',

        // Combination Strategies section
        combination_strategies: '複合戦略',
        combination_title: '複数指標を組み合わせた効果的な分析手法',
        combination_description: '単一の指標だけでなく、複数の指標を組み合わせることで、より信頼性の高いシグナルを得ることができます。ここでは、効果的な指標の組み合わせと、その活用方法を紹介します。',
        
        // Trend confirmation and timing combinations
        trend_timing_title: 'トレンド確認と売買タイミングの組み合わせ',
        ma_rsi_title: '移動平均線 + RSI',
        ma_rsi_1: '移動平均線でトレンドの方向性を確認',
        ma_rsi_2: 'RSIで売買のタイミングを判断',
        ma_rsi_example: '例：上昇トレンド（価格が移動平均線の上）でRSIが30を下回った後に上昇に転じたタイミングで買い',
        
        macd_bollinger_title: 'MACD + ボリンジャーバンド',
        macd_bollinger_1: 'MACDでトレンドの方向性と強さを確認',
        macd_bollinger_2: 'ボリンジャーバンドで価格の変動範囲とブレイクアウトを判断',
        macd_bollinger_example: '例：MACD線がシグナル線を上抜け、かつ価格がボリンジャーバンドの上限を突破した場合は強い買いシグナル',
        
        // Multiple timeframe analysis
        timeframe_title: '複数時間枠分析',
        timeframe_description: '異なる時間枠のチャートを組み合わせることで、より包括的な相場観を得ることができます。',
        topdown_title: 'トップダウンアプローチ',
        topdown_1: '長期チャート（週足/日足）でトレンドの方向性を確認',
        topdown_2: '中期チャート（日足/4時間足）でトレンド内の調整や反発を確認',
        topdown_3: '短期チャート（1時間足/15分足）でエントリーポイントを特定',
        topdown_example: '例：週足で上昇トレンド、日足で調整後の反発、1時間足でサポートからの上昇確認でエントリー',
        
        // High probability patterns
        high_prob_title: '高確率パターンの組み合わせ',
        triple_cross_title: 'トリプルクロス戦略',
        triple_cross_1: '移動平均線のゴールデンクロス/デッドクロス',
        triple_cross_2: 'MACDのシグナルクロス',
        triple_cross_3: 'RSIのオーバーソールド/オーバーボート圏からの反転',
        triple_cross_conclusion: '上記3つのシグナルが同時期に発生した場合、高確率のエントリーポイントとなる',
        
        // Divergence confirmation strategy
        divergence_title: 'ダイバージェンス確認戦略',
        divergence_1: '複数のオシレーター系指標（RSI、MACD、ストキャスティクス）でダイバージェンスを確認',
        divergence_2: '複数の指標で同時にダイバージェンスが発生した場合、トレンド転換の可能性が高い',
        divergence_example: '例：価格が高値更新しているのに、RSI、MACD、ストキャスティクスのすべてが高値を更新していない場合は強い売りシグナル',
        
        // Practical advice
        practical_advice_title: '実践的なアドバイス',
        advice_1: '指標の組み合わせは多すぎると判断が複雑になるため、2〜3種類に絞ることをおすすめします',
        advice_2: '異なる種類の指標（トレンド系 + オシレーター系など）を組み合わせると、より多角的な分析が可能です',
        advice_3: 'バックテストを行い、自分のトレードスタイルに合った指標の組み合わせを見つけることが重要です',
        advice_4: '市場環境（トレンド相場/レンジ相場）によって、有効な指標の組み合わせは異なります',
        advice_5: 'テクニカル指標だけでなく、価格のパターンやサポート/レジスタンスレベルなども考慮した総合的な判断を心がけましょう',

        // Footer section
        footer_company_name: '株式会社BizRom東京',
        footer_company_desc: '米国株の短期トレーダー向けに、信頼性の高い市場分析を毎日2回配信するプロフェッショナルサービス',
        footer_todays_analysis: 'AI市況予報',
        footer_analysis_archive: '分析アーカイブ',
        footer_technical_indicators: 'テクニカル指標解説',
        footer_market_glossary: '市場用語集',
        footer_company_copyright: '© 2025 株式会社BizRom東京. All rights reserved.',
        footer_disclaimer: '当サイトの情報は投資判断の参考として提供されるものであり、投資勧誘を目的としたものではありません。投資の最終判断はご自身でお願いします。',
        
        // FAQ section
        faq_title: 'よくある質問',
        faq_question_1: 'テクニカル指標は本当に有効なのですか？',
        faq_answer_1: 'テクニカル指標は、市場参加者の行動パターンを数値化・可視化したものであり、多くのトレーダーが同じ指標を見ていることから、ある程度の有効性があります。ただし、完璧な予測ツールではなく、確率的な優位性を得るための道具として考えるべきです。単一の指標だけに頼るのではなく、複数の指標や分析手法を組み合わせ、リスク管理と合わせて活用することが重要です。',
        faq_question_2: '初心者はどの指標から学び始めるべきですか？',
        faq_answer_2: '初心者には、まず移動平均線、RSI、MACDなどの基本的な指標から学び始めることをおすすめします。これらの指標は理解しやすく、多くのチャートソフトに標準で搭載されています。特に移動平均線はトレンドの方向性を視覚的に捉えやすく、RSIは買われ過ぎ・売られ過ぎの状態を判断するのに役立ちます。基本的な指標の理解が深まったら、徐々に他の指標や組み合わせ方を学んでいくとよいでしょう。',
        faq_question_3: '指標のパラメーター（期間設定）はどのように決めるべきですか？',
        faq_answer_3: '指標のパラメーターは、トレードの時間軸や銘柄の特性によって調整するとよいでしょう。一般的には、短期トレードでは短い期間設定（RSIなら9日など）、長期トレードでは長い期間設定（RSIなら14日や21日など）が使われます。また、ボラティリティの高い銘柄では長めの期間設定、ボラティリティの低い銘柄では短めの期間設定が効果的なことがあります。最終的には、バックテストや実践を通じて、自分のトレードスタイルに合ったパラメーターを見つけることが重要です。',
        faq_question_4: 'テクニカル指標だけでトレードすべきですか？',
        faq_answer_4: 'テクニカル指標は有用なツールですが、それだけに頼るのではなく、ファンダメンタル分析（企業の業績、経済指標など）やマーケットセンチメント（市場心理）、需給要因なども考慮した総合的な判断が重要です。特に長期投資では、ファンダメンタルズの重要性が高まります。また、相場環境（トレンド相場かレンジ相場か）によって有効な指標や分析手法が異なるため、柔軟な対応が求められます。テクニカル指標はあくまでも意思決定をサポートするツールの一つとして位置づけるとよいでしょう。',
        faq_question_5: '指標が矛盾するシグナルを出した場合はどうすべきですか？',
        faq_answer_5: '指標が矛盾するシグナルを出した場合は、以下のアプローチを検討してください：優先順位を設ける（例：トレンド系指標を主、オシレーター系指標を従とする）、時間軸の長い指標を優先する（例：日足のシグナルを1時間足のシグナルより重視）など、複数の手法を組み合わせた判断が重要です。'
    },
    en: {
        // Navigation
        nav_today: 'AI Market Forecast',
        nav_pickup: 'Cramer\'s Holdings',
        nav_archive: 'Analysis Archive',
        nav_ipo: 'IPO Schedule',
        nav_indicators: 'Technical Indicators',
        nav_terms: 'Market Terms',
        nav_about: 'About',
        
        // Pickup page
        pickup_title: 'Cramer\'s Holdings',
        pickup_subtitle: 'AI-driven analysis and market trends to highlight US stocks worth watching',
        
        // Buttons
        login: 'Login',
        register: 'Sign Up',
        view_details: 'View Details',
        
        // Archive page
        archive_title: 'Analysis Archive',
        archive_subtitle: 'Browse past market analysis reports. Search by date or keywords to quickly find the information you need.',
        keyword_placeholder: 'Search by keyword',
        select_period: 'Select Period',
        select_evaluation: 'Select Evaluation',
        period: 'Period',
        period_all: 'All Periods',
        period_1w: '1 Week',
        period_1m: '1 Month',
        period_3m: '3 Months',
        evaluation_stats: 'Evaluation Statistics',
        no_reports: 'No reports to display.',
        
        // Date picker
        day_sun: 'Sun',
        day_mon: 'Mon',
        day_tue: 'Tue',
        day_wed: 'Wed',
        day_thu: 'Thu',
        day_fri: 'Fri',
        day_sat: 'Sat',
        today: 'Today',
        cancel: 'Cancel',
        apply: 'Apply',
        
        // Select options
        select_evaluation: 'Select Evaluation',
        
        // Evaluations
        eval_buy: 'Buy',
        eval_sell: 'Sell',
        eval_neutral: 'Neutral',
        cases: 'cases',
        
        // Footer
        footer_copyright: '© 2025 Market Insight Japan. All rights reserved.',
        footer_disclaimer_short: 'The information on this site is provided for reference purposes for investment decisions and is not intended as a solicitation for investment. Please make your own final investment decisions.',
        footer_content_title: 'Content',
        footer_site_info_title: 'Site Information',
        footer_about_link: 'About',
        footer_analysis_method_link: 'Analysis Method',
        footer_terms_link: 'Terms of Use',
        footer_privacy_link: 'Privacy Policy',
        footer_contact_title: 'Contact',
        footer_contact_desc: 'If you have any questions or feedback, please feel free to contact us.',
        footer_contact_button: 'Contact Us',

        // About page
        about_title: 'About',
        about_subtitle: 'Detailed information about YOHOU US Stock AI, service features, analysis methods, and more.',
        
        // Service Overview section
        service_overview_title: 'Service Overview',
        service_overview_description: 'YOHOU US Stock AI is an innovative AI platform that uses the latest artificial intelligence technology to analyze and predict Nikkei stock index trends. It processes market data in real-time and provides highly accurate market analysis and forecasts through advanced machine learning algorithms.',
        service_features_title: 'Key Features',
        service_feature_1: 'Detailed analysis of major indices such as Nikkei and NASDAQ',
        service_feature_2: 'Real-time evaluation of market health and psychological indicators',
        service_feature_3: 'Detailed sector-by-sector trends and correlation analysis',
        service_feature_4: 'Stock picks and background explanations',
        target_users_title: 'Target Users',
        target_users_description: 'This service is ideal for the following users:',
        target_user_1: 'Short-term traders of Japanese stocks',
        target_user_2: 'Trading desks of institutional investors',
        target_user_3: 'Individual investors who want to understand market trends in detail',
        
        // Analysis Method section
        analysis_method_title: 'Analysis Methods',
        analysis_method_description: 'YOHOU US Stock AI provides multi-faceted market understanding by combining multiple analytical approaches. We provide balanced market outlooks by fusing quantitative data analysis with qualitative market interpretation.',
        data_collection_title: 'Data Collection Methods',
        data_collection_description: 'Our service utilizes the following data sources:',
        data_source_1: 'Real-time trading data from Tokyo Stock Exchange',
        data_source_2: 'Various economic indicators and corporate performance data',
        data_source_3: 'Global market correlation data',
        key_indicators_title: 'Key Analysis Indicators',
        indicator_market_health_title: 'Market Health',
        indicator_market_health_desc: 'Advance-decline ratio, volume analysis, inter-sector capital flows',
        indicator_market_sentiment_title: 'Market Sentiment',
        indicator_market_sentiment_desc: 'Fear & Greed Index, volatility analysis, investor sentiment',
        indicator_technical_title: 'Technical Analysis',
        indicator_technical_desc: 'Moving averages, RSI, MACD, Bollinger Bands, Ichimoku Cloud',
        indicator_internal_title: 'Internal Structure Analysis',
        indicator_internal_desc: 'Index divergence, market cap performance, sector contribution',
        update_frequency_title: 'Update Frequency',
        update_frequency_description: 'Market analysis is updated twice daily: after the morning session ends (around 11:30) and after the market closes (around 15:30) on every trading day. Emergency reports are also distributed when important market events occur.',
        
        // AI Technology section
        ai_technology_title: 'About AI Technology',
        ai_technology_description: 'YOHOU US Stock AI uses cutting-edge artificial intelligence technology to perform market analysis and forecasting. By combining multiple AI models, we achieve more accurate and reliable analysis.',
        deep_learning_title: 'Deep Learning Models',
        deep_learning_desc: 'Learn from large amounts of market data, recognize complex patterns, and predict market trends. Specialized in time series analysis and non-linear pattern detection.',
        nlp_title: 'Natural Language Processing (NLP)',
        nlp_desc: 'Analyze news articles and market reports in real-time to evaluate market sentiment. Extract important market trends from text data.',
        ai_features_title: 'AI Features',
        ai_feature_1: 'Continuous market monitoring and analysis 24/7/365',
        ai_feature_2: 'Real-time processing of millions of data points',
        ai_feature_3: 'Detect minute market changes and immediately reflect them in analysis',
        ai_feature_4: 'Improved prediction accuracy through continuous learning',
        
        // Company Information section
        company_info_title: 'Company Information',
        company_info_description: 'YOHOU US Stock AI is an AI-driven market analysis platform operated by BizRom Tokyo Co., Ltd. We are a company specializing in financial AI research and development and market analysis using AI.',
        company_name: 'Company Name',
        company_name_value: 'BizRom Tokyo Co., Ltd.',
        company_established: 'Established',
        company_established_value: 'September 2020',
        company_business_title: 'Business Activities',
        company_business_1: '・Financial market analysis service provision',
        company_business_2: '・Investment information distribution services',
        company_business_3: '・Financial data analysis tool development',
        company_business_4: '・Market analysis seminar hosting',
        company_bank_title: 'Banking Partner',
        company_bank_value: 'Mizuho Bank',
        
        // Terms and Conditions section
        terms_conditions_title: 'Terms and Conditions',
        terms_of_use_title: 'Terms of Use',
        terms_point_1: 'Information provided by YOHOU US Stock AI is provided as a reference for investment decisions and is not intended as investment solicitation.',
        terms_point_2: 'Please make final investment decisions at your own responsibility. We are not responsible for any damages caused by the use of information.',
        terms_point_3: 'Unauthorized reproduction, copying, or redistribution of content from this service is prohibited.',
        terms_point_4: 'Service content may be changed without notice.',
        terms_full_link: 'Read the full Terms of Use',
        privacy_policy_title: 'Privacy Policy',
        privacy_point_1: 'We consider user privacy protection as our top priority.',
        privacy_point_2: 'Collected personal information is used only for service provision, quality improvement, and fulfillment of legal obligations.',
        privacy_point_3: 'We do not provide personal information to third parties without user consent.',
        privacy_point_4: 'This site uses cookies to improve services.',
        privacy_full_link: 'Read the full Privacy Policy',
        disclaimer_title: 'Disclaimer',
        disclaimer_point_1: 'While we strive for accuracy in the information provided by this service, we do not guarantee its completeness, accuracy, timeliness, or usefulness.',
        disclaimer_point_2: 'Market analysis is based on past data and current market conditions and does not guarantee future market trends.',
        disclaimer_point_3: 'We are not responsible for any direct or indirect damages caused by the use of this service.',
        disclaimer_full_link: 'Read the full Disclaimer',
        
        // Site Navigation section
        site_navigation_title: 'Site Navigation',
        nav_today_analysis_title: 'AI Market Forecast',
        nav_today_analysis_desc: 'Latest market analysis report',
        nav_archive_title: 'Analysis Archive',
        nav_archive_desc: 'Past market analysis reports',
        nav_indicators_title: 'Technical Indicators Guide',
        nav_indicators_desc: 'Detailed explanations of various indicators',
        
        // Contact section
        contact_title: 'Need more detailed information?',
        contact_description: 'If you have any questions or concerns about YOHOU US Stock AI, please feel free to contact us. Our specialist staff will answer you politely.',
        contact_form: 'Contact Form',
        trial_button: 'Apply for Free Trial',
        
        // Main page
        main_title: 'S&P 500 Interactive Market Analysis',
        main_subtitle: 'Data-driven insights for short-term traders',
        summary_title: 'Overall Assessment',
        
        // Dashboard sections
        market_health_title: 'Market Health (Previous Close)',
        market_sentiment_title: 'Market Sentiment (CNN Fear & Greed)',
        price_levels_title: 'Key Price Levels',
        resistance_level: 'Resistance Level',
        support_level: 'Support Level',
        put_call_ratio_title: 'Equity Put Call Ratio',
        daily_ratio: 'Daily Ratio',
        moving_average_21: '21-day Moving Average',
        
        // Analysis tabs
        detailed_analysis_title: 'Detailed Analysis',
        tab_instructions: 'Click the tabs below to switch between analysis sections',
        tab_internals: 'Market Internals',
        tab_technicals: 'Technical Analysis',
        tab_fundamentals: 'Fundamentals & Psychology',
        tab_strategy: 'Investment Strategy',
        
        // Strategy section
        basic_strategy: 'Basic Strategy',
        risk_management: 'Risk Management',
        
        // Sidebar
        market_overview_title: 'Market Overview',
        hot_stocks_title: 'Hot Stocks (Top Movers)',
        
        // Sentiment indicators
        vix_title: 'VIX (Fear Index)',
        aaii_title: 'AAII Individual Investor Sentiment',
        bullish: 'Bullish',
        neutral: 'Neutral',
        bearish: 'Bearish',
        ii_title: 'Investors Intelligence Bull/Bear Index',
        bulls: 'Bulls',
        bears: 'Bears',
        
        // Chart labels
        chart_market_health: 'Market Health',
        chart_decliners: 'Decliners',
        chart_advancers: 'Advancers',
        
        // Market Analysis specific terms
        hold_evaluation: 'Hold',
        market_cracks: 'Cracks Behind Record Highs',
        health_deterioration: 'Market Health Deterioration',
        sentiment_divergence: 'Sentiment Divergence',
        warning_signals: 'Warning Signals',
        negative_divergence: 'Negative Divergence',
        uptrend_fragility: 'Uptrend Fragility',
        complacency_shift: 'Shift from Complacency Signal',
        professional_optimism: 'Professional Optimism',
        retail_caution: 'Retail Caution',
        options_fear: 'Options Market Fear',
        triple_divergence: 'Triple Sentiment Divergence',
        market_fragility: 'Market Fragility',
        breadth_divergence: 'Serious Divergence Between Price and Market Internals (Breadth)',
        calm_before_storm: 'Calm Before the Storm',
        event_risk: 'Event Risk',
        capital_preservation: 'Capital Preservation',
        selective_action: 'Selective Action',
        emerging_caution: 'Emerging Caution',
        greed_territory: 'Greed Territory',
        psychological_milestone: 'Psychological Milestone',
        pullback_support: 'Pullback Support Level',
        fibonacci_retracement: 'Fibonacci Retracement',
        defensive_line: 'Short-term Defensive Line',
        put_hedging: 'Downside Hedging (Put Buying)',
        rising_caution: 'Rising Caution',
        narrow_leadership: 'Narrow Leadership',
        mega_cap_tech: 'Mega-cap Tech Stocks',
        advance_decline_line: 'Advance-Decline Line',
        extreme_complacency: 'Extreme Complacency',
        high_impact_events: 'High-impact Event Risks',
        asymmetric_risk: 'Asymmetric Risk Structure',
        volatility_explosion: 'Explosive Volatility Increase',
        
        // Footer
        footer_disclaimer: 'This analysis is a forecast based on provided information and does not guarantee investment results.',
        footer_copyright_text: 'Copyright © 2025 Market Insight. All Rights Reserved.',
        
        // Terms page
        terms_title: 'Market Glossary',
        terms_subtitle: 'Explains specialized terms used in the stock market. Provides information tailored to investor levels, from basic and chart terms to indicator and trading terms.',
        search_placeholder: 'Search for terms',
        terms_imp_high: 'High Importance',
        terms_imp_medium: 'Medium Importance',
        terms_imp_low: 'Low Importance',
        terms_cat_all: 'All',
        terms_cat_basic: 'Basic Terms',
        terms_cat_chart: 'Chart Terms',
        terms_cat_indicator: 'Indicator Terms',
        terms_cat_trading: 'Trading Terms',
        terms_sidebar_kana_index: 'Alphabetical Index',
        terms_sidebar_kana_en: 'A-Z',
        terms_sidebar_categories: 'Categories',
        terms_sidebar_cat_all: 'All Terms',
        terms_sidebar_frequent_terms: 'Frequently Searched',
        terms_ipo_short_desc: 'Initial Public Offering',
        terms_per_short_desc: 'Price Earnings Ratio',
        terms_pbr_short_desc: 'Price Book-value Ratio',
        terms_volume_title: 'Volume',
        terms_volume_short_desc: 'Indicator of trading volume',
        terms_section_en: 'A-Z',
        terms_section_a: 'A-line',
        terms_section_ka: 'Ka-line',
        terms_section_sa: 'Sa-line',
        terms_section_ta: 'Ta-line',
        terms_section_na: 'Na-line',
        terms_section_ha: 'Ha-line',
        terms_section_ma: 'Ma-line',
        terms_section_ya: 'Ya-line',
        terms_section_ra: 'Ra-line',
        terms_section_wa: 'Wa-line',
        terms_reusable_main_points: 'Main Points',
        terms_reusable_calculation: 'Calculation Method',
        terms_reusable_example: 'Usage Example',
        terms_reusable_related: 'Related Terms',
        term_ipo_title: 'IPO (Initial Public Offering)',
        term_ipo_desc: 'An IPO (Initial Public Offering) is when a private company lists its shares on a stock exchange for the first time, making them available for public purchase. This allows the company to raise capital and provides investors with a new investment opportunity.',
        term_ipo_point1: 'An important means for companies to raise capital.',
        term_ipo_point2: 'The offering price is determined by the lead underwriting securities company.',
        term_ipo_point3: 'Shares are often allocated to retail investors through a lottery system.',
        term_ipo_point4: 'The stock price tends to be highly volatile on the first day of trading.',
        term_ipo_example: '"Tech Company A is scheduled for an IPO next month, and its initial price is expected to be significantly higher than the offering price."',
        term_ipo_related1: 'Book Building',
        term_ipo_related2: 'Listing',
        term_ipo_related3: 'Market Capitalization',
        term_per_title: 'PER (Price Earnings Ratio)',
        term_per_desc: 'PER (Price Earnings Ratio) is a metric that measures a company\'s stock price relative to its earnings per share (EPS). It is used to assess whether a company\'s stock is overvalued or undervalued.',
        term_per_formula: 'PER = Stock Price ÷ Earnings Per Share (EPS)',
        term_per_formula_example: 'e.g., If stock price is ¥3,000 and EPS is ¥150, the PER is 20x.',
        term_per_example: '"This company\'s PER of 30x is significantly higher than the industry average of 20x, suggesting the stock may be overvalued."',
        term_per_related1: 'PBR',
        term_per_related2: 'EPS',
        term_per_related3: 'ROE',
        term_pbr_title: 'PBR (Price Book-value Ratio)',
        term_pbr_desc: 'PBR (Price Book-value Ratio) is a metric that compares a company\'s stock price to its book value per share (BPS). It is used to assess whether a stock is overvalued or undervalued relative to its asset value.',
        term_pbr_formula: 'PBR = Stock Price ÷ Book Value Per Share (BPS)',
        term_pbr_formula_example: 'e.g., If stock price is ¥3,000 and BPS is ¥2,000, the PBR is 1.5x.',
        term_pbr_example: '"This company\'s PBR of 0.8x is below 1, indicating that the stock is undervalued relative to its net assets."',
        term_pbr_related1: 'PER',
        term_pbr_related2: 'BPS',
        term_pbr_related3: 'Net Assets',
        term_roe_title: 'ROE (Return On Equity)',
        term_roe_desc: 'ROE (Return On Equity) is a metric that shows the ratio of a company\'s net income to its shareholders\' equity. It measures how efficiently the company is using capital from shareholders to generate profits.',
        term_roe_formula: 'ROE = Net Income ÷ Shareholders\' Equity × 100 (%)',
        term_roe_formula_example: 'e.g., If net income is ¥10 billion and shareholders\' equity is ¥100 billion, the ROE is 10%.',
        term_roe_example: '"This company has a high ROE of 15%, indicating it is using shareholder capital efficiently to generate profits."',
        term_roe_related1: 'ROA',
        term_roe_related2: 'EPS',
        term_roe_related3: 'Shareholders\' Equity',
        term_low_price_title: 'Low Price',
        term_low_price_desc: 'The low price refers to the lowest stock price within a specific period. It varies depending on the reference period, such as intraday low, year-to-date low, or all-time low.',
        term_low_price_point1: 'Often serves as a key support level in technical analysis.',
        term_low_price_point2: 'Consecutive new lows indicate a strong downward trend.',
        term_low_price_point3: 'A rebound without breaking the previous low can be a sign of bottoming out.',
        term_low_price_point4: 'New year-to-date or all-time lows significantly impact investor sentiment.',
        term_low_price_example: '"The Nikkei Average briefly hit a year-to-date low of ¥27,000 before rebounding into an uptrend."',
        term_low_price_related1: 'High Price',
        term_low_price_related2: 'Support Line',
        term_low_price_related3: 'Bottom Price',
        term_uptrend_title: 'Uptrend',
        term_uptrend_desc: 'An uptrend describes a situation where a stock price is generally moving upward. It is characterized by a pattern of higher highs and higher lows.',
        term_uptrend_point1: 'Characterized by a series of higher highs and higher lows.',
        term_uptrend_point2: 'The moving average trends upward, and the price often stays above it.',
        term_uptrend_point3: 'After a temporary decline (correction), the uptrend resumes without breaking the previous low.',
        term_uptrend_point4: 'Volume tends to increase during upward movements and decrease during corrections.',
        term_uptrend_example: '"This stock has been in an uptrend for three months, and many investors are looking for opportunities to buy on dips."',
        term_uptrend_related1: 'Downtrend',
        term_uptrend_related2: 'Ranging Market',
        term_uptrend_related3: 'Trendline',
        term_stock_index_title: 'Stock Index',
        term_stock_index_desc: 'A stock index represents the overall performance of a specific market or sector. It is calculated by aggregating the prices of multiple stocks according to a set formula, providing a single value to track market movements.',
        term_stock_index_point1: 'Nikkei Stock Average (Nikkei 225): An average of 225 stocks selected from the TSE First Section.',
        term_stock_index_point2: 'NASDAQ (Tokyo Stock Price Index): A market capitalization-weighted average of all stocks on the TSE First Section.',
        term_stock_index_point3: 'JPX-Nikkei Index 400: A market capitalization-weighted average of 400 stocks selected based on metrics like ROE.',
        term_stock_index_point4: 'Nikkei Jasdaq Average: An average of stocks listed on the Jasdaq market.',
        term_stock_index_example: '"Today, the Nikkei Stock Average closed at ¥29,500, up ¥300 from the previous day."',
        term_stock_index_related1: 'Nikkei Average',
        term_stock_index_related2: 'NASDAQ',
        term_stock_index_related3: 'Indexing',
        term_shareholder_benefit_title: 'Shareholder Benefits',
        term_shareholder_benefit_desc: 'Shareholder benefits are perks offered by a company to its shareholders. These typically include company products, gift certificates, or discounts, and are a way of returning value to shareholders in addition to dividends.',
        term_shareholder_benefit_point1: 'Granted to shareholders listed on the company register on the record date.',
        term_shareholder_benefit_point2: 'The type of benefit often varies based on the number of shares held.',
        term_shareholder_benefit_point3: 'Most companies offer them once or twice a year.',
        term_shareholder_benefit_point4: 'An increasing number of companies are offering special benefits for long-term shareholders.',
        term_shareholder_benefit_example: '"This restaurant chain offers its shareholders with 100 or more shares a ¥5,000 meal voucher twice a year as a benefit."',
        term_shareholder_benefit_related1: 'Dividend',
        term_shareholder_benefit_related2: 'Record Date',
        term_shareholder_benefit_related3: 'Shareholder Return',
        term_stock_split_title: 'Stock Split',
        term_stock_split_desc: 'A stock split is a corporate action where a company divides its existing shares into multiple shares to boost liquidity. While the number of shares increases, the price per share decreases proportionally, so the total value of an investor\'s holdings remains the same.',
        term_stock_split_point1: 'Splits can have various ratios, such as 2-for-1 or 3-for-1.',
        term_stock_split_point2: 'Often performed to make a high-priced stock more accessible to investors.',
        term_stock_split_point3: 'Leads to increased stock liquidity.',
        term_stock_split_point4: 'The lower post-split price can create a perception of being a bargain, sometimes leading to a price increase.',
        term_stock_split_example: '"Tech Company B will execute a 1-for-4 stock split next month, adjusting its current ¥40,000 stock price to around ¥10,000."',
        term_stock_split_related1: 'Reverse Stock Split',
        term_stock_split_related2: 'Ex-Dividend',
        term_stock_split_related3: 'EPS',
        term_support_line_title: 'Support Line',
        term_support_line_desc: 'A support line is a level on a chart where a falling stock price tends to pause or rebound. It is formed by connecting previous lows and is also known as a support level.',
        term_support_line_point1: 'Formed by connecting past low points.',
        term_support_line_point2: 'Buying interest tends to increase as the price approaches a support line.',
        term_support_line_point3: 'A break below the support line suggests a higher probability of further decline.',
        term_support_line_point4: 'A former support line can become a resistance line if the price breaks below and then returns to it.',
        term_support_line_example: '"The Nikkei Average has strong support around ¥28,000, having rebounded from this level three times."',
        term_support_line_related1: 'Resistance Line',
        term_support_line_related2: 'Trendline',
        term_support_line_related3: 'Breakout',
        term_limit_order_title: 'Limit Order',
        term_limit_order_desc: 'A limit order is a type of order to buy or sell a stock at a specified price or better. A buy limit order is executed only at the limit price or lower, and a sell limit order is executed only at the limit price or higher.',
        term_limit_order_point1: 'The main advantage is that you can trade at your desired price.',
        term_limit_order_point2: 'There is a risk the order will not be executed if the price does not reach the specified level.',
        term_limit_order_point3: 'Execution can be difficult in highly volatile markets.',
        term_limit_order_point4: 'Special types of limit orders exist for market open and close.',
        term_limit_order_example: '"The current stock price is ¥1,500, but I placed a limit buy order at ¥1,450 to automatically purchase it on a temporary dip."',
        term_limit_order_related1: 'Market Order',
        term_limit_order_related2: 'Stop Order',
        term_limit_order_related3: 'IOC Order',
        term_high_price_title: 'High Price',
        term_high_price_desc: 'The high price refers to the highest stock price within a specific period. It varies depending on the reference period, such as intraday high, year-to-date high, or all-time high.',
        term_high_price_point1: 'Often serves as a key resistance level in technical analysis.',
        term_high_price_point2: 'Consecutive new highs indicate a strong upward trend.',
        term_high_price_point3: 'Failure to surpass a previous high can be a sign of a top.',
        term_high_price_point4: 'New year-to-date or all-time highs significantly impact investor sentiment.',
        term_high_price_example: '"The Nikkei Average briefly hit a year-to-date high of ¥30,000 before falling back on profit-taking."',
        term_high_price_related1: 'Low Price',
        term_high_price_related2: 'Resistance Line',
        term_high_price_related3: 'Ceiling',
        term_downtrend_title: 'Downtrend',
        term_downtrend_desc: 'A downtrend describes a situation where a stock price is generally moving downward. It is characterized by a pattern of lower highs and lower lows.',
        term_downtrend_point1: 'Characterized by a series of lower highs and lower lows.',
        term_downtrend_point2: 'The moving average trends downward, and the price often stays below it.',
        term_downtrend_point3: 'After a temporary rise (rebound), the downtrend resumes without exceeding the previous high.',
        term_downtrend_point4: 'Volume tends to increase during downward movements and decrease during rebounds.',
        term_downtrend_example: '"This stock has been in a downtrend for two months, making selling on rallies an effective strategy."',
        term_downtrend_related1: 'Uptrend',
        term_downtrend_related2: 'Ranging Market',
        term_downtrend_related3: 'Trendline',
        term_nikkei_title: 'Nikkei Stock Average',
        term_nikkei_desc: 'The Nikkei Stock Average (Nikkei 225) is a stock market index for the Tokyo Stock Exchange, calculated by averaging the prices of 225 representative listed companies. It is a widely used indicator of the overall Japanese stock market.',
        term_nikkei_point1: 'A price-weighted average, where higher-priced stocks have a greater impact.',
        term_nikkei_point2: 'Calculated and published by Nikkei Inc.',
        term_nikkei_point3: 'The constituent stocks are reviewed periodically.',
        term_nikkei_point4: 'It is a target for futures and options trading.',
        term_nikkei_example: '"Following a rise in the U.S. stock market, the Nikkei Stock Average recovered to the ¥29,000 level."',
        term_nikkei_related1: 'NASDAQ',
        term_nikkei_related2: 'Dow Average',
        term_nikkei_related3: 'Nikkei Futures',
        term_dividend_title: 'Dividend',
        term_dividend_desc: 'A dividend is a mechanism for a company to distribute a portion of its profits to shareholders in cash. It is a key method of shareholder return and is typically paid once (final) or twice (interim and final) a year.',
        term_dividend_point1: 'The dividend amount is expressed as an amount per share.',
        term_dividend_point2: 'Dividend Yield = (Annual Dividend per Share / Stock Price) x 100 (%).',
        term_dividend_point3: 'Paid to shareholders who are on the company register on the record date.',
        term_dividend_point4: 'Payout Ratio = (Total Dividends / Net Income) x 100 (%), showing the proportion of earnings paid as dividends.',
        term_dividend_example: '"This company pays an annual dividend of ¥60 per share, resulting in a 2% dividend yield at the current stock price of ¥3,000."',
        term_dividend_related1: 'Dividend Yield',
        term_dividend_related2: 'Record Date',
        term_dividend_related3: 'Shareholder Return',
        term_gap_title: 'Window (Gap)',
        term_gap_desc: 'A window (or gap) is a phenomenon where a space appears between the previous day\'s closing price and the current day\'s opening price. There are upward gaps (higher open) and downward gaps (lower open).',
        term_gap_point1: 'Often occurs after major economic news or corporate earnings announcements.',
        term_gap_point2: 'The saying "gaps get filled" suggests the price often returns to that level later.',
        term_gap_point3: 'An upward gap in an uptrend is a bullish sign; a downward gap in a downtrend is a bearish sign.',
        term_gap_point4: 'A large gap can sometimes signal a trend reversal.',
        term_gap_example: '"Following strong earnings, the stock opened with a large upward gap at ¥1,580, up from the previous close of ¥1,500."',
        term_gap_related1: 'Filling the Gap',
        term_gap_related2: 'Market Open',
        term_gap_related3: 'Day-over-Day Change',
        term_ohlc_title: 'OHLC (Open, High, Low, Close)',
        term_ohlc_desc: 'OHLC refers to the four key prices of a stock for a given period (usually a day): the opening, high, low, and closing prices. This is the fundamental data for candlestick charts.',
        term_ohlc_point1: 'Open: The first price traded at the beginning of the period.',
        term_ohlc_point2: 'High: The highest price traded during the period.',
        term_ohlc_point3: 'Low: The lowest price traded during the period.',
        term_ohlc_point4: 'Close: The last price traded at the end of the period (becomes the reference for the next day).',
        term_ohlc_example: '"Today\'s OHLC for Toyota Motor were: Open ¥2,100, High ¥2,150, Low ¥2,080, and Close ¥2,120."',
        term_ohlc_related1: 'Candlestick',
        term_ohlc_related2: 'Market Open',
        term_ohlc_related3: 'Market Close',
        term_candlestick_title: 'Candlestick',
        term_candlestick_desc: 'A candlestick is a chart type used in technical analysis that originated in Japan. It displays the high, low, open, and closing prices for a specific period in a single shape.',
        term_candlestick_point1: 'Body: The rectangular part connecting the open and close prices.',
        term_candlestick_point2: 'Wick (or Shadow): The lines extending from the body to the high and low prices.',
        term_candlestick_point3: 'Bullish (White/Green/Blue): The close is higher than the open (price went up).',
        term_candlestick_point4: 'Bearish (Black/Red): The close is lower than the open (price went down).',
        term_candlestick_point5: 'Various patterns (e.g., Harami, Engulfing, Doji) can indicate market turning points.',
        term_candlestick_example: '"The daily chart shows three consecutive long bullish candlesticks, indicating sustained strong buying pressure."',
        term_candlestick_related1: 'OHLC',
        term_candlestick_related2: 'Bullish Line',
        term_candlestick_related3: 'Bearish Line',
        term_resistance_line_title: 'Resistance Line',
        term_resistance_line_desc: 'A resistance line is a level on a chart where a rising stock price tends to pause or fall back. It is formed by connecting previous highs and is also known as a resistance level.',
        term_resistance_line_point1: 'Formed by connecting past high points.',
        term_resistance_line_point2: 'Selling interest tends to increase as the price approaches a resistance line.',
        term_resistance_line_point3: 'A break above the resistance line suggests a higher probability of further rise.',
        term_resistance_line_point4: 'A former resistance line can become a support line if the price breaks above and then returns to it.',
        term_resistance_line_example: '"The Nikkei Average has strong resistance around ¥30,000, having fallen back from this level twice."',
        term_resistance_line_related1: 'Support Line',
        term_resistance_line_related2: 'Trendline',
        term_resistance_line_related3: 'Breakout',
        term_value_stock_title: 'Value Stock',
        term_value_stock_desc: 'A value stock is a stock that appears to be trading for less than its intrinsic or book value. It is often the target of value investing.',
        term_value_stock_point1: 'PER (Price-to-Earnings ratio) is lower than the industry or market average.',
        term_value_stock_point2: 'PBR (Price-to-Book ratio) is below 1 or lower than the industry average.',
        term_value_stock_point3: 'Dividend yield is higher than the market average.',
        term_value_stock_point4: 'The stock price is undervalued relative to the company\'s growth or earnings potential.',
        term_value_stock_example: '"This bank stock, with a PBR of 0.6x and a 4% dividend yield, shows typical characteristics of a value stock."',
        term_value_stock_related1: 'Growth Stock',
        term_value_stock_related2: 'Value Investing',
        term_value_stock_related3: 'PER',

        // Indicators page
        indicators_title: 'Technical Indicators',
        indicators_subtitle: 'Detailed explanations of major technical indicators useful for stock market analysis. Provides information tailored to trader levels, from basic concepts of each indicator to practical application methods.',
        indicator_search_placeholder: 'Search indicators',
        
        // Difficulty levels
        difficulty_beginner: 'Beginner',
        difficulty_intermediate: 'Intermediate', 
        difficulty_advanced: 'Advanced',
        
        // Navigation sections
        table_of_contents: 'Table of Contents',
        popular_indicators: 'Popular Indicators',
        
        // Indicator categories
        trend_indicators: 'Trend Indicators',
        momentum_indicators: 'Momentum Indicators',
        volatility_indicators: 'Volatility Indicators',
        volume_indicators: 'Volume Indicators',
        oscillator_indicators: 'Oscillator Indicators',
        combination_strategies: 'Combination Strategies',
        
        // Common terms
        practical_trading_strategies: 'Practical Trading Strategies',
        rsi_description: 'Relative Strength Index',
        calculation_method: 'Calculation Method',
        chart_example: 'Chart Example',
        usage_method: 'How to Use',
        
        // Moving Average descriptions
        ma_title: 'Moving Average',
        ma_description: 'Moving averages are lines that connect the average prices over a certain period and are the most fundamental indicators for understanding market trends. By combining short-term, medium-term, and long-term moving averages, you can assess trend changes and strength.',
        ma_sma_desc: 'Simple Moving Average (SMA): The sum of closing prices over a specified period divided by the number of periods',
        ma_ema_desc: 'Exponential Moving Average (EMA): A moving average that gives more weight to recent prices',
        ma_ema_formula: 'EMA = Price × K + Previous EMA × (1 - K)<br>K = 2 ÷ (Period + 1)',
        ma_chart_desc: 'Nikkei Average and 20-day/50-day/200-day moving averages',
        ma_usage_1: 'When short-term moving average crosses above long-term moving average, it\'s a buy signal (Golden Cross)',
        ma_usage_2: 'When short-term moving average crosses below long-term moving average, it\'s a sell signal (Dead Cross)',
        ma_usage_3: 'When price is above moving average, it indicates uptrend; when below, it indicates downtrend',
        ma_usage_4: 'When multiple moving averages are rising/falling in parallel, it indicates strong trend',
        ma_strategy_desc: 'Strategy examples using moving average combinations:',
        ma_strategy_1: 'Use crossovers between 5-day and 20-day moving averages as short-term trading signals',
        ma_strategy_2: 'Use 50-day moving average as support/resistance level',
        ma_strategy_3: 'Use 200-day moving average as long-term trend criterion',
        ma_strategy_4: 'Trade bounces when price touches moving average',
        
        // MACD descriptions
        macd_title: 'MACD (Moving Average Convergence Divergence)',
        macd_description: 'MACD is a trend-following indicator that uses the difference between short-term and long-term exponential moving averages (EMA). It is useful for identifying trend direction, strength, and turning points.',
        macd_line_desc: 'MACD Line = Short-term EMA - Long-term EMA (typically 12-day and 26-day)',
        macd_signal_desc: 'Signal Line = 9-day EMA of MACD',
        macd_histogram_desc: 'Histogram = MACD Line - Signal Line',
        macd_chart_desc: 'Top: Nikkei Average, Bottom: MACD (Blue line: MACD line, Red line: Signal line, Histogram)',
        macd_usage_1: 'When MACD line crosses above signal line, it\'s a buy signal',
        macd_usage_2: 'When MACD line crosses below signal line, it\'s a sell signal',
        macd_usage_3: 'When both MACD and signal lines are above zero line, it indicates uptrend',
        macd_usage_4: 'When both MACD and signal lines are below zero line, it indicates downtrend',
        macd_usage_5: 'Expanding histogram shows trend acceleration, contracting shows trend deceleration',
        macd_strategy_desc: 'MACD strategy examples:',
        macd_strategy_1: 'Zero line cross: Enter when MACD line crosses above/below zero line',
        macd_strategy_2: 'Divergence: When price makes new highs but MACD doesn\'t, it\'s a sell signal',
        macd_strategy_3: 'Histogram changes: Be cautious of trend ending when histogram starts contracting',
        macd_strategy_4: 'Multi-timeframe analysis: Combine daily and weekly MACD for more reliable signals',
        
        // Popular indicators
        popular_ma: 'Moving Average',
        popular_macd_desc: 'Moving Average Convergence Divergence',
        popular_bb: 'Bollinger Bands',
        popular_bb_desc: 'Shows price volatility range',
        popular_rsi_desc: 'Relative Strength Index',
        
        // RSI descriptions
        rsi_title: 'RSI (Relative Strength Index)',
        rsi_description: 'RSI is an indicator calculated from the ratio of upward and downward price movements over a certain period, useful for determining market overheating and overbought/oversold conditions. It is displayed in a range from 0 to 100 and is typically calculated over a 14-day period.',
        rsi_formula_1: 'RSI = 100 - (100 / (1 + RS))',
        rsi_formula_2: 'RS (Relative Strength) = Average gain over period ÷ Average loss over period',
        rsi_chart_desc: 'Top: Nikkei Average, Bottom: RSI (14-day)',
        rsi_usage_1: 'RSI above 70 indicates overbought condition (sell signal)',
        rsi_usage_2: 'RSI below 30 indicates oversold condition (buy signal)',
        rsi_usage_3: 'RSI above 50 suggests uptrend, below 50 suggests downtrend',
        rsi_usage_4: 'RSI trendline breaks can suggest price turning points',
        rsi_usage_5: 'Divergence between RSI and price can signal trend reversal',
        rsi_strategy_desc: 'RSI strategy examples:',
        rsi_strategy_1: 'In strong trending markets, adjust RSI thresholds (40-80 for uptrends, 20-60 for downtrends)',
        rsi_strategy_2: 'Buy entry when RSI breaks back above 30 after falling below it',
        rsi_strategy_3: 'Sell entry when RSI breaks back below 70 after rising above it',
        rsi_strategy_4: 'Positive divergence (price makes lower lows but RSI doesn\'t) is a strong buy signal',
        rsi_strategy_5: 'Negative divergence (price makes higher highs but RSI doesn\'t) is a strong sell signal',
        
        // Stochastics descriptions
        stochastics_title: 'Stochastics',
        stochastics_description: 'Stochastics is an indicator that expresses the current closing price\'s position within a price range over a certain period as a percentage. It helps determine market momentum, direction, and overbought/oversold conditions.',
        stochastics_formula_1: '%K = 100 × ((Current Close - Lowest Low) ÷ (Highest High - Lowest Low))',
        stochastics_formula_2: '%D = 3-day simple moving average of %K',
        stochastics_chart_desc: 'Top: Nikkei Average, Bottom: Stochastics (Blue line: %K, Red line: %D)',
        stochastics_usage_1: 'When %K crosses above %D, it\'s a buy signal',
        stochastics_usage_2: 'When %K crosses below %D, it\'s a sell signal',
        stochastics_usage_3: 'Above 80 indicates overbought, below 20 indicates oversold',
        stochastics_usage_4: 'Reversals from overbought/oversold zones provide strong signals',
        stochastics_usage_5: 'Divergence between stochastics and price suggests potential trend reversal',
        stochastics_strategy_desc: 'Stochastics strategy examples:',
        stochastics_strategy_1: 'Use slow stochastics (3-day MA of %D) to reduce noise',
        stochastics_strategy_2: 'In trending markets, watch for uptrends in 20-50 range, downtrends in 50-80 range',
        stochastics_strategy_3: 'Multi-timeframe analysis (daily overbought but weekly rising suggests continued uptrend)',
        stochastics_strategy_4: 'Combine with RSI for confirmation (both showing overbought/oversold for reversal trades)',
        
        // Bollinger Bands descriptions
        bollinger_title: 'Bollinger Bands',
        bollinger_description: 'Bollinger Bands are plotted using a moving average as the center line with standard deviation bands above and below. They visualize price volatility and help determine market overheating and potential reversals.',
        bollinger_formula_1: 'Middle Line = n-period simple moving average (typically 20-day)',
        bollinger_formula_2: 'Upper Band = Middle Line + (n-period standard deviation × k) (typically k=2)',
        bollinger_formula_3: 'Lower Band = Middle Line - (n-period standard deviation × k) (typically k=2)',
        bollinger_chart_desc: 'Nikkei Average and Bollinger Bands (20-day, ±2σ)',
        bollinger_usage_1: 'When price touches/breaks upper band, it may be overbought; lower band suggests oversold',
        bollinger_usage_2: 'Band expansion indicates increasing volatility, contraction indicates decreasing volatility',
        bollinger_usage_3: 'Extreme band contraction (squeeze) often precedes significant price movement',
        bollinger_usage_4: 'Price breaking above middle line suggests uptrend, below suggests downtrend',
        bollinger_usage_5: 'Watch for W-bottom (double bottom) and M-top (double top) patterns',
        bollinger_strategy_title: 'Examples of Bollinger Bands Strategies:',
        bollinger_strategy_1: 'Band Walk: In strong trending markets, prices tend to move along the upper/lower bands',
        bollinger_strategy_2: 'Band Touch Strategy: In ranging markets, consider selling at upper band touch and buying at lower band touch',
        bollinger_strategy_3: 'Bollinger Bounce: Buy when price breaks back above after falling below the lower band',
        bollinger_strategy_4: 'Squeeze Breakout: Follow the breakout direction after extreme band contraction',
        bollinger_strategy_5: '%B Indicator: Use this indicator that shows price position within bands on a 0-1 scale',

        // ATR section
        atr_title: 'ATR (Average True Range)',
        atr_description: 'ATR shows the average value of price volatility (true range) over a certain period. It quantifies market volatility and helps with risk management and position sizing.',
        atr_calculation_title: 'Calculation Method',
        atr_tr_desc: 'True Range (TR) = Maximum of the following three values',
        atr_tr_1: 'Current day\'s high - Current day\'s low',
        atr_tr_2: '|Current day\'s high - Previous day\'s close|',
        atr_tr_3: '|Current day\'s low - Previous day\'s close|',
        atr_formula: 'ATR = Exponential moving average of TR over n days (typically 14 days)',
        atr_chart_desc: 'Top: Nikkei Average, Bottom: ATR (14-day)',
        atr_usage_title: 'How to Use',
        atr_usage_1: 'Rising ATR indicates increasing volatility, falling ATR indicates decreasing volatility',
        atr_usage_2: 'Sharp increases in ATR may suggest market turning points or significant events',
        atr_usage_3: 'Use ATR to determine position sizes based on stop-loss levels and risk tolerance',
        atr_usage_4: 'Set profit/loss targets using ATR multiples (e.g., stop-loss at 2 ATR from entry price)',
        atr_strategy_desc: 'Examples of ATR-based strategies:',
        atr_strategy_1: 'Chandelier ATR Stop: Use ATR multiples for trailing stops in trend-following strategies',
        atr_strategy_2: 'Volatility Breakout: Use ATR increases after declines as breakout signals',
        atr_strategy_3: 'Risk-Adjusted Position Sizing: Position size = Risk tolerance ÷ (ATR × price unit)',
        atr_strategy_4: 'ATR Channel: Create channels by adding/subtracting ATR multiples from current price for support/resistance',

        // Volume indicators section
        volume_indicators: 'Volume Indicators',

        // OBV section
        obv_title: 'OBV (On-Balance Volume)',
        obv_description: 'OBV is a cumulative indicator that adds volume on up days and subtracts volume on down days. Since volume often changes ahead of price movements, it helps predict trend reversal points.',
        obv_calculation_title: 'Calculation Method',
        obv_calc_up: 'When price rises: OBV = Previous day\'s OBV + Current day\'s volume',
        obv_calc_down: 'When price falls: OBV = Previous day\'s OBV - Current day\'s volume',
        obv_calc_unchanged: 'When price unchanged: OBV = Previous day\'s OBV',
        obv_chart_desc: 'Top: Nikkei Average, Bottom: OBV',
        obv_usage_title: 'How to Use',
        obv_usage_1: 'When OBV is in an uptrend, it confirms a price uptrend',
        obv_usage_2: 'When OBV is in a downtrend, it confirms a price downtrend',
        obv_usage_3: 'Divergence between OBV and price suggests potential trend reversal',
        obv_usage_4: 'OBV trendline breaks often precede price movements',
        obv_strategy_desc: 'Examples of OBV-based strategies:',
        obv_strategy_1: 'OBV Trendline Analysis: Use OBV trendline breaks as price reversal points',
        obv_strategy_2: 'OBV Moving Average Relationship: Use signals when OBV crosses above/below its own moving average',
        obv_strategy_3: 'Positive Divergence: Buy signal when price falls but OBV rises',
        obv_strategy_4: 'Negative Divergence: Sell signal when price rises but OBV falls',

        // VWAP section
        vwap_title: 'VWAP (Volume Weighted Average Price)',
        vwap_description: 'VWAP shows the weighted average price considering trading volume at each price level. Mainly used by institutional investors to evaluate trading costs, but individual investors can also use it to determine support/resistance levels and trend direction.',
        vwap_calculation_title: 'Calculation Method',
        vwap_formula: 'VWAP = Σ(Price × Volume) ÷ Σ(Volume)',
        vwap_note: 'Usually calculated within a trading day and reset the next day',
        vwap_chart_desc: 'Nikkei Average and VWAP',
        vwap_usage_title: 'How to Use',
        vwap_usage_1: 'When price is above VWAP, buying pressure is strong; below VWAP indicates selling pressure',
        vwap_usage_2: 'VWAP often functions as support/resistance',
        vwap_usage_3: 'When price deviates significantly from VWAP, consider mean reversion possibility',
        vwap_usage_4: 'Institutional investors typically aim for better prices than VWAP, so they may base trading decisions on VWAP',
        vwap_strategy_desc: 'Examples of VWAP-based strategies:',
        vwap_strategy_1: 'VWAP Bounce Strategy: Enter in trend direction when price touches and bounces off VWAP',
        vwap_strategy_2: 'VWAP Cross Strategy: Enter in breakout direction when price crosses above/below VWAP',
        vwap_strategy_3: 'VWAP Deviation Strategy: Contrarian entry targeting mean reversion when price deviates significantly from VWAP',
        vwap_strategy_4: 'Multiple Timeframe VWAP: Analyze using combination of intraday short-term VWAP and multi-day VWAP',

        // Oscillator indicators section
        oscillator_indicators: 'Oscillator Indicators',

        // CCI section
        cci_title: 'CCI (Commodity Channel Index)',
        cci_description: 'CCI measures how much the price deviates from the average price. It helps determine market overheating and overbought/oversold conditions.',
        cci_calculation_title: 'Calculation Method',
        cci_formula_main: 'CCI = (TP - SMA of TP) / (0.015 × MD)',
        cci_formula_tp: 'TP (Typical Price) = (High + Low + Close) / 3',
        cci_formula_sma: 'SMA of TP = n-period simple moving average of TP (typically 20 days)',
        cci_formula_md: 'MD = Mean absolute deviation of TP from SMA of TP',
        cci_chart_desc: 'Top: Nikkei Average, Bottom: CCI (20-day)',
        cci_usage_title: 'How to Use',
        cci_usage_1: 'When CCI exceeds +100, it\'s considered overbought; below -100 is oversold',
        cci_usage_2: 'When CCI breaks above zero line, it suggests uptrend; below suggests downtrend',
        cci_usage_3: 'Extreme CCI values (+200 or above/-200 or below) suggest strong trends or potential reversals',
        cci_usage_4: 'Divergence between CCI and price serves as a trend reversal signal',
        cci_strategy_desc: 'Examples of CCI-based strategies:',
        cci_strategy_1: 'CCI Zero Line Cross Strategy: Enter in trend direction when CCI crosses above/below zero line',
        cci_strategy_2: 'CCI Reversal Strategy: Enter in reversal direction when CCI reverses after exceeding +100/-100',
        cci_strategy_3: 'CCI Divergence Strategy: Detect CCI-price divergence and target trend reversals',
        cci_strategy_4: 'CCI Trend Continuation Strategy: In strong trends, use the fact that CCI stays above +100/-100',

        // Combination Strategies section
        combination_strategies: 'Combination Strategies',
        combination_title: 'Effective Analysis Methods Using Multiple Indicators',
        combination_description: 'By combining multiple indicators rather than using just a single one, you can obtain more reliable signals. Here we introduce effective indicator combinations and their application methods.',
        
        // Trend confirmation and timing combinations
        trend_timing_title: 'Combining Trend Confirmation and Trading Timing',
        ma_rsi_title: 'Moving Average + RSI',
        ma_rsi_1: 'Confirm trend direction with moving averages',
        ma_rsi_2: 'Determine trading timing with RSI',
        ma_rsi_example: 'Example: Buy when RSI falls below 30 then rises again during an uptrend (price above moving average)',
        
        macd_bollinger_title: 'MACD + Bollinger Bands',
        macd_bollinger_1: 'Confirm trend direction and strength with MACD',
        macd_bollinger_2: 'Determine price volatility range and breakouts with Bollinger Bands',
        macd_bollinger_example: 'Example: Strong buy signal when MACD line crosses above signal line AND price breaks above upper Bollinger Band',
        
        // Multiple timeframe analysis
        timeframe_title: 'Multiple Timeframe Analysis',
        timeframe_description: 'By combining charts from different timeframes, you can gain a more comprehensive market perspective.',
        topdown_title: 'Top-Down Approach',
        topdown_1: 'Long-term charts (weekly/daily) to confirm trend direction',
        topdown_2: 'Medium-term charts (daily/4-hour) to confirm corrections and bounces within the trend',
        topdown_3: 'Short-term charts (1-hour/15-minute) to identify entry points',
        topdown_example: 'Example: Weekly uptrend, daily bounce after correction, 1-hour confirmation of rise from support for entry',
        
        // High probability patterns
        high_prob_title: 'High Probability Pattern Combinations',
        triple_cross_title: 'Triple Cross Strategy',
        triple_cross_1: 'Moving average golden cross/dead cross',
        triple_cross_2: 'MACD signal cross',
        triple_cross_3: 'RSI reversal from oversold/overbought zones',
        triple_cross_conclusion: 'When all three signals occur simultaneously, it becomes a high-probability entry point',
        
        // Divergence confirmation strategy
        divergence_title: 'Divergence Confirmation Strategy',
        divergence_1: 'Confirm divergence using multiple oscillator indicators (RSI, MACD, Stochastics)',
        divergence_2: 'When multiple indicators show divergence simultaneously, trend reversal probability is high',
        divergence_example: 'Example: Strong sell signal when price makes new highs but RSI, MACD, and Stochastics all fail to make new highs',
        
        // Practical advice
        practical_advice_title: 'Practical Advice',
        advice_1: 'Limit indicator combinations to 2-3 types to avoid overly complex decision-making',
        advice_2: 'Combining different types of indicators (trend + oscillator) enables more comprehensive analysis',
        advice_3: 'Conduct backtesting to find indicator combinations that suit your trading style',
        advice_4: 'Effective indicator combinations vary depending on market conditions (trending vs ranging)',
        advice_5: 'Consider comprehensive analysis including price patterns and support/resistance levels, not just technical indicators',

        // Footer section
        footer_company_name: 'BizRom Tokyo Co., Ltd.',
        footer_company_desc: 'Professional service providing reliable market analysis twice daily for short-term Japanese stock traders',
        footer_todays_analysis: 'Today\'s Market Analysis',
        footer_analysis_archive: 'Analysis Archive',
        footer_technical_indicators: 'Technical Indicators Guide',
        footer_market_glossary: 'Market Glossary',
        footer_company_copyright: '© 2025 BizRom Tokyo Co., Ltd. All rights reserved.',
        footer_disclaimer: 'The information on this site is provided for reference purposes for investment decisions and is not intended as investment advice. Please make your own final investment decisions.',
        
        // FAQ section
        faq_title: 'Frequently Asked Questions',
        faq_question_1: 'Are technical indicators really effective?',
        faq_answer_1: 'Technical indicators quantify and visualize behavioral patterns of market participants, and they have some effectiveness because many traders look at the same indicators. However, they are not perfect prediction tools and should be considered as tools for gaining probabilistic advantages. It is important to use them in combination with multiple indicators and analytical methods, along with risk management, rather than relying solely on a single indicator.',
        faq_question_2: 'Which indicators should beginners start learning from?',
        faq_answer_2: 'For beginners, we recommend starting with basic indicators such as moving averages, RSI, and MACD. These indicators are easy to understand and are standard in most charting software. Moving averages in particular make it easy to visually grasp trend direction, while RSI is useful for determining overbought and oversold conditions. Once you have a good understanding of basic indicators, you can gradually learn about other indicators and how to combine them.',
        faq_question_3: 'How should I determine indicator parameters (period settings)?',
        faq_answer_3: 'Indicator parameters should be adjusted according to your trading timeframe and the characteristics of the stock. Generally, shorter period settings (such as 9 days for RSI) are used for short-term trading, while longer period settings (such as 14 or 21 days for RSI) are used for longer-term trading. Also, longer period settings can be effective for high-volatility stocks, while shorter period settings may work better for low-volatility stocks. Ultimately, it is important to find parameters that suit your trading style through backtesting and practice.',
        faq_question_4: 'Should I trade using only technical indicators?',
        faq_answer_4: 'While technical indicators are useful tools, comprehensive judgment that considers fundamental analysis (corporate performance, economic indicators, etc.), market sentiment (market psychology), and supply-demand factors is important rather than relying solely on them. Fundamentals become particularly important for long-term investment. Also, since effective indicators and analytical methods differ depending on market conditions (trending vs. ranging markets), flexible responses are required. Technical indicators should be positioned as just one of the tools that support decision-making.',
        faq_question_5: 'What should I do when indicators give conflicting signals?',
        faq_answer_5: 'When indicators give conflicting signals, consider the following approaches: establish priorities (e.g., prioritize trend indicators over oscillator indicators), prioritize longer timeframe indicators (e.g., give more weight to daily signals over hourly signals), and use judgment that combines multiple methods.'
    }
};

// Language switcher HTML
function createLanguageSwitcher() {
    // ヘッダー内の言語切り替えボタンが既に存在する場合は、それを使用
    const headerSwitcher = document.getElementById('header-lang-switcher');
    if (headerSwitcher) {
        // ヘッダー内のボタンにイベントリスナーを追加
        headerSwitcher.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const lang = this.getAttribute('data-lang');
                switchLanguage(lang);
            });
        });
        
        // 初期状態を設定
        updateHeaderLanguageButtons();
        return headerSwitcher;
    }
    
    // フォールバック: 固定位置のスイッチャーを作成（他のページ用）
    const switcher = document.createElement('div');
    switcher.id = 'lang-switcher';
    switcher.className = 'fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-2';
    switcher.innerHTML = `
        <div class="flex items-center space-x-2">
            <button class="lang-btn ${currentLang === 'ja' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'} px-3 py-1 rounded text-sm font-medium transition-colors" data-lang="ja">日本語</button>
            <span class="text-gray-400">|</span>
            <button class="lang-btn ${currentLang === 'en' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'} px-3 py-1 rounded text-sm font-medium transition-colors" data-lang="en">English</button>
        </div>
    `;
    
    // Add event listeners
    switcher.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            switchLanguage(lang);
        });
    });
    
    return switcher;
}

// ヘッダー内の言語切り替えボタンの状態を更新する関数
function updateHeaderLanguageButtons() {
    const headerSwitcher = document.getElementById('header-lang-switcher');
    if (headerSwitcher) {
        headerSwitcher.querySelectorAll('.lang-btn').forEach(btn => {
            const btnLang = btn.getAttribute('data-lang');
            if (btnLang === currentLang) {
                btn.className = 'lang-btn bg-primary text-white px-2 py-1 rounded text-xs font-medium transition-colors';
            } else {
                btn.className = 'lang-btn bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium transition-colors';
            }
        });
    }
}

// Switch language function
function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    
    // Update global currentLang for compatibility
    window.currentLang = lang;
    
    // Update language switcher buttons (both fixed and header)
    document.querySelectorAll('.lang-btn').forEach(btn => {
        const btnLang = btn.getAttribute('data-lang');
        if (btnLang === lang) {
            // ヘッダー内のボタンの場合は小さいサイズ、固定位置のボタンの場合は通常サイズ
            if (btn.closest('#header-lang-switcher')) {
                btn.className = 'lang-btn bg-primary text-white px-2 py-1 rounded text-xs font-medium transition-colors';
            } else {
                btn.className = 'lang-btn bg-primary text-white px-3 py-1 rounded text-sm font-medium transition-colors';
            }
        } else {
            // ヘッダー内のボタンの場合は小さいサイズ、固定位置のボタンの場合は通常サイズ
            if (btn.closest('#header-lang-switcher')) {
                btn.className = 'lang-btn bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium transition-colors';
            } else {
                btn.className = 'lang-btn bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm font-medium transition-colors';
            }
        }
    });
    
    // Update all translatable elements
    document.querySelectorAll('[data-lang]').forEach(element => {
        const key = element.getAttribute('data-lang');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
    
    // Update placeholders
    document.querySelectorAll('[data-lang-placeholder]').forEach(element => {
        const key = element.getAttribute('data-lang-placeholder');
        if (translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });
    
    // Page-specific reloading and rendering
    if (typeof window.loadReportData === 'function') {
        // For index.html - reload data and redraw all charts with new language
        console.log('🔄 Reloading data for language change...');
        window.loadReportData();
    } else if (typeof window.renderAll === 'function') {
        // For archive.html - re-render content
        console.log('🔄 Re-rendering archive content for language change...');
        window.renderAll();
    }
    
    // Trigger custom event for any additional dynamic content that might need updating
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    
    console.log(`✅ Language switched to: ${lang}`);
}

// Initialize language system
async function initLanguage() {
    console.log('🚀 Initializing language system...');
    
    // 外部翻訳システムの初期化を試行（オプショナル）
    if (window.loadExternalTranslations) {
        try {
            console.log('🔄 Attempting to load external translations...');
            const externalLoaded = await window.loadExternalTranslations();
            if (externalLoaded) {
                console.log('✅ External translation system activated');
                window.externalTranslationLoader.setCurrentLang(currentLang);
            } else {
                console.log('🔄 Using embedded translation system');
            }
        } catch (error) {
            console.warn('⚠️ External translation initialization failed, using embedded system:', error);
        }
    }
    
    // ヘッダー内の言語切り替えボタンが存在する場合は、それを使用
    const headerSwitcher = document.getElementById('header-lang-switcher');
    if (headerSwitcher) {
        // ヘッダー内のボタンにイベントリスナーを追加
        headerSwitcher.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const lang = this.getAttribute('data-lang');
                switchLanguage(lang);
            });
        });
        
        // 初期状態を設定
        updateHeaderLanguageButtons();
        
        // 既存の固定位置スイッチャーがあれば削除
        const existingSwitcher = document.getElementById('lang-switcher');
        if (existingSwitcher) {
            existingSwitcher.remove();
        }
    } else {
        // ヘッダー内のボタンが存在しない場合は、固定位置のスイッチャーを追加
        const switcher = createLanguageSwitcher();
        document.body.appendChild(switcher);
    }
    
    // Apply current language
    switchLanguage(currentLang);
}

// Get translation function (拡張版：外部翻訳システム対応)
function getTranslation(key, lang = currentLang) {
    // 外部翻訳システムが利用可能な場合は優先
    if (window.externalTranslationLoader && window.externalTranslationLoader.isAvailable()) {
        const externalTranslation = window.externalTranslationLoader.getTranslation(key, lang);
        if (externalTranslation !== key) {
            return externalTranslation;
        }
    }
    
    // フォールバック: 既存の埋め込み翻訳
    return translations[lang][key] || key;
}

// Export functions for use in other scripts
window.initLanguage = initLanguage;
window.switchLanguage = switchLanguage;
window.currentLang = currentLang;
window.translations = translations;
window.getTranslation = getTranslation; 