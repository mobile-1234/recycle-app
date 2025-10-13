import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface LocationData {
  id: string;
  name: string;
  type: 'community' | 'mall' | 'school' | 'office';
  wasteVolume: number;
  recycleVolume: number;
  capacity: number;
  status: 'normal' | 'warning' | 'critical';
  lastUpdate: string;
}

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

@Component({
  selector: 'app-data-reports',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './data-reports.html',
  styleUrl: './data-reports.scss'
})
export class DataReports {
  reportType: 'business' | 'environmental' | 'government' = 'business';
  timeRange: 'today' | 'week' | 'month' | 'year' = 'month';
  showMonitorModal = false;

  // 地点监控数据
  locations: LocationData[] = [
    {
      id: 'LOC-001',
      name: '望京社区A区',
      type: 'community',
      wasteVolume: 850,
      recycleVolume: 680,
      capacity: 1000,
      status: 'warning',
      lastUpdate: '2分钟前'
    },
    {
      id: 'LOC-002',
      name: '朝阳大悦城',
      type: 'mall',
      wasteVolume: 920,
      recycleVolume: 750,
      capacity: 1000,
      status: 'critical',
      lastUpdate: '5分钟前'
    },
    {
      id: 'LOC-003',
      name: '中关村创业大街',
      type: 'office',
      wasteVolume: 450,
      recycleVolume: 380,
      capacity: 1000,
      status: 'normal',
      lastUpdate: '10分钟前'
    },
    {
      id: 'LOC-004',
      name: '北京实验学校',
      type: 'school',
      wasteVolume: 680,
      recycleVolume: 580,
      capacity: 1000,
      status: 'normal',
      lastUpdate: '15分钟前'
    },
    {
      id: 'LOC-005',
      name: '国贸CBD商圈',
      type: 'mall',
      wasteVolume: 950,
      recycleVolume: 820,
      capacity: 1000,
      status: 'critical',
      lastUpdate: '3分钟前'
    },
    {
      id: 'LOC-006',
      name: '海淀区社区B区',
      type: 'community',
      wasteVolume: 720,
      recycleVolume: 600,
      capacity: 1000,
      status: 'normal',
      lastUpdate: '8分钟前'
    }
  ];

  // 报表数据
  get businessData(): ChartData[] {
    return [
      { label: '纸类', value: 35, color: '#3498db' },
      { label: '塑料', value: 28, color: '#2ecc71' },
      { label: '金属', value: 18, color: '#f39c12' },
      { label: '玻璃', value: 12, color: '#9b59b6' },
      { label: '其他', value: 7, color: '#95a5a6' }
    ];
  }

  get environmentalData(): ChartData[] {
    return [
      { label: '碳减排', value: 1250, color: '#2ecc71' },
      { label: '节水量', value: 3200, color: '#3498db' },
      { label: '节电量', value: 5800, color: '#f39c12' }
    ];
  }

  get criticalLocations(): LocationData[] {
    return this.locations.filter(loc => loc.status === 'critical');
  }

  get warningLocations(): LocationData[] {
    return this.locations.filter(loc => loc.status === 'warning');
  }

  getLocationIcon(type: string): string {
    const icons: {[key: string]: string} = {
      'community': '🏘️',
      'mall': '🏬',
      'school': '🏫',
      'office': '🏢'
    };
    return icons[type] || '📍';
  }

  getStatusText(status: string): string {
    const statusMap: {[key: string]: string} = {
      'normal': '正常',
      'warning': '预警',
      'critical': '严重'
    };
    return statusMap[status] || status;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  getCapacityPercent(location: LocationData): number {
    return Math.round((location.wasteVolume / location.capacity) * 100);
  }

  openMonitorView(): void {
    this.showMonitorModal = true;
  }

  closeMonitorView(): void {
    this.showMonitorModal = false;
  }

  dispatchWorkers(location: LocationData): void {
    alert(`正在为 ${location.name} 派遣回收人员...\n当前垃圾量: ${location.wasteVolume}kg`);
  }

  exportReport(format: string): void {
    alert(`正在导出${format.toUpperCase()}格式报表...`);
  }

  submitToGov(): void {
    if (confirm('确定要提交政府申报报表吗？')) {
      alert('报表已成功提交！');
    }
  }

  constructor() {}
}
