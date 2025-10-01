import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SvgIconComponent } from '../../../shared/components/svg-icons/svg-icons.component';

@Component({
  selector: 'app-drop-points',
  standalone: true,
  imports: [CommonModule, FormsModule, SvgIconComponent],
  templateUrl: './drop-points.html',
  styleUrls: ['./drop-points.scss']
})
export class DropPointsComponent implements OnInit {
  selectedFilter = 'all';
  searchQuery = '';
  
  dropPoints = [
    {
      id: 1,
      name: '绿色家园小区回收点',
      address: '朝阳区建国路88号绿色家园小区',
      distance: '0.5km',
      rating: 4.8,
      status: 'open',
      types: ['plastic', 'paper', 'metal', 'glass'],
      hours: '06:00-22:00',
      phone: '010-12345678',
      features: ['24小时', '智能分类', '积分奖励'],
      coordinates: { lat: 39.9042, lng: 116.4074 }
    },
    {
      id: 2,
      name: '阳光社区环保站',
      address: '海淀区中关村大街123号阳光社区',
      distance: '1.2km',
      rating: 4.6,
      status: 'open',
      types: ['plastic', 'paper', 'electronic'],
      hours: '08:00-20:00',
      phone: '010-87654321',
      features: ['专业回收', '环保教育'],
      coordinates: { lat: 39.9826, lng: 116.3186 }
    },
    {
      id: 3,
      name: '科技园区回收中心',
      address: '海淀区科技园区创新大厦B座',
      distance: '2.1km',
      rating: 4.9,
      status: 'busy',
      types: ['electronic', 'battery', 'metal'],
      hours: '09:00-18:00',
      phone: '010-11223344',
      features: ['专业设备', '数据销毁', '企业服务'],
      coordinates: { lat: 39.9889, lng: 116.3056 }
    },
    {
      id: 4,
      name: '市民广场便民点',
      address: '东城区王府井大街市民广场',
      distance: '3.5km',
      rating: 4.3,
      status: 'closed',
      types: ['plastic', 'paper', 'glass'],
      hours: '07:00-19:00',
      phone: '010-99887766',
      features: ['便民服务', '快速投放'],
      coordinates: { lat: 39.9097, lng: 116.4139 }
    }
  ];

  filteredDropPoints = [...this.dropPoints];

  filterOptions = [
    { value: 'all', label: '全部', icon: 'all' },
    { value: 'plastic', label: '塑料', icon: 'plastic' },
    { value: 'paper', label: '纸张', icon: 'paper' },
    { value: 'metal', label: '金属', icon: 'metal' },
    { value: 'glass', label: '玻璃', icon: 'glass' },
    { value: 'electronic', label: '电子', icon: 'electronic' },
    { value: 'battery', label: '电池', icon: 'battery' }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.filterDropPoints();
  }

  goBack() {
    this.router.navigate(['/consumer/home']);
  }

  selectFilter(filter: string) {
    this.selectedFilter = filter;
    this.filterDropPoints();
  }

  filterDropPoints() {
    let filtered = [...this.dropPoints];

    // 按类型筛选
    if (this.selectedFilter !== 'all') {
      filtered = filtered.filter(point => 
        point.types.includes(this.selectedFilter)
      );
    }

    // 按搜索关键词筛选
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(point =>
        point.name.toLowerCase().includes(query) ||
        point.address.toLowerCase().includes(query)
      );
    }

    this.filteredDropPoints = filtered;
  }

  onSearchChange(event: any) {
    this.searchQuery = event.target.value;
    this.filterDropPoints();
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'open':
        return '营业中';
      case 'busy':
        return '繁忙';
      case 'closed':
        return '已关闭';
      default:
        return '未知';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'open':
        return '#4CAF50';
      case 'busy':
        return '#FF9800';
      case 'closed':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  }

  callDropPoint(phone: string) {
    window.open(`tel:${phone}`);
  }

  navigateToDropPoint(point: any) {
    // 这里可以集成地图导航功能
    const url = `https://maps.google.com/?q=${point.coordinates.lat},${point.coordinates.lng}`;
    window.open(url, '_blank');
  }

  viewDropPointDetails(point: any) {
    // 可以导航到详情页面或显示详情弹窗
    console.log('查看详情:', point);
  }

  bookDropPoint(point: any) {
    // 导航到预约页面
    this.router.navigate(['/consumer/booking'], { 
      queryParams: { dropPointId: point.id } 
    });
  }

  getTypeIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      plastic: 'plastic',
      paper: 'paper',
      metal: 'metal',
      glass: 'glass',
      electronic: 'electronic',
      battery: 'battery'
    };
    return iconMap[type] || 'recycle';
  }

  getTypeLabel(type: string): string {
    const labelMap: { [key: string]: string } = {
      plastic: '塑料',
      paper: '纸张',
      metal: '金属',
      glass: '玻璃',
      electronic: '电子',
      battery: '电池'
    };
    return labelMap[type] || type;
  }
}