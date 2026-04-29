import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface StatCardData {
  label: string;
  value: string | number;
  unit?: string;
  trend?: number;       // 正数=上升, 负数=下降, 0=持平
  icon?: string;         // FontAwesome class or emoji
  color?: 'green' | 'blue' | 'orange' | 'red' | 'purple' | 'cyan';
  sparkline?: number[];  // mini trend data
}

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stat-card" [ngClass]="[variant, 'color-' + (data.color || 'green')]" [class.clickable]="clickable">
      <!-- 图标 -->
      <div class="stat-icon" *ngIf="data.icon">
        <span *ngIf="isEmoji(data.icon)">{{ data.icon }}</span>
        <i *ngIf="!isEmoji(data.icon)" [class]="data.icon"></i>
      </div>

      <!-- 数值 -->
      <div class="stat-body">
        <div class="stat-value-row">
          <span class="stat-value">{{ data.value }}</span>
          <span class="stat-unit" *ngIf="data.unit">{{ data.unit }}</span>
        </div>
        <div class="stat-label">{{ data.label }}</div>
      </div>

      <!-- 趋势 -->
      <div class="stat-trend" *ngIf="data.trend !== undefined" [ngClass]="trendClass">
        <i class="fas" [ngClass]="trendIcon"></i>
        <span>{{ trendText }}</span>
      </div>

      <!-- 迷你趋势线 -->
      <svg *ngIf="data.sparkline && data.sparkline.length > 1" class="stat-sparkline" viewBox="0 0 80 24" preserveAspectRatio="none">
        <polyline [attr.points]="sparklinePoints" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  `,
  styles: [`
    .stat-card {
      position: relative;
      border-radius: 14px;
      padding: 16px;
      background: white;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      border: 1px solid rgba(0,0,0,0.04);

      &.clickable {
        cursor: pointer;
        &:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }
        &:active {
          transform: translateY(-1px);
        }
      }

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
      }
    }

    // Color variants
    .color-green {
      &::before { background: linear-gradient(90deg, #4caf50, #81c784); }
      .stat-icon { background: rgba(76, 175, 80, 0.1); color: #4caf50; }
      .stat-sparkline { color: #4caf50; }
    }
    .color-blue {
      &::before { background: linear-gradient(90deg, #2196f3, #64b5f6); }
      .stat-icon { background: rgba(33, 150, 243, 0.1); color: #2196f3; }
      .stat-sparkline { color: #2196f3; }
    }
    .color-orange {
      &::before { background: linear-gradient(90deg, #ff9800, #ffb74d); }
      .stat-icon { background: rgba(255, 152, 0, 0.1); color: #ff9800; }
      .stat-sparkline { color: #ff9800; }
    }
    .color-red {
      &::before { background: linear-gradient(90deg, #f44336, #e57373); }
      .stat-icon { background: rgba(244, 67, 54, 0.1); color: #f44336; }
      .stat-sparkline { color: #f44336; }
    }
    .color-purple {
      &::before { background: linear-gradient(90deg, #9c27b0, #ba68c8); }
      .stat-icon { background: rgba(156, 39, 176, 0.1); color: #9c27b0; }
      .stat-sparkline { color: #9c27b0; }
    }
    .color-cyan {
      &::before { background: linear-gradient(90deg, #00bcd4, #4dd0e1); }
      .stat-icon { background: rgba(0, 188, 212, 0.1); color: #00bcd4; }
      .stat-sparkline { color: #00bcd4; }
    }

    // Compact variant
    .compact {
      padding: 12px;
      .stat-icon { width: 32px; height: 32px; font-size: 14px; }
      .stat-value { font-size: 18px; }
      .stat-label { font-size: 11px; }
    }

    // Dashboard variant
    .dashboard {
      .stat-body { text-align: left; }
    }

    .stat-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      margin-bottom: 12px;
    }

    .stat-body {
      position: relative;
      z-index: 1;
    }

    .stat-value-row {
      display: flex;
      align-items: baseline;
      gap: 2px;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 700;
      color: #1a1a1a;
      line-height: 1.2;
      letter-spacing: -0.5px;
    }

    .stat-unit {
      font-size: 12px;
      color: #999;
      font-weight: 400;
    }

    .stat-label {
      font-size: 12px;
      color: #888;
      margin-top: 4px;
      font-weight: 500;
    }

    .stat-trend {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      font-size: 11px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 10px;
      margin-top: 8px;

      &.trend-up {
        color: #4caf50;
        background: rgba(76, 175, 80, 0.1);
      }
      &.trend-down {
        color: #f44336;
        background: rgba(244, 67, 54, 0.1);
      }
      &.trend-flat {
        color: #9e9e9e;
        background: rgba(158, 158, 158, 0.1);
      }

      i { font-size: 10px; }
    }

    .stat-sparkline {
      position: absolute;
      bottom: 8px;
      right: 12px;
      width: 80px;
      height: 24px;
      opacity: 0.5;
    }
  `]
})
export class StatCardComponent {
  @Input() data!: StatCardData;
  @Input() variant: 'default' | 'compact' | 'dashboard' = 'default';
  @Input() clickable: boolean = false;

  get trendClass(): string {
    if (!this.data.trend) return 'trend-flat';
    return this.data.trend > 0 ? 'trend-up' : 'trend-down';
  }

  get trendIcon(): string {
    if (!this.data.trend) return 'fa-minus';
    return this.data.trend > 0 ? 'fa-arrow-up' : 'fa-arrow-down';
  }

  get trendText(): string {
    if (!this.data.trend) return '0%';
    return `${Math.abs(this.data.trend).toFixed(1)}%`;
  }

  get sparklinePoints(): string {
    const data = this.data.sparkline || [];
    if (data.length < 2) return '';
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    return data.map((v, i) => {
      const x = (i / (data.length - 1)) * 80;
      const y = 24 - ((v - min) / range) * 20 - 2;
      return `${x},${y}`;
    }).join(' ');
  }

  isEmoji(str: string): boolean {
    return !/^fa[srbl]?\s/.test(str) && !/^icon-/.test(str);
  }
}
