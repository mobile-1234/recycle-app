export const environment = {
  production: true,
  deepseek: {
    // DeepSeek API 配置（生产环境）
    // 生产环境建议通过后端代理 API 调用，而不是直接在前端使用 API Key
    apiKey: '', // 留空，由用户在界面中配置
    baseURL: 'https://api.deepseek.com',
    model: 'deepseek-chat'
  }
};

