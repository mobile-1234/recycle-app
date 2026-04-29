import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="page-header" [ngClass]="theme" [class.transparent]="transparent">
      <div class="header-inner">
        <div class="header-left">
          <button class="header-btn" *ngIf="showBack" (click)="goBack()">
            <i class="fas fa-arrow-left"></i>
          </button>
          <div class="header-title-area" *ngIf="!showBack || title">
            <h1 class="header-title">{{ title }}</h1>
            <span class="header-subtitle" *ngIf="subtitle">{{ subtitle }}</span>
          </div>
        </div>
        <div class="header-right">
          <ng-content></ng-content>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .page-header {
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      transition: all 0.3s ease;

      &.transparent {
        background: transparent;
        box-shadow: none;
      }
    }

    .green {
      background: linear-gradient(135deg, #2e7d32, #4caf50);
      color: white;
      .header-title, .header-subtitle { color: white; }
      .header-btn { color: white; background: rgba(255,255,255,0.15); }
      .header-btn:hover { background: rgba(255,255,255,0.25); }
    }

    .blue {
      background: linear-gradient(135deg, #1565c0, #1e88e5);
      color: white;
      .header-title, .header-subtitle { color: white; }
      .header-btn { color: white; background: rgba(255,255,255,0.15); }
    }

    .dark {
      background: linear-gradient(135deg, #1a1a2e, #16213e);
      color: white;
      .header-title, .header-subtitle { color: white; }
      .header-btn { color: white; background: rgba(255,255,255,0.1); }
    }

    .light {
      background: rgba(255, 255, 255, 0.9);
      border-bottom: 1px solid #f0f0f0;
      .header-title { color: #1a1a1a; }
      .header-subtitle { color: #888; }
      .header-btn { color: #333; background: #f5f5f5; }
    }

    .header-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      min-height: 56px;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .header-btn {
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 16px;
      flex-shrink: 0;

      &:active { transform: scale(0.95); }
    }

    .header-title-area {
      display: flex;
      flex-direction: column;
    }

    .header-title {
      font-size: 18px;
      font-weight: 700;
      line-height: 1.3;
      margin: 0;
    }

    .header-subtitle {
      font-size: 12px;
      opacity: 0.8;
      margin-top: 1px;
    }
  `]
})
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() theme: 'green' | 'blue' | 'dark' | 'light' = 'green';
  @Input() showBack: boolean = false;
  @Input() transparent: boolean = false;
  @Output() back = new EventEmitter<void>();

  constructor(private router: Router) {}

  goBack(): void {
    if (this.back.observed) {
      this.back.emit();
    } else {
      history.back();
    }
  }
}
