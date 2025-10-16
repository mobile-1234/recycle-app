import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Warning {
  id: string;
  type: 'violation' | 'anomaly' | 'complaint';
  title: string;
  area: string;
  time: string;
  level: 'high' | 'medium' | 'low';
  status: 'pending' | 'processing' | 'resolved';
}

interface AreaData {
  name: string;
  status: 'good' | 'warning' | 'critical';
  recycleVolume: number;
  accuracy: number;
}

@Component({
  selector: 'app-supervision-overview',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './supervision-overview.html',
  styleUrl: './supervision-overview.scss'
})
export class SupervisionOverview implements OnInit {
  mapLayer: 'sites' | 'compliance' | 'policy' = 'sites';
  showWarningDetailModal = false;
  showAreaDetailModal = false;
  selectedWarning: Warning | null = null;
  selectedArea: AreaData | null = null;
  
  // 系统设置相关
  showSettingsMenu = false;
  showPasswordModal = false;
  showNotificationModal = false;
  showHelpModal = false;
  
  // 密码显示控制
  showOldPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  
  // 密码表单
  passwordForm = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  
  // 通知设置
  notificationSettings = {
    systemAlerts: true,
    dataReports: true,
    policyUpdates: true,
    emailNotifications: false,
    email: '',
    smsNotifications: false,
    phone: ''
  };
  
  // 帮助中心
  helpActiveTab: 'faq' | 'tutorial' | 'contact' = 'faq';
  helpSearchQuery = '';
  
  faqs = [
    {
      question: '如何查看辖区详细数据？',
      answer: '点击地图上的区域标记或区域列表中的任意项目，即可查看该辖区的详细数据统计，包括人口、网点、合规率等信息。',
      expanded: false
    },
    {
      question: '预警通知如何处理？',
      answer: '在实时预警列表中点击预警项目，查看详情后可以点击"处理"按钮标记为处理中，处理完成后点击"解决"按钮完成流程。',
      expanded: false
    },
    {
      question: '如何切换不同的监管视图？',
      answer: '在区域监管地图上方有三个切换按钮：网点分布、合规状态、政策覆盖，点击即可切换不同的数据视图。',
      expanded: false
    },
    {
      question: '数据多久更新一次？',
      answer: '系统数据实时更新，核心指标每5分钟刷新一次，预警信息即时推送。',
      expanded: false
    },
    {
      question: '如何导出报表数据？',
      answer: '在数据统计页面点击"导出"按钮，可以选择Excel或PDF格式导出当前查看的数据报表。',
      expanded: false
    }
  ];
  
  tutorials = [
    {
      icon: 'fas fa-play-circle',
      title: '快速入门指南',
      description: '了解系统基本功能和操作流程'
    },
    {
      icon: 'fas fa-chart-bar',
      title: '数据分析教程',
      description: '学习如何使用数据分析工具进行决策'
    },
    {
      icon: 'fas fa-bell',
      title: '预警管理指南',
      description: '掌握预警处理和问题解决流程'
    },
    {
      icon: 'fas fa-cog',
      title: '系统设置说明',
      description: '个性化配置系统参数和通知'
    }
  ];
  
  // 核心指标
  indicators = {
    todayRecycle: 45680,
    accuracyRate: 92.5,
    carbonReduction: 1250,
    trend: {
      recycle: '+12%',
      accuracy: '+2.5%',
      carbon: '+8%'
    }
  };

  // 全部区域数据（用于不同视图）
  allAreasData = {
    sites: [
      { name: '朝阳区', status: 'good' as const, recycleVolume: 12500, accuracy: 95 },
      { name: '海淀区', status: 'warning' as const, recycleVolume: 10200, accuracy: 88 },
      { name: '西城区', status: 'good' as const, recycleVolume: 8900, accuracy: 93 },
      { name: '东城区', status: 'critical' as const, recycleVolume: 7800, accuracy: 76 },
      { name: '丰台区', status: 'good' as const, recycleVolume: 6280, accuracy: 91 }
    ],
    compliance: [
      { name: '朝阳区', status: 'good' as const, recycleVolume: 12500, accuracy: 95 },
      { name: '海淀区', status: 'good' as const, recycleVolume: 10200, accuracy: 92 },
      { name: '西城区', status: 'warning' as const, recycleVolume: 8900, accuracy: 85 },
      { name: '东城区', status: 'critical' as const, recycleVolume: 7800, accuracy: 68 },
      { name: '丰台区', status: 'warning' as const, recycleVolume: 6280, accuracy: 82 },
      { name: '石景山区', status: 'good' as const, recycleVolume: 5400, accuracy: 91 }
    ],
    policy: [
      { name: '朝阳区', status: 'good' as const, recycleVolume: 12500, accuracy: 98 },
      { name: '海淀区', status: 'good' as const, recycleVolume: 10200, accuracy: 96 },
      { name: '西城区', status: 'good' as const, recycleVolume: 8900, accuracy: 94 },
      { name: '东城区', status: 'warning' as const, recycleVolume: 7800, accuracy: 88 },
      { name: '丰台区', status: 'good' as const, recycleVolume: 6280, accuracy: 92 },
      { name: '石景山区', status: 'warning' as const, recycleVolume: 5400, accuracy: 86 },
      { name: '通州区', status: 'good' as const, recycleVolume: 4800, accuracy: 90 }
    ]
  };
  
  // 当前显示的区域数据
  areas: AreaData[] = [];

  // 预警列表
  warnings: Warning[] = [
    {
      id: 'W001',
      type: 'violation',
      title: '某企业未按规定分类处理',
      area: '朝阳区',
      time: '10分钟前',
      level: 'high',
      status: 'pending'
    },
    {
      id: 'W002',
      type: 'anomaly',
      title: '海淀区回收量异常下降',
      area: '海淀区',
      time: '30分钟前',
      level: 'medium',
      status: 'processing'
    },
    {
      id: 'W003',
      type: 'complaint',
      title: '居民投诉回收点脏乱',
      area: '西城区',
      time: '1小时前',
      level: 'low',
      status: 'processing'
    },
    {
      id: 'W004',
      type: 'violation',
      title: '东城区企业超标排放',
      area: '东城区',
      time: '2小时前',
      level: 'high',
      status: 'pending'
    }
  ];

  get pendingWarnings(): number {
    return this.warnings.filter(w => w.status === 'pending').length;
  }

  get highLevelWarnings(): number {
    return this.warnings.filter(w => w.level === 'high').length;
  }

  switchMapLayer(layer: 'sites' | 'compliance' | 'policy'): void {
    this.mapLayer = layer;
    // 根据选择的图层切换显示的区域数据
    this.areas = this.allAreasData[layer];
  }
  
  // 获取当前图层名称
  getMapLayerName(): string {
    const names = {
      'sites': '网点分布',
      'compliance': '合规状态',
      'policy': '政策覆盖'
    };
    return names[this.mapLayer];
  }
  
  // 获取地图标记点位置（模拟北京各区域位置）
  getMarkerPosition(index: number): { x: number; y: number } {
    const positions: { [key: string]: { x: number; y: number }[] } = {
      'sites': [
        { x: 65, y: 35 },  // 朝阳区 (东北)
        { x: 40, y: 25 },  // 海淀区 (西北)
        { x: 45, y: 50 },  // 西城区 (中西)
        { x: 60, y: 50 },  // 东城区 (中东)
        { x: 50, y: 70 }   // 丰台区 (南)
      ],
      'compliance': [
        { x: 65, y: 35 },  // 朝阳区
        { x: 40, y: 25 },  // 海淀区
        { x: 45, y: 50 },  // 西城区
        { x: 60, y: 50 },  // 东城区
        { x: 50, y: 70 },  // 丰台区
        { x: 25, y: 55 }   // 石景山区 (西)
      ],
      'policy': [
        { x: 65, y: 35 },  // 朝阳区
        { x: 40, y: 25 },  // 海淀区
        { x: 45, y: 50 },  // 西城区
        { x: 60, y: 50 },  // 东城区
        { x: 50, y: 70 },  // 丰台区
        { x: 25, y: 55 },  // 石景山区
        { x: 75, y: 60 }   // 通州区 (东)
      ]
    };
    
    return positions[this.mapLayer][index] || { x: 50, y: 50 };
  }
  
  // 初始化时加载默认数据
  ngOnInit(): void {
    this.areas = this.allAreasData.sites; // 默认显示网点分布
  }

  getWarningIcon(type: string): string {
    const icons: {[key: string]: string} = {
      'violation': 'fa-exclamation-circle',
      'anomaly': 'fa-chart-line',
      'complaint': 'fa-comment-alt'
    };
    return icons[type] || 'fa-bell';
  }

  getWarningTypeText(type: string): string {
    const types: {[key: string]: string} = {
      'violation': '违规事件',
      'anomaly': '异常波动',
      'complaint': '公众投诉'
    };
    return types[type] || type;
  }

  getStatusText(status: string): string {
    const statusMap: {[key: string]: string} = {
      'pending': '待处理',
      'processing': '处理中',
      'resolved': '已解决'
    };
    return statusMap[status] || status;
  }

  getLevelClass(level: string): string {
    return `level-${level}`;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  getAreaStatusClass(status: string): string {
    return `area-${status}`;
  }

  viewWarningDetail(warning: Warning): void {
    this.selectedWarning = warning;
    this.showWarningDetailModal = true;
  }

  closeWarningDetail(): void {
    this.showWarningDetailModal = false;
    this.selectedWarning = null;
  }

  viewAreaDetail(area: AreaData): void {
    this.selectedArea = area;
    this.showAreaDetailModal = true;
  }

  closeAreaDetail(): void {
    this.showAreaDetailModal = false;
    this.selectedArea = null;
  }

  handleWarning(warning: Warning): void {
    if (confirm(`确定要处理预警 "${warning.title}" 吗？`)) {
      warning.status = 'processing';
      alert('预警已标记为处理中');
    }
  }

  resolveWarning(warning: Warning): void {
    if (confirm(`确定要解决预警 "${warning.title}" 吗？`)) {
      warning.status = 'resolved';
      alert('预警已标记为已解决');
    }
  }

  goToAIAssistant(): void {
    this.router.navigate(['/government/ai-decision-assistant']);
  }
  
  // ========== 系统设置相关方法 ==========
  
  // 切换设置菜单
  toggleSettingsMenu(): void {
    this.showSettingsMenu = !this.showSettingsMenu;
  }
  
  // 关闭设置菜单
  closeSettingsMenu(): void {
    this.showSettingsMenu = false;
  }
  
  // 打开修改密码弹窗
  openPasswordModal(): void {
    this.closeSettingsMenu();
    this.passwordForm = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    this.showPasswordModal = true;
  }
  
  // 关闭修改密码弹窗
  closePasswordModal(): void {
    this.showPasswordModal = false;
    this.showOldPassword = false;
    this.showNewPassword = false;
    this.showConfirmPassword = false;
  }
  
  // 获取密码强度
  getPasswordStrength(): number {
    const password = this.passwordForm.newPassword;
    if (!password) return 0;
    
    let strength = 0;
    
    // 长度
    if (password.length >= 6) strength += 20;
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 10;
    
    // 包含小写字母
    if (/[a-z]/.test(password)) strength += 15;
    
    // 包含大写字母
    if (/[A-Z]/.test(password)) strength += 15;
    
    // 包含数字
    if (/\d/.test(password)) strength += 10;
    
    // 包含特殊字符
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 10;
    
    return Math.min(strength, 100);
  }
  
  // 获取密码强度文本
  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    if (strength < 40) return '弱';
    if (strength < 70) return '中等';
    return '强';
  }
  
  // 提交密码修改
  submitPasswordChange(): void {
    const { oldPassword, newPassword, confirmPassword } = this.passwordForm;
    
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert('请填写所有字段');
      return;
    }
    
    if (newPassword.length < 6) {
      alert('新密码长度至少6位');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      alert('两次输入的新密码不一致');
      return;
    }
    
    if (oldPassword === newPassword) {
      alert('新密码不能与旧密码相同');
      return;
    }
    
    // 模拟密码修改
    alert('密码修改成功！');
    this.closePasswordModal();
  }
  
  // 打开通知设置弹窗
  openNotificationModal(): void {
    this.closeSettingsMenu();
    this.showNotificationModal = true;
  }
  
  // 关闭通知设置弹窗
  closeNotificationModal(): void {
    this.showNotificationModal = false;
  }
  
  // 保存通知设置
  saveNotificationSettings(): void {
    if (this.notificationSettings.emailNotifications && !this.notificationSettings.email) {
      alert('请输入接收邮箱');
      return;
    }
    
    if (this.notificationSettings.smsNotifications && !this.notificationSettings.phone) {
      alert('请输入手机号码');
      return;
    }
    
    // 保存到本地存储
    localStorage.setItem('notificationSettings', JSON.stringify(this.notificationSettings));
    alert('通知设置保存成功！');
    this.closeNotificationModal();
  }
  
  // 打开帮助中心弹窗
  openHelpModal(): void {
    this.closeSettingsMenu();
    this.showHelpModal = true;
    this.helpActiveTab = 'faq';
    this.helpSearchQuery = '';
  }
  
  // 关闭帮助中心弹窗
  closeHelpModal(): void {
    this.showHelpModal = false;
  }
  
  // 切换FAQ展开状态
  toggleFaq(faq: any): void {
    faq.expanded = !faq.expanded;
  }
  
  // 获取过滤后的FAQs
  get filteredFaqs() {
    if (!this.helpSearchQuery) return this.faqs;
    
    const query = this.helpSearchQuery.toLowerCase();
    return this.faqs.filter(faq => 
      faq.question.toLowerCase().includes(query) || 
      faq.answer.toLowerCase().includes(query)
    );
  }
  
  // 退出登录
  logout(): void {
    this.closeSettingsMenu();
    if (confirm('确定要退出登录吗？')) {
      localStorage.removeItem('currentUser');
      this.router.navigate(['/auth/login']);
    }
  }

  constructor(private router: Router) {
    // 从本地存储加载通知设置
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      this.notificationSettings = JSON.parse(savedSettings);
    }
  }
}
