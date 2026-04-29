import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AmapService } from '../../core/services/amap.service';

// 声明高德地图全局变量
declare const AMap: any;

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
  coordinates?: [number, number]; // [经度, 纬度]
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
export class OrderManagement implements OnInit, AfterViewInit, OnDestroy {
  searchQuery = '';
  currentTab: OrderStatus = 'pending';
  selectedOrder: Order | null = null;
  showDetailModal = false;

  // 地图相关
  viewMode: 'list' | 'map' = 'list';
  private map: any = null;
  private markers: any[] = [];
  private infoWindow: any = null;

  constructor(private amapService: AmapService) {}

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
      coordinates: [116.461937, 39.909175],
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
      coordinates: [116.310003, 39.984154],
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
      coordinates: [116.480983, 40.002102],
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
      coordinates: [116.352792, 39.913428],
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
      coordinates: [116.410049, 39.913904],
      estimatedValue: 126,
      collectorName: '张师傅',
      collectorPhone: '138****3456',
      settlementAmount: 126,
      settlementStatus: '已结算'
    }
  ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.destroyMap();
  }

  // 切换视图模式
  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'list' ? 'map' : 'list';
    if (this.viewMode === 'map') {
      setTimeout(() => this.initMap(), 100);
    }
  }

  // 初始化地图
  private initMap(): void {
    if (this.map) return;

    try {
      this.map = new AMap.Map('order-map-container', {
        zoom: 12,
        center: [116.397428, 39.90923],
        viewMode: '2D',
        resizeEnable: true
      });

      AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], () => {
        this.map.addControl(new AMap.ToolBar({ position: 'RB' }));
        this.map.addControl(new AMap.Scale({ position: 'LB' }));
      });

      this.addOrderMarkers();
    } catch (error) {
      console.error('初始化地图失败:', error);
    }
  }

  // 添加订单标记
  private addOrderMarkers(): void {
    this.clearMarkers();

    this.filteredOrders.forEach(order => {
      if (!order.coordinates) return;

      const marker = new AMap.Marker({
        position: new AMap.LngLat(order.coordinates[0], order.coordinates[1]),
        title: order.id,
        icon: this.getOrderIcon(order.status),
        offset: new AMap.Pixel(-15, -30)
      });

      marker.on('click', () => {
        this.showOrderInfoWindow(order, marker);
      });

      this.map.add(marker);
      this.markers.push(marker);
    });

    if (this.markers.length > 0) {
      this.map.setFitView(this.markers);
    }
  }

  // 获取订单图标
  private getOrderIcon(status: string): any {
    const colors: { [key: string]: string } = {
      'pending': '#FF9800',
      'in-progress': '#2196F3',
      'completed': '#4CAF50',
      'cancelled': '#9E9E9E'
    };
    const color = colors[status] || '#9E9E9E';

    return new AMap.Icon({
      size: new AMap.Size(30, 40),
      image: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 30 40">
          <path d="M15 0C6.716 0 0 6.716 0 15c0 8.284 15 25 15 25s15-16.716 15-25C30 6.716 23.284 0 15 0z" fill="${color}"/>
          <circle cx="15" cy="15" r="8" fill="white"/>
          <text x="15" y="19" text-anchor="middle" font-size="12" fill="${color}">📦</text>
        </svg>
      `)}`,
      imageSize: new AMap.Size(30, 40)
    });
  }

  // 显示订单信息窗口
  private showOrderInfoWindow(order: Order, marker: any): void {
    if (this.infoWindow) {
      this.infoWindow.close();
    }

    const content = `
      <div style="padding: 10px; min-width: 220px;">
        <h4 style="margin: 0 0 10px; color: #333;">${order.id}</h4>
        <p style="margin: 5px 0; font-size: 13px; color: #666;">
          <strong>客户:</strong> ${order.customerName}
        </p>
        <p style="margin: 5px 0; font-size: 13px; color: #666;">
          <strong>品类:</strong> ${order.category} (${order.weight}kg)
        </p>
        <p style="margin: 5px 0; font-size: 13px; color: #666;">
          <strong>地址:</strong> ${order.address}
        </p>
        <p style="margin: 5px 0; font-size: 13px; color: #666;">
          <strong>状态:</strong> 
          <span style="color: ${this.getStatusColor(order.status)};">${this.getStatusText(order.status)}</span>
        </p>
        <p style="margin: 5px 0; font-size: 13px; color: #666;">
          <strong>预估:</strong> ¥${order.estimatedValue}
        </p>
      </div>
    `;

    this.infoWindow = new AMap.InfoWindow({
      content: content,
      offset: new AMap.Pixel(0, -30)
    });

    this.infoWindow.open(this.map, marker.getPosition());
  }

  // 获取状态颜色
  private getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'pending': '#FF9800',
      'in-progress': '#2196F3',
      'completed': '#4CAF50',
      'cancelled': '#9E9E9E'
    };
    return colors[status] || '#9E9E9E';
  }

  // 清除标记
  private clearMarkers(): void {
    this.markers.forEach(marker => this.map.remove(marker));
    this.markers = [];
  }

  // 销毁地图
  private destroyMap(): void {
    if (this.map) {
      this.map.destroy();
      this.map = null;
    }
  }

  // 在地图上定位订单
  locateOrderOnMap(order: Order): void {
    if (!order.coordinates) return;
    
    this.viewMode = 'map';
    setTimeout(() => {
      if (!this.map) {
        this.initMap();
      }
      this.map.setZoomAndCenter(15, order.coordinates);
    }, 150);
  }

  // 导航到订单地址
  navigateToOrder(order: Order): void {
    if (!order.coordinates) return;
    
    this.amapService.openAmapNavigation(
      { lat: order.coordinates[1], lng: order.coordinates[0] },
      order.address
    );
  }

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
}
