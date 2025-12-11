# 🚀 启用 DeepSeek AI 使用指南

## ✅ 您的 API Key 已准备好

```
sk-3ae5d07978a54d369b8e9fb9bc944e78
```

---

## 🎯 方法一：浏览器控制台配置（推荐 - 最快）

### 步骤：

1. **启动应用**
   ```bash
   ng serve
   ```

2. **打开 AI 助手页面**
   
   浏览器访问：`http://localhost:4200/business/ai-operations-assistant`

3. **打开浏览器开发者工具**
   - 按 `F12` 键
   - 或右键 → "检查"

4. **切换到 Console（控制台）标签**

5. **复制并粘贴以下代码，按回车执行**

   ```javascript
   localStorage.setItem('deepseek_api_key', 'sk-3ae5d07978a54d369b8e9fb9bc944e78');
   console.log('✅ DeepSeek API Key 配置成功！');
   location.reload();
   ```

6. **页面自动刷新后，即可使用真实的 AI 对话！**

---

## 🎯 方法二：使用界面配置

1. **启动应用并访问页面**
   ```
   http://localhost:4200/business/ai-operations-assistant
   ```

2. **点击右上角的 🔑 按钮**

3. **在弹出的对话框中输入**
   ```
   sk-3ae5d07978a54d369b8e9fb9bc944e78
   ```

4. **点击确定，开始使用！**

---

## ✅ 验证是否配置成功

配置成功后，您会看到：

**欢迎消息变化**：
```
✅ 正确：您好！我是您的AI运营助手，由 DeepSeek AI 驱动。

❌ 未配置：您好！我是您的AI运营助手。⚠️ 当前为演示模式
```

**AI 回复特征**：
- 回复内容智能、连贯
- 能理解上下文
- 没有 "(演示模式)" 标记

---

## 💬 测试 AI 对话

### 快捷问题（点击卡片）
- 📊 本月哪个品类利润最高？
- 📈 预测下周的回收量
- ⚙️ 分析3号设备的运行效率
- 💰 查看本月收入趋势

### 自定义问题（输入框）
试试这些：
- "分析一下我们公司的运营状况"
- "如何提高回收效率？"
- "有哪些适合我们的补贴政策？"
- "帮我制定下周的工作计划"

---

## 🔍 检查配置状态

在浏览器控制台执行：

```javascript
// 查看当前配置的 API Key
console.log('当前 API Key:', localStorage.getItem('deepseek_api_key'));

// 清除配置（如需重新配置）
// localStorage.removeItem('deepseek_api_key');
```

---

## 🎨 效果对比

### 演示模式（未配置）
```
用户：本月哪个品类利润最高？
AI：📊 本月品类利润分析 (演示模式)
    根据数据分析，纸类回收利润最高...
    [固定的模拟数据]
```

### AI 模式（已配置）✨
```
用户：本月哪个品类利润最高？
AI：📊 根据您提供的问题，我来帮您分析本月的品类利润情况...
    [DeepSeek AI 生成的智能回复]
    [理解上下文，提供专业建议]
```

---

## 🐛 常见问题

### 问题 1：配置后还是显示演示模式

**解决方案**：
1. 检查 API Key 是否正确保存
   ```javascript
   console.log(localStorage.getItem('deepseek_api_key'));
   ```
2. 刷新页面（Ctrl + F5 强制刷新）
3. 清除浏览器缓存后重试

### 问题 2：显示 "API Key 无效"

**可能原因**：
- API Key 输入错误
- API Key 已过期
- 网络连接问题

**解决方案**：
1. 确认 API Key 完整且正确
2. 访问 DeepSeek 平台检查 Key 状态
3. 检查网络连接

### 问题 3：回复很慢或超时

**解决方案**：
1. 检查网络连接
2. 确认 DeepSeek API 服务正常
3. 稍后重试

---

## 🎯 快速启动命令

**一键配置脚本**（在项目根目录新建文件 `config-api.html`）：

```html
<!DOCTYPE html>
<html>
<head>
    <title>配置 DeepSeek API</title>
</head>
<body>
    <h1>DeepSeek API 配置</h1>
    <button onclick="configAPI()">一键配置 API Key</button>
    <script>
        function configAPI() {
            localStorage.setItem('deepseek_api_key', 'sk-3ae5d07978a54d369b8e9fb9bc944e78');
            alert('✅ 配置成功！请访问 AI 助手页面');
            window.location.href = 'http://localhost:4200/business/ai-operations-assistant';
        }
    </script>
</body>
</html>
```

---

## 📊 API 使用说明

### 额度查询
访问 DeepSeek 控制台查看使用情况：
https://platform.deepseek.com/usage

### 计费说明
- DeepSeek 按 token 计费
- 价格相对便宜
- 建议合理使用，避免过度调用

---

## 🎉 开始使用！

现在一切都准备好了，执行以下步骤即可开始：

1. ✅ 启动应用：`ng serve`
2. ✅ 打开页面
3. ✅ 打开控制台（F12）
4. ✅ 执行配置命令
5. ✅ 刷新页面
6. ✅ 开始 AI 对话！

---

**配置时间**：< 1 分钟  
**难度**：⭐（非常简单）  
**状态**：✅ 已准备就绪

享受智能 AI 助手带来的便利吧！🚀

