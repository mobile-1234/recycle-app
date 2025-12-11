# 🌐 免费API对接实施指南

## 📋 必须对接的免费API清单

### 1. 高德地图 API ⭐⭐⭐⭐⭐

**申请地址**: https://lbs.amap.com/

**免费额度**: 
- 个人开发者: 每日配额30万次
- 企业开发者: 每日配额100万次（认证后）

**用途**:
- ✅ 订单地址定位
- ✅ 回收路线规划
- ✅ 回收员实时追踪
- ✅ 地理编码/逆编码
- ✅ 周边搜索

**实现代码**:
```typescript
// 安装: npm install @amap/amap-jsapi-loader
import AMapLoader from '@amap/amap-jsapi-loader';

export class MapService {
  private map: any;
  
  async initMap(containerId: string) {
    const AMap = await AMapLoader.load({
      key: 'YOUR_AMAP_KEY',              // 申请的Key
      version: '2.0',
      plugins: [
        'AMap.Geolocation',               // 定位
        'AMap.Driving',                   // 路线规划
        'AMap.Geocoder'                   // 地理编码
      ]
    });
    
    this.map = new AMap.Map(containerId, {
      zoom: 13,
      center: [116.397428, 39.90923]
    });
  }
  
  // 路线规划
  async planRoute(start: [number, number], end: [number, number]) {
    const driving = new AMap.Driving({
      policy: AMap.DrivingPolicy.LEAST_TIME  // 最快路线
    });
    
    return new Promise((resolve) => {
      driving.search(start, end, (status, result) => {
        if (status === 'complete') {
          resolve({
            distance: result.routes[0].distance,     // 距离(米)
            duration: result.routes[0].time,         // 时长(秒)
            path: result.routes[0].steps            // 路径点
          });
        }
      });
    });
  }
  
  // 实时定位
  async getCurrentLocation() {
    const geolocation = new AMap.Geolocation({
      enableHighAccuracy: true,
      timeout: 10000
    });
    
    return new Promise((resolve) => {
      geolocation.getCurrentPosition((status, result) => {
        if (status === 'complete') {
          resolve({
            latitude: result.position.lat,
            longitude: result.position.lng,
            accuracy: result.accuracy
          });
        }
      });
    });
  }
}
```

---

### 2. DeepSeek AI API ⭐⭐⭐⭐⭐

**申请地址**: https://platform.deepseek.com/

**免费额度**: 新用户有免费token额度

**定价**: 
- deepseek-chat: ¥1/百万tokens（输入）
- 非常便宜，适合中小企业

**用途**:
- ✅ AI智能对话
- ✅ 数据分析建议
- ✅ 运营优化建议
- ✅ 政策解读

**实现代码**:
```typescript
// 安装: npm install openai
import OpenAI from 'openai';

export class DeepSeekAIService {
  private client: OpenAI;
  private history: Array<{role: string, content: string}> = [];
  
  constructor() {
    const apiKey = localStorage.getItem('deepseek_api_key');
    if (apiKey) {
      this.client = new OpenAI({
        apiKey: apiKey,
        baseURL: 'https://api.deepseek.com',
        dangerouslyAllowBrowser: true      // 仅开发环境
      });
    }
  }
  
  setApiKey(apiKey: string) {
    this.client = new OpenAI({
      apiKey: apiKey,
      baseURL: 'https://api.deepseek.com',
      dangerouslyAllowBrowser: true
    });
    localStorage.setItem('deepseek_api_key', apiKey);
  }
  
  // 流式响应（实时显示）
  async *sendMessageStream(userMessage: string) {
    this.history.push({
      role: 'user',
      content: userMessage
    });
    
    const stream = await this.client.chat.completions.create({
      model: 'deepseek-chat',
      messages: this.history,
      stream: true,
      temperature: 0.7,
      max_tokens: 2000
    });
    
    let fullResponse = '';
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      fullResponse += content;
      yield content;  // 逐字输出
    }
    
    this.history.push({
      role: 'assistant',
      content: fullResponse
    });
  }
  
  // 普通响应
  async sendMessage(userMessage: string): Promise<string> {
    this.history.push({
      role: 'user',
      content: userMessage
    });
    
    const completion = await this.client.chat.completions.create({
      model: 'deepseek-chat',
      messages: this.history
    });
    
    const response = completion.choices[0].message.content;
    this.history.push({
      role: 'assistant',
      content: response
    });
    
    return response;
  }
  
  clearHistory() {
    this.history = [];
  }
}
```

**使用示例**:
```typescript
// 在组件中使用
const aiService = new DeepSeekAIService();

// 普通对话
const response = await aiService.sendMessage('本月哪个品类利润最高？');

// 流式对话（逐字显示）
for await (const chunk of aiService.sendMessageStream('预测下周回收量')) {
  this.displayText += chunk;  // 实时更新UI
}
```

---

### 3. 百度AI API ⭐⭐⭐⭐

**申请地址**: https://ai.baidu.com/

**免费额度**: 
- 语音识别: 50,000次/天
- OCR文字识别: 50,000次/天
- 图像识别: 50,000次/天

#### 3.1 语音识别

**用途**: 语音输入、语音指令

```typescript
// 安装: npm install baidu-aip-sdk
import AipSpeech from 'baidu-aip-sdk';

export class BaiduSpeechService {
  private client: AipSpeech;
  
  constructor() {
    this.client = new AipSpeech(
      'YOUR_APP_ID',
      'YOUR_API_KEY',
      'YOUR_SECRET_KEY'
    );
  }
  
  // 语音识别（短语音）
  async recognize(audioBuffer: ArrayBuffer): Promise<string> {
    const voice = Buffer.from(audioBuffer);
    const result = await this.client.recognize(voice, 'pcm', 16000);
    
    if (result.err_no === 0) {
      return result.result[0];  // 识别文字
    }
    throw new Error('识别失败');
  }
  
  // 语音合成（文字转语音）
  async synthesize(text: string): Promise<Buffer> {
    const result = await this.client.text2audio(text, {
      spd: 5,   // 语速
      pit: 5,   // 音调
      vol: 5,   // 音量
      per: 0    // 发音人
    });
    return result;
  }
}
```

#### 3.2 OCR文字识别

**用途**: 识别上传文件内容、证件识别

```typescript
import AipOcr from 'baidu-aip-sdk';

export class BaiduOCRService {
  private client: AipOcr;
  
  constructor() {
    this.client = new AipOcr(
      'YOUR_APP_ID',
      'YOUR_API_KEY',
      'YOUR_SECRET_KEY'
    );
  }
  
  // 通用文字识别
  async recognizeGeneral(imageBase64: string): Promise<string[]> {
    const result = await this.client.generalBasic(imageBase64);
    return result.words_result.map(item => item.words);
  }
  
  // 身份证识别
  async recognizeIdCard(imageBase64: string, side: 'front' | 'back') {
    const result = await this.client.idcard(imageBase64, side);
    return result;
  }
  
  // 营业执照识别
  async recognizeBusinessLicense(imageBase64: string) {
    const result = await this.client.businessLicense(imageBase64);
    return result.words_result;
  }
}
```

---

### 4. MQTT IoT设备连接 ⭐⭐⭐⭐⭐

**免费方案**: HiveMQ Public Broker

**连接地址**: `wss://broker.hivemq.com:8884/mqtt`

**特点**:
- ✅ 完全免费
- ✅ 无需注册
- ✅ 支持WebSocket
- ✅ 适合开发测试

**实现代码**:
```typescript
// 安装: npm install mqtt
import * as mqtt from 'mqtt';

export class IoTService {
  private client: mqtt.MqttClient;
  private deviceData$ = new Subject<any>();
  
  connect() {
    this.client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt', {
      clientId: `recycling_${Date.now()}`,
      clean: true,
      reconnectPeriod: 1000
    });
    
    this.client.on('connect', () => {
      console.log('MQTT连接成功');
      // 订阅所有设备主题
      this.client.subscribe('recycling/devices/+/metrics');
      this.client.subscribe('recycling/devices/+/status');
    });
    
    this.client.on('message', (topic, message) => {
      const data = JSON.parse(message.toString());
      this.deviceData$.next(data);
      this.handleDeviceData(data);
    });
    
    this.client.on('error', (error) => {
      console.error('MQTT错误:', error);
    });
  }
  
  // 发布设备控制命令
  publishCommand(deviceId: string, command: any) {
    const topic = `recycling/devices/${deviceId}/commands`;
    this.client.publish(topic, JSON.stringify(command));
  }
  
  // 处理设备数据
  private handleDeviceData(data: any) {
    // 1. 检查预警
    if (data.temperature > 60) {
      this.createAlert('设备温度过高', data.deviceId);
    }
    
    // 2. 存储到数据库
    this.saveToDatabase(data);
    
    // 3. 更新UI
    this.updateDeviceDisplay(data);
  }
  
  disconnect() {
    if (this.client) {
      this.client.end();
    }
  }
}
```

**设备端发送数据格式**:
```json
{
  "deviceId": "DEV-001",
  "temperature": 45.5,
  "pressure": 1.2,
  "efficiency": 95.3,
  "status": "running",
  "timestamp": 1702723800000
}
```

---

### 5. SendGrid 邮件服务 ⭐⭐⭐⭐

**申请地址**: https://sendgrid.com/

**免费额度**: 100封/天

**用途**:
- ✅ 订单通知邮件
- ✅ 预警邮件
- ✅ 报表邮件

**实现代码**:
```typescript
// 安装: npm install @sendgrid/mail
import sgMail from '@sendgrid/mail';

export class EmailService {
  constructor() {
    sgMail.setApiKey('YOUR_SENDGRID_API_KEY');
  }
  
  async sendOrderNotification(to: string, orderData: any) {
    const msg = {
      to: to,
      from: 'noreply@your-domain.com',
      subject: `订单通知 - ${orderData.id}`,
      html: `
        <h2>订单状态更新</h2>
        <p>订单编号: ${orderData.id}</p>
        <p>状态: ${orderData.status}</p>
        <p>详情: <a href="https://your-app.com/orders/${orderData.id}">查看订单</a></p>
      `
    };
    
    await sgMail.send(msg);
  }
  
  async sendAlertEmail(to: string, alert: any) {
    const msg = {
      to: to,
      from: 'alert@your-domain.com',
      subject: `⚠️ 系统预警 - ${alert.title}`,
      html: `
        <h2>${alert.title}</h2>
        <p>${alert.description}</p>
        <p>优先级: ${alert.priority}</p>
      `
    };
    
    await sgMail.send(msg);
  }
}
```

---

### 6. 阿里云短信 ⭐⭐⭐

**申请地址**: https://www.aliyun.com/product/sms

**免费额度**: 新用户有免费额度

**定价**: 约¥0.045/条

**用途**:
- ✅ 订单状态通知
- ✅ 验证码
- ✅ 预警通知

**实现代码**:
```typescript
// 安装: npm install @alicloud/pop-core
import Core from '@alicloud/pop-core';

export class AliSmsService {
  private client: Core;
  
  constructor() {
    this.client = new Core({
      accessKeyId: 'YOUR_ACCESS_KEY_ID',
      accessKeySecret: 'YOUR_ACCESS_KEY_SECRET',
      endpoint: 'https://dysmsapi.aliyuncs.com',
      apiVersion: '2017-05-25'
    });
  }
  
  async sendVerificationCode(phone: string, code: string) {
    const params = {
      PhoneNumbers: phone,
      SignName: '智回回收',
      TemplateCode: 'SMS_123456789',
      TemplateParam: JSON.stringify({ code: code })
    };
    
    const result = await this.client.request('SendSms', params);
    return result.Code === 'OK';
  }
  
  async sendOrderNotification(phone: string, orderNo: string) {
    const params = {
      PhoneNumbers: phone,
      SignName: '智回回收',
      TemplateCode: 'SMS_ORDER_STATUS',
      TemplateParam: JSON.stringify({ orderNo: orderNo })
    };
    
    await this.client.request('SendSms', params);
  }
}
```

---

## 🎯 API对接优先级

### P0 (必须立即对接)
1. **高德地图** - 订单、回收员功能依赖
2. **自建后端API** - 基础业务数据

### P1 (高优先级)
3. **MQTT** - 设备监控需要
4. **DeepSeek AI** - AI助手功能

### P2 (中优先级)
5. **百度语音** - 语音输入
6. **SendGrid** - 邮件通知

### P3 (低优先级)
7. **百度OCR** - 文件识别
8. **阿里云短信** - 短信通知
9. **天眼查** - 企业验证

---

## 📦 依赖安装清单

```bash
# 核心依赖
npm install @amap/amap-jsapi-loader    # 高德地图
npm install openai                      # DeepSeek AI
npm install mqtt                        # IoT设备
npm install @sendgrid/mail             # 邮件服务

# 可选依赖
npm install baidu-aip-sdk              # 百度AI
npm install @alicloud/pop-core         # 阿里云短信
npm install axios                       # HTTP请求

# 数据处理
npm install xlsx                        # Excel导出
npm install jspdf jspdf-autotable      # PDF导出
npm install echarts                     # 图表

# 开发工具
npm install @types/node --save-dev
```

---

## 🔒 安全建议

### API Key存储
```typescript
// ❌ 错误：硬编码
const API_KEY = 'sk-1234567890';

// ✅ 正确：环境变量
// environment.ts
export const environment = {
  production: false,
  amapKey: process.env['AMAP_KEY'],
  deepseekKey: process.env['DEEPSEEK_KEY']
};

// ✅ 更好：后端代理
// 前端调用后端API，由后端调用第三方
GET /api/ai/chat  -> 后端 -> DeepSeek API
```

### 生产环境配置
```typescript
// 不要在前端直接使用API Key
// 使用后端代理模式

// 前端
async sendAIMessage(message: string) {
  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ message }),
    headers: { 'Authorization': `Bearer ${userToken}` }
  });
  return response.json();
}

// 后端（Node.js示例）
app.post('/api/ai/chat', authenticate, async (req, res) => {
  const { message } = req.body;
  // 后端调用DeepSeek，API Key存在环境变量
  const response = await deepseekClient.chat(message);
  res.json(response);
});
```

