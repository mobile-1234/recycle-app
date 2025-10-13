import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-industry-analysis',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './industry-analysis.html',
  styleUrl: './industry-analysis.scss'
})
export class IndustryAnalysis {
  activeTab: 'chain' | 'region' | 'category' | 'risk' = 'chain';
  
  chainData = [
    { stage: '回收', volume: 45680, efficiency: 92 },
    { stage: '分拣', volume: 42130, efficiency: 88 },
    { stage: '加工', volume: 38900, efficiency: 85 },
    { stage: '再生', volume: 35200, efficiency: 82 }
  ];

  regionData = [
    { region: '朝阳区', recycleRate: 95, regenerationRate: 88, marketPrice: 3.2 },
    { region: '海淀区', recycleRate: 88, regenerationRate: 85, marketPrice: 3.1 },
    { region: '西城区', recycleRate: 93, regenerationRate: 87, marketPrice: 3.3 }
  ];

  categoryData = [
    { category: '纸类', recycleRate: 95, regenerationRate: 92, trend: 'up' },
    { category: '塑料', recycleRate: 88, regenerationRate: 85, trend: 'stable' },
    { category: '金属', recycleRate: 96, regenerationRate: 94, trend: 'up' },
    { category: '玻璃', recycleRate: 82, regenerationRate: 78, trend: 'down' }
  ];

  risks = [
    { id: 1, level: 'high', type: '市场风险', content: '再生塑料价格波动较大', strategy: '建立价格调控机制' },
    { id: 2, level: 'medium', type: '政策风险', content: '部分区域政策执行不到位', strategy: '加强监管力度' },
    { id: 3, level: 'low', type: '技术风险', content: '分拣技术需要升级', strategy: '推动技术创新' }
  ];

  switchTab(tab: 'chain' | 'region' | 'category' | 'risk'): void {
    this.activeTab = tab;
  }

  getTrendIcon(trend: string): string {
    return trend === 'up' ? 'fa-arrow-up' : trend === 'down' ? 'fa-arrow-down' : 'fa-minus';
  }

  getTrendClass(trend: string): string {
    return `trend-${trend}`;
  }

  getRiskClass(level: string): string {
    return `risk-${level}`;
  }

  constructor() {}
}
