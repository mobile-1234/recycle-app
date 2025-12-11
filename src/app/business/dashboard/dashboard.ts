import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

interface DataCard {
  value: string;
  label: string;
  trend: string;
  icon: string;
}

interface AlertInfo {
  title: string;
  content: string[];
  icon: string;
}

interface QuickAction {
  label: string;
  icon: string;
  route?: string;
  action?: string;
}

interface TodoItem {
  title: string;
  description: string;
  count: number;
  icon: string;
  route?: string;
}

interface AISuggestion {
  text: string;
  action?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  // 用户信息
  userInfo = {
    name: '张经理',
    company: '再生视界有限公司'
  };

  // 核心数据
  dataCards: DataCard[] = [
    {
      value: '2,456',
      label: '今日回收量(kg)',
      trend: '↑ 12.5%',
      icon: '♻️'
    },
    {
      value: '¥18,920',
      label: '产值',
      trend: '↑ 8.3%',
      icon: '💰'
    },
    {
      value: '94.2%',
      label: '订单完成率',
      trend: '↑ 2.1%',
      icon: '📊'
    },
    {
      value: '98.5%',
      label: '设备运行率',
      trend: '→ 0%',
      icon: '⚙️'
    }
  ];

  // 预警信息
  alertInfo: AlertInfo = {
    title: '预警信息',
    icon: '⚠️',
    content: [
      '设备A3需要维护保养',
      '库存不足，建议及时补货',
      '3个订单超时未处理'
    ]
  };

  // 快捷操作
  quickActions: QuickAction[] = [
    {
      label: '创建订单',
      icon: '📝',
      route: '/business/orders/create'
    },
    {
      label: '分配订单',
      icon: '📋',
      route: '/business/orders/assign'
    },
    {
      label: '查看报表',
      icon: '📈',
      route: '/business/reports'
    },
    {
      label: 'AI助手',
      icon: '🤖',
      action: 'openAI'
    }
  ];

  // 待办事项
  todoItems: TodoItem[] = [
    {
      title: '待处理订单',
      description: '需要及时处理的新订单',
      count: 12,
      icon: '📦',
      route: '/business/orders/pending'
    },
    {
      title: '待审核申请',
      description: '用户提交的回收申请',
      count: 8,
      icon: '📋',
      route: '/business/applications'
    },
    {
      title: '设备维护计划',
      description: '本周需要维护的设备',
      count: 3,
      icon: '🔧',
      route: '/business/equipment/maintenance'
    }
  ];

  // AI建议
  aiSuggestions: AISuggestion[] = [
    { text: '优化回收路线', action: 'optimizeRoute' },
    { text: '库存预警提醒', action: 'inventoryAlert' },
    { text: '设备维护建议', action: 'maintenanceAdvice' },
    { text: '效率分析报告', action: 'efficiencyReport' }
  ];

  // 底部导航
  navItems = [
    { label: '工作台', icon: '🏠', route: '/business/dashboard', active: true },
    { label: '订单', icon: '📋', route: '/business/orders', active: false },
    { label: '设备', icon: '⚙️', route: '/business/equipment', active: false },
    { label: '报表', icon: '📊', route: '/business/reports', active: false },
    { label: '我的', icon: '👤', route: '/business/profile', active: false }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    // 初始化数据
    this.loadDashboardData();
  }

  // 加载仪表板数据
  loadDashboardData() {
    // 这里可以调用API获取实时数据
    console.log('Loading dashboard data...');
  }

  // 数据卡片点击事件
  onDataCardClick(card: DataCard) {
    console.log('Data card clicked:', card.label);
    // 根据不同的卡片跳转到相应的详情页
    switch (card.label) {
      case '今日回收量(kg)':
        this.router.navigate(['/business/recycling/details']);
        break;
      case '产值':
        this.router.navigate(['/business/finance/revenue']);
        break;
      case '订单完成率':
        this.router.navigate(['/business/orders/statistics']);
        break;
      case '设备运行率':
        this.router.navigate(['/business/equipment/status']);
        break;
    }
  }

  // 快捷操作点击事件
  onQuickActionClick(action: QuickAction) {
    if (action.route) {
      this.router.navigate([action.route]);
    } else if (action.action) {
      this.handleAction(action.action);
    }
  }

  // 待办事项点击事件
  onTodoItemClick(item: TodoItem) {
    if (item.route) {
      this.router.navigate([item.route]);
    }
  }

  // AI助手点击事件
  onAIAssistantClick() {
    console.log('AI Assistant clicked');
    this.router.navigate(['/business/ai-assistant']);
  }

  // AI建议点击事件
  onAISuggestionClick(suggestion: AISuggestion) {
    if (suggestion.action) {
      this.handleAction(suggestion.action);
    }
  }

  // 底部导航点击事件
  onNavItemClick(item: any) {
    // 更新活跃状态
    this.navItems.forEach(nav => nav.active = false);
    item.active = true;
    
    // 导航到对应页面
    this.router.navigate([item.route]);
  }

  // 处理各种操作
  private handleAction(action: string) {
    switch (action) {
      case 'openAI':
        this.router.navigate(['/business/ai-assistant']);
        break;
      case 'optimizeRoute':
        console.log('Optimizing route...');
        // 实现路线优化逻辑
        break;
      case 'inventoryAlert':
        console.log('Setting inventory alert...');
        // 实现库存预警逻辑
        break;
      case 'maintenanceAdvice':
        console.log('Getting maintenance advice...');
        // 实现维护建议逻辑
        break;
      case 'efficiencyReport':
        console.log('Generating efficiency report...');
        // 实现效率报告逻辑
        break;
    }
  }

  // 用户头像点击事件
  onUserAvatarClick() {
    this.router.navigate(['/business/profile']);
  }

  // 查看更多点击事件
  onViewMoreClick(section: string) {
    switch (section) {
      case 'alerts':
        this.router.navigate(['/business/alerts']);
        break;
      case 'todos':
        this.router.navigate(['/business/todos']);
        break;
    }
  }
}
