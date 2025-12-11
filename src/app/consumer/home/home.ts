import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';
import { BottomNavComponent } from '../../shared/bottom-nav/bottom-nav.component';

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
  imports: [CommonModule, BottomNavComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {
  // 用户状态数据
  userLevel: number = 5;
  levelProgress: number = 68;
  userPoints: number = 2580;
  userCash: number = 156.80;
  
  // 当前选中的底部导航标签
  currentTab: string = 'home';
  
  // 附近回收员数据
  nearbyCollectors: Collector[] = [
    {
      id: '1',
      name: '张师傅',
      distance: '0.5km',
      status: '在线'
    },
    {
      id: '2',
      name: '李师傅',
      distance: '0.8km',
      status: '忙碌'
    },
    {
      id: '3',
      name: '王师傅',
      distance: '1.2km',
      status: '在线'
    },
    {
      id: '4',
      name: '赵师傅',
      distance: '1.5km',
      status: '在线'
    }
  ];
  
  // 自助投递点数据
  dropPoints: DropPoint[] = [
    {
      id: '1',
      name: '万达广场投递点',
      distance: '0.3km',
      capacity: 25
    },
    {
      id: '2',
      name: '社区服务中心',
      distance: '0.7km',
      capacity: 68
    },
    {
      id: '3',
      name: '地铁站投递点',
      distance: '1.1km',
      capacity: 92
    }
  ];
  
  // 环保活动数据
  activities: Activity[] = [
    {
      id: '1',
      tag: '政策公告',
      title: '新版垃圾分类标准发布',
      description: '了解最新的垃圾分类要求，正确投放获得更多积分奖励'
    },
    {
      id: '2',
      tag: '环保活动',
      title: '地球日特别活动',
      description: '参与环保知识竞答，赢取丰厚奖品和现金红包'
    },
    {
      id: '3',
      tag: '积分兑换',
      title: '积分商城新品上架',
      description: '环保购物袋、保温杯等实用商品，积分兑换更优惠'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // 组件初始化时的逻辑
    this.loadUserData();
    this.loadDynamicData();
  }

  // 加载用户数据
  private loadUserData(): void {
    // 模拟从服务获取用户数据
    // 实际项目中这里会调用用户服务
    console.log('Loading user data...');
  }

  // 加载动态数据
  private loadDynamicData(): void {
    // 模拟从服务获取动态数据
    // 实际项目中这里会调用相关服务
    console.log('Loading dynamic data...');
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
    this.loadDynamicData();
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
}
