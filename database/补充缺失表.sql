-- 补充创建C端和G端缺失的数据表
USE huanbao;

-- 先删除可能冲突的CREATE DATABASE语句，直接创建表
-- C端表（26张）
CREATE TABLE IF NOT EXISTS `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `phone` VARCHAR(20) NOT NULL COMMENT '手机号',
  `password` VARCHAR(255) NOT NULL COMMENT '密码(加密)',
  `nickname` VARCHAR(50) DEFAULT NULL COMMENT '昵称',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
  `avatar_index` INT DEFAULT 1 COMMENT '头像索引(预设头像)',
  `level` INT DEFAULT 1 COMMENT '用户等级 1-10',
  `level_name` VARCHAR(50) DEFAULT NULL COMMENT '等级名称',
  `level_progress` INT DEFAULT 0 COMMENT '等级进度 0-100',
  `total_points` INT DEFAULT 0 COMMENT '累计积分',
  `available_points` INT DEFAULT 0 COMMENT '可用积分',
  `total_cash` DECIMAL(10,2) DEFAULT 0.00 COMMENT '累计现金收益',
  `available_cash` DECIMAL(10,2) DEFAULT 0.00 COMMENT '可提现现金',
  `total_carbon` DECIMAL(10,2) DEFAULT 0.00 COMMENT '累计碳减排量(kg)',
  `recycle_count` INT DEFAULT 0 COMMENT '回收次数',
  `invite_code` VARCHAR(20) DEFAULT NULL COMMENT '用户邀请码',
  `invited_by` BIGINT UNSIGNED DEFAULT NULL COMMENT '邀请人ID',
  `status` TINYINT DEFAULT 1 COMMENT '状态: 0禁用 1正常',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `last_login_at` DATETIME DEFAULT NULL COMMENT '最后登录时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_phone` (`phone`),
  UNIQUE KEY `uk_invite_code` (`invite_code`),
  KEY `idx_invited_by` (`invited_by`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

CREATE TABLE IF NOT EXISTS `user_addresses` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `contact_name` VARCHAR(50) NOT NULL,
  `contact_phone` VARCHAR(20) NOT NULL,
  `province` VARCHAR(50) NOT NULL,
  `city` VARCHAR(50) NOT NULL,
  `district` VARCHAR(50) NOT NULL,
  `detail` VARCHAR(255) NOT NULL,
  `full_address` VARCHAR(500) DEFAULT NULL,
  `label` ENUM('home', 'company', 'school', 'other') DEFAULT NULL,
  `is_default` TINYINT DEFAULT 0,
  `longitude` DECIMAL(10,7) DEFAULT NULL,
  `latitude` DECIMAL(10,7) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户地址表';

CREATE TABLE IF NOT EXISTS `waste_categories` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `code` VARCHAR(30) NOT NULL,
  `icon` VARCHAR(100) DEFAULT NULL,
  `parent_id` BIGINT UNSIGNED DEFAULT 0,
  `price_per_kg` DECIMAL(10,2) DEFAULT 0.00,
  `points_per_kg` INT DEFAULT 0,
  `carbon_per_kg` DECIMAL(5,2) DEFAULT 0.00,
  `description` TEXT DEFAULT NULL,
  `tips` TEXT DEFAULT NULL,
  `recycling_info` TEXT DEFAULT NULL,
  `sort_order` INT DEFAULT 0,
  `status` TINYINT DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='废品分类表';

CREATE TABLE IF NOT EXISTS `collectors` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED DEFAULT NULL,
  `name` VARCHAR(50) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `avatar` VARCHAR(255) DEFAULT NULL,
  `rating` DECIMAL(3,2) DEFAULT 5.00,
  `service_count` INT DEFAULT 0,
  `working_area` VARCHAR(100) DEFAULT NULL,
  `longitude` DECIMAL(10,7) DEFAULT NULL,
  `latitude` DECIMAL(10,7) DEFAULT NULL,
  `status` ENUM('online', 'offline', 'busy') DEFAULT 'offline',
  `identity_verified` TINYINT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='回收员表';

CREATE TABLE IF NOT EXISTS `drop_points` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `longitude` DECIMAL(10,7) DEFAULT NULL,
  `latitude` DECIMAL(10,7) DEFAULT NULL,
  `category` VARCHAR(50) DEFAULT NULL,
  `contact_phone` VARCHAR(20) DEFAULT NULL,
  `opening_hours` VARCHAR(100) DEFAULT NULL,
  `status` TINYINT DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='投递点表';

CREATE TABLE IF NOT EXISTS `recycle_orders` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_no` VARCHAR(30) NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `collector_id` BIGINT UNSIGNED DEFAULT NULL,
  `category_id` BIGINT UNSIGNED DEFAULT NULL,
  `category_name` VARCHAR(50) DEFAULT NULL,
  `weight` DECIMAL(10,2) DEFAULT 0.00,
  `total_price` DECIMAL(10,2) DEFAULT 0.00,
  `points` INT DEFAULT 0,
  `carbon_reduction` DECIMAL(10,2) DEFAULT 0.00,
  `address_id` BIGINT UNSIGNED DEFAULT NULL,
  `full_address` VARCHAR(500) DEFAULT NULL,
  `contact_name` VARCHAR(50) DEFAULT NULL,
  `contact_phone` VARCHAR(20) DEFAULT NULL,
  `status` ENUM('pending', 'accepted', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
  `remark` TEXT DEFAULT NULL,
  `images` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `accepted_at` DATETIME DEFAULT NULL,
  `completed_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='回收订单表';

CREATE TABLE IF NOT EXISTS `earnings` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `order_id` BIGINT UNSIGNED DEFAULT NULL,
  `type` ENUM('cash', 'points') NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收益记录表';

CREATE TABLE IF NOT EXISTS `points_records` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `type` ENUM('earn', 'spend', 'expire') NOT NULL,
  `points` INT NOT NULL,
  `balance` INT DEFAULT 0,
  `source` VARCHAR(50) DEFAULT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='积分记录表';

CREATE TABLE IF NOT EXISTS `products` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `category` VARCHAR(50) DEFAULT NULL,
  `image` VARCHAR(255) DEFAULT NULL,
  `points_price` INT NOT NULL,
  `original_price` DECIMAL(10,2) DEFAULT NULL,
  `stock` INT DEFAULT 0,
  `description` TEXT DEFAULT NULL,
  `sort_order` INT DEFAULT 0,
  `status` TINYINT DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品表';

CREATE TABLE IF NOT EXISTS `exchange_records` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `product_name` VARCHAR(100) DEFAULT NULL,
  `points_cost` INT NOT NULL,
  `quantity` INT DEFAULT 1,
  `status` ENUM('pending', 'shipped', 'completed', 'cancelled') DEFAULT 'pending',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='积分兑换记录表';

CREATE TABLE IF NOT EXISTS `notifications` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `type` ENUM('system', 'activity', 'reward', 'order') NOT NULL,
  `title` VARCHAR(100) NOT NULL,
  `content` TEXT DEFAULT NULL,
  `link` VARCHAR(255) DEFAULT NULL,
  `is_read` TINYINT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='通知表';

CREATE TABLE IF NOT EXISTS `activities` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(100) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `content` TEXT DEFAULT NULL,
  `image` VARCHAR(255) DEFAULT NULL,
  `tag` VARCHAR(50) DEFAULT NULL,
  `type` VARCHAR(30) DEFAULT NULL,
  `start_time` DATETIME DEFAULT NULL,
  `end_time` DATETIME DEFAULT NULL,
  `reward_points` INT DEFAULT 0,
  `reward_cash` DECIMAL(10,2) DEFAULT 0.00,
  `sort_order` INT DEFAULT 0,
  `status` TINYINT DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='活动表';

CREATE TABLE IF NOT EXISTS `invite_records` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `inviter_id` BIGINT UNSIGNED NOT NULL,
  `invitee_id` BIGINT UNSIGNED NOT NULL,
  `reward_points` INT DEFAULT 0,
  `reward_cash` DECIMAL(10,2) DEFAULT 0.00,
  `status` TINYINT DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_inviter_id` (`inviter_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='邀请记录表';

CREATE TABLE IF NOT EXISTS `checkin_records` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `checkin_date` DATE NOT NULL,
  `reward_points` INT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_date` (`user_id`, `checkin_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='签到记录表';

CREATE TABLE IF NOT EXISTS `tasks` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `type` ENUM('daily', 'weekly', 'once') NOT NULL,
  `icon` VARCHAR(100) DEFAULT NULL,
  `reward_points` INT DEFAULT 0,
  `target_count` INT DEFAULT 1,
  `action` VARCHAR(50) DEFAULT NULL,
  `sort_order` INT DEFAULT 0,
  `status` TINYINT DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='任务表';

CREATE TABLE IF NOT EXISTS `user_tasks` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `task_id` BIGINT UNSIGNED NOT NULL,
  `progress` INT DEFAULT 0,
  `target` INT DEFAULT 1,
  `status` ENUM('in_progress', 'completed', 'expired') DEFAULT 'in_progress',
  `completed_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户任务进度表';

CREATE TABLE IF NOT EXISTS `withdraw_records` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `fee` DECIMAL(10,2) DEFAULT 0.00,
  `actual_amount` DECIMAL(10,2) DEFAULT 0.00,
  `status` ENUM('pending', 'processing', 'success', 'failed') DEFAULT 'pending',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='提现记录表';

CREATE TABLE IF NOT EXISTS `donation_records` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `project_id` BIGINT UNSIGNED DEFAULT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='捐赠记录表';

CREATE TABLE IF NOT EXISTS `donation_projects` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `target_amount` DECIMAL(12,2) DEFAULT 0.00,
  `current_amount` DECIMAL(12,2) DEFAULT 0.00,
  `status` TINYINT DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='捐赠项目表';

CREATE TABLE IF NOT EXISTS `scan_history` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `detected_class` VARCHAR(50) NOT NULL,
  `detected_name` VARCHAR(50) DEFAULT NULL,
  `confidence` DECIMAL(5,4) DEFAULT 0.0000,
  `image` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='AR扫描记录表';

CREATE TABLE IF NOT EXISTS `favorites` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `type` ENUM('collector', 'drop_point', 'product', 'article') NOT NULL,
  `target_id` BIGINT UNSIGNED NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收藏表';

CREATE TABLE IF NOT EXISTS `order_reviews` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `collector_id` BIGINT UNSIGNED DEFAULT NULL,
  `rating` INT NOT NULL,
  `content` TEXT DEFAULT NULL,
  `images` TEXT DEFAULT NULL,
  `tags` TEXT DEFAULT NULL,
  `is_anonymous` TINYINT DEFAULT 0,
  `reply` TEXT DEFAULT NULL,
  `reply_time` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单评价表';

CREATE TABLE IF NOT EXISTS `user_badges` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `badge_id` BIGINT UNSIGNED NOT NULL,
  `unlocked_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_badge` (`user_id`, `badge_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户成就徽章表';

CREATE TABLE IF NOT EXISTS `badges` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `icon` VARCHAR(100) DEFAULT NULL,
  `condition_type` VARCHAR(50) DEFAULT NULL,
  `condition_value` INT DEFAULT 0,
  `reward_points` INT DEFAULT 0,
  `sort_order` INT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='徽章定义表';

CREATE TABLE IF NOT EXISTS `customer_service_sessions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `status` ENUM('open', 'closed') DEFAULT 'open',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `closed_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='客服会话表';

CREATE TABLE IF NOT EXISTS `customer_service_messages` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `session_id` BIGINT UNSIGNED NOT NULL,
  `sender_type` ENUM('user', 'service', 'system') NOT NULL,
  `sender_id` BIGINT UNSIGNED DEFAULT NULL,
  `content` TEXT NOT NULL,
  `content_type` ENUM('text', 'image', 'file') DEFAULT 'text',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_session_id` (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='客服消息表';

-- G端表（17张）
CREATE TABLE IF NOT EXISTS `government_users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `real_name` VARCHAR(50) NOT NULL,
  `department` VARCHAR(100) DEFAULT NULL,
  `position` VARCHAR(50) DEFAULT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `email` VARCHAR(100) DEFAULT NULL,
  `region_id` BIGINT UNSIGNED DEFAULT NULL,
  `role` VARCHAR(30) DEFAULT 'operator',
  `permissions` TEXT DEFAULT NULL,
  `status` TINYINT DEFAULT 1,
  `last_login_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='政府用户表';

CREATE TABLE IF NOT EXISTS `administrative_regions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `region_code` VARCHAR(20) NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `level` TINYINT NOT NULL,
  `parent_id` BIGINT UNSIGNED DEFAULT 0,
  `parent_codes` VARCHAR(255) DEFAULT NULL,
  `longitude` DECIMAL(10,7) DEFAULT NULL,
  `latitude` DECIMAL(10,7) DEFAULT NULL,
  `population` INT DEFAULT 0,
  `area` DECIMAL(10,2) DEFAULT 0.00,
  `manager_id` BIGINT UNSIGNED DEFAULT NULL,
  `status` TINYINT DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_region_code` (`region_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='行政区划表';

CREATE TABLE IF NOT EXISTS `government_warnings` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `warning_no` VARCHAR(30) NOT NULL,
  `type` ENUM('violation', 'anomaly', 'complaint', 'environmental') NOT NULL,
  `level` ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  `region_id` BIGINT UNSIGNED DEFAULT NULL,
  `region_name` VARCHAR(50) DEFAULT NULL,
  `title` VARCHAR(200) NOT NULL,
  `content` TEXT DEFAULT NULL,
  `source` VARCHAR(100) DEFAULT NULL,
  `evidence` TEXT DEFAULT NULL,
  `enterprise_id` BIGINT UNSIGNED DEFAULT NULL,
  `enterprise_name` VARCHAR(100) DEFAULT NULL,
  `handler_id` BIGINT UNSIGNED DEFAULT NULL,
  `handler_name` VARCHAR(50) DEFAULT NULL,
  `handle_result` TEXT DEFAULT NULL,
  `status` ENUM('pending', 'investigating', 'resolved', 'closed') DEFAULT 'pending',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `resolved_at` DATETIME DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_warning_no` (`warning_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='政府预警信息表';

CREATE TABLE IF NOT EXISTS `recycle_stations` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `station_no` VARCHAR(30) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `enterprise_id` BIGINT UNSIGNED DEFAULT NULL,
  `enterprise_name` VARCHAR(100) DEFAULT NULL,
  `region_id` BIGINT UNSIGNED DEFAULT NULL,
  `address` VARCHAR(255) DEFAULT NULL,
  `longitude` DECIMAL(10,7) DEFAULT NULL,
  `latitude` DECIMAL(10,7) DEFAULT NULL,
  `capacity` DECIMAL(10,2) DEFAULT 0.00,
  `current_volume` DECIMAL(10,2) DEFAULT 0.00,
  `license_no` VARCHAR(50) DEFAULT NULL,
  `license_expire_date` DATE DEFAULT NULL,
  `compliance_score` INT DEFAULT 0,
  `status` ENUM('active', 'suspended', 'closed') DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_station_no` (`station_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='回收站点表';

CREATE TABLE IF NOT EXISTS `industry_chain_data` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `region_id` BIGINT UNSIGNED DEFAULT NULL,
  `stage` VARCHAR(30) NOT NULL,
  `category` VARCHAR(50) DEFAULT NULL,
  `volume` DECIMAL(12,2) DEFAULT 0.00,
  `value` DECIMAL(14,2) DEFAULT 0.00,
  `enterprise_count` INT DEFAULT 0,
  `employment` INT DEFAULT 0,
  `data_date` DATE NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='产业链数据表';

CREATE TABLE IF NOT EXISTS `region_statistics` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `region_id` BIGINT UNSIGNED NOT NULL,
  `region_name` VARCHAR(50) DEFAULT NULL,
  `total_recycle_weight` DECIMAL(12,2) DEFAULT 0.00,
  `total_users` INT DEFAULT 0,
  `total_enterprises` INT DEFAULT 0,
  `total_stations` INT DEFAULT 0,
  `recycle_rate` DECIMAL(5,2) DEFAULT 0.00,
  `carbon_reduction` DECIMAL(12,2) DEFAULT 0.00,
  `economic_value` DECIMAL(14,2) DEFAULT 0.00,
  `compliance_rate` DECIMAL(5,2) DEFAULT 0.00,
  `stat_date` DATE NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='区域统计数据表';

CREATE TABLE IF NOT EXISTS `category_statistics` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `region_id` BIGINT UNSIGNED DEFAULT NULL,
  `category` VARCHAR(50) NOT NULL,
  `recycle_weight` DECIMAL(12,2) DEFAULT 0.00,
  `growth_rate` DECIMAL(5,2) DEFAULT 0.00,
  `market_price` DECIMAL(10,2) DEFAULT 0.00,
  `carbon_reduction` DECIMAL(10,2) DEFAULT 0.00,
  `recycling_rate` DECIMAL(5,2) DEFAULT 0.00,
  `top_enterprises` TEXT DEFAULT NULL,
  `stat_date` DATE NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='品类统计数据表';

CREATE TABLE IF NOT EXISTS `risk_assessments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `region_id` BIGINT UNSIGNED DEFAULT NULL,
  `risk_type` VARCHAR(50) NOT NULL,
  `level` ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  `title` VARCHAR(200) NOT NULL,
  `content` TEXT DEFAULT NULL,
  `impact` TEXT DEFAULT NULL,
  `probability` INT DEFAULT 0,
  `strategy` TEXT DEFAULT NULL,
  `status` ENUM('active', 'mitigated', 'closed') DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='风险评估表';

CREATE TABLE IF NOT EXISTS `subsidy_applications` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `application_no` VARCHAR(30) NOT NULL,
  `enterprise_id` BIGINT UNSIGNED NOT NULL,
  `enterprise_name` VARCHAR(100) DEFAULT NULL,
  `subsidy_type` VARCHAR(50) NOT NULL,
  `amount` DECIMAL(12,2) NOT NULL,
  `purpose` TEXT DEFAULT NULL,
  `materials` TEXT DEFAULT NULL,
  `apply_date` DATE NOT NULL,
  `status` ENUM('pending', 'reviewing', 'approved', 'rejected', 'paid') DEFAULT 'pending',
  `blockchain_hash` VARCHAR(100) DEFAULT NULL,
  `blockchain_status` ENUM('verified', 'verifying', 'failed') DEFAULT 'verifying',
  `reviewer_id` BIGINT UNSIGNED DEFAULT NULL,
  `reviewer_name` VARCHAR(50) DEFAULT NULL,
  `review_time` DATETIME DEFAULT NULL,
  `review_comment` TEXT DEFAULT NULL,
  `reject_reason` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_application_no` (`application_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='补贴申请表';

CREATE TABLE IF NOT EXISTS `subsidy_payments` (
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
  `effectiveness` INT DEFAULT 0,
  `status` ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='补贴发放记录表';

CREATE TABLE IF NOT EXISTS `policy_evaluations` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `policy_id` BIGINT UNSIGNED DEFAULT NULL,
  `policy_name` VARCHAR(200) DEFAULT NULL,
  `region_id` BIGINT UNSIGNED DEFAULT NULL,
  `eval_date` DATE NOT NULL,
  `eval_period` VARCHAR(50) DEFAULT NULL,
  `subsidy_amount` DECIMAL(14,2) DEFAULT 0,
  `recycle_growth` DECIMAL(5,2) DEFAULT 0,
  `participation_rate` DECIMAL(5,2) DEFAULT 0,
  `satisfaction_rate` DECIMAL(5,2) DEFAULT 0,
  `cost_benefit_ratio` DECIMAL(5,2) DEFAULT 0,
  `indicators` TEXT DEFAULT NULL,
  `conclusion` TEXT DEFAULT NULL,
  `suggestions` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='政策效果评估表';

CREATE TABLE IF NOT EXISTS `ai_generated_reports` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `report_no` VARCHAR(30) NOT NULL,
  `report_type` VARCHAR(50) NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `summary` TEXT DEFAULT NULL,
  `content` LONGTEXT DEFAULT NULL,
  `charts_data` TEXT DEFAULT NULL,
  `region_id` BIGINT UNSIGNED DEFAULT NULL,
  `report_date` DATE NOT NULL,
  `generated_by` VARCHAR(50) DEFAULT 'AI',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_report_no` (`report_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='AI生成报告表';

CREATE TABLE IF NOT EXISTS `compliance_checks` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `check_no` VARCHAR(30) NOT NULL,
  `enterprise_id` BIGINT UNSIGNED NOT NULL,
  `enterprise_name` VARCHAR(100) DEFAULT NULL,
  `check_type` VARCHAR(50) DEFAULT NULL,
  `check_date` DATE NOT NULL,
  `checker_id` BIGINT UNSIGNED DEFAULT NULL,
  `checker_name` VARCHAR(50) DEFAULT NULL,
  `check_items` TEXT DEFAULT NULL,
  `score` INT DEFAULT 0,
  `issues` TEXT DEFAULT NULL,
  `suggestions` TEXT DEFAULT NULL,
  `status` ENUM('passed', 'warning', 'failed') DEFAULT 'passed',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_check_no` (`check_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='合规检查记录表';

CREATE TABLE IF NOT EXISTS `policy_simulations` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `simulation_type` VARCHAR(50) DEFAULT NULL,
  `parameters` TEXT DEFAULT NULL,
  `results` TEXT DEFAULT NULL,
  `charts_data` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='政策模拟记录表';

CREATE TABLE IF NOT EXISTS `government_notices` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(200) NOT NULL,
  `content` LONGTEXT DEFAULT NULL,
  `type` VARCHAR(30) DEFAULT NULL,
  `priority` ENUM('low', 'medium', 'high') DEFAULT 'medium',
  `target_regions` TEXT DEFAULT NULL,
  `target_enterprises` TEXT DEFAULT NULL,
  `publisher_id` BIGINT UNSIGNED DEFAULT NULL,
  `publisher_name` VARCHAR(50) DEFAULT NULL,
  `publish_date` DATE NOT NULL,
  `status` TINYINT DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='公告通知表';

CREATE TABLE IF NOT EXISTS `government_operation_logs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `user_name` VARCHAR(50) DEFAULT NULL,
  `operation` VARCHAR(100) NOT NULL,
  `module` VARCHAR(50) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `ip_address` VARCHAR(50) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='操作日志表';

CREATE TABLE IF NOT EXISTS `notification_settings` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `system_alerts` TINYINT DEFAULT 1,
  `policy_updates` TINYINT DEFAULT 1,
  `data_reports` TINYINT DEFAULT 1,
  `compliance_warnings` TINYINT DEFAULT 1,
  `email_enabled` TINYINT DEFAULT 1,
  `sms_enabled` TINYINT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='通知设置表';

-- 完成
SELECT '所有缺失表已创建完成！' AS message;
