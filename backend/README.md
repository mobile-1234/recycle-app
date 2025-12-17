# 废品回收APP后端服务

基于 Spring Boot 3.2 + MyBatis-Plus 的后端 API 服务。

## 技术栈

- **框架**: Spring Boot 3.2.0
- **ORM**: MyBatis-Plus 3.5.5
- **数据库**: MySQL 8.x
- **文档**: Knife4j (Swagger)
- **工具**: Hutool, Lombok
- **认证**: JWT

## 项目结构

```
backend/
├── src/main/java/com/recycle/
│   ├── common/          # 通用类（Result, PageResult）
│   ├── config/          # 配置类
│   ├── controller/      # 控制器
│   │   ├── client/      # C端接口
│   │   ├── business/    # B端接口
│   │   └── government/  # G端接口
│   ├── dto/             # 数据传输对象
│   ├── entity/          # 实体类
│   ├── exception/       # 异常处理
│   ├── interceptor/     # 拦截器
│   ├── mapper/          # MyBatis Mapper
│   ├── service/         # 服务层
│   └── util/            # 工具类
└── src/main/resources/
    ├── application.yml  # 配置文件
    └── mapper/          # XML映射文件
```

## 快速开始

### 1. 环境要求

- JDK 17+
- Maven 3.8+
- MySQL 8.x

### 2. 配置数据库

编辑 `src/main/resources/application.yml`，修改数据库连接信息：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/recycle_app?...
    username: root
    password: your_password  # 修改为你的密码
```

### 3. 启动项目

```bash
# 方式一：Maven命令
mvn spring-boot:run

# 方式二：打包后运行
mvn clean package -DskipTests
java -jar target/recycle-app-backend-1.0.0.jar

# 方式三：IDE中运行
# 直接运行 RecycleAppApplication.java 的 main 方法
```

### 4. 访问API文档

启动后访问：http://localhost:8080/doc.html

## API接口概览

### C端接口 `/api/c/`

| 模块 | 路径 | 说明 |
|------|------|------|
| 认证 | `/api/c/auth/*` | 登录、注册 |
| 用户 | `/api/c/user/*` | 用户信息、地址管理 |
| 订单 | `/api/c/orders/*` | 回收订单 |
| 分类 | `/api/c/categories/*` | 废品分类 |
| 回收员 | `/api/c/collectors/*` | 回收员列表 |
| 商品 | `/api/c/products/*` | 积分商城 |

### B端接口 `/api/b/`

| 模块 | 路径 | 说明 |
|------|------|------|
| 认证 | `/api/b/auth/*` | 企业登录 |
| 订单 | `/api/b/orders/*` | 订单管理 |

### G端接口 `/api/g/`

| 模块 | 路径 | 说明 |
|------|------|------|
| 认证 | `/api/g/auth/*` | 政府用户登录 |
| 统计 | `/api/g/statistics/*` | 数据统计 |

## 请求示例

### 用户注册

```bash
POST /api/c/auth/register
Content-Type: application/json

{
  "phone": "13800138000",
  "password": "123456"
}
```

### 用户登录

```bash
POST /api/c/auth/login
Content-Type: application/json

{
  "phone": "13800138000",
  "password": "123456"
}
```

响应：

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "user": { ... }
  }
}
```

### 创建回收订单

```bash
POST /api/c/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "categoryId": 1,
  "categoryName": "纸类",
  "estimatedWeight": 5.0,
  "contactName": "张三",
  "contactPhone": "13800138000",
  "address": "北京市朝阳区xxx",
  "recycleMethod": "pickup",
  "timeOption": "immediate"
}
```

## 注意事项

1. 需要先执行 `database/` 目录下的 SQL 文件创建数据库
2. 默认端口 8080，可在 application.yml 中修改
3. Redis 配置可选，如不使用请移除相关依赖
