import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

declare const AMap: any;

export interface Location {
  lng: number;
  lat: number;
  address?: string;
  city?: string;
  district?: string;
  street?: string;
  formattedAddress?: string;
}

export interface RecycleStation {
  id: string;
  name: string;
  address: string;
  location: Location;
  distance: number;  // 米
  distanceText: string;
  rating?: number;
  status: 'open' | 'busy' | 'closed';
  types: string[];
  hours: string;
  phone: string;
  features: string[];
  tel?: string;
  type?: string;
}

export interface NavigationRoute {
  distance: number;  // 米
  duration: number;  // 秒
  steps: NavigationStep[];
}

export interface NavigationStep {
  instruction: string;
  distance: number;
  duration: number;
  path: Location[];
}

@Injectable({
  providedIn: 'root'
})
export class AmapService {
  private map: any = null;
  private geolocation: any = null;
  private placeSearch: any = null;
  private geocoder: any = null;
  private walking: any = null;
  private driving: any = null;
  
  // 当前位置
  private _currentLocation = new BehaviorSubject<Location | null>(null);
  public currentLocation$ = this._currentLocation.asObservable();
  
  // 附近回收站点
  private _nearbyStations = new BehaviorSubject<RecycleStation[]>([]);
  public nearbyStations$ = this._nearbyStations.asObservable();
  
  // 加载状态
  private _isLoading = new BehaviorSubject<boolean>(false);
  public isLoading$ = this._isLoading.asObservable();
  
  // 错误信息
  public onError = new Subject<string>();
  
  // 地图标记点
  private markers: any[] = [];
  private currentLocationMarker: any = null;
  
  constructor() {
    this.initServices();
  }

  /**
   * 初始化高德地图服务
   */
  private initServices(): void {
    if (typeof AMap === 'undefined') {
      console.warn('高德地图API未加载');
      return;
    }

    // 初始化定位服务
    this.geolocation = new AMap.Geolocation({
      enableHighAccuracy: true,  // 高精度定位
      timeout: 10000,            // 超时时间
      buttonPosition: 'RB',      // 定位按钮位置
      zoomToAccuracy: true,      // 定位成功后是否自动调整地图视野
      showMarker: true,          // 显示定位点
      showCircle: true,          // 显示精度圈
      panToLocation: true,       // 定位成功后将定位到的位置作为地图中心点
    });

    // 初始化地点搜索服务
    this.placeSearch = new AMap.PlaceSearch({
      pageSize: 20,
      pageIndex: 1,
      extensions: 'all'
    });

    // 初始化地理编码服务
    this.geocoder = new AMap.Geocoder({
      city: '全国',
      radius: 1000
    });

    // 初始化步行导航
    this.walking = new AMap.Walking();

    // 初始化驾车导航
    this.driving = new AMap.Driving();
  }

  /**
   * 初始化地图
   * @param containerId 地图容器ID
   * @param options 地图配置选项
   */
  initMap(containerId: string, options?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (typeof AMap === 'undefined') {
        reject(new Error('高德地图API未加载'));
        return;
      }

      try {
        const defaultOptions = {
          zoom: 15,
          center: [116.397428, 39.90923], // 默认北京
          resizeEnable: true,
          ...options
        };

        this.map = new AMap.Map(containerId, defaultOptions);
        
        // 添加地图控件
        this.map.addControl(new AMap.Scale());
        this.map.addControl(new AMap.ToolBar({
          position: 'RB'
        }));

        // 地图加载完成
        this.map.on('complete', () => {
          console.log('高德地图加载完成');
          resolve(this.map);
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 获取当前位置
   */
  getCurrentLocation(): Promise<Location> {
    return new Promise((resolve, reject) => {
      this._isLoading.next(true);

      if (!this.geolocation) {
        this._isLoading.next(false);
        reject(new Error('定位服务未初始化'));
        return;
      }

      this.geolocation.getCurrentPosition((status: string, result: any) => {
        this._isLoading.next(false);

        if (status === 'complete') {
          const location: Location = {
            lng: result.position.lng,
            lat: result.position.lat,
            address: result.formattedAddress,
            city: result.addressComponent?.city,
            district: result.addressComponent?.district,
            street: result.addressComponent?.street,
            formattedAddress: result.formattedAddress
          };
          
          this._currentLocation.next(location);
          console.log('定位成功:', location);
          resolve(location);
        } else {
          const errorMsg = this.getLocationErrorMessage(result);
          console.error('定位失败:', errorMsg);
          this.onError.next(errorMsg);
          reject(new Error(errorMsg));
        }
      });
    });
  }

  /**
   * 获取定位错误信息
   */
  private getLocationErrorMessage(result: any): string {
    const errorMessages: { [key: string]: string } = {
      'PERMISSION_DENIED': '用户拒绝了定位请求，请在浏览器设置中允许定位',
      'POSITION_UNAVAILABLE': '无法获取当前位置信息',
      'TIMEOUT': '定位请求超时，请检查网络连接',
      'UNKNOWN_ERROR': '定位失败，请重试'
    };
    return errorMessages[result?.info] || result?.message || '定位失败';
  }

  /**
   * 搜索附近的回收站点
   * @param keyword 搜索关键词
   * @param location 中心点位置（可选，默认使用当前位置）
   * @param radius 搜索半径（米）
   */
  searchNearbyStations(keyword: string = '回收站', location?: Location, radius: number = 5000): Promise<RecycleStation[]> {
    return new Promise(async (resolve, reject) => {
      this._isLoading.next(true);

      try {
        // 如果没有提供位置，先获取当前位置
        let searchLocation = location;
        if (!searchLocation) {
          const currentLoc = this._currentLocation.value;
          if (currentLoc) {
            searchLocation = currentLoc;
          } else {
            searchLocation = await this.getCurrentLocation();
          }
        }

        if (!searchLocation) {
          throw new Error('无法获取位置信息');
        }

        // 构建搜索关键词数组，提高搜索准确性
        const keywords = [
          '回收站',
          '废品回收',
          '再生资源回收',
          '垃圾回收',
          '环保站',
          '可回收物投放点'
        ];

        // 使用周边搜索
        this.placeSearch.setCity(searchLocation.city || '');
        
        const searchPromises = keywords.slice(0, 3).map(kw => {
          return new Promise<any[]>((res) => {
            this.placeSearch.searchNearBy(
              kw,
              [searchLocation!.lng, searchLocation!.lat],
              radius,
              (status: string, result: any) => {
                if (status === 'complete' && result.poiList?.pois) {
                  res(result.poiList.pois);
                } else {
                  res([]);
                }
              }
            );
          });
        });

        const results = await Promise.all(searchPromises);
        const allPois = results.flat();
        
        // 去重
        const uniquePois = this.deduplicatePois(allPois);
        
        // 转换为回收站格式
        const stations = this.convertPoisToStations(uniquePois, searchLocation);
        
        // 按距离排序
        stations.sort((a, b) => a.distance - b.distance);
        
        this._nearbyStations.next(stations);
        this._isLoading.next(false);
        
        console.log(`搜索到 ${stations.length} 个回收站点`);
        resolve(stations);

      } catch (error: any) {
        this._isLoading.next(false);
        console.error('搜索回收站失败:', error);
        this.onError.next(error.message || '搜索失败');
        reject(error);
      }
    });
  }

  /**
   * POI去重
   */
  private deduplicatePois(pois: any[]): any[] {
    const seen = new Set();
    return pois.filter(poi => {
      const key = `${poi.name}_${poi.location?.lng}_${poi.location?.lat}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  /**
   * 将高德POI转换为回收站格式
   */
  private convertPoisToStations(pois: any[], userLocation: Location): RecycleStation[] {
    return pois.map((poi, index) => {
      const distance = poi.distance || this.calculateDistance(
        userLocation.lat, userLocation.lng,
        poi.location.lat, poi.location.lng
      );

      return {
        id: poi.id || `station_${index}`,
        name: poi.name,
        address: poi.address || poi.pname + poi.cityname + poi.adname,
        location: {
          lng: poi.location.lng,
          lat: poi.location.lat
        },
        distance: distance,
        distanceText: this.formatDistance(distance),
        rating: poi.biz_ext?.rating ? parseFloat(poi.biz_ext.rating) : 4.0 + Math.random() * 0.9,
        status: this.determineStatus(poi),
        types: this.determineTypes(poi),
        hours: poi.biz_ext?.open_time || '08:00-20:00',
        phone: poi.tel || '暂无电话',
        tel: poi.tel,
        type: poi.type,
        features: this.determineFeatures(poi)
      };
    });
  }

  /**
   * 计算两点之间的距离（米）
   */
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371000; // 地球半径（米）
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }

  private toRad(deg: number): number {
    return deg * Math.PI / 180;
  }

  /**
   * 格式化距离显示
   */
  formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${meters}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  }

  /**
   * 确定站点状态
   */
  private determineStatus(poi: any): 'open' | 'busy' | 'closed' {
    const now = new Date();
    const hour = now.getHours();
    
    // 简单根据时间判断
    if (hour < 7 || hour > 21) {
      return 'closed';
    }
    if (hour >= 11 && hour <= 13 || hour >= 17 && hour <= 19) {
      return 'busy';
    }
    return 'open';
  }

  /**
   * 确定接收的回收类型
   */
  private determineTypes(poi: any): string[] {
    const types: string[] = ['paper', 'plastic'];
    const name = poi.name?.toLowerCase() || '';
    const type = poi.type?.toLowerCase() || '';
    
    if (name.includes('电子') || type.includes('电子')) {
      types.push('electronic');
    }
    if (name.includes('金属') || type.includes('金属')) {
      types.push('metal');
    }
    if (name.includes('玻璃')) {
      types.push('glass');
    }
    if (name.includes('电池') || name.includes('有害')) {
      types.push('battery');
    }
    if (name.includes('纺织') || name.includes('衣物')) {
      types.push('textile');
    }
    
    return types;
  }

  /**
   * 确定服务特色
   */
  private determineFeatures(poi: any): string[] {
    const features: string[] = [];
    const name = poi.name?.toLowerCase() || '';
    
    if (name.includes('智能') || name.includes('自助')) {
      features.push('智能设备');
    }
    if (name.includes('24小时') || poi.biz_ext?.open_time?.includes('24')) {
      features.push('24小时');
    }
    if (name.includes('社区') || name.includes('小区')) {
      features.push('社区服务');
    }
    if (features.length === 0) {
      features.push('便民服务');
    }
    
    return features;
  }

  /**
   * 在地图上显示回收站点标记
   */
  showStationsOnMap(stations: RecycleStation[]): void {
    if (!this.map) {
      console.warn('地图未初始化');
      return;
    }

    // 清除旧标记
    this.clearMarkers();

    stations.forEach((station, index) => {
      // 创建标记
      const marker = new AMap.Marker({
        position: [station.location.lng, station.location.lat],
        title: station.name,
        label: {
          content: `<div class="amap-marker-label">${index + 1}</div>`,
          direction: 'top'
        }
      });

      // 创建信息窗口
      const infoWindow = new AMap.InfoWindow({
        content: this.createInfoWindowContent(station),
        offset: new AMap.Pixel(0, -30)
      });

      // 点击标记显示信息窗口
      marker.on('click', () => {
        infoWindow.open(this.map, marker.getPosition());
      });

      this.markers.push(marker);
      marker.setMap(this.map);
    });

    // 调整视野以显示所有标记
    if (stations.length > 0) {
      this.map.setFitView(this.markers);
    }
  }

  /**
   * 创建信息窗口内容
   */
  private createInfoWindowContent(station: RecycleStation): string {
    return `
      <div style="padding: 10px; min-width: 200px;">
        <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #333;">${station.name}</h4>
        <p style="margin: 4px 0; font-size: 12px; color: #666;">
          <i class="fa fa-map-marker-alt" style="width: 16px;"></i> ${station.address}
        </p>
        <p style="margin: 4px 0; font-size: 12px; color: #666;">
          <i class="fa fa-clock" style="width: 16px;"></i> ${station.hours}
        </p>
        <p style="margin: 4px 0; font-size: 12px; color: #666;">
          <i class="fa fa-phone" style="width: 16px;"></i> ${station.phone}
        </p>
        <p style="margin: 8px 0 0 0; font-size: 12px;">
          <span style="color: #4CAF50; font-weight: bold;">${station.distanceText}</span>
        </p>
      </div>
    `;
  }

  /**
   * 显示当前位置标记
   */
  showCurrentLocationMarker(location: Location): void {
    if (!this.map) return;

    // 清除旧的当前位置标记
    if (this.currentLocationMarker) {
      this.currentLocationMarker.setMap(null);
    }

    // 创建当前位置标记
    this.currentLocationMarker = new AMap.Marker({
      position: [location.lng, location.lat],
      icon: new AMap.Icon({
        size: new AMap.Size(32, 32),
        image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
        imageSize: new AMap.Size(32, 32)
      }),
      title: '我的位置',
      zIndex: 200
    });

    this.currentLocationMarker.setMap(this.map);
    this.map.setCenter([location.lng, location.lat]);
  }

  /**
   * 清除所有标记
   */
  clearMarkers(): void {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
  }

  /**
   * 导航到目标位置（步行）
   */
  navigateWalking(destination: Location): Promise<NavigationRoute> {
    return new Promise(async (resolve, reject) => {
      const currentLocation = this._currentLocation.value;
      if (!currentLocation) {
        reject(new Error('请先获取当前位置'));
        return;
      }

      this.walking.search(
        [currentLocation.lng, currentLocation.lat],
        [destination.lng, destination.lat],
        (status: string, result: any) => {
          if (status === 'complete') {
            const route = result.routes[0];
            resolve({
              distance: route.distance,
              duration: route.time,
              steps: route.steps.map((step: any) => ({
                instruction: step.instruction,
                distance: step.distance,
                duration: step.time,
                path: step.path
              }))
            });
          } else {
            reject(new Error('步行路线规划失败'));
          }
        }
      );
    });
  }

  /**
   * 导航到目标位置（驾车）
   */
  navigateDriving(destination: Location): Promise<NavigationRoute> {
    return new Promise(async (resolve, reject) => {
      const currentLocation = this._currentLocation.value;
      if (!currentLocation) {
        reject(new Error('请先获取当前位置'));
        return;
      }

      this.driving.search(
        [currentLocation.lng, currentLocation.lat],
        [destination.lng, destination.lat],
        (status: string, result: any) => {
          if (status === 'complete') {
            const route = result.routes[0];
            resolve({
              distance: route.distance,
              duration: route.time,
              steps: route.steps.map((step: any) => ({
                instruction: step.instruction,
                distance: step.distance,
                duration: step.time,
                path: step.path
              }))
            });
          } else {
            reject(new Error('驾车路线规划失败'));
          }
        }
      );
    });
  }

  /**
   * 在地图上绘制导航路线
   */
  drawNavigationRoute(route: NavigationRoute, type: 'walking' | 'driving' = 'walking'): void {
    if (!this.map) return;

    // 合并所有步骤的路径点
    const path: any[] = [];
    route.steps.forEach(step => {
      step.path.forEach((point: any) => {
        path.push([point.lng || point[0], point.lat || point[1]]);
      });
    });

    // 绘制路线
    const polyline = new AMap.Polyline({
      path: path,
      strokeColor: type === 'walking' ? '#4CAF50' : '#2196F3',
      strokeWeight: 6,
      strokeOpacity: 0.8
    });

    polyline.setMap(this.map);
    this.map.setFitView([polyline]);
  }

  /**
   * 打开高德地图App导航
   */
  openAmapNavigation(destination: Location, destName: string): void {
    const currentLocation = this._currentLocation.value;
    
    let url: string;
    if (currentLocation) {
      // 有当前位置，从当前位置导航
      url = `https://uri.amap.com/navigation?from=${currentLocation.lng},${currentLocation.lat},我的位置&to=${destination.lng},${destination.lat},${encodeURIComponent(destName)}&mode=walk&callnative=1`;
    } else {
      // 无当前位置，只打开目的地
      url = `https://uri.amap.com/marker?position=${destination.lng},${destination.lat}&name=${encodeURIComponent(destName)}&callnative=1`;
    }
    
    window.open(url, '_blank');
  }

  /**
   * 地址转坐标（地理编码）
   */
  geocode(address: string): Promise<Location> {
    return new Promise((resolve, reject) => {
      this.geocoder.getLocation(address, (status: string, result: any) => {
        if (status === 'complete' && result.geocodes.length > 0) {
          const geo = result.geocodes[0];
          resolve({
            lng: geo.location.lng,
            lat: geo.location.lat,
            address: geo.formattedAddress,
            city: geo.addressComponent.city,
            district: geo.addressComponent.district
          });
        } else {
          reject(new Error('地址解析失败'));
        }
      });
    });
  }

  /**
   * 坐标转地址（逆地理编码）
   */
  reverseGeocode(location: Location): Promise<string> {
    return new Promise((resolve, reject) => {
      this.geocoder.getAddress([location.lng, location.lat], (status: string, result: any) => {
        if (status === 'complete' && result.regeocode) {
          resolve(result.regeocode.formattedAddress);
        } else {
          reject(new Error('地址解析失败'));
        }
      });
    });
  }

  /**
   * 获取地图实例
   */
  getMap(): any {
    return this.map;
  }

  /**
   * 销毁地图
   */
  destroyMap(): void {
    if (this.map) {
      this.clearMarkers();
      if (this.currentLocationMarker) {
        this.currentLocationMarker.setMap(null);
      }
      this.map.destroy();
      this.map = null;
    }
  }
}
