import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Device {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline' | 'maintenance' | 'warning';
  location: string;
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
export class DeviceManagement {
  searchQuery = '';
  selectedDevice: Device | null = null;
  showDetailModal = false;
  filterStatus: string = 'all';

  devices: Device[] = [
    {
      id: 'DEV-001',
      name: '智能分拣机A1',
      type: '分拣设备',
      status: 'online',
      location: '朝阳区回收站',
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
      runningTime: 980,
      processedVolume: 6200,
      lastMaintenance: '2023-05-01',
      nextMaintenance: '2023-06-01',
      efficiency: 0,
      temperature: 28,
      pressure: 0
    }
  ];

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

  constructor() {}
}
