# DeepSeek AI 集成说明

## 📋 概述

本项目已成功集成 DeepSeek AI API，为 AI 运营助手模块提供真实的智能对话能力。

## 🎯 集成范围

### 已集成的模块
- ✅ **AI 运营助手** (`/business/ai-operations-assistant`)
  - 智能对话
  - 数据分析
  - 趋势预测
  - 运营建议

## 📦 安装的依赖

```bash
npm install openai --legacy-peer-deps
npm install @wecom/jssdk --legacy-peer-deps
```

## 🔧 技术架构

### 1. DeepSeek AI 服务
**位置**: `src/app/core/services/deepseek-ai.ts`

**主要功能**:
- DeepSeek API 客户端初始化
- 消息发送和接收
- 对话历史管理
- API Key 配置管理
- 错误处理

**核心代码**:
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: apiKey,
  dangerouslyAllowBrowser: true
});

const completion = await openai.chat.completions.create({
  messages: conversationHistory,
  model: 'deepseek-chat',
  temperature: 0.7,
  max_tokens: 2000
});
```

### 2. AI 运营助手组件
**位置**: `src/app/business/ai-operations-assistant/ai-operations-assistant.ts`

**集成改动**:
- 导入 `DeepSeekAIService`
- 使用依赖注入获取服务实例
- 实现双模式运行（AI 模式 / 演示模式）
- 添加 API Key 配置界面

## 🔑 配置 API Key

### 方法一：通过界面配置（推荐）

1. 访问 AI 运营助手页面：`http://localhost:4200/business/ai-operations-assistant`
2. 点击右上角的 🔑 按钮
3. 在弹窗中输入您的 DeepSeek API Key
4. 配置成功后即可使用真实的 AI 功能

### 方法二：通过浏览器控制台

打开浏览器开发者工具，在控制台中执行：

```javascript
localStorage.setItem('deepseek_api_key', 'sk-your-api-key-here');
```

然后刷新页面。

### 方法三：通过环境变量（开发环境）

编辑 `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  deepseek: {
    apiKey: 'sk-your-api-key-here',  // 在这里填入您的 API Key
    baseURL: 'https://api.deepseek.com',
    model: 'deepseek-chat'
  }
};
```

**⚠️ 注意**: 不要将包含真实 API Key 的环境文件提交到版本控制系统！

## 🌐 获取 DeepSeek API Key

1. 访问 [DeepSeek 开放平台](https://platform.deepseek.com/)
2. 注册或登录账号
3. 进入 **API Keys** 管理页面
4. 点击 **Create API Key** 创建新的密钥
5. 复制 API Key（格式：`sk-xxxxxxxxxxxxxxxx`）
6. 在应用中配置该 Key

## 💡 使用说明

### 双模式运行

**AI 模式**（已配置 API Key）:
- 使用真实的 DeepSeek AI 进行对话
- 提供智能、专业的回答
- 保持对话上下文连续性
- 根据实际情况生成分析和建议

**演示模式**（未配置 API Key）:
- 使用预设的模拟数据
- 基于关键词匹配返回固定回复
- 不需要网络连接
- 适合功能演示和测试

### 系统提示词

AI 助手的角色定位：
```
你是一个专业的回收行业AI运营助手。你的职责是：
1. 帮助企业分析回收数据，提供数据洞察
2. 预测回收量趋势，优化运营策略
3. 监控设备运行状态，提供维护建议
4. 分析财务数据，提供收入优化建议
5. 推荐适合的政策补贴
6. 优化人员调度和路线规划
```

可在 `src/app/core/services/deepseek-ai.ts` 中自定义系统提示词。

## 🔒 安全性建议

### 开发环境
- ✅ 可以使用 localStorage 存储 API Key
- ✅ 可以直接在浏览器中调用 API（已设置 `dangerouslyAllowBrowser: true`）

### 生产环境（重要！）
- ❌ **不要**在前端存储 API Key
- ❌ **不要**直接在浏览器中调用 API
- ✅ **建议**创建后端 API 代理
- ✅ **建议**使用服务器端调用 DeepSeek API
- ✅ **建议**实施访问控制和速率限制

### 后端代理架构（推荐）

```
浏览器 → 你的后端 API → DeepSeek API
        ↑
     (携带用户 token，不暴露 API Key)
```

## 📊 API 调用示例

### 发送消息

```typescript
import { DeepSeekAIService } from './core/services/deepseek-ai';

// 在组件中注入服务
constructor(private deepseekService: DeepSeekAIService) {}

// 发送消息
async sendMessage() {
  try {
    const response = await this.deepseekService.sendMessage('分析本月利润数据');
    console.log('AI 回复:', response);
  } catch (error) {
    console.error('API 调用失败:', error);
  }
}
```

### 流式响应（实时显示）

```typescript
async sendMessageStream() {
  try {
    let fullResponse = '';
    for await (const chunk of this.deepseekService.sendMessageStream('预测下周回收量')) {
      fullResponse += chunk;
      console.log('实时输出:', chunk);
      // 可以实时更新界面显示
    }
  } catch (error) {
    console.error('流式 API 调用失败:', error);
  }
}
```

### 管理对话历史

```typescript
// 清空对话历史
this.deepseekService.clearHistory();

// 获取对话历史
const history = this.deepseekService.getHistory();
console.log('对话历史:', history);

// 设置自定义系统提示词
this.deepseekService.setSystemPrompt('你是一个专业的数据分析师...');
```

## 🐛 错误处理

服务已内置错误处理机制：

```typescript
try {
  const response = await this.deepseekService.sendMessage(userMessage);
} catch (error) {
  // 错误类型：
  // - "请先配置 DeepSeek API Key"
  // - "API Key 无效，请检查配置"
  // - "请求过于频繁，请稍后再试"
  // - "DeepSeek 服务暂时不可用"
  // - "AI 服务异常，请稍后再试"
}
```

## 📈 功能特性

### ✅ 已实现
- [x] DeepSeek API 集成
- [x] 对话历史管理
- [x] API Key 配置界面
- [x] 双模式运行
- [x] 错误处理机制
- [x] 系统提示词定制
- [x] 基础对话功能

### 🚀 可扩展功能
- [ ] 流式响应界面（实时打字效果）
- [ ] 对话历史持久化（保存到数据库）
- [ ] 多轮对话优化
- [ ] 上下文管理优化
- [ ] 语音输入集成
- [ ] 文件内容分析
- [ ] 函数调用（Function Calling）
- [ ] 后端 API 代理

## 🧪 测试

### 测试步骤

1. **启动开发服务器**
   ```bash
   ng serve
   ```

2. **访问 AI 助手页面**
   ```
   http://localhost:4200/business/ai-operations-assistant
   ```

3. **配置 API Key**
   - 点击右上角 🔑 按钮
   - 输入有效的 DeepSeek API Key

4. **测试对话**
   - 使用快捷问题或输入自定义问题
   - 观察 AI 回复质量
   - 检查对话上下文连续性

### 验证清单

- [ ] API Key 配置成功
- [ ] AI 能正常回复消息
- [ ] 对话历史正常维护
- [ ] 错误提示正确显示
- [ ] 演示模式正常切换
- [ ] 清空对话功能正常

## 📚 相关文档

- [DeepSeek API 文档](https://platform.deepseek.com/docs)
- [OpenAI SDK 文档](https://github.com/openai/openai-node)
- [AI 运营助手 README](src/app/business/ai-operations-assistant/README.md)

## 🤝 支持

如有问题，请：
1. 查看 [DeepSeek API 文档](https://platform.deepseek.com/docs)
2. 检查浏览器控制台错误信息
3. 确认 API Key 是否有效
4. 检查网络连接是否正常

---

**集成完成时间**: 2025-10-27  
**版本**: v2.0.0  
**状态**: ✅ 已完成并测试

