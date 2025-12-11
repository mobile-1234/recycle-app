import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ConsumerRoutingModule } from './consumer-routing-module';
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
import { ActivityDetailComponent } from './home/activities/activity-detail';
import { AddressManagement } from './booking-recycle/address-management';
import { AddressesComponent } from './profile/addresses/addresses';
import { OrdersComponent } from './profile/orders/orders';
import { FavoritesComponent } from './profile/favorites/favorites';
import { SettingsComponent } from './profile/settings/settings';
import { InviteFriendsComponent } from './profile/invite-friends/invite-friends';
import { CustomerServiceComponent } from './profile/customer-service/customer-service';
import { AboutUsPage } from './profile/about-us/about-us';
import { UserAgreementPage } from './profile/user-agreement/user-agreement';
import { PrivacyPolicyPage } from './profile/privacy-policy/privacy-policy';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    ConsumerRoutingModule,
    HomeComponent,
    BookingRecycle,
    EarningsComponent,
    PointsMall,
    EcoKnowledge,
    AiAssistant,
    Profile,
    NotificationsComponent,
    ArRecognitionComponent,
    DropPointsComponent,
    CollectorsComponent,
    ActivitiesComponent,
    ActivityDetailComponent,
    AddressManagement,
    AddressesComponent,
    OrdersComponent,
    FavoritesComponent,
    SettingsComponent,
    InviteFriendsComponent,
    CustomerServiceComponent,
    AboutUsPage,
    UserAgreementPage,
    PrivacyPolicyPage
  ]
})
export class ConsumerModule { }
