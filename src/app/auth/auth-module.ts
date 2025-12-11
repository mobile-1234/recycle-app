import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing-module';
import { LoginComponent } from './login/login';
import { Register } from './register/register';
import { ForgotPasswordComponent } from './forgot-password/forgot-password';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthRoutingModule,
    LoginComponent,
    Register,
    ForgotPasswordComponent
  ]
})
export class AuthModule { }
