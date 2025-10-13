import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ai-decision-assistant',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './ai-decision-assistant.html',
  styleUrl: './ai-decision-assistant.scss'
})
export class AIDecisionAssistant {
  activeTab: 'simulator' | 'qa' | 'compliance' | 'report' = 'simulator';
  
  question = '';
  subsidyAmount = 5000;
  timeRange = '3';
  
  simulationResult: {
    recycleIncrease: number;
    budgetCost: number;
    carbonReduction: number;
    participation: number;
  } | null = null;
  qaResult = '';
  complianceResults = [
    { company: '某环保企业', risk: 'high', pattern: '异常资金流向', suggestion: '加强监管' },
    { company: '绿色回收公司', risk: 'medium', pattern: '回收量波动', suggestion: '核查数据' }
  ];

  switchTab(tab: 'simulator' | 'qa' | 'compliance' | 'report'): void {
    this.activeTab = tab;
  }

  runSimulation(): void {
    this.simulationResult = {
      recycleIncrease: 25,
      budgetCost: this.subsidyAmount * 100,
      carbonReduction: 1500,
      participation: 89
    };
  }

  askQuestion(): void {
    if (this.question.trim()) {
      this.qaResult = `AI分析结果: ${this.question} - 朝阳区准确率最高达95%，海淀区为88%，建议加强海淀区培训力度。`;
    }
  }

  generateReport(): void {
    alert('正在生成综合分析报告...');
  }

  getRiskClass(risk: string): string {
    return `risk-${risk}`;
  }

  constructor() {}
}
