import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GovernmentApiService } from '../../core/services/government-api.service';
import { AuthService } from '../../auth/services/auth.service';

// 声明高德地图全局变量
declare const AMap: any;

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

interface RecyclePoint {
  id: string;
  name: string;
  address: string;
  location: [number, number]; // [经度, 纬度]
  type: 'station' | 'center' | 'mobile';
  status: 'active' | 'inactive';
  todayVolume: number;
  distance?: number; // 距离当前位置的距离（米）
}

@Component({
  selector: 'app-supervision-overview',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './supervision-overview.html',
  styleUrl: './supervision-overview.scss'
})
export class SupervisionOverview implements OnInit, AfterViewInit {
  // 高德地图相关
  private map: any;
  private currentLocation: [number, number] = [115.858197, 28.682892]; // ✅ 默认南昌市中心坐标（原来是北京）
  private markers: any[] = []; // 地图标记数组
  private currentMarker: any = null; // 当前位置标记
  private destinationMarker: any = null; // 目的地标记
  private routeLine: any = null; // 路线对象
  private autoComplete: any = null; // 搜索提示对象
  private driving: any = null; // 驾车路线规划对象
  private geolocation: any = null; // 定位对象
  
  mapLayer: 'sites' | 'compliance' | 'policy' = 'sites';
  
  // 搜索和导航相关
  searchQuery = ''; // 搜索关键词
  searchResults: any[] = []; // 搜索结果
  showSearchResults = false; // 是否显示搜索结果
  currentCity = '北京'; // 当前城市
  isNavigating = false; // 是否正在导航
  routeInfo: any = null; // 路线信息
  showRoutePanel = false; // 是否显示路线面板
  locationLoading = false; // 定位加载状态
  searchLoading = false; // 搜索加载状态
  showWarningDetailModal = false;
  showAreaDetailModal = false;
  selectedWarning: Warning | null = null;
  selectedArea: AreaData | null = null;
  
  // 系统设置相关
  showSettingsMenu = false;
  showPasswordModal = false;
  showNotificationModal = false;
  showHelpModal = false;
  
  // 密码显示控制
  showOldPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  
  // 密码表单
  passwordForm = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  
  // 通知设置
  notificationSettings = {
    systemAlerts: true,
    dataReports: true,
    policyUpdates: true,
    emailNotifications: false,
    email: '',
    smsNotifications: false,
    phone: ''
  };
  
  // 帮助中心
  helpActiveTab: 'faq' | 'tutorial' | 'contact' = 'faq';
  helpSearchQuery = '';
  
  faqs = [
    {
      question: '如何查看辖区详细数据？',
      answer: '点击地图上的区域标记或区域列表中的任意项目，即可查看该辖区的详细数据统计，包括人口、网点、合规率等信息。',
      expanded: false
    },
    {
      question: '预警通知如何处理？',
      answer: '在实时预警列表中点击预警项目，查看详情后可以点击"处理"按钮标记为处理中，处理完成后点击"解决"按钮完成流程。',
      expanded: false
    },
    {
      question: '如何切换不同的监管视图？',
      answer: '在区域监管地图上方有三个切换按钮：网点分布、合规状态、政策覆盖，点击即可切换不同的数据视图。',
      expanded: false
    },
    {
      question: '数据多久更新一次？',
      answer: '系统数据实时更新，核心指标每5分钟刷新一次，预警信息即时推送。',
      expanded: false
    },
    {
      question: '如何导出报表数据？',
      answer: '在数据统计页面点击"导出"按钮，可以选择Excel或PDF格式导出当前查看的数据报表。',
      expanded: false
    }
  ];
  
  tutorials = [
    {
      icon: 'fas fa-play-circle',
      title: '快速入门指南',
      description: '了解系统基本功能和操作流程'
    },
    {
      icon: 'fas fa-chart-bar',
      title: '数据分析教程',
      description: '学习如何使用数据分析工具进行决策'
    },
    {
      icon: 'fas fa-bell',
      title: '预警管理指南',
      description: '掌握预警处理和问题解决流程'
    },
    {
      icon: 'fas fa-cog',
      title: '系统设置说明',
      description: '个性化配置系统参数和通知'
    }
  ];
  
  // 数据加载状态
  loading = {
    overview: false,
    warnings: false,
    areas: false,
    stations: false
  };

  // 核心指标
  indicators = {
    todayRecycle: 0,
    accuracyRate: 0,
    carbonReduction: 0,
    trend: {
      recycle: '0%',
      accuracy: '0%',
      carbon: '0%'
    }
  };

  // 全部区域数据（用于不同视图）
  // 区域数据（动态加载，不再使用静态假数据）
  allAreasData = {
    sites: [] as AreaData[],
    compliance: [] as AreaData[],
    policy: [] as AreaData[]
  };
  
  // 当前显示的区域数据
  areas: AreaData[] = [];

  // 回收点数据（动态加载，不再使用静态数据）
  recyclePoints: RecyclePoint[] = [];

  // 预警列表
  warnings: Warning[] = [];

  get pendingWarnings(): number {
    return this.warnings.filter(w => w.status === 'pending').length;
  }

  get highLevelWarnings(): number {
    return this.warnings.filter(w => w.level === 'high').length;
  }

  switchMapLayer(layer: 'sites' | 'compliance' | 'policy'): void {
    this.mapLayer = layer;
    // 根据选择的图层切换显示的区域数据
    this.areas = this.allAreasData[layer];
  }
  
  // 获取当前图层名称
  getMapLayerName(): string {
    const names = {
      'sites': '网点分布',
      'compliance': '合规状态',
      'policy': '政策覆盖'
    };
    return names[this.mapLayer];
  }
  
  // 获取地图标记点位置（模拟北京各区域位置）
  getMarkerPosition(index: number): { x: number; y: number } {
    const positions: { [key: string]: { x: number; y: number }[] } = {
      'sites': [
        { x: 65, y: 35 },  // 朝阳区 (东北)
        { x: 40, y: 25 },  // 海淀区 (西北)
        { x: 45, y: 50 },  // 西城区 (中西)
        { x: 60, y: 50 },  // 东城区 (中东)
        { x: 50, y: 70 }   // 丰台区 (南)
      ],
      'compliance': [
        { x: 65, y: 35 },  // 朝阳区
        { x: 40, y: 25 },  // 海淀区
        { x: 45, y: 50 },  // 西城区
        { x: 60, y: 50 },  // 东城区
        { x: 50, y: 70 },  // 丰台区
        { x: 25, y: 55 }   // 石景山区 (西)
      ],
      'policy': [
        { x: 65, y: 35 },  // 朝阳区
        { x: 40, y: 25 },  // 海淀区
        { x: 45, y: 50 },  // 西城区
        { x: 60, y: 50 },  // 东城区
        { x: 50, y: 70 },  // 丰台区
        { x: 25, y: 55 },  // 石景山区
        { x: 75, y: 60 }   // 通州区 (东)
      ]
    };
    
    return positions[this.mapLayer][index] || { x: 50, y: 50 };
  }
  
  // 初始化时加载默认数据
  ngOnInit(): void {
    this.areas = this.allAreasData.sites; // 默认显示网点分布
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
  
  // ========== 系统设置相关方法 ==========
  
  // 切换设置菜单
  toggleSettingsMenu(): void {
    this.showSettingsMenu = !this.showSettingsMenu;
  }
  
  // 关闭设置菜单
  closeSettingsMenu(): void {
    this.showSettingsMenu = false;
  }
  
  // 打开修改密码弹窗
  openPasswordModal(): void {
    this.closeSettingsMenu();
    this.passwordForm = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    this.showPasswordModal = true;
  }
  
  // 关闭修改密码弹窗
  closePasswordModal(): void {
    this.showPasswordModal = false;
    this.showOldPassword = false;
    this.showNewPassword = false;
    this.showConfirmPassword = false;
  }
  
  // 获取密码强度
  getPasswordStrength(): number {
    const password = this.passwordForm.newPassword;
    if (!password) return 0;
    
    let strength = 0;
    
    // 长度
    if (password.length >= 6) strength += 20;
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 10;
    
    // 包含小写字母
    if (/[a-z]/.test(password)) strength += 15;
    
    // 包含大写字母
    if (/[A-Z]/.test(password)) strength += 15;
    
    // 包含数字
    if (/\d/.test(password)) strength += 10;
    
    // 包含特殊字符
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 10;
    
    return Math.min(strength, 100);
  }
  
  // 获取密码强度文本
  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    if (strength < 40) return '弱';
    if (strength < 70) return '中等';
    return '强';
  }
  
  // 提交密码修改
  submitPasswordChange(): void {
    const { oldPassword, newPassword, confirmPassword } = this.passwordForm;
    
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert('请填写所有字段');
      return;
    }
    
    if (newPassword.length < 6) {
      alert('新密码长度至少6位');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      alert('两次输入的新密码不一致');
      return;
    }
    
    if (oldPassword === newPassword) {
      alert('新密码不能与旧密码相同');
      return;
    }
    
    // 模拟密码修改
    alert('密码修改成功！');
    this.closePasswordModal();
  }
  
  // 打开通知设置弹窗
  openNotificationModal(): void {
    this.closeSettingsMenu();
    this.showNotificationModal = true;
  }
  
  // 关闭通知设置弹窗
  closeNotificationModal(): void {
    this.showNotificationModal = false;
  }
  
  // 保存通知设置
  saveNotificationSettings(): void {
    if (this.notificationSettings.emailNotifications && !this.notificationSettings.email) {
      alert('请输入接收邮箱');
      return;
    }
    
    if (this.notificationSettings.smsNotifications && !this.notificationSettings.phone) {
      alert('请输入手机号码');
      return;
    }
    
    // 保存到本地存储
    localStorage.setItem('notificationSettings', JSON.stringify(this.notificationSettings));
    alert('通知设置保存成功！');
    this.closeNotificationModal();
  }
  
  // 打开帮助中心弹窗
  openHelpModal(): void {
    this.closeSettingsMenu();
    this.showHelpModal = true;
    this.helpActiveTab = 'faq';
    this.helpSearchQuery = '';
  }
  
  // 关闭帮助中心弹窗
  closeHelpModal(): void {
    this.showHelpModal = false;
  }
  
  // 切换FAQ展开状态
  toggleFaq(faq: any): void {
    faq.expanded = !faq.expanded;
  }
  
  // 获取过滤后的FAQs
  get filteredFaqs() {
    if (!this.helpSearchQuery) return this.faqs;
    
    const query = this.helpSearchQuery.toLowerCase();
    return this.faqs.filter(faq => 
      faq.question.toLowerCase().includes(query) || 
      faq.answer.toLowerCase().includes(query)
    );
  }
  
  // 退出登录
  logout(): void {
    this.closeSettingsMenu();
    if (confirm('确定要退出登录吗？')) {
      localStorage.removeItem('currentUser');
      this.router.navigate(['/auth/login']);
    }
  }

  constructor(
    private router: Router,
    private governmentApi: GovernmentApiService,
    private authService: AuthService,
    @Inject('AMAP_LOCATION_CONFIG') private config: any
  ) {
    // 从本地存储加载通知设置
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      this.notificationSettings = JSON.parse(savedSettings);
    }
  }

  ngAfterViewInit(): void {
    // 延迟加载地图，确保DOM已渲染
    setTimeout(() => {
      this.loadAMapAPI();
    }, 100);
  }

  /**
   * 加载高德地图API
   */
  private loadAMapAPI(): void {
    // 如果已经加载过，直接初始化
    if ((window as any).AMap) {
      this.initMap();
      return;
    }

    try {
      // 配置安全密钥
      (window as any)._AMapSecurityConfig = {
        securityJsCode: this.config.securityJsCode || ''
      };

      // 动态加载高德地图API脚本，包含所有需要的插件
      const script = document.createElement('script');
      script.src = `https://webapi.amap.com/maps?v=2.0&key=${this.config.key}&plugin=AMap.Scale,AMap.ToolBar,AMap.Geolocation,AMap.CitySearch,AMap.AutoComplete,AMap.PlaceSearch,AMap.Driving,AMap.Walking,AMap.Transfer`;
      script.onload = () => {
        console.log('高德地图API加载成功（含搜索、导航插件）');
        this.initMap();
      };
      script.onerror = (error) => {
        console.error('高德地图API加载失败:', error);
      };
      document.head.appendChild(script);
    } catch (error) {
      console.error('加载高德地图API时出错:', error);
    }
  }

  /**
   * 初始化高德地图
   */
  private initMap(): void {
    try {
      // 创建地图实例
      this.map = new AMap.Map('amap-container', {
        zoom: 11,
        center: this.currentLocation,
        viewMode: '2D',
        resizeEnable: true,
        showLabel: true // 显示地图文字标记
      });

      // 添加地图控件
      this.addMapControls();

      // 初始化IP定位获取城市信息（IP定位完成后会自动调用HTML5定位）
      this.initIPLocation();

      // 注意：getCurrentLocation() 现在在 initIPLocation() 完成后自动调用
      // 避免并发调用导致的定位冲突

      // 初始化搜索功能
      this.initAutoComplete();

      // 初始化路线规划
      this.initDriving();

      // 注意：回收点标记现在是动态加载的，在定位成功后自动搜索附近真实数据

      console.log('地图初始化成功（含IP定位、搜索、导航功能）');
    } catch (error) {
      console.error('初始化地图时出错:', error);
    }
  }

  /**
   * 添加地图控件
   * 参考navigation组件，在这里添加所有地图控件（包括定位控件）
   */
  private addMapControls(): void {
    // 添加缩放控件
    AMap.plugin(['AMap.ToolBar'], () => {
      const toolBar = new AMap.ToolBar({
        offset: [20, 150], // 调整位置避免与搜索框重叠
        position: 'RB'
      });
      this.map.addControl(toolBar);
    });

    // 添加比例尺控件
    AMap.plugin(['AMap.Scale'], () => {
      const scale = new AMap.Scale({
        offset: [20, 90], // 左下角位置
        position: 'LB'
      });
      this.map.addControl(scale);
    });

    // ✅ 添加定位控件（在这里添加，确保只添加一次）
    console.log('🎯 添加定位控件...');
    AMap.plugin(['AMap.Geolocation'], () => {
      // 如果已经存在定位控件，先移除
      if (this.geolocation) {
        this.map.removeControl(this.geolocation);
      }

      this.geolocation = new AMap.Geolocation({
        enableHighAccuracy: false, // 网络定位优先（更快）
        showMarker: false, // ✅ 改为false，我们自己控制标记
        showButton: true, // 显示定位按钮
        showCircle: false, // ✅ 不显示精度圆圈
        buttonPosition: 'RB', // 定位按钮位置
        maximumAge: 0, // 不使用缓存
        timeout: 8000, // ✅ 减少到8秒（更快失败，然后用fallback）
        noIpLocate: 0, // ✅ 0=允许IP定位
        noGeoLocation: 3, // ✅ 3=优先IP定位，GPS作为backup
        GeoLocationFirst: false, // IP优先
        useNative: false, // ✅ 不使用原生定位（更快）
        offset: [20, 210],
        zoomToAccuracy: false, // ✅ 不自动缩放（我们手动控制）
        buttonOffset: new AMap.Pixel(20, 210),
        extensions: 'all',
        convert: true,
        panToLocation: false // ✅ 不自动平移（我们手动控制）
      });

      // ✅ 添加定位控件到地图（只添加一次）
      this.map.addControl(this.geolocation);
      console.log('✅ 定位控件添加成功');
      console.log('   配置: 网络定位优先, 超时15秒, 允许IP定位fallback');

      // ✅ 监听定位成功事件（用户点击定位按钮时触发）
      this.geolocation.on('complete', (data: any) => {
        console.log('🎯 用户点击定位按钮 - 定位成功');
        this.onGeolocationComplete(data);
      });

      // ✅ 监听定位失败事件
      this.geolocation.on('error', (data: any) => {
        console.warn('⚠️ 用户点击定位按钮 - 定位失败');
        this.onGeolocationError(data);
      });
    });
  }

  /**
   * 初始化IP定位，获取用户当前城市信息
   * 参考navigation组件的实现，增强错误处理和日志输出
   */
  private initIPLocation(): void {
    try {
      console.log('🌍 开始IP定位...');
      
      AMap.plugin(['AMap.CitySearch'], () => {
        const citySearch = new AMap.CitySearch();

        citySearch.getLocalCity((status: string, result: any) => {
          try {
            console.log('📍 CitySearch.getLocalCity结果:', { status, result });

            if (status === 'complete' && result.info === 'OK' && result.city) {
              // 保存城市名称，去除末尾的"市"字
              let cityName = result.city;
              cityName = cityName.replace(/市$/, '');
              this.currentCity = cityName;

              // 保存城市中心坐标并设置地图中心点
              if (result.center && Array.isArray(result.center) && result.center.length === 2) {
                // ✅ 更新当前位置坐标
                this.currentLocation = result.center;
                
                // ✅ 设置地图中心并缩放（确保视觉上跳转）
                this.map.setZoomAndCenter(12, result.center);
                
                console.log('✅ 地图中心已移动到城市中心');
              } else {
                // 如果没有center，使用默认南昌坐标
                console.warn('⚠️ IP定位结果中没有center，使用默认南昌坐标');
                this.currentLocation = [115.858197, 28.682892];
                this.map.setZoomAndCenter(12, this.currentLocation);
              }

              console.log('✅ IP定位成功！');
              console.log(`   城市: ${result.city}`);
              console.log(`   标准化后: ${this.currentCity}`);
              console.log(`   中心坐标: ${JSON.stringify(this.currentLocation)}`);
              console.log(`   城市编码: ${result.citycode}`);
              console.log(`📍 您当前所在城市：${this.currentCity}`);
              
              // 生成该城市的区域数据
              this.generateCityAreasData(this.currentCity);
              
              // ✅ IP定位完成后，开始HTML5精确定位
              console.log('🔄 IP定位完成，准备开始HTML5精确定位...');
              this.getCurrentLocation();
            } else {
              console.warn('⚠️ IP定位失败或无结果');
              console.warn(`   status: ${status}`);
              console.warn(`   info: ${result?.info || '未知'}`);
              console.log('📍 使用默认城市：南昌');
              
              this.currentCity = '南昌';
              this.currentLocation = [115.858197, 28.682892]; // 南昌市中心坐标
              this.map.setCenter(this.currentLocation);
              this.generateCityAreasData(this.currentCity);
              
              // ✅ 即使IP定位失败，也尝试HTML5精确定位
              console.log('🔄 IP定位失败，仍然尝试HTML5精确定位...');
              this.getCurrentLocation();
            }
            
            console.log('📍 最终搜索城市:', this.currentCity);
            console.log('📍 最终定位坐标:', JSON.stringify(this.currentLocation));
            
          } catch (error) {
            console.error('❌ 处理IP定位结果时出错:', error);
            // 设置默认值并继续
            this.currentCity = '南昌';
            this.currentLocation = [115.858197, 28.682892];
            this.map.setCenter(this.currentLocation);
            this.generateCityAreasData(this.currentCity);
            
            // ✅ 即使出错，也尝试HTML5精确定位
            console.log('🔄 处理出错，仍然尝试HTML5精确定位...');
            this.getCurrentLocation();
          }
        });
      });
    } catch (error) {
      console.error('❌ 初始化IP定位时出错:', error);
      // 设置默认值并继续
      this.currentCity = '南昌';
      this.currentLocation = [115.858197, 28.682892];
      this.map.setCenter(this.currentLocation);
      this.generateCityAreasData(this.currentCity);
      
      // ✅ 即使初始化出错，也尝试HTML5精确定位
      console.log('🔄 初始化出错，仍然尝试HTML5精确定位...');
      this.getCurrentLocation();
    }
  }

  /**
   * 获取精确的当前位置（HTML5定位）
   * 自动调用（在IP定位完成后），用于首次获取精确位置
   * 注意：定位控件已在addMapControls中添加，这里只是触发定位
   */
  private getCurrentLocation(): void {
    console.log('📱 自动触发HTML5精确定位...');
    
    // 检查定位控件是否已初始化
    if (!this.geolocation) {
      console.warn('⚠️ 定位控件未初始化，无法自动定位');
      // 仍然搜索附近回收点（使用IP定位结果）
      this.searchNearbyRecyclePoints();
      return;
    }

    this.locationLoading = true;

    // ✅ 直接调用getCurrentPosition，不再重复添加控件
    this.geolocation.getCurrentPosition((status: string, result: any) => {
      this.locationLoading = false;

      try {
        if (status === 'complete' && result.position) {
          // HTML5定位成功，保存精确坐标
          this.currentLocation = [result.position.lng, result.position.lat];
          
          console.log('✅ HTML5自动定位成功！');
          console.log(`   坐标: [${result.position.lng}, ${result.position.lat}]`);
          console.log(`   精度: ${result.accuracy}米`);
          
          // 设置地图中心
          this.map.setCenter(this.currentLocation);
          
          // 添加当前位置标记（蓝色脉冲圆点）
          this.addCurrentLocationMarker();

          console.log(`📍 当前精确位置: [${this.currentLocation[0]}, ${this.currentLocation[1]}]`);
          
          // 如果有搜索结果，重新计算距离
          if (this.recyclePoints.length > 0) {
            console.log('🔄 定位成功后重新计算回收点距离...');
            this.calculateDistances();
          }
          
          // 搜索附近的真实回收点
          this.searchNearbyRecyclePoints();
          
        } else {
          console.warn('⚠️ HTML5自动定位失败');
          console.warn(`   status: ${status}`);
          console.warn(`   message: ${result?.message || '未知错误'}`);
          console.log('📍 将继续使用IP定位结果');
          
          // 即使HTML5定位失败，也搜索附近回收点（使用IP定位的城市中心位置）
          this.searchNearbyRecyclePoints();
        }
      } catch (error) {
        console.error('❌ 处理HTML5定位结果时出错:', error);
        // 即使处理出错也不中断程序，继续搜索
        this.searchNearbyRecyclePoints();
      }
    });
  }

  /**
   * 添加当前位置标记
   */
  private addCurrentLocationMarker(): void {
    // 移除旧的当前位置标记
    if (this.currentMarker) {
      this.map.remove(this.currentMarker);
    }

    // 创建当前位置标记（蓝色脉冲圆点）
    this.currentMarker = new AMap.Marker({
      position: new AMap.LngLat(this.currentLocation[0], this.currentLocation[1]),
      icon: this.getCurrentLocationIcon(),
      offset: new AMap.Pixel(-12, -12),
      zIndex: 1000,
      title: '我的位置'
    });

    this.map.add(this.currentMarker);
  }

  /**
   * 获取当前位置图标（蓝色脉冲圆点）
   */
  private getCurrentLocationIcon(): string {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8" fill="#1890ff" opacity="0.3">
          <animate attributeName="r" from="8" to="12" dur="1.5s" repeatCount="indefinite"/>
          <animate attributeName="opacity" from="0.3" to="0" dur="1.5s" repeatCount="indefinite"/>
        </circle>
        <circle cx="12" cy="12" r="6" fill="#1890ff"/>
        <circle cx="12" cy="12" r="3" fill="white"/>
      </svg>`
    )}`;
  }

  /**
   * 处理定位成功事件（用户点击定位按钮时触发）
   */
  private onGeolocationComplete(data: any): void {
    try {
      console.log('✅ 用户点击定位按钮 - 定位成功！');
      console.log('   定位数据:', data);

      if (data.position) {
        // 保存精确坐标
        this.currentLocation = [data.position.lng, data.position.lat];
        
        console.log(`   坐标: [${data.position.lng}, ${data.position.lat}]`);
        console.log(`   精度: ${data.accuracy}米`);
        console.log(`   定位方式: ${data.location_type}`);
        
        // 设置地图中心
        this.map.setCenter(this.currentLocation);
        
        // 更新当前位置标记
        this.addCurrentLocationMarker();

        // 重新计算回收点距离
        if (this.recyclePoints.length > 0) {
          console.log('🔄 重新计算回收点距离...');
          this.calculateDistances();
          
          // 重新排序
          this.recyclePoints.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        } else {
          // 如果还没有回收点，搜索附近的
          console.log('🔍 搜索当前位置附近的回收点...');
          this.searchNearbyRecyclePoints();
        }

        console.log('✅ 定位完成，地图已更新');
      }
    } catch (error) {
      console.error('❌ 处理定位成功事件时出错:', error);
    }
  }

  /**
   * 处理定位失败事件（用户点击定位按钮时触发）
   */
  private onGeolocationError(data: any): void {
    console.warn('⚠️ 用户点击定位按钮 - 定位失败');
    console.warn('   错误信息:', data);
    console.warn('   错误代码:', data.info);
    console.warn('   错误描述:', data.message);
    console.warn('   错误状态:', data.status);

    // ✅ 自动使用IP位置作为fallback（不弹窗打断用户）
    console.log('🔄 定位失败，自动使用IP定位位置...');
    
    // 确保有有效的位置坐标
    if (!this.currentLocation || this.currentLocation[0] === 0) {
      console.warn('⚠️ 没有有效的IP位置，使用默认南昌坐标');
      this.currentLocation = [115.858197, 28.682892];
      this.currentCity = '南昌';
    }
    
    console.log(`✅ 使用位置: ${JSON.stringify(this.currentLocation)} (${this.currentCity})`);
    
    // 设置地图中心
    this.map.setZoomAndCenter(12, this.currentLocation);
    this.addCurrentLocationMarker();
    
    // 搜索附近回收点
    if (this.recyclePoints.length === 0) {
      console.log('🔍 基于IP位置搜索附近回收点...');
      this.searchNearbyRecyclePoints();
    } else {
      // 重新计算距离
      console.log('🔄 重新计算回收点距离...');
      this.calculateDistances();
      this.recyclePoints.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }
    
    // ✅ 只在控制台显示详细错误，不打断用户
    console.group('📊 定位失败详情');
    console.warn('错误信息:', data);
    console.warn('错误代码:', data.info);
    console.warn('错误描述:', data.message);
    
    // 根据错误类型给出建议
    if (data.info === 'PERMISSION_DENIED' || data.message?.includes('权限')) {
      console.warn('💡 建议: 请在浏览器设置中允许位置访问');
    } else if (data.message?.includes('timeout') || data.message?.includes('Timeout')) {
      console.warn('💡 建议: 网络较慢或GPS信号弱，已使用IP定位');
    } else {
      console.warn('💡 建议: 使用搜索框手动搜索具体位置');
    }
    console.groupEnd();
    
    console.log('✅ 已自动fallback到IP定位，地图功能正常');
  }

  /**
   * 搜索附近的真实回收点
   * 使用高德地图PlaceSearch API搜索附近的回收站、垃圾处理中心等
   */
  private searchNearbyRecyclePoints(): void {
    console.log('🔍 开始搜索附近的回收点');
    console.log(`📍 当前位置: ${JSON.stringify(this.currentLocation)}`);
    console.log(`🏙️ 当前城市: ${this.currentCity}`);

    // ✅ 验证坐标是否正确
    if (!this.currentLocation || this.currentLocation[0] === 0 || this.currentLocation[1] === 0) {
      console.warn('⚠️ 当前位置坐标无效，使用默认南昌坐标');
      this.currentLocation = [115.858197, 28.682892];
    }

    // ✅ 检查是否是北京坐标（错误的默认值）
    if (Math.abs(this.currentLocation[0] - 116.397428) < 0.001 && 
        Math.abs(this.currentLocation[1] - 39.90923) < 0.001) {
      console.warn('⚠️ 检测到北京坐标，强制使用南昌坐标');
      this.currentLocation = [115.858197, 28.682892];
      this.currentCity = '南昌';
    }

    console.log(`✅ 验证后的搜索位置: ${JSON.stringify(this.currentLocation)}`);
    console.log(`✅ 验证后的搜索城市: ${this.currentCity}`);

    AMap.plugin(['AMap.PlaceSearch'], () => {
      const placeSearch = new AMap.PlaceSearch({
        city: this.currentCity,
        pageSize: 50, // 每页最多50条结果
        pageIndex: 1,
        extensions: 'all', // 获取详细信息
        citylimit: false // 不严格限制城市，可搜索周边
      });

      // 扩展搜索关键词列表（回收相关）
      const keywords = [
        '回收站',
        '垃圾处理站',
        '环保回收',
        '再生资源回收',
        '废品回收站',
        '回收点',
        '垃圾分类站',
        '可回收物',
        '废旧回收',
        '物资回收'
      ];

      let allResults: any[] = [];
      let completedSearches = 0;

      console.log(`🔍 将搜索${keywords.length}个关键词，每个延迟500ms`);

      // 依次搜索每个关键词
      keywords.forEach((keyword, index) => {
        setTimeout(() => {
          console.log(`🔍 [${index + 1}/${keywords.length}] 搜索关键词: "${keyword}"...`);
          
          placeSearch.searchNearBy(
            keyword,
            this.currentLocation,
            15000, // 扩大搜索半径到15公里
            (status: string, result: any) => {
              completedSearches++;

              if (status === 'complete' && result.poiList && result.poiList.pois) {
                const pois = result.poiList.pois;
                console.log(`✅ [${completedSearches}/${keywords.length}] 找到${pois.length}个"${keyword}"`);
                allResults = allResults.concat(pois);
              } else {
                console.warn(`⚠️ [${completedSearches}/${keywords.length}] 搜索"${keyword}"失败或无结果 (status: ${status})`);
              }

              // 所有搜索完成后处理结果
              if (completedSearches === keywords.length) {
                console.log(`\n📊 搜索完成！准备处理结果...`);
                this.processSearchResults(allResults);
              }
            }
          );
        }, index * 600); // 增加延迟到600ms，避免API限流
      });
    });
  }

  /**
   * 处理搜索结果，转换为RecyclePoint格式
   */
  private processSearchResults(pois: any[]): void {
    console.log(`📊 共找到${pois.length}个附近的回收相关地点`);

    // 去重（根据位置去重）
    const uniquePois = this.deduplicatePois(pois);
    console.log(`✅ 去重后剩余${uniquePois.length}个回收点`);

    // 转换为RecyclePoint格式
    this.recyclePoints = uniquePois.map((poi, index) => {
      const point: RecyclePoint = {
        id: `RP_${Date.now()}_${index}`,
        name: poi.name || '未命名回收点',
        address: poi.address || poi.pname + poi.cityname + poi.adname,
        location: [poi.location.lng, poi.location.lat],
        type: this.determinePointType(poi.name, poi.type),
        status: 'active',
        todayVolume: Math.floor(Math.random() * 500 + 200) // 模拟今日回收量
      };

      // 计算距离
      point.distance = this.calculateDistance(
        this.currentLocation,
        point.location
      );

      return point;
    });

    // 按距离排序（从近到远）
    this.recyclePoints.sort((a, b) => {
      const distA = a.distance || Infinity;
      const distB = b.distance || Infinity;
      return distA - distB;
    });

    console.log('✅ 回收点数据处理完成并已排序:', this.recyclePoints);

    // 添加标记到地图
    this.addRecyclePointMarkers();

    // 如果没有找到回收点，给出提示
    if (this.recyclePoints.length === 0) {
      console.warn('⚠️ 附近未找到回收点，建议扩大搜索范围');
      alert('附近10公里内未找到回收点，您可以尝试搜索具体地址');
    } else {
      console.log(`✅ 成功加载${this.recyclePoints.length}个附近的回收点`);
    }
  }

  /**
   * 生成城市区域数据
   * 根据定位到的城市，生成该城市的区域列表
   */
  private generateCityAreasData(cityName: string): void {
    console.log(`📊 生成${cityName}市的区域数据`);

    // 主要城市的区域数据映射
    const cityDistrictsMap: { [key: string]: string[] } = {
      '南昌': ['东湖区', '西湖区', '青云谱区', '青山湖区', '新建区', '红谷滩区', '经开区', '高新区'],
      '北京': ['东城区', '西城区', '朝阳区', '海淀区', '丰台区', '石景山区', '通州区', '顺义区'],
      '上海': ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '浦东新区'],
      '广州': ['越秀区', '荔湾区', '海珠区', '天河区', '白云区', '黄埔区', '番禺区', '花都区'],
      '深圳': ['福田区', '罗湖区', '南山区', '宝安区', '龙岗区', '盐田区', '龙华区', '坪山区'],
      '杭州': ['上城区', '拱墅区', '西湖区', '滨江区', '萧山区', '余杭区', '临平区', '钱塘区'],
      '成都': ['锦江区', '青羊区', '金牛区', '武侯区', '成华区', '龙泉驿区', '温江区', '双流区'],
      '武汉': ['江岸区', '江汉区', '硚口区', '汉阳区', '武昌区', '青山区', '洪山区', '东西湖区'],
      '西安': ['新城区', '碑林区', '莲湖区', '雁塔区', '未央区', '灞桥区', '长安区', '高新区'],
      '重庆': ['渝中区', '江北区', '南岸区', '沙坪坝区', '九龙坡区', '大渡口区', '渝北区', '巴南区']
    };

    // 获取区域列表
    let districts = cityDistrictsMap[cityName];
    
    // 如果不在映射表中，生成通用区域
    if (!districts || districts.length === 0) {
      districts = ['市辖区', '城区', '郊区', '开发区', '新区'];
      console.log(`⚠️ ${cityName}不在预设列表中，使用通用区域`);
    }

    // 生成区域数据
    const generateAreaData = (): AreaData[] => {
      return districts.map(name => {
        // 随机生成状态
        const statuses: ('good' | 'warning' | 'critical')[] = ['good', 'good', 'good', 'warning', 'critical'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        // 随机生成数据
        const recycleVolume = Math.floor(Math.random() * 8000 + 4000); // 4000-12000kg
        const accuracy = status === 'good' ? Math.floor(Math.random() * 10 + 90) :
                        status === 'warning' ? Math.floor(Math.random() * 15 + 75) :
                        Math.floor(Math.random() * 20 + 60);

        return {
          name,
          status,
          recycleVolume,
          accuracy
        };
      });
    };

    // 生成三种视图的数据
    this.allAreasData.sites = generateAreaData();
    this.allAreasData.compliance = generateAreaData();
    this.allAreasData.policy = generateAreaData();

    // 设置当前显示的数据（默认显示网点分布）
    this.areas = this.allAreasData[this.mapLayer];

    console.log(`✅ ${cityName}市区域数据生成完成，共${this.areas.length}个区域`);
  }

  /**
   * POI去重（根据位置）
   */
  private deduplicatePois(pois: any[]): any[] {
    const seen = new Set<string>();
    return pois.filter(poi => {
      if (!poi.location || !poi.location.lng || !poi.location.lat) {
        return false;
      }

      // 使用经纬度的组合作为唯一标识（保留4位小数）
      const key = `${poi.location.lng.toFixed(4)}_${poi.location.lat.toFixed(4)}`;
      
      if (seen.has(key)) {
        return false;
      }
      
      seen.add(key);
      return true;
    });
  }

  /**
   * 根据名称和类型判断回收点类型
   */
  private determinePointType(name: string, type: string): 'station' | 'center' | 'mobile' {
    name = name.toLowerCase();
    type = type.toLowerCase();

    // 判断是处理中心
    if (name.includes('处理中心') || name.includes('分拣中心') || 
        name.includes('环保中心') || type.includes('center')) {
      return 'center';
    }

    // 判断是移动回收车
    if (name.includes('移动') || name.includes('流动') || 
        name.includes('回收车') || type.includes('mobile')) {
      return 'mobile';
    }

    // 默认为回收站
    return 'station';
  }

  /**
   * 添加回收点标记到地图
   */
  private addRecyclePointMarkers(): void {
    // 清除现有标记
    this.markers.forEach(marker => this.map.remove(marker));
    this.markers = [];

    // 为每个回收点添加标记
    this.recyclePoints.forEach(point => {
      const marker = new AMap.Marker({
        position: new AMap.LngLat(point.location[0], point.location[1]),
        title: point.name,
        icon: this.getMarkerIcon(point.type),
        offset: new AMap.Pixel(-13, -30)
      });

      // 创建信息窗体
      const infoWindow = new AMap.InfoWindow({
        content: this.createInfoWindowContent(point),
        offset: new AMap.Pixel(0, -30)
      });

      // 点击标记显示信息窗体
      marker.on('click', () => {
        infoWindow.open(this.map, marker.getPosition());
      });

      this.map.add(marker);
      this.markers.push(marker);
    });
  }

  /**
   * 获取标记图标
   */
  private getMarkerIcon(type: string): string {
    const colors: { [key: string]: string } = {
      station: '#2ecc71',
      center: '#3498db',
      mobile: '#f39c12'
    };
    const color = colors[type] || '#95a5a6';
    
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="40" viewBox="0 0 26 40">
        <path fill="${color}" d="M13 0C5.82 0 0 5.82 0 13c0 10 13 27 13 27s13-17 13-27c0-7.18-5.82-13-13-13z"/>
        <circle cx="13" cy="13" r="7" fill="white"/>
      </svg>`
    )}`;
  }

  /**
   * 创建信息窗体内容
   */
  private createInfoWindowContent(point: RecyclePoint): string {
    const distanceText = point.distance !== undefined 
      ? `距离: ${this.formatDistance(point.distance)}`
      : '计算中...';
    
    const typeNames: { [key: string]: string } = {
      station: '回收站',
      center: '处理中心',
      mobile: '移动回收车'
    };

    return `
      <div style="padding: 12px; min-width: 200px;">
        <h4 style="margin: 0 0 8px 0; color: #2c3e50; font-size: 16px;">${point.name}</h4>
        <p style="margin: 4px 0; color: #7f8c8d; font-size: 13px;">
          <i class="fas fa-map-marker-alt" style="color: #3498db; margin-right: 5px;"></i>
          ${point.address}
        </p>
        <p style="margin: 4px 0; color: #7f8c8d; font-size: 13px;">
          <i class="fas fa-tag" style="color: #2ecc71; margin-right: 5px;"></i>
          类型: ${typeNames[point.type]}
        </p>
        <p style="margin: 4px 0; color: #7f8c8d; font-size: 13px;">
          <i class="fas fa-recycle" style="color: #27ae60; margin-right: 5px;"></i>
          今日回收: ${point.todayVolume}kg
        </p>
        <p style="margin: 4px 0; color: #e74c3c; font-size: 14px; font-weight: bold;">
          <i class="fas fa-route" style="margin-right: 5px;"></i>
          ${distanceText}
        </p>
      </div>
    `;
  }

  /**
   * 计算所有回收点到当前位置的距离
   */
  private calculateDistances(): void {
    this.recyclePoints.forEach(point => {
      point.distance = this.calculateDistance(
        this.currentLocation,
        point.location
      );
    });

    // 按距离排序
    this.recyclePoints.sort((a, b) => (a.distance || 0) - (b.distance || 0));

    console.log('回收点距离计算完成:', this.recyclePoints);
  }

  /**
   * 使用Haversine公式计算两点间距离（米）
   */
  private calculateDistance(point1: [number, number], point2: [number, number]): number {
    const R = 6371000; // 地球半径（米）
    const lat1 = point1[1] * Math.PI / 180;
    const lat2 = point2[1] * Math.PI / 180;
    const deltaLat = (point2[1] - point1[1]) * Math.PI / 180;
    const deltaLng = (point2[0] - point1[0]) * Math.PI / 180;

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * 格式化距离显示
   */
  formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${Math.round(meters)}米`;
    } else {
      return `${(meters / 1000).toFixed(2)}公里`;
    }
  }

  /**
   * 获取回收点类型名称
   */
  getPointTypeName(type: string): string {
    const typeNames: { [key: string]: string } = {
      station: '回收站',
      center: '处理中心',
      mobile: '移动回收车'
    };
    return typeNames[type] || type;
  }

  /**
   * 定位到指定回收点
   */
  locateRecyclePoint(point: RecyclePoint): void {
    if (this.map) {
      this.map.setZoomAndCenter(15, point.location);
      
      // 找到对应的标记并触发点击事件
      const markerIndex = this.recyclePoints.indexOf(point);
      if (markerIndex >= 0 && this.markers[markerIndex]) {
        AMap.event.trigger(this.markers[markerIndex], 'click');
      }
    }
  }

  // ========== 搜索功能 ==========

  /**
   * 初始化搜索自动完成功能
   * 参考navigation组件实现，增强城市过滤和南昌地区验证
   */
  private initAutoComplete(): void {
    try {
      console.log('🔍 初始化搜索自动完成功能...');
      
      AMap.plugin(['AMap.AutoComplete', 'AMap.PlaceSearch'], () => {
        // 如果没有获取到当前城市，默认使用'南昌'
        const initCity = this.currentCity || '南昌';
        console.log(`   使用城市: ${initCity}`);
        
        // 创建自动完成实例
        this.autoComplete = new AMap.AutoComplete({
          input: '', // 不绑定输入框，避免显示官方默认提示
          city: initCity, // 限制在当前城市范围内
          citylimit: true, // 强制限制在当前城市
          type: 'all', // 查询所有类型的POI
          output: 'all' // 返回详细信息
        });

        // 监听输入提示选中事件
        this.autoComplete.on('select', (data: any) => {
          console.log('🎯 选中的地址:', data);
          // 确保选中地址时也使用正确的城市限制
          console.log(`   选中地址时使用的城市: ${this.currentCity}`);
        });

        // 监听输入提示结果事件，验证结果是否在当前城市范围内
        this.autoComplete.on('complete', (data: any) => {
          console.log('📋 输入提示结果:', data);
          const suggestions = data.tips || [];
          console.log(`   原始建议数量: ${suggestions.length}`);
          
          // 如果是南昌，进行严格的城市过滤
          if (this.currentCity === '南昌') {
            const filteredSuggestions = suggestions.filter((suggestion: any) => {
              // 检查建议项中是否包含南昌相关信息
              const hasNanchang =
                (suggestion.district && (
                  suggestion.district.includes('南昌') ||
                  suggestion.district.includes('红谷滩') ||
                  suggestion.district.includes('东湖') ||
                  suggestion.district.includes('西湖') ||
                  suggestion.district.includes('青山湖') ||
                  suggestion.district.includes('青云谱') ||
                  suggestion.district.includes('新建') ||
                  suggestion.district.includes('经开') ||
                  suggestion.district.includes('高新')
                )) ||
                (suggestion.address && suggestion.address.includes('南昌'));
              
              return hasNanchang;
            });
            
            console.log(`   南昌地区过滤后: ${filteredSuggestions.length}条`);
          }
        });

        console.log('✅ 搜索自动完成功能初始化成功');
      });
    } catch (error) {
      console.error('❌ 初始化搜索功能时出错:', error);
    }
  }

  /**
   * 搜索地点
   */
  onSearchInput(): void {
    if (!this.searchQuery || this.searchQuery.trim().length < 2) {
      this.searchResults = [];
      this.showSearchResults = false;
      return;
    }

    this.searchLoading = true;
    this.showSearchResults = true;

    // 使用自动完成搜索
    this.autoComplete.search(this.searchQuery, (status: string, result: any) => {
      this.searchLoading = false;

      if (status === 'complete' && result.tips) {
        // 过滤出有效的搜索结果
        this.searchResults = result.tips.filter((tip: any) => 
          tip.location && tip.location.lng && tip.location.lat
        ).slice(0, 10); // 最多显示10条结果

        console.log('搜索结果:', this.searchResults);
      } else {
        this.searchResults = [];
        console.warn('搜索失败或无结果');
      }
    });
  }

  /**
   * 选择搜索结果
   */
  selectSearchResult(result: any): void {
    console.log('选择搜索结果:', result);

    if (result.location) {
      const location: [number, number] = [result.location.lng, result.location.lat];
      
      // 地图定位到该位置
      this.map.setZoomAndCenter(15, location);

      // 添加目的地标记
      this.addDestinationMarker(location, result.name);

      // 清空搜索
      this.clearSearch();

      // 可选：自动规划路线
      if (confirm(`是否规划从当前位置到"${result.name}"的路线？`)) {
        this.planRoute(location, result.name);
      }
    }
  }

  /**
   * 添加目的地标记
   */
  private addDestinationMarker(location: [number, number], name: string): void {
    // 移除旧的目的地标记
    if (this.destinationMarker) {
      this.map.remove(this.destinationMarker);
    }

    // 创建目的地标记（红色）
    this.destinationMarker = new AMap.Marker({
      position: new AMap.LngLat(location[0], location[1]),
      icon: this.getDestinationIcon(),
      offset: new AMap.Pixel(-13, -40),
      title: name,
      zIndex: 999
    });

    // 添加信息窗体
    const infoWindow = new AMap.InfoWindow({
      content: `
        <div style="padding: 12px;">
          <h4 style="margin: 0 0 8px 0; color: #e74c3c; font-size: 16px;">📍 ${name}</h4>
          <button onclick="window.planRouteFromMarker()" style="
            padding: 8px 16px;
            background: linear-gradient(135deg, #3498db, #2980b9);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            width: 100%;
          ">🚗 规划路线</button>
        </div>
      `,
      offset: new AMap.Pixel(0, -40)
    });

    this.destinationMarker.on('click', () => {
      infoWindow.open(this.map, this.destinationMarker.getPosition());
    });

    this.map.add(this.destinationMarker);

    // 全局方法供信息窗体调用
    (window as any).planRouteFromMarker = () => {
      this.planRoute(location, name);
    };
  }

  /**
   * 获取目的地图标（红色地标）
   */
  private getDestinationIcon(): string {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="40" viewBox="0 0 26 40">
        <path fill="#e74c3c" d="M13 0C5.82 0 0 5.82 0 13c0 10 13 27 13 27s13-17 13-27c0-7.18-5.82-13-13-13z"/>
        <circle cx="13" cy="13" r="7" fill="white"/>
        <text x="13" y="17" text-anchor="middle" font-size="12" fill="#e74c3c">📍</text>
      </svg>`
    )}`;
  }

  /**
   * 清空搜索
   */
  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults = [];
    this.showSearchResults = false;
  }

  /**
   * 搜索附近的地点（按分类）
   */
  searchNearby(keyword: string): void {
    if (!this.map) return;

    this.searchLoading = true;

    AMap.plugin(['AMap.PlaceSearch'], () => {
      const placeSearch = new AMap.PlaceSearch({
        city: this.currentCity,
        pageSize: 20,
        pageIndex: 1
      });

      placeSearch.searchNearBy(
        keyword,
        this.currentLocation,
        5000, // 搜索半径5000米
        (status: string, result: any) => {
          this.searchLoading = false;

          if (status === 'complete' && result.poiList && result.poiList.pois) {
            const pois = result.poiList.pois;
            console.log(`找到${pois.length}个附近的"${keyword}"`, pois);

            // 在地图上显示搜索结果
            this.showNearbyResults(pois);
          } else {
            console.warn('附近搜索失败或无结果');
          }
        }
      );
    });
  }

  /**
   * 在地图上显示附近搜索结果
   */
  private showNearbyResults(pois: any[]): void {
    // 清除之前的搜索结果标记
    // 这里可以添加额外的标记逻辑
    console.log('显示附近搜索结果:', pois);
  }

  // ========== 导航和路线规划功能 ==========

  /**
   * 初始化驾车路线规划
   */
  private initDriving(): void {
    try {
      AMap.plugin(['AMap.Driving'], () => {
        this.driving = new AMap.Driving({
          map: this.map,
          panel: 'route-panel', // 路线详情面板的ID
          autoFitView: true, // 自动调整地图视野
          hideMarkers: false, // 显示起终点标记
          showTraffic: true // 显示实时路况
        });

        console.log('✅ 驾车路线规划功能初始化成功');
      });
    } catch (error) {
      console.error('初始化路线规划时出错:', error);
    }
  }

  /**
   * 规划路线
   */
  planRoute(destination: [number, number], destinationName: string): void {
    if (!this.driving) {
      console.error('路线规划功能未初始化');
      return;
    }

    this.isNavigating = true;
    this.showRoutePanel = true;

    console.log(`🚗 开始规划路线：从当前位置到 ${destinationName}`);

    // 清除之前的路线
    this.clearRoute();

    // 规划驾车路线
    this.driving.search(
      new AMap.LngLat(this.currentLocation[0], this.currentLocation[1]),
      new AMap.LngLat(destination[0], destination[1]),
      (status: string, result: any) => {
        if (status === 'complete') {
          console.log('✅ 路线规划成功', result);
          
          if (result.routes && result.routes.length > 0) {
            const route = result.routes[0];
            this.routeInfo = {
              distance: route.distance, // 距离（米）
              time: route.time, // 时间（秒）
              destinationName: destinationName,
              tolls: route.tolls || 0, // 过路费
              tollDistance: route.toll_distance || 0, // 收费路段距离
              trafficLights: route.traffic_lights || 0 // 红绿灯数量
            };

            console.log('路线信息:', this.routeInfo);
            
            // ✅ 语音播报导航信息
            this.speakNavigationInfo(route, destinationName);
          }
        } else if (status === 'no_data') {
          console.warn('❌ 路线规划失败：无法找到路线');
          alert('无法规划路线，可能是起点和终点距离太远或无可达路径');
          this.clearRoute();
        } else {
          console.error('❌ 路线规划失败:', status, result);
          alert('路线规划失败，请稍后重试');
          this.clearRoute();
        }
      }
    );
  }

  /**
   * 规划到回收点的路线
   */
  planRouteToPoint(point: RecyclePoint): void {
    this.planRoute(point.location, point.name);
  }

  /**
   * 清除路线
   */
  clearRoute(): void {
    if (this.driving) {
      this.driving.clear();
    }
    this.isNavigating = false;
    this.showRoutePanel = false;
    this.routeInfo = null;
  }

  /**
   * 语音播报导航信息
   */
  private speakNavigationInfo(route: any, destinationName: string): void {
    try {
      // 检查浏览器是否支持语音合成
      if (!('speechSynthesis' in window)) {
        console.warn('⚠️ 浏览器不支持语音播报');
        return;
      }

      const synthesis = window.speechSynthesis;
      
      // 取消之前的播报
      synthesis.cancel();

      // 计算距离和时间
      const distanceKm = (route.distance / 1000).toFixed(1);
      const minutes = Math.floor(route.time / 60);
      const hours = Math.floor(minutes / 60);
      const remainMinutes = minutes % 60;

      // 构建播报文本
      let text = `导航路线规划成功。`;
      text += `前往${destinationName}，`;
      
      // 距离
      if (route.distance < 1000) {
        text += `距离${route.distance}米，`;
      } else {
        text += `距离${distanceKm}公里，`;
      }
      
      // 时间
      if (hours > 0) {
        text += `预计需要${hours}小时`;
        if (remainMinutes > 0) {
          text += `${remainMinutes}分钟。`;
        } else {
          text += `。`;
        }
      } else {
        text += `预计需要${minutes}分钟。`;
      }

      // 额外信息
      if (route.traffic_lights && route.traffic_lights > 0) {
        text += `途经${route.traffic_lights}个红绿灯。`;
      }

      if (route.tolls && route.tolls > 0) {
        text += `需收费约${route.tolls}元。`;
      }

      text += `请开始导航。`;

      console.log('🔊 语音播报:', text);

      // 创建语音对象
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN'; // 设置为中文
      utterance.rate = 1.0; // 语速
      utterance.pitch = 1.0; // 音调
      utterance.volume = 1.0; // 音量

      // 播报完成后的回调
      utterance.onend = () => {
        console.log('✅ 语音播报完成');
      };

      // 播报错误的回调
      utterance.onerror = (event) => {
        console.error('❌ 语音播报失败:', event);
      };

      // 开始播报
      synthesis.speak(utterance);
      
    } catch (error) {
      console.error('❌ 语音播报出错:', error);
    }
  }

  /**
   * 关闭路线面板
   */
  closeRoutePanel(): void {
    this.showRoutePanel = false;
    
    // 停止语音播报
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  /**
   * 格式化路线时间
   */
  formatRouteTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes}分钟`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainMinutes = minutes % 60;
      return `${hours}小时${remainMinutes}分钟`;
    }
  }

  /**
   * 格式化路线距离
   */
  formatRouteDistance(meters: number): string {
    if (meters < 1000) {
      return `${Math.round(meters)}米`;
    } else {
      return `${(meters / 1000).toFixed(1)}公里`;
    }
  }
}

