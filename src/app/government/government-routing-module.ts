import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupervisionOverview } from './supervision-overview/supervision-overview';
import { SubsidyManagement } from './subsidy-management/subsidy-management';
import { IndustryAnalysis } from './industry-analysis/industry-analysis';
import { AIDecisionAssistant } from './ai-decision-assistant/ai-decision-assistant';
import { GovernmentCenter } from './government-center/government-center';
import { PasswordSettings } from './government-center/password-settings/password-settings';
import { NotificationSettings } from './government-center/notification-settings/notification-settings';
import { HelpCenter } from './government-center/help-center/help-center';

const routes: Routes = [
  { path: '', redirectTo: 'supervision-overview', pathMatch: 'full' },
  { path: 'supervision-overview', component: SupervisionOverview },
  { path: 'subsidy-management', component: SubsidyManagement },
  { path: 'industry-analysis', component: IndustryAnalysis },
  { path: 'ai-decision-assistant', component: AIDecisionAssistant },
  { path: 'government-center', component: GovernmentCenter },
  { path: 'government-center/password-settings', component: PasswordSettings },
  { path: 'government-center/notification-settings', component: NotificationSettings },
  { path: 'government-center/help-center', component: HelpCenter }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GovernmentRoutingModule { }
