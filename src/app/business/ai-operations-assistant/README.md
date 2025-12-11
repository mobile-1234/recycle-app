# 🤖 AI运营助手模块

## 📍 访问路径

```
http://localhost:4200/business/ai-operations-assistant
```

或

```
http://localhost:4200/business/ai-assistant
```

## ✨ 功能特性

### 1. 智能对话模块 💬
- **DeepSeek AI 集成**：真实的 AI 对话能力，由 DeepSeek API 驱动
- **快捷问题卡片**：6个预设问题，一键提问
- **文字输入**：支持自由输入问题
- **语音输入**：点击麦克风按钮，3秒录音后自动转文字
- **文件上传**：支持PDF、Word、Excel、图片等多种格式
- **AI智能回复**：使用 DeepSeek Chat 模型提供专业回答
- **建议按钮**：AI回复后显示相关操作建议
- **演示模式**：未配置 API Key 时自动切换到演示模式

### 2. 智能洞察模块 💡
- **价格波动预警**：实时监控市场价格变化
- **设备维护提醒**：预测性维护建议
- **运营效率优化**：智能分析并提供优化方案
- **一键跳转**：直接跳转到相关业务页面

### 3. 政策推荐模块 🎁
- **政策匹配**：根据企业情况推荐适合的补贴政策
- **详细信息**：补贴金额、申请截止、申请条件
- **在线申请**：一键准备申请材料
- **状态跟踪**：显示申请状态（可申请/已申请/已过期）

## 🎯 支持的问题类型

### 数据分析
- "本月哪个品类利润最高？"
- "查看本月收入趋势"

### 趋势预测
- "预测下周的回收量"

### 设备监控
- "分析3号设备的运行效率"

### 预警管理
- "显示所有未处理预警"

### 人员管理
- "优化人员调度建议"

### 订单分配
- "将XX小区所有订单分配给张三"

### 政策咨询
- "查询可申请的补贴政策"

## 🎨 设计特点

- **绿色渐变主题**：环保色调，符合回收行业特性
- **流畅动画**：消息滑入、按钮悬浮、录音脉冲等
- **响应式布局**：适配桌面端和移动端
- **高级感UI**：卡片阴影、渐变背景、圆角设计
- **清晰的信息层级**：模块分明，操作直观

## 🚀 使用流程

### 场景1：数据分析
1. 进入AI助手页面
2. 点击"本月哪个品类利润最高？"
3. 查看AI分析结果
4. 点击"查看详细报表"查看更多

### 场景2：设备监控
1. 切换到"智能洞察"标签
2. 查看设备维护提醒
3. 点击"查看详情"跳转到设备管理

### 场景3：政策申请
1. 切换到"政策推荐"标签
2. 浏览可申请的补贴政策
3. 点击"查看详情"了解申请流程
4. 点击"立即申请"开始申请

### 场景4：语音+文件
1. 点击🎤录音按钮
2. 系统录音3秒
3. 自动转换为文字
4. 点击📎上传相关文件
5. 发送消息给AI分析

## 🔑 配置 DeepSeek API Key

### 方式一：通过界面配置（推荐）

1. 打开 AI 运营助手页面
2. 点击右上角的 🔑 按钮
3. 输入您的 DeepSeek API Key
4. 配置成功后即可使用真实的 AI 分析功能

### 方式二：通过浏览器控制台

```javascript
localStorage.setItem('deepseek_api_key', 'sk-your-api-key-here');
```

然后刷新页面即可。

### 获取 API Key

1. 访问 [DeepSeek 开放平台](https://platform.deepseek.com/)
2. 注册/登录账号
3. 在 API Keys 页面创建新的 API Key
4. 复制 API Key 并在应用中配置

## 💡 技术实现

- **Angular 20+** 独立组件
- **TypeScript** 类型安全
- **OpenAI SDK** DeepSeek API 调用
- **DeepSeek Chat** AI 模型
- **SCSS** 模块化样式
- **响应式设计** 移动端适配
- **动画效果** CSS3动画
- **对话历史管理** 保持上下文连续性

## 📝 注意事项

### 安全性
1. **API Key 存储**：当前存储在浏览器 localStorage 中，仅用于开发测试
2. **生产环境建议**：通过后端代理 API 调用，避免暴露 API Key
3. **不要提交 API Key**：不要将 API Key 提交到版本控制系统

### 功能说明
1. **双模式运行**：
   - 配置 API Key：使用真实的 DeepSeek AI
   - 未配置：自动切换到演示模式（模拟数据）
2. **对话历史**：自动维护对话上下文，提供连贯的 AI 回复
3. **错误处理**：自动处理 API 调用失败、配额超限等情况
4. **语音功能**：3秒后自动停止，实际需集成语音识别API
5. **文件上传**：仅前端处理，需后端API支持

## 🔧 开发指南

### API 服务位置
```
src/app/core/services/deepseek-ai.ts
```

### 主要方法

- `sendMessage(userMessage: string)`: 发送消息到 DeepSeek AI
- `sendMessageStream(userMessage: string)`: 流式发送（实时显示）
- `setApiKey(apiKey: string)`: 设置 API Key
- `clearHistory()`: 清空对话历史
- `isConfigured()`: 检查是否已配置

### 调用示例

```typescript
// 注入服务
constructor(private deepseekService: DeepSeekAIService) {}

// 发送消息
const response = await this.deepseekService.sendMessage('分析本月利润');

// 流式响应
for await (const chunk of this.deepseekService.sendMessageStream('预测回收量')) {
  console.log(chunk); // 实时显示每个字符
}
```

## 🔗 相关页面

- Dashboard: `/business/dashboard`
- 数据报表: `/business/data-reports`
- 设备管理: `/business/device-management`
- 订单管理: `/business/order-management`

---

**开发时间**: 2025-10-16  
**更新时间**: 2025-10-27  
**版本**: v2.0.0  
**状态**: ✅ DeepSeek AI 集成完成

## 🆕 v2.0.0 更新日志

### 新增功能
- ✅ 集成 DeepSeek AI API
- ✅ 真实的 AI 对话能力
- ✅ 对话历史管理
- ✅ API Key 配置界面
- ✅ 双模式运行（AI 模式 / 演示模式）
- ✅ 错误处理和重试机制

### 技术改进
- ✅ 安装 OpenAI SDK
- ✅ 创建 DeepSeek AI 服务
- ✅ 优化组件架构
- ✅ 添加环境配置支持

### 安全性
- ⚠️ API Key 存储在 localStorage（仅供开发）
- 💡 生产环境建议使用后端代理

