import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { BottomNavComponent } from '../../shared/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, RouterModule, BottomNavComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {
  currentTab = 'profile';

  // 用户信息与状态（参考 personal.html）
  userName = '环保达人';
  userLevel = 'LV5 环保先锋';
  selectedAvatar = 1;

  // 统计数据
  statRecycleCount = 28;
  statCashTotal = 386.5;
  statCarbonTotal = 128.6;

  // 模态框状态
  showLogout = false;
  showEdit = false;

  constructor(private router: Router) {}

  // 返回上一页
  goBack(): void {
    this.router.navigate(['/consumer/home']);
  }

  // 打开/关闭编辑资料
  openEditModal(): void {
    this.showEdit = true;
  }

  closeEditModal(event?: MouseEvent): void {
    // 仅点击遮罩关闭
    if (!event || event.target === event.currentTarget) {
      this.showEdit = false;
    }
  }

  // 选择头像
  selectAvatar(index: number): void {
    this.selectedAvatar = index;
  }

  // 保存资料
  saveProfile(): void {
    // 可扩展为实际保存逻辑
    alert('资料已保存');
    this.showEdit = false;
  }

  // 打开/关闭退出登录
  openLogoutModal(): void {
    this.showLogout = true;
  }

  closeLogoutModal(event?: MouseEvent): void {
    if (!event || event.target === event.currentTarget) {
      this.showLogout = false;
    }
  }

  // 确认退出登录
  confirmLogout(): void {
    alert('已退出登录');
    this.showLogout = false;
    this.router.navigate(['/auth/login']);
  }

  // 菜单跳转（示例占位）
  goToPage(page: string): void {
    const pageNames: Record<string, string> = {
      orders: '我的订单',
      address: '我的地址',
      favorites: '我的收藏',
      invite: '邀请好友',
      customerService: '客服与反馈',
      settings: '设置',
      about: '关于我们',
      agreement: '用户协议',
      privacy: '隐私政策'
    };
    alert(`跳转到${pageNames[page] || page}页面`);
  }

  // 显示所有徽章
  showAllBadges(): void {
    alert('查看所有成就徽章');
  }

  // 切换底部导航标签
  switchTab(tab: string): void {
    this.currentTab = tab;
    console.log(`Switching to tab: ${tab}`);
    
    // 根据选中的标签导航到对应页面
    switch (tab) {
      case 'home':
        this.router.navigate(['/consumer/home']);
        break;
      case 'booking':
        this.router.navigate(['/consumer/booking-recycle']);
        break;
      case 'earnings':
        this.router.navigate(['/consumer/earnings']);
        break;
      case 'mall':
        this.router.navigate(['/consumer/points-mall']);
        break;
      case 'profile':
        // 已经在个人中心页面，不需要导航
        break;
      default:
        console.warn(`Unknown tab: ${tab}`);
    }
  }
}
