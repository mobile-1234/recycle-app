import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-wrapper" [ngSwitch]="type">
      <!-- 卡片骨架 -->
      <div *ngSwitchCase="'card'" class="skeleton-card">
        <div class="skeleton-line w-40 h-12"></div>
        <div class="skeleton-line w-70 h-24 mt-8"></div>
        <div class="skeleton-line w-50 h-12 mt-8"></div>
      </div>

      <!-- 统计卡片骨架 -->
      <div *ngSwitchCase="'stat'" class="skeleton-stat">
        <div class="skeleton-circle size-40"></div>
        <div class="skeleton-line w-60 h-20 mt-8"></div>
        <div class="skeleton-line w-40 h-12 mt-4"></div>
      </div>

      <!-- 列表项骨架 -->
      <div *ngSwitchCase="'list'" class="skeleton-list">
        <div class="skeleton-list-item" *ngFor="let i of repeatArr">
          <div class="skeleton-circle size-44"></div>
          <div class="skeleton-list-content">
            <div class="skeleton-line w-60 h-14"></div>
            <div class="skeleton-line w-40 h-12 mt-6"></div>
          </div>
        </div>
      </div>

      <!-- 头像+文字骨架 -->
      <div *ngSwitchCase="'avatar'" class="skeleton-avatar-row">
        <div class="skeleton-circle size-48"></div>
        <div class="skeleton-avatar-text">
          <div class="skeleton-line w-50 h-16"></div>
          <div class="skeleton-line w-30 h-12 mt-6"></div>
        </div>
      </div>

      <!-- 图表骨架 -->
      <div *ngSwitchCase="'chart'" class="skeleton-chart">
        <div class="skeleton-line w-30 h-14 mb-12"></div>
        <div class="skeleton-chart-bars">
          <div class="skeleton-bar" *ngFor="let h of chartBarHeights" [style.height.%]="h"></div>
        </div>
      </div>

      <!-- 纯行骨架 -->
      <div *ngSwitchDefault class="skeleton-lines">
        <div class="skeleton-line" *ngFor="let w of lineWidths" [style.width.%]="w" [style.height.px]="lineHeight" [style.margin-bottom.px]="8"></div>
      </div>
    </div>
  `,
  styles: [`
    .skeleton-wrapper {
      width: 100%;
    }

    .skeleton-line, .skeleton-circle, .skeleton-bar {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite ease-in-out;
      border-radius: 6px;
    }

    .skeleton-circle {
      border-radius: 50%;
      flex-shrink: 0;
    }

    // Width helpers
    .w-30 { width: 30%; }
    .w-40 { width: 40%; }
    .w-50 { width: 50%; }
    .w-60 { width: 60%; }
    .w-70 { width: 70%; }
    .w-80 { width: 80%; }
    .w-100 { width: 100%; }

    // Height helpers
    .h-12 { height: 12px; }
    .h-14 { height: 14px; }
    .h-16 { height: 16px; }
    .h-20 { height: 20px; }
    .h-24 { height: 24px; }

    // Size helpers for circles
    .size-32 { width: 32px; height: 32px; }
    .size-40 { width: 40px; height: 40px; }
    .size-44 { width: 44px; height: 44px; }
    .size-48 { width: 48px; height: 48px; }

    // Spacing helpers
    .mt-4 { margin-top: 4px; }
    .mt-6 { margin-top: 6px; }
    .mt-8 { margin-top: 8px; }
    .mb-12 { margin-bottom: 12px; }

    // Card skeleton
    .skeleton-card {
      padding: 16px;
      background: #fff;
      border-radius: 12px;
    }

    // Stat skeleton
    .skeleton-stat {
      padding: 16px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    // List skeleton
    .skeleton-list-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid #f5f5f5;

      &:last-child { border-bottom: none; }
    }

    .skeleton-list-content {
      flex: 1;
    }

    // Avatar row
    .skeleton-avatar-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .skeleton-avatar-text {
      flex: 1;
    }

    // Chart skeleton
    .skeleton-chart {
      padding: 16px 0;
    }

    .skeleton-chart-bars {
      display: flex;
      align-items: flex-end;
      gap: 8px;
      height: 120px;
    }

    .skeleton-bar {
      flex: 1;
      min-height: 20px;
      border-radius: 4px 4px 0 0;
    }

    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `]
})
export class SkeletonComponent {
  @Input() type: 'card' | 'stat' | 'list' | 'avatar' | 'chart' | 'lines' = 'lines';
  @Input() count: number = 3;
  @Input() lineHeight: number = 14;

  get repeatArr(): number[] {
    return Array(this.count).fill(0);
  }

  get lineWidths(): number[] {
    const widths = [90, 70, 50, 80, 60, 40, 75, 55];
    return widths.slice(0, this.count);
  }

  get chartBarHeights(): number[] {
    return [60, 80, 45, 90, 70, 55, 85];
  }
}
