import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AmapService } from '../../core/services/amap.service';

// 声明高德地图全局变量
declare const AMap: any;

interface Device {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline' | 'maintenance' | 'warning';
  location: string;
  coordinates?: [number, number]; // [经度, 纬度]
  runningTime: number;
  processedVolume: number;
  lastMaintenance: string;
  nextMaintenance: string;
  efficiency: number;
  temperature?: number;
  pressure?: number;
}

@Component({
  selector: 'app-device-management',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './device-management.html',
  styleUrl: './device-management.scss'
})
export class DeviceManagement implements OnInit, AfterViewInit, OnDestroy {
  searchQuery = '';
  selectedDevice: Device | null = null;
  showDetailModal = false;
  filterStatus: string = 'all';
  
  // 地图相关
  viewMode: 'list' | 'map' = 'list';
  private map: any = null;
  private markers: any[] = [];
  private infoWindow: any = null;

  constructor(private amapService: AmapService) {}

  devices: Device[] = [
    {
      id: 'DEV-001',
      name: '智能分拣机A1',
      type: '分拣设备',
      status: 'online',
      location: '朝阳区回收站',
      coordinates: [116.481028, 39.989643],
      runningTime: 2340,
      processedVolume: 15800,
      lastMaintenance: '2023-05-10',
      nextMaintenance: '2023-06-10',
      efficiency: 95,
      temperature: 45,
      pressure: 1.2
    },
    {
      id: 'DEV-002',
      name: '压缩打包机B2',
      type: '压缩设备',
      status: 'online',
      location: '海淀区回收站',
      coordinates: [116.310003, 39.991957],
      runningTime: 1890,
      processedVolume: 12500,
      lastMaintenance: '2023-05-15',
      nextMaintenance: '2023-06-15',
      efficiency: 88,
      temperature: 52,
      pressure: 2.5
    },
    {
      id: 'DEV-003',
      name: '塑料粉碎机C1',
      type: '粉碎设备',
      status: 'warning',
      location: '朝阳区回收站',
      coordinates: [116.481028, 39.989643],
      runningTime: 3200,
      processedVolume: 18900,
      lastMaintenance: '2023-04-20',
      nextMaintenance: '2023-05-20',
      efficiency: 72,
      temperature: 68,
      pressure: 1.8
    },
    {
      id: 'DEV-004',
      name: '金属分选机D3',
      type: '分选设备',
      status: 'maintenance',
      location: '西城区回收站',
      coordinates: [116.366794, 39.915309],
      runningTime: 1520,
      processedVolume: 8600,
      lastMaintenance: '2023-05-18',
      nextMaintenance: '2023-06-18',
      efficiency: 0,
      temperature: 25,
      pressure: 0
    },
    {
      id: 'DEV-005',
      name: '纸张打包机E1',
      type: '打包设备',
      status: 'offline',
      location: '东城区回收站',
      coordinates: [116.418757, 39.917544],
      runningTime: 980,
      processedVolume: 6200,
      lastMaintenance: '2023-05-01',
      nextMaintenance: '2023-06-01',
      efficiency: 0,
      temperature: 28,
      pressure: 0
    }
  ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // 地图将在切换到地图视图时初始化
  }

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
      this.map = new AMap.Map('device-map-container', {
        zoom: 12,
        center: [116.397428, 39.90923], // 北京中心
        viewMode: '2D',
        resizeEnable: true
      });

      // 添加控件
      AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], () => {
        this.map.addControl(new AMap.ToolBar({ position: 'RB' }));
        this.map.addControl(new AMap.Scale({ position: 'LB' }));
      });

      // 添加设备标记
      this.addDeviceMarkers();
    } catch (error) {
      console.error('初始化地图失败:', error);
    }
  }

  // 添加设备标记
  private addDeviceMarkers(): void {
    this.clearMarkers();

    this.devices.forEach(device => {
      if (!device.coordinates) return;

      const marker = new AMap.Marker({
        position: new AMap.LngLat(device.coordinates[0], device.coordinates[1]),
        title: device.name,
        icon: this.getDeviceIcon(device.status),
        offset: new AMap.Pixel(-15, -30)
      });

      marker.on('click', () => {
        this.showDeviceInfoWindow(device, marker);
      });

      this.map.add(marker);
      this.markers.push(marker);
    });

    // 自动调整视野
    if (this.markers.length > 0) {
      this.map.setFitView(this.markers);
    }
  }

  // 获取设备图标
  private getDeviceIcon(status: string): any {
    const colors: { [key: string]: string } = {
      'online': '#4CAF50',
      'offline': '#9E9E9E',
      'maintenance': '#2196F3',
      'warning': '#FF9800'
    };
    const color = colors[status] || '#9E9E9E';

    return new AMap.Icon({
      size: new AMap.Size(30, 40),
      image: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 30 40">
          <path d="M15 0C6.716 0 0 6.716 0 15c0 8.284 15 25 15 25s15-16.716 15-25C30 6.716 23.284 0 15 0z" fill="${color}"/>
          <circle cx="15" cy="15" r="8" fill="white"/>
          <text x="15" y="19" text-anchor="middle" font-size="12" fill="${color}">⚙</text>
        </svg>
      `)}`,
      imageSize: new AMap.Size(30, 40)
    });
  }

  // 显示设备信息窗口
  private showDeviceInfoWindow(device: Device, marker: any): void {
    if (this.infoWindow) {
      this.infoWindow.close();
    }

    const content = `
      <div style="padding: 10px; min-width: 200px;">
        <h4 style="margin: 0 0 10px; color: #333;">${device.name}</h4>
        <p style="margin: 5px 0; font-size: 13px; color: #666;">
          <strong>编号:</strong> ${device.id}
        </p>
        <p style="margin: 5px 0; font-size: 13px; color: #666;">
          <strong>类型:</strong> ${device.type}
        </p>
        <p style="margin: 5px 0; font-size: 13px; color: #666;">
          <strong>位置:</strong> ${device.location}
        </p>
        <p style="margin: 5px 0; font-size: 13px; color: #666;">
          <strong>状态:</strong> 
          <span style="color: ${this.getStatusColor(device.status)};">${this.getStatusText(device.status)}</span>
        </p>
        <p style="margin: 5px 0; font-size: 13px; color: #666;">
          <strong>效率:</strong> ${device.efficiency}%
        </p>
        <button onclick="window.dispatchEvent(new CustomEvent('openDeviceDetail', {detail: '${device.id}'}))" 
                style="margin-top: 10px; padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
          查看详情
        </button>
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
      'online': '#4CAF50',
      'offline': '#9E9E9E',
      'maintenance': '#2196F3',
      'warning': '#FF9800'
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

  // 在地图上定位设备
  locateDeviceOnMap(device: Device): void {
    if (!device.coordinates) return;
    
    this.viewMode = 'map';
    setTimeout(() => {
      if (!this.map) {
        this.initMap();
      }
      this.map.setZoomAndCenter(15, device.coordinates);
      
      // 找到对应的标记并显示信息窗口
      const marker = this.markers.find(m => {
        const pos = m.getPosition();
        return pos.lng === device.coordinates![0] && pos.lat === device.coordinates![1];
      });
      if (marker) {
        this.showDeviceInfoWindow(device, marker);
      }
    }, 150);
  }

  get deviceStats() {
    return {
      total: this.devices.length,
      online: this.devices.filter(d => d.status === 'online').length,
      offline: this.devices.filter(d => d.status === 'offline').length,
      maintenance: this.devices.filter(d => d.status === 'maintenance').length,
      warning: this.devices.filter(d => d.status === 'warning').length
    };
  }

  get filteredDevices(): Device[] {
    let filtered = this.devices;
    
    if (this.filterStatus !== 'all') {
      filtered = filtered.filter(d => d.status === this.filterStatus);
    }
    
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(d => 
        d.name.toLowerCase().includes(query) ||
        d.id.toLowerCase().includes(query) ||
        d.location.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }

  getStatusText(status: string): string {
    const statusMap: {[key: string]: string} = {
      'online': '运行中',
      'offline': '离线',
      'maintenance': '维护中',
      'warning': '预警'
    };
    return statusMap[status] || status;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  openDeviceDetail(device: Device): void {
    this.selectedDevice = device;
    this.showDetailModal = true;
  }

  closeDeviceDetail(): void {
    this.showDetailModal = false;
    this.selectedDevice = null;
  }

  startMaintenance(device: Device, event?: Event): void {
    if (event) event.stopPropagation();
    if (confirm(`确定要对设备 ${device.name} 进行维护吗？`)) {
      device.status = 'maintenance';
      alert('设备已进入维护状态');
    }
  }

  reportIssue(device: Device, event?: Event): void {
    if (event) event.stopPropagation();
    alert(`报修设备: ${device.name}\n请描述具体问题...`);
  }

  viewARGuide(device: Device, event?: Event): void {
    if (event) event.stopPropagation();
    alert(`正在启动AR参数调节指引...\n设备: ${device.name}`);
  }

  setFilter(status: string): void {
    this.filterStatus = status;
  }

}
