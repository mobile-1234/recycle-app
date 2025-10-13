import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  // 默认重定向到登录页
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  
  // 认证模块路由
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth-module').then(m => m.AuthModule)
  },
  
  // C端个人用户路由 - 临时移除认证守卫用于测试
  {
    path: 'consumer',
    loadChildren: () => import('./consumer/consumer-module').then(m => m.ConsumerModule)
    // canActivate: [authGuard] // 临时注释掉用于测试
  },
  
  // B端企业用户路由 - 开发阶段临时移除认证守卫
  {
    path: 'business',
    loadChildren: () => import('./business/business-module').then(m => m.BusinessModule)
    // canActivate: [authGuard]
  },
  
  // G端政府用户路由 - 开发阶段临时移除认证守卫，确保可访问
  {
    path: 'government',
    loadChildren: () => import('./government/government-module').then(m => m.GovernmentModule)
  },
  
  // 404页面
  { path: '**', redirectTo: '/auth/login' }
];
