// DeepSeek API Key 配置脚本
// 在浏览器控制台中运行此脚本

// 您的 DeepSeek API Key
const DEEPSEEK_API_KEY = 'sk-3ae5d07978a54d369b8e9fb9bc944e78';

// 保存到 localStorage
localStorage.setItem('deepseek_api_key', DEEPSEEK_API_KEY);

console.log('✅ DeepSeek API Key 配置成功！');
console.log('📍 请刷新页面以启用 AI 功能');
console.log('🔗 访问：http://localhost:4200/business/ai-operations-assistant');

// 验证配置
const savedKey = localStorage.getItem('deepseek_api_key');
if (savedKey === DEEPSEEK_API_KEY) {
    console.log('✅ 验证成功：API Key 已正确保存');
} else {
    console.log('❌ 验证失败：请重新运行脚本');
}

