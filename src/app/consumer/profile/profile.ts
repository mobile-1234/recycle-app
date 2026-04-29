import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { BottomNavComponent } from '../../shared/bottom-nav/bottom-nav.component';
import { AvatarPickerComponent } from '../../shared/avatar-picker/avatar-picker.component';
import { ConsumerApiService } from '../../core/services/consumer-api.service';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, RouterModule, BottomNavComponent, AvatarPickerComponent],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  currentTab = 'profile';

  // 用户信息与状态
  userName = '环保达人';
  userLevel = 'LV5 环保先锋';
  userAvatar = '';  // 头像URL
  selectedAvatarIndex = 1;

  // 统计数据
  statRecycleCount = 28;
  statCashTotal = 386.5;
  statCarbonTotal = 128.6;

  // 模态框状态
  showLogout = false;
  showAvatarPicker = false;  // 头像选择器
  isSaving = false;

  constructor(
    private router: Router,
    private consumerApi: ConsumerApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
  }

  /**
   * 加载用户信息
   */
  loadUserInfo(): void {
    // 先从本地存储获取
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        this.userName = user.nickname || user.name || '环保达人';
        this.userAvatar = user.avatar || '';
        this.selectedAvatarIndex = user.avatarIndex || 1;
      } catch (e) {
        console.error('解析用户信息失败', e);
      }
    }

    // 从后端获取最新信息
    this.consumerApi.getUserInfo().subscribe({
      next: (user) => {
        if (user) {
          this.userName = user.nickname || '环保达人';
          this.userAvatar = user.avatar || '';
          this.selectedAvatarIndex = user.avatarIndex || 1;
          this.userLevel = user.levelName || 'LV1 环保新手';
          this.statRecycleCount = user.recycleCount || 0;
          this.statCashTotal = user.totalCash || 0;
          this.statCarbonTotal = user.totalCarbon || 0;
          
          // 更新本地存储
          this.updateLocalStorage({ 
            nickname: this.userName, 
            avatar: this.userAvatar,
            avatarIndex: this.selectedAvatarIndex 
          });
        }
      },
      error: (err) => console.error('加载用户信息失败:', err)
    });
  }

  // 返回上一页
  goBack(): void {
    this.router.navigate(['/consumer/home']);
  }

  // 打开头像选择器
  openAvatarPicker(): void {
    this.showAvatarPicker = true;
  }

  // 关闭头像选择器
  closeAvatarPicker(): void {
    this.showAvatarPicker = false;
  }

  /**
   * 保存头像和昵称
   */
  saveProfile(data: { avatar: string; avatarIndex: number; nickname: string }): void {
    this.isSaving = true;
    
    // 调用后端API保存
    this.consumerApi.updateProfile({
      nickname: data.nickname,
      avatar: data.avatar,
      avatarIndex: data.avatarIndex
    }).subscribe({
      next: () => {
        // 更新本地状态
        this.userName = data.nickname;
        this.userAvatar = data.avatar;
        this.selectedAvatarIndex = data.avatarIndex;
        
        // 更新本地存储
        this.updateLocalStorage(data);
        
        this.isSaving = false;
        this.showAvatarPicker = false;
        
        // 显示成功提示
        this.showToast('资料保存成功！');
      },
      error: (err) => {
        console.error('保存失败:', err);
        this.isSaving = false;
        
        // 即使API失败也保存到本地
        this.userName = data.nickname;
        this.userAvatar = data.avatar;
        this.selectedAvatarIndex = data.avatarIndex;
        this.updateLocalStorage(data);
        this.showAvatarPicker = false;
        this.showToast('资料已保存到本地');
      }
    });
  }

  /**
   * 更新本地存储
   */
  private updateLocalStorage(data: { nickname?: string; avatar?: string; avatarIndex?: number }): void {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (data.nickname) user.nickname = data.nickname;
        if (data.nickname) user.name = data.nickname;
        if (data.avatar) user.avatar = data.avatar;
        if (data.avatarIndex) user.avatarIndex = data.avatarIndex;
        localStorage.setItem('currentUser', JSON.stringify(user));
      } catch (e) {
        console.error('更新本地存储失败', e);
      }
    }
  }

  /**
   * 显示提示消息
   */
  private showToast(message: string): void {
    // 简单的提示实现
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 12px 24px;
      border-radius: 25px;
      font-size: 14px;
      z-index: 10001;
      animation: fadeInUp 0.3s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
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

  // 菜单跳转（实现实际路由导航）
  goToPage(page: string): void {
    const routeMap: Record<string, string> = {
      orders: '/consumer/profile/orders',
      address: '/consumer/profile/addresses',
      favorites: '/consumer/profile/favorites',
      invite: '/consumer/profile/invite-friends',
      customerService: '/consumer/profile/customer-service',
      settings: '/consumer/profile/settings',
      about: '/consumer/profile/about-us',
      agreement: '/consumer/profile/user-agreement',
      privacy: '/consumer/profile/privacy-policy'
    };
    const target = routeMap[page];
    if (target) {
      this.router.navigate([target]);
    } else {
      console.warn(`Unknown page key: ${page}`);
    }
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
