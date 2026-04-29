import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AvatarPickerComponent } from '../../shared/avatar-picker/avatar-picker.component';
import { BusinessApiService } from '../../core/services/business-api.service';

interface Employee {
  id: string;
  name: string;
  role: string;
  phone: string;
  status: 'active' | 'inactive';
}

interface Contract {
  id: string;
  title: string;
  amount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'pending';
}

interface Plan {
  id: string;
  name: string;
  price: number;
  unit: string;
  users: string;
  storage: string;
  features: string[];
  badge?: string;
  isPopular?: boolean;
}

@Component({
  selector: 'app-enterprise-center',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AvatarPickerComponent],
  templateUrl: './enterprise-center.html',
  styleUrl: './enterprise-center.scss'
})
export class EnterpriseCenter implements OnInit {
  activeTab: 'info' | 'employee' | 'contract' | 'subscription' | 'settings' = 'info';
  
  // 模态框控制
  showUpgradeModal = false;
  showPasswordModal = false;
  showSecurityModal = false;
  showHelpModal = false;
  showAboutModal = false;
  showLoginHistoryModal = false;
  showAvatarPicker = false;  // 头像选择器
  
  // 选中的套餐
  selectedPlan: Plan | null = null;
  
  // 用户个人信息
  userNickname = '企业管理员';
  userAvatar = '';
  userAvatarIndex = 1;

  // 企业信息
  enterpriseInfo = {
    name: '智回环保科技有限公司',
    code: '91110000MA01234567',
    type: '有限责任公司',
    legalPerson: '张三',
    phone: '010-12345678',
    email: 'contact@zhihui-eco.com',
    address: '北京市朝阳区建国路88号SOHO现代城',
    registeredCapital: '1000万元',
    establishDate: '2020-01-15'
  };

  // 员工列表
  employees: Employee[] = [
    { id: 'EMP-001', name: '张三', role: '管理员', phone: '138****1234', status: 'active' },
    { id: 'EMP-002', name: '李四', role: '回收员', phone: '139****5678', status: 'active' },
    { id: 'EMP-003', name: '王五', role: '回收员', phone: '137****9012', status: 'active' },
    { id: 'EMP-004', name: '赵六', role: '财务', phone: '136****3456', status: 'active' },
    { id: 'EMP-005', name: '孙七', role: '回收员', phone: '135****7890', status: 'inactive' }
  ];

  // 合同列表
  contracts: Contract[] = [
    { id: 'CON-001', title: '朝阳区回收服务合同', amount: 50000, startDate: '2023-01-01', endDate: '2023-12-31', status: 'active' },
    { id: 'CON-002', title: '海淀区回收服务合同', amount: 80000, startDate: '2023-03-01', endDate: '2024-02-29', status: 'active' },
    { id: 'CON-003', title: '设备采购合同', amount: 120000, startDate: '2022-06-01', endDate: '2022-12-31', status: 'expired' }
  ];

  // 订阅信息
  subscription = {
    plan: '企业专业版',
    currentPlanId: 'professional',
    expireDate: '2024-12-31',
    users: 50,
    usedUsers: 12,
    storage: '500GB',
    usedStorage: '125GB'
  };
  
  // 套餐列表
  plans: Plan[] = [
    {
      id: 'basic',
      name: '基础版',
      price: 999,
      unit: '月',
      users: '10个用户',
      storage: '100GB',
      features: [
        '基础回收管理',
        '订单处理',
        '数据报表',
        '邮件支持'
      ]
    },
    {
      id: 'professional',
      name: '专业版',
      price: 2999,
      unit: '月',
      users: '50个用户',
      storage: '500GB',
      features: [
        '所有基础功能',
        'AI智能助手',
        '高级数据分析',
        '员工管理',
        '合同管理',
        '7x24小时支持'
      ],
      badge: '当前套餐',
      isPopular: true
    },
    {
      id: 'enterprise',
      name: '企业版',
      price: 9999,
      unit: '月',
      users: '不限用户',
      storage: '2TB',
      features: [
        '所有专业功能',
        '专属客户经理',
        '定制化开发',
        'API接口',
        '多地域部署',
        '数据安全保障',
        'SLA保证'
      ]
    }
  ];
  
  // 密码表单
  passwordForm = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  
  // 登录历史数据
  loginHistory = [
    {
      time: '2024-12-16 14:30:25',
      location: '北京市朝阳区',
      ip: '118.123.45.67',
      device: 'Chrome 120 / Windows 10',
      status: 'success' as const
    },
    {
      time: '2024-12-16 09:15:10',
      location: '北京市朝阳区',
      ip: '118.123.45.67',
      device: 'Chrome 120 / Windows 10',
      status: 'success' as const
    },
    {
      time: '2024-12-15 18:42:33',
      location: '北京市海淀区',
      ip: '123.234.56.78',
      device: 'Safari / macOS',
      status: 'success' as const
    },
    {
      time: '2024-12-15 15:20:15',
      location: '上海市浦东新区',
      ip: '220.181.38.149',
      device: 'Chrome 120 / Android',
      status: 'failed' as const
    },
    {
      time: '2024-12-14 10:05:50',
      location: '北京市朝阳区',
      ip: '118.123.45.67',
      device: 'Chrome 120 / Windows 10',
      status: 'success' as const
    }
  ];

  switchTab(tab: 'info' | 'employee' | 'contract' | 'subscription' | 'settings'): void {
    this.activeTab = tab;
  }

  getEmployeeCount(): number {
    return this.employees.filter(e => e.status === 'active').length;
  }

  getActiveContractCount(): number {
    return this.contracts.filter(c => c.status === 'active').length;
  }

  getStatusText(status: string): string {
    const statusMap: {[key: string]: string} = {
      'active': '在职',
      'inactive': '离职',
      'pending': '待确认',
      'expired': '已过期'
    };
    return statusMap[status] || status;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  editInfo(): void {
    alert('编辑企业信息');
  }

  addEmployee(): void {
    alert('添加员工');
  }

  editEmployee(employee: Employee): void {
    alert(`编辑员工: ${employee.name}`);
  }

  deleteEmployee(employee: Employee): void {
    if (confirm(`确定要删除员工 ${employee.name} 吗？`)) {
      alert('员工已删除');
    }
  }

  viewContract(contract: Contract): void {
    alert(`查看合同: ${contract.title}`);
  }

  renewContract(contract: Contract): void {
    alert(`续签合同: ${contract.title}`);
  }

  // 打开升级套餐弹窗
  upgradePlan(): void {
    this.showUpgradeModal = true;
  }
  
  // 关闭升级弹窗
  closeUpgradeModal(): void {
    this.showUpgradeModal = false;
    this.selectedPlan = null;
  }
  
  // 选择套餐
  selectPlan(plan: Plan): void {
    this.selectedPlan = plan;
  }
  
  // 确认升级/购买
  confirmUpgrade(): void {
    if (!this.selectedPlan) {
      alert('请选择套餐');
      return;
    }
    
    if (this.selectedPlan.id === this.subscription.currentPlanId) {
      alert('您已经是该套餐用户');
      return;
    }
    
    // 模拟支付流程
    if (confirm(`确认${this.selectedPlan.id === 'basic' ? '降级' : '升级'}到 ${this.selectedPlan.name} 吗？\n\n价格：¥${this.selectedPlan.price}/${this.selectedPlan.unit}`)) {
      alert(`正在跳转到支付页面...\n\n套餐：${this.selectedPlan.name}\n价格：¥${this.selectedPlan.price}/${this.selectedPlan.unit}\n\n支付功能开发中，敬请期待！`);
      this.closeUpgradeModal();
    }
  }
  
  // 打开修改密码弹窗
  openPasswordModal(): void {
    this.showPasswordModal = true;
    this.passwordForm = { oldPassword: '', newPassword: '', confirmPassword: '' };
  }
  
  // 关闭修改密码弹窗
  closePasswordModal(): void {
    this.showPasswordModal = false;
  }
  
  // 提交密码修改
  submitPasswordChange(): void {
    if (!this.passwordForm.oldPassword || !this.passwordForm.newPassword || !this.passwordForm.confirmPassword) {
      alert('请填写所有字段');
      return;
    }
    
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      alert('两次输入的新密码不一致');
      return;
    }
    
    if (this.passwordForm.newPassword.length < 6) {
      alert('密码长度至少6位');
      return;
    }
    
    alert('密码修改成功！');
    this.closePasswordModal();
  }
  
  // 打开安全设置弹窗
  openSecurityModal(): void {
    this.showSecurityModal = true;
  }
  
  // 关闭安全设置弹窗
  closeSecurityModal(): void {
    this.showSecurityModal = false;
  }
  
  // 打开帮助中心弹窗
  openHelpModal(): void {
    this.showHelpModal = true;
  }
  
  // 关闭帮助中心弹窗
  closeHelpModal(): void {
    this.showHelpModal = false;
  }
  
  // 打开关于我们弹窗
  openAboutModal(): void {
    this.showAboutModal = true;
  }
  
  // 关闭关于我们弹窗
  closeAboutModal(): void {
    this.showAboutModal = false;
  }
  
  // 打开登录历史弹窗
  openLoginHistoryModal(): void {
    this.showLoginHistoryModal = true;
  }
  
  // 关闭登录历史弹窗
  closeLoginHistoryModal(): void {
    this.showLoginHistoryModal = false;
  }

  logout(): void {
    if (confirm('确定要退出登录吗？')) {
      this.router.navigate(['/auth/login']);
    }
  }

  constructor(
    private router: Router,
    private businessApi: BusinessApiService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  /**
   * 加载用户个人资料
   */
  loadUserProfile(): void {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        this.userNickname = user.nickname || user.name || '企业管理员';
        this.userAvatar = user.avatar || '';
        this.userAvatarIndex = user.avatarIndex || 1;
      } catch (e) {
        console.error('解析用户信息失败', e);
      }
    }

    this.businessApi.getUserProfile().subscribe({
      next: (user) => {
        if (user) {
          this.userNickname = user.nickname || '企业管理员';
          this.userAvatar = user.avatar || '';
          this.userAvatarIndex = user.avatarIndex || 1;
          this.updateLocalStorage({ 
            nickname: this.userNickname, 
            avatar: this.userAvatar,
            avatarIndex: this.userAvatarIndex 
          });
        }
      },
      error: (err) => console.error('加载用户资料失败:', err)
    });
  }

  /**
   * 打开头像选择器
   */
  openAvatarPicker(): void {
    this.showAvatarPicker = true;
  }

  /**
   * 关闭头像选择器
   */
  closeAvatarPicker(): void {
    this.showAvatarPicker = false;
  }

  /**
   * 保存头像和昵称
   */
  saveProfile(data: { avatar: string; avatarIndex: number; nickname: string }): void {
    this.businessApi.updateProfile({
      nickname: data.nickname,
      avatar: data.avatar,
      avatarIndex: data.avatarIndex
    }).subscribe({
      next: () => {
        this.userNickname = data.nickname;
        this.userAvatar = data.avatar;
        this.userAvatarIndex = data.avatarIndex;
        this.updateLocalStorage(data);
        this.showAvatarPicker = false;
        this.showToast('资料保存成功！');
      },
      error: (err) => {
        console.error('保存失败:', err);
        this.userNickname = data.nickname;
        this.userAvatar = data.avatar;
        this.userAvatarIndex = data.avatarIndex;
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
    const toast = document.createElement('div');
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
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
  }
}
