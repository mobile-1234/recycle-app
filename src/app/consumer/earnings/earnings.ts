import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BottomNavComponent } from '../../shared/bottom-nav/bottom-nav.component';
import * as echarts from 'echarts';
import type { ECharts, EChartsOption } from 'echarts';

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

interface TimeRange {
  id: string;
  name: string;
  active: boolean;
}

@Component({
  selector: 'app-earnings',
  standalone: true,
  imports: [CommonModule, FormsModule, BottomNavComponent],
  templateUrl: './earnings.html',
  styleUrls: ['./earnings.scss']
})
export class EarningsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('carbonChartRef') carbonChartRef!: ElementRef<HTMLDivElement>;
  
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
  
  // 时间范围选项
  timeRangeOptions: TimeRange[] = [
    { id: 'day', name: '每天', active: true },
    { id: 'month', name: '每月', active: false },
    { id: 'year', name: '每年', active: false }
  ];
  
  // 日期筛选
  startDate = '';
  endDate = '';
  
  // 收益记录数据 - 生成更多数据用于测试
  earningsData: EarningRecord[] = [];
  
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
  
  // ECharts实例
  carbonChart: ECharts | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.generateMockData();
    this.initializeData();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initCarbonChart();
    }, 100);
  }

  // 生成模拟数据
  generateMockData() {
    const categories = [
      { name: '废纸回收', icon: 'fas fa-newspaper', priceRange: [4, 6] },
      { name: '塑料瓶回收', icon: 'fas fa-wine-bottle', priceRange: [4, 5] },
      { name: '金属回收', icon: 'fas fa-wrench', priceRange: [15, 20] },
      { name: '电子设备回收', icon: 'fas fa-mobile-alt', priceRange: [50, 100] },
      { name: '纺织品回收', icon: 'fas fa-tshirt', priceRange: [6, 10] },
      { name: '玻璃回收', icon: 'fas fa-wine-glass', priceRange: [2, 3] }
    ];
    
    const collectors = ['张师傅', '李师傅', '王师傅', '赵师傅', '孙师傅', '刘师傅'];
    
    // 生成最近12个月的数据
    for (let month = 11; month >= 0; month--) {
      const recordsPerMonth = Math.floor(Math.random() * 5) + 3; // 每月3-7条记录
      
      for (let i = 0; i < recordsPerMonth; i++) {
        const date = new Date();
        date.setMonth(date.getMonth() - month);
        date.setDate(Math.floor(Math.random() * 28) + 1);
        date.setHours(Math.floor(Math.random() * 14) + 8);
        date.setMinutes(Math.floor(Math.random() * 60));
        
        const category = categories[Math.floor(Math.random() * categories.length)];
        const weight = (Math.random() * 8 + 1).toFixed(1);
        const pricePerKg = (Math.random() * (category.priceRange[1] - category.priceRange[0]) + category.priceRange[0]).toFixed(2);
        const cashAmount = parseFloat((parseFloat(weight) * parseFloat(pricePerKg)).toFixed(2));
        const pointsAmount = Math.floor(cashAmount * 5);
        const carbonReduction = parseFloat((parseFloat(weight) * 0.1).toFixed(1));
        
        this.earningsData.push({
          id: `${date.getTime()}_${i}`,
          category: category.name,
          time: date.toLocaleString('zh-CN'),
          orderNo: `RC${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}${i.toString().padStart(4, '0')}`,
          cashAmount: cashAmount,
          pointsAmount: pointsAmount,
          carbonReduction: carbonReduction,
          icon: category.icon,
          weight: `${weight}kg`,
          price: `¥${pricePerKg}/kg`,
          address: '北京市朝阳区建国路88号',
          collector: collectors[Math.floor(Math.random() * collectors.length)]
        });
      }
    }
    
    // 按时间倒序排序
    this.earningsData.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  }

  // 初始化数据
  initializeData() {
    this.filteredEarnings = [...this.earningsData];
    this.applyFilter();
  }

  // 初始化碳减排图表
  initCarbonChart() {
    if (!this.carbonChartRef?.nativeElement) return;

    // 如果已存在图表，先销毁
    if (this.carbonChart) {
      this.carbonChart.dispose();
    }

    this.carbonChart = echarts.init(this.carbonChartRef.nativeElement);
    this.updateChartData();
  }

  // 更新图表数据
  updateChartData() {
    if (!this.carbonChart) return;

    const activeTimeRange = this.timeRangeOptions.find(t => t.active);
    let chartData: { labels: string[], data: number[] };

    switch (activeTimeRange?.id) {
      case 'day':
        chartData = this.getDailyData();
        break;
      case 'month':
        chartData = this.getMonthlyData();
        break;
      case 'year':
        chartData = this.getYearlyData();
        break;
      default:
        chartData = this.getDailyData();
    }

    const option: EChartsOption = {
      title: {
        text: '碳减排趋势',
        left: 'center',
        textStyle: {
          color: '#333',
          fontSize: 16,
          fontWeight: 600
        }
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#4caf50',
        borderWidth: 1,
        textStyle: {
          color: '#333'
        },
        formatter: (params: any) => {
          const param = params[0];
          return `${param.name}<br/>碳减排量: <strong style="color: #4caf50">${param.value} kg</strong>`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: chartData.labels,
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: '#e0e0e0'
          }
        },
        axisLabel: {
          color: '#6c757d',
          fontSize: 11,
          rotate: activeTimeRange?.id === 'month' ? 45 : 0
        }
      },
      yAxis: {
        type: 'value',
        name: 'kg',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#6c757d',
          fontSize: 11
        },
        splitLine: {
          lineStyle: {
            color: '#f0f0f0',
            type: 'dashed'
          }
        }
      },
      series: [
        {
          name: '碳减排量',
          type: 'line',
          data: chartData.data,
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: {
            width: 3,
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: '#4caf50' },
                { offset: 1, color: '#1abc9c' }
              ]
            }
          },
          itemStyle: {
            color: '#4caf50',
            borderColor: '#fff',
            borderWidth: 2
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(76, 175, 80, 0.3)' },
                { offset: 1, color: 'rgba(76, 175, 80, 0.05)' }
              ]
            }
          },
          emphasis: {
            itemStyle: {
              color: '#2e7d32',
              borderColor: '#fff',
              borderWidth: 3,
              shadowBlur: 10,
              shadowColor: 'rgba(76, 175, 80, 0.5)'
            }
          }
        }
      ]
    };

    this.carbonChart.setOption(option);
    
    // 响应式
    window.addEventListener('resize', () => {
      this.carbonChart?.resize();
    });
  }

  // 获取每日数据
  getDailyData(): { labels: string[], data: number[] } {
    const labels: string[] = [];
    const data: number[] = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
      labels.push(dateStr);
      
      // 计算该天的碳减排量
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
      
      const dayCarbon = this.earningsData
        .filter(e => {
          const eDate = new Date(e.time);
          return eDate >= dayStart && eDate <= dayEnd;
        })
        .reduce((sum, e) => sum + e.carbonReduction, 0);
      
      data.push(parseFloat(dayCarbon.toFixed(2)));
    }
    
    return { labels, data };
  }

  // 获取每月数据
  getMonthlyData(): { labels: string[], data: number[] } {
    const labels: string[] = [];
    const data: number[] = [];
    const today = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthStr = `${date.getFullYear()}/${date.getMonth() + 1}`;
      labels.push(monthStr);
      
      // 计算该月的碳减排量
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
      
      const monthCarbon = this.earningsData
        .filter(e => {
          const eDate = new Date(e.time);
          return eDate >= monthStart && eDate <= monthEnd;
        })
        .reduce((sum, e) => sum + e.carbonReduction, 0);
      
      data.push(parseFloat(monthCarbon.toFixed(2)));
    }
    
    return { labels, data };
  }

  // 获取每年数据
  getYearlyData(): { labels: string[], data: number[] } {
    const labels: string[] = [];
    const data: number[] = [];
    const currentYear = new Date().getFullYear();
    
    for (let i = 4; i >= 0; i--) {
      const year = currentYear - i;
      labels.push(`${year}年`);
      
      // 计算该年的碳减排量
      const yearStart = new Date(year, 0, 1);
      const yearEnd = new Date(year, 11, 31, 23, 59, 59);
      
      const yearCarbon = this.earningsData
        .filter(e => {
          const eDate = new Date(e.time);
          return eDate >= yearStart && eDate <= yearEnd;
        })
        .reduce((sum, e) => sum + e.carbonReduction, 0);
      
      data.push(parseFloat(yearCarbon.toFixed(2)));
    }
    
    return { labels, data };
  }

  // 选择时间范围
  selectTimeRange(selected: TimeRange) {
    this.timeRangeOptions.forEach(t => t.active = t.id === selected.id);
    this.updateChartData();
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
    
    const activeFilter = this.filterOptions.find(f => f.active);
    if (activeFilter) {
      switch (activeFilter.id) {
        case 'all':
          break;
        case 'cash':
          filtered = filtered.filter(e => e.cashAmount > 0);
          break;
        case 'points':
          filtered = filtered.filter(e => e.pointsAmount > 0);
          break;
        case 'carbon':
          filtered = filtered.filter(e => e.carbonReduction > 0);
          break;
      }
    }
    
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      end.setHours(23, 59, 59, 999);
      
      filtered = filtered.filter(earning => {
        const earningDate = new Date(earning.time);
        return earningDate >= start && earningDate <= end;
      });
    } else if (this.startDate) {
      const start = new Date(this.startDate);
      filtered = filtered.filter(earning => {
        const earningDate = new Date(earning.time);
        return earningDate >= start;
      });
    } else if (this.endDate) {
      const end = new Date(this.endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(earning => {
        const earningDate = new Date(earning.time);
        return earningDate <= end;
      });
    }
    
    this.filteredEarnings = filtered;
  }

  filterByDate() {
    this.applyFilter();
  }

  clearDateFilter() {
    this.startDate = '';
    this.endDate = '';
    this.applyFilter();
  }

  showOrderDetail(earning: EarningRecord) {
    this.selectedOrder = earning;
    this.showOrderDetailModal = true;
  }

  showWithdrawModal() {
    this.showWithdraw = true;
  }

  showDonationModal() {
    this.showDonation = true;
  }

  selectWithdrawOption(selectedOption: WithdrawOption) {
    this.withdrawOptions.forEach(option => {
      option.active = option.id === selectedOption.id;
    });
  }

  selectDonationProject(project: DonationProject) {
    this.selectedProject = project;
  }

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

    if (confirm(`确认提现 ¥${this.withdrawAmount.toFixed(2)} 到${selectedOption.name}？`)) {
      this.processWithdraw(selectedOption);
    }
  }

  private processWithdraw(option: WithdrawOption) {
    this.showAlert('正在处理提现申请...', 'info');
    
    setTimeout(() => {
      this.totalCashEarnings -= this.withdrawAmount;
      this.showAlert(`提现申请已提交！预计1-3个工作日通过${option.name}到账`, 'success');
      this.closeModal('withdraw');
    }, 2000);
  }

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

    if (confirm(`确认向"${this.selectedProject.name}"捐赠 ¥${this.donationAmount.toFixed(2)}？`)) {
      this.processDonation();
    }
  }

  private processDonation() {
    if (!this.selectedProject) return;
    
    this.showAlert('正在处理捐赠...', 'info');
    
    setTimeout(() => {
      this.totalCashEarnings -= this.donationAmount;
      this.totalPointsEarnings += Math.floor(this.donationAmount * 2);
      this.totalCarbonReduction += this.donationAmount * 0.1;
      
      this.showAlert(`感谢您的爱心！已成功向"${this.selectedProject!.name}"捐赠 ¥${this.donationAmount.toFixed(2)}`, 'success');
      this.closeModal('donation');
    }, 2000);
  }

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

  goToMall() {
    this.router.navigate(['/consumer/points-mall']);
  }

  exportBill() {
    this.showAlert('正在生成账单...', 'info');
    
    setTimeout(() => {
      this.generateBillReport();
    }, 1500);
  }

  private generateBillReport() {
    let csvContent = "日期,类别,订单号,现金收益,积分收益,碳减排量\n";
    
    this.filteredEarnings.forEach(record => {
      csvContent += `${record.time},${record.category},${record.orderNo},${record.cashAmount},${record.pointsAmount},${record.carbonReduction}\n`;
    });

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

  private showAlert(message: string, type: 'success' | 'error' | 'warning' | 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `custom-alert alert-${type}`;
    alertDiv.textContent = message;
    
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

    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.style.animation = 'slideUp 0.3s ease-in';
        setTimeout(() => {
          document.body.removeChild(alertDiv);
        }, 300);
      }
    }, 3000);
  }

  private getAlertColor(type: string): string {
    switch (type) {
      case 'success': return '#4caf50';
      case 'error': return '#f44336';
      case 'warning': return '#ff9800';
      case 'info': return '#2196f3';
      default: return '#6c757d';
    }
  }

  ngOnDestroy() {
    if (this.carbonChart) {
      this.carbonChart.dispose();
    }
  }
}
