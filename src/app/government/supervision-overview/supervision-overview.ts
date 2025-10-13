import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Warning {
  id: string;
  type: 'violation' | 'anomaly' | 'complaint';
  title: string;
  area: string;
  time: string;
  level: 'high' | 'medium' | 'low';
  status: 'pending' | 'processing' | 'resolved';
}

interface AreaData {
  name: string;
  status: 'good' | 'warning' | 'critical';
  recycleVolume: number;
  accuracy: number;
}

@Component({
  selector: 'app-supervision-overview',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './supervision-overview.html',
  styleUrl: './supervision-overview.scss'
})
export class SupervisionOverview {
  mapLayer: 'sites' | 'compliance' | 'policy' = 'sites';
  showWarningDetailModal = false;
  showAreaDetailModal = false;
  selectedWarning: Warning | null = null;
  selectedArea: AreaData | null = null;
  
  // 核心指标
  indicators = {
    todayRecycle: 45680,
    accuracyRate: 92.5,
    carbonReduction: 1250,
    trend: {
      recycle: '+12%',
      accuracy: '+2.5%',
      carbon: '+8%'
    }
  };

  // 区域数据
  areas: AreaData[] = [
    { name: '朝阳区', status: 'good', recycleVolume: 12500, accuracy: 95 },
    { name: '海淀区', status: 'warning', recycleVolume: 10200, accuracy: 88 },
    { name: '西城区', status: 'good', recycleVolume: 8900, accuracy: 93 },
    { name: '东城区', status: 'critical', recycleVolume: 7800, accuracy: 76 },
    { name: '丰台区', status: 'good', recycleVolume: 6280, accuracy: 91 }
  ];

  // 预警列表
  warnings: Warning[] = [
    {
      id: 'W001',
      type: 'violation',
      title: '某企业未按规定分类处理',
      area: '朝阳区',
      time: '10分钟前',
      level: 'high',
      status: 'pending'
    },
    {
      id: 'W002',
      type: 'anomaly',
      title: '海淀区回收量异常下降',
      area: '海淀区',
      time: '30分钟前',
      level: 'medium',
      status: 'processing'
    },
    {
      id: 'W003',
      type: 'complaint',
      title: '居民投诉回收点脏乱',
      area: '西城区',
      time: '1小时前',
      level: 'low',
      status: 'processing'
    },
    {
      id: 'W004',
      type: 'violation',
      title: '东城区企业超标排放',
      area: '东城区',
      time: '2小时前',
      level: 'high',
      status: 'pending'
    }
  ];

  get pendingWarnings(): number {
    return this.warnings.filter(w => w.status === 'pending').length;
  }

  get highLevelWarnings(): number {
    return this.warnings.filter(w => w.level === 'high').length;
  }

  switchMapLayer(layer: 'sites' | 'compliance' | 'policy'): void {
    this.mapLayer = layer;
  }

  getWarningIcon(type: string): string {
    const icons: {[key: string]: string} = {
      'violation': 'fa-exclamation-circle',
      'anomaly': 'fa-chart-line',
      'complaint': 'fa-comment-alt'
    };
    return icons[type] || 'fa-bell';
  }

  getWarningTypeText(type: string): string {
    const types: {[key: string]: string} = {
      'violation': '违规事件',
      'anomaly': '异常波动',
      'complaint': '公众投诉'
    };
    return types[type] || type;
  }

  getStatusText(status: string): string {
    const statusMap: {[key: string]: string} = {
      'pending': '待处理',
      'processing': '处理中',
      'resolved': '已解决'
    };
    return statusMap[status] || status;
  }

  getLevelClass(level: string): string {
    return `level-${level}`;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  getAreaStatusClass(status: string): string {
    return `area-${status}`;
  }

  viewWarningDetail(warning: Warning): void {
    this.selectedWarning = warning;
    this.showWarningDetailModal = true;
  }

  closeWarningDetail(): void {
    this.showWarningDetailModal = false;
    this.selectedWarning = null;
  }

  viewAreaDetail(area: AreaData): void {
    this.selectedArea = area;
    this.showAreaDetailModal = true;
  }

  closeAreaDetail(): void {
    this.showAreaDetailModal = false;
    this.selectedArea = null;
  }

  handleWarning(warning: Warning): void {
    if (confirm(`确定要处理预警 "${warning.title}" 吗？`)) {
      warning.status = 'processing';
      alert('预警已标记为处理中');
    }
  }

  resolveWarning(warning: Warning): void {
    if (confirm(`确定要解决预警 "${warning.title}" 吗？`)) {
      warning.status = 'resolved';
      alert('预警已标记为已解决');
    }
  }

  goToAIAssistant(): void {
    this.router.navigate(['/government/ai-decision-assistant']);
  }

  constructor(private router: Router) {}
}
