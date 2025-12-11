// navigation.ts：手机端导航组件
// 功能描述：实现符合大厂UI规范的导航界面，包含两种状态切换：底部状态和顶部状态
// 集成高德地图API，实现地图展示、控件添加、输入提示和IP定位功能
import {Component, ElementRef, ViewChild, AfterViewInit, signal, output, ChangeDetectorRef, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

// 声明AMap全局变量以提供TypeScript支持
declare const AMap: any;

/**
 * NavigationComponent：手机端导航组件
 * 功能描述：
 * - 实现符合大厂UI规范的导航界面，支持底部和顶部两种输入框状态切换
 * - 集成高德地图API，提供地图展示、搜索提示、路线规划等功能
 * - 支持IP定位、HTML5定位，实现精确的位置服务
 * - 优化搜索体验，包含历史记录、距离计算、搜索结果排序等功能
 */
@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss'
})
export class Navigation implements AfterViewInit {
  /** 控制输入框位置状态：true表示在顶部，false表示在底部 */
  isInputBoxAtTop = signal(false);

  /** 搜索关键词双向绑定 */
  searchKeyword = '';

  /** 搜索提示结果数组 */
  searchSuggestions: any[] = [];

  /** 历史记录数据，存储用户最近搜索的地址 */
  historyItems = [
    '北京市朝阳区',
    '上海市浦东新区',
    '广州市天河区',
    '深圳市南山区',
    '杭州市西湖区'
  ];

  /** 获取顶部输入框容器元素引用 */
  @ViewChild('topInputContainer', {static: false}) topInputContainer!: ElementRef;
  /** 获取底部输入框容器元素引用 */
  @ViewChild('bottomInputContainer', {static: false}) bottomInputContainer!: ElementRef;
  /** 获取历史记录面板元素引用 */
  @ViewChild('historyPanel', {static: false}) historyPanel!: ElementRef;
  /** 获取顶部输入框元素引用 */
  @ViewChild('topInput', {static: false}) topInput!: ElementRef;

  /** 高德地图实例 */
  private map: any;
  /** 高德地图输入提示服务实例 */
  private autoComplete: any;
  /** 高德地图定位服务实例 */
  private geolocation: any;
  /** 当前城市名称 */
  private currentCity: string = '';
  /** 搜索防抖定时器 */
  private debounceTimer: any;
  /** 存储地图上的定位标记点 */
  private locationMarker: any = null;
  /** 控制路线按钮是否显示 */
  showRouteButton = false;
  /** 控制路线规划面板是否显示 */
  showRoutePanel = false;
  /** 路线规划类型：driving(驾车), walking(步行), bus(公交) */
  routeType = 'driving';
  /** 路线规划结果数据 */
  routeResult: any = null;
  /** 当前选择的目标位置信息 */
  currentTarget: any = null;
  /** 当前位置坐标 - 设置默认值为北京坐标 */
  private currentLocation: any = [116.397428, 39.90923]; // 默认北京天安门坐标

  /**
   * 构造函数
   * @param cdr ChangeDetectorRef服务，用于手动触发变更检测
   */
  constructor(
    private cdr: ChangeDetectorRef,
    @Inject('AMAP_LOCATION_CONFIG') private config: any
  ) {
    // 在构造函数中初始化防抖定时器
    this.debounceTimer = null;
  }

  /**
   * 生命周期钩子：视图初始化完成后调用
   * 功能：初始化高德地图和相关组件
   */
  ngAfterViewInit() {
    // 加载高德地图API
    this.loadAMapAPI();
  }

  /**
   * 加载高德地图API
   */
  private loadAMapAPI(): void {
    try {
      // 配置安全密钥
      (window as any)._AMapSecurityConfig = {
        securityJsCode: this.config.securityJsCode || ''
      };

      // 动态加载高德地图API脚本
      const script = document.createElement('script');
      script.src = `https://webapi.amap.com/maps?v=2.0&key=${this.config.key}&plugin=AMap.CitySearch,AMap.ToolBar,AMap.Scale,AMap.Geolocation,AMap.AutoComplete,AMap.Driving,AMap.Walking,AMap.Transfer`;
      script.onload = () => {
        console.log('高德地图API加载成功');
        // API加载成功后初始化地图
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
   * 功能：创建地图实例，设置默认中心点和缩放级别，并初始化地图控件和定位功能
   */
  private initMap(): void {
    // 创建地图实例
    this.map = new AMap.Map('amap-container', {
      zoom: 11,           // 默认缩放级别
      center: [116.397428, 39.90923] // 默认中心点（北京天安门）
    });

    // 添加地图控件（缩放、比例尺、定位等）
    this.addMapControls();

    // 初始化IP定位，获取用户当前城市信息
    this.initIPLocation();
  }

  /**
   * 添加地图控件
   * 功能：添加缩放控件、比例尺控件和定位控件到地图上
   * 每个控件都经过位置优化，避免与界面元素重叠
   */
  private addMapControls(): void {
    // 添加缩放控件
    AMap.plugin(['AMap.ToolBar'], () => {
      const toolBar = new AMap.ToolBar({
        offset: [20, 150], // 调整位置避免与输入框重叠
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

    // 添加定位控件（仅用于获取精确坐标，城市信息通过CitySearch获取）
    AMap.plugin(['AMap.Geolocation'], () => {
      this.geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,
        showMarker: true,
        maximumAge: 1000000000,
        timeout: 10000,
        offset: [20, 90], // 调整位置避免与输入框重叠
        position: 'RB',
        zoomToAccuracy: true
      });

      this.map.addControl(this.geolocation);

      // 获取当前位置
      this.geolocation.getCurrentPosition((status: string, result: any) => {
        try {
          if (status === 'complete' && result.position) {
            // 保存HTML5定位的精确坐标
            this.currentLocation = result.position;
            console.log('HTML5定位成功获取坐标:', this.currentLocation);
            console.log('定位精度:', result.accuracy);

            // 注意：城市信息主要通过AMap.CitySearch获取，这里仅获取坐标
            // HTML5定位主要用于获取精确位置，不依赖它获取城市信息
            console.log('HTML5定位结果:', result);

            // 如果有定位成功回调，也可以在这里触发重新计算距离
            if (this.searchSuggestions.length > 0 && this.searchKeyword) {
              console.log('定位成功后重新计算搜索结果距离...');
              this.onSearchKeywordChange();
            }
          } else {
            console.warn('HTML5定位失败，将继续使用IP定位结果:', result.message || '未知错误');
          }
        } catch (error) {
          console.error('处理HTML5定位结果时出错:', error);
          // 即使定位处理出错也不中断程序
        }
      });
    });
  }

  /**
   * 初始化IP定位功能
   * 功能：
   * - 使用AMap.CitySearch获取用户城市信息
   * - 标准化城市名称，去除末尾的"市"字
   * - 设置地图中心点为用户城市中心
   * - 容错处理：定位失败时默认使用南昌作为城市
   * - 初始化输入提示功能，确保搜索范围限制在当前城市
   */
  private initIPLocation(): void {
    try {
      // 使用高德地图的IP定位服务
      AMap.plugin(['AMap.CitySearch'], () => {
        const citySearch = new AMap.CitySearch();

        // 使用getLocalCity方法获取用户城市信息
        citySearch.getLocalCity((status: string, result: any) => {
          try {
            console.log('CitySearch.getLocalCity结果:', {status, result});

            if (status === 'complete' && result.info === 'OK' && result.city) {
              // 处理城市名称，去除末尾的"市"字
              let cityName = result.city;
              cityName = cityName.replace(/市$/, '');
              this.currentCity = cityName;

              // 保存当前城市中心坐标并设置地图中心点
              if (result.center && Array.isArray(result.center) && result.center.length === 2) {
                // 只有当center有效时才设置地图中心点
                this.map.setCenter(result.center);
                this.currentLocation = result.center;
              }

              console.log('当前城市:', result.city);
              console.log('标准化后的城市名:', this.currentCity);
              console.log('当前城市中心坐标:', this.currentLocation);
              console.log('IP定位城市编码:', result.citycode);

              // 强制使用南昌作为搜索城市，确保搜索结果只显示南昌地区
              console.log('强制使用南昌作为搜索城市');
              this.currentCity = '南昌';
              // 设置南昌的精确中心坐标
              this.currentLocation = [115.892151, 28.676493];
              this.map.setCenter(this.currentLocation);
            } else {
              console.warn('IP定位失败或无结果，status:', status, 'info:', result?.info || '未知');
              // IP定位失败时，使用南昌作为默认城市
              console.log('使用默认城市：南昌');
              this.currentCity = '南昌';
              // 设置南昌的中心坐标 [115.892151, 28.676493]
              this.currentLocation = [115.892151, 28.676493];
              this.map.setCenter(this.currentLocation);
            }

            console.log('最终搜索城市:', this.currentCity);
            console.log('最终定位坐标:', this.currentLocation);

            // 无论定位成功与否，都初始化输入提示
            this.initAutoComplete();
          } catch (error) {
            console.error('处理CitySearch结果时出错:', error);
            // 设置默认值并继续初始化
            this.currentCity = '南昌';
            this.currentLocation = [115.892151, 28.676493];
            this.map.setCenter(this.currentLocation);
            this.initAutoComplete();
          }
        });
      });
    } catch (error) {
      console.error('初始化CitySearch时出错:', error);
      // 设置默认值并继续初始化
      this.currentCity = '南昌';
      this.currentLocation = [115.892151, 28.676493];
      this.map.setCenter(this.currentLocation);
      this.initAutoComplete();
    }
  }

  /**
   * 初始化输入提示功能
   * 功能：
   * - 创建高德地图输入提示服务实例
   * - 限制搜索范围在当前城市
   * - 设置搜索类型为全类型POI
   * - 监听输入提示选择事件和结果事件
   * - 增强城市名称过滤，严格限制只保留南昌地区的结果
   * - 包含错误处理，确保即使初始化失败也有友好的错误信息
   */
  private initAutoComplete(): void {
    if (!this.topInput || !this.topInput.nativeElement) {
      console.error('输入框元素未找到，无法初始化搜索功能');
      return;
    }

    // 添加输入提示插件
    try {
      AMap.plugin(['AMap.AutoComplete'], () => {
        // 如果没有获取到当前城市，默认使用'南昌'
        const initCity = this.currentCity || '南昌';
        console.log('初始化AutoComplete使用的城市:', initCity);

        this.autoComplete = new AMap.AutoComplete({
          input: '', // 不绑定输入框，避免显示官方默认提示
          city: initCity, // 限制在当前城市范围内
          citylimit: true, // 强制限制在当前城市
          type: 'all', // 查询所有类型的POI
          output: 'all' // 返回详细信息
        });

        // 监听输入提示选中事件
        this.autoComplete.on('select', (data: any) => {
          console.log('选中的地址:', data);
          // 兼容不同数据格式
          this.searchKeyword = data.poi ? data.poi.name : data.name;
          this.searchSuggestions = [];

          // 确保选中地址时也使用正确的城市限制
          console.log('选中地址时使用的城市:', this.currentCity);
          // 可以在这里进一步验证选中的地址是否在当前城市范围内
        });

        // 监听输入提示结果事件
        this.autoComplete.on('complete', (data: any) => {
          console.log('输入提示结果:', data);
          // 验证结果是否包含城市信息，确保是南昌地区
          const suggestions = data.tips || [];
          console.log('原始建议数量:', suggestions.length);

          // 增强城市名称过滤，严格限制只保留南昌地区的结果
          const nanchangSuggestions = suggestions.filter((suggestion: any) => {
            // 检查建议项中是否包含南昌相关信息
            const hasNanchang =
              (suggestion.district && (suggestion.district.includes('南昌') || suggestion.district.includes('红谷滩') ||
                suggestion.district.includes('东湖') || suggestion.district.includes('西湖') ||
                suggestion.district.includes('青山湖') || suggestion.district.includes('青云谱'))) ||
              (suggestion.address && (suggestion.address.includes('南昌') ||
                // 对于地址中不包含城市名称但在南昌地区的结果
                (suggestion.poiaddress && suggestion.poiaddress.includes('南昌市')))) ||
              // 对于没有地区信息但确实在南昌的结果，使用距离过滤
              (!suggestion.district && !suggestion.address && suggestion.location);

            // 额外检查：排除明显不在南昌的结果
            const isNotInNanchang =
              (suggestion.district && (suggestion.district.includes('吉林') || suggestion.district.includes('通化') ||
                suggestion.district.includes('梅河口') || suggestion.district.includes('省外'))) ||
              (suggestion.address && (suggestion.address.includes('吉林') || suggestion.address.includes('通化') ||
                suggestion.address.includes('梅河口')));

            return hasNanchang && !isNotInNanchang;
          });

          console.log('南昌地区过滤后建议数量:', nanchangSuggestions.length);

          // 处理搜索结果，添加距离信息并排序
          this.enrichSuggestionsWithDistance(nanchangSuggestions);
        });

        // 监听输入提示错误事件
        this.autoComplete.on('error', (error: any) => {
          console.error('输入提示错误:', error);
          this.searchSuggestions = [];
        });
      });
    } catch (error) {
      console.error('初始化AutoComplete失败:', error);
    }
  }

  /**
   * 处理搜索关键词变化
   * 功能：
   * - 实现搜索防抖功能（300ms延迟），优化性能
   * - 清空无效关键词的搜索建议
   * - 构建搜索参数，确保city参数正确传递
   * - 设置城市编码和搜索半径，提高结果准确性
   * - 处理各种错误情况，提供友好的错误提示
   * - 调用enrichSuggestionsWithDistance方法为搜索结果添加距离信息并排序
   */
  onSearchKeywordChange(): void {
    console.log('\n===== 搜索关键词变化 =====');
    console.log('新的搜索关键词:', this.searchKeyword);
    console.log('当前城市:', this.currentCity);

    // 清除之前的定时器
    if (this.debounceTimer) {
      console.log('清除之前的搜索定时器');
      clearTimeout(this.debounceTimer);
    }

    // 如果关键词为空，清空建议列表
    if (!this.searchKeyword.trim()) {
      console.log('搜索关键词为空，清空建议列表');
      this.searchSuggestions = [];
      this.cdr.markForCheck();
      return;
    }

    // 设置300ms的防抖定时器（降低延迟提高响应速度）
    console.log('设置300ms防抖定时器');
    this.debounceTimer = setTimeout(() => {
      console.log('执行搜索请求...');

      // 如果autoComplete未初始化，尝试重新初始化
      if (!this.autoComplete && this.topInput && this.topInput.nativeElement) {
        console.log('autoComplete未初始化，尝试重新初始化');
        this.initAutoComplete();
      }

      if (this.autoComplete) {
        console.log('AutoComplete实例存在，执行搜索');
        try {
          // 构建搜索参数，确保city参数正确传递
          // 如果没有获取到当前城市，设置为'南昌'作为默认值
          const searchCity = this.currentCity || '南昌';
          console.log('实际使用的搜索城市:', searchCity);

          const searchOptions = {
            city: searchCity,
            citylimit: true,
            // 增加extensions参数以获取更详细的信息
            extensions: 'all',
            // 明确指定城市编码，确保只返回南昌的数据
            citycodes: '360100', // 南昌的城市编码
            // 添加区域限制，确保结果更精准
            location: this.currentLocation, // 使用南昌中心坐标作为搜索中心点
            radius: 50000, // 搜索半径（米），设置为50公里，限制搜索范围在城市内
            // 增加类型过滤，提高结果相关性
            type: 'all'
          }
          console.log('搜索参数:', {
            keyword: this.searchKeyword,
            options: searchOptions
          });

          this.autoComplete.search(this.searchKeyword, searchOptions, (status: string, result: any) => {
            console.log('搜索返回结果:');
            console.log('  状态:', status);
            console.log('  结果数据:', result);
            console.log('  建议数量:', result.tips?.length || 0);

            if (status === 'complete') {
              console.log('搜索成功，开始处理建议项...');
              // 处理搜索结果，添加距离信息并排序
              const suggestions = result.tips || [];
              this.enrichSuggestionsWithDistance(suggestions);
              // 强制触发变更检测
              this.cdr.markForCheck();
              console.log('已触发变更检测');
            } else {
              // 处理各种错误情况
              let errorMessage = '搜索失败';
              if (result === 'INVALID_USER_SCODE') {
                errorMessage = '高德地图API密钥无效，请检查index.html中的配置';
                console.error('高德地图API错误：密钥无效');
              } else {
                errorMessage = result?.info || '未知错误';
              }
              console.error('输入提示失败:', errorMessage);

              // 显示空结果，不使用模拟数据
              this.searchSuggestions = [];
              this.cdr.markForCheck();
              console.log('已触发变更检测（错误状态）');

              // 可以在这里添加用户友好的错误提示
              // 注释掉alert以避免频繁弹窗
              // alert(`搜索出错：${errorMessage}`);
            }
          });
        } catch (error) {
          console.error('搜索执行异常:', error);
          this.searchSuggestions = [];
          this.cdr.markForCheck();
          console.log('已触发变更检测（异常状态）');
          // 注释掉alert以避免频繁弹窗
          // alert('搜索功能暂时不可用，请稍后再试');
        }
      } else {
        console.log('autoComplete仍未初始化');
        this.searchSuggestions = [];
        this.cdr.markForCheck();
        console.log('已触发变更检测（未初始化状态）');
        // 注释掉alert以避免频繁弹窗
        // alert('搜索功能正在初始化，请稍后再试');
      }
    }, 300);
  }

  /**
   * 为搜索建议添加距离信息并按距离和相似度排序
   * 功能：
   * - 支持两种坐标格式：数组格式[lng, lat]和对象格式{lng, lat}
   * - 对每个搜索建议项计算与当前位置的距离
   * - 使用Haversine公式计算球面两点间距离
   * - 按距离升序排序，距离相同时按相似度降序排序
   * - 距离过滤：严格限制只保留距离小于等于50公里的结果
   * - 增强城市名称过滤，确保只显示南昌地区的结果
   * - 强制触发变更检测，更新UI显示
   */
  private enrichSuggestionsWithDistance(suggestions: any[]): void {
    console.log('===== 开始处理搜索建议，数量:', suggestions?.length);

    if (!suggestions || suggestions.length === 0) {
      console.log('没有搜索建议，清空结果');
      this.searchSuggestions = [];
      return;
    }

    // 打印当前位置信息
    console.log('当前位置currentLocation:', this.currentLocation);
    console.log('当前位置类型:', typeof this.currentLocation);
    console.log('当前位置是否为数组:', Array.isArray(this.currentLocation));
    if (Array.isArray(this.currentLocation)) {
      console.log('当前位置数组长度:', this.currentLocation.length);
      console.log('坐标值:', this.currentLocation[0], this.currentLocation[1]);
    }

    // 支持两种坐标格式：数组格式 [lng, lat] 或对象格式 {lng: number, lat: number}
    let validLocation = false;
    let currentLocationPoint: number[] = [];

    // 检查是否为数组格式
    if (Array.isArray(this.currentLocation) && this.currentLocation.length === 2 && !isNaN(this.currentLocation[0]) && !isNaN(this.currentLocation[1])) {
      validLocation = true;
      currentLocationPoint = this.currentLocation;
      console.log('当前位置为数组格式，有效');
    }
    // 检查是否为对象格式（AMap.LngLat或其他带有lng/lat属性的对象）
    else if (this.currentLocation && typeof this.currentLocation === 'object' &&
      this.currentLocation.lng !== undefined && this.currentLocation.lat !== undefined &&
      !isNaN(this.currentLocation.lng) && !isNaN(this.currentLocation.lat)) {
      validLocation = true;
      currentLocationPoint = [this.currentLocation.lng, this.currentLocation.lat];
      console.log('当前位置为对象格式，有效');
      console.log('提取的坐标点:', currentLocationPoint);
    }

    // 预处理所有建议项，确保rawDistance有默认值
    suggestions.forEach(suggestion => {
      // 确保每个建议项都有rawDistance属性，初始化为Infinity
      if (suggestion.rawDistance === undefined || suggestion.rawDistance === null) {
        suggestion.rawDistance = Infinity;
      }
    });

    // 如果有当前位置坐标，计算每个建议项的距离
    if (validLocation) {
      console.log('开始计算每个建议项的距离...');

      suggestions.forEach((suggestion, index) => {
        console.log(`\n处理建议项${index + 1}:`, suggestion.name);
        console.log('建议项location:', suggestion.location);
        console.log('建议项location类型:', typeof suggestion.location);

        if (suggestion.location) {
          // 处理不同格式的location对象
          let locationPoint: number[] = [];

          // 检查location是否为对象并有lng/lat属性
          if (suggestion.location.lng !== undefined && suggestion.location.lat !== undefined) {
            console.log('检测到location为对象格式，提取lng/lat');
            locationPoint = [suggestion.location.lng, suggestion.location.lat];
          }
          // 或者是数组格式
          else if (Array.isArray(suggestion.location)) {
            console.log('检测到location为数组格式');
            locationPoint = suggestion.location;
          } else {
            console.warn(`建议项${index + 1}的location格式不支持:`, suggestion.location);
          }

          console.log('提取的locationPoint:', locationPoint);

          if (locationPoint.length === 2 && !isNaN(locationPoint[0]) && !isNaN(locationPoint[1])) {
            try {
              // 计算两点之间的距离
              console.log('开始计算距离...');
              console.log('起点坐标:', currentLocationPoint);
              console.log('终点坐标:', locationPoint);

              const distance = this.calculateDistance(currentLocationPoint, locationPoint);
              const formattedDistance = this.formatDistance(distance);

              console.log(`计算完成，距离: ${distance}米, 格式化后: ${formattedDistance}`);

              // 格式化距离显示
              suggestion.distance = formattedDistance;
              // 保存原始距离用于排序
              suggestion.rawDistance = distance;
            } catch (error) {
              console.error(`计算距离时出错:`, error);
              suggestion.distance = '';
              suggestion.rawDistance = Infinity;
            }
          } else {
            console.warn(`locationPoint无效，无法计算距离:`, locationPoint);
            suggestion.distance = '';
            suggestion.rawDistance = Infinity;
          }
        } else {
          console.warn(`建议项${index + 1}没有location属性`);
          suggestion.distance = '';
          suggestion.rawDistance = Infinity;
        }
      });
    } else {
      console.warn('当前位置信息无效，无法计算距离');
      // 如果没有有效的当前位置，设置默认值
      suggestions.forEach(suggestion => {
        suggestion.distance = '';
        suggestion.rawDistance = Infinity;
      });
    }

    // 按距离和相似度排序（优先按距离排序，距离相同时按相似度）
    console.log('\n开始排序搜索建议...');
    console.log('排序前的建议列表（显示部分字段）:');
    suggestions.forEach((s, i) => console.log(`  ${i + 1}: ${s.name}, 距离: ${s.rawDistance}米, 权重: ${s.weight || 0}`));

    suggestions.sort((a, b) => {
      // 距离升序
      if (a.rawDistance !== b.rawDistance) {
        return a.rawDistance - b.rawDistance;
      }
      // 相似度降序
      return (b.weight || 0) - (a.weight || 0);
    });

    console.log('排序后的建议列表（显示部分字段）:');
    suggestions.forEach((s, i) => console.log(`  ${i + 1}: ${s.name}, 距离: ${s.rawDistance}米, 权重: ${s.weight || 0}`));

    // 距离过滤：严格限制只保留距离小于等于50公里的结果
    // 这是一个额外的保险机制，确保只显示南昌本地结果
    const filteredSuggestions = suggestions.filter(suggestion => {
      // 严格限制：只有距离信息有效且小于等于50公里的结果才保留
      // 对于没有距离信息的结果，需要额外判断是否在南昌地区
      if (suggestion.rawDistance === Infinity) {
        // 如果没有距离信息，检查地址或区域信息是否包含南昌
        return (suggestion.district && (suggestion.district.includes('南昌') ||
            suggestion.district.includes('红谷滩') ||
            suggestion.district.includes('东湖') ||
            suggestion.district.includes('西湖') ||
            suggestion.district.includes('青山湖') ||
            suggestion.district.includes('青云谱'))) ||
          (suggestion.address && suggestion.address.includes('南昌'));
      }
      // 距离小于等于50公里的结果保留
      return suggestion.rawDistance <= 50000; // 50000米 = 50公里
    });

    console.log('\n距离过滤后建议数量:', filteredSuggestions.length, '(过滤前:', suggestions.length, ')');
    filteredSuggestions.forEach((s, i) => console.log(`  ${i + 1}: ${s.name}, 距离: ${s.rawDistance}米`));

    // 更新建议列表
    this.searchSuggestions = [...filteredSuggestions];
    console.log('searchSuggestions已更新:', this.searchSuggestions.length, '项');
    // 强制触发变更检测
    this.cdr.markForCheck();
    console.log('已触发变更检测');
  }


  /**
   * 计算两点之间的距离（单位：米）
   * 功能：
   * - 使用Haversine公式计算球面两点间距离，适用于地球表面上的坐标计算
   * - 包含参数验证，确保输入坐标有效
   * - 将经纬度转换为弧度进行计算
   * - 返回两点间的直线距离（单位：米）
   * @param point1 第一个点的坐标，格式为[经度, 纬度]
   * @param point2 第二个点的坐标，格式为[经度, 纬度]
   * @returns 两点间距离（米）
   */
  private calculateDistance(point1: number[], point2: number[]): number {
    console.log('调用calculateDistance方法:');
    console.log('  point1:', point1);
    console.log('  point2:', point2);

    // 参数验证
    if (!Array.isArray(point1) || point1.length !== 2 || !Array.isArray(point2) || point2.length !== 2) {
      console.error('calculateDistance参数错误:', {point1, point2});
      return 0;
    }

    // 检查坐标值是否有效
    if (isNaN(point1[0]) || isNaN(point1[1]) || isNaN(point2[0]) || isNaN(point2[1])) {
      console.error('calculateDistance参数包含无效数值:', {point1, point2});
      return 0;
    }

    // 地球半径（单位：米）
    const R = 6371000;

    // 转换为弧度
    const lat1 = point1[1] * Math.PI / 180; // 纬度1（弧度）
    const lat2 = point2[1] * Math.PI / 180; // 纬度2（弧度）
    const latDiff = (point2[1] - point1[1]) * Math.PI / 180; // 纬度差
    const lngDiff = (point2[0] - point1[0]) * Math.PI / 180; // 经度差

    console.log('  转换为弧度后:');
    console.log('    lat1:', lat1);
    console.log('    lat2:', lat2);
    console.log('    latDiff:', latDiff);
    console.log('    lngDiff:', lngDiff);

    // 计算Haversine公式的中间值
    const sinLat = Math.sin(latDiff / 2);
    const sinLng = Math.sin(lngDiff / 2);

    console.log('  Haversine中间值:');
    console.log('    sinLat:', sinLat);
    console.log('    sinLng:', sinLng);

    const a = sinLat * sinLat +
      Math.cos(lat1) * Math.cos(lat2) *
      sinLng * sinLng;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    console.log('  计算结果:', distance, '米');
    return distance;
  }

  /**
   * 格式化距离显示
   * 功能：
   * - 处理无效距离值
   * - 小于1000米时显示为"XX米"
   * - 大于等于1000米时显示为"X.X公里"
   * @param meters 距离（米）
   * @returns 格式化后的距离字符串
   */
  private formatDistance(meters: number): string {
    console.log('调用formatDistance方法:', meters, '米');

    let result = '';
    if (isNaN(meters) || meters < 0) {
      console.warn('无效的距离值:', meters);
      result = '';
    } else if (meters < 1000) {
      result = `${Math.round(meters)}米`;
    } else {
      result = `${(meters / 1000).toFixed(1)}公里`;
    }

    console.log('  格式化结果:', result);
    return result;
  }

  /**
   * 选择搜索建议项
   * 功能：
   * - 设置搜索关键词为选中的建议名称
   * - 清空搜索建议列表
   * - 切换输入框到底部状态
   * - 将地图中心移动到选中地址位置
   * - 添加定位标记点
   * - 保存当前选择的目标位置信息
   * - 显示路线规划按钮
   * @param suggestion 选中的搜索建议项
   */
  selectSuggestion(suggestion: any): void {
    this.searchKeyword = suggestion.name;
    this.searchSuggestions = [];

    // 1. 搜索区域触发返回按钮点击效果
    this.switchToBottomInput();

    // 2. 地图定位至所选提示项对应的位置
    if (suggestion.location) {
      this.map.setCenter(suggestion.location);
      this.map.setZoom(15);

      // 3. 在定位位置显示定位图标
      this.addLocationMarker(suggestion.location, suggestion.name);

      // 4. 保存当前选择的目标位置
      this.currentTarget = {
        name: suggestion.name,
        location: suggestion.location,
        address: suggestion.address || suggestion.name
      };

      // 5. 显示底部按钮区域
      this.showRouteButton = true;
    }
  }

  /**
   * 添加定位标记点
   * 功能：
   * - 如果已有标记点，先移除旧的标记点
   * - 创建新的标记点，设置位置、标题和自定义图标
   * - 调整图标锚点位置，使图标中心对准实际位置
   * - 添加标记点到地图
   * - 为标记点添加点击事件，显示信息窗口
   * @param location 标记点位置坐标
   * @param title 标记点标题
   */
  private addLocationMarker(location: any, title: string): void {
    // 如果已有标记点，先移除
    if (this.locationMarker) {
      this.map.remove(this.locationMarker);
    }

    // 创建新的标记点
    this.locationMarker = new AMap.Marker({
      position: location,
      title: title,
      icon: new AMap.Icon({
        size: new AMap.Size(40, 40),
        image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
        imageSize: new AMap.Size(40, 40)
      }),
      offset: new AMap.Pixel(-20, -40) // 调整图标锚点
    });

    // 添加标记点到地图
    this.map.add(this.locationMarker);

    // 添加标记点点击事件，显示信息窗口
    this.locationMarker.on('click', () => {
      const infoWindow = new AMap.InfoWindow({
        content: `<div style="padding: 10px;">${title}</div>`,
        offset: new AMap.Pixel(0, -30)
      });
      infoWindow.open(this.map, location);
    });
  }

  /**
   * 规划路线
   * 功能：
   * - 检查当前位置和目标位置是否有效
   * - 显示路线规划面板
   * - 自动生成路径规划结果（默认驾车）
   * - 提供错误处理，确保缺少必要位置信息时有友好提示
   */
  planRoute(): void {
    // 修改：不再依赖locationMarker，直接使用currentLocation和currentTarget
    if (this.currentLocation && this.currentTarget && this.currentTarget.location) {
      console.log('planRoute: 准备显示路线规划面板');
      // 显示路线规划面板
      this.showRoutePanel = true;
      // 自动生成路径规划结果（默认驾车）
      this.calculateRoute();
    } else {
      console.error('planRoute: 缺少必要的位置信息', {
        currentLocation: this.currentLocation,
        currentTarget: this.currentTarget
      });
    }
  }

  /**
   * 切换路线规划类型
   * 功能：
   * - 更新路线规划类型
   * - 切换类型后自动重新计算路线
   * @param type 路线类型：driving(驾车), walking(步行), bus(公交)
   */
  switchRouteType(type: string): void {
    this.routeType = type;
    // 切换类型后重新计算路线
    this.calculateRoute();
  }

  /**
   * 计算路线
   * 功能：
   * - 验证起点和终点位置信息是否有效
   * - 支持多种坐标格式的转换和标准化
   * - 处理起点终点过于接近的特殊情况（距离小于100米）
   * - 根据路线类型（驾车、步行、公交）初始化不同的路线规划服务
   * - 设置不同的路线规划策略（时间优先、距离优先等）
   * - 调用performRouteSearch执行实际的路线搜索
   */
  private calculateRoute(): void {
    // 修改：使用当前位置作为起点，而不是标记点位置
    if (!this.currentLocation || !this.currentTarget || !this.currentTarget.location) {
      console.error('缺少必要的位置信息，无法计算路线');
      return;
    }

    // 获取目标位置作为终点
    const endPoint = this.currentTarget.location;

    // 使用当前定位位置作为起点
    // 支持数组格式和对象格式的坐标
    let startPoint;
    if (Array.isArray(this.currentLocation) && this.currentLocation.length === 2) {
      // 数组格式 [lng, lat]
      startPoint = new AMap.LngLat(this.currentLocation[0], this.currentLocation[1]);
    } else if (this.currentLocation && typeof this.currentLocation === 'object' &&
      this.currentLocation.lng !== undefined && this.currentLocation.lat !== undefined) {
      // 对象格式 {lng, lat}
      startPoint = new AMap.LngLat(this.currentLocation.lng, this.currentLocation.lat);
    } else {
      console.error('当前位置格式无效:', this.currentLocation);
      // 使用默认起点（南昌中心）
      startPoint = new AMap.LngLat(115.892151, 28.676493);
    }

    // 检查起点和终点是否相同或过于接近（距离小于100米）
    // calculateDistance函数接受两个数组参数[经度, 纬度]
    const distanceMeters = this.calculateDistance(
      [startPoint.lng, startPoint.lat],
      [endPoint.lng, endPoint.lat]
    ); // 距离（米）

    // 精确到小数点后4位显示公里数，确保显示准确距离
    const distanceKm = distanceMeters / 1000;

    // 只有当距离真正小于100米时才使用默认起点
    if (distanceMeters < 100 && distanceMeters > 0) {
      // 设置一个默认起点，距离终点约500米
      startPoint = new AMap.LngLat(
        endPoint.lng - 0.005, // 经度减去0.005，大约向西移动500米
        endPoint.lat
      );
      console.log(`起点和终点过于接近（${distanceKm.toFixed(4)}公里），使用默认起点`);
    }

    console.log(`开始计算${this.routeType}路线`);
    console.log('起点:', startPoint);
    console.log('终点:', endPoint);
    console.log('起点终点距离:', distanceKm.toFixed(4), '公里'); // 显示更精确的距离

    // 只有当两点完全相同时才提示
    if (startPoint.lng === endPoint.lng && startPoint.lat === endPoint.lat) {
      console.log('起点和终点位置完全相同');
    }

    // 根据路线类型调用不同的路线规划服务
    AMap.plugin([
      'AMap.Driving',  // 驾车
      'AMap.Walking',  // 步行
      'AMap.Transfer'  // 公交
    ], () => {
      try {
        // 清除之前的路线结果
        this.clearRouteOverlays();

        let routeService: any;
        let options: any;

        switch (this.routeType) {
          case 'driving':
            routeService = new AMap.Driving({
              map: this.map,
              panel: 'amap-container',
              showTraffic: true,
              policy: AMap.DrivingPolicy.LEAST_TIME // 添加时间优先策略
            });
            options = {
              origin: startPoint,
              destination: endPoint
            };
            break;

          case 'walking':
            routeService = new AMap.Walking({
              map: this.map,
              panel: 'amap-container',
              policy: AMap.WalkingPolicy.LEAST_DISTANCE // 添加距离优先策略
            });
            options = {
              origin: startPoint,
              destination: endPoint
            };
            break;

          case 'bus':
            routeService = new AMap.Transfer({
              map: this.map,
              panel: 'amap-container',
              policy: AMap.TransferPolicy.LEAST_TIME,  // 时间优先策略
              city: this.currentCity || '南昌'
            });
            options = {
              origin: startPoint,
              destination: endPoint,
              city: this.currentCity || '南昌'
            };
            break;

          default:
            console.error('未知的路线类型:', this.routeType);
            return;
        }

        this.performRouteSearch(routeService, options);
      } catch (error) {
        console.error('初始化路线规划服务失败:', error);
        alert('路线规划服务初始化失败，请重试');
      }
    });
  }

  /**
   * 执行路线搜索
   * 功能：
   * - 验证路线服务实例是否有效
   * - 清除之前的路线覆盖物
   * - 规范化起点和终点坐标格式
   * - 调用高德地图API执行路线搜索
   * - 处理搜索结果，显示路线信息
   * - 自动调整地图视野以显示完整路线
   * - 添加起点和终点标记点
   * - 提供错误处理和用户友好提示
   * @param service 路线服务实例
   * @param options 路线搜索选项（包含origin和destination）
   */
  private performRouteSearch(service: any, options: any): void {
    console.log('开始执行路线搜索:', options);

    // 确保service实例存在且有search方法
    if (!service || typeof service.search !== 'function') {
      console.error('路线规划服务实例无效');
      return;
    }

    // 清除可能存在的旧路线
    this.clearRouteOverlays();

    // 从options中提取起点和终点坐标
    let startPoint, endPoint;
    
    // 根据官方API，需要将起点和终点作为经纬度数组传递
    if (typeof options === 'object' && options.origin && options.destination) {
      // 确保获取到的是经纬度坐标
      if (Array.isArray(options.origin) && options.origin.length >= 2) {
        startPoint = options.origin; // 已经是经纬度数组
      } else if (options.origin.lng !== undefined && options.origin.lat !== undefined) {
        startPoint = [options.origin.lng, options.origin.lat]; // 转换为经纬度数组
      }
      
      if (Array.isArray(options.destination) && options.destination.length >= 2) {
        endPoint = options.destination; // 已经是经纬度数组
      } else if (options.destination.lng !== undefined && options.destination.lat !== undefined) {
        endPoint = [options.destination.lng, options.destination.lat]; // 转换为经纬度数组
      }
      
      console.log('使用经纬度数组形式参数：', { startPoint, endPoint });
    }
    
    // 验证起点终点是否有效
    if (!startPoint || !endPoint) {
      console.error('无效的起点或终点坐标:', { startPoint, endPoint });
      alert('无效的路线规划参数，请重试');
      return;
    }

    // 按照高德地图官方API格式调用：service.search(起点数组, 终点数组, 回调函数)
    service.search(startPoint, endPoint, (status: string, result: any) => {
      console.log('路线规划结果:', {status, result});
      this.routeResult = result;

      if (status === 'complete') {
        console.log('路线规划成功');
        
        // 增加结果数据的详细日志
        console.log('路线结果完整数据:', JSON.stringify(result, null, 2).substring(0, 500) + '...'); // 限制日志长度

        // 确保结果有效
        if (result.routes && result.routes.length > 0) {
          console.log('路线规划返回了', result.routes.length, '条路线');
          console.log('第一条路线详细信息:', {
            distance: result.routes[0].distance,
            duration: result.routes[0].duration,
            steps: result.routes[0].steps ? result.routes[0].steps.length : 0
          });

          // 自动调整地图视野以显示路线
          this.map.setFitView();

          // 显式地添加起点和终点标记（如果API没有自动添加）
          if (this.routeType === 'driving' || this.routeType === 'walking') {
            // 添加起点标记
            const startMarker = new AMap.Marker({
              position: options.origin,
              map: this.map,
              icon: new AMap.Icon({
                image: 'https://webapi.amap.com/theme/v1.3/markers/n/start.png',
                size: new AMap.Size(36, 36),
                imageSize: new AMap.Size(36, 36)
              })
            });

            // 添加终点标记
            const endMarker = new AMap.Marker({
              position: options.destination,
              map: this.map,
              icon: new AMap.Icon({
                image: 'https://webapi.amap.com/theme/v1.3/markers/n/end.png',
                size: new AMap.Size(36, 36),
                imageSize: new AMap.Size(36, 36)
              })
            });
          }
        } else {
          console.warn('路线规划成功但没有返回路线数据');
          alert('未找到合适的路线，请尝试调整起点和终点');
        }
      } else {
        console.error('路线规划失败:', result);
        alert(`路线规划失败: ${result.info || '未知错误'}`);
      }
    });
  }

  /**
   * 清除路线覆盖物
   * 功能：
   * - 获取地图上所有的折线覆盖物
   * - 检查覆盖物是否有效（包含路径点）
   * - 移除所有有效的路线覆盖物
   */
  private clearRouteOverlays(): void {
    if (this.map) {
      const overlays = this.map.getAllOverlays('polyline');
      overlays.forEach((overlay: any) => {
        if (overlay.getPath && overlay.getPath().length > 0) {
          this.map.remove(overlay);
        }
      });
    }
  }

  /**
   * 清空路线规划
   * 功能：
   * - 隐藏路线规划面板
   * - 重置路线规划类型为驾车
   * - 清空路线规划结果数据
   * - 移除地图上所有路线覆盖物
   */
  clearRoute(): void {
    this.showRoutePanel = false;
    this.routeType = 'driving';
    this.routeResult = null;
    // 清除地图上的路线
    if (this.map) {
      // 获取所有覆盖物
      const overlays = this.map.getAllOverlays('polyline');
      // 移除所有路线覆盖物
      overlays.forEach((overlay: any) => {
        if (overlay.getPath && overlay.getPath().length > 0) {
          this.map.remove(overlay);
        }
      });
    }
  }

  /**
   * 切换输入框位置（底部到顶部）
   * 功能：
   * - 更新输入框位置状态为顶部
   * - 使用定时器延迟聚焦输入框，确保动画完成后再聚焦
   */
  switchToTopInput(): void {
    this.isInputBoxAtTop.set(true);
    // 确保动画完成后聚焦输入框
    setTimeout(() => {
      if (this.topInput && this.topInput.nativeElement) {
        this.topInput.nativeElement.focus();
      }
    }, 300);
  }

  /**
   * 切换输入框位置（顶部到底部）
   * 功能：
   * - 更新输入框位置状态为底部
   * - 清空搜索关键词
   * - 清空搜索建议列表
   * - 清空路线规划状态
   * - 隐藏底部路线规划按钮
   */
  switchToBottomInput(): void {
    this.isInputBoxAtTop.set(false);
    this.searchKeyword = '';
    this.searchSuggestions = [];
    // 清空路线规划状态
    this.clearRoute();
    // 隐藏底部按钮区域
    this.showRouteButton = false;
  }

  /**
   * 点击历史记录项
   * 功能：
   * - 设置搜索关键词为选中的历史记录
   * - 清空搜索建议列表
   * - 注：可扩展添加地图移动到历史记录位置的逻辑
   * @param item 选中的历史记录项
   */
  selectHistoryItem(item: string): void {
    this.searchKeyword = item;
    this.searchSuggestions = [];
    // 可以在这里添加地图移动到历史记录位置的逻辑
  }

  /**
   * 清空搜索关键词
   * 功能：
   * - 重置搜索关键词为空字符串
   * - 清空搜索建议列表
   * - 清空路线规划状态
   * - 隐藏底部路线规划按钮
   */
  clearSearchKeyword(): void {
    this.searchKeyword = '';
    this.searchSuggestions = [];
    // 清空路线规划状态
    this.clearRoute();
    // 隐藏底部按钮区域
    this.showRouteButton = false;
  }

  /**
   * 执行搜索
   * 功能：
   * - 验证搜索关键词和自动完成服务是否有效
   * - 执行搜索操作
   * - 如果搜索成功，将地图中心移动到第一个搜索结果位置
   * - 将搜索词添加到历史记录（如果不存在）
   * - 保持历史记录最多5项
   * - 提供错误处理和用户友好提示
   */
  performSearch(): void {
    if (this.searchKeyword.trim() && this.autoComplete) {
      try {
        this.autoComplete.search(this.searchKeyword, (status: string, result: any) => {
          if (status === 'complete' && result.tips && result.tips.length > 0) {
            const firstTip = result.tips[0];
            if (firstTip.location) {
              this.map.setCenter(firstTip.location);
              this.map.setZoom(15);
            }
            // 添加到历史记录（如果不存在）
            if (!this.historyItems.includes(this.searchKeyword)) {
              this.historyItems.unshift(this.searchKeyword);
              // 保持历史记录最多5项
              if (this.historyItems.length > 5) {
                this.historyItems.pop();
              }
            }
          } else if (status === 'error') {
            console.error('搜索执行错误:', result);
            alert('搜索失败，请稍后再试');
          }
          this.searchSuggestions = [];
        });
      } catch (error) {
        console.error('搜索执行异常:', error);
        alert('搜索功能暂时不可用');
        this.searchSuggestions = [];
      }
    }
  }

  /**
   * 清空历史记录
   * 功能：重置历史记录数组为空，清除所有搜索历史
   */
  clearHistory(): void {
    this.historyItems = [];
  }
}
