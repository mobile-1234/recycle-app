import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Order {
  id: string;
  orderNo: string;
  createTime: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  wasteCategory: string;
  wasteIcon: string;
  weight: number;
  address: string;
  collector?: string;
  cashAmount: number;
  pointsAmount: number;
  carbonReduction: number;
}

interface FilterTab {
  id: string;
  name: string;
  active: boolean;
  count: number;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrls: ['./orders.scss']
})
export class OrdersComponent implements OnInit {
  
  // 筛选标签
  filterTabs: FilterTab[] = [
    { id: 'all', name: '全部', active: true, count: 0 },
    { id: 'pending', name: '待处理', active: false, count: 0 },
    { id: 'processing', name: '处理中', active: false, count: 0 },
    { id: 'completed', name: '已完成', active: false, count: 0 },
    { id: 'cancelled', name: '已取消', active: false, count: 0 }
  ];
  
  // 订单数据
  orders: Order[] = [
    {
      id: '1',
      orderNo: 'RC202401150001',
      createTime: '2024-01-15 14:30',
      status: 'completed',
      wasteCategory: '废纸回收',
      wasteIcon: 'fas fa-newspaper',
      weight: 5.2,
      address: '北京市朝阳区建国路88号SOHO现代城',
      collector: '张师傅',
      cashAmount: 25.60,
      pointsAmount: 128,
      carbonReduction: 2.5
    },
    {
      id: '2',
      orderNo: 'RC202401140002',
      createTime: '2024-01-14 10:15',
      status: 'completed',
      wasteCategory: '塑料瓶回收',
      wasteIcon: 'fas fa-wine-bottle',
      weight: 3.7,
      address: '北京市朝阳区建国路88号SOHO现代城',
      collector: '李师傅',
      cashAmount: 18.40,
      pointsAmount: 92,
      carbonReduction: 1.8
    },
    {
      id: '3',
      orderNo: 'RC202401130003',
      createTime: '2024-01-13 16:45',
      status: 'processing',
      wasteCategory: '金属回收',
      wasteIcon: 'fas fa-cog',
      weight: 2.8,
      address: '北京市朝阳区建国路88号SOHO现代城',
      collector: '王师傅',
      cashAmount: 45.20,
      pointsAmount: 226,
      carbonReduction: 4.5
    },
    {
      id: '4',
      orderNo: 'RC202401120004',
      createTime: '2024-01-12 09:20',
      status: 'pending',
      wasteCategory: '电子设备回收',
      wasteIcon: 'fas fa-mobile-alt',
      weight: 1.5,
      address: '北京市朝阳区建国路88号SOHO现代城',
      cashAmount: 120.00,
      pointsAmount: 600,
      carbonReduction: 12.0
    },
    {
      id: '5',
      orderNo: 'RC202401110005',
      createTime: '2024-01-11 13:10',
      status: 'cancelled',
      wasteCategory: '纺织品回收',
      wasteIcon: 'fas fa-tshirt',
      weight: 4.1,
      address: '北京市朝阳区建国路88号SOHO现代城',
      cashAmount: 32.80,
      pointsAmount: 164,
      carbonReduction: 3.3
    }
  ];
  
  filteredOrders: Order[] = [];
  selectedOrder: Order | null = null;
  showDetailModal = false;
  
  constructor(private router: Router) {}
  
  ngOnInit() {
    this.updateFilterCounts();
    this.applyFilter();
  }
  
  // 更新筛选标签计数
  updateFilterCounts() {
    this.filterTabs.forEach(tab => {
      if (tab.id === 'all') {
        tab.count = this.orders.length;
      } else {
        tab.count = this.orders.filter(order => order.status === tab.id).length;
      }
    });
  }
  
  // 选择筛选标签
  selectTab(selectedTab: FilterTab) {
    this.filterTabs.forEach(tab => tab.active = false);
    selectedTab.active = true;
    this.applyFilter();
  }
  
  // 应用筛选
  applyFilter() {
    const activeTab = this.filterTabs.find(tab => tab.active);
    if (activeTab?.id === 'all') {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(order => order.status === activeTab?.id);
    }
  }
  
  // 获取状态文本
  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': '待处理',
      'processing': '处理中',
      'completed': '已完成',
      'cancelled': '已取消'
    };
    return statusMap[status] || status;
  }
  
  // 显示订单详情
  showOrderDetail(order: Order) {
    this.selectedOrder = order;
    this.showDetailModal = true;
  }
  
  // 取消订单
  cancelOrder(order: Order, event: Event) {
    event.stopPropagation();
    if (confirm('确定要取消这个订单吗？')) {
      order.status = 'cancelled';
      this.updateFilterCounts();
      this.applyFilter();
      this.showAlert('订单已取消', 'success');
    }
  }
  
  // 评价订单
  rateOrder(order: Order, event: Event) {
    event.stopPropagation();
    this.showAlert('评价功能开发中', 'info');
  }
  
  // 关闭模态框
  closeModal(event: Event) {
    if (event.target === event.currentTarget) {
      this.showDetailModal = false;
    }
  }
  
  // 跳转到预约回收
  goToBooking() {
    this.router.navigate(['/consumer/booking-recycle']);
  }
  
  // 返回上一页
  goBack() {
    this.router.navigate(['/consumer/profile']);
  }
  
  // 显示提示信息
  private showAlert(message: string, type: 'success' | 'error' | 'info') {
    // 简单的提示实现
    alert(message);
  }
}