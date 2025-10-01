import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SvgIconComponent } from '../../../shared/components/svg-icons/svg-icons.component';

@Component({
  selector: 'app-collectors',
  standalone: true,
  imports: [CommonModule, SvgIconComponent],
  templateUrl: './collectors.html',
  styleUrls: ['./collectors.scss']
})
export class CollectorsComponent implements OnInit {
  selectedFilter = 'all';
  
  collectors = [
    {
      id: 1,
      name: '张师傅',
      avatar: 'avatar1.jpg',
      rating: 4.9,
      reviewCount: 156,
      distance: '0.8km',
      status: 'online',
      specialties: ['电子产品', '金属回收', '家具回收'],
      experience: '5年经验',
      phone: '138****1234',
      completedOrders: 1250,
      responseTime: '5分钟内',
      workingHours: '08:00-20:00',
      serviceArea: '朝阳区、海淀区',
      priceRange: '上门费: ¥10-20',
      features: ['免费评估', '上门回收', '当场结算']
    },
    {
      id: 2,
      name: '李师傅',
      avatar: 'avatar2.jpg',
      rating: 4.8,
      reviewCount: 203,
      distance: '1.2km',
      status: 'online',
      specialties: ['纸张回收', '塑料回收', '玻璃回收'],
      experience: '8年经验',
      phone: '139****5678',
      completedOrders: 1890,
      responseTime: '10分钟内',
      workingHours: '07:00-19:00',
      serviceArea: '东城区、西城区',
      priceRange: '上门费: ¥15-25',
      features: ['专业分类', '环保处理', '价格透明']
    },
    {
      id: 3,
      name: '王师傅',
      avatar: 'avatar3.jpg',
      rating: 4.7,
      reviewCount: 89,
      distance: '2.1km',
      status: 'busy',
      specialties: ['大件回收', '装修垃圾', '办公设备'],
      experience: '3年经验',
      phone: '137****9012',
      completedOrders: 567,
      responseTime: '15分钟内',
      workingHours: '09:00-18:00',
      serviceArea: '丰台区、大兴区',
      priceRange: '上门费: ¥20-30',
      features: ['大件搬运', '团队作业', '清理彻底']
    },
    {
      id: 4,
      name: '陈师傅',
      avatar: 'avatar4.jpg',
      rating: 4.6,
      reviewCount: 134,
      distance: '3.5km',
      status: 'offline',
      specialties: ['有害垃圾', '电池回收', '化学品处理'],
      experience: '6年经验',
      phone: '136****3456',
      completedOrders: 890,
      responseTime: '20分钟内',
      workingHours: '08:30-17:30',
      serviceArea: '石景山区、门头沟区',
      priceRange: '上门费: ¥25-35',
      features: ['专业资质', '安全处理', '环保认证']
    }
  ];

  filteredCollectors = [...this.collectors];

  filterOptions = [
    { value: 'all', label: '全部', icon: 'all' },
    { value: 'online', label: '在线', icon: 'online' },
    { value: 'nearby', label: '附近', icon: 'location' },
    { value: 'highRated', label: '高评分', icon: 'star' }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    this.filterCollectors();
  }

  goBack() {
    this.router.navigate(['/consumer/home']);
  }

  selectFilter(filter: string) {
    this.selectedFilter = filter;
    this.filterCollectors();
  }

  filterCollectors() {
    let filtered = [...this.collectors];

    switch (this.selectedFilter) {
      case 'online':
        filtered = filtered.filter(collector => collector.status === 'online');
        break;
      case 'nearby':
        filtered = filtered.sort((a, b) => 
          parseFloat(a.distance) - parseFloat(b.distance)
        );
        break;
      case 'highRated':
        filtered = filtered.filter(collector => collector.rating >= 4.8);
        break;
      default:
        // 保持原有顺序
        break;
    }

    this.filteredCollectors = filtered;
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'online':
        return '在线';
      case 'busy':
        return '忙碌';
      case 'offline':
        return '离线';
      default:
        return '未知';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'online':
        return '#4CAF50';
      case 'busy':
        return '#FF9800';
      case 'offline':
        return '#9E9E9E';
      default:
        return '#9E9E9E';
    }
  }

  callCollector(phone: string) {
    window.open(`tel:${phone}`);
  }

  bookCollector(collector: any) {
    this.router.navigate(['/consumer/booking'], { 
      queryParams: { collectorId: collector.id } 
    });
  }

  viewCollectorProfile(collector: any) {
    // 可以导航到详情页面或显示详情弹窗
    console.log('查看详情:', collector);
  }

  chatWithCollector(collector: any) {
    // 可以集成聊天功能
    console.log('联系回收员:', collector);
  }

  getSpecialtyColor(specialty: string): string {
    const colors = [
      '#4CAF50', '#2196F3', '#FF9800', '#9C27B0', 
      '#F44336', '#00BCD4', '#795548', '#607D8B'
    ];
    const index = specialty.length % colors.length;
    return colors[index];
  }
}