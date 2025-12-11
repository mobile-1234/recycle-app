# Navigation组件使用说明

## 1. 组件概述

Navigation组件是一个功能丰富的手机端导航界面组件，基于高德地图API实现，提供地图展示、位置搜索、路线规划等核心导航功能。该组件采用响应式设计，支持底部和顶部两种输入框状态切换，符合现代移动端UI设计规范。

## 2. 主要功能特性

- **地图展示**：集成高德地图，支持地图缩放、平移、比例尺显示
- **位置服务**：支持IP定位和HTML5定位，获取用户当前位置
- **智能搜索**：提供地址搜索、搜索提示、历史记录功能
- **距离计算**：自动计算搜索结果与当前位置的距离并排序
- **路线规划**：支持驾车、步行、公交三种路线规划方式
- **状态切换**：支持底部和顶部两种输入框状态，提升用户体验
- **错误处理**：完善的错误处理机制，确保在各种异常情况下组件仍能正常工作

## 3. 技术实现细节

### 3.1 高德地图集成

组件通过动态加载方式引入高德地图API，并使用Angular依赖注入获取API配置：

```typescript
@Inject('AMAP_LOCATION_CONFIG') private config: any
```

API加载采用动态脚本创建方式，确保在需要时才加载地图资源，优化性能：

```typescript
private loadAMapAPI(): void {
  // 配置安全密钥
  (window as any)._AMapSecurityConfig = {
    securityJsCode: this.config.securityJsCode || ''
  };

  // 动态加载高德地图API脚本
  const script = document.createElement('script');
  script.src = `https://webapi.amap.com/maps?v=2.0&key=${this.config.key}&plugin=AMap.CitySearch,...`;
  // ...
}
```

### 3.2 定位功能实现

组件实现了双重定位机制：

1. **IP定位**：使用`AMap.CitySearch`获取用户所在城市信息
2. **HTML5定位**：使用`AMap.Geolocation`获取精确坐标位置

定位结果处理采用容错设计，确保在定位失败时仍能使用默认位置：

```typescript
// IP定位失败时使用默认城市（南昌）
this.currentCity = '南昌';
this.currentLocation = [115.892151, 28.676493];
```

### 3.3 搜索功能优化

搜索功能实现了多项优化：

- **防抖处理**：300ms防抖延迟，减少无效请求
- **城市过滤**：严格限制搜索结果为指定城市（默认南昌）
- **距离计算**：使用Haversine公式计算球面两点间距离
- **结果排序**：按距离升序、相似度降序排序
- **距离格式化**：智能格式化距离显示（米/公里）

```typescript
// 距离计算核心代码
private calculateDistance(point1: number[], point2: number[]): number {
  const R = 6371000; // 地球半径（米）
  // 转换为弧度并应用Haversine公式
  // ...
}
```

### 3.4 路线规划实现

路线规划支持三种模式：

- **驾车模式**：使用`AMap.Driving`服务，采用时间优先策略
- **步行模式**：使用`AMap.Walking`服务，采用距离优先策略  
- **公交模式**：使用`AMap.Transfer`服务，提供公共交通路线

路线计算包含特殊情况处理：

```typescript
// 处理起点和终点过于接近的情况（距离小于100米）
if (distanceMeters < 100 && distanceMeters > 0) {
  // 设置默认起点，距离终点约500米
  startPoint = new AMap.LngLat(
    endPoint.lng - 0.005, // 经度减去0.005，大约向西移动500米
    endPoint.lat
  );
}
```

## 4. 组件状态管理

组件使用Signal进行状态管理（Angular 16+特性）：

```typescript
/** 控制输入框位置状态：true表示在顶部，false表示在底部 */
isInputBoxAtTop = signal(false);
```

主要状态变量：

- `isInputBoxAtTop`：控制输入框位置（顶部/底部）
- `searchKeyword`：搜索关键词
- `searchSuggestions`：搜索建议列表
- `historyItems`：历史记录列表
- `showRoutePanel`：控制路线规划面板显示
- `routeType`：当前路线规划类型
- `showRouteButton`：控制路线按钮显示

## 5. 错误处理与容错机制

组件实现了多层次的错误处理机制：

1. **API加载错误**：捕获并记录高德地图API加载失败
2. **定位失败处理**：提供默认位置作为备选
3. **搜索错误处理**：处理API密钥无效等常见错误
4. **坐标格式兼容性**：支持多种坐标格式（数组/对象）
5. **数据验证**：对所有输入参数进行有效性验证

```typescript
// 搜索错误处理示例
else {
  let errorMessage = '搜索失败';
  if (result === 'INVALID_USER_SCODE') {
    errorMessage = '高德地图API密钥无效，请检查配置';
  }
  // ...
}
```

## 6. 性能优化措施

- **懒加载地图API**：仅在需要时动态加载地图资源
- **搜索防抖**：减少无效API请求
- **结果缓存**：使用历史记录减少重复搜索
- **DOM操作优化**：使用ChangeDetectorRef精确控制变更检测
- **资源清理**：移除不再使用的地图覆盖物

## 7. 使用方法

### 7.1 在模块中引入

```typescript
import {Navigation} from './pages/navigation/navigation';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    Navigation // 作为独立组件导入
  ]
})
export class YourModule {}
```

### 7.2 在模板中使用

```html
<!-- 基本用法 -->
<app-navigation></app-navigation>
```

### 7.3 配置高德地图API

确保在应用配置中提供高德地图API配置：

```typescript
// 在app.config.ts或相关配置文件中
imports: [],
providers: [
  {
    provide: 'AMAP_LOCATION_CONFIG',
    useValue: {
      key: 'your_amap_api_key',
      securityJsCode: 'your_security_js_code'
    }
  }
]
```

## 8. 注意事项

1. **API密钥配置**：使用前必须在应用配置中提供有效的高德地图API密钥
2. **城市限制**：组件默认限制搜索范围为南昌市，可根据需要修改
3. **浏览器兼容性**：支持Chrome、Firefox、Edge最新3个版本
4. **定位权限**：需要用户授予定位权限才能获取精确位置
5. **性能优化**：在低性能设备上可能需要进一步优化地图渲染性能

## 9. 常见问题解答

### Q: 地图无法显示或提示API未加载？
A: 检查API密钥配置是否正确，确保网络连接正常。

### Q: 搜索结果不显示或显示其他城市的结果？
A: 确认配置中的城市设置是否正确，检查定位功能是否正常工作。

### Q: 路线规划失败或显示错误？
A: 检查起点和终点坐标是否有效，尝试调整位置后重新规划。

### Q: 定位不准确？
A: IP定位仅能获取城市级别的大致位置，精确位置需要HTML5定位权限。

## 10. 维护与更新

- 定期更新高德地图API版本以获取新功能
- 监控API使用量，避免超出免费配额
- 根据用户反馈优化搜索结果过滤和排序逻辑
- 添加更多自定义配置选项，提高组件灵活性

## 11. 版本信息

- **当前版本**：1.0.0
- **最后更新**：2023-11-08
- **兼容Angular版本**：Angular 16+
- **高德地图API版本**：2.0