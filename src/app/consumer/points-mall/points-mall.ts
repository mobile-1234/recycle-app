import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { BottomNavComponent } from '../../shared/bottom-nav/bottom-nav.component';
import { SvgIconComponent } from '../../shared/components/svg-icons/svg-icons.component';

interface Product {
  id: number;
  name: string;
  pointsPrice: number;
  cashPrice: number;
  marketPrice?: number;
  category: string;
  image: string;
  description: string;
  stock: number;
  tag?: string;
  icon?: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  active?: boolean;
}

interface Activity {
  id: number;
  title: string;
  description: string;
  time: string;
  timeInfo?: string;
  tag: string;
}

interface Task {
  id: number;
  name: string;
  description: string;
  progress: string;
  reward: number;
  icon: string;
  completed: boolean;
  buttonText?: string;
}

@Component({
  selector: 'app-points-mall',
  imports: [CommonModule, RouterModule, BottomNavComponent, SvgIconComponent],
  templateUrl: './points-mall.html',
  styleUrl: './points-mall.scss'
})
export class PointsMall {
  // 用户积分余额
  userPoints = 2580;
  
  // 当前选中的分类
  selectedCategory = 'all';
  
  // 当前选中的标签页
  currentTab = 'mall';
  
  // 轮播当前索引
  currentCarouselIndex = 0;
  
  // 每日签到奖励积分
  dailyCheckinReward = 10;
  
  // 模态框状态
  showProductModal = false;
  showCheckinModal = false;
  selectedProduct: Product | null = null;
  
  // 商品分类
  categories: Category[] = [
    { id: 'all', name: '全部', icon: 'fas fa-th-large', active: true },
    { id: 'electronics', name: '数码', icon: 'fas fa-mobile-alt', active: false },
    { id: 'home', name: '家居', icon: 'fas fa-home', active: false },
    { id: 'food', name: '食品', icon: 'fas fa-utensils', active: false }
  ];
  
  // 活动轮播数据
  activities: Activity[] = [
    {
      id: 1,
      title: '新用户专享',
      description: '注册即送500积分',
      time: '2024.01.01-2024.01.31',
      timeInfo: '2024.01.01-2024.01.31',
      tag: '限时'
    },
    {
      id: 2,
      title: '积分翻倍',
      description: '回收积分双倍奖励',
      time: '2024.01.15-2024.01.20',
      timeInfo: '2024.01.15-2024.01.20',
      tag: '热门'
    },
    {
      id: 3,
      title: '签到有礼',
      description: '连续签到7天送大礼',
      time: '每日签到',
      timeInfo: '每日签到',
      tag: '每日'
    }
  ];
  
  // 商品列表
  products: Product[] = [
    {
      id: 1,
      name: '小米无线充电器',
      pointsPrice: 800,
      cashPrice: 99,
      marketPrice: 129,
      category: 'electronics',
      image: 'data:image/svg+xml;charset=utf-8,<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" rx="10" fill="%23f5f5f5"/><rect x="20" y="30" width="60" height="40" rx="5" fill="%23333"/><circle cx="50" cy="50" r="15" fill="%23fff"/><circle cx="50" cy="50" r="8" fill="%2300aaff"/></svg>',
      description: '支持10W快充，兼容多种设备',
      stock: 50,
      tag: '热销',
      icon: 'fas fa-mobile-alt'
    },
    {
      id: 2,
      name: '环保购物袋',
      pointsPrice: 200,
      cashPrice: 25,
      marketPrice: 35,
      category: 'home',
      image: 'data:image/svg+xml;charset=utf-8,<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" rx="10" fill="%23f5f5f5"/><path d="M25 35h50v45c0 5-5 10-10 10H35c-5 0-10-5-10-10V35z" fill="%234caf50"/><path d="M35 35V25c0-5 5-10 10-10h10c5 0 10 5 10 10v10" stroke="%234caf50" stroke-width="3" fill="none"/></svg>',
      description: '可重复使用，环保材质',
      stock: 100,
      icon: 'fas fa-shopping-bag'
    },
    {
      id: 3,
      name: '有机燕麦片',
      pointsPrice: 300,
      cashPrice: 38,
      marketPrice: 48,
      category: 'food',
      image: 'data:image/svg+xml;charset=utf-8,<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" rx="10" fill="%23f5f5f5"/><rect x="20" y="20" width="60" height="60" rx="5" fill="%23fff" stroke="%23ddd" stroke-width="2"/><circle cx="35" cy="35" r="4" fill="%23ffc107"/><circle cx="50" cy="40" r="3" fill="%23ffc107"/><circle cx="65" cy="45" r="4" fill="%23ffc107"/><circle cx="40" cy="55" r="3" fill="%23ffc107"/><circle cx="60" cy="60" r="4" fill="%23ffc107"/></svg>',
      description: '营养丰富，健康早餐首选',
      stock: 30,
      icon: 'fas fa-seedling'
    },
    {
      id: 4,
      name: '蓝牙耳机',
      pointsPrice: 1200,
      cashPrice: 149,
      marketPrice: 199,
      category: 'electronics',
      image: 'data:image/svg+xml;charset=utf-8,<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" rx="10" fill="%23f5f5f5"/><ellipse cx="30" cy="40" rx="12" ry="15" fill="%23333"/><ellipse cx="70" cy="40" rx="12" ry="15" fill="%23333"/><path d="M42 40c0-10 8-18 18-18s18 8 18 18" stroke="%23333" stroke-width="3" fill="none"/><circle cx="30" cy="40" r="5" fill="%2300aaff"/><circle cx="70" cy="40" r="5" fill="%2300aaff"/></svg>',
      description: '高品质音效，长续航',
      stock: 25,
      tag: '新品',
      icon: 'fas fa-headphones'
    },
    {
      id: 5,
      name: '竹纤维毛巾',
      pointsPrice: 150,
      cashPrice: 19,
      marketPrice: 29,
      category: 'home',
      image: 'data:image/svg+xml;charset=utf-8,<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" rx="10" fill="%23f5f5f5"/><rect x="20" y="30" width="60" height="40" rx="5" fill="%2387ceeb"/><line x1="25" y1="35" x2="75" y2="35" stroke="%235f9ea0" stroke-width="2"/><line x1="25" y1="45" x2="75" y2="45" stroke="%235f9ea0" stroke-width="2"/><line x1="25" y1="55" x2="75" y2="55" stroke="%235f9ea0" stroke-width="2"/><line x1="25" y1="65" x2="75" y2="65" stroke="%235f9ea0" stroke-width="2"/></svg>',
      description: '天然抗菌，柔软舒适',
      stock: 80,
      icon: 'fas fa-bath'
    },
    {
      id: 6,
      name: '坚果礼盒',
      pointsPrice: 400,
      cashPrice: 50,
      marketPrice: 68,
      category: 'food',
      image: 'data:image/svg+xml;charset=utf-8,<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" rx="10" fill="%23f5f5f5"/><rect x="20" y="30" width="60" height="40" rx="5" fill="%23dd6b20"/><rect x="20" y="25" width="60" height="10" rx="5" fill="%23ffd700"/><circle cx="35" cy="45" r="4" fill="%238b4513"/><circle cx="50" cy="50" r="3" fill="%238b4513"/><circle cx="65" cy="55" r="4" fill="%238b4513"/><circle cx="40" cy="60" r="3" fill="%238b4513"/><circle cx="60" cy="40" r="3" fill="%238b4513"/></svg>',
      description: '精选坚果，营养健康',
      stock: 40,
      icon: 'fas fa-gift'
    }
  ];
  
  // 积分任务
  tasks: Task[] = [
    {
      id: 1,
      name: '每日签到',
      description: '连续签到获得积分奖励',
      progress: '今日未签到',
      reward: 10,
      icon: 'fas fa-calendar-check',
      completed: false,
      buttonText: '签到'
    },
    {
      id: 2,
      name: '完成回收',
      description: '完成一次废品回收',
      progress: '0/1',
      reward: 50,
      icon: 'fas fa-recycle',
      completed: false,
      buttonText: '去回收'
    },
    {
      id: 3,
      name: '邀请好友',
      description: '邀请好友注册使用',
      progress: '0/3',
      reward: 100,
      icon: 'fas fa-user-friends',
      completed: false,
      buttonText: '邀请'
    },
    {
      id: 4,
      name: '分享应用',
      description: '分享应用给朋友',
      progress: '已完成',
      reward: 20,
      icon: 'fas fa-share-alt',
      completed: true,
      buttonText: '分享'
    }
  ];
  
  // 签到日历数据
  checkinDays = Array.from({ length: 7 }, (_, i) => ({
    day: i + 1,
    checked: i < 3, // 前3天已签到
    isToday: i === 3 // 第4天是今天
  }));

  constructor(private router: Router) {
    // 启动轮播自动切换
    this.startCarousel();
  }

  // 获取过滤后的商品列表
  get filteredProducts(): Product[] {
    if (this.selectedCategory === 'all') {
      return this.products;
    }
    return this.products.filter(product => product.category === this.selectedCategory);
  }

  // 切换商品分类
  selectCategory(category: Category): void {
    // 重置所有分类的active状态
    this.categories.forEach(cat => cat.active = false);
    // 设置选中分类的active状态
    category.active = true;
    // 更新选中的分类ID
    this.selectedCategory = category.id;
  }

  // 启动轮播自动切换
  startCarousel(): void {
    setInterval(() => {
      this.currentCarouselIndex = (this.currentCarouselIndex + 1) % this.activities.length;
    }, 3000);
  }

  // 手动切换轮播
  goToSlide(index: number): void {
    this.currentCarouselIndex = index;
  }

  // 获取轮播样式
  getCarouselTransform(): string {
    return `translateX(-${this.currentCarouselIndex * 100}%)`;
  }

  // 显示商品详情
  showProductDetail(product: Product): void {
    this.selectedProduct = product;
    this.showProductModal = true;
  }

  // 关闭商品详情模态框
  closeProductModal(): void {
    this.showProductModal = false;
    this.selectedProduct = null;
  }

  // 兑换商品
  exchangeProduct(product: Product, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (this.userPoints >= product.pointsPrice && product.stock > 0) {
      this.userPoints -= product.pointsPrice;
      product.stock--;
      alert(`成功兑换 ${product.name}！`);
    } else if (this.userPoints < product.pointsPrice) {
      alert('积分不足，无法兑换！');
    } else {
      alert('商品库存不足！');
    }
  }

  // 确认兑换商品
  confirmExchange(): void {
    if (this.selectedProduct && this.userPoints >= this.selectedProduct.pointsPrice) {
      this.userPoints -= this.selectedProduct.pointsPrice;
      this.selectedProduct.stock--;
      this.showProductModal = false;
      this.selectedProduct = null;
      alert('兑换成功！');
    } else {
      alert('积分不足！');
    }
  }

  // 显示签到模态框
  showCheckin(): void {
    this.showCheckinModal = true;
  }

  // 关闭签到模态框
  closeCheckinModal(): void {
    this.showCheckinModal = false;
  }

  // 执行签到
  doCheckin(): void {
    const todayIndex = this.checkinDays.findIndex(day => day.isToday);
    if (todayIndex !== -1 && !this.checkinDays[todayIndex].checked) {
      this.checkinDays[todayIndex].checked = true;
      this.userPoints += 10;
      
      // 更新签到任务状态
      const checkinTask = this.tasks.find(task => task.id === 1);
      if (checkinTask) {
        checkinTask.progress = '今日已签到';
        checkinTask.completed = true;
      }
      
      alert('签到成功！获得10积分');
    } else {
      alert('今日已签到或签到时间未到！');
    }
    this.closeCheckinModal();
  }

  // 执行任务
  doTask(task: Task): void {
    if (task.completed) {
      return;
    }

    switch (task.id) {
      case 1: // 签到任务
        this.showCheckin();
        break;
      case 2: // 回收任务
        alert('请前往预约页面完成回收任务');
        break;
      case 3: // 邀请任务
        alert('邀请功能开发中...');
        break;
      default:
        break;
    }
  }

  // 查看积分记录
  viewPointsHistory(): void {
    alert('积分记录功能开发中...');
  }

  // 充值积分
  rechargePoints(): void {
    alert('积分充值功能开发中...');
  }

  // 返回上一页
  goBack(): void {
    window.history.back();
  }

  // 显示积分规则
  showPointsRules(): void {
    alert('积分规则：\n1. 完成回收任务获得积分\n2. 每日签到获得积分\n3. 邀请好友获得积分\n4. 积分可兑换商品');
  }

  // 显示积分记录（重命名方法以匹配HTML中的调用）
  showPointsHistory(): void {
    this.viewPointsHistory();
  }

  // 设置活动轮播的当前索引（重命名属性以匹配HTML中的引用）
  get currentActivityIndex(): number {
    return this.currentCarouselIndex;
  }

  // 设置活动轮播
  setActiveActivity(index: number): void {
    this.goToSlide(index);
  }

  // 底部导航切换
  switchTab(tab: string): void {
    this.currentTab = tab;
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
        // 当前页面，无需操作
        break;
      case 'profile':
        this.router.navigate(['/consumer/profile']);
        break;
    }
  }

  // 导航到环保知识页面
  navigateToEcoKnowledge(): void {
    this.router.navigate(['/consumer/eco-knowledge']);
  }
}
