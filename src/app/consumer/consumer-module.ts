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
    Profile
  ]
})
export class ConsumerModule { }
