import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GovernmentRoutingModule } from './government-routing-module';
import { SupervisionOverview } from './supervision-overview/supervision-overview';
import { SubsidyManagement } from './subsidy-management/subsidy-management';
import { IndustryAnalysis } from './industry-analysis/industry-analysis';
import { AIDecisionAssistant } from './ai-decision-assistant/ai-decision-assistant';
import { GovernmentCenter } from './government-center/government-center';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    GovernmentRoutingModule,
    SupervisionOverview,
    SubsidyManagement,
    IndustryAnalysis,
    AIDecisionAssistant,
    GovernmentCenter
  ]
})
export class GovernmentModule { }
