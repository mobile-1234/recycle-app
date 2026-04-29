import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="status-badge" [ngClass]="[colorClass, sizeClass]" [class.pulse-dot]="pulse">
      <span class="dot" *ngIf="showDot"></span>
      <span class="badge-text">{{ text }}</span>
    </span>
  `,
  styles: [`
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 10px;
      border-radius: 12px;
      font-weight: 500;
      white-space: nowrap;

      &.small {
        padding: 2px 8px;
        font-size: 10px;
        .dot { width: 5px; height: 5px; }
      }
      &.medium {
        padding: 3px 10px;
        font-size: 12px;
      }
      &.large {
        padding: 4px 14px;
        font-size: 14px;
        .dot { width: 8px; height: 8px; }
      }
    }

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .pulse-dot .dot {
      animation: badgePulse 2s infinite;
    }

    // Status colors
    .status-success {
      background: rgba(76, 175, 80, 0.12);
      color: #2e7d32;
      .dot { background: #4caf50; }
    }
    .status-warning {
      background: rgba(255, 152, 0, 0.12);
      color: #e65100;
      .dot { background: #ff9800; }
    }
    .status-error {
      background: rgba(244, 67, 54, 0.12);
      color: #c62828;
      .dot { background: #f44336; }
    }
    .status-info {
      background: rgba(33, 150, 243, 0.12);
      color: #1565c0;
      .dot { background: #2196f3; }
    }
    .status-default {
      background: rgba(158, 158, 158, 0.12);
      color: #616161;
      .dot { background: #9e9e9e; }
    }
    .status-purple {
      background: rgba(156, 39, 176, 0.12);
      color: #7b1fa2;
      .dot { background: #9c27b0; }
    }

    @keyframes badgePulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
  `]
})
export class StatusBadgeComponent {
  @Input() text: string = '';
  @Input() status: 'success' | 'warning' | 'error' | 'info' | 'default' | 'purple' = 'default';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() showDot: boolean = true;
  @Input() pulse: boolean = false;

  get colorClass(): string { return `status-${this.status}`; }
  get sizeClass(): string { return this.size; }
}
