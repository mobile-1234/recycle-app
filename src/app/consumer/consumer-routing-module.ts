import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './home/home';
import { BookingRecycle } from './booking-recycle/booking-recycle';
import { Earnings } from './earnings/earnings';
import { PointsMall } from './points-mall/points-mall';
import { EcoKnowledge } from './eco-knowledge/eco-knowledge';
import { AiAssistant } from './ai-assistant/ai-assistant';
import { Profile } from './profile/profile';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'booking-recycle', component: BookingRecycle },
  { path: 'earnings', component: Earnings },
  { path: 'points-mall', component: PointsMall },
  { path: 'eco-knowledge', component: EcoKnowledge },
  { path: 'ai-assistant', component: AiAssistant },
  { path: 'profile', component: Profile }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsumerRoutingModule { }
