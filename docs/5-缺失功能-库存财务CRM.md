# 🆕 缺失功能模块设计 (第1部分)

## 1. 库存管理模块 📦

### 为什么需要？
回收企业必须清楚知道：
- 各仓库有多少库存
- 哪些品类快要满了
- 哪些品类可以出售
- 何时需要补货或清库

### 核心功能
```typescript
interface InventoryModule {
  库存总览: {
    总库存量: number;
    今日入库: number;
    今日出库: number;
    预警数量: number;
    仓库分布: Warehouse[];
  };
  入库管理: {
    回收入库: '订单完成自动入库',
    采购入库: '外部采购入库',
    调拨入库: '仓库间调拨'
  };
  出库管理: {
    销售出库: '出售给下游企业',
    调拨出库: '仓库间调拨',
    报损出库: '损坏报废'
  };
  库存盘点: {
    定期盘点: '按计划盘点',
    实时盘点: '随时盘点',
    盈亏记录: '记录差异'
  };
  预警设置: {
    低库存预警: '低于阈值提醒',
    高库存预警: '库存积压提醒',
    临期预警: '快过期提醒'
  };
}
```

### 界面设计
```
┌─────────────────────────────────────┐
│  库存管理                            │
├─────────────────────────────────────┤
│  [📦 1,250kg] [📥 +150kg] [📤 -80kg]│
│   总库存      今日入库     今日出库   │
├─────────────────────────────────────┤
│  仓库列表                            │
│  ┌───────────────────────┐          │
│  │ 朝阳仓库   450kg  [详情]│          │
│  │ 海淀仓库   380kg  [详情]│          │
│  │ 西城仓库   420kg  [详情]│          │
│  └───────────────────────┘          │
├─────────────────────────────────────┤
│  品类分布 [纸类▼]                    │
│  ┌───────────────────────┐          │
│  │ 纸类   320kg   68%  ━━●│          │
│  │ 塑料   180kg   85%  ━━●│          │
│  │ 金属   150kg   45%  ━─○│          │
│  └───────────────────────┘          │
├─────────────────────────────────────┤
│  [入库] [出库] [盘点] [设置预警]     │
└─────────────────────────────────────┘
```

### 实现代码
```typescript
@Component({
  selector: 'app-inventory-management',
  templateUrl: './inventory-management.html'
})
export class InventoryManagement implements OnInit {
  warehouses: Warehouse[] = [];
  stocks: Stock[] = [];
  alerts: Alert[] = [];
  
  // 获取库存总览
  async loadInventoryOverview() {
    const data = await this.api.get('/api/inventory/overview');
    this.totalStock = data.totalStock;
    this.todayInbound = data.todayInbound;
    this.todayOutbound = data.todayOutbound;
  }
  
  // 入库操作
  async inbound(data: InboundData) {
    await this.api.post('/api/inventory/inbound', {
      warehouseId: data.warehouseId,
      category: data.category,
      quantity: data.quantity,
      batchNo: `BATCH-${Date.now()}`,
      orderId: data.orderId  // 如果是订单入库
    });
    this.loadInventoryOverview();
  }
  
  // 出库操作
  async outbound(data: OutboundData) {
    await this.api.post('/api/inventory/outbound', {
      warehouseId: data.warehouseId,
      category: data.category,
      quantity: data.quantity,
      type: 'sale',  // sale/transfer/loss
      customerId: data.customerId
    });
  }
  
  // 库存预警检查
  checkAlerts() {
    this.stocks.forEach(stock => {
      // 低库存预警
      if (stock.quantity < stock.minThreshold) {
        this.createAlert({
          type: 'low-stock',
          message: `${stock.category}库存不足`,
          warehouseId: stock.warehouseId
        });
      }
      // 高库存预警
      if (stock.quantity > stock.maxThreshold) {
        this.createAlert({
          type: 'high-stock',
          message: `${stock.category}库存积压`,
          warehouseId: stock.warehouseId
        });
      }
    });
  }
}
```

### API接口
```typescript
// 1. 获取库存总览
GET /api/inventory/overview
响应: {
  totalStock: 1250,
  todayInbound: 150,
  todayOutbound: 80,
  warehouses: [
    { id: 'W001', name: '朝阳仓库', stock: 450 }
  ],
  alerts: []
}

// 2. 入库
POST /api/inventory/inbound
请求: {
  warehouseId: 'W001',
  category: '纸类',
  quantity: 50,
  batchNo: 'BATCH-xxx',
  orderId: 'ORD-xxx'
}

// 3. 出库
POST /api/inventory/outbound
请求: {
  warehouseId: 'W001',
  category: '纸类',
  quantity: 30,
  type: 'sale',
  customerId: 'CUST-xxx'
}

// 4. 库存查询
GET /api/inventory/stocks?warehouseId=W001&category=纸类

// 5. 盘点
POST /api/inventory/stocktaking
请求: {
  warehouseId: 'W001',
  items: [
    { category: '纸类', actualQuantity: 318, systemQuantity: 320 }
  ]
}
```

### 数据表
```sql
-- 仓库表
CREATE TABLE warehouses (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100),
  address VARCHAR(500),
  capacity DECIMAL(10,2),
  manager VARCHAR(50),
  status ENUM('active','maintenance','closed')
);

-- 库存表
CREATE TABLE inventory (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  warehouse_id VARCHAR(50),
  category VARCHAR(50),
  quantity DECIMAL(10,2),
  min_threshold DECIMAL(10,2),
  max_threshold DECIMAL(10,2),
  location VARCHAR(50),      -- 仓位
  batch_no VARCHAR(50),
  inbound_date DATETIME,
  update_time DATETIME,
  INDEX idx_warehouse_category (warehouse_id, category)
);

-- 出入库记录表
CREATE TABLE inventory_logs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  type ENUM('inbound','outbound','transfer','stocktaking'),
  warehouse_id VARCHAR(50),
  category VARCHAR(50),
  quantity DECIMAL(10,2),
  batch_no VARCHAR(50),
  related_order_id VARCHAR(50),
  operator VARCHAR(50),
  remark TEXT,
  create_time DATETIME
);
```

---

## 2. 财务管理模块 💰

### 为什么需要？
企业必须清楚：
- 每天赚了多少钱
- 钱花在哪里了
- 是否盈利
- 与客户/供应商的账目是否清晰

### 核心功能
```typescript
interface FinancialModule {
  收支流水: {
    收入: '废品销售、服务收入',
    支出: '人工成本、设备成本、运营成本'
  };
  对账管理: {
    客户对账: '与客户核对应收款',
    供应商对账: '与供应商核对应付款',
    回收员对账: '与回收员结算'
  };
  财务报表: {
    利润表: '收入-成本=利润',
    现金流量表: '现金流入流出',
    资产负债表: '资产负债情况'
  };
  账户管理: {
    多账户: '支持银行、支付宝、微信、现金',
    余额查询: '实时余额',
    转账记录: '账户间转账'
  };
  发票管理: {
    开票: '给客户开发票',
    收票: '收到供应商发票',
    发票查询: '查看发票历史'
  };
}
```

### 界面设计
```
┌─────────────────────────────────────┐
│  财务管理                            │
├─────────────────────────────────────┤
│  今日收入 +¥3,580  今日支出 -¥1,250 │
│  本月利润 ¥25,680  账户余额 ¥158,900│
├─────────────────────────────────────┤
│  收支流水 [全部▼] [本月▼]           │
│  ┌───────────────────────┐          │
│  │ 2024-12-15 10:30                 │
│  │ +¥350.00  废品销售收入           │
│  │ 客户：张先生  订单：ORD-001      │
│  ├───────────────────────┤          │
│  │ 2024-12-15 09:15                 │
│  │ -¥200.00  回收员工资             │
│  │ 李师傅  结算：12月上半月         │
│  └───────────────────────┘          │
├─────────────────────────────────────┤
│  [对账] [报表] [发票] [账户]         │
└─────────────────────────────────────┘
```

### 实现代码
```typescript
@Component({
  selector: 'app-financial-management'
})
export class FinancialManagement {
  transactions: Transaction[] = [];
  todayIncome = 0;
  todayExpense = 0;
  
  async loadFinancialData() {
    // 获取今日收支
    const today = await this.api.get('/api/financial/summary/today');
    this.todayIncome = today.income;
    this.todayExpense = today.expense;
    
    // 获取流水
    this.transactions = await this.api.get('/api/financial/transactions');
  }
  
  // 记录收入
  async recordIncome(data: IncomeData) {
    await this.api.post('/api/financial/income', {
      amount: data.amount,
      category: data.category,  // 废品销售、服务收入等
      relatedOrderId: data.orderId,
      accountId: data.accountId,
      description: data.description
    });
  }
  
  // 记录支出
  async recordExpense(data: ExpenseData) {
    await this.api.post('/api/financial/expense', {
      amount: data.amount,
      category: data.category,  // 人工、运输、设备等
      payee: data.payee,
      accountId: data.accountId,
      description: data.description
    });
  }
  
  // 对账
  async reconcile(data: ReconcileData) {
    const result = await this.api.post('/api/financial/reconcile', {
      partyType: data.partyType,  // customer/supplier/collector
      partyId: data.partyId,
      periodStart: data.periodStart,
      periodEnd: data.periodEnd
    });
    return result;  // 返回对账单
  }
  
  // 导出财务报表
  async exportFinancialReport(type: string, timeRange: string) {
    const data = await this.api.get(`/api/financial/reports/${type}?range=${timeRange}`);
    // 导出Excel
    this.exportToExcel(data, `${type}_${timeRange}.xlsx`);
  }
}
```

### API接口
```typescript
// 1. 今日收支汇总
GET /api/financial/summary/today
响应: {
  income: 3580,
  expense: 1250,
  profit: 2330,
  accountBalance: 158900
}

// 2. 流水列表
GET /api/financial/transactions?page=1&limit=20&type=all&dateRange=month

// 3. 记录收入
POST /api/financial/income
请求: {
  amount: 350,
  category: '废品销售',
  relatedOrderId: 'ORD-001',
  accountId: 'ACC-001'
}

// 4. 对账
POST /api/financial/reconcile
请求: {
  partyType: 'customer',
  partyId: 'CUST-001',
  periodStart: '2024-12-01',
  periodEnd: '2024-12-15'
}
响应: {
  totalAmount: 5000,
  paidAmount: 3000,
  unpaidAmount: 2000,
  transactions: [...]
}

// 5. 财务报表
GET /api/financial/reports/profit?year=2024&month=12
响应: {
  revenue: 125000,      // 收入
  cost: 85000,          // 成本
  grossProfit: 40000,   // 毛利
  expenses: 15000,      // 费用
  netProfit: 25000      // 净利
}
```

---

## 3. 客户管理（CRM）模块 👥

### 为什么需要？
企业需要：
- 了解客户是谁
- 哪些客户最有价值
- 如何维护客户关系
- 提高客户复购率

### 核心功能
```typescript
interface CRMModule {
  客户档案: {
    基本信息: '姓名、电话、地址',
    客户标签: 'VIP、普通、潜在',
    客户分级: 'ABC分类'
  };
  交易历史: {
    历史订单: '所有订单记录',
    回收记录: '回收品类、数量',
    消费金额: '累计消费'
  };
  客户分析: {
    RFM模型: 'Recency最近、Frequency频率、Monetary金额',
    客户画像: '偏好分析、行为分析',
    价值评估: '客户终身价值'
  };
  跟进管理: {
    跟进记录: '销售跟进、回访',
    投诉处理: '投诉记录、处理结果',
    下次跟进: '计划下次联系时间'
  };
  营销活动: {
    精准推送: '根据客户特征推送',
    优惠券发放: '给特定客户发券',
    活动邀请: '邀请参加活动'
  };
}
```

### RFM客户价值模型
```
R (Recency): 最近一次交易距今天数
F (Frequency): 交易频率
M (Monetary): 交易金额

客户分级：
- 重要价值客户: R高 F高 M高 (近期、频繁、高额)
- 重要保持客户: R低 F高 M高 (不常来但花钱多)
- 重要发展客户: R高 F低 M高 (新客户但潜力大)
- 重要挽留客户: R低 F高 M低 (老客户但流失风险)
- 一般客户: 其他
```

### 界面设计
```
┌─────────────────────────────────────┐
│  客户管理  [搜索客户]  [添加客户]    │
├─────────────────────────────────────┤
│  [全部] [VIP客户] [新客户] [流失客户]│
├─────────────────────────────────────┤
│  ┌────────────────────────────┐     │
│  │ 👤 张先生  138****5678      │     │
│  │ 🏷️ VIP  A级  活跃            │     │
│  │ 订单: 25次  金额: ¥8,500    │     │
│  │ 最近: 2天前  [查看] [跟进]  │     │
│  ├────────────────────────────┤     │
│  │ 👤 李女士  139****1234      │     │
│  │ 🏷️ 普通  B级  一般           │     │
│  │ 订单: 12次  金额: ¥3,200    │     │
│  │ 最近: 15天前 [查看] [跟进]  │     │
│  └────────────────────────────┘     │
└─────────────────────────────────────┘
```

### 实现代码
```typescript
@Component({
  selector: 'app-crm'
})
export class CRMManagement {
  customers: Customer[] = [];
  
  // 计算RFM分数
  calculateRFM(customer: Customer) {
    const today = new Date();
    const lastOrderDate = new Date(customer.lastOrderTime);
    
    // R: 最近一次订单距今天数
    const recency = Math.floor(
      (today.getTime() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const rScore = recency <= 30 ? 5 : recency <= 90 ? 3 : 1;
    
    // F: 订单频率
    const frequency = customer.totalOrders;
    const fScore = frequency >= 20 ? 5 : frequency >= 10 ? 3 : 1;
    
    // M: 消费金额
    const monetary = customer.totalAmount;
    const mScore = monetary >= 5000 ? 5 : monetary >= 2000 ? 3 : 1;
    
    return { rScore, fScore, mScore };
  }
  
  // 客户分级
  classifyCustomer(rfm: {rScore: number, fScore: number, mScore: number}) {
    const total = rfm.rScore + rfm.fScore + rfm.mScore;
    if (total >= 13) return 'A';  // 重要价值客户
    if (total >= 9) return 'B';   // 重要发展客户
    return 'C';                   // 一般客户
  }
  
  // 客户画像分析
  async analyzeCustomer(customerId: string) {
    const orders = await this.api.get(`/api/customers/${customerId}/orders`);
    
    // 偏好品类分析
    const categoryCount = {};
    orders.forEach(order => {
      categoryCount[order.category] = (categoryCount[order.category] || 0) + 1;
    });
    const preferredCategory = Object.keys(categoryCount)
      .sort((a, b) => categoryCount[b] - categoryCount[a])[0];
    
    // 时段偏好分析
    const timeSlots = orders.map(order => {
      const hour = new Date(order.createTime).getHours();
      if (hour < 12) return '上午';
      if (hour < 18) return '下午';
      return '晚上';
    });
    const preferredTime = this.getMostFrequent(timeSlots);
    
    return {
      preferredCategory,
      preferredTime,
      averageOrderValue: orders.reduce((sum, o) => sum + o.amount, 0) / orders.length
    };
  }
  
  // 流失预警
  async checkChurnRisk() {
    const customers = await this.api.get('/api/customers');
    const today = new Date();
    
    customers.forEach(customer => {
      const daysSinceLastOrder = Math.floor(
        (today.getTime() - new Date(customer.lastOrderTime).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      // 超过60天未下单，发出预警
      if (daysSinceLastOrder > 60 && customer.totalOrders > 5) {
        this.createChurnAlert(customer);
      }
    });
  }
}
```

### API接口
```typescript
// 1. 客户列表
GET /api/customers?level=A&status=active&page=1

// 2. 客户详情
GET /api/customers/:id
响应: {
  id: 'CUST-001',
  name: '张先生',
  phone: '138****5678',
  level: 'A',
  tags: ['VIP', '活跃'],
  totalOrders: 25,
  totalAmount: 8500,
  lastOrderTime: '2024-12-14',
  rfmScore: { r: 5, f: 5, m: 5 },
  preferences: {
    categories: ['纸类', '塑料'],
    timeSlots: ['上午']
  }
}

// 3. 客户订单历史
GET /api/customers/:id/orders

// 4. 添加跟进记录
POST /api/customers/:id/follow-records
请求: {
  type: 'call',  // call/visit/complaint
  content: '回访客户，满意度较高',
  nextFollowTime: '2024-12-20'
}

// 5. 客户标签管理
POST /api/customers/:id/tags
请求: { tags: ['VIP', '活跃', '高价值'] }
```

### 数据表设计
参考前面的 `customers` 表和 `follow_records` 表

---

## 总结

这三个模块是B端回收企业的**基础必备功能**，优先级极高：

### 实施顺序建议
1. **财务管理** (P0) - 企业核心，必须清楚账目
2. **客户管理** (P0) - 客户是企业命脉
3. **库存管理** (P1) - 规模企业必需，小企业可暂缓

### 开发时间估算
- 库存管理: 5-7天
- 财务管理: 7-10天
- 客户管理: 5-7天

**总计**: 约3周完成基础版本

