import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupervisionOverview } from './supervision-overview/supervision-overview';
import { SubsidyManagement } from './subsidy-management/subsidy-management';
import { IndustryAnalysis } from './industry-analysis/industry-analysis';
import { AIDecisionAssistant } from './ai-decision-assistant/ai-decision-assistant';
import { GovernmentCenter } from './government-center/government-center';

const routes: Routes = [
  { path: '', redirectTo: 'supervision-overview', pathMatch: 'full' },
  { path: 'supervision-overview', component: SupervisionOverview },
  { path: 'subsidy-management', component: SubsidyManagement },
  { path: 'industry-analysis', component: IndustryAnalysis },
  { path: 'ai-decision-assistant', component: AIDecisionAssistant },
  { path: 'government-center', component: GovernmentCenter }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GovernmentRoutingModule { }
