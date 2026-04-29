-- ============================================
-- 废品回收APP 完整数据库初始化脚本
-- 数据库名: huanbao
-- 包含: C端、B端、G端所有表结构
-- 创建时间: 2024-12-18
-- ============================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS huanbao DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE huanbao;

-- ============================================
-- 使用说明：
-- 请在MySQL命令行中依次执行以下命令：
--
-- 方法一（推荐）：
-- SOURCE e:/Recycle3/recycle-app/database/recycle_app_database.sql;
-- SOURCE e:/Recycle3/recycle-app/database/recycle_app_business_database.sql;
-- SOURCE e:/Recycle3/recycle-app/database/recycle_app_government_database.sql;
--
-- 方法二：
-- 或者使用MySQL Workbench等工具分别导入以下三个SQL文件：
-- 1. recycle_app_database.sql (C端26张表)
-- 2. recycle_app_business_database.sql (B端18张表)
-- 3. recycle_app_government_database.sql (G端17张表)
--
-- 总计：61张数据表
-- ============================================

-- 数据表清单：
-- C端：users, user_addresses, waste_categories, collectors, drop_points, 
--      recycle_orders, earnings, points_records, products, exchange_records,
--      notifications, activities, invite_records, checkin_records, tasks,
--      user_tasks, withdraw_records, donation_records, donation_projects,
--      scan_history, favorites, order_reviews, user_badges, badges,
--      customer_service_sessions, customer_service_messages
--
-- B端：enterprises, enterprise_employees, contracts, subscription_plans,
--      enterprise_subscriptions, business_orders, devices, device_maintenance,
--      device_alerts, monitoring_locations, statistics_reports, business_alerts,
--      business_todos, ai_chat_history, ai_insights, policies,
--      policy_applications, login_logs
--
-- G端：government_users, administrative_regions, government_warnings,
--      recycle_stations, industry_chain_data, region_statistics,
--      category_statistics, risk_assessments, subsidy_applications,
--      subsidy_payments, policy_evaluations, ai_generated_reports,
--      compliance_checks, policy_simulations, government_notices,
--      government_operation_logs, notification_settings
-- ============================================
