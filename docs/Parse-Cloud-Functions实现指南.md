# Parse Server Cloud Functions 实现指南

## 📋 概述

为了支持手机验证码登录和密码重置功能，需要在 Parse Server 中实现以下 Cloud Functions。

---

## 🔧 必需的 Cloud Functions

### 1. `sendSMSCode` - 发送短信验证码

**功能说明：** 发送6位数字验证码到用户手机

**请求参数：**
```javascript
{
  phoneNumber: string,  // 手机号
  purpose: string       // 用途：'login' | 'register' | 'resetPassword'
}
```

**实现示例：**
```javascript
// cloud/main.js
Parse.Cloud.define('sendSMSCode', async (request) => {
  const { phoneNumber, purpose } = request.params;
  
  // 验证手机号格式
  if (!/^1[3-9]\d{9}$/.test(phoneNumber)) {
    throw new Parse.Error(400, '手机号格式不正确');
  }
  
  // 生成6位随机验证码
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // 设置过期时间（5分钟）
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  
  // 保存验证码到数据库
  const SMSCode = Parse.Object.extend('SMSCode');
  const smsCode = new SMSCode();
  smsCode.set('phoneNumber', phoneNumber);
  smsCode.set('code', code);
  smsCode.set('purpose', purpose);
  smsCode.set('expiresAt', expiresAt);
  smsCode.set('used', false);
  
  await smsCode.save(null, { useMasterKey: true });
  
  // 调用短信服务发送验证码（需要集成短信服务商）
  // 示例：阿里云短信、腾讯云短信等
  await sendSMS(phoneNumber, code, purpose);
  
  return {
    success: true,
    message: '验证码已发送'
  };
});

// 短信发送函数（需要根据实际短信服务商实现）
async function sendSMS(phoneNumber, code, purpose) {
  // TODO: 集成实际的短信服务商API
  // 示例：阿里云、腾讯云、云片等
  console.log(`发送验证码 ${code} 到 ${phoneNumber}，用途：${purpose}`);
}
```

---

### 2. `loginWithPhoneCode` - 验证码登录

**功能说明：** 使用手机号和验证码进行登录

**请求参数：**
```javascript
{
  phoneNumber: string,  // 手机号
  smsCode: string       // 验证码
}
```

**返回数据：**
```javascript
{
  sessionToken: string  // 用户会话令牌
}
```

**实现示例：**
```javascript
Parse.Cloud.define('loginWithPhoneCode', async (request) => {
  const { phoneNumber, smsCode } = request.params;
  
  // 查询验证码
  const SMSCode = Parse.Object.extend('SMSCode');
  const query = new Parse.Query(SMSCode);
  query.equalTo('phoneNumber', phoneNumber);
  query.equalTo('code', smsCode);
  query.equalTo('purpose', 'login');
  query.equalTo('used', false);
  query.greaterThan('expiresAt', new Date());
  query.descending('createdAt');
  
  const codeRecord = await query.first({ useMasterKey: true });
  
  if (!codeRecord) {
    throw new Parse.Error(400, '验证码无效或已过期');
  }
  
  // 标记验证码已使用
  codeRecord.set('used', true);
  await codeRecord.save(null, { useMasterKey: true });
  
  // 查找用户
  const userQuery = new Parse.Query(Parse.User);
  userQuery.equalTo('phone', phoneNumber);
  const user = await userQuery.first({ useMasterKey: true });
  
  if (!user) {
    throw new Parse.Error(404, '该手机号未注册');
  }
  
  // 生成新的 session token
  const sessionToken = await Parse.Cloud.run('createUserSession', {
    userId: user.id
  }, { useMasterKey: true });
  
  return {
    sessionToken: sessionToken
  };
});

// 创建用户会话
Parse.Cloud.define('createUserSession', async (request) => {
  const { userId } = request.params;
  
  const user = await new Parse.Query(Parse.User).get(userId, { useMasterKey: true });
  
  if (!user) {
    throw new Parse.Error(404, '用户不存在');
  }
  
  // 创建新的 session
  const Session = Parse.Object.extend('_Session');
  const session = new Session();
  session.set('user', user);
  session.set('createdWith', {
    action: 'login',
    authProvider: 'sms'
  });
  session.set('restricted', false);
  session.set('expiresAt', new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)); // 1年
  
  await session.save(null, { useMasterKey: true });
  
  return session.get('sessionToken');
});
```

---

### 3. `requestPasswordResetBySMS` - 请求短信重置密码

**功能说明：** 发送密码重置验证码

**请求参数：**
```javascript
{
  phoneNumber: string  // 手机号
}
```

**实现示例：**
```javascript
Parse.Cloud.define('requestPasswordResetBySMS', async (request) => {
  const { phoneNumber } = request.params;
  
  // 查找用户
  const userQuery = new Parse.Query(Parse.User);
  userQuery.equalTo('phone', phoneNumber);
  const user = await userQuery.first({ useMasterKey: true });
  
  if (!user) {
    throw new Parse.Error(404, '该手机号未注册');
  }
  
  // 调用发送验证码函数
  await Parse.Cloud.run('sendSMSCode', {
    phoneNumber: phoneNumber,
    purpose: 'resetPassword'
  });
  
  return {
    success: true,
    message: '验证码已发送'
  };
});
```

---

### 4. `resetPasswordWithSMS` - 使用验证码重置密码

**功能说明：** 验证验证码并重置密码

**请求参数：**
```javascript
{
  phoneNumber: string,  // 手机号
  smsCode: string,      // 验证码
  newPassword: string   // 新密码
}
```

**实现示例：**
```javascript
Parse.Cloud.define('resetPasswordWithSMS', async (request) => {
  const { phoneNumber, smsCode, newPassword } = request.params;
  
  // 验证密码强度
  if (newPassword.length < 6) {
    throw new Parse.Error(400, '密码长度至少6位');
  }
  
  // 查询验证码
  const SMSCode = Parse.Object.extend('SMSCode');
  const query = new Parse.Query(SMSCode);
  query.equalTo('phoneNumber', phoneNumber);
  query.equalTo('code', smsCode);
  query.equalTo('purpose', 'resetPassword');
  query.equalTo('used', false);
  query.greaterThan('expiresAt', new Date());
  query.descending('createdAt');
  
  const codeRecord = await query.first({ useMasterKey: true });
  
  if (!codeRecord) {
    throw new Parse.Error(400, '验证码无效或已过期');
  }
  
  // 标记验证码已使用
  codeRecord.set('used', true);
  await codeRecord.save(null, { useMasterKey: true });
  
  // 查找用户
  const userQuery = new Parse.Query(Parse.User);
  userQuery.equalTo('phone', phoneNumber);
  const user = await userQuery.first({ useMasterKey: true });
  
  if (!user) {
    throw new Parse.Error(404, '该手机号未注册');
  }
  
  // 重置密码
  user.setPassword(newPassword);
  await user.save(null, { useMasterKey: true });
  
  return {
    success: true,
    message: '密码重置成功'
  };
});
```

---

## 📊 数据库表结构

### SMSCode 表

用于存储短信验证码记录：

| 字段名 | 类型 | 说明 |
|--------|------|------|
| phoneNumber | String | 手机号 |
| code | String | 6位验证码 |
| purpose | String | 用途（login/register/resetPassword） |
| expiresAt | Date | 过期时间 |
| used | Boolean | 是否已使用 |
| createdAt | Date | 创建时间（自动） |
| updatedAt | Date | 更新时间（自动） |

**权限设置：**
- 读权限：无（只能通过 Cloud Function 访问）
- 写权限：无（只能通过 Cloud Function 访问）

---

## 🔌 短信服务商集成

### 推荐的短信服务商

1. **阿里云短信服务**
   - 文档：https://help.aliyun.com/product/44282.html
   - NPM包：`@alicloud/dysmsapi20170525`

2. **腾讯云短信**
   - 文档：https://cloud.tencent.com/document/product/382
   - NPM包：`tencentcloud-sdk-nodejs`

3. **云片网**
   - 文档：https://www.yunpian.com/doc/zh_CN/
   - NPM包：`yunpian-sms`

### 阿里云短信集成示例

```javascript
// 安装依赖
// npm install @alicloud/dysmsapi20170525 --save

const Dysmsapi = require('@alicloud/dysmsapi20170525');
const OpenApi = require('@alicloud/openapi-client');

// 初始化客户端
function createSMSClient() {
  const config = new OpenApi.Config({
    accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID,
    accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET,
    endpoint: 'dysmsapi.aliyuncs.com'
  });
  return new Dysmsapi(config);
}

// 发送短信
async function sendSMS(phoneNumber, code, purpose) {
  const client = createSMSClient();
  
  // 根据用途选择不同的模板
  const templates = {
    login: 'SMS_123456789',      // 登录验证码模板ID
    register: 'SMS_987654321',   // 注册验证码模板ID
    resetPassword: 'SMS_111222333' // 重置密码模板ID
  };
  
  const request = new Dysmsapi.SendSmsRequest({
    phoneNumbers: phoneNumber,
    signName: '再生视界',  // 短信签名
    templateCode: templates[purpose],
    templateParam: JSON.stringify({ code: code })
  });
  
  try {
    const response = await client.sendSms(request);
    console.log('短信发送成功:', response);
    return response;
  } catch (error) {
    console.error('短信发送失败:', error);
    throw new Parse.Error(500, '短信发送失败');
  }
}
```

---

## ⚙️ Parse Server 配置

### 邮件服务配置（用于邮箱重置密码）

在 Parse Server 初始化时添加邮件配置：

```javascript
const api = new ParseServer({
  databaseURI: 'mongodb://localhost:27017/recycle',
  appId: 'YOUR_APP_ID',
  masterKey: 'YOUR_MASTER_KEY',
  serverURL: 'http://localhost:1337/parse',
  
  // 邮件配置
  emailAdapter: {
    module: '@parse/simple-mailgun-adapter',
    options: {
      fromAddress: 'noreply@recycle-app.com',
      domain: 'mg.recycle-app.com',
      apiKey: 'YOUR_MAILGUN_API_KEY'
    }
  },
  
  // 邮件验证
  verifyUserEmails: true,
  emailVerifyTokenValidityDuration: 2 * 60 * 60, // 2小时
  
  // 密码重置
  appName: '再生视界',
  publicServerURL: 'https://recycle-app.com'
});
```

---

## 🧪 测试

### 测试验证码发送

```bash
curl -X POST \
  http://localhost:1337/parse/functions/sendSMSCode \
  -H 'Content-Type: application/json' \
  -H 'X-Parse-Application-Id: YOUR_APP_ID' \
  -d '{
    "phoneNumber": "13800138000",
    "purpose": "login"
  }'
```

### 测试验证码登录

```bash
curl -X POST \
  http://localhost:1337/parse/functions/loginWithPhoneCode \
  -H 'Content-Type: application/json' \
  -H 'X-Parse-Application-Id: YOUR_APP_ID' \
  -d '{
    "phoneNumber": "13800138000",
    "smsCode": "123456"
  }'
```

---

## 📝 部署清单

在部署到生产环境前，请确保：

- [ ] 已实现所有必需的 Cloud Functions
- [ ] 已配置短信服务商账号和密钥
- [ ] 已配置邮件服务
- [ ] 已在Parse Dashboard中创建 SMSCode 表
- [ ] 已设置正确的数据表权限
- [ ] 已配置环境变量（ACCESS_KEY等）
- [ ] 已在短信服务商后台配置短信模板
- [ ] 已申请短信签名并通过审核
- [ ] 已测试所有功能是否正常工作

---

## ⚠️ 安全注意事项

1. **验证码安全**
   - 限制同一手机号的发送频率（建议60秒）
   - 验证码有效期不超过5分钟
   - 验证码使用后立即标记为已使用
   - 记录发送日志，监控异常请求

2. **短信轰炸防护**
   - 添加图形验证码
   - IP频率限制
   - 手机号黑名单
   - 每日发送上限

3. **密钥安全**
   - 使用环境变量存储敏感信息
   - 不要将密钥提交到代码仓库
   - 定期更换 Access Key
   - 使用 Parse Master Key 访问敏感数据

---

## 🔗 相关资源

- Parse Server 文档：https://docs.parseplatform.org/
- Parse Cloud Code 指南：https://docs.parseplatform.org/cloudcode/guide/
- FmodeParse SDK：https://github.com/fmode/fmode-ng

---

## 💡 提示

如果您的应用暂时不需要手机验证码登录功能，可以：
1. 在前端禁用验证码登录选项
2. 只保留密码登录方式
3. 稍后再实现 Cloud Functions

密码登录功能已完全可用，不依赖任何 Cloud Functions。
