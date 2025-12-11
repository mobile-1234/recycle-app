import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

import { routes } from './app.routes';

// Register the required components
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  BarChart,
  LineChart,
  CanvasRenderer
]);

// 高德地图配置
export const AMAP_CONFIG = {
  key: '7f39373fa4567ece8f057ec257ed7d34',
  securityJsCode: 'c68aaf5fd80d13b0811ca3150fdad70f'
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideEchartsCore({ echarts }),
    // 提供高德地图配置
    {
      provide: 'AMAP_LOCATION_CONFIG',
      useValue: AMAP_CONFIG
    }
  ]
};
