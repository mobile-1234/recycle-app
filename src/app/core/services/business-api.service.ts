import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, PageParams, PageResponse } from './api.service';

/**
 * B端API服务
 * 提供B端所有业务数据的API调用
 */
@Injectable({
  providedIn: 'root'
})
export class BusinessApiService {
  private readonly prefix = '/b';  // 后端实际路径为 /api/b

  constructor(private api: ApiService) {}

  // ==================== 用户资料 ====================

  /**
   * 获取用户个人资料
   */
  getUserProfile(): Observable<any> {
    return this.api.get(`${this.prefix}/user/profile`);
  }

  /**
   * 更新用户头像和昵称
   */
  updateProfile(data: { nickname: string; avatar: string; avatarIndex: number }): Observable<any> {
    return this.api.put(`${this.prefix}/user/profile`, data);
  }

  // ==================== 企业信息 ====================
  
  /**
   * 获取企业信息
   */
  getEnterpriseInfo(): Observable<any> {
    return this.api.get(`${this.prefix}/enterprise/info`);
  }

  /**
   * 更新企业信息
   */
  updateEnterpriseInfo(data: any): Observable<any> {
    return this.api.put(`${this.prefix}/enterprise/info`, data);
  }

  // ==================== 仪表盘统计 ====================
  
  /**
   * 获取仪表盘统计数据
   */
  getDashboardStats(): Observable<any> {
    return this.api.get(`${this.prefix}/dashboard/stats`);
  }

  /**
   * 获取今日数据
   */
  getTodayData(): Observable<any> {
    return this.api.get(`${this.prefix}/dashboard/today`);
  }

  /**
   * 获取趋势数据
   */
  getTrendData(days: number = 7): Observable<any> {
    return this.api.get(`${this.prefix}/dashboard/trend`, { days });
  }

  // ==================== 订单管理 ====================
  
  /**
   * 获取订单列表
   */
  getOrders(params?: PageParams): Observable<PageResponse<any>> {
    return this.api.getPage(`${this.prefix}/orders`, params);
  }

  /**
   * 获取订单详情
   */
  getOrderDetail(id: string): Observable<any> {
    return this.api.get(`${this.prefix}/orders/${id}`);
  }

  /**
   * 创建订单
   */
  createOrder(data: any): Observable<any> {
    return this.api.post(`${this.prefix}/orders`, data);
  }

  /**
   * 更新订单
   */
  updateOrder(id: string, data: any): Observable<any> {
    return this.api.put(`${this.prefix}/orders/${id}`, data);
  }

  /**
   * 分配订单
   */
  assignOrder(id: string, employeeId: string): Observable<any> {
    return this.api.put(`${this.prefix}/orders/${id}/assign`, { employeeId });
  }

  /**
   * 完成订单
   */
  completeOrder(id: string, data: any): Observable<any> {
    return this.api.put(`${this.prefix}/orders/${id}/complete`, data);
  }

  /**
   * 取消订单
   */
  cancelOrder(id: string, reason: string): Observable<any> {
    return this.api.put(`${this.prefix}/orders/${id}/cancel`, { reason });
  }

  /**
   * 获取订单统计
   */
  getOrderStats(dateRange?: any): Observable<any> {
    return this.api.get(`${this.prefix}/orders/stats`, dateRange);
  }

  // ==================== 设备管理 ====================
  
  /**
   * 获取设备列表
   */
  getDevices(params?: PageParams): Observable<PageResponse<any>> {
    return this.api.getPage(`${this.prefix}/devices`, params);
  }

  /**
   * 获取设备详情
   */
  getDeviceDetail(id: string): Observable<any> {
    return this.api.get(`${this.prefix}/devices/${id}`);
  }

  /**
   * 添加设备
   */
  addDevice(data: any): Observable<any> {
    return this.api.post(`${this.prefix}/devices`, data);
  }

  /**
   * 更新设备
   */
  updateDevice(id: string, data: any): Observable<any> {
    return this.api.put(`${this.prefix}/devices/${id}`, data);
  }

  /**
   * 删除设备
   */
  deleteDevice(id: string): Observable<any> {
    return this.api.delete(`${this.prefix}/devices/${id}`);
  }

  /**
   * 获取设备状态统计
   */
  getDeviceStats(): Observable<any> {
    return this.api.get(`${this.prefix}/devices/stats`);
  }

  /**
   * 获取设备告警
   */
  getDeviceAlerts(params?: PageParams): Observable<PageResponse<any>> {
    return this.api.getPage(`${this.prefix}/devices/alerts`, params);
  }

  /**
   * 处理告警
   */
  handleAlert(id: string, action: string, note?: string): Observable<any> {
    return this.api.put(`${this.prefix}/devices/alerts/${id}`, { action, note });
  }

  // ==================== 设备维护 ====================
  
  /**
   * 获取维护记录
   */
  getMaintenanceRecords(params?: PageParams): Observable<PageResponse<any>> {
    return this.api.getPage(`${this.prefix}/maintenance`, params);
  }

  /**
   * 创建维护记录
   */
  createMaintenance(data: any): Observable<any> {
    return this.api.post(`${this.prefix}/maintenance`, data);
  }

  /**
   * 更新维护记录
   */
  updateMaintenance(id: string, data: any): Observable<any> {
    return this.api.put(`${this.prefix}/maintenance/${id}`, data);
  }

  /**
   * 获取维护计划
   */
  getMaintenanceSchedule(): Observable<any[]> {
    return this.api.get(`${this.prefix}/maintenance/schedule`);
  }

  // ==================== 监控点位 ====================
  
  /**
   * 获取监控点位列表
   */
  getMonitoringLocations(params?: any): Observable<any[]> {
    return this.api.get(`${this.prefix}/monitoring/locations`, params);
  }

  /**
   * 获取点位详情
   */
  getLocationDetail(id: string): Observable<any> {
    return this.api.get(`${this.prefix}/monitoring/locations/${id}`);
  }

  /**
   * 获取点位实时数据
   */
  getLocationRealtime(id: string): Observable<any> {
    return this.api.get(`${this.prefix}/monitoring/locations/${id}/realtime`);
  }

  // ==================== 数据报表 ====================
  
  /**
   * 获取统计报表
   */
  getStatisticsReports(params?: any): Observable<PageResponse<any>> {
    return this.api.getPage(`${this.prefix}/reports/statistics`, params);
  }

  /**
   * 生成报表
   */
  generateReport(type: string, dateRange: any): Observable<any> {
    return this.api.post(`${this.prefix}/reports/generate`, { type, dateRange });
  }

  /**
   * 导出报表
   */
  exportReport(id: string, format: string = 'excel'): Observable<any> {
    return this.api.get(`${this.prefix}/reports/${id}/export`, { format });
  }

  /**
   * 获取数据分析
   */
  getDataAnalysis(type: string, dateRange?: any): Observable<any> {
    return this.api.get(`${this.prefix}/reports/analysis/${type}`, dateRange);
  }

  // ==================== 员工管理 ====================
  
  /**
   * 获取员工列表
   */
  getEmployees(params?: PageParams): Observable<PageResponse<any>> {
    return this.api.getPage(`${this.prefix}/employees`, params);
  }

  /**
   * 添加员工
   */
  addEmployee(data: any): Observable<any> {
    return this.api.post(`${this.prefix}/employees`, data);
  }

  /**
   * 更新员工
   */
  updateEmployee(id: string, data: any): Observable<any> {
    return this.api.put(`${this.prefix}/employees/${id}`, data);
  }

  /**
   * 删除员工
   */
  deleteEmployee(id: string): Observable<any> {
    return this.api.delete(`${this.prefix}/employees/${id}`);
  }

  // ==================== 合同管理 ====================
  
  /**
   * 获取合同列表
   */
  getContracts(params?: PageParams): Observable<PageResponse<any>> {
    return this.api.getPage(`${this.prefix}/contracts`, params);
  }

  /**
   * 获取合同详情
   */
  getContractDetail(id: string): Observable<any> {
    return this.api.get(`${this.prefix}/contracts/${id}`);
  }

  /**
   * 创建合同
   */
  createContract(data: any): Observable<any> {
    return this.api.post(`${this.prefix}/contracts`, data);
  }

  /**
   * 更新合同
   */
  updateContract(id: string, data: any): Observable<any> {
    return this.api.put(`${this.prefix}/contracts/${id}`, data);
  }

  // ==================== 订阅管理 ====================
  
  /**
   * 获取订阅套餐列表
   */
  getSubscriptionPlans(): Observable<any[]> {
    return this.api.get(`${this.prefix}/subscriptions/plans`);
  }

  /**
   * 获取当前订阅
   */
  getCurrentSubscription(): Observable<any> {
    return this.api.get(`${this.prefix}/subscriptions/current`);
  }

  /**
   * 订阅套餐
   */
  subscribe(planId: string): Observable<any> {
    return this.api.post(`${this.prefix}/subscriptions`, { planId });
  }

  /**
   * 取消订阅
   */
  cancelSubscription(): Observable<any> {
    return this.api.delete(`${this.prefix}/subscriptions/current`);
  }

  // ==================== 预警管理 ====================
  
  /**
   * 获取预警列表
   */
  getAlerts(params?: PageParams): Observable<PageResponse<any>> {
    return this.api.getPage(`${this.prefix}/alerts`, params);
  }

  /**
   * 标记预警已读
   */
  markAlertRead(id: string): Observable<any> {
    return this.api.put(`${this.prefix}/alerts/${id}/read`);
  }

  /**
   * 获取未处理预警数量
   */
  getUnhandledAlertCount(): Observable<any> {
    return this.api.get(`${this.prefix}/alerts/unhandled-count`);
  }

  // ==================== 待办事项 ====================
  
  /**
   * 获取待办列表
   */
  getTodos(params?: any): Observable<any[]> {
    return this.api.get(`${this.prefix}/todos`, params);
  }

  /**
   * 创建待办
   */
  createTodo(data: any): Observable<any> {
    return this.api.post(`${this.prefix}/todos`, data);
  }

  /**
   * 更新待办
   */
  updateTodo(id: string, data: any): Observable<any> {
    return this.api.put(`${this.prefix}/todos/${id}`, data);
  }

  /**
   * 完成待办
   */
  completeTodo(id: string): Observable<any> {
    return this.api.put(`${this.prefix}/todos/${id}/complete`);
  }

  /**
   * 删除待办
   */
  deleteTodo(id: string): Observable<any> {
    return this.api.delete(`${this.prefix}/todos/${id}`);
  }

  // ==================== AI智能洞察 ====================
  
  /**
   * 获取AI洞察
   */
  getAIInsights(): Observable<any[]> {
    return this.api.get(`${this.prefix}/ai/insights`);
  }

  /**
   * 忽略洞察
   */
  dismissInsight(id: string): Observable<any> {
    return this.api.put(`${this.prefix}/ai/insights/${id}/dismiss`);
  }

  /**
   * AI聊天
   */
  aiChat(message: string, context?: any): Observable<any> {
    return this.api.post(`${this.prefix}/ai/chat`, { message, context });
  }

  /**
   * 获取AI聊天历史
   */
  getAIChatHistory(): Observable<any[]> {
    return this.api.get(`${this.prefix}/ai/chat/history`);
  }

  // ==================== 政策补贴 ====================
  
  /**
   * 获取政策列表
   */
  getPolicies(params?: any): Observable<any[]> {
    return this.api.get(`${this.prefix}/policies`, params);
  }

  /**
   * 申请政策补贴
   */
  applyPolicy(policyId: string, data: any): Observable<any> {
    return this.api.post(`${this.prefix}/policies/${policyId}/apply`, data);
  }

  /**
   * 获取申请记录
   */
  getPolicyApplications(params?: PageParams): Observable<PageResponse<any>> {
    return this.api.getPage(`${this.prefix}/policies/applications`, params);
  }

  /**
   * 获取申请详情
   */
  getApplicationDetail(id: string): Observable<any> {
    return this.api.get(`${this.prefix}/policies/applications/${id}`);
  }

  // ==================== AI智能分析 ====================

  /**
   * AI数据分析
   * @param prompt 用户输入的分析需求
   * @param data 可选的业务数据
   */
  aiAnalyze(prompt: string, data?: any): Observable<any> {
    return this.api.post(`${this.prefix}/ai/analyze`, { prompt, data });
  }
}
