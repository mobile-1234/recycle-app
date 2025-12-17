-- ============================================
-- 废品回收APP G端(政府端)数据库设计
-- 数据库名: recycle_app (与C端/B端共用)
-- ============================================

USE recycle_app;

-- 1. 政府用户表
CREATE TABLE `government_users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `password` VARCHAR(255) NOT NULL COMMENT '密码',
  `name` VARCHAR(50) NOT NULL COMMENT '姓名',
  `department` VARCHAR(100) DEFAULT NULL COMMENT '部门',
  `position` VARCHAR(50) DEFAULT NULL COMMENT '职位',
  `phone` VARCHAR(20) DEFAULT NULL,
  `email` VARCHAR(100) DEFAULT NULL,
  `avatar` VARCHAR(255) DEFAULT NULL,
  `role` VARCHAR(50) DEFAULT 'staff' COMMENT '角色:admin/manager/analyst/staff',
  `region_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '管辖区域ID',
  `permissions` TEXT DEFAULT NULL COMMENT '权限配置JSON',
  `status` TINYINT DEFAULT 1 COMMENT '0禁用 1正常',
  `last_login_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='政府用户表';

-- 2. 行政区划表
CREATE TABLE `administrative_regions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `region_code` VARCHAR(20) NOT NULL COMMENT '区划代码',
  `name` VARCHAR(50) NOT NULL COMMENT '区域名称',
  `parent_id` BIGINT UNSIGNED DEFAULT 0 COMMENT '上级区域ID',
  `level` TINYINT DEFAULT 1 COMMENT '级别:1省 2市 3区县 4街道',
  `manager` VARCHAR(50) DEFAULT NULL COMMENT '负责人',
  `contact` VARCHAR(20) DEFAULT NULL COMMENT '联系方式',
  `address` VARCHAR(255) DEFAULT NULL,
  `population` INT DEFAULT 0 COMMENT '人口数量',
  `area_size` DECIMAL(10,2) DEFAULT 0 COMMENT '面积(平方公里)',
  `recycle_points` INT DEFAULT 0 COMMENT '回收点数量',
  `compliance_rate` DECIMAL(5,2) DEFAULT 0 COMMENT '合规率(%)',
  `monthly_volume` DECIMAL(12,2) DEFAULT 0 COMMENT '月回收量(kg)',
  `longitude` DECIMAL(10,7) DEFAULT NULL,
  `latitude` DECIMAL(10,7) DEFAULT NULL,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_region_code` (`region_code`),
  KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='行政区划表';

-- 3. 政府预警信息表
CREATE TABLE `government_warnings` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `warning_no` VARCHAR(30) NOT NULL COMMENT '预警编号',
  `type` ENUM('violation', 'anomaly', 'complaint', 'environmental') NOT NULL COMMENT '类型',
  `level` ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  `title` VARCHAR(200) NOT NULL,
  `content` TEXT DEFAULT NULL,
  `region_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '涉及区域',
  `region_name` VARCHAR(50) DEFAULT NULL,
  `enterprise_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '涉及企业',
  `enterprise_name` VARCHAR(100) DEFAULT NULL,
  `source` VARCHAR(50) DEFAULT NULL COMMENT '来源:system/report/complaint',
  `evidence` TEXT DEFAULT NULL COMMENT '证据材料JSON',
  `status` ENUM('pending', 'processing', 'resolved', 'closed') DEFAULT 'pending',
  `handler_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '处理人',
  `handler_name` VARCHAR(50) DEFAULT NULL,
  `handle_time` DATETIME DEFAULT NULL,
  `handle_result` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_type` (`type`),
  KEY `idx_level` (`level`),
  KEY `idx_status` (`status`),
  KEY `idx_region_id` (`region_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='政府预警信息表';

-- 4. 回收站点表(政府监管)
CREATE TABLE `recycle_stations` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `station_no` VARCHAR(30) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `type` ENUM('station', 'center', 'mobile') NOT NULL COMMENT '站/中心/流动点',
  `region_id` BIGINT UNSIGNED DEFAULT NULL,
  `address` VARCHAR(255) DEFAULT NULL,
  `longitude` DECIMAL(10,7) DEFAULT NULL,
  `latitude` DECIMAL(10,7) DEFAULT NULL,
  `operator_name` VARCHAR(100) DEFAULT NULL COMMENT '运营企业',
  `operator_id` BIGINT UNSIGNED DEFAULT NULL,
  `contact_name` VARCHAR(50) DEFAULT NULL,
  `contact_phone` VARCHAR(20) DEFAULT NULL,
  `working_hours` VARCHAR(50) DEFAULT NULL,
  `supported_types` TEXT DEFAULT NULL COMMENT '支持类型JSON',
  `daily_capacity` DECIMAL(10,2) DEFAULT 0 COMMENT '日处理能力(kg)',
  `today_volume` DECIMAL(10,2) DEFAULT 0 COMMENT '今日处理量',
  `compliance_status` ENUM('compliant', 'warning', 'violation') DEFAULT 'compliant',
  `last_inspection` DATE DEFAULT NULL COMMENT '上次检查日期',
  `status` ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_station_no` (`station_no`),
  KEY `idx_region_id` (`region_id`),
  KEY `idx_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='回收站点表';

-- 5. 产业链数据表
CREATE TABLE `industry_chain_data` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `region_id` BIGINT UNSIGNED DEFAULT NULL,
  `stage` VARCHAR(30) NOT NULL COMMENT '环节:回收/分拣/加工/再生',
  `report_date` DATE NOT NULL,
  `volume` DECIMAL(12,2) DEFAULT 0 COMMENT '处理量(kg)',
  `efficiency` DECIMAL(5,2) DEFAULT 0 COMMENT '效率(%)',
  `companies` INT DEFAULT 0 COMMENT '企业数量',
  `employees` INT DEFAULT 0 COMMENT '从业人数',
  `revenue` DECIMAL(14,2) DEFAULT 0 COMMENT '产值(元)',
  `growth_rate` DECIMAL(5,2) DEFAULT 0 COMMENT '增长率(%)',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_stage` (`stage`),
  KEY `idx_report_date` (`report_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='产业链数据表';

-- 6. 区域统计数据表
CREATE TABLE `region_statistics` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `region_id` BIGINT UNSIGNED NOT NULL,
  `region_name` VARCHAR(50) DEFAULT NULL,
  `stat_date` DATE NOT NULL,
  `stat_type` ENUM('daily', 'weekly', 'monthly', 'yearly') NOT NULL,
  `recycle_volume` DECIMAL(12,2) DEFAULT 0 COMMENT '回收量(kg)',
  `recycle_rate` DECIMAL(5,2) DEFAULT 0 COMMENT '回收率(%)',
  `regeneration_rate` DECIMAL(5,2) DEFAULT 0 COMMENT '再生利用率(%)',
  `accuracy_rate` DECIMAL(5,2) DEFAULT 0 COMMENT '分类准确率(%)',
  `market_price` DECIMAL(10,2) DEFAULT 0 COMMENT '市场均价',
  `companies` INT DEFAULT 0 COMMENT '企业数量',
  `carbon_reduction` DECIMAL(10,2) DEFAULT 0 COMMENT '碳减排(kg)',
  `trend` ENUM('up', 'down', 'stable') DEFAULT 'stable',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_region_date_type` (`region_id`, `stat_date`, `stat_type`),
  KEY `idx_stat_date` (`stat_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='区域统计数据表';

-- 7. 品类统计数据表
CREATE TABLE `category_statistics` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `region_id` BIGINT UNSIGNED DEFAULT NULL,
  `category` VARCHAR(50) NOT NULL COMMENT '品类:纸类/塑料/金属/玻璃',
  `stat_date` DATE NOT NULL,
  `stat_type` ENUM('daily', 'weekly', 'monthly') NOT NULL,
  `volume` DECIMAL(12,2) DEFAULT 0 COMMENT '处理量(kg)',
  `value` DECIMAL(14,2) DEFAULT 0 COMMENT '产值(元)',
  `recycle_rate` DECIMAL(5,2) DEFAULT 0,
  `regeneration_rate` DECIMAL(5,2) DEFAULT 0,
  `companies` INT DEFAULT 0,
  `market_demand` ENUM('high', 'medium', 'low') DEFAULT 'medium',
  `trend` ENUM('up', 'down', 'stable') DEFAULT 'stable',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_stat_date` (`stat_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='品类统计数据表';

-- 8. 风险评估表
CREATE TABLE `risk_assessments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `region_id` BIGINT UNSIGNED DEFAULT NULL,
  `risk_type` VARCHAR(50) NOT NULL COMMENT '市场/政策/技术/环保风险',
  `level` ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  `title` VARCHAR(200) NOT NULL,
  `content` TEXT DEFAULT NULL,
  `impact` TEXT DEFAULT NULL COMMENT '影响分析',
  `probability` INT DEFAULT 0 COMMENT '发生概率(%)',
  `strategy` TEXT DEFAULT NULL COMMENT '应对策略',
  `status` ENUM('active', 'mitigated', 'closed') DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_risk_type` (`risk_type`),
  KEY `idx_level` (`level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='风险评估表';

-- 9. 补贴申请表
CREATE TABLE `subsidy_applications` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `application_no` VARCHAR(30) NOT NULL,
  `enterprise_id` BIGINT UNSIGNED NOT NULL,
  `enterprise_name` VARCHAR(100) DEFAULT NULL,
  `subsidy_type` VARCHAR(50) NOT NULL COMMENT '补贴类型',
  `amount` DECIMAL(12,2) NOT NULL COMMENT '申请金额',
  `purpose` TEXT DEFAULT NULL COMMENT '申请用途',
  `materials` TEXT DEFAULT NULL COMMENT '申请材料JSON',
  `apply_date` DATE NOT NULL,
  `status` ENUM('pending', 'reviewing', 'approved', 'rejected', 'paid') DEFAULT 'pending',
  `blockchain_hash` VARCHAR(100) DEFAULT NULL COMMENT '区块链验证哈希',
  `blockchain_status` ENUM('verified', 'verifying', 'failed') DEFAULT 'verifying',
  `reviewer_id` BIGINT UNSIGNED DEFAULT NULL,
  `reviewer_name` VARCHAR(50) DEFAULT NULL,
  `review_time` DATETIME DEFAULT NULL,
  `review_comment` TEXT DEFAULT NULL,
  `reject_reason` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_application_no` (`application_no`),
  KEY `idx_enterprise_id` (`enterprise_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='补贴申请表';

-- 10. 补贴发放记录表
CREATE TABLE `subsidy_payments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `payment_no` VARCHAR(30) NOT NULL,
  `application_id` BIGINT UNSIGNED NOT NULL,
  `enterprise_id` BIGINT UNSIGNED NOT NULL,
  `enterprise_name` VARCHAR(100) DEFAULT NULL,
  `amount` DECIMAL(12,2) NOT NULL,
  `purpose` VARCHAR(200) DEFAULT NULL,
  `payment_date` DATE NOT NULL,
  `payment_method` VARCHAR(50) DEFAULT NULL,
  `bank_account` VARCHAR(50) DEFAULT NULL,
  `effectiveness` INT DEFAULT 0 COMMENT '效果评分(0-100)',
  `status` ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_application_id` (`application_id`),
  KEY `idx_enterprise_id` (`enterprise_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='补贴发放记录表';

-- 11. 政策效果评估表
CREATE TABLE `policy_evaluations` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `policy_id` BIGINT UNSIGNED DEFAULT NULL,
  `policy_name` VARCHAR(200) DEFAULT NULL,
  `region_id` BIGINT UNSIGNED DEFAULT NULL,
  `eval_date` DATE NOT NULL,
  `eval_period` VARCHAR(50) DEFAULT NULL COMMENT '评估周期',
  `subsidy_amount` DECIMAL(14,2) DEFAULT 0 COMMENT '补贴总额',
  `recycle_growth` DECIMAL(5,2) DEFAULT 0 COMMENT '回收量增长(%)',
  `participation_rate` DECIMAL(5,2) DEFAULT 0 COMMENT '参与率(%)',
  `satisfaction_rate` DECIMAL(5,2) DEFAULT 0 COMMENT '满意度(%)',
  `cost_benefit_ratio` DECIMAL(5,2) DEFAULT 0 COMMENT '成本效益比',
  `indicators` TEXT DEFAULT NULL COMMENT '指标详情JSON',
  `recommendations` TEXT DEFAULT NULL COMMENT '建议JSON',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_policy_id` (`policy_id`),
  KEY `idx_eval_date` (`eval_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='政策效果评估表';

-- 12. AI生成报告表
CREATE TABLE `ai_generated_reports` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `report_no` VARCHAR(30) NOT NULL,
  `report_type` VARCHAR(50) NOT NULL COMMENT 'monthly/industry/policy',
  `title` VARCHAR(200) NOT NULL,
  `summary` TEXT DEFAULT NULL,
  `content` LONGTEXT DEFAULT NULL COMMENT '报告内容JSON',
  `region_id` BIGINT UNSIGNED DEFAULT NULL,
  `generator_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '生成人',
  `generate_time` DATETIME DEFAULT NULL,
  `status` ENUM('generating', 'completed', 'failed') DEFAULT 'generating',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_report_type` (`report_type`),
  KEY `idx_generate_time` (`generate_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='AI生成报告表';

-- 13. 合规检查记录表
CREATE TABLE `compliance_checks` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `check_no` VARCHAR(30) NOT NULL,
  `enterprise_id` BIGINT UNSIGNED NOT NULL,
  `enterprise_name` VARCHAR(100) DEFAULT NULL,
  `region_id` BIGINT UNSIGNED DEFAULT NULL,
  `check_type` VARCHAR(50) DEFAULT NULL COMMENT '检查类型',
  `check_date` DATE NOT NULL,
  `risk_level` ENUM('low', 'medium', 'high') DEFAULT 'low',
  `risk_pattern` VARCHAR(200) DEFAULT NULL COMMENT '风险模式',
  `findings` TEXT DEFAULT NULL COMMENT '发现问题',
  `suggestions` TEXT DEFAULT NULL COMMENT '整改建议',
  `inspector_id` BIGINT UNSIGNED DEFAULT NULL,
  `inspector_name` VARCHAR(50) DEFAULT NULL,
  `status` ENUM('pending', 'passed', 'failed', 'rectifying') DEFAULT 'pending',
  `rectify_deadline` DATE DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_enterprise_id` (`enterprise_id`),
  KEY `idx_check_date` (`check_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='合规检查记录表';

-- 14. 政策模拟记录表
CREATE TABLE `policy_simulations` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `simulation_type` VARCHAR(50) DEFAULT NULL COMMENT '模拟类型',
  `parameters` TEXT DEFAULT NULL COMMENT '输入参数JSON',
  `subsidy_amount` DECIMAL(12,2) DEFAULT 0,
  `time_range` INT DEFAULT 0 COMMENT '时间范围(月)',
  `result` TEXT DEFAULT NULL COMMENT '模拟结果JSON',
  `recycle_increase` DECIMAL(5,2) DEFAULT 0,
  `budget_cost` DECIMAL(12,2) DEFAULT 0,
  `carbon_reduction` DECIMAL(10,2) DEFAULT 0,
  `participation` DECIMAL(5,2) DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='政策模拟记录表';

-- 15. 公告通知表
CREATE TABLE `government_notices` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(200) NOT NULL,
  `content` LONGTEXT DEFAULT NULL,
  `type` VARCHAR(50) DEFAULT NULL COMMENT '类型:policy/notice/announcement',
  `level` ENUM('normal', 'important', 'urgent') DEFAULT 'normal',
  `target_regions` TEXT DEFAULT NULL COMMENT '目标区域JSON',
  `attachment` VARCHAR(255) DEFAULT NULL,
  `publisher_id` BIGINT UNSIGNED DEFAULT NULL,
  `publisher_name` VARCHAR(50) DEFAULT NULL,
  `publish_time` DATETIME DEFAULT NULL,
  `expire_time` DATETIME DEFAULT NULL,
  `status` ENUM('draft', 'published', 'expired', 'withdrawn') DEFAULT 'draft',
  `view_count` INT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_type` (`type`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='公告通知表';

-- 16. 操作日志表
CREATE TABLE `government_operation_logs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `user_name` VARCHAR(50) DEFAULT NULL,
  `module` VARCHAR(50) DEFAULT NULL COMMENT '模块',
  `action` VARCHAR(100) NOT NULL COMMENT '操作',
  `target_type` VARCHAR(50) DEFAULT NULL COMMENT '操作对象类型',
  `target_id` BIGINT UNSIGNED DEFAULT NULL,
  `detail` TEXT DEFAULT NULL COMMENT '详情',
  `ip` VARCHAR(50) DEFAULT NULL,
  `user_agent` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_module` (`module`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='操作日志表';

-- 17. 通知设置表
CREATE TABLE `notification_settings` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `system_alerts` TINYINT DEFAULT 1 COMMENT '系统预警',
  `data_reports` TINYINT DEFAULT 1 COMMENT '数据报告',
  `policy_updates` TINYINT DEFAULT 1 COMMENT '政策更新',
  `email_notifications` TINYINT DEFAULT 0,
  `email` VARCHAR(100) DEFAULT NULL,
  `sms_notifications` TINYINT DEFAULT 0,
  `phone` VARCHAR(20) DEFAULT NULL,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='通知设置表';

-- ============================================
-- 初始化G端基础数据
-- ============================================

-- 行政区划示例数据
INSERT INTO `administrative_regions` (`region_code`, `name`, `level`, `manager`, `contact`, `population`, `recycle_points`, `compliance_rate`, `monthly_volume`) VALUES
('110105', '朝阳区', 3, '张主任', '138****1234', 350000, 45, 95.00, 12500.00),
('110108', '海淀区', 3, '李主任', '139****5678', 320000, 38, 88.00, 10200.00),
('110102', '西城区', 3, '王主任', '137****9012', 280000, 32, 93.00, 8900.00),
('110101', '东城区', 3, '赵主任', '136****3456', 260000, 28, 76.00, 7800.00),
('110106', '丰台区', 3, '刘主任', '135****7890', 290000, 25, 91.00, 6280.00);

-- 产业链基础数据
INSERT INTO `industry_chain_data` (`stage`, `report_date`, `volume`, `efficiency`, `companies`, `employees`, `revenue`, `growth_rate`) VALUES
('回收', CURDATE(), 45680.00, 92.00, 45, 1200, 12000000.00, 15.00),
('分拣', CURDATE(), 42130.00, 88.00, 28, 850, 8500000.00, 12.00),
('加工', CURDATE(), 38900.00, 85.00, 32, 980, 15000000.00, 18.00),
('再生', CURDATE(), 35200.00, 82.00, 25, 720, 18000000.00, 20.00);

-- 风险评估数据
INSERT INTO `risk_assessments` (`risk_type`, `level`, `title`, `content`, `probability`, `strategy`) VALUES
('市场风险', 'high', '再生塑料价格波动', '近3个月波动幅度达15%', 75, '建立价格调控机制，引入期货市场对冲'),
('政策风险', 'medium', '部分区域政策执行不到位', '监管力度不足', 55, '加强监管力度，建立考核机制'),
('技术风险', 'low', '分拣技术需要升级', '自动化水平有待提高', 30, '推动技术创新，引进先进设备'),
('环保风险', 'medium', '加工环节环保标准提高', '部分企业面临整改', 60, '制定过渡期政策，提供技术支持');
