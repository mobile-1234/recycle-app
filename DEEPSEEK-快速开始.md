# DeepSeek AI 快速开始指南 🚀

## ⚡ 5分钟快速集成

### 步骤 1️⃣: 获取 API Key

1. 访问 **[DeepSeek 开放平台](https://platform.deepseek.com/)**
2. 注册/登录账号
3. 进入 **API Keys** 页面
4. 点击 **Create API Key**
5. 复制生成的 API Key（格式：`sk-xxxxxxxx...`）

### 步骤 2️⃣: 启动应用

```bash
# 进入项目目录
cd recycle-app

# 启动开发服务器
ng serve

# 或者
npm start
```

### 步骤 3️⃣: 配置 API Key

打开浏览器访问：`http://localhost:4200/business/ai-operations-assistant`

**方式一：界面配置**
1. 点击右上角的 🔑 按钮
2. 输入您的 DeepSeek API Key
3. 点击确定

**方式二：控制台配置**
```javascript
localStorage.setItem('deepseek_api_key', 'sk-your-api-key-here');
```
然后刷新页面

### 步骤 4️⃣: 开始使用

✅ 配置成功后，您将看到：
```
您好！我是您的AI运营助手，由 DeepSeek AI 驱动。
```

❌ 如果未配置，将显示：
```
您好！我是您的AI运营助手。⚠️ 当前为演示模式
```

## 💬 测试对话

### 快捷问题（一键测试）

点击以下任一快捷问题卡片：
- 📊 本月哪个品类利润最高？
- 📈 预测下周的回收量
- ⚙️ 分析3号设备的运行效率
- 💰 查看本月收入趋势
- 🚨 显示所有未处理预警
- 👥 优化人员调度建议

### 自定义问题

在输入框中输入任何问题，例如：
- "分析一下本月的运营数据"
- "如何提高回收效率？"
- "有哪些适合我们的补贴政策？"
- "帮我优化下周的工作计划"

## 🎯 功能演示

### 1. 智能对话
```
用户: 本月哪个品类利润最高？
AI: 根据数据分析，纸类回收利润最高...
    • 纸类：¥45,820（占比38%）↑12%
    • 塑料：¥32,150（占比28%）↑8%
    ...
```

### 2. 智能洞察
切换到 **💡 智能洞察** 标签：
- 价格波动预警
- 设备维护提醒  
- 运营效率优化建议

### 3. 政策推荐
切换到 **🎁 政策推荐** 标签：
- 再生视界企业补贴
- 智能化改造专项资金
- 一键查看详情和申请

## 🔍 验证集成是否成功

### ✅ 成功标志
- 欢迎消息包含 "DeepSeek AI 驱动"
- AI 回复内容智能、连贯、专业
- 能够理解上下文，进行多轮对话
- 回复速度正常（通常 2-5 秒）

### ❌ 演示模式标志
- 欢迎消息包含 "演示模式"
- 回复内容带有 "(演示模式)" 标记
- 回复为预设的固定内容
- 无法理解复杂或自定义问题

## 🐛 常见问题

### 问题 1: "请先配置 DeepSeek API Key"

**原因**: 未配置 API Key  
**解决**: 点击右上角 🔑 按钮配置

### 问题 2: "API Key 无效，请检查配置"

**原因**: API Key 格式错误或已失效  
**解决**: 
1. 检查 API Key 是否完整复制
2. 到 DeepSeek 平台重新生成
3. 确认 API Key 状态是否正常

### 问题 3: "请求过于频繁，请稍后再试"

**原因**: 触发了 API 速率限制  
**解决**: 等待几分钟后重试

### 问题 4: AI 回复速度很慢

**原因**: 网络延迟或 API 服务繁忙  
**解决**: 
1. 检查网络连接
2. 稍后重试
3. 考虑使用 VPN（如果在国内）

### 问题 5: 回复内容不准确

**原因**: 系统提示词需要优化  
**解决**: 编辑 `src/app/core/services/deepseek-ai.ts` 中的 `systemPrompt`

## 💡 高级使用

### 自定义系统提示词

编辑 `src/app/core/services/deepseek-ai.ts`:

```typescript
private systemPrompt = `你是一个专业的回收行业AI运营助手...`;
```

### 调整 AI 参数

在服务中修改 API 调用参数：

```typescript
const completion = await this.openai.chat.completions.create({
  messages: this.conversationHistory,
  model: 'deepseek-chat',
  temperature: 0.7,    // 创造性 (0-1)
  max_tokens: 2000,    // 最大回复长度
  stream: false
});
```

### 在其他组件中使用

```typescript
import { DeepSeekAIService } from '@core/services/deepseek-ai';

export class YourComponent {
  constructor(private ai: DeepSeekAIService) {}
  
  async askAI() {
    const response = await this.ai.sendMessage('你的问题');
    console.log(response);
  }
}
```

## 📊 API 额度说明

DeepSeek 提供：
- **免费额度**: 新用户注册赠送一定额度
- **按需付费**: 超出免费额度后按调用量计费
- **价格低廉**: 比 GPT 便宜很多

查看余额：[DeepSeek 控制台](https://platform.deepseek.com/usage)

## 🎓 学习资源

- [DeepSeek API 文档](https://platform.deepseek.com/docs)
- [AI 运营助手完整文档](src/app/business/ai-operations-assistant/README.md)
- [集成说明文档](DEEPSEEK-API-集成说明.md)

## 🎉 开始使用吧！

现在您已经准备好了，开始体验 AI 驱动的智能运营助手吧！

有任何问题？查看[完整集成文档](DEEPSEEK-API-集成说明.md)

---

**最后更新**: 2025-10-27  
**难度**: ⭐⭐ (简单)  
**预计时间**: 5 分钟

