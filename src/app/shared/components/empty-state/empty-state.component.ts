import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty-state" [ngClass]="size">
      <div class="empty-illustration">
        <div class="empty-icon-wrapper" [ngSwitch]="icon">
          <svg *ngSwitchCase="'no-data'" viewBox="0 0 120 120" class="empty-svg">
            <circle cx="60" cy="60" r="50" fill="#f0f7f0" stroke="#c8e6c9" stroke-width="2"/>
            <rect x="35" y="40" width="50" height="6" rx="3" fill="#c8e6c9"/>
            <rect x="35" y="52" width="38" height="6" rx="3" fill="#e0e0e0"/>
            <rect x="35" y="64" width="44" height="6" rx="3" fill="#e0e0e0"/>
            <rect x="35" y="76" width="30" height="6" rx="3" fill="#e0e0e0"/>
          </svg>
          <svg *ngSwitchCase="'no-network'" viewBox="0 0 120 120" class="empty-svg">
            <circle cx="60" cy="60" r="50" fill="#fff3e0" stroke="#ffe0b2" stroke-width="2"/>
            <path d="M40 55 L60 35 L80 55" stroke="#ff9800" stroke-width="4" fill="none" stroke-linecap="round"/>
            <path d="M46 65 L60 50 L74 65" stroke="#ffb74d" stroke-width="3" fill="none" stroke-linecap="round"/>
            <circle cx="60" cy="78" r="4" fill="#ff9800"/>
            <line x1="45" y1="40" x2="75" y2="80" stroke="#f44336" stroke-width="3" stroke-linecap="round"/>
          </svg>
          <svg *ngSwitchCase="'no-order'" viewBox="0 0 120 120" class="empty-svg">
            <circle cx="60" cy="60" r="50" fill="#e8f5e9" stroke="#a5d6a7" stroke-width="2"/>
            <rect x="38" y="30" width="44" height="60" rx="4" fill="white" stroke="#a5d6a7" stroke-width="2"/>
            <rect x="45" y="40" width="30" height="4" rx="2" fill="#c8e6c9"/>
            <rect x="45" y="50" width="22" height="4" rx="2" fill="#e0e0e0"/>
            <rect x="45" y="60" width="26" height="4" rx="2" fill="#e0e0e0"/>
            <rect x="45" y="70" width="18" height="4" rx="2" fill="#e0e0e0"/>
          </svg>
          <svg *ngSwitchCase="'no-device'" viewBox="0 0 120 120" class="empty-svg">
            <circle cx="60" cy="60" r="50" fill="#e3f2fd" stroke="#90caf9" stroke-width="2"/>
            <rect x="35" y="35" width="50" height="35" rx="4" fill="white" stroke="#90caf9" stroke-width="2"/>
            <rect x="50" y="75" width="20" height="4" rx="2" fill="#90caf9"/>
            <rect x="42" y="82" width="36" height="4" rx="2" fill="#bbdefb"/>
            <circle cx="60" cy="52" r="8" fill="none" stroke="#64b5f6" stroke-width="2"/>
            <path d="M56 52 L59 55 L65 49" stroke="#4caf50" stroke-width="2" fill="none" stroke-linecap="round"/>
          </svg>
          <svg *ngSwitchDefault viewBox="0 0 120 120" class="empty-svg">
            <circle cx="60" cy="60" r="50" fill="#f5f5f5" stroke="#e0e0e0" stroke-width="2"/>
            <circle cx="60" cy="50" r="15" fill="none" stroke="#bdbdbd" stroke-width="2"/>
            <line x1="71" y1="61" x2="82" y2="72" stroke="#bdbdbd" stroke-width="3" stroke-linecap="round"/>
            <text x="60" y="90" text-anchor="middle" fill="#bdbdbd" font-size="10">Empty</text>
          </svg>
        </div>
      </div>
      <div class="empty-text">{{ title }}</div>
      <div class="empty-sub-text" *ngIf="description">{{ description }}</div>
      <button class="empty-action" *ngIf="actionText" (click)="action.emit()">
        <i *ngIf="actionIcon" [class]="actionIcon"></i>
        {{ actionText }}
      </button>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      text-align: center;

      &.small {
        padding: 24px 16px;
        .empty-svg { width: 64px; height: 64px; }
        .empty-text { font-size: 13px; }
        .empty-sub-text { font-size: 11px; }
      }

      &.large {
        padding: 60px 24px;
        .empty-svg { width: 140px; height: 140px; }
        .empty-text { font-size: 18px; }
      }
    }

    .empty-illustration {
      margin-bottom: 16px;
    }

    .empty-svg {
      width: 100px;
      height: 100px;
    }

    .empty-text {
      font-size: 15px;
      font-weight: 600;
      color: #666;
      margin-bottom: 6px;
    }

    .empty-sub-text {
      font-size: 13px;
      color: #999;
      max-width: 260px;
      line-height: 1.5;
    }

    .empty-action {
      margin-top: 16px;
      padding: 10px 24px;
      background: linear-gradient(135deg, #4caf50, #66bb6a);
      color: white;
      border: none;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
      }

      i { font-size: 14px; }
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon: 'no-data' | 'no-network' | 'no-order' | 'no-device' | 'search' = 'no-data';
  @Input() title: string = '暂无数据';
  @Input() description: string = '';
  @Input() actionText: string = '';
  @Input() actionIcon: string = '';
  @Input() size: 'small' | 'normal' | 'large' = 'normal';
  @Output() action = new EventEmitter<void>();
}
