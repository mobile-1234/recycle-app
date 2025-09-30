import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BottomNavComponent } from '../../shared/bottom-nav/bottom-nav.component';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

// 注册Chart.js组件
Chart.register(...registerables);

// 数据接口定义
interface EarningRecord {
  id: string;
  category: string;
  time: string;
  orderNo: string;
  cashAmount: number;
  pointsAmount: number;
  carbonReduction: number;
  icon: string;
  weight?: string;
  price?: string;
  address?: string;
  collector?: string;
}

interface FilterOption {
  id: string;
  name: string;
  active: boolean;
}

interface WithdrawOption {
  id: string;
  name: string;
  icon: string;
  active: boolean;
}

interface DonationProject {
  id: string;
  name: string;
  description: string;
}

@Component({
  selector: 'app-earnings',
  standalone: true,
  imports: [CommonModule, FormsModule, BottomNavComponent],
  templateUrl: './earnings.html',
  styleUrls: ['./earnings.scss']
})
export class EarningsComponent implements OnInit, AfterViewInit {
  @ViewChild('carbonChart') carbonChartRef!: ElementRef<HTMLCanvasElement>;
  
  // 当前选中的导航标签
  currentTab = 'earnings';
  
  // 收益统计数据
  totalCashEarnings = 1256.80;
  totalPointsEarnings = 8420;
  totalCarbonReduction = 125.6;
  
  // 筛选选项
  filterOptions: FilterOption[] = [
    { id: 'all', name: '全部', active: true },
    { id: 'cash', name: '现金收益', active: false },
    { id: 'points', name: '积分收益', active: false },
    { id: 'carbon', name: '碳减排', active: false }
  ];
  
  // 日期筛选
  startDate = '';
  endDate = '';
  
  // 收益记录数据
  earningsData: EarningRecord[] = [
    {
      id: '1',
      category: '废纸回收',
      time: '2024-01-15 14:30',
      orderNo: 'RC202401150001',
      cashAmount: 25.60,
      pointsAmount: 128,
      carbonReduction: 2.5,
      icon: 'fas fa-newspaper',
      weight: '5.2kg',
      price: '¥4.92/kg',
      address: '北京市朝阳区建国路88号',
      collector: '张师傅'
    },
    {
      id: '2',
      category: '塑料瓶回收',
      time: '2024-01-14 10:15',
      orderNo: 'RC202401140002',
      cashAmount: 18.40,
      pointsAmount: 92,
      carbonReduction: 1.8,
      icon: 'fas fa-wine-bottle',
      weight: '3.7kg',
      price: '¥4.97/kg',
      address: '北京市朝阳区建国路88号',
      collector: '李师傅'
    },
    {
      id: '3',
      category: '金属回收',
      time: '2024-01-13 16:45',
      orderNo: 'RC202401130003',
      cashAmount: 45.20,
      pointsAmount: 226,
      carbonReduction: 4.5,
      icon: 'fas fa-cog',
      weight: '2.8kg',
      price: '¥16.14/kg',
      address: '北京市朝阳区建国路88号',
      collector: '王师傅'
    },
    {
      id: '4',
      category: '电子设备回收',
      time: '2024-01-12 09:20',
      orderNo: 'RC202401120004',
      cashAmount: 120.00,
      pointsAmount: 600,
      carbonReduction: 12.0,
      icon: 'fas fa-mobile-alt',
      weight: '1.5kg',
      price: '¥80.00/kg',
      address: '北京市朝阳区建国路88号',
      collector: '赵师傅'
    },
    {
      id: '5',
      category: '纺织品回收',
      time: '2024-01-11 13:10',
      orderNo: 'RC202401110005',
      cashAmount: 32.80,
      pointsAmount: 164,
      carbonReduction: 3.3,
      icon: 'fas fa-tshirt',
      weight: '4.1kg',
      price: '¥8.00/kg',
      address: '北京市朝阳区建国路88号',
      collector: '孙师傅'
    }
  ];
  
  // 筛选后的收益数据
  filteredEarnings: EarningRecord[] = [];
  
  // 模态框显示状态
  showWithdraw = false;
  showDonation = false;
  showOrderDetailModal = false;
  
  // 提现相关
  withdrawOptions: WithdrawOption[] = [
    { id: 'wechat', name: '微信', icon: 'fab fa-weixin', active: true },
    { id: 'alipay', name: '支付宝', icon: 'fab fa-alipay', active: false },
    { id: 'bank', name: '银行卡', icon: 'fas fa-credit-card', active: false }
  ];
  withdrawAmount = 0;
  
  // 捐赠相关
  donationProjects: DonationProject[] = [
    {
      id: '1',
      name: '绿色地球计划',
      description: '支持全球环保项目，减少碳排放'
    },
    {
      id: '2',
      name: '海洋清洁行动',
      description: '清理海洋垃圾，保护海洋生态'
    },
    {
      id: '3',
      name: '森林保护基金',
      description: '保护森林资源，维护生态平衡'
    }
  ];
  selectedProject: DonationProject | null = null;
  donationAmount = 0;
  
  // 选中的订单详情
  selectedOrder: EarningRecord | null = null;
  
  // Chart.js实例
  carbonChart: Chart | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.initializeData();
  }

  ngAfterViewInit() {
    this.initCarbonChart();
  }

  // 初始化数据
  initializeData() {
    this.filteredEarnings = [...this.earningsData];
    
    // 设置默认日期范围（最近30天）
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    this.endDate = today.toISOString().split('T')[0];
    this.startDate = thirtyDaysAgo.toISOString().split('T')[0];
  }

  // 初始化碳减排图表
  initCarbonChart() {
    if (!this.carbonChartRef?.nativeElement) return;

    const ctx = this.carbonChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // 生成最近7天的碳减排数据
    const labels = [];
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      labels.push(`${date.getMonth() + 1}/${date.getDate()}`);
      data.push(Math.random() * 20 + 5); // 模拟数据
    }

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: '碳减排量 (kg)',
          data: data,
          borderColor: '#1abc9c',
          backgroundColor: 'rgba(26, 188, 156, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#1abc9c',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#6c757d',
              font: {
                size: 12
              }
            }
          },
          y: {
            grid: {
              color: '#f0f0f0'
            },
            ticks: {
              color: '#6c757d',
              font: {
                size: 12
              }
            }
          }
        }
      }
    };

    this.carbonChart = new Chart(ctx, config);
  }

  // 返回上一页
  goBack() {
    this.router.navigate(['/consumer/home']);
  }

  // 切换底部导航
  switchTab(tab: string) {
    this.currentTab = tab;
    
    switch (tab) {
      case 'home':
        this.router.navigate(['/consumer/home']);
        break;
      case 'booking':
        this.router.navigate(['/consumer/booking-recycle']);
        break;
      case 'earnings':
        // 当前页面，不需要跳转
        break;
      case 'mall':
        this.router.navigate(['/consumer/points-mall']);
        break;
      case 'profile':
        this.router.navigate(['/consumer/profile']);
        break;
    }
  }

  // 选择筛选条件
  selectFilter(selectedFilter: FilterOption) {
    this.filterOptions.forEach(filter => {
      filter.active = filter.id === selectedFilter.id;
    });
    
    this.applyFilter();
  }

  // 应用筛选条件
  applyFilter() {
    const activeFilter = this.filterOptions.find(f => f.active);
    if (!activeFilter) return;

    switch (activeFilter.id) {
      case 'all':
        this.filteredEarnings = [...this.earningsData];
        break;
      case 'cash':
        this.filteredEarnings = this.earningsData.filter(e => e.cashAmount > 0);
        break;
      case 'points':
        this.filteredEarnings = this.earningsData.filter(e => e.pointsAmount > 0);
        break;
      case 'carbon':
        this.filteredEarnings = this.earningsData.filter(e => e.carbonReduction > 0);
        break;
    }
  }

  // 按日期筛选
  filterByDate() {
    if (!this.startDate || !this.endDate) return;

    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    
    this.filteredEarnings = this.earningsData.filter(earning => {
      const earningDate = new Date(earning.time);
      return earningDate >= start && earningDate <= end;
    });
  }

  // 显示订单详情
  showOrderDetail(earning: EarningRecord) {
    this.selectedOrder = earning;
    this.showOrderDetailModal = true;
  }

  // 显示提现模态框
  showWithdrawModal() {
    this.showWithdraw = true;
  }

  // 显示捐赠模态框
  showDonationModal() {
    this.showDonation = true;
  }

  // 选择提现方式
  selectWithdrawOption(selectedOption: WithdrawOption) {
    this.withdrawOptions.forEach(option => {
      option.active = option.id === selectedOption.id;
    });
  }

  // 选择捐赠项目
  selectDonationProject(project: DonationProject) {
    this.selectedProject = project;
  }

  // 确认提现
  confirmWithdraw() {
    if (this.withdrawAmount <= 0) {
      alert('请输入有效的提现金额');
      return;
    }
    
    if (this.withdrawAmount > this.totalCashEarnings) {
      alert('提现金额不能超过可用余额');
      return;
    }

    const selectedOption = this.withdrawOptions.find(o => o.active);
    console.log(`提现 ¥${this.withdrawAmount} 到 ${selectedOption?.name}`);
    
    // 这里应该调用实际的提现API
    alert(`提现申请已提交，将通过${selectedOption?.name}到账`);
    this.closeModal('withdraw');
  }

  // 确认捐赠
  confirmDonation() {
    if (!this.selectedProject) {
      alert('请选择捐赠项目');
      return;
    }
    
    if (this.donationAmount <= 0) {
      alert('请输入有效的捐赠金额');
      return;
    }

    console.log(`捐赠 ¥${this.donationAmount} 到 ${this.selectedProject.name}`);
    
    // 这里应该调用实际的捐赠API
    alert(`感谢您的爱心捐赠！已向${this.selectedProject.name}捐赠 ¥${this.donationAmount}`);
    this.closeModal('donation');
  }

  // 关闭模态框
  closeModal(type: string) {
    switch (type) {
      case 'withdraw':
        this.showWithdraw = false;
        this.withdrawAmount = 0;
        break;
      case 'donation':
        this.showDonation = false;
        this.donationAmount = 0;
        this.selectedProject = null;
        break;
      case 'orderDetail':
        this.showOrderDetailModal = false;
        this.selectedOrder = null;
        break;
    }
  }

  // 跳转到商城
  goToMall() {
    console.log('跳转到积分商城');
    // 这里应该跳转到实际的商城页面
  }

  // 导出账单
  exportBill() {
    console.log('导出收益账单');
    // 这里应该实现实际的账单导出功能
    alert('账单导出功能开发中...');
  }

  // 组件销毁时清理图表
  ngOnDestroy() {
    if (this.carbonChart) {
      this.carbonChart.destroy();
    }
  }
}
