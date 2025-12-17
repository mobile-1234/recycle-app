# AR智能识别功能实现说明

## 功能概述

通过手机摄像头实时扫描废品垃圾，使用 TensorFlow.js + MobileNet 进行 AI 识别，显示废品类别、积分奖励和回收建议。

## 技术栈

- **前端框架**: Angular 20.3
- **AI模型**: TensorFlow.js + COCO-SSD (MobileNet v2)
- **相机访问**: WebRTC (getUserMedia API)
- **实时检测**: Canvas API 绘制检测框
- **部署**: GitHub Pages (前端) + Vercel (后端API可选)
- **总成本**: $0

## 已实现功能

### 1. 核心服务 (`ar-scanner.service.ts`)

**位置**: `src/app/core/services/ar-scanner.service.ts`

**功能**:
- ✅ TensorFlow.js 模型初始化和加载
- ✅ 摄像头权限请求和视频流管理
- ✅ 实时物体检测 (500ms 间隔)
- ✅ 废品分类映射 (30+ 种常见物品)
- ✅ 检测结果转换为回收信息

**支持的废品类别**:
- **可回收垃圾**: 塑料瓶、纸张、书籍、手机、电脑、键盘、鼠标、金属制品等
- **厨余垃圾**: 水果 (苹果、橙子、香蕉等)
- **其他垃圾**: 陶瓷、牙刷等

### 2. AR识别组件 (`ar-recognition.component.ts`)

**位置**: `src/app/consumer/home/ar-recognition/`

**核心功能**:
- ✅ 模型加载状态显示
- ✅ 实时摄像头预览
- ✅ Canvas 绘制检测框和标签
- ✅ 识别结果展示 (类别、置信度、积分、回收建议)
- ✅ 扫描历史记录 (localStorage 持久化)
- ✅ 错误处理和用户提示

### 3. 用户界面

**主要界面**:
1. **加载状态**: AI模型加载中的提示
2. **待机状态**: 摄像头预览和扫描框
3. **扫描中**: 实时视频流 + AR检测框 + 物品标签
4. **结果展示**: 废品信息、分类、积分、回收建议
5. **历史记录**: 最近扫描的物品列表

## 使用流程

### 用户操作流程

1. **进入页面**
   - 等待 AI 模型加载 (首次约 3-5 秒)
   - 显示加载进度和提示

2. **开始扫描**
   - 点击 "开始扫描" 按钮
   - 浏览器请求摄像头权限
   - 允许权限后显示实时视频流

3. **物品识别**
   - 将废品对准摄像头
   - AI 每 500ms 自动检测一次
   - 实时绘制检测框和物品名称
   - 置信度 > 60% 时自动停止并展示结果

4. **查看结果**
   - 废品名称和类别
   - 置信度百分比
   - 可获得的积分
   - 材质信息
   - 回收建议

5. **确认或重试**
   - 确认回收: 保存到历史记录，获得积分
   - 重新识别: 重新开始扫描

## 配置说明

### 1. 检测参数调整

在 `ar-recognition.ts` 中可调整:

```typescript
// 检测间隔 (毫秒)
this.detectionInterval = setInterval(async () => {
  // ...
}, 500); // 调整此值控制检测频率

// 置信度阈值
if (result && result.confidence > 60) { // 调整此值控制识别灵敏度
  // ...
}
```

### 2. 添加新的废品类别

在 `ar-scanner.service.ts` 的 `getWasteMapping()` 方法中添加:

```typescript
'item-name': {
  item: '物品名称',
  category: '可回收垃圾', // 可回收垃圾/有害垃圾/厨余垃圾/其他垃圾
  points: 10,
  tips: [
    '回收提示1',
    '回收提示2',
    '可获得 X 积分奖励'
  ],
  recyclingInfo: {
    material: '材质',
    recyclable: true,
    process: '处理方式'
  }
}
```

### 3. 摄像头配置

在 `ar-scanner.service.ts` 中调整视频质量:

```typescript
const constraints = {
  video: {
    facingMode: 'environment', // 后置摄像头
    width: { ideal: 1280 },    // 视频宽度
    height: { ideal: 720 }     // 视频高度
  },
  audio: false
};
```

## 依赖包

### 已安装的包

```json
{
  "@tensorflow/tfjs": "latest",
  "@tensorflow-models/coco-ssd": "latest",
  "@tensorflow/tfjs-backend-webgl": "latest"
}
```

### 安装命令

```bash
npm install @tensorflow/tfjs @tensorflow-models/coco-ssd @tensorflow/tfjs-backend-webgl --legacy-peer-deps
```

## 部署说明

### 本地测试

```bash
# 启动开发服务器
npm start

# 访问 (需要 HTTPS 或 localhost)
http://localhost:4200/consumer/ar-recognition
```

**注意**: 摄像头访问需要 HTTPS 或 localhost 环境

### 生产部署

#### GitHub Pages 部署

```bash
# 构建生产版本
npm run build

# 部署到 GitHub Pages
# 将 dist/ 目录内容推送到 gh-pages 分支
```

#### Vercel 部署

```bash
# 安装 Vercel CLI
npm install -g vercel

# 部署
vercel
```

**配置文件** (`vercel.json`):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist/recycle-app",
  "framework": "angular",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Permissions-Policy",
          "value": "camera=*"
        }
      ]
    }
  ]
}
```

## 性能优化

### 1. 模型加载优化

- 使用 `mobilenet_v2` 版本 (轻量级)
- 首次加载后缓存模型
- 使用 WebGL 后端加速

### 2. 检测性能

- 检测间隔 500ms (避免过于频繁)
- 自动停止检测当找到高置信度结果
- Canvas 重用避免频繁创建

### 3. 内存管理

- 组件销毁时释放资源
- 停止摄像头流
- 清理定时器

## 浏览器兼容性

| 浏览器 | 支持版本 | 说明 |
|--------|----------|------|
| Chrome | 90+ | ✅ 完全支持 |
| Safari | 14+ | ✅ 支持 (iOS 需 14.5+) |
| Firefox | 88+ | ✅ 支持 |
| Edge | 90+ | ✅ 支持 |

## 常见问题

### 1. 摄像头权限被拒绝

**解决方案**:
- 检查浏览器设置
- 确保使用 HTTPS 或 localhost
- 清除网站权限并重新授权

### 2. 模型加载失败

**解决方案**:
- 检查网络连接
- 清除浏览器缓存
- 确认 TensorFlow.js CDN 可访问

### 3. 检测不准确

**解决方案**:
- 确保光线充足
- 物品清晰对焦
- 调整置信度阈值
- 添加更多训练数据 (进阶)

### 4. 性能问题

**解决方案**:
- 降低视频分辨率
- 增加检测间隔
- 使用更轻量的模型

## 未来增强

### 短期计划

- [ ] 添加更多废品分类
- [ ] 支持批量识别
- [ ] 识别历史统计图表
- [ ] 分享识别结果

### 长期计划

- [ ] 自定义模型训练 (Google Colab)
- [ ] 迁移学习优化识别准确度
- [ ] AR 3D 效果展示
- [ ] 社区共享识别数据

## 技术支持

- **文档**: 查看项目 README.md
- **Issues**: GitHub Issues
- **讨论**: GitHub Discussions

## 开发者信息

- **开发框架**: Angular 20.3
- **AI 框架**: TensorFlow.js 4.x
- **模型**: COCO-SSD (MobileNet v2)
- **许可证**: MIT

---

**更新时间**: 2024-12-16
**版本**: v1.0.0
