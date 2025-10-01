import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { BookingRecycle } from './booking-recycle/booking-recycle';
import { EarningsComponent } from './earnings/earnings';
import { PointsMall } from './points-mall/points-mall';
import { EcoKnowledge } from './eco-knowledge/eco-knowledge';
import { AiAssistant } from './ai-assistant/ai-assistant';
import { Profile } from './profile/profile';
import { NotificationsComponent } from './home/notifications/notifications';
import { ArRecognitionComponent } from './home/ar-recognition/ar-recognition';
import { DropPointsComponent } from './home/drop-points/drop-points';
import { CollectorsComponent } from './home/collectors/collectors';
import { ActivitiesComponent } from './home/activities/activities';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'booking', component: BookingRecycle },
  { path: 'booking-recycle', component: BookingRecycle },
  { path: 'earnings', component: EarningsComponent },
  { path: 'mall', component: PointsMall },
  { path: 'points-mall', component: PointsMall },
  { path: 'eco-knowledge', component: EcoKnowledge },
  { path: 'points-mall/eco-knowledge', component: EcoKnowledge },
  { path: 'ai-assistant', component: AiAssistant },
  { path: 'profile', component: Profile },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'ar-recognition', component: ArRecognitionComponent },
  { path: 'drop-points', component: DropPointsComponent },
  { path: 'collectors', component: CollectorsComponent },
  { path: 'activities', component: ActivitiesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsumerRoutingModule { }
