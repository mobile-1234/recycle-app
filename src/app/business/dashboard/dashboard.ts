import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { BusinessApiService } from '../../core/services/business-api.service';
import { AuthService } from '../../auth/services/auth.service';

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
  imports: [CommonModule, RouterModule, SkeletonComponent, EmptyStateComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  // 用户信息
  userInfo = {
    name: '',
    company: ''
  };

  // 数据加载状态
  loading = {
    dashboard: false,
    alerts: false,
    todos: false,
    aiSuggestions: false
  };

  // 核心数据
  dataCards: DataCard[] = [];

  // 预警信息
  alertInfo: AlertInfo = {
    title: '预警信息',
    icon: '⚠️',
    content: []
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
  todoItems: TodoItem[] = [];

  // AI建议
  aiSuggestions: AISuggestion[] = [];

  // 底部导航
  navItems = [
    { label: '工作台', icon: '🏠', route: '/business/dashboard', active: true },
    { label: '订单', icon: '📋', route: '/business/orders', active: false },
    { label: '设备', icon: '⚙️', route: '/business/equipment', active: false },
    { label: '报表', icon: '📊', route: '/business/reports', active: false },
    { label: '我的', icon: '👤', route: '/business/profile', active: false }
  ];

  constructor(
    private router: Router,
    private businessApi: BusinessApiService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // 加载企业信息
    this.loadEnterpriseInfo();
    // 加载仪表板数据
    this.loadDashboardData();
    // 加载预警信息
    this.loadAlerts();
    // 加载待办事项
    this.loadTodos();
    // 加载AI建议
    this.loadAISuggestions();
  }

  // 加载企业信息
  private loadEnterpriseInfo(): void {
    this.businessApi.getEnterpriseInfo().subscribe({
      next: (info) => {
        this.userInfo = {
          name: info.contactPerson || '管理员',
          company: info.name || '企业'
        };
      },
      error: (error) => {
        console.error('加载企业信息失败:', error);
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          this.userInfo = {
            name: currentUser.name || '管理员',
            company: currentUser.companyName || '企业'
          };
        }
      }
    });
  }

  // 加载仪表板数据
  private loadDashboardData(): void {
    this.loading.dashboard = true;
    this.businessApi.getDashboardStats().subscribe({
      next: (stats) => {
        this.dataCards = [
          {
            value: this.formatNumber(stats.todayRecycleWeight || 0),
            label: '今日回收量(kg)',
            trend: this.formatTrend(stats.recycleWeightTrend),
            icon: '♻️'
          },
          {
            value: `¥${this.formatNumber(stats.todayRevenue || 0)}`,
            label: '产值',
            trend: this.formatTrend(stats.revenueTrend),
            icon: '💰'
          },
          {
            value: `${(stats.orderCompletionRate || 0).toFixed(1)}%`,
            label: '订单完成率',
            trend: this.formatTrend(stats.completionRateTrend),
            icon: '📊'
          },
          {
            value: `${(stats.deviceRunningRate || 0).toFixed(1)}%`,
            label: '设备运行率',
            trend: this.formatTrend(stats.deviceRunningTrend),
            icon: '⚙️'
          }
        ];
        this.loading.dashboard = false;
      },
      error: (error) => {
        console.error('加载仪表盘数据失败:', error);
        this.loading.dashboard = false;
        // 使用默认数据
        this.dataCards = [
          { value: '0', label: '今日回收量(kg)', trend: '→ 0%', icon: '♻️' },
          { value: '¥0', label: '产值', trend: '→ 0%', icon: '💰' },
          { value: '0%', label: '订单完成率', trend: '→ 0%', icon: '📊' },
          { value: '0%', label: '设备运行率', trend: '→ 0%', icon: '⚙️' }
        ];
      }
    });
  }

  // 加载预警信息
  private loadAlerts(): void {
    this.loading.alerts = true;
    this.businessApi.getAlerts({ page: 0, size: 5 }).subscribe({
      next: (alerts) => {
        this.alertInfo.content = alerts.content.map(a => a.title).slice(0, 3);
        this.loading.alerts = false;
      },
      error: (error) => {
        console.error('加载预警信息失败:', error);
        this.loading.alerts = false;
        this.alertInfo.content = [];
      }
    });
  }

  // 加载待办事项
  private loadTodos(): void {
    this.loading.todos = true;
    this.businessApi.getTodos({ status: 'pending' }).subscribe({
      next: (todos) => {
        // 按类型分组统计
        const todoGroups = this.groupTodosByType(todos);
        this.todoItems = Object.keys(todoGroups).map(type => ({
          title: this.getTodoTitle(type),
          description: this.getTodoDescription(type),
          count: todoGroups[type].length,
          icon: this.getTodoIcon(type),
          route: this.getTodoRoute(type)
        }));
        this.loading.todos = false;
      },
      error: (error) => {
        console.error('加载待办事项失败:', error);
        this.loading.todos = false;
        this.todoItems = [];
      }
    });
  }

  // 加载AI建议
  private loadAISuggestions(): void {
    this.loading.aiSuggestions = true;
    this.businessApi.getAIInsights().subscribe({
      next: (insights) => {
        this.aiSuggestions = insights.slice(0, 4).map(i => ({
          text: i.title,
          action: i.action
        }));
        this.loading.aiSuggestions = false;
      },
      error: (error) => {
        console.error('加载AI建议失败:', error);
        this.loading.aiSuggestions = false;
        this.aiSuggestions = [];
      }
    });
  }

  // 格式化数字
  private formatNumber(num: number): string {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`;
    }
    return num.toLocaleString();
  }

  // 格式化趋势
  private formatTrend(trend: number | undefined): string {
    if (!trend || trend === 0) return '→ 0%';
    const symbol = trend > 0 ? '↑' : '↓';
    return `${symbol} ${Math.abs(trend).toFixed(1)}%`;
  }

  // 按类型分组待办事项
  private groupTodosByType(todos: any[]): any {
    const groups: any = {};
    todos.forEach(todo => {
      const type = todo.type || 'other';
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(todo);
    });
    return groups;
  }

  // 获取待办标题
  private getTodoTitle(type: string): string {
    const titles: any = {
      'order': '待处理订单',
      'application': '待审核申请',
      'maintenance': '设备维护计划',
      'other': '其他待办'
    };
    return titles[type] || '待办事项';
  }

  // 获取待办描述
  private getTodoDescription(type: string): string {
    const descriptions: any = {
      'order': '需要及时处理的新订单',
      'application': '用户提交的回收申请',
      'maintenance': '本周需要维护的设备',
      'other': '需要处理的事项'
    };
    return descriptions[type] || '待处理事项';
  }

  // 获取待办图标
  private getTodoIcon(type: string): string {
    const icons: any = {
      'order': '📦',
      'application': '📋',
      'maintenance': '🔧',
      'other': '📌'
    };
    return icons[type] || '📌';
  }

  // 获取待办路由
  private getTodoRoute(type: string): string {
    const routes: any = {
      'order': '/business/orders/pending',
      'application': '/business/applications',
      'maintenance': '/business/equipment/maintenance',
      'other': '/business/todos'
    };
    return routes[type] || '/business/todos';
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
