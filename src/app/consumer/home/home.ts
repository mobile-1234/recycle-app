import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';
import { BottomNavComponent } from '../../shared/bottom-nav/bottom-nav.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ConsumerApiService } from '../../core/services/consumer-api.service';
import { AuthService } from '../../auth/services/auth.service';

interface Collector {
  id: string;
  name: string;
  distance: string;
  status: string;
}

interface DropPoint {
  id: string;
  name: string;
  distance: string;
  capacity: number;
}

interface Activity {
  id: string;
  tag: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, BottomNavComponent, SkeletonComponent, EmptyStateComponent, StatusBadgeComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {
  // 用户状态数据
  userLevel: number = 0;
  levelProgress: number = 0;
  userPoints: number = 0;
  userCash: number = 0;
  unreadCount: number = 0;
  
  // 当前选中的底部导航标签
  currentTab: string = 'home';
  
  // 数据加载状态
  loading = {
    user: false,
    collectors: false,
    dropPoints: false,
    activities: false
  };
  
  // 当前位置（用于获取附近数据）
  currentLocation = {
    longitude: 115.858197,
    latitude: 28.682892
  };
  
  // 附近回收员数据
  nearbyCollectors: Collector[] = [];
  
  // 自助投递点数据
  dropPoints: DropPoint[] = [];
  
  // 环保活动数据
  activities: Activity[] = [];

  constructor(
    private router: Router,
    private consumerApi: ConsumerApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // 获取当前位置
    this.getCurrentLocation();
    // 加载所有数据
    this.loadUserData();
    this.loadNearbyCollectors();
    this.loadNearbyDropPoints();
    this.loadActivities();
  }

  // 获取当前位置
  private getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentLocation = {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude
          };
          // 位置获取后重新加载附近数据
          this.loadNearbyCollectors();
          this.loadNearbyDropPoints();
        },
        (error) => {
          console.warn('获取位置失败，使用默认位置', error);
        }
      );
    }
  }

  // 加载用户数据
  private loadUserData(): void {
    this.loading.user = true;
    this.consumerApi.getUserStats().subscribe({
      next: (stats) => {
        this.userLevel = stats.level || 1;
        this.levelProgress = stats.levelProgress || 0;
        this.userPoints = stats.availablePoints || 0;
        this.userCash = stats.availableCash || 0;
        this.loading.user = false;
      },
      error: (error) => {
        console.error('加载用户数据失败:', error);
        this.loading.user = false;
        // 使用默认值
        this.userLevel = 1;
        this.levelProgress = 0;
        this.userPoints = 0;
        this.userCash = 0;
      }
    });
  }

  // 加载附近回收员
  private loadNearbyCollectors(): void {
    this.loading.collectors = true;
    this.consumerApi.getNearbyCollectors(
      this.currentLocation.longitude,
      this.currentLocation.latitude,
      5
    ).subscribe({
      next: (collectors) => {
        this.nearbyCollectors = collectors.map(c => ({
          id: c.id,
          name: c.name,
          distance: this.formatDistance(c.distance),
          status: this.formatStatus(c.status)
        }));
        this.loading.collectors = false;
      },
      error: (error) => {
        console.error('加载回收员失败:', error);
        this.loading.collectors = false;
        // 使用空数组或模拟数据
        this.nearbyCollectors = [];
      }
    });
  }

  // 加载附近投递点
  private loadNearbyDropPoints(): void {
    this.loading.dropPoints = true;
    this.consumerApi.getNearbyDropPoints(
      this.currentLocation.longitude,
      this.currentLocation.latitude,
      5
    ).subscribe({
      next: (points) => {
        this.dropPoints = points.map(p => ({
          id: p.id,
          name: p.name,
          distance: this.formatDistance(p.distance),
          capacity: p.currentVolume ? Math.round((p.currentVolume / p.capacity) * 100) : 0
        }));
        this.loading.dropPoints = false;
      },
      error: (error) => {
        console.error('加载投递点失败:', error);
        this.loading.dropPoints = false;
        this.dropPoints = [];
      }
    });
  }

  // 加载活动列表
  private loadActivities(): void {
    this.loading.activities = true;
    this.consumerApi.getActivities({ status: 1, limit: 3 }).subscribe({
      next: (activities) => {
        this.activities = activities.map(a => ({
          id: a.id,
          tag: a.tag || a.type || '活动',
          title: a.title,
          description: a.description
        }));
        this.loading.activities = false;
      },
      error: (error) => {
        console.error('加载活动失败:', error);
        this.loading.activities = false;
        this.activities = [];
      }
    });
  }

  // 格式化距离
  private formatDistance(distance: number): string {
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    }
    return `${(distance / 1000).toFixed(1)}km`;
  }

  // 格式化状态
  private formatStatus(status: string): string {
    const statusMap: any = {
      'online': '在线',
      'offline': '离线',
      'busy': '忙碌'
    };
    return statusMap[status] || status;
  }

  // 打开通知页面
  openNotifications(): void {
    console.log('Opening notifications...');
    this.router.navigate(['/consumer/notifications']);
  }

  // 一键预约回收
  quickBooking(): void {
    console.log('Quick booking initiated...');
    this.router.navigate(['/consumer/booking-recycle']);
  }

  // 打开AR识废品功能
  openARRecognition(): void {
    console.log('Opening AR recognition...');
    this.router.navigate(['/consumer/ar-recognition']);
  }

  // 查找自助投递点
  findDropPoints(): void {
    console.log('Finding drop points...');
    this.router.navigate(['/consumer/drop-points']);
  }

  // 查看更多回收员
  viewMoreCollectors(): void {
    console.log('Viewing more collectors...');
    this.router.navigate(['/consumer/collectors']);
  }

  // 查看更多投递点
  viewMoreDropPoints(): void {
    console.log('Viewing more drop points...');
    this.router.navigate(['/consumer/drop-points']);
  }

  // 查看更多活动
  viewMoreActivities(): void {
    console.log('Viewing more activities...');
    this.router.navigate(['/consumer/activities']);
  }
  
  // 点击首页活动卡片，直接跳转到详情页
  openActivity(activity: Activity): void {
    console.log('Opening activity detail page...', activity);
    this.router.navigate(['/consumer/activity-detail', activity.id]);
  }

  // 打开AI助手
  openAIAssistant(): void {
    console.log('Opening AI assistant...');
    // 打开AI助手对话界面
    this.router.navigate(['/consumer/ai-assistant']);
  }

  // 切换底部导航标签
  switchTab(tab: string): void {
    this.currentTab = tab;
    console.log(`Switching to tab: ${tab}`);
    
    // 根据选中的标签导航到对应页面
    switch (tab) {
      case 'home':
        // 已经在首页，不需要导航
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
        this.router.navigate(['/consumer/profile']);
        break;
      default:
        console.warn(`Unknown tab: ${tab}`);
    }
  }

  // 刷新页面数据
  refreshData(): void {
    console.log('Refreshing data...');
    this.loadUserData();
    this.loadNearbyCollectors();
    this.loadNearbyDropPoints();
    this.loadActivities();
  }

  // 处理用户等级进度更新
  updateLevelProgress(): void {
    // 模拟等级进度更新
    if (this.levelProgress < 100) {
      this.levelProgress += 5;
    } else {
      this.userLevel += 1;
      this.levelProgress = 0;
    }
  }

  // 处理积分更新
  updatePoints(points: number): void {
    this.userPoints += points;
    console.log(`Points updated: +${points}, Total: ${this.userPoints}`);
  }

  // 处理现金更新
  updateCash(amount: number): void {
    this.userCash += amount;
    console.log(`Cash updated: +${amount}, Total: ${this.userCash}`);
  }

  // 获取容量等级样式类
  getCapacityLevel(capacity: number): string {
    if (capacity >= 90) return 'cap-critical';
    if (capacity >= 70) return 'cap-warning';
    if (capacity >= 40) return 'cap-normal';
    return 'cap-low';
  }
}
