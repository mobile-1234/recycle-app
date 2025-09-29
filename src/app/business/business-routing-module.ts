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
  { path: 'order-management', component: OrderManagement },
  { path: 'device-management', component: DeviceManagement },
  { path: 'data-reports', component: DataReports },
  { path: 'ai-operations-assistant', component: AiOperationsAssistant },
  { path: 'enterprise-center', component: EnterpriseCenter }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessRoutingModule { }
