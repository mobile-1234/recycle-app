import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Order {
  id: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  category: string;
  weight: number;
  customerName: string;
  customerPhone: string;
  createTime: string;
  area: string;
  address: string;
  estimatedValue: number;
  collectorName?: string;
  collectorPhone?: string;
  settlementAmount?: number;
  settlementStatus?: string;
}

type OrderStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './order-management.html',
  styleUrl: './order-management.scss'
})
export class OrderManagement {
  searchQuery = '';
  currentTab: OrderStatus = 'pending';
  selectedOrder: Order | null = null;
  showDetailModal = false;

  orders: Order[] = [
    {
      id: 'ORD-20230520-001',
      status: 'pending',
      category: '废纸',
      weight: 45,
      customerName: '张先生',
      customerPhone: '138****5678',
      createTime: '2023-05-20 09:30',
      area: '朝阳区',
      address: '朝阳区建国路88号SOHO现代城A座1506室',
      estimatedValue: 135,
      settlementStatus: '未结算'
    },
    {
      id: 'ORD-20230520-002',
      status: 'pending',
      category: '塑料瓶',
      weight: 32,
      customerName: '李女士',
      customerPhone: '139****1234',
      createTime: '2023-05-20 10:15',
      area: '海淀区',
      address: '海淀区中关村大街1号',
      estimatedValue: 96,
      settlementStatus: '未结算'
    },
    {
      id: 'ORD-20230520-003',
      status: 'pending',
      category: '金属',
      weight: 68,
      customerName: '王先生',
      customerPhone: '137****8765',
      createTime: '2023-05-20 11:20',
      area: '朝阳区',
      address: '朝阳区望京SOHO T2',
      estimatedValue: 272,
      settlementStatus: '未结算'
    },
    {
      id: 'ORD-20230519-015',
      status: 'in-progress',
      category: '纸箱',
      weight: 55,
      customerName: '赵女士',
      customerPhone: '136****5432',
      createTime: '2023-05-19 14:30',
      area: '西城区',
      address: '西城区金融街购物中心',
      estimatedValue: 165,
      collectorName: '刘师傅',
      collectorPhone: '135****7890',
      settlementStatus: '未结算'
    },
    {
      id: 'ORD-20230518-028',
      status: 'completed',
      category: '塑料',
      weight: 42,
      customerName: '陈先生',
      customerPhone: '158****9012',
      createTime: '2023-05-18 16:00',
      area: '东城区',
      address: '东城区王府井大街',
      estimatedValue: 126,
      collectorName: '张师傅',
      collectorPhone: '138****3456',
      settlementAmount: 126,
      settlementStatus: '已结算'
    }
  ];

  get filteredOrders(): Order[] {
    let filtered = this.orders.filter(order => order.status === this.currentTab);
    
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.customerPhone.includes(query)
      );
    }
    
    return filtered;
  }

  getOrderCount(status: OrderStatus): number {
    return this.orders.filter(order => order.status === status).length;
  }

  switchTab(tab: OrderStatus): void {
    this.currentTab = tab;
  }

  getStatusText(status: OrderStatus): string {
    const statusMap = {
      'pending': '待分配',
      'in-progress': '回收中',
      'completed': '已完成',
      'cancelled': '已取消'
    };
    return statusMap[status];
  }

  getStatusClass(status: OrderStatus): string {
    return `status-${status}`;
  }

  openOrderDetail(order: Order): void {
    this.selectedOrder = order;
    this.showDetailModal = true;
  }

  closeOrderDetail(): void {
    this.showDetailModal = false;
    this.selectedOrder = null;
  }

  assignOrder(order: Order, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    alert(`分配订单: ${order.id}`);
    // TODO: 实现分配逻辑
  }

  viewOrder(order: Order, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.openOrderDetail(order);
  }

  cancelOrder(order: Order, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (confirm(`确定要取消订单 ${order.id} 吗?`)) {
      order.status = 'cancelled';
      alert('订单已取消');
    }
  }

  completeOrder(order: Order, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (confirm(`确定完成订单 ${order.id} 吗?`)) {
      order.status = 'completed';
      alert('订单已完成');
    }
  }

  constructor() {}
}
