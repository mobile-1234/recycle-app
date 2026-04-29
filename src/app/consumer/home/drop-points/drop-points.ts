import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SvgIconComponent } from '../../../shared/components/svg-icons/svg-icons.component';
import { AmapService, RecycleStation, Location } from '../../../core/services/amap.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-drop-points',
  standalone: true,
  imports: [CommonModule, FormsModule, SvgIconComponent],
  templateUrl: './drop-points.html',
  styleUrls: ['./drop-points.scss']
})
export class DropPointsComponent implements OnInit, OnDestroy, AfterViewInit {
  selectedFilter = 'all';
  searchQuery = '';
  
  // 视图模式: 'list' 列表, 'map' 地图
  viewMode: 'list' | 'map' = 'list';
  
  // 当前位置
  currentLocation: Location | null = null;
  
  // 加载状态
  isLoading = false;
  isLocating = false;
  locationError = '';
  
  // 回收站点列表（从高德地图API获取）
  dropPoints: RecycleStation[] = [];
  filteredDropPoints: RecycleStation[] = [];
  
  // 选中的站点（用于导航）
  selectedStation: RecycleStation | null = null;
  showNavigationPanel = false;
  navigationMode: 'walking' | 'driving' = 'walking';
  
  // 订阅
  private subscriptions: Subscription[] = [];

  filterOptions = [
    { value: 'all', label: '全部', icon: 'all' },
    { value: 'plastic', label: '塑料', icon: 'plastic' },
    { value: 'paper', label: '纸张', icon: 'paper' },
    { value: 'metal', label: '金属', icon: 'metal' },
    { value: 'glass', label: '玻璃', icon: 'glass' },
    { value: 'electronic', label: '电子', icon: 'electronic' },
    { value: 'battery', label: '电池', icon: 'battery' }
  ];

  constructor(
    private router: Router,
    private amapService: AmapService
  ) {}

  ngOnInit() {
    // 订阅加载状态
    this.subscriptions.push(
      this.amapService.isLoading$.subscribe(loading => {
        this.isLoading = loading;
      })
    );

    // 订阅附近站点
    this.subscriptions.push(
      this.amapService.nearbyStations$.subscribe(stations => {
        this.dropPoints = stations;
        this.filterDropPoints();
      })
    );

    // 订阅错误
    this.subscriptions.push(
      this.amapService.onError.subscribe(error => {
        this.locationError = error;
        console.error('地图服务错误:', error);
      })
    );

    // 自动获取位置和附近站点
    this.initLocation();
  }

  ngAfterViewInit() {
    // 如果是地图模式，初始化地图
    if (this.viewMode === 'map') {
      this.initMap();
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.amapService.destroyMap();
  }

  /**
   * 初始化定位并搜索附近站点
   */
  async initLocation() {
    this.isLocating = true;
    this.locationError = '';

    try {
      // 获取当前位置
      this.currentLocation = await this.amapService.getCurrentLocation();
      console.log('当前位置:', this.currentLocation);

      // 搜索附近回收站点
      await this.amapService.searchNearbyStations('回收站', this.currentLocation, 5000);
      
    } catch (error: any) {
      console.error('定位失败:', error);
      this.locationError = error.message || '无法获取当前位置';
    } finally {
      this.isLocating = false;
    }
  }

  /**
   * 初始化地图
   */
  async initMap() {
    try {
      await this.amapService.initMap('map-container', {
        zoom: 14,
        center: this.currentLocation 
          ? [this.currentLocation.lng, this.currentLocation.lat] 
          : [116.397428, 39.90923]
      });

      // 显示当前位置
      if (this.currentLocation) {
        this.amapService.showCurrentLocationMarker(this.currentLocation);
      }

      // 显示站点标记
      if (this.dropPoints.length > 0) {
        this.amapService.showStationsOnMap(this.dropPoints);
      }
    } catch (error) {
      console.error('初始化地图失败:', error);
    }
  }

  /**
   * 切换视图模式
   */
  toggleViewMode() {
    this.viewMode = this.viewMode === 'list' ? 'map' : 'list';
    
    if (this.viewMode === 'map') {
      // 延迟初始化地图，等待DOM渲染
      setTimeout(() => this.initMap(), 100);
    } else {
      this.amapService.destroyMap();
    }
  }

  /**
   * 刷新位置和站点
   */
  async refreshLocation() {
    await this.initLocation();
    
    if (this.viewMode === 'map' && this.currentLocation) {
      this.amapService.showCurrentLocationMarker(this.currentLocation);
      this.amapService.showStationsOnMap(this.filteredDropPoints);
    }
  }

  goBack() {
    this.router.navigate(['/consumer/home']);
  }

  selectFilter(filter: string) {
    this.selectedFilter = filter;
    this.filterDropPoints();
    
    // 更新地图标记
    if (this.viewMode === 'map') {
      this.amapService.showStationsOnMap(this.filteredDropPoints);
    }
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
    
    // 更新地图标记
    if (this.viewMode === 'map') {
      this.amapService.showStationsOnMap(this.filteredDropPoints);
    }
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
    if (phone && phone !== '暂无电话') {
      window.open(`tel:${phone}`);
    }
  }

  /**
   * 导航到回收站点 - 使用高德地图
   */
  navigateToDropPoint(point: RecycleStation) {
    this.selectedStation = point;
    this.showNavigationPanel = true;
  }

  /**
   * 开始导航
   */
  startNavigation() {
    if (!this.selectedStation) return;
    
    // 打开高德地图App/网页导航
    this.amapService.openAmapNavigation(
      this.selectedStation.location,
      this.selectedStation.name
    );
    
    this.closeNavigationPanel();
  }

  /**
   * 在地图上显示路线
   */
  async showRouteOnMap() {
    if (!this.selectedStation || this.viewMode !== 'map') return;
    
    try {
      const route = this.navigationMode === 'walking'
        ? await this.amapService.navigateWalking(this.selectedStation.location)
        : await this.amapService.navigateDriving(this.selectedStation.location);
      
      this.amapService.drawNavigationRoute(route, this.navigationMode);
    } catch (error) {
      console.error('路线规划失败:', error);
    }
  }

  /**
   * 关闭导航面板
   */
  closeNavigationPanel() {
    this.showNavigationPanel = false;
    this.selectedStation = null;
  }

  /**
   * 切换导航模式
   */
  setNavigationMode(mode: 'walking' | 'driving') {
    this.navigationMode = mode;
  }

  viewDropPointDetails(point: RecycleStation) {
    // 可以导航到详情页面或显示详情弹窗
    console.log('查看详情:', point);
    // TODO: 实现详情弹窗或页面
  }

  bookDropPoint(point: RecycleStation) {
    // 导航到预约页面，传递站点信息
    this.router.navigate(['/consumer/booking'], { 
      queryParams: { 
        dropPointId: point.id,
        dropPointName: point.name,
        dropPointAddress: point.address,
        lat: point.location.lat,
        lng: point.location.lng
      } 
    });
  }

  getTypeIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      plastic: 'plastic',
      paper: 'paper',
      metal: 'metal',
      glass: 'glass',
      electronic: 'electronic',
      battery: 'battery',
      textile: 'textile'
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
      battery: '电池',
      textile: '纺织品'
    };
    return labelMap[type] || type;
  }

  /**
   * 格式化距离显示
   */
  formatDistance(meters: number): string {
    return this.amapService.formatDistance(meters);
  }
}