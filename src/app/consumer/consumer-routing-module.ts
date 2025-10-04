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

// Profile子页面组件导入
import { AddressesComponent } from './profile/addresses/addresses';
import { OrdersComponent } from './profile/orders/orders';
import { FavoritesComponent } from './profile/favorites/favorites';
import { SettingsComponent } from './profile/settings/settings';
import { InviteFriendsComponent } from './profile/invite-friends/invite-friends';
import { CustomerServiceComponent } from './profile/customer-service/customer-service';
import { AboutUsPage } from './profile/about-us/about-us';
import { UserAgreementPage } from './profile/user-agreement/user-agreement';
import { PrivacyPolicyPage } from './profile/privacy-policy/privacy-policy';

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
  
  // Profile子页面路由
  { path: 'profile/addresses', component: AddressesComponent },
  { path: 'profile/orders', component: OrdersComponent },
  { path: 'profile/favorites', component: FavoritesComponent },
  { path: 'profile/settings', component: SettingsComponent },
  { path: 'profile/invite-friends', component: InviteFriendsComponent },
  { path: 'profile/customer-service', component: CustomerServiceComponent },
  { path: 'profile/about-us', component: AboutUsPage },
  { path: 'profile/user-agreement', component: UserAgreementPage },
  { path: 'profile/privacy-policy', component: PrivacyPolicyPage },
  
  // 其他页面路由
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
