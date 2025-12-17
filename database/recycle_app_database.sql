-- ============================================
-- 废品回收APP C端数据库设计
-- 数据库名: recycle_app
-- 创建时间: 2024
-- ============================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS recycle_app DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE recycle_app;

-- ============================================
-- 1. 用户表 (users)
-- 页面: 登录、注册、个人中心
-- ============================================
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `phone` VARCHAR(20) NOT NULL COMMENT '手机号',
  `password` VARCHAR(255) NOT NULL COMMENT '密码(加密)',
  `nickname` VARCHAR(50) DEFAULT '环保达人' COMMENT '昵称',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
  `avatar_index` INT DEFAULT 1 COMMENT '头像索引(预设头像)',
  `level` INT DEFAULT 1 COMMENT '用户等级 1-10',
  `level_name` VARCHAR(50) DEFAULT 'LV1 环保新手' COMMENT '等级名称',
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

-- ============================================
-- 2. 用户地址表 (user_addresses)
-- 页面: 地址管理、预约回收
-- ============================================
CREATE TABLE `user_addresses` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '地址ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `contact_name` VARCHAR(50) NOT NULL COMMENT '联系人姓名',
  `contact_phone` VARCHAR(20) NOT NULL COMMENT '联系电话',
  `province` VARCHAR(50) NOT NULL COMMENT '省份',
  `city` VARCHAR(50) NOT NULL COMMENT '城市',
  `district` VARCHAR(50) NOT NULL COMMENT '区县',
  `detail` VARCHAR(255) NOT NULL COMMENT '详细地址',
  `full_address` VARCHAR(500) DEFAULT NULL COMMENT '完整地址',
  `label` ENUM('home', 'company', 'school', 'other') DEFAULT NULL COMMENT '地址标签',
  `is_default` TINYINT DEFAULT 0 COMMENT '是否默认地址: 0否 1是',
  `longitude` DECIMAL(10,7) DEFAULT NULL COMMENT '经度',
  `latitude` DECIMAL(10,7) DEFAULT NULL COMMENT '纬度',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_is_default` (`is_default`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户地址表';

-- ============================================
-- 3. 废品分类表 (waste_categories)
-- 页面: 预约回收、AR识别
-- ============================================
CREATE TABLE `waste_categories` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `name` VARCHAR(50) NOT NULL COMMENT '分类名称',
  `code` VARCHAR(30) NOT NULL COMMENT '分类编码',
  `icon` VARCHAR(100) DEFAULT NULL COMMENT '图标',
  `parent_id` BIGINT UNSIGNED DEFAULT 0 COMMENT '父分类ID',
  `price_per_kg` DECIMAL(10,2) DEFAULT 0.00 COMMENT '每公斤单价',
  `points_per_kg` INT DEFAULT 0 COMMENT '每公斤积分',
  `carbon_per_kg` DECIMAL(5,2) DEFAULT 0.00 COMMENT '每公斤碳减排量',
  `description` TEXT DEFAULT NULL COMMENT '描述',
  `tips` TEXT DEFAULT NULL COMMENT '回收提示(JSON)',
  `recycling_info` TEXT DEFAULT NULL COMMENT '回收信息(JSON)',
  `sort_order` INT DEFAULT 0 COMMENT '排序',
  `status` TINYINT DEFAULT 1 COMMENT '状态: 0禁用 1启用',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`),
  KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='废品分类表';

-- ============================================
-- 4. 回收员表 (collectors)
-- 页面: 首页附近回收员、回收员列表
-- ============================================
CREATE TABLE `collectors` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '回收员ID',
  `user_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '关联用户ID',
  `name` VARCHAR(50) NOT NULL COMMENT '姓名',
  `phone` VARCHAR(20) NOT NULL COMMENT '电话',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像',
  `id_card` VARCHAR(20) DEFAULT NULL COMMENT '身份证号',
  `rating` DECIMAL(2,1) DEFAULT 5.0 COMMENT '评分 1.0-5.0',
  `review_count` INT DEFAULT 0 COMMENT '评价数量',
  `completed_orders` INT DEFAULT 0 COMMENT '完成订单数',
  `experience` VARCHAR(50) DEFAULT NULL COMMENT '经验描述',
  `specialties` TEXT DEFAULT NULL COMMENT '擅长类目(JSON数组)',
  `service_area` VARCHAR(255) DEFAULT NULL COMMENT '服务区域',
  `working_hours` VARCHAR(50) DEFAULT NULL COMMENT '工作时间',
  `response_time` VARCHAR(50) DEFAULT NULL COMMENT '响应时间',
  `price_range` VARCHAR(100) DEFAULT NULL COMMENT '价格范围',
  `features` TEXT DEFAULT NULL COMMENT '服务特色(JSON数组)',
  `status` ENUM('online', 'busy', 'offline') DEFAULT 'offline' COMMENT '状态',
  `longitude` DECIMAL(10,7) DEFAULT NULL COMMENT '当前经度',
  `latitude` DECIMAL(10,7) DEFAULT NULL COMMENT '当前纬度',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_rating` (`rating`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='回收员表';

-- ============================================
-- 5. 投递点表 (drop_points)
-- 页面: 首页投递点、投递点列表
-- ============================================
CREATE TABLE `drop_points` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '投递点ID',
  `name` VARCHAR(100) NOT NULL COMMENT '名称',
  `address` VARCHAR(255) NOT NULL COMMENT '地址',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '联系电话',
  `longitude` DECIMAL(10,7) NOT NULL COMMENT '经度',
  `latitude` DECIMAL(10,7) NOT NULL COMMENT '纬度',
  `rating` DECIMAL(2,1) DEFAULT 5.0 COMMENT '评分',
  `capacity` INT DEFAULT 100 COMMENT '容量百分比 0-100',
  `supported_types` TEXT DEFAULT NULL COMMENT '支持类型(JSON数组)',
  `working_hours` VARCHAR(50) DEFAULT NULL COMMENT '营业时间',
  `features` TEXT DEFAULT NULL COMMENT '特色服务(JSON数组)',
  `status` ENUM('open', 'busy', 'closed') DEFAULT 'open' COMMENT '状态',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`),
  KEY `idx_location` (`longitude`, `latitude`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='投递点表';

-- ============================================
-- 6. 回收订单表 (recycle_orders)
-- 页面: 预约回收、我的订单、收益明细
-- ============================================
CREATE TABLE `recycle_orders` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  `order_no` VARCHAR(30) NOT NULL COMMENT '订单编号',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `collector_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '回收员ID',
  `drop_point_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '投递点ID',
  `category_id` BIGINT UNSIGNED NOT NULL COMMENT '废品分类ID',
  `category_name` VARCHAR(50) DEFAULT NULL COMMENT '废品分类名称',
  `recycle_method` ENUM('pickup', 'dropoff') NOT NULL COMMENT '回收方式: pickup上门 dropoff自助',
  `weight` DECIMAL(10,2) DEFAULT 0.00 COMMENT '重量(kg)',
  `estimated_weight` DECIMAL(10,2) DEFAULT 0.00 COMMENT '预估重量(kg)',
  `price_per_kg` DECIMAL(10,2) DEFAULT 0.00 COMMENT '单价(元/kg)',
  `cash_amount` DECIMAL(10,2) DEFAULT 0.00 COMMENT '现金金额',
  `points_amount` INT DEFAULT 0 COMMENT '积分金额',
  `carbon_reduction` DECIMAL(10,2) DEFAULT 0.00 COMMENT '碳减排量(kg)',
  `contact_name` VARCHAR(50) NOT NULL COMMENT '联系人',
  `contact_phone` VARCHAR(20) NOT NULL COMMENT '联系电话',
  `address` VARCHAR(500) NOT NULL COMMENT '地址',
  `scheduled_date` DATE DEFAULT NULL COMMENT '预约日期',
  `scheduled_time` VARCHAR(30) DEFAULT NULL COMMENT '预约时间段',
  `time_option` ENUM('immediate', 'scheduled') DEFAULT 'immediate' COMMENT '时间选项',
  `notes` TEXT DEFAULT NULL COMMENT '备注',
  `photos` TEXT DEFAULT NULL COMMENT '照片(JSON数组)',
  `additional_services` TEXT DEFAULT NULL COMMENT '附加服务(JSON数组)',
  `service_fee` DECIMAL(10,2) DEFAULT 0.00 COMMENT '服务费',
  `status` ENUM('pending', 'accepted', 'processing', 'completed', 'cancelled') DEFAULT 'pending' COMMENT '状态',
  `cancel_reason` VARCHAR(255) DEFAULT NULL COMMENT '取消原因',
  `completed_at` DATETIME DEFAULT NULL COMMENT '完成时间',
  `rated` TINYINT DEFAULT 0 COMMENT '是否已评价',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_collector_id` (`collector_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='回收订单表';

-- ============================================
-- 7. 收益记录表 (earnings)
-- 页面: 收益明细
-- ============================================
CREATE TABLE `earnings` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `order_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '关联订单ID',
  `type` ENUM('recycle', 'invite', 'task', 'checkin', 'activity', 'withdraw', 'donation') NOT NULL COMMENT '类型',
  `cash_amount` DECIMAL(10,2) DEFAULT 0.00 COMMENT '现金金额',
  `points_amount` INT DEFAULT 0 COMMENT '积分金额',
  `carbon_reduction` DECIMAL(10,2) DEFAULT 0.00 COMMENT '碳减排量',
  `category` VARCHAR(50) DEFAULT NULL COMMENT '回收类别',
  `description` VARCHAR(255) DEFAULT NULL COMMENT '描述',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_type` (`type`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收益记录表';

-- ============================================
-- 8. 积分记录表 (points_records)
-- 页面: 积分商城、收益明细
-- ============================================
CREATE TABLE `points_records` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `type` ENUM('earn', 'spend', 'expire') NOT NULL COMMENT '类型: earn获得 spend消费 expire过期',
  `amount` INT NOT NULL COMMENT '积分数量(正为增加,负为减少)',
  `balance` INT DEFAULT 0 COMMENT '变动后余额',
  `source` VARCHAR(50) DEFAULT NULL COMMENT '来源: recycle/checkin/task/exchange/invite等',
  `reference_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '关联ID',
  `description` VARCHAR(255) DEFAULT NULL COMMENT '描述',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_type` (`type`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='积分记录表';

-- ============================================
-- 9. 商品表 (products)
-- 页面: 积分商城
-- ============================================
CREATE TABLE `products` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '商品ID',
  `name` VARCHAR(100) NOT NULL COMMENT '商品名称',
  `category` VARCHAR(50) DEFAULT NULL COMMENT '分类: electronics/home/food等',
  `image` VARCHAR(255) DEFAULT NULL COMMENT '图片URL',
  `description` TEXT DEFAULT NULL COMMENT '描述',
  `points_price` INT NOT NULL COMMENT '积分价格',
  `cash_price` DECIMAL(10,2) DEFAULT 0.00 COMMENT '现金价格',
  `market_price` DECIMAL(10,2) DEFAULT 0.00 COMMENT '市场价格',
  `stock` INT DEFAULT 0 COMMENT '库存',
  `sales` INT DEFAULT 0 COMMENT '销量',
  `tag` VARCHAR(50) DEFAULT NULL COMMENT '标签: 热销/新品/限时',
  `sort_order` INT DEFAULT 0 COMMENT '排序',
  `status` TINYINT DEFAULT 1 COMMENT '状态: 0下架 1上架',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品表';

-- ============================================
-- 10. 积分兑换记录表 (exchange_records)
-- 页面: 积分商城
-- ============================================
CREATE TABLE `exchange_records` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `product_id` BIGINT UNSIGNED NOT NULL COMMENT '商品ID',
  `product_name` VARCHAR(100) DEFAULT NULL COMMENT '商品名称',
  `points_cost` INT NOT NULL COMMENT '消耗积分',
  `quantity` INT DEFAULT 1 COMMENT '数量',
  `status` ENUM('pending', 'shipped', 'completed', 'cancelled') DEFAULT 'pending' COMMENT '状态',
  `shipping_address` VARCHAR(500) DEFAULT NULL COMMENT '收货地址',
  `shipping_no` VARCHAR(50) DEFAULT NULL COMMENT '快递单号',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_product_id` (`product_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='积分兑换记录表';

-- ============================================
-- 11. 通知表 (notifications)
-- 页面: 消息通知
-- ============================================
CREATE TABLE `notifications` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '通知ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `type` ENUM('system', 'activity', 'reward', 'order') NOT NULL COMMENT '类型',
  `title` VARCHAR(100) NOT NULL COMMENT '标题',
  `message` TEXT NOT NULL COMMENT '内容',
  `icon` VARCHAR(50) DEFAULT 'notification' COMMENT '图标',
  `reference_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '关联ID',
  `is_read` TINYINT DEFAULT 0 COMMENT '是否已读: 0未读 1已读',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_type` (`type`),
  KEY `idx_is_read` (`is_read`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='通知表';

-- ============================================
-- 12. 活动表 (activities)
-- 页面: 首页活动、积分商城活动
-- ============================================
CREATE TABLE `activities` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '活动ID',
  `title` VARCHAR(100) NOT NULL COMMENT '活动标题',
  `description` TEXT DEFAULT NULL COMMENT '活动描述',
  `content` LONGTEXT DEFAULT NULL COMMENT '活动详情(富文本)',
  `image` VARCHAR(255) DEFAULT NULL COMMENT '活动图片',
  `tag` VARCHAR(50) DEFAULT NULL COMMENT '标签: 限时/热门/每日',
  `type` ENUM('announcement', 'event', 'promotion') DEFAULT 'event' COMMENT '类型',
  `start_time` DATETIME DEFAULT NULL COMMENT '开始时间',
  `end_time` DATETIME DEFAULT NULL COMMENT '结束时间',
  `reward_points` INT DEFAULT 0 COMMENT '奖励积分',
  `reward_cash` DECIMAL(10,2) DEFAULT 0.00 COMMENT '奖励现金',
  `sort_order` INT DEFAULT 0 COMMENT '排序',
  `status` TINYINT DEFAULT 1 COMMENT '状态: 0禁用 1启用',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_type` (`type`),
  KEY `idx_status` (`status`),
  KEY `idx_start_time` (`start_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='活动表';

-- ============================================
-- 13. 邀请记录表 (invite_records)
-- 页面: 邀请好友
-- ============================================
CREATE TABLE `invite_records` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `inviter_id` BIGINT UNSIGNED NOT NULL COMMENT '邀请人ID',
  `invitee_id` BIGINT UNSIGNED NOT NULL COMMENT '被邀请人ID',
  `invitee_nickname` VARCHAR(50) DEFAULT NULL COMMENT '被邀请人昵称',
  `invitee_avatar` VARCHAR(255) DEFAULT NULL COMMENT '被邀请人头像',
  `status` ENUM('pending', 'success', 'expired') DEFAULT 'pending' COMMENT '状态',
  `reward_points` INT DEFAULT 0 COMMENT '奖励积分',
  `completed_orders` INT DEFAULT 0 COMMENT '被邀请人完成订单数',
  `invite_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '邀请时间',
  `success_time` DATETIME DEFAULT NULL COMMENT '成功时间(首次回收)',
  PRIMARY KEY (`id`),
  KEY `idx_inviter_id` (`inviter_id`),
  KEY `idx_invitee_id` (`invitee_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='邀请记录表';

-- ============================================
-- 14. 签到记录表 (checkin_records)
-- 页面: 积分商城签到
-- ============================================
CREATE TABLE `checkin_records` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `checkin_date` DATE NOT NULL COMMENT '签到日期',
  `continuous_days` INT DEFAULT 1 COMMENT '连续签到天数',
  `reward_points` INT DEFAULT 10 COMMENT '奖励积分',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_date` (`user_id`, `checkin_date`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_checkin_date` (`checkin_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='签到记录表';

-- ============================================
-- 15. 任务表 (tasks)
-- 页面: 积分商城任务
-- ============================================
CREATE TABLE `tasks` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '任务ID',
  `name` VARCHAR(100) NOT NULL COMMENT '任务名称',
  `description` VARCHAR(255) DEFAULT NULL COMMENT '任务描述',
  `type` ENUM('daily', 'weekly', 'once') DEFAULT 'daily' COMMENT '类型',
  `icon` VARCHAR(50) DEFAULT NULL COMMENT '图标',
  `reward_points` INT DEFAULT 0 COMMENT '奖励积分',
  `target_count` INT DEFAULT 1 COMMENT '目标次数',
  `action` VARCHAR(50) DEFAULT NULL COMMENT '关联动作: checkin/recycle/invite/share',
  `sort_order` INT DEFAULT 0 COMMENT '排序',
  `status` TINYINT DEFAULT 1 COMMENT '状态: 0禁用 1启用',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_type` (`type`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='任务表';

-- ============================================
-- 16. 用户任务进度表 (user_tasks)
-- 页面: 积分商城任务
-- ============================================
CREATE TABLE `user_tasks` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `task_id` BIGINT UNSIGNED NOT NULL COMMENT '任务ID',
  `progress` INT DEFAULT 0 COMMENT '当前进度',
  `completed` TINYINT DEFAULT 0 COMMENT '是否完成: 0未完成 1已完成',
  `reward_claimed` TINYINT DEFAULT 0 COMMENT '是否领取奖励',
  `reset_date` DATE DEFAULT NULL COMMENT '重置日期(每日任务)',
  `completed_at` DATETIME DEFAULT NULL COMMENT '完成时间',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_task_date` (`user_id`, `task_id`, `reset_date`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_task_id` (`task_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户任务进度表';

-- ============================================
-- 17. 提现记录表 (withdraw_records)
-- 页面: 收益提现
-- ============================================
CREATE TABLE `withdraw_records` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `amount` DECIMAL(10,2) NOT NULL COMMENT '提现金额',
  `method` ENUM('wechat', 'alipay', 'bank') NOT NULL COMMENT '提现方式',
  `account` VARCHAR(100) DEFAULT NULL COMMENT '提现账号',
  `status` ENUM('pending', 'processing', 'success', 'failed') DEFAULT 'pending' COMMENT '状态',
  `remark` VARCHAR(255) DEFAULT NULL COMMENT '备注',
  `processed_at` DATETIME DEFAULT NULL COMMENT '处理时间',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='提现记录表';

-- ============================================
-- 18. 捐赠记录表 (donation_records)
-- 页面: 收益捐赠
-- ============================================
CREATE TABLE `donation_records` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `project_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '捐赠项目ID',
  `project_name` VARCHAR(100) DEFAULT NULL COMMENT '项目名称',
  `amount` DECIMAL(10,2) NOT NULL COMMENT '捐赠金额',
  `reward_points` INT DEFAULT 0 COMMENT '获得积分',
  `reward_carbon` DECIMAL(10,2) DEFAULT 0.00 COMMENT '获得碳减排量',
  `status` ENUM('pending', 'success', 'failed') DEFAULT 'pending' COMMENT '状态',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_project_id` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='捐赠记录表';

-- ============================================
-- 19. 捐赠项目表 (donation_projects)
-- 页面: 收益捐赠
-- ============================================
CREATE TABLE `donation_projects` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '项目ID',
  `name` VARCHAR(100) NOT NULL COMMENT '项目名称',
  `description` TEXT DEFAULT NULL COMMENT '项目描述',
  `image` VARCHAR(255) DEFAULT NULL COMMENT '项目图片',
  `target_amount` DECIMAL(12,2) DEFAULT 0.00 COMMENT '目标金额',
  `current_amount` DECIMAL(12,2) DEFAULT 0.00 COMMENT '当前金额',
  `donor_count` INT DEFAULT 0 COMMENT '捐赠人数',
  `status` TINYINT DEFAULT 1 COMMENT '状态: 0禁用 1启用',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='捐赠项目表';

-- ============================================
-- 20. AR扫描记录表 (scan_history)
-- 页面: AR识别
-- ============================================
CREATE TABLE `scan_history` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `detected_class` VARCHAR(50) NOT NULL COMMENT '识别类别(英文)',
  `item_name` VARCHAR(100) DEFAULT NULL COMMENT '物品名称(中文)',
  `category` VARCHAR(50) DEFAULT NULL COMMENT '垃圾分类',
  `confidence` INT DEFAULT 0 COMMENT '置信度 0-100',
  `points` INT DEFAULT 0 COMMENT '获得积分',
  `image` VARCHAR(255) DEFAULT NULL COMMENT '图片',
  `bbox` VARCHAR(100) DEFAULT NULL COMMENT '边界框坐标',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '扫描时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='AR扫描记录表';

-- ============================================
-- 21. 收藏表 (favorites)
-- 页面: 我的收藏
-- ============================================
CREATE TABLE `favorites` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `type` ENUM('collector', 'drop_point', 'product', 'article') NOT NULL COMMENT '收藏类型',
  `target_id` BIGINT UNSIGNED NOT NULL COMMENT '目标ID',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_type_target` (`user_id`, `type`, `target_id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收藏表';

-- ============================================
-- 22. 订单评价表 (order_reviews)
-- 页面: 订单评价
-- ============================================
CREATE TABLE `order_reviews` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '评价ID',
  `order_id` BIGINT UNSIGNED NOT NULL COMMENT '订单ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `collector_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '回收员ID',
  `rating` INT NOT NULL COMMENT '评分 1-5',
  `content` TEXT DEFAULT NULL COMMENT '评价内容',
  `images` TEXT DEFAULT NULL COMMENT '评价图片(JSON数组)',
  `tags` TEXT DEFAULT NULL COMMENT '评价标签(JSON数组)',
  `is_anonymous` TINYINT DEFAULT 0 COMMENT '是否匿名',
  `reply` TEXT DEFAULT NULL COMMENT '回复内容',
  `reply_time` DATETIME DEFAULT NULL COMMENT '回复时间',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_collector_id` (`collector_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单评价表';

-- ============================================
-- 23. 用户成就/徽章表 (user_badges)
-- 页面: 个人中心成就
-- ============================================
CREATE TABLE `user_badges` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `badge_id` BIGINT UNSIGNED NOT NULL COMMENT '徽章ID',
  `unlocked_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '解锁时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_badge` (`user_id`, `badge_id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户成就徽章表';

-- ============================================
-- 24. 徽章定义表 (badges)
-- 页面: 个人中心成就
-- ============================================
CREATE TABLE `badges` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '徽章ID',
  `name` VARCHAR(50) NOT NULL COMMENT '徽章名称',
  `description` VARCHAR(255) DEFAULT NULL COMMENT '描述',
  `icon` VARCHAR(100) DEFAULT NULL COMMENT '图标',
  `condition_type` VARCHAR(50) DEFAULT NULL COMMENT '条件类型',
  `condition_value` INT DEFAULT 0 COMMENT '条件值',
  `reward_points` INT DEFAULT 0 COMMENT '奖励积分',
  `sort_order` INT DEFAULT 0 COMMENT '排序',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='徽章定义表';

-- ============================================
-- 25. 客服会话表 (customer_service_sessions)
-- 页面: 客服
-- ============================================
CREATE TABLE `customer_service_sessions` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '会话ID',
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `status` ENUM('open', 'closed') DEFAULT 'open' COMMENT '状态',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `closed_at` DATETIME DEFAULT NULL COMMENT '关闭时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='客服会话表';

-- ============================================
-- 26. 客服消息表 (customer_service_messages)
-- 页面: 客服
-- ============================================
CREATE TABLE `customer_service_messages` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '消息ID',
  `session_id` BIGINT UNSIGNED NOT NULL COMMENT '会话ID',
  `sender_type` ENUM('user', 'service', 'system') NOT NULL COMMENT '发送者类型',
  `sender_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '发送者ID',
  `content` TEXT NOT NULL COMMENT '消息内容',
  `content_type` ENUM('text', 'image', 'file') DEFAULT 'text' COMMENT '内容类型',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_session_id` (`session_id`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='客服消息表';

-- ============================================
-- 初始化基础数据
-- ============================================

-- 插入废品分类数据
INSERT INTO `waste_categories` (`name`, `code`, `icon`, `price_per_kg`, `points_per_kg`, `carbon_per_kg`, `tips`, `sort_order`) VALUES
('纸类', 'paper', 'fas fa-newspaper', 2.50, 5, 0.10, '["请清洗干净后投放","保持干燥","去除塑料封面"]', 1),
('塑料', 'plastic', 'fas fa-recycle', 3.00, 6, 0.15, '["请清洗干净","建议压扁后投放","分类投放更环保"]', 2),
('玻璃', 'glass', 'fas fa-wine-bottle', 1.50, 3, 0.08, '["请小心破碎","分颜色投放效果更好"]', 3),
('电子产品', 'electronic', 'fas fa-mobile-alt', 8.00, 50, 0.50, '["含有贵重金属","建议专业回收","请取出电池"]', 4),
('纺织品', 'textile', 'fas fa-tshirt', 2.00, 4, 0.12, '["保持干燥清洁","可捐赠再利用"]', 5),
('金属', 'metal', 'fas fa-wrench', 5.00, 10, 0.30, '["分类回收效果更好","注意锋利边缘"]', 6),
('家具', 'furniture', 'fas fa-chair', 3.00, 8, 0.20, '["大件需预约上门","可拆解后投放"]', 7),
('其他', 'other', 'fas fa-cube', 1.00, 2, 0.05, '["请确认物品类别","如不确定请咨询客服"]', 8);

-- 插入任务数据
INSERT INTO `tasks` (`name`, `description`, `type`, `icon`, `reward_points`, `target_count`, `action`, `sort_order`) VALUES
('每日签到', '连续签到获得积分奖励', 'daily', 'fas fa-calendar-check', 10, 1, 'checkin', 1),
('完成回收', '完成一次废品回收', 'daily', 'fas fa-recycle', 50, 1, 'recycle', 2),
('邀请好友', '邀请好友注册使用', 'once', 'fas fa-user-friends', 100, 3, 'invite', 3),
('分享应用', '分享应用给朋友', 'daily', 'fas fa-share-alt', 20, 1, 'share', 4);

-- 插入捐赠项目
INSERT INTO `donation_projects` (`name`, `description`, `target_amount`) VALUES
('绿色地球计划', '支持全球环保项目，减少碳排放', 100000.00),
('海洋清洁行动', '清理海洋垃圾，保护海洋生态', 50000.00),
('森林保护基金', '保护森林资源，维护生态平衡', 80000.00);

-- 插入徽章数据
INSERT INTO `badges` (`name`, `description`, `condition_type`, `condition_value`, `reward_points`, `sort_order`) VALUES
('环保新手', '完成首次回收', 'recycle_count', 1, 10, 1),
('回收达人', '完成10次回收', 'recycle_count', 10, 50, 2),
('环保先锋', '完成50次回收', 'recycle_count', 50, 200, 3),
('碳中和战士', '累计碳减排100kg', 'carbon_total', 100, 100, 4),
('签到达人', '连续签到7天', 'checkin_days', 7, 30, 5),
('社交达人', '成功邀请5位好友', 'invite_count', 5, 150, 6);

-- ============================================
-- 完成
-- ============================================
