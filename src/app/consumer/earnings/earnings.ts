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
    },
    {
      id: '6',
      category: '玻璃回收',
      time: '2024-01-10 11:25',
      orderNo: 'RC202401100006',
      cashAmount: 15.30,
      pointsAmount: 76,
      carbonReduction: 1.5,
      icon: 'fas fa-wine-glass',
      weight: '6.8kg',
      price: '¥2.25/kg',
      address: '北京市朝阳区建国路88号',
      collector: '刘师傅'
    },
    {
      id: '7',
      category: '废纸回收',
      time: '2024-01-09 15:40',
      orderNo: 'RC202401090007',
      cashAmount: 42.80,
      pointsAmount: 214,
      carbonReduction: 4.3,
      icon: 'fas fa-newspaper',
      weight: '8.7kg',
      price: '¥4.92/kg',
      address: '北京市朝阳区建国路88号',
      collector: '陈师傅'
    },
    {
      id: '8',
      category: '塑料制品回收',
      time: '2024-01-08 09:15',
      orderNo: 'RC202401080008',
      cashAmount: 28.60,
      pointsAmount: 143,
      carbonReduction: 2.9,
      icon: 'fas fa-bottle-water',
      weight: '4.3kg',
      price: '¥6.65/kg',
      address: '北京市朝阳区建国路88号',
      collector: '周师傅'
    },
    {
      id: '9',
      category: '电子设备回收',
      time: '2024-01-07 14:20',
      orderNo: 'RC202401070009',
      cashAmount: 85.00,
      pointsAmount: 425,
      carbonReduction: 8.5,
      icon: 'fas fa-laptop',
      weight: '2.1kg',
      price: '¥40.48/kg',
      address: '北京市朝阳区建国路88号',
      collector: '吴师傅'
    },
    {
      id: '10',
      category: '金属回收',
      time: '2024-01-06 16:30',
      orderNo: 'RC202401060010',
      cashAmount: 67.50,
      pointsAmount: 337,
      carbonReduction: 6.8,
      icon: 'fas fa-wrench',
      weight: '3.5kg',
      price: '¥19.29/kg',
      address: '北京市朝阳区建国路88号',
      collector: '郑师傅'
    },
    {
      id: '11',
      category: '纺织品回收',
      time: '2024-01-05 12:45',
      orderNo: 'RC202401050011',
      cashAmount: 24.00,
      pointsAmount: 120,
      carbonReduction: 2.4,
      icon: 'fas fa-shirt',
      weight: '3.0kg',
      price: '¥8.00/kg',
      address: '北京市朝阳区建国路88号',
      collector: '马师傅'
    },
    {
      id: '12',
      category: '废纸回收',
      time: '2024-01-04 10:30',
      orderNo: 'RC202401040012',
      cashAmount: 36.90,
      pointsAmount: 184,
      carbonReduction: 3.7,
      icon: 'fas fa-file-alt',
      weight: '7.5kg',
      price: '¥4.92/kg',
      address: '北京市朝阳区建国路88号',
      collector: '黄师傅'
    },
    {
      id: '13',
      category: '塑料瓶回收',
      time: '2024-01-03 13:15',
      orderNo: 'RC202401030013',
      cashAmount: 21.70,
      pointsAmount: 108,
      carbonReduction: 2.2,
      icon: 'fas fa-wine-bottle',
      weight: '4.4kg',
      price: '¥4.93/kg',
      address: '北京市朝阳区建国路88号',
      collector: '徐师傅'
    },
    {
      id: '14',
      category: '电子设备回收',
      time: '2024-01-02 11:50',
      orderNo: 'RC202401020014',
      cashAmount: 95.00,
      pointsAmount: 475,
      carbonReduction: 9.5,
      icon: 'fas fa-tablet-alt',
      weight: '1.8kg',
      price: '¥52.78/kg',
      address: '北京市朝阳区建国路88号',
      collector: '朱师傅'
    },
    {
      id: '15',
      category: '玻璃回收',
      time: '2024-01-01 14:35',
      orderNo: 'RC202401010015',
      cashAmount: 18.90,
      pointsAmount: 94,
      carbonReduction: 1.9,
      icon: 'fas fa-wine-glass',
      weight: '8.4kg',
      price: '¥2.25/kg',
      address: '北京市朝阳区建国路88号',
      collector: '何师傅'
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
    // 初始显示全部数据，不启用日期筛选，避免列表为空
    this.filteredEarnings = [...this.earningsData];
    this.startDate = '';
    this.endDate = '';

    // 应用初始筛选
    this.applyFilter();
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
    let filtered = [...this.earningsData];
    
    // 首先按类型筛选
    const activeFilter = this.filterOptions.find(f => f.active);
    if (activeFilter) {
      switch (activeFilter.id) {
        case 'all':
          // 显示所有记录
          break;
        case 'cash':
          // 按现金收益排序，优先显示现金收益高的记录
          filtered = filtered.filter(e => e.cashAmount > 0).sort((a, b) => b.cashAmount - a.cashAmount);
          break;
        case 'points':
          // 按积分收益排序，优先显示积分收益高的记录
          filtered = filtered.filter(e => e.pointsAmount > 0).sort((a, b) => b.pointsAmount - a.pointsAmount);
          break;
        case 'carbon':
          // 按碳减排排序，优先显示碳减排高的记录
          filtered = filtered.filter(e => e.carbonReduction > 0).sort((a, b) => b.carbonReduction - a.carbonReduction);
          break;
      }
    }
    
    // 然后按日期筛选
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      end.setHours(23, 59, 59, 999); // 设置为当天的最后一刻
      
      filtered = filtered.filter(earning => {
        const earningDate = new Date(earning.time);
        return earningDate >= start && earningDate <= end;
      });
    } else if (this.startDate) {
      // 只有开始日期
      const start = new Date(this.startDate);
      filtered = filtered.filter(earning => {
        const earningDate = new Date(earning.time);
        return earningDate >= start;
      });
    } else if (this.endDate) {
      // 只有结束日期
      const end = new Date(this.endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(earning => {
        const earningDate = new Date(earning.time);
        return earningDate <= end;
      });
    }
    
    this.filteredEarnings = filtered;
  }

  // 按日期筛选
  filterByDate() {
    this.applyFilter(); // 重新应用所有筛选条件
  }

  // 清除日期筛选
  clearDateFilter() {
    this.startDate = '';
    this.endDate = '';
    this.applyFilter();
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
      this.showAlert('请输入有效的提现金额', 'warning');
      return;
    }
    
    if (this.withdrawAmount > this.totalCashEarnings) {
      this.showAlert('提现金额不能超过可用余额', 'error');
      return;
    }

    if (this.withdrawAmount < 10) {
      this.showAlert('最低提现金额为10元', 'warning');
      return;
    }

    const selectedOption = this.withdrawOptions.find(o => o.active);
    if (!selectedOption) {
      this.showAlert('请选择提现方式', 'warning');
      return;
    }

    // 显示确认对话框
    if (confirm(`确认提现 ¥${this.withdrawAmount.toFixed(2)} 到${selectedOption.name}？`)) {
      this.processWithdraw(selectedOption);
    }
  }

  // 处理提现请求
  private processWithdraw(option: WithdrawOption) {
    // 模拟API调用
    this.showAlert('正在处理提现申请...', 'info');
    
    setTimeout(() => {
      // 模拟成功响应
      this.totalCashEarnings -= this.withdrawAmount;
      this.showAlert(`提现申请已提交！预计1-3个工作日通过${option.name}到账`, 'success');
      this.closeModal('withdraw');
      
      // 添加提现记录到收益明细
      const withdrawRecord: EarningRecord = {
        id: Date.now().toString(),
        category: '提现',
        time: new Date().toLocaleString('zh-CN'),
        orderNo: `WD${Date.now()}`,
        cashAmount: -this.withdrawAmount,
        pointsAmount: 0,
        carbonReduction: 0,
        icon: 'fas fa-money-bill-wave',
        weight: '-',
        price: '-',
        address: '-',
        collector: option.name
      };
      
      this.earningsData.unshift(withdrawRecord);
      this.applyFilter();
    }, 2000);
  }

  // 确认捐赠
  confirmDonation() {
    if (!this.selectedProject) {
      this.showAlert('请选择捐赠项目', 'warning');
      return;
    }
    
    if (this.donationAmount <= 0) {
      this.showAlert('请输入有效的捐赠金额', 'warning');
      return;
    }

    if (this.donationAmount > this.totalCashEarnings) {
      this.showAlert('捐赠金额不能超过可用余额', 'error');
      return;
    }

    // 显示确认对话框
    if (confirm(`确认向"${this.selectedProject.name}"捐赠 ¥${this.donationAmount.toFixed(2)}？`)) {
      this.processDonation();
    }
  }

  // 处理捐赠请求
  private processDonation() {
    if (!this.selectedProject) return;
    
    this.showAlert('正在处理捐赠...', 'info');
    
    setTimeout(() => {
      // 模拟成功响应
      this.totalCashEarnings -= this.donationAmount;
      this.showAlert(`感谢您的爱心！已成功向"${this.selectedProject!.name}"捐赠 ¥${this.donationAmount.toFixed(2)}`, 'success');
      this.closeModal('donation');
      
      // 添加捐赠记录到收益明细
      const donationRecord: EarningRecord = {
        id: Date.now().toString(),
        category: '公益捐赠',
        time: new Date().toLocaleString('zh-CN'),
        orderNo: `DN${Date.now()}`,
        cashAmount: -this.donationAmount,
        pointsAmount: Math.floor(this.donationAmount * 2), // 捐赠获得双倍积分
        carbonReduction: this.donationAmount * 0.1, // 每元捐赠相当于0.1kg碳减排
        icon: 'fas fa-hand-holding-heart',
        weight: '-',
        price: '-',
        address: '-',
        collector: this.selectedProject!.name
      };
      
      this.earningsData.unshift(donationRecord);
      this.totalPointsEarnings += donationRecord.pointsAmount;
      this.totalCarbonReduction += donationRecord.carbonReduction;
      this.applyFilter();
    }, 2000);
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
    this.router.navigate(['/consumer/points-mall']);
  }

  // 导出账单
  exportBill() {
    this.showAlert('正在生成账单...', 'info');
    
    setTimeout(() => {
      this.generateBillReport();
    }, 1500);
  }

  // 生成账单报告
  private generateBillReport() {
    const billData = {
      period: `${this.startDate} 至 ${this.endDate}`,
      totalCash: this.totalCashEarnings,
      totalPoints: this.totalPointsEarnings,
      totalCarbon: this.totalCarbonReduction,
      records: this.filteredEarnings
    };

    // 创建CSV格式的账单数据
    let csvContent = "日期,类别,订单号,现金收益,积分收益,碳减排量\n";
    
    this.filteredEarnings.forEach(record => {
      csvContent += `${record.time},${record.category},${record.orderNo},${record.cashAmount},${record.pointsAmount},${record.carbonReduction}\n`;
    });

    // 创建并下载文件
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `收益账单_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.showAlert('账单已导出到下载文件夹', 'success');
  }

  // 显示提示信息
  private showAlert(message: string, type: 'success' | 'error' | 'warning' | 'info') {
    // 创建提示元素
    const alertDiv = document.createElement('div');
    alertDiv.className = `custom-alert alert-${type}`;
    alertDiv.textContent = message;
    
    // 添加样式
    alertDiv.style.cssText = `
      position: fixed;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: ${this.getAlertColor(type)};
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      z-index: 10000;
      font-size: 14px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: slideDown 0.3s ease-out;
    `;

    document.body.appendChild(alertDiv);

    // 3秒后自动移除
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.style.animation = 'slideUp 0.3s ease-in';
        setTimeout(() => {
          document.body.removeChild(alertDiv);
        }, 300);
      }
    }, 3000);
  }

  // 获取提示颜色
  private getAlertColor(type: string): string {
    switch (type) {
      case 'success': return '#4caf50';
      case 'error': return '#f44336';
      case 'warning': return '#ff9800';
      case 'info': return '#2196f3';
      default: return '#6c757d';
    }
  }

  // 组件销毁时清理图表
  ngOnDestroy() {
    if (this.carbonChart) {
      this.carbonChart.destroy();
    }
  }
}
