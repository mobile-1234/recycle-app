import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface GeneratedReport {
  id: string;
  type: string;
  title: string;
  generateTime: string;
  data: any;
  summary: string;
}

@Component({
  selector: 'app-ai-decision-assistant',
  standalone: true,
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
  
  // 报告相关
  generatedReports: GeneratedReport[] = [];
  showReportModal = false;
  currentReport: GeneratedReport | null = null;
  isGenerating = false;

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

  generateReport(reportType: string): void {
    this.isGenerating = true;
    
    // 模拟报告生成过程
    setTimeout(() => {
      const reportId = `RPT${Date.now()}`;
      const now = new Date();
      const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      let report: GeneratedReport;
      
      switch(reportType) {
        case 'monthly':
          report = {
            id: reportId,
            type: 'monthly',
            title: '月度监管分析报告',
            generateTime: timeStr,
            summary: '本月回收总量45,680kg，同比增长12%，分类准确率92.5%，碳减排1,250kg',
            data: {
              overview: {
                totalRecycle: 45680,
                growthRate: 12,
                accuracy: 92.5,
                carbonReduction: 1250
              },
              regional: [
                { area: '朝阳区', recycle: 12500, accuracy: 95, trend: '+8%' },
                { area: '海淀区', recycle: 10200, accuracy: 88, trend: '+5%' },
                { area: '西城区', recycle: 8900, accuracy: 93, trend: '+15%' },
                { area: '东城区', recycle: 7800, accuracy: 76, trend: '-3%' },
                { area: '丰台区', recycle: 6280, accuracy: 91, trend: '+10%' }
              ],
              warnings: [
                { level: 'high', area: '东城区', issue: '分类准确率下降', action: '加强培训' },
                { level: 'medium', area: '海淀区', issue: '回收量波动', action: '核查数据' }
              ],
              suggestions: [
                '建议加强东城区的垃圾分类培训工作',
                '朝阳区表现优异，可作为示范区推广经验',
                '建议对海淀区进行专项数据核查'
              ]
            }
          };
          break;
          
        case 'industry':
          report = {
            id: reportId,
            type: 'industry',
            title: '产业发展评估报告',
            generateTime: timeStr,
            summary: '全市回收企业120家，从业人员3,500人，年产值2.8亿元，产业链完整度85%',
            data: {
              overview: {
                companies: 120,
                employees: 3500,
                revenue: 280000000,
                chainCompleteness: 85
              },
              sectors: [
                { name: '可回收物', companies: 45, revenue: 120000000, growth: '+15%' },
                { name: '有害垃圾', companies: 28, revenue: 35000000, growth: '+8%' },
                { name: '厨余垃圾', companies: 32, revenue: 85000000, growth: '+22%' },
                { name: '其他垃圾', companies: 15, revenue: 40000000, growth: '+5%' }
              ],
              topCompanies: [
                { name: '北京绿色环保有限公司', revenue: 45000000, growth: '+28%' },
                { name: '首都回收科技集团', revenue: 38000000, growth: '+18%' },
                { name: '朝阳智能分类公司', revenue: 32000000, growth: '+25%' }
              ],
              trends: [
                '智能化回收设备需求增长显著',
                '厨余垃圾资源化利用成为新增长点',
                '产业链上下游整合趋势明显'
              ]
            }
          };
          break;
          
        case 'policy':
          report = {
            id: reportId,
            type: 'policy',
            title: '政策效果评估报告',
            generateTime: timeStr,
            summary: '补贴政策实施6个月，累计发放补贴580万元，带动回收量增长18%，企业参与度89%',
            data: {
              overview: {
                subsidyAmount: 5800000,
                recycleGrowth: 18,
                participation: 89,
                satisfaction: 92
              },
              subsidyDistribution: [
                { area: '朝阳区', amount: 1500000, companies: 35, effect: '优秀' },
                { area: '海淀区', amount: 1200000, companies: 28, effect: '良好' },
                { area: '西城区', amount: 980000, companies: 22, effect: '优秀' },
                { area: '东城区', amount: 850000, companies: 18, effect: '一般' },
                { area: '丰台区', amount: 1270000, companies: 25, effect: '良好' }
              ],
              effectiveness: [
                { indicator: '回收量增长', target: 15, actual: 18, status: '超额完成' },
                { indicator: '企业参与度', target: 80, actual: 89, status: '超额完成' },
                { indicator: '居民满意度', target: 85, actual: 92, status: '超额完成' },
                { indicator: '成本效益比', target: 1.5, actual: 1.8, status: '超额完成' }
              ],
              recommendations: [
                '建议继续加大补贴力度，特别是对表现优异的区域',
                '优化补贴发放流程，提高资金使用效率',
                '加强政策宣传，提高企业和居民的知晓率'
              ]
            }
          };
          break;
          
        default:
          return;
      }
      
      this.generatedReports.unshift(report);
      this.currentReport = report;
      this.isGenerating = false;
      this.showReportModal = true;
      
      // 保存到本地存储
      this.saveReportsToLocalStorage();
    }, 1500);
  }
  
  // 保存报告到本地存储
  saveReportsToLocalStorage(): void {
    localStorage.setItem('aiReports', JSON.stringify(this.generatedReports));
  }
  
  // 从本地存储加载报告
  loadReportsFromLocalStorage(): void {
    const saved = localStorage.getItem('aiReports');
    if (saved) {
      this.generatedReports = JSON.parse(saved);
    }
  }
  
  // 查看报告
  viewReport(report: GeneratedReport): void {
    this.currentReport = report;
    this.showReportModal = true;
  }
  
  // 关闭报告弹窗
  closeReportModal(): void {
    this.showReportModal = false;
  }
  
  // 删除报告
  deleteReport(reportId: string): void {
    if (confirm('确定要删除这份报告吗？')) {
      this.generatedReports = this.generatedReports.filter(r => r.id !== reportId);
      this.saveReportsToLocalStorage();
    }
  }
  
  // 导出报告
  exportReport(report: GeneratedReport): void {
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.title}_${report.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  getRiskClass(risk: string): string {
    return `risk-${risk}`;
  }

  constructor() {
    this.loadReportsFromLocalStorage();
  }
}
