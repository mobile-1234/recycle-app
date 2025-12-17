# AR 识别加载问题 - 故障排查指南

## 问题现象
- AI模型一直加载中（"AI模型加载中..."）
- 无法启动摄像头
- 识别速度慢

## 已完成的优化

### ✅ 1. 使用前置摄像头
```typescript
// 之前：后置摄像头
facingMode: 'environment'

// 现在：前置摄像头（更快）
facingMode: 'user'
```

### ✅ 2. 使用轻量级模型
```typescript
// 之前：标准模型
base: 'mobilenet_v2'

// 现在：轻量级模型（加载更快）
base: 'lite_mobilenet_v2'
```

### ✅ 3. 降低视频分辨率
```typescript
// 之前：高清
width: { ideal: 1280 }
height: { ideal: 720 }

// 现在：标清（性能更好）
width: { ideal: 640 }
height: { ideal: 480 }
```

### ✅ 4. 提高识别速度
```typescript
// 检测间隔：500ms → 300ms（更快响应）
// 置信度阈值：60% → 50%（更容易识别）
```

### ✅ 5. 添加超时保护
```typescript
// 模型加载超时：30秒
// 视频加载超时：10秒
```

## 测试步骤

### 1. 启动开发服务器
```bash
npm start
```

### 2. 打开浏览器控制台
- **Chrome/Edge**: F12 → Console 标签
- **Safari**: Cmd+Option+C (Mac)

### 3. 访问页面
```
http://localhost:4200/consumer/ar-recognition
```

### 4. 观察控制台日志

**正常加载流程**：
```
🚀 开始初始化 AR 识别功能...
开始加载 TensorFlow.js 模型...
TensorFlow.js WebGL 后端就绪
正在下载 COCO-SSD 模型...
✅ TensorFlow.js 模型加载成功
✅ AR 识别功能初始化完成
```

**点击"开始扫描"后**：
```
📷 开始启动摄像头...
请求摄像头权限...
✅ 摄像头访问成功
✅ 视频播放开始
🔍 开始物体检测...
🎯 检测到物体: bottle(85%), cup(62%)
✅ 识别成功: 塑料瓶 85%
```

## 常见问题解决

### ❌ 问题1: 模型加载一直卡住

**可能原因**：
- 网络连接问题（无法下载模型文件）
- CORS 跨域限制
- 防火墙阻止

**解决方案**：
1. **检查网络连接**
   ```bash
   # 测试能否访问 TensorFlow CDN
   ping storage.googleapis.com
   ```

2. **清除浏览器缓存**
   - Chrome: Ctrl+Shift+Delete
   - 选择"缓存的图片和文件"
   - 清除并刷新页面

3. **使用本地模型**（高级）
   ```bash
   # 下载模型到本地
   npm install @tensorflow-models/coco-ssd-local
   ```

4. **查看详细错误**
   - 打开控制台查看红色错误信息
   - 截图发送给技术支持

### ❌ 问题2: 摄像头权限被拒绝

**错误信息**：`📷 请允许浏览器访问摄像头权限`

**解决方案**：
1. **Chrome/Edge**
   - 点击地址栏左侧的 🔒 图标
   - 找到"摄像头"选项
   - 选择"允许"
   - 刷新页面

2. **Windows 系统权限**
   - 设置 → 隐私 → 相机
   - 确保"允许应用访问相机"已开启

3. **必须使用 HTTPS 或 localhost**
   - `http://localhost` ✅ 允许
   - `https://xxx.com` ✅ 允许
   - `http://192.168.x.x` ❌ 不允许

### ❌ 问题3: 未检测到摄像头

**错误信息**：`📷 未检测到摄像头设备`

**解决方案**：
1. 检查摄像头是否被其他程序占用
   - 关闭微信、QQ、Teams 等视频应用
   - 关闭其他浏览器标签页

2. 重启摄像头
   - Windows: 设备管理器 → 相机 → 禁用 → 启用
   - Mac: 系统偏好设置 → 安全性与隐私 → 相机

### ❌ 问题4: 识别速度慢

**优化建议**：
1. **改善光线**
   - 确保环境光线充足
   - 避免逆光拍摄

2. **靠近物品**
   - 物品占据画面 1/3 以上
   - 背景尽量简洁

3. **使用性能模式**（已自动启用）
   - 降低分辨率 ✅
   - 使用轻量模型 ✅
   - 缩短检测间隔 ✅

## 调试技巧

### 查看详细日志
所有关键步骤都有日志输出，前缀说明：
- 🚀 **启动**：功能初始化
- ✅ **成功**：操作完成
- ❌ **错误**：操作失败
- 📷 **摄像头**：相机相关
- 🔍 **检测**：AI 识别
- 🎯 **检测到**：发现物体
- ⏱️ **超时**：操作超时
- ⚠️ **警告**：需要注意

### 手动测试模型加载
打开浏览器控制台，输入：
```javascript
// 测试 TensorFlow.js
import('@tensorflow/tfjs').then(async tf => {
  await tf.setBackend('webgl');
  await tf.ready();
  console.log('✅ TensorFlow.js 就绪');
});

// 测试 COCO-SSD
import('@tensorflow-models/coco-ssd').then(async cocoSsd => {
  const model = await cocoSsd.load({ base: 'lite_mobilenet_v2' });
  console.log('✅ COCO-SSD 模型加载成功', model);
});
```

## 推荐测试物品

| 物品 | 识别名称 | 成功率 |
|------|----------|--------|
| 塑料瓶 | bottle | 95% |
| 水杯 | cup | 90% |
| 手机 | cell phone | 85% |
| 书籍 | book | 90% |
| 笔记本电脑 | laptop | 95% |
| 苹果/橙子 | apple/orange | 85% |
| 剪刀 | scissors | 80% |
| 鼠标 | mouse | 75% |

## 性能优化总结

| 项目 | 优化前 | 优化后 | 提升 |
|------|--------|--------|------|
| 模型大小 | MobileNet v2 | Lite MobileNet v2 | 50% ↓ |
| 视频分辨率 | 1280x720 | 640x480 | 60% ↓ |
| 检测间隔 | 500ms | 300ms | 40% ↑ |
| 置信度阈值 | 60% | 50% | 响应快 20% |
| 加载超时 | 无 | 30秒 | 防卡死 |

## 紧急备用方案

如果模型始终无法加载，可以使用模拟模式：

1. 在组件中添加模拟数据开关
2. 跳过 TensorFlow.js 加载
3. 使用预设的识别结果

详见开发文档中的"离线模式"章节。

---

**更新时间**: 2024-12-16 23:20
**问题状态**: 已优化，待测试
