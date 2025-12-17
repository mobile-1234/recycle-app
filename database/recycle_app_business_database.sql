-- ============================================
-- 废品回收APP B端(企业端)数据库设计
-- 数据库名: recycle_app (与C端共用)
-- ============================================

USE recycle_app;

-- 1. 企业表
CREATE TABLE `enterprises` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL COMMENT '企业名称',
  `code` VARCHAR(50) NOT NULL COMMENT '统一社会信用代码',
  `type` VARCHAR(50) DEFAULT NULL COMMENT '企业类型',
  `legal_person` VARCHAR(50) DEFAULT NULL COMMENT '法定代表人',
  `phone` VARCHAR(20) DEFAULT NULL,
  `email` VARCHAR(100) DEFAULT NULL,
  `address` VARCHAR(255) DEFAULT NULL,
  `registered_capital` VARCHAR(50) DEFAULT NULL COMMENT '注册资本',
  `establish_date` DATE DEFAULT NULL COMMENT '成立日期',
  `logo` VARCHAR(255) DEFAULT NULL,
  `status` TINYINT DEFAULT 1,
  `verified` TINYINT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='企业表';

-- 2. 企业员工表
CREATE TABLE `enterprise_employees` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `enterprise_id` BIGINT UNSIGNED NOT NULL,
  `employee_no` VARCHAR(30) DEFAULT NULL,
  `name` VARCHAR(50) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `role` VARCHAR(50) NOT NULL COMMENT '角色:admin/collector/finance',
  `department` VARCHAR(50) DEFAULT NULL,
  `status` ENUM('active', 'inactive') DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_enterprise_id` (`enterprise_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='企业员工表';

-- 3. 合同表
CREATE TABLE `contracts` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `enterprise_id` BIGINT UNSIGNED NOT NULL,
  `contract_no` VARCHAR(50) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `amount` DECIMAL(12,2) DEFAULT 0.00,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `status` ENUM('pending', 'active', 'expired') DEFAULT 'pending',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_enterprise_id` (`enterprise_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='合同表';

-- 4. 订阅套餐表
CREATE TABLE `subscription_plans` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(30) NOT NULL COMMENT 'basic/professional/enterprise',
  `name` VARCHAR(50) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `unit` VARCHAR(20) DEFAULT '月',
  `max_users` INT DEFAULT 0,
  `storage_limit` VARCHAR(20) DEFAULT NULL,
  `features` TEXT DEFAULT NULL COMMENT 'JSON',
  `is_popular` TINYINT DEFAULT 0,
  `status` TINYINT DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订阅套餐表';

-- 5. 企业订阅记录表
CREATE TABLE `enterprise_subscriptions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `enterprise_id` BIGINT UNSIGNED NOT NULL,
  `plan_id` BIGINT UNSIGNED NOT NULL,
  `plan_name` VARCHAR(50) DEFAULT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `amount` DECIMAL(10,2) DEFAULT 0.00,
  `max_users` INT DEFAULT 0,
  `used_users` INT DEFAULT 0,
  `status` ENUM('active', 'expired', 'cancelled') DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_enterprise_id` (`enterprise_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='企业订阅记录表';

-- 6. B端订单表
CREATE TABLE `business_orders` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_no` VARCHAR(30) NOT NULL,
  `enterprise_id` BIGINT UNSIGNED NOT NULL,
  `consumer_order_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '关联C端订单',
  `customer_name` VARCHAR(50) DEFAULT NULL,
  `customer_phone` VARCHAR(20) DEFAULT NULL,
  `category_name` VARCHAR(50) DEFAULT NULL,
  `weight` DECIMAL(10,2) DEFAULT 0.00,
  `estimated_value` DECIMAL(10,2) DEFAULT 0.00,
  `area` VARCHAR(50) DEFAULT NULL,
  `address` VARCHAR(500) DEFAULT NULL,
  `collector_id` BIGINT UNSIGNED DEFAULT NULL,
  `collector_name` VARCHAR(50) DEFAULT NULL,
  `collector_phone` VARCHAR(20) DEFAULT NULL,
  `settlement_amount` DECIMAL(10,2) DEFAULT NULL,
  `settlement_status` ENUM('unsettled', 'settled') DEFAULT 'unsettled',
  `status` ENUM('pending', 'in-progress', 'completed', 'cancelled') DEFAULT 'pending',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_enterprise_id` (`enterprise_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='B端订单表';

-- 7. 设备表
CREATE TABLE `devices` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `device_no` VARCHAR(30) NOT NULL,
  `enterprise_id` BIGINT UNSIGNED NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `type` VARCHAR(50) NOT NULL COMMENT '分拣/压缩/粉碎/分选/打包',
  `model` VARCHAR(50) DEFAULT NULL,
  `location` VARCHAR(100) DEFAULT NULL,
  `status` ENUM('online', 'offline', 'maintenance', 'warning') DEFAULT 'offline',
  `running_time` INT DEFAULT 0 COMMENT '运行时长(小时)',
  `processed_volume` DECIMAL(12,2) DEFAULT 0.00 COMMENT '处理量(kg)',
  `efficiency` DECIMAL(5,2) DEFAULT 0.00,
  `temperature` DECIMAL(5,2) DEFAULT NULL,
  `pressure` DECIMAL(5,2) DEFAULT NULL,
  `last_maintenance` DATE DEFAULT NULL,
  `next_maintenance` DATE DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_device_no` (`device_no`),
  KEY `idx_enterprise_id` (`enterprise_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='设备表';

-- 8. 设备维护记录表
CREATE TABLE `device_maintenance` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `device_id` BIGINT UNSIGNED NOT NULL,
  `enterprise_id` BIGINT UNSIGNED NOT NULL,
  `type` ENUM('routine', 'repair', 'emergency') NOT NULL,
  `title` VARCHAR(100) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `cost` DECIMAL(10,2) DEFAULT 0.00,
  `technician` VARCHAR(50) DEFAULT NULL,
  `start_time` DATETIME DEFAULT NULL,
  `end_time` DATETIME DEFAULT NULL,
  `status` ENUM('planned', 'in-progress', 'completed') DEFAULT 'planned',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_device_id` (`device_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='设备维护记录表';

-- 9. 设备告警表
CREATE TABLE `device_alerts` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `device_id` BIGINT UNSIGNED NOT NULL,
  `enterprise_id` BIGINT UNSIGNED NOT NULL,
  `type` ENUM('temperature', 'pressure', 'efficiency', 'error') NOT NULL,
  `level` ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  `title` VARCHAR(100) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `status` ENUM('active', 'acknowledged', 'resolved') DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_device_id` (`device_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='设备告警表';

-- 10. 监控点位表
CREATE TABLE `monitoring_locations` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `enterprise_id` BIGINT UNSIGNED NOT NULL,
  `location_no` VARCHAR(30) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `type` ENUM('community', 'mall', 'school', 'office') NOT NULL,
  `address` VARCHAR(255) DEFAULT NULL,
  `longitude` DECIMAL(10,7) DEFAULT NULL,
  `latitude` DECIMAL(10,7) DEFAULT NULL,
  `capacity` DECIMAL(10,2) DEFAULT 1000.00,
  `current_volume` DECIMAL(10,2) DEFAULT 0.00,
  `recycle_volume` DECIMAL(10,2) DEFAULT 0.00,
  `status` ENUM('normal', 'warning', 'critical') DEFAULT 'normal',
  `last_update` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_enterprise_id` (`enterprise_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='监控点位表';

-- 11. 统计报表表
CREATE TABLE `statistics_reports` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `enterprise_id` BIGINT UNSIGNED NOT NULL,
  `report_type` ENUM('daily', 'weekly', 'monthly', 'yearly') NOT NULL,
  `report_date` DATE NOT NULL,
  `total_recycle_weight` DECIMAL(12,2) DEFAULT 0.00,
  `total_revenue` DECIMAL(12,2) DEFAULT 0.00,
  `total_orders` INT DEFAULT 0,
  `new_users` INT DEFAULT 0,
  `carbon_reduction` DECIMAL(10,2) DEFAULT 0.00,
  `water_saving` DECIMAL(10,2) DEFAULT 0.00,
  `electricity_saving` DECIMAL(10,2) DEFAULT 0.00,
  `category_data` TEXT DEFAULT NULL COMMENT 'JSON',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_enterprise_id` (`enterprise_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='统计报表表';

-- 12. 预警信息表
CREATE TABLE `business_alerts` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `enterprise_id` BIGINT UNSIGNED NOT NULL,
  `type` ENUM('order', 'device', 'inventory', 'finance') NOT NULL,
  `level` ENUM('low', 'medium', 'high') DEFAULT 'medium',
  `title` VARCHAR(100) NOT NULL,
  `content` TEXT DEFAULT NULL,
  `icon` VARCHAR(50) DEFAULT NULL,
  `status` ENUM('active', 'processed', 'ignored') DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_enterprise_id` (`enterprise_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='预警信息表';

-- 13. 待办事项表
CREATE TABLE `business_todos` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `enterprise_id` BIGINT UNSIGNED NOT NULL,
  `title` VARCHAR(100) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `type` VARCHAR(50) DEFAULT NULL,
  `icon` VARCHAR(50) DEFAULT NULL,
  `count` INT DEFAULT 0,
  `priority` ENUM('low', 'medium', 'high') DEFAULT 'medium',
  `action_url` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('pending', 'completed') DEFAULT 'pending',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_enterprise_id` (`enterprise_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='待办事项表';

-- 14. AI会话记录表
CREATE TABLE `ai_chat_history` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `enterprise_id` BIGINT UNSIGNED NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `session_id` VARCHAR(50) NOT NULL,
  `role` ENUM('user', 'assistant') NOT NULL,
  `content` LONGTEXT NOT NULL,
  `attachments` TEXT DEFAULT NULL COMMENT 'JSON',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_session_id` (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='AI会话记录表';

-- 15. AI智能洞察表
CREATE TABLE `ai_insights` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `enterprise_id` BIGINT UNSIGNED NOT NULL,
  `type` ENUM('warning', 'info', 'success') NOT NULL,
  `title` VARCHAR(100) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `icon` VARCHAR(50) DEFAULT NULL,
  `action_url` VARCHAR(255) DEFAULT NULL,
  `is_read` TINYINT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_enterprise_id` (`enterprise_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='AI智能洞察表';

-- 16. 政策补贴表
CREATE TABLE `policies` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(200) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `issuer` VARCHAR(100) DEFAULT NULL COMMENT '发布机构',
  `amount_range` VARCHAR(100) DEFAULT NULL COMMENT '补贴金额范围',
  `deadline` DATE DEFAULT NULL COMMENT '截止日期',
  `requirements` TEXT DEFAULT NULL COMMENT 'JSON',
  `status` ENUM('available', 'expired') DEFAULT 'available',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='政策补贴表';

-- 17. 政策申请记录表
CREATE TABLE `policy_applications` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `enterprise_id` BIGINT UNSIGNED NOT NULL,
  `policy_id` BIGINT UNSIGNED NOT NULL,
  `policy_title` VARCHAR(200) DEFAULT NULL,
  `materials` TEXT DEFAULT NULL COMMENT '申请材料JSON',
  `status` ENUM('pending', 'submitted', 'approved', 'rejected') DEFAULT 'pending',
  `submit_at` DATETIME DEFAULT NULL,
  `result_at` DATETIME DEFAULT NULL,
  `remark` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_enterprise_id` (`enterprise_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='政策申请记录表';

-- 18. 登录日志表
CREATE TABLE `login_logs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `enterprise_id` BIGINT UNSIGNED DEFAULT NULL,
  `login_time` DATETIME NOT NULL,
  `ip` VARCHAR(50) DEFAULT NULL,
  `location` VARCHAR(100) DEFAULT NULL,
  `device` VARCHAR(200) DEFAULT NULL,
  `browser` VARCHAR(100) DEFAULT NULL,
  `status` ENUM('success', 'failed') DEFAULT 'success',
  `fail_reason` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_login_time` (`login_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='登录日志表';

-- ============================================
-- 初始化B端基础数据
-- ============================================

-- 订阅套餐
INSERT INTO `subscription_plans` (`code`, `name`, `price`, `unit`, `max_users`, `storage_limit`, `features`, `is_popular`) VALUES
('basic', '基础版', 999.00, '月', 10, '100GB', '["基础回收管理","订单处理","数据报表","邮件支持"]', 0),
('professional', '专业版', 2999.00, '月', 50, '500GB', '["所有基础功能","AI智能助手","高级数据分析","员工管理","合同管理","7x24小时支持"]', 1),
('enterprise', '企业版', 9999.00, '月', 0, '2TB', '["所有专业功能","专属客户经理","定制化开发","API接口","多地域部署","数据安全保障","SLA保证"]', 0);

-- 政策补贴
INSERT INTO `policies` (`title`, `description`, `issuer`, `amount_range`, `deadline`, `requirements`) VALUES
('再生资源企业补贴', '符合条件的回收企业可申请政府补贴', '生态环境部', '¥50,000 - ¥200,000', '2025-12-31', '["年回收量≥500吨","环保资质齐全","无违规记录"]'),
('智能化改造专项资金', '支持企业进行智能化数字化改造', '工信部', '¥100,000 - ¥500,000', '2025-11-30', '["投资额≥50万","技术方案审核通过","3年内完成改造"]');
