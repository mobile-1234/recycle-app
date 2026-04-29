import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, PageParams, PageResponse } from './api.service';

/**
 * C端API服务
 * 提供C端所有业务数据的API调用
 */
@Injectable({
  providedIn: 'root'
})
export class ConsumerApiService {
  private readonly prefix = '/c';  // 后端实际路径为 /api/c

  constructor(private api: ApiService) {}

  // ==================== 用户相关 ====================
  
  /**
   * 获取用户信息
   */
  getUserInfo(): Observable<any> {
    return this.api.get(`${this.prefix}/user/info`);
  }

  /**
   * 更新用户信息
   */
  updateUserInfo(data: any): Observable<any> {
    return this.api.put(`${this.prefix}/user/info`, data);
  }

  /**
   * 更新用户头像和昵称
   */
  updateProfile(data: { nickname: string; avatar: string; avatarIndex: number }): Observable<any> {
    return this.api.put(`${this.prefix}/user/profile`, data);
  }

  /**
   * 获取用户统计数据
   */
  getUserStats(): Observable<any> {
    return this.api.get(`${this.prefix}/user/stats`);
  }

  // ==================== 废品分类 ====================
  
  /**
   * 获取废品分类列表
   */
  getCategories(params?: any): Observable<any[]> {
    return this.api.get(`${this.prefix}/categories`, params);
  }

  /**
   * 获取分类详情
   */
  getCategoryDetail(id: string): Observable<any> {
    return this.api.get(`${this.prefix}/categories/${id}`);
  }

  // ==================== 回收员 ====================
  
  /**
   * 获取附近回收员
   */
  getNearbyCollectors(longitude: number, latitude: number, radius: number = 5): Observable<any[]> {
    return this.api.get(`${this.prefix}/collectors/nearby`, { longitude, latitude, radius });
  }

  /**
   * 获取回收员详情
   */
  getCollectorDetail(id: string): Observable<any> {
    return this.api.get(`${this.prefix}/collectors/${id}`);
  }

  /**
   * 收藏回收员
   */
  favoriteCollector(id: string): Observable<any> {
    return this.api.post(`${this.prefix}/favorites/collector/${id}`);
  }

  // ==================== 投递点 ====================
  
  /**
   * 获取附近投递点
   */
  getNearbyDropPoints(longitude: number, latitude: number, radius: number = 5): Observable<any[]> {
    return this.api.get(`${this.prefix}/drop-points/nearby`, { longitude, latitude, radius });
  }

  /**
   * 获取投递点详情
   */
  getDropPointDetail(id: string): Observable<any> {
    return this.api.get(`${this.prefix}/drop-points/${id}`);
  }

  // ==================== 回收订单 ====================
  
  /**
   * 创建回收订单
   */
  createOrder(data: any): Observable<any> {
    return this.api.post(`${this.prefix}/orders`, data);
  }

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
   * 取消订单
   */
  cancelOrder(id: string, reason?: string): Observable<any> {
    return this.api.put(`${this.prefix}/orders/${id}/cancel`, { reason });
  }

  /**
   * 评价订单
   */
  reviewOrder(id: string, data: any): Observable<any> {
    return this.api.post(`${this.prefix}/orders/${id}/review`, data);
  }

  // ==================== 积分商城 ====================
  
  /**
   * 获取商品列表
   */
  getProducts(params?: PageParams): Observable<PageResponse<any>> {
    return this.api.getPage(`${this.prefix}/products`, params);
  }

  /**
   * 获取商品详情
   */
  getProductDetail(id: string): Observable<any> {
    return this.api.get(`${this.prefix}/products/${id}`);
  }

  /**
   * 兑换商品
   */
  exchangeProduct(productId: string, quantity: number = 1): Observable<any> {
    return this.api.post(`${this.prefix}/exchange`, { productId, quantity });
  }

  /**
   * 获取兑换记录
   */
  getExchangeRecords(params?: PageParams): Observable<PageResponse<any>> {
    return this.api.getPage(`${this.prefix}/exchange/records`, params);
  }

  // ==================== 积分记录 ====================
  
  /**
   * 获取积分记录
   */
  getPointsRecords(params?: PageParams): Observable<PageResponse<any>> {
    return this.api.getPage(`${this.prefix}/points/records`, params);
  }

  /**
   * 获取积分统计
   */
  getPointsStats(): Observable<any> {
    return this.api.get(`${this.prefix}/points/stats`);
  }

  // ==================== 收益记录 ====================
  
  /**
   * 获取收益记录
   */
  getEarnings(params?: PageParams): Observable<PageResponse<any>> {
    return this.api.getPage(`${this.prefix}/earnings`, params);
  }

  /**
   * 获取收益统计
   */
  getEarningsStats(): Observable<any> {
    return this.api.get(`${this.prefix}/earnings/stats`);
  }

  /**
   * 申请提现
   */
  withdraw(amount: number, account: any): Observable<any> {
    return this.api.post(`${this.prefix}/withdraw`, { amount, account });
  }

  /**
   * 获取提现记录
   */
  getWithdrawRecords(params?: PageParams): Observable<PageResponse<any>> {
    return this.api.getPage(`${this.prefix}/withdraw/records`, params);
  }

  // ==================== 活动 ====================
  
  /**
   * 获取活动列表
   */
  getActivities(params?: any): Observable<any[]> {
    return this.api.get(`${this.prefix}/activities`, params);
  }

  /**
   * 获取活动详情
   */
  getActivityDetail(id: string): Observable<any> {
    return this.api.get(`${this.prefix}/activities/${id}`);
  }

  /**
   * 参与活动
   */
  joinActivity(id: string): Observable<any> {
    return this.api.post(`${this.prefix}/activities/${id}/join`);
  }

  // ==================== 任务 ====================
  
  /**
   * 获取任务列表
   */
  getTasks(): Observable<any[]> {
    return this.api.get(`${this.prefix}/tasks`);
  }

  /**
   * 获取用户任务进度
   */
  getUserTasks(): Observable<any[]> {
    return this.api.get(`${this.prefix}/tasks/user`);
  }

  /**
   * 领取任务奖励
   */
  claimTaskReward(taskId: string): Observable<any> {
    return this.api.post(`${this.prefix}/tasks/${taskId}/claim`);
  }

  // ==================== 签到 ====================
  
  /**
   * 签到
   */
  checkin(): Observable<any> {
    return this.api.post(`${this.prefix}/checkin`);
  }

  /**
   * 获取签到记录
   */
  getCheckinRecords(month?: string): Observable<any> {
    return this.api.get(`${this.prefix}/checkin/records`, { month });
  }

  // ==================== 邀请 ====================
  
  /**
   * 获取邀请码
   */
  getInviteCode(): Observable<any> {
    return this.api.get(`${this.prefix}/invite/code`);
  }

  /**
   * 获取邀请记录
   */
  getInviteRecords(params?: PageParams): Observable<PageResponse<any>> {
    return this.api.getPage(`${this.prefix}/invite/records`, params);
  }

  // ==================== 徽章成就 ====================
  
  /**
   * 获取徽章列表
   */
  getBadges(): Observable<any[]> {
    return this.api.get(`${this.prefix}/badges`);
  }

  /**
   * 获取用户徽章
   */
  getUserBadges(): Observable<any[]> {
    return this.api.get(`${this.prefix}/badges/user`);
  }

  // ==================== 通知 ====================
  
  /**
   * 获取通知列表
   */
  getNotifications(params?: PageParams): Observable<PageResponse<any>> {
    return this.api.getPage(`${this.prefix}/notifications`, params);
  }

  /**
   * 标记通知已读
   */
  markNotificationRead(id: string): Observable<any> {
    return this.api.put(`${this.prefix}/notifications/${id}/read`);
  }

  /**
   * 全部标记已读
   */
  markAllNotificationsRead(): Observable<any> {
    return this.api.put(`${this.prefix}/notifications/read-all`);
  }

  /**
   * 获取未读数量
   */
  getUnreadCount(): Observable<any> {
    return this.api.get(`${this.prefix}/notifications/unread-count`);
  }

  // ==================== 地址管理 ====================
  
  /**
   * 获取地址列表
   */
  getAddresses(): Observable<any[]> {
    return this.api.get(`${this.prefix}/addresses`);
  }

  /**
   * 添加地址
   */
  addAddress(data: any): Observable<any> {
    return this.api.post(`${this.prefix}/addresses`, data);
  }

  /**
   * 更新地址
   */
  updateAddress(id: string, data: any): Observable<any> {
    return this.api.put(`${this.prefix}/addresses/${id}`, data);
  }

  /**
   * 删除地址
   */
  deleteAddress(id: string): Observable<any> {
    return this.api.delete(`${this.prefix}/addresses/${id}`);
  }

  /**
   * 设置默认地址
   */
  setDefaultAddress(id: string): Observable<any> {
    return this.api.put(`${this.prefix}/addresses/${id}/default`);
  }

  // ==================== AR扫描 ====================
  
  /**
   * 保存扫描记录
   */
  saveScanHistory(data: any): Observable<any> {
    return this.api.post(`${this.prefix}/scan/history`, data);
  }

  /**
   * 获取扫描历史
   */
  getScanHistory(params?: PageParams): Observable<PageResponse<any>> {
    return this.api.getPage(`${this.prefix}/scan/history`, params);
  }

  // ==================== 捐赠 ====================
  
  /**
   * 获取捐赠项目列表
   */
  getDonationProjects(): Observable<any[]> {
    return this.api.get(`${this.prefix}/donations/projects`);
  }

  /**
   * 捐赠
   */
  donate(projectId: string, amount: number): Observable<any> {
    return this.api.post(`${this.prefix}/donations`, { projectId, amount });
  }

  /**
   * 获取捐赠记录
   */
  getDonationRecords(params?: PageParams): Observable<PageResponse<any>> {
    return this.api.getPage(`${this.prefix}/donations/records`, params);
  }

  // ==================== 客服 ====================
  
  /**
   * 创建客服会话
   */
  createServiceSession(): Observable<any> {
    return this.api.post(`${this.prefix}/service/session`);
  }

  /**
   * 发送消息
   */
  sendMessage(sessionId: string, content: string, type: string = 'text'): Observable<any> {
    return this.api.post(`${this.prefix}/service/messages`, { sessionId, content, type });
  }

  /**
   * 获取消息列表
   */
  getMessages(sessionId: string): Observable<any[]> {
    return this.api.get(`${this.prefix}/service/messages/${sessionId}`);
  }
}
