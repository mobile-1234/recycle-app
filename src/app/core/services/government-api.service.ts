import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, PageParams, PageResponse } from './api.service';

/**
 * G端API服务
 * 提供G端所有业务数据的API调用
 */
@Injectable({
  providedIn: 'root'
})
export class GovernmentApiService {
  private readonly prefix = '/g';  // 后端实际路径为 /api/g

  constructor(private api: ApiService) {}

  // ==================== 政府用户 ====================
  
  /**
   * 获取当前用户信息
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

  // ==================== 监管总览 ====================
  
  /**
   * 获取监管总览统计
   */
  getOverviewStats(): Observable<any> {
    return this.api.get(`${this.prefix}/overview/stats`);
  }

  /**
   * 获取区域数据
   */
  getAreaData(regionId?: string): Observable<any> {
    return this.api.get(`${this.prefix}/overview/areas`, { regionId });
  }

  /**
   * 获取实时监控数据
   */
  getRealtimeData(): Observable<any> {
    return this.api.get(`${this.prefix}/overview/realtime`);
  }

  // ==================== 预警管理 ====================
  
  /**
   * 获取预警列表
   */
  getWarnings(params?: PageParams): Observable<PageResponse<any>> {
    return this.api.getPage(`${this.prefix}/warnings`, params);
  }

  /**
   * 获取预警详情
   */
  getWarningDetail(id: string): Observable<any> {
    return this.api.get(`${this.prefix}/warnings/${id}`);
  }

  /**
   * 创建预警
   */
  createWarning(data: any): Observable<any> {
    return this.api.post(`${this.prefix}/warnings`, data);
  }

  /**
   * 处理预警
   */
  handleWarning(id: string, data: any): Observable<any> {
    return this.api.put(`${this.prefix}/warnings/${id}/handle`, data);
  }

  /**
   * 关闭预警
   */
  closeWarning(id: string): Observable<any> {
    return this.api.put(`${this.prefix}/warnings/${id}/close`);
  }

  /**
   * 获取预警统计
   */
  getWarningStats(dateRange?: any): Observable<any> {
    return this.api.get(`${this.prefix}/warnings/stats`, dateRange);
  }

  // ==================== 行政区划 ====================
  
  /**
   * 获取行政区划列表
   */
  getRegions(params?: any): Observable<any[]> {
    return this.api.get(`${this.prefix}/regions`, params);
  }

  /**
   * 获取区划详情
   */
  getRegionDetail(id: string): Observable<any> {
    return this.api.get(`${this.prefix}/regions/${id}`);
  }

  /**
   * 获取子级区划
   */
  getChildRegions(parentId: string): Observable<any[]> {
    return this.api.get(`${this.prefix}/regions/${parentId}/children`);
  }

  // ==================== 回收站点监管 ====================
  
  /**
   * 获取回收站点列表
   */
  getRecycleStations(params?: PageParams): Observable<PageResponse<any>> {
    return this.api.getPage(`${this.prefix}/stations`, params);
  }

  /**
   * 获取站点详情
   */
  getStationDetail(id: string): Observable<any> {
    return this.api.get(`${this.prefix}/stations/${id}`);
  }

  /**
   * 审批站点
   */
  approveStation(id: string, approved: boolean, comment?: string): Observable<any> {
    return this.api.put(`${this.prefix}/stations/${id}/approve`, { approved, comment });
  }

  /**
   * 暂停站点
   */
  suspendStation(id: string, reason: string): Observable<any> {
    return this.api.put(`${this.prefix}/stations/${id}/suspend`, { reason });
  }

  /**
   * 获取站点统计
   */
  getStationStats(regionId?: string): Observable<any> {
    return this.api.get(`${this.prefix}/stations/stats`, { regionId });
  }

  // ==================== 产业链分析 ====================
  
  /**
   * 获取产业链数据
   */
  getIndustryChainData(params?: any): Observable<any> {
    return this.api.get(`${this.prefix}/industry/chain`, params);
  }

  /**
   * 获取各环节数据
   */
  getStageData(stage: string, params?: any): Observable<any> {
    return this.api.get(`${this.prefix}/industry/stages/${stage}`, params);
  }

  /**
   * 获取产业链趋势
   */
  getIndustryTrend(dateRange?: any): Observable<any> {
    return this.api.get(`${this.prefix}/industry/trend`, dateRange);
  }

  // ==================== 区域统计 ====================
  
  /**
   * 获取区域统计数据
   */
  getRegionStatistics(params?: any): Observable<any[]> {
    return this.api.get(`${this.prefix}/statistics/regions`, params);
  }

  /**
   * 获取单个区域详细统计
   */
  getRegionStatDetail(regionId: string, dateRange?: any): Observable<any> {
    return this.api.get(`${this.prefix}/statistics/regions/${regionId}`, dateRange);
  }

  /**
   * 对比分析
   */
  compareRegions(regionIds: string[], dateRange?: any): Observable<any> {
    return this.api.post(`${this.prefix}/statistics/regions/compare`, { regionIds, dateRange });
  }

  // ==================== 品类统计 ====================
  
  /**
   * 获取品类统计数据
   */
  getCategoryStatistics(params?: any): Observable<any[]> {
    return this.api.get(`${this.prefix}/statistics/categories`, params);
  }

  /**
   * 获取品类详细统计
   */
  getCategoryStatDetail(category: string, dateRange?: any): Observable<any> {
    return this.api.get(`${this.prefix}/statistics/categories/${category}`, dateRange);
  }

  /**
   * 获取品类趋势
   */
  getCategoryTrend(category: string, dateRange?: any): Observable<any> {
    return this.api.get(`${this.prefix}/statistics/categories/${category}/trend`, dateRange);
  }

  // ==================== 风险评估 ====================
  
  /**
   * 获取风险评估列表
   */
  getRiskAssessments(params?: PageParams): Observable<PageResponse<any>> {
    return this.api.getPage(`${this.prefix}/risks`, params);
  }

  /**
   * 获取风险详情
   */
  getRiskDetail(id: string): Observable<any> {
    return this.api.get(`${this.prefix}/risks/${id}`);
  }

  /**
   * 创建风险评估
   */
  createRiskAssessment(data: any): Observable<any> {
    return this.api.post(`${this.prefix}/risks`, data);
  }

  /**
   * 更新风险评估
   */
  updateRiskAssessment(id: string, data: any): Observable<any> {
    return this.api.put(`${this.prefix}/risks/${id}`, data);
  }

  /**
   * 获取风险统计
   */
  getRiskStats(): Observable<any> {
    return this.api.get(`${this.prefix}/risks/stats`);
  }

  // ==================== 补贴管理 ====================
  
  /**
   * 获取补贴申请列表
   */
  getSubsidyApplications(params?: PageParams): Observable<PageResponse<any>> {
    return this.api.getPage(`${this.prefix}/subsidies/applications`, params);
  }

  /**
   * 获取申请详情
   */
  getApplicationDetail(id: string): Observable<any> {
    return this.api.get(`${this.prefix}/subsidies/applications/${id}`);
  }

  /**
   * 审批补贴申请
   */
  reviewApplication(id: string, data: any): Observable<any> {
    return this.api.put(`${this.prefix}/subsidies/applications/${id}/review`, data);
  }

  /**
   * 批量审批
   */
  batchReviewApplications(ids: string[], approved: boolean, comment?: string): Observable<any> {
    return this.api.post(`${this.prefix}/subsidies/applications/batch-review`, { ids, approved, comment });
  }

  /**
   * 获取补贴发放记录
   */
  getSubsidyPayments(params?: PageParams): Observable<PageResponse<any>> {
    return this.api.getPage(`${this.prefix}/subsidies/payments`, params);
  }

  /**
   * 发放补贴
   */
  paySubsidy(applicationId: string, data: any): Observable<any> {
    return this.api.post(`${this.prefix}/subsidies/payments`, { applicationId, ...data });
  }

  /**
   * 获取补贴统计
   */
  getSubsidyStats(dateRange?: any): Observable<any> {
    return this.api.get(`${this.prefix}/subsidies/stats`, dateRange);
  }

  // ==================== 政策效果评估 ====================
  
  /**
   * 获取政策评估列表
   */
  getPolicyEvaluations(params?: PageParams): Observable<PageResponse<any>> {
    return this.api.getPage(`${this.prefix}/policies/evaluations`, params);
  }

  /**
   * 获取评估详情
   */
  getEvaluationDetail(id: string): Observable<any> {
    return this.api.get(`${this.prefix}/policies/evaluations/${id}`);
  }

  /**
   * 创建政策评估
   */
  createEvaluation(data: any): Observable<any> {
    return this.api.post(`${this.prefix}/policies/evaluations`, data);
  }

  /**
   * 更新评估
   */
  updateEvaluation(id: string, data: any): Observable<any> {
    return this.api.put(`${this.prefix}/policies/evaluations/${id}`, data);
  }

  // ==================== 政策模拟 ====================
  
  /**
   * 运行政策模拟
   */
  runPolicySimulation(data: any): Observable<any> {
    return this.api.post(`${this.prefix}/policies/simulation`, data);
  }

  /**
   * 获取模拟历史
   */
  getSimulationHistory(): Observable<any[]> {
    return this.api.get(`${this.prefix}/policies/simulation/history`);
  }

  /**
   * 获取模拟详情
   */
  getSimulationDetail(id: string): Observable<any> {
    return this.api.get(`${this.prefix}/policies/simulation/${id}`);
  }

  // ==================== AI生成报告 ====================
  
  /**
   * 获取AI报告列表
   */
  getAIReports(params?: PageParams): Observable<PageResponse<any>> {
    return this.api.getPage(`${this.prefix}/ai/reports`, params);
  }

  /**
   * 获取报告详情
   */
  getReportDetail(id: string): Observable<any> {
    return this.api.get(`${this.prefix}/ai/reports/${id}`);
  }

  /**
   * 生成AI报告
   */
  generateAIReport(type: string, params: any): Observable<any> {
    return this.api.post(`${this.prefix}/ai/reports/generate`, { type, ...params });
  }

  /**
   * 导出报告
   */
  exportReport(id: string, format: string = 'pdf'): Observable<any> {
    return this.api.get(`${this.prefix}/ai/reports/${id}/export`, { format });
  }

  // ==================== AI决策助手 ====================
  
  /**
   * AI咨询
   */
  aiConsult(question: string, context?: any): Observable<any> {
    return this.api.post(`${this.prefix}/ai/consult`, { question, context });
  }

  /**
   * 获取AI建议
   */
  getAISuggestions(type?: string): Observable<any[]> {
    return this.api.get(`${this.prefix}/ai/suggestions`, { type });
  }

  /**
   * 获取咨询历史
   */
  getConsultHistory(): Observable<any[]> {
    return this.api.get(`${this.prefix}/ai/consult/history`);
  }

  // ==================== 合规检查 ====================
  
  /**
   * 获取合规检查记录
   */
  getComplianceChecks(params?: PageParams): Observable<PageResponse<any>> {
    return this.api.getPage(`${this.prefix}/compliance/checks`, params);
  }

  /**
   * 获取检查详情
   */
  getCheckDetail(id: string): Observable<any> {
    return this.api.get(`${this.prefix}/compliance/checks/${id}`);
  }

  /**
   * 创建检查记录
   */
  createComplianceCheck(data: any): Observable<any> {
    return this.api.post(`${this.prefix}/compliance/checks`, data);
  }

  /**
   * 更新检查记录
   */
  updateComplianceCheck(id: string, data: any): Observable<any> {
    return this.api.put(`${this.prefix}/compliance/checks/${id}`, data);
  }

  /**
   * 获取合规统计
   */
  getComplianceStats(regionId?: string): Observable<any> {
    return this.api.get(`${this.prefix}/compliance/stats`, { regionId });
  }

  // ==================== 公告通知 ====================
  
  /**
   * 获取通知列表
   */
  getNotices(params?: PageParams): Observable<PageResponse<any>> {
    return this.api.getPage(`${this.prefix}/notices`, params);
  }

  /**
   * 获取通知详情
   */
  getNoticeDetail(id: string): Observable<any> {
    return this.api.get(`${this.prefix}/notices/${id}`);
  }

  /**
   * 发布通知
   */
  publishNotice(data: any): Observable<any> {
    return this.api.post(`${this.prefix}/notices`, data);
  }

  /**
   * 更新通知
   */
  updateNotice(id: string, data: any): Observable<any> {
    return this.api.put(`${this.prefix}/notices/${id}`, data);
  }

  /**
   * 删除通知
   */
  deleteNotice(id: string): Observable<any> {
    return this.api.delete(`${this.prefix}/notices/${id}`);
  }

  // ==================== 操作日志 ====================
  
  /**
   * 获取操作日志
   */
  getOperationLogs(params?: PageParams): Observable<PageResponse<any>> {
    return this.api.getPage(`${this.prefix}/logs/operations`, params);
  }

  /**
   * 获取日志详情
   */
  getLogDetail(id: string): Observable<any> {
    return this.api.get(`${this.prefix}/logs/operations/${id}`);
  }

  // ==================== 通知设置 ====================
  
  /**
   * 获取通知设置
   */
  getNotificationSettings(): Observable<any> {
    return this.api.get(`${this.prefix}/settings/notifications`);
  }

  /**
   * 更新通知设置
   */
  updateNotificationSettings(data: any): Observable<any> {
    return this.api.put(`${this.prefix}/settings/notifications`, data);
  }

  // ==================== 数据导出 ====================
  
  /**
   * 导出数据
   */
  exportData(type: string, params: any): Observable<any> {
    return this.api.post(`${this.prefix}/export/${type}`, params);
  }

  /**
   * 获取导出记录
   */
  getExportHistory(): Observable<any[]> {
    return this.api.get(`${this.prefix}/export/history`);
  }
}
