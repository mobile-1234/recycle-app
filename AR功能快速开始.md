# AR智能识别 - 快速开始

## 立即测试

### 1. 启动开发服务器

```bash
npm start
```

### 2. 访问AR识别页面

浏览器打开: `http://localhost:4200/consumer/ar-recognition`

**重要**: 摄像头访问需要 HTTPS 或 localhost

### 3. 使用流程

1. **等待模型加载** (首次约 3-5 秒)
2. **点击"开始扫描"按钮**
3. **允许摄像头权限**
4. **对准任意物品**:
   - 塑料瓶
   - 手机/电脑
   - 书籍/纸张
   - 水果
   - 餐具
   - 电子产品

5. **查看识别结果**:
   - 废品类别
   - 可获得积分
   - 回收建议

## 测试建议

### 推荐测试物品

| 物品 | 预期类别 | 积分 |
|------|----------|------|
| 塑料瓶 | 可回收垃圾 | 5 |
| 手机 | 可回收垃圾 | 50 |
| 笔记本电脑 | 可回收垃圾 | 100 |
| 苹果/橙子 | 厨余垃圾 | 2 |
| 书籍 | 可回收垃圾 | 3 |
| 剪刀 | 可回收垃圾 | 5 |

### 最佳识别效果

- ✅ 光线充足
- ✅ 物品清晰对焦
- ✅ 物品占据画面 1/3 以上
- ✅ 背景简洁

## 核心文件

```
src/app/
├── core/services/
│   └── ar-scanner.service.ts       # AI识别服务
└── consumer/home/ar-recognition/
    ├── ar-recognition.ts           # 组件逻辑
    ├── ar-recognition.html         # 界面模板
    └── ar-recognition.scss         # 样式
```

## 调整参数

### 识别灵敏度

`ar-recognition.ts:109`
```typescript
if (result && result.confidence > 60) { // 调整阈值 (0-100)
```

### 检测频率

`ar-recognition.ts:97`
```typescript
setInterval(async () => {
  // ...
}, 500); // 调整间隔 (毫秒)
```

### 视频质量

`ar-scanner.service.ts:54`
```typescript
video: {
  facingMode: 'environment',
  width: { ideal: 1280 },  // 分辨率
  height: { ideal: 720 }
}
```

## 故障排除

### 摄像头无法访问
```bash
# 确保使用 localhost 或 HTTPS
# 检查浏览器权限设置
```

### 模型加载失败
```bash
# 清除缓存重试
# 检查网络连接
```

### 识别不准确
```bash
# 改善光线条件
# 降低置信度阈值
# 靠近物品拍摄
```

## 生产部署

### GitHub Pages
```bash
npm run build
# 将 dist/ 推送到 gh-pages 分支
```

### Vercel (推荐)
```bash
npm install -g vercel
vercel
```

## 成本

- **开发**: $0
- **部署**: $0 (GitHub Pages/Vercel 免费层)
- **AI模型**: $0 (TensorFlow.js 本地运行)
- **总计**: **$0**

## 技术特点

✅ 完全离线运行 (模型下载后)
✅ 实时检测 (500ms 延迟)
✅ 30+ 种物品识别
✅ AR 检测框叠加
✅ 移动端优化
✅ PWA 支持

---

**快速链接**:
- 详细文档: `AR智能识别功能说明.md`
- 源码: `src/app/consumer/home/ar-recognition/`
- 服务: `src/app/core/services/ar-scanner.service.ts`
