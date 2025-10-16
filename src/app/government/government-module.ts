import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GovernmentRoutingModule } from './government-routing-module';
import { SupervisionOverview } from './supervision-overview/supervision-overview';
import { SubsidyManagement } from './subsidy-management/subsidy-management';
import { IndustryAnalysis } from './industry-analysis/industry-analysis';
import { AIDecisionAssistant } from './ai-decision-assistant/ai-decision-assistant';
import { GovernmentCenter } from './government-center/government-center';
import { PasswordSettings } from './government-center/password-settings/password-settings';
import { NotificationSettings } from './government-center/notification-settings/notification-settings';
import { HelpCenter } from './government-center/help-center/help-center';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    GovernmentRoutingModule,
    SupervisionOverview,
    SubsidyManagement,
    IndustryAnalysis,
    AIDecisionAssistant,
    GovernmentCenter,
    PasswordSettings,
    NotificationSettings,
    HelpCenter
  ]
})
export class GovernmentModule { }
