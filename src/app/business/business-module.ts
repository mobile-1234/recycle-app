import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessRoutingModule } from './business-routing-module';
import { Dashboard } from './dashboard/dashboard';
import { OrderManagement } from './order-management/order-management';
import { DeviceManagement } from './device-management/device-management';
import { DataReports } from './data-reports/data-reports';
import { AiOperationsAssistant } from './ai-operations-assistant/ai-operations-assistant';
import { EnterpriseCenter } from './enterprise-center/enterprise-center';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    BusinessRoutingModule,
    Dashboard,
    OrderManagement,
    DeviceManagement,
    DataReports,
    AiOperationsAssistant,
    EnterpriseCenter
  ]
})
export class BusinessModule { }
