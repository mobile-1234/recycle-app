# 下载 COCO-SSD 模型文件

## 方法1: 使用代理下载（推荐）

开启 VPN 后访问以下链接下载模型文件：

### lite_mobilenet_v2 模型（推荐，最小）
```
https://storage.googleapis.com/tfjs-models/savedmodel/ssdlite_mobilenet_v2/model.json
https://storage.googleapis.com/tfjs-models/savedmodel/ssdlite_mobilenet_v2/group1-shard1of5.bin
https://storage.googleapis.com/tfjs-models/savedmodel/ssdlite_mobilenet_v2/group1-shard2of5.bin
https://storage.googleapis.com/tfjs-models/savedmodel/ssdlite_mobilenet_v2/group1-shard3of5.bin
https://storage.googleapis.com/tfjs-models/savedmodel/ssdlite_mobilenet_v2/group1-shard4of5.bin
https://storage.googleapis.com/tfjs-models/savedmodel/ssdlite_mobilenet_v2/group1-shard5of5.bin
```

下载后放到: `src/assets/models/coco-ssd/` 目录

## 方法2: 使用 GitHub 镜像

模型镜像仓库（可直接访问）:
https://github.com/nicholaslaw/tfjs-models-mirror

## 方法3: 使用百度网盘

如有需要，可提供百度网盘下载链接

---

下载完成后，修改 ar-scanner.service.ts 中的模型路径为本地路径。
