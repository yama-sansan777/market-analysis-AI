const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testGeminiConnection() {
    console.log('🔍 Gemini API接続テストを開始...');
    console.log('==========================================');
    
    const apiKey = process.env.GEMINI_API_KEY;
    console.log(`📋 APIキー: ${apiKey ? apiKey.substring(0, 10) + '...' : '未設定'}`);
    
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        console.log('❌ APIキーが設定されていません');
        return;
    }
    
    try {
        console.log('🚀 GoogleGenerativeAI初期化中...');
        const genAI = new GoogleGenerativeAI(apiKey);
        
        console.log('🤖 モデル取得中...');
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        console.log('💬 簡単なプロンプトテスト中...');
        const prompt = "Hello, can you respond with just 'API connection successful'?";
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log('✅ Gemini API接続成功！');
        console.log('📄 レスポンス:', text);
        console.log('==========================================');
        
        return true;
        
    } catch (error) {
        console.log('❌ Gemini API接続エラー:');
        console.log('エラータイプ:', error.constructor.name);
        console.log('エラーメッセージ:', error.message);
        
        if (error.status) {
            console.log('HTTPステータス:', error.status);
        }
        
        if (error.details) {
            console.log('詳細情報:', JSON.stringify(error.details, null, 2));
        }
        
        console.log('==========================================');
        
        // 具体的な解決策を提示
        if (error.message.includes('API key not valid')) {
            console.log('🔧 解決策:');
            console.log('1. Google AI Studio (https://aistudio.google.com/) でAPIキーを確認');
            console.log('2. 新しいAPIキーを作成');
            console.log('3. APIキーがGemini 1.5 Flash用に有効化されているか確認');
            console.log('4. 地域制限がないか確認');
        }
        
        return false;
    }
}

// 直接実行時のテスト
if (require.main === module) {
    testGeminiConnection().then(success => {
        process.exit(success ? 0 : 1);
    });
}

module.exports = { testGeminiConnection };