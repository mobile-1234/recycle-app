import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { OrderManagement } from './order-management/order-management';
import { DeviceManagement } from './device-management/device-management';
import { DataReports } from './data-reports/data-reports';
import { AiOperationsAssistant } from './ai-operations-assistant/ai-operations-assistant';
import { EnterpriseCenter } from './enterprise-center/enterprise-center';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  
  // 订单相关路由
  { path: 'orders', component: OrderManagement },
  { path: 'orders/create', component: OrderManagement },
  { path: 'orders/assign', component: OrderManagement },
  { path: 'orders/pending', component: OrderManagement },
  { path: 'orders/statistics', component: OrderManagement },
  { path: 'order-management', component: OrderManagement },
  
  // 设备相关路由
  { path: 'equipment', component: DeviceManagement },
  { path: 'equipment/status', component: DeviceManagement },
  { path: 'equipment/maintenance', component: DeviceManagement },
  { path: 'device-management', component: DeviceManagement },
  
  // 报表相关路由
  { path: 'reports', component: DataReports },
  { path: 'data-reports', component: DataReports },
  
  // 业务数据详情路由
  { path: 'recycling/details', component: DataReports },
  { path: 'finance/revenue', component: DataReports },
  
  // AI助手相关路由
  { path: 'ai-assistant', component: AiOperationsAssistant },
  { path: 'ai-operations-assistant', component: AiOperationsAssistant },
  
  // 企业中心相关路由
  { path: 'profile', component: EnterpriseCenter },
  { path: 'enterprise-center', component: EnterpriseCenter },
  
  // 其他功能路由
  { path: 'applications', component: OrderManagement },
  { path: 'alerts', component: Dashboard },
  { path: 'todos', component: Dashboard }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessRoutingModule { }
