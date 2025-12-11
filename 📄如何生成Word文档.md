# 📄 如何将 Markdown 转换为 Word 文档

## 方法一：使用 Pandoc（推荐）

### 1. 安装 Pandoc

**Windows**:
```bash
# 使用 Chocolatey
choco install pandoc

# 或下载安装包
# https://pandoc.org/installing.html
```

**Mac**:
```bash
brew install pandoc
```

**Linux**:
```bash
sudo apt-get install pandoc
```

### 2. 转换为 Word 文档

```bash
# 基础转换
pandoc "再生视界-智慧回收平台产品说明书.md" -o "再生视界-智慧回收平台产品说明书.docx"

# 高级转换（带目录、样式）
pandoc "再生视界-智慧回收平台产品说明书.md" \
  -o "再生视界-智慧回收平台产品说明书.docx" \
  --toc \
  --toc-depth=3 \
  --number-sections \
  --highlight-style=tango
```

### 3. 使用自定义模板

```bash
# 创建参考文档
pandoc "再生视界-智慧回收平台产品说明书.md" \
  -o "再生视界-智慧回收平台产品说明书.docx" \
  --reference-doc=custom-template.docx
```

---

## 方法二：使用在线工具

### 1. CloudConvert
- 网址：https://cloudconvert.com/md-to-docx
- 步骤：
  1. 上传 Markdown 文件
  2. 选择输出格式为 DOCX
  3. 点击转换
  4. 下载生成的 Word 文档

### 2. Markdown to Word
- 网址：https://www.markdowntoword.com/
- 步骤：
  1. 复制 Markdown 内容
  2. 粘贴到输入框
  3. 点击转换
  4. 下载 Word 文档

---

## 方法三：直接复制到 Word

### 步骤：

1. **打开 Markdown 文件**
   - 使用 VS Code 或任意文本编辑器
   - 打开 `再生视界-智慧回收平台产品说明书.md`

2. **预览 Markdown**
   - VS Code: 按 `Ctrl/Cmd + Shift + V`
   - 或右键选择"打开预览"

3. **复制内容**
   - 选中所有内容 `Ctrl/Cmd + A`
   - 复制 `Ctrl/Cmd + C`

4. **粘贴到 Word**
   - 打开 Microsoft Word
   - 新建文档
   - 粘贴 `Ctrl/Cmd + V`

5. **调整格式**
   - 设置标题样式（标题1、标题2等）
   - 调整字体和间距
   - 添加页码
   - 生成目录

---

## 方法四：使用 VS Code 插件

### 1. 安装插件

在 VS Code 中搜索并安装：
- **Markdown PDF**
- **Markdown All in One**

### 2. 导出为 Word

1. 打开 Markdown 文件
2. 按 `Ctrl/Cmd + Shift + P`
3. 输入 "Markdown: Export (docx)"
4. 选择保存位置

---

## 添加图片

### 占位符说明

文档中的图片占位符格式：
```
[图1-1: 用户端首页]
```

### 替换步骤：

1. **截取页面截图**
   ```bash
   # 启动应用
   ng serve
   
   # 访问各个页面截图
   ```

2. **保存图片**
   - 建议格式：PNG 或 JPG
   - 建议尺寸：1200px 宽度
   - 文件命名：`图1-1-用户端首页.png`

3. **插入图片到 Word**
   - 找到占位符位置
   - 插入 → 图片
   - 选择对应的截图
   - 调整大小和位置

---

## 美化建议

### 1. 封面设计

```
┌───────────────────────────┐
│                           │
│   再生视界                │
│   智慧回收平台            │
│                           │
│   产品说明书              │
│                           │
│   版本：v1.0.0            │
│   日期：2025-10-27        │
│                           │
└───────────────────────────┘
```

### 2. 页眉页脚

- **页眉**：再生视界 - 产品说明书
- **页脚**：页码 + 版权信息

### 3. 样式设置

| 元素 | 样式 |
|------|------|
| 标题1 | 黑体 18pt |
| 标题2 | 黑体 16pt |
| 标题3 | 黑体 14pt |
| 正文 | 宋体 12pt |
| 代码 | Consolas 10pt |
| 行距 | 1.5倍 |

### 4. 颜色方案

- **主色**：#2D8CF0（蓝色）
- **辅助色**：#19BE6B（绿色）
- **警告色**：#FF9900（橙色）
- **文本色**：#333333（深灰）

---

## 推荐工具组合

### 方案一：专业版

```
Pandoc + 自定义模板 + 手动美化
```

**优点**：
- ✅ 格式完整
- ✅ 样式统一
- ✅ 专业美观

**适合**：正式发布、对外展示

### 方案二：快速版

```
在线工具 + Word 简单调整
```

**优点**：
- ✅ 快速方便
- ✅ 无需安装
- ✅ 基本满足需求

**适合**：内部使用、快速预览

---

## 完整流程示例

### 使用 Pandoc 生成专业文档

```bash
# 1. 转换为 Word
pandoc "再生视界-智慧回收平台产品说明书.md" \
  -o "再生视界-智慧回收平台产品说明书.docx" \
  --toc \
  --toc-depth=3 \
  --number-sections

# 2. 打开 Word 文档
start "再生视界-智慧回收平台产品说明书.docx"  # Windows
open "再生视界-智慧回收平台产品说明书.docx"   # Mac

# 3. 手动调整
# - 添加封面
# - 插入图片
# - 调整样式
# - 设置页眉页脚
# - 生成目录

# 4. 保存为 PDF（可选）
# 文件 → 另存为 → PDF
```

---

## 常见问题

### Q1: 转换后格式混乱怎么办？

**A**: 使用 Pandoc 的参考文档功能：
```bash
# 先生成默认样式
pandoc --print-default-data-file reference.docx > reference.docx

# 在 Word 中打开 reference.docx 并修改样式

# 使用修改后的模板
pandoc input.md -o output.docx --reference-doc=reference.docx
```

### Q2: 表格显示不正常？

**A**: 手动调整表格宽度：
- 选中表格 → 右键 → 自动调整 → 根据内容调整

### Q3: 代码块格式错误？

**A**: 使用语法高亮：
```bash
pandoc input.md -o output.docx --highlight-style=tango
```

---

## 最终检查清单

- [ ] 封面页美观
- [ ] 目录自动生成
- [ ] 标题层级正确
- [ ] 图片全部插入
- [ ] 表格格式正常
- [ ] 代码高亮清晰
- [ ] 页眉页脚设置
- [ ] 页码连续
- [ ] 无错别字
- [ ] PDF 版本导出

---

## 输出文件

完成后你应该有：

```
📁 产品文档/
  ├── 再生视界-智慧回收平台产品说明书.md    （源文件）
  ├── 再生视界-智慧回收平台产品说明书.docx  （Word版）
  ├── 再生视界-智慧回收平台产品说明书.pdf   （PDF版）
  └── screenshots/                          （截图文件夹）
      ├── 图1-1-用户端首页.png
      ├── 图1-2-预约回收页面.png
      ├── 图2-1-运营仪表板.png
      └── ...
```

---

**祝你顺利生成精美的产品说明文档！** 📄✨


