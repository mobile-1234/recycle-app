import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AmapService } from '../../core/services/amap.service';
import { BusinessApiService } from '../../core/services/business-api.service';

// 声明高德地图全局变量
declare const AMap: any;

interface LocationData {
  id: string;
  name: string;
  type: 'community' | 'mall' | 'school' | 'office';
  wasteVolume: number;
  recycleVolume: number;
  capacity: number;
  status: 'normal' | 'warning' | 'critical';
  lastUpdate: string;
  coordinates?: [number, number]; // [经度, 纬度]
}

interface ChartData {
  label: string;
  value: number;
  color?: string;
}

interface StatCard {
  title: string;
  value: string;
  unit: string;
  trend: number;
  icon: string;
  color: string;
}

interface TrendData {
  date: string;
  value: number;
}

@Component({
  selector: 'app-data-reports',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgIf, NgFor],
  templateUrl: './data-reports.html',
  styleUrl: './data-reports.scss'
})
export class DataReports implements OnInit, AfterViewInit, OnDestroy {
  reportType: 'business' | 'environmental' | 'government' = 'business';
  timeRange: 'today' | 'week' | 'month' | 'year' = 'month';
  showMonitorModal = false;
  currentNav = 'reports'; // 当前导航项
  showCompareModal = false; // 数据对比弹窗
  compareTimeRange: 'today' | 'week' | 'month' | 'year' = 'week'; // 对比时间范围

  // 地图相关
  showMapModal = false;
  private map: any = null;
  private markers: any[] = [];
  private infoWindow: any = null;
  mapLoadError = false;
  mapLoading = false;

  // AI图表生成相关
  showAIModal = false;
  aiPrompt = '';
  aiGenerating = false;
  aiChartData: any = null;
  aiChartType: 'bar' | 'line' | 'pie' | 'area' = 'bar';
  aiAnalysisResult = '';

  // AI分析来源标识
  isRealAI = false;
  aiNote = '';

  constructor(
    private router: Router, 
    private amapService: AmapService,
    private businessApi: BusinessApiService
  ) {}

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
      lastUpdate: '2分钟前',
      coordinates: [116.480983, 40.002102]
    },
    {
      id: 'LOC-002',
      name: '朝阳大悦城',
      type: 'mall',
      wasteVolume: 920,
      recycleVolume: 750,
      capacity: 1000,
      status: 'critical',
      lastUpdate: '5分钟前',
      coordinates: [116.468695, 39.928255]
    },
    {
      id: 'LOC-003',
      name: '中关村创业大街',
      type: 'office',
      wasteVolume: 450,
      recycleVolume: 380,
      capacity: 1000,
      status: 'normal',
      lastUpdate: '10分钟前',
      coordinates: [116.310003, 39.984154]
    },
    {
      id: 'LOC-004',
      name: '北京实验学校',
      type: 'school',
      wasteVolume: 680,
      recycleVolume: 580,
      capacity: 1000,
      status: 'normal',
      lastUpdate: '15分钟前',
      coordinates: [116.352792, 39.945428]
    },
    {
      id: 'LOC-005',
      name: '国贸CBD商圈',
      type: 'mall',
      wasteVolume: 950,
      recycleVolume: 820,
      capacity: 1000,
      status: 'critical',
      lastUpdate: '3分钟前',
      coordinates: [116.461937, 39.909175]
    },
    {
      id: 'LOC-006',
      name: '海淀区社区B区',
      type: 'community',
      wasteVolume: 720,
      recycleVolume: 600,
      capacity: 1000,
      status: 'normal',
      lastUpdate: '8分钟前',
      coordinates: [116.298566, 39.959912]
    }
  ];

  ngOnInit() {
    // 初始化数据
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.destroyMap();
  }

  // 打开地图监控弹窗
  openMapMonitor(): void {
    this.showMapModal = true;
    this.mapLoadError = false;
    this.mapLoading = true;
    setTimeout(() => this.initMap(), 300);
  }

  // 关闭地图监控弹窗
  closeMapMonitor(): void {
    this.showMapModal = false;
    this.destroyMap();
  }

  // 初始化地图
  private initMap(): void {
    if (this.map) {
      this.mapLoading = false;
      return;
    }

    const container = document.getElementById('location-map-container');
    if (!container) {
      console.error('地图容器不存在');
      this.mapLoadError = true;
      this.mapLoading = false;
      return;
    }

    // 确保容器有尺寸
    container.style.width = '100%';
    container.style.height = '350px';

    try {
      // 检查AMap是否已加载
      if (typeof AMap === 'undefined') {
        console.error('高德地图API未加载');
        this.mapLoadError = true;
        this.mapLoading = false;
        return;
      }

      this.map = new AMap.Map('location-map-container', {
        zoom: 11,
        center: [116.397428, 39.90923],
        viewMode: '2D',
        resizeEnable: true
      });

      this.map.on('complete', () => {
        this.mapLoading = false;
        this.addLocationMarkers();
      });

      AMap.plugin(['AMap.ToolBar', 'AMap.Scale'], () => {
        if (this.map) {
          this.map.addControl(new AMap.ToolBar({ position: 'RB' }));
          this.map.addControl(new AMap.Scale({ position: 'LB' }));
        }
      });
    } catch (error) {
      console.error('初始化地图失败:', error);
      this.mapLoadError = true;
      this.mapLoading = false;
    }
  }

  // 添加监控点标记
  private addLocationMarkers(): void {
    this.clearMarkers();

    this.locations.forEach(location => {
      if (!location.coordinates) return;

      const marker = new AMap.Marker({
        position: new AMap.LngLat(location.coordinates[0], location.coordinates[1]),
        title: location.name,
        icon: this.getLocationMarkerIcon(location.status),
        offset: new AMap.Pixel(-15, -30)
      });

      marker.on('click', () => {
        this.showLocationInfoWindow(location, marker);
      });

      this.map.add(marker);
      this.markers.push(marker);
    });

    if (this.markers.length > 0) {
      this.map.setFitView(this.markers);
    }
  }

  // 获取监控点图标
  private getLocationMarkerIcon(status: string): any {
    const colors: { [key: string]: string } = {
      'normal': '#4CAF50',
      'warning': '#FF9800',
      'critical': '#F44336'
    };
    const color = colors[status] || '#9E9E9E';

    return new AMap.Icon({
      size: new AMap.Size(30, 40),
      image: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 30 40">
          <path d="M15 0C6.716 0 0 6.716 0 15c0 8.284 15 25 15 25s15-16.716 15-25C30 6.716 23.284 0 15 0z" fill="${color}"/>
          <circle cx="15" cy="15" r="8" fill="white"/>
          <text x="15" y="19" text-anchor="middle" font-size="10" fill="${color}">📍</text>
        </svg>
      `)}`,
      imageSize: new AMap.Size(30, 40)
    });
  }

  // 显示监控点信息窗口
  private showLocationInfoWindow(location: LocationData, marker: any): void {
    if (this.infoWindow) {
      this.infoWindow.close();
    }

    const usagePercent = Math.round((location.wasteVolume / location.capacity) * 100);
    const content = `
      <div style="padding: 10px; min-width: 200px;">
        <h4 style="margin: 0 0 10px; color: #333;">${this.getLocationIcon(location.type)} ${location.name}</h4>
        <p style="margin: 5px 0; font-size: 13px; color: #666;">
          <strong>废品量:</strong> ${location.wasteVolume}kg / ${location.capacity}kg (${usagePercent}%)
        </p>
        <p style="margin: 5px 0; font-size: 13px; color: #666;">
          <strong>回收量:</strong> ${location.recycleVolume}kg
        </p>
        <p style="margin: 5px 0; font-size: 13px; color: #666;">
          <strong>状态:</strong> 
          <span style="color: ${this.getStatusColor(location.status)};">${this.getStatusText(location.status)}</span>
        </p>
        <p style="margin: 5px 0; font-size: 12px; color: #999;">
          更新: ${location.lastUpdate}
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
      'normal': '#4CAF50',
      'warning': '#FF9800',
      'critical': '#F44336'
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

  // 根据时间范围获取统计卡片数据
  get statsCards(): StatCard[] {
    const dataMap = {
      today: [
        { title: '今日回收量', value: '2.8', unit: '吨', trend: 12, icon: '📦', color: '#4CAF50' },
        { title: '今日收入', value: '15,680', unit: '元', trend: 8, icon: '💰', color: '#2196F3' },
        { title: '今日订单', value: '156', unit: '单', trend: -3, icon: '📋', color: '#FF9800' },
        { title: '今日用户', value: '89', unit: '人', trend: 15, icon: '👥', color: '#9C27B0' }
      ],
      week: [
        { title: '本周回收量', value: '18.5', unit: '吨', trend: 18, icon: '📦', color: '#4CAF50' },
        { title: '本周收入', value: '98,450', unit: '元', trend: 22, icon: '💰', color: '#2196F3' },
        { title: '本周订单', value: '1,024', unit: '单', trend: 12, icon: '📋', color: '#FF9800' },
        { title: '本周用户', value: '567', unit: '人', trend: 28, icon: '👥', color: '#9C27B0' }
      ],
      month: [
        { title: '本月回收量', value: '75.2', unit: '吨', trend: 25, icon: '📦', color: '#4CAF50' },
        { title: '本月收入', value: '425,800', unit: '元', trend: 32, icon: '💰', color: '#2196F3' },
        { title: '本月订单', value: '4,386', unit: '单', trend: 18, icon: '📋', color: '#FF9800' },
        { title: '本月用户', value: '2,145', unit: '人', trend: 42, icon: '👥', color: '#9C27B0' }
      ],
      year: [
        { title: '本年回收量', value: '856', unit: '吨', trend: 38, icon: '📦', color: '#4CAF50' },
        { title: '本年收入', value: '4.85', unit: '百万', trend: 45, icon: '💰', color: '#2196F3' },
        { title: '本年订单', value: '48,562', unit: '单', trend: 35, icon: '📋', color: '#FF9800' },
        { title: '本年用户', value: '18,945', unit: '人', trend: 52, icon: '👥', color: '#9C27B0' }
      ]
    };
    return dataMap[this.timeRange];
  }

  // 根据时间范围获取趋势数据
  get trendData(): TrendData[] {
    const dataMap = {
      today: [
        { date: '00:00', value: 120 },
        { date: '04:00', value: 80 },
        { date: '08:00', value: 280 },
        { date: '12:00', value: 450 },
        { date: '16:00', value: 380 },
        { date: '20:00', value: 320 },
        { date: '23:59', value: 280 }
      ],
      week: [
        { date: '周一', value: 2100 },
        { date: '周二', value: 2450 },
        { date: '周三', value: 2800 },
        { date: '周四', value: 2650 },
        { date: '周五', value: 3100 },
        { date: '周六', value: 2900 },
        { date: '周日', value: 2500 }
      ],
      month: [
        { date: '1-5日', value: 12500 },
        { date: '6-10日', value: 14200 },
        { date: '11-15日', value: 15800 },
        { date: '16-20日', value: 16500 },
        { date: '21-25日', value: 17200 },
        { date: '26-30日', value: 18600 }
      ],
      year: [
        { date: '1月', value: 65000 },
        { date: '2月', value: 58000 },
        { date: '3月', value: 72000 },
        { date: '4月', value: 68000 },
        { date: '5月', value: 75000 },
        { date: '6月', value: 82000 },
        { date: '7月', value: 88000 },
        { date: '8月', value: 85000 },
        { date: '9月', value: 78000 },
        { date: '10月', value: 92000 },
        { date: '11月', value: 0 },
        { date: '12月', value: 0 }
      ]
    };
    return dataMap[this.timeRange];
  }

  // 获取品类分布数据（根据时间范围）
  get categoryData(): ChartData[] {
    const dataMap = {
      today: [
        { label: '纸类', value: 980, color: '#3498db' },
        { label: '塑料', value: 750, color: '#2ecc71' },
        { label: '金属', value: 520, color: '#f39c12' },
        { label: '玻璃', value: 380, color: '#9b59b6' },
        { label: '其他', value: 170, color: '#95a5a6' }
      ],
      week: [
        { label: '纸类', value: 6500, color: '#3498db' },
        { label: '塑料', value: 5200, color: '#2ecc71' },
        { label: '金属', value: 3600, color: '#f39c12' },
        { label: '玻璃', value: 2100, color: '#9b59b6' },
        { label: '其他', value: 1100, color: '#95a5a6' }
      ],
      month: [
        { label: '纸类', value: 26300, color: '#3498db' },
        { label: '塑料', value: 21000, color: '#2ecc71' },
        { label: '金属', value: 13500, color: '#f39c12' },
        { label: '玻璃', value: 9000, color: '#9b59b6' },
        { label: '其他', value: 5400, color: '#95a5a6' }
      ],
      year: [
        { label: '纸类', value: 299600, color: '#3498db' },
        { label: '塑料', value: 239700, color: '#2ecc71' },
        { label: '金属', value: 154100, color: '#f39c12' },
        { label: '玻璃', value: 102700, color: '#9b59b6' },
        { label: '其他', value: 59900, color: '#95a5a6' }
      ]
    };
    return dataMap[this.timeRange];
  }

  // 获取环保数据
  get environmentalData(): ChartData[] {
    const dataMap = {
      today: [
        { label: '碳减排', value: 42, color: '#2ecc71' },
        { label: '节水量', value: 156, color: '#3498db' },
        { label: '节电量', value: 238, color: '#f39c12' }
      ],
      week: [
        { label: '碳减排', value: 285, color: '#2ecc71' },
        { label: '节水量', value: 1050, color: '#3498db' },
        { label: '节电量', value: 1620, color: '#f39c12' }
      ],
      month: [
        { label: '碳减排', value: 1250, color: '#2ecc71' },
        { label: '节水量', value: 4600, color: '#3498db' },
        { label: '节电量', value: 7100, color: '#f39c12' }
      ],
      year: [
        { label: '碳减排', value: 14250, color: '#2ecc71' },
        { label: '节水量', value: 52400, color: '#3498db' },
        { label: '节电量', value: 80900, color: '#f39c12' }
      ]
    };
    return dataMap[this.timeRange];
  }

  // 获取时间范围标题
  get timeRangeTitle(): string {
    const titleMap = {
      today: '今日',
      week: '本周',
      month: '本月',
      year: '本年'
    };
    return titleMap[this.timeRange];
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

  // 计算品类占比
  getCategoryPercent(value: number): number {
    const total = this.categoryData.reduce((sum, item) => sum + item.value, 0);
    return Math.round((value / total) * 100);
  }

  // 获取趋势最大值（用于图表缩放）
  get maxTrendValue(): number {
    return Math.max(...this.trendData.map(d => d.value));
  }

  // 计算趋势图高度百分比
  getTrendHeight(value: number): number {
    return (value / this.maxTrendValue) * 100;
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
    if (format === 'excel') {
      this.exportToExcel();
    } else if (format === 'pdf') {
      this.exportToPDF();
    } else if (format === 'gov') {
      this.exportGovReport();
    }
  }

  // 导出Excel
  private exportToExcel(): void {
    const ws_data = [
      ['数据报表 - ' + this.timeRangeTitle],
      [],
      ['统计指标', '数值', '单位', '趋势'],
      ...this.statsCards.map(card => [card.title, card.value, card.unit, `${card.trend > 0 ? '+' : ''}${card.trend}%`]),
      [],
      ['品类分布', '重量', '占比'],
      ...this.categoryData.map(item => [item.label, `${item.value}kg`, `${this.getCategoryPercent(item.value)}%`]),
      [],
      ['环保数据', '数值', '单位'],
      ...this.environmentalData.map(item => {
        const unit = item.label === '碳减排' ? 'kg CO₂' : item.label === '节水量' ? '升' : '度';
        return [item.label, item.value, unit];
      })
    ];

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '数据报表');
    
    const fileName = `数据报表_${this.timeRangeTitle}_${new Date().getTime()}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    alert('Excel报表导出成功！');
  }

  // 导出PDF
  private exportToPDF(): void {
    const doc = new jsPDF();
    
    // 添加标题（使用英文字体，避免中文乱码）
    doc.setFontSize(16);
    doc.text('Data Report - ' + this.timeRangeTitle, 14, 20);
    
    // 统计卡片数据
    const statsData = this.statsCards.map(card => [
      card.title,
      card.value + ' ' + card.unit,
      (card.trend > 0 ? '+' : '') + card.trend + '%'
    ]);
    
    autoTable(doc, {
      head: [['Statistic', 'Value', 'Trend']],
      body: statsData,
      startY: 30,
      theme: 'grid'
    });
    
    // 品类分布数据
    const categoryDataTable = this.categoryData.map(item => [
      item.label,
      item.value + 'kg',
      this.getCategoryPercent(item.value) + '%'
    ]);
    
    autoTable(doc, {
      head: [['Category', 'Weight', 'Percent']],
      body: categoryDataTable,
      startY: (doc as any).lastAutoTable.finalY + 10,
      theme: 'grid'
    });
    
    // 环保数据
    const envData = this.environmentalData.map(item => {
      const unit = item.label === '碳减排' ? 'kg CO2' : item.label === '节水量' ? 'Liter' : 'kWh';
      return [item.label, item.value + '', unit];
    });
    
    autoTable(doc, {
      head: [['Environmental', 'Value', 'Unit']],
      body: envData,
      startY: (doc as any).lastAutoTable.finalY + 10,
      theme: 'grid'
    });
    
    const fileName = `report_${this.timeRangeTitle}_${new Date().getTime()}.pdf`;
    doc.save(fileName);
    
    alert('PDF报表导出成功！');
  }

  // 导出政府申报表
  private exportGovReport(): void {
    const ws_data = [
      ['政府申报报表 - ' + this.timeRangeTitle],
      [],
      ['申报项目', '数值'],
      ['回收总量', this.statsCards[0].value + this.statsCards[0].unit],
      ['处理率', '95.8%'],
      ['合规率', '100%'],
      ['环保贡献（碳减排）', this.environmentalData[0].value + 'kg CO₂'],
      [],
      ['品类明细', '重量(kg)', '占比'],
      ...this.categoryData.map(item => [item.label, item.value, this.getCategoryPercent(item.value) + '%']),
      [],
      ['环保数据明细', '数值', '单位'],
      ...this.environmentalData.map(item => {
        const unit = item.label === '碳减排' ? 'kg CO₂' : item.label === '节水量' ? '升' : '度';
        return [item.label, item.value, unit];
      }),
      [],
      ['生成时间', new Date().toLocaleString('zh-CN')]
    ];

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '政府申报');
    
    const fileName = `政府申报_${this.timeRangeTitle}_${new Date().getTime()}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    alert('政府申报表导出成功！');
  }

  submitToGov(): void {
    if (confirm(`确定要提交${this.timeRangeTitle}政府申报报表吗？`)) {
      alert('报表已成功提交！');
    }
  }

  // 计算品类总重量（吨）
  get totalCategoryWeight(): number {
    const total = this.categoryData.reduce((sum, item) => sum + item.value, 0);
    return Math.round(total / 100) / 10; // 转换为吨，保留1位小数
  }

  // 计算加工服务收入
  get processingIncome(): string {
    const baseIncome = parseFloat(this.statsCards[1].value.replace(/,/g, ''));
    return Math.round(baseIncome * 0.27).toLocaleString();
  }

  // 计算其他收入
  get otherIncome(): string {
    const baseIncome = parseFloat(this.statsCards[1].value.replace(/,/g, ''));
    return Math.round(baseIncome * 0.10).toLocaleString();
  }

  // Math辅助方法供模板使用
  Math = Math;

  // 导航方法
  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  // 刷新数据
  refreshData(): void {
    // 添加刷新动画效果
    const btn = event?.target as HTMLElement;
    const icon = btn.querySelector('.btn-icon') || btn;
    icon.classList.add('rotating');
    
    setTimeout(() => {
      alert('数据已刷新！最新数据已加载。');
      icon.classList.remove('rotating');
    }, 1000);
  }

  // 切换对比模式
  toggleCompare(): void {
    this.showCompareModal = true;
  }

  // 关闭对比弹窗
  closeCompareModal(): void {
    this.showCompareModal = false;
  }

  // 获取对比数据的统计卡片
  getCompareStatsCards(range: 'today' | 'week' | 'month' | 'year'): any[] {
    const dataMap = {
      today: [
        { title: '今日回收量', value: '2.8', unit: '吨', trend: 12 },
        { title: '今日收入', value: '15,680', unit: '元', trend: 8 },
        { title: '今日订单', value: '156', unit: '单', trend: -3 },
        { title: '今日用户', value: '89', unit: '人', trend: 15 }
      ],
      week: [
        { title: '本周回收量', value: '18.5', unit: '吨', trend: 18 },
        { title: '本周收入', value: '98,450', unit: '元', trend: 22 },
        { title: '本周订单', value: '1,024', unit: '单', trend: 12 },
        { title: '本周用户', value: '567', unit: '人', trend: 28 }
      ],
      month: [
        { title: '本月回收量', value: '75.2', unit: '吨', trend: 25 },
        { title: '本月收入', value: '425,800', unit: '元', trend: 32 },
        { title: '本月订单', value: '4,386', unit: '单', trend: 18 },
        { title: '本月用户', value: '2,145', unit: '人', trend: 42 }
      ],
      year: [
        { title: '本年回收量', value: '856', unit: '吨', trend: 38 },
        { title: '本年收入', value: '4.85', unit: '百万', trend: 45 },
        { title: '本年订单', value: '48,562', unit: '单', trend: 35 },
        { title: '本年用户', value: '18,945', unit: '人', trend: 52 }
      ]
    };
    return dataMap[range];
  }

  // 辅助方法：将字符串转为数字（移除逗号）
  parseValue(value: string): number {
    return parseFloat(value.replace(/,/g, ''));
  }

  // 辅助方法：比较两个值的大小
  isGreater(val1: string, val2: string): boolean {
    return this.parseValue(val1) > this.parseValue(val2);
  }

  isLess(val1: string, val2: string): boolean {
    return this.parseValue(val1) < this.parseValue(val2);
  }

  isEqual(val1: string, val2: string): boolean {
    return this.parseValue(val1) === this.parseValue(val2);
  }

  // 辅助方法：获取差值的箭头
  getDifferenceArrow(currentVal: string, compareVal: string): string {
    if (this.isGreater(currentVal, compareVal)) return '↑';
    if (this.isLess(currentVal, compareVal)) return '↓';
    return '→';
  }

  // 辅助方法：获取差值
  getDifference(currentVal: string, compareVal: string): string {
    const diff = Math.abs(this.parseValue(currentVal) - this.parseValue(compareVal));
    return diff.toLocaleString();
  }

  // 辅助方法：获取增长率
  getGrowthRate(currentVal: string, compareVal: string): string {
    const current = this.parseValue(currentVal);
    const compare = this.parseValue(compareVal);
    if (compare === 0) return '0.0';
    const rate = ((current - compare) / compare * 100);
    return Math.abs(rate).toFixed(1);
  }

  // 辅助方法：获取下降率
  getDeclineRate(currentVal: string, compareVal: string): string {
    const current = this.parseValue(currentVal);
    const compare = this.parseValue(compareVal);
    if (compare === 0) return '0.0';
    const rate = ((compare - current) / compare * 100);
    return Math.abs(rate).toFixed(1);
  }

  // 打开AI分析
  openAIAnalysis(): void {
    if (confirm('是否跳转到AI运营助手进行智能分析？')) {
      this.router.navigate(['/business/ai-operations-assistant']);
    }
  }

  // ==================== AI智能图表生成功能 ====================

  // 打开AI图表生成弹窗
  openAIChartModal(): void {
    this.showAIModal = true;
    this.aiPrompt = '';
    this.aiChartData = null;
    this.aiAnalysisResult = '';
  }

  // 关闭AI图表弹窗
  closeAIChartModal(): void {
    this.showAIModal = false;
  }

  // AI生成图表 - 调用真实后端API
  generateAIChart(): void {
    if (!this.aiPrompt.trim()) {
      alert('请输入分析需求');
      return;
    }

    this.aiGenerating = true;
    this.aiAnalysisResult = '';
    this.isRealAI = false;
    this.aiNote = '';

    // 调用后端AI分析接口
    this.businessApi.aiAnalyze(this.aiPrompt).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          const data = response.data;
          
          // 设置图表类型
          this.aiChartType = data.chartType || 'bar';
          
          // 设置图表数据
          this.aiChartData = data.chartData;
          
          // 设置分析报告
          this.aiAnalysisResult = data.analysis || '';
          
          // 标识是否为真实AI
          this.isRealAI = data.isAI === true;
          this.aiNote = data.aiNote || '';
        }
        this.aiGenerating = false;
      },
      error: (err: any) => {
        console.error('AI分析请求失败:', err);
        // 失败时使用本地模拟
        this.aiChartData = this.generateChartFromPrompt(this.aiPrompt);
        this.aiAnalysisResult = this.generateAnalysisReport(this.aiPrompt);
        this.isRealAI = false;
        this.aiNote = '网络请求失败，显示本地模拟数据';
        this.aiGenerating = false;
      }
    });
  }

  // 根据用户输入生成图表数据
  private generateChartFromPrompt(prompt: string): any {
    const lowerPrompt = prompt.toLowerCase();
    
    // 根据关键词判断图表类型和数据
    if (lowerPrompt.includes('趋势') || lowerPrompt.includes('走势') || lowerPrompt.includes('变化')) {
      this.aiChartType = 'line';
      return {
        labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
        datasets: [{
          label: '回收量(吨)',
          data: [65, 78, 90, 81, 95, 110],
          color: '#4CAF50'
        }, {
          label: '收入(万元)',
          data: [35, 42, 50, 45, 55, 62],
          color: '#2196F3'
        }]
      };
    } else if (lowerPrompt.includes('占比') || lowerPrompt.includes('比例') || lowerPrompt.includes('分布')) {
      this.aiChartType = 'pie';
      return {
        labels: ['塑料', '纸类', '金属', '玻璃', '纺织品', '其他'],
        data: [35, 28, 18, 10, 5, 4],
        colors: ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#00BCD4', '#607D8B']
      };
    } else if (lowerPrompt.includes('对比') || lowerPrompt.includes('比较')) {
      this.aiChartType = 'bar';
      return {
        labels: ['朝阳区', '海淀区', '西城区', '东城区', '丰台区'],
        datasets: [{
          label: '本月',
          data: [120, 95, 80, 70, 65],
          color: '#4CAF50'
        }, {
          label: '上月',
          data: [100, 85, 75, 65, 55],
          color: '#90CAF9'
        }]
      };
    } else {
      this.aiChartType = 'bar';
      return {
        labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        datasets: [{
          label: '日均回收量(kg)',
          data: [850, 920, 780, 1050, 980, 1200, 650],
          color: '#4CAF50'
        }]
      };
    }
  }

  // 生成AI分析报告
  private generateAnalysisReport(prompt: string): string {
    const reports: { [key: string]: string } = {
      '趋势': `📊 **趋势分析报告**\n\n根据近6个月数据分析：\n\n1. **回收量趋势**: 整体呈上升态势，月均增长率约12.3%\n2. **收入趋势**: 与回收量正相关，月均增长约15.8%\n3. **峰值分析**: 6月达到最高值110吨，环比增长15.8%\n4. **建议**: 加大夏季回收力度，预计Q3将持续增长`,
      '占比': `📊 **品类分布分析**\n\n当前回收品类构成：\n\n1. **塑料类(35%)**: 主要来源为社区和商超\n2. **纸类(28%)**: 办公区域贡献最大\n3. **金属(18%)**: 具有较高单价值\n4. **其他(19%)**: 包括玻璃、纺织品等\n\n**建议**: 可针对塑料和纸类进行专项回收活动`,
      '对比': `📊 **区域对比分析**\n\n各区域回收表现对比：\n\n1. **朝阳区**: 领先第一，增长20%\n2. **海淀区**: 稳步增长，潜力大\n3. **西城区**: 增速放缓，需关注\n\n**建议**: 海淀区可增加回收点密度，挖掘增长潜力`
    };

    for (const key in reports) {
      if (prompt.includes(key)) {
        return reports[key];
      }
    }

    return `📊 **数据分析报告**\n\n基于您的查询"${prompt}"，AI已为您生成相关图表和分析：\n\n1. **数据概况**: 本周日均回收量约920kg\n2. **高峰时段**: 周六达到峰值1200kg\n3. **低谷时段**: 周日最低650kg\n4. **环比变化**: 整体增长8.5%\n\n**智能建议**: 建议周末安排更多回收人员，提升服务响应速度。`;
  }

  // 获取图表最大值
  getChartMax(data: number[]): number {
    return Math.max(...data) * 1.2;
  }

  // 计算饼图路径
  getPieSlicePath(index: number, data: number[]): string {
    const total = data.reduce((a, b) => a + b, 0);
    let startAngle = -90;
    for (let i = 0; i < index; i++) {
      startAngle += (data[i] / total) * 360;
    }
    const angle = (data[index] / total) * 360;
    const endAngle = startAngle + angle;
    
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const x1 = 100 + 80 * Math.cos(startRad);
    const y1 = 100 + 80 * Math.sin(startRad);
    const x2 = 100 + 80 * Math.cos(endRad);
    const y2 = 100 + 80 * Math.sin(endRad);
    
    const largeArc = angle > 180 ? 1 : 0;
    
    return `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`;
  }

  // 生成折线图的points属性
  getLineChartPoints(data: number[]): string {
    const max = this.getChartMax(data);
    return data.map((v, i) => `${35 + i * 55},${160 - (v / max) * 130}`).join(' ');
  }

  // 快捷AI分析按钮
  quickAIAnalysis(type: string): void {
    const prompts: { [key: string]: string } = {
      'trend': '分析近6个月回收量和收入的趋势变化',
      'category': '分析当前各品类回收占比分布情况',
      'region': '对比各区域回收量表现',
      'forecast': '预测下个月的回收量走势'
    };
    this.aiPrompt = prompts[type] || '';
    this.generateAIChart();
  }

}
