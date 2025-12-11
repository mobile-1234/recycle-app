import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxEchartsModule } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';

interface ChainStageDetail {
  stage: string;
  volume: number;
  efficiency: number;
  companies: number;
  employees: number;
  revenue: number;
  growth: number;
  detailData: {
    topCompanies: Array<{name: string; volume: number; share: number}>;
    technologies: string[];
    challenges: string[];
    opportunities: string[];
    monthlyTrend: Array<{month: string; volume: number; efficiency: number}>;
  };
}

@Component({
  selector: 'app-industry-analysis',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgxEchartsModule],
  templateUrl: './industry-analysis.html',
  styleUrl: './industry-analysis.scss'
})
export class IndustryAnalysis implements OnInit {
  activeTab: 'chain' | 'region' | 'category' | 'risk' = 'chain';
  showDetailModal = false;
  selectedStage: ChainStageDetail | null = null;
  trendViewMode: 'recent' | 'full' = 'recent'; // 趋势图查看模式：最近4个月 或 全年
  chartOption: EChartsOption = {}; // ECharts配置选项
  
  chainData: ChainStageDetail[] = [
    {
      stage: '回收',
      volume: 45680,
      efficiency: 92,
      companies: 45,
      employees: 1200,
      revenue: 12000000,
      growth: 15,
      detailData: {
        topCompanies: [
          { name: '朝阳再生视界有限公司', volume: 8500, share: 18.6 },
          { name: '首都环保回收集团', volume: 7200, share: 15.8 },
          { name: '智慧回收科技', volume: 5800, share: 12.7 }
        ],
        technologies: ['智能识别技术', 'IoT物联网监控', '移动端预约系统', 'GPS路线优化'],
        challenges: ['人工成本上升', '回收点覆盖不足', '居民参与度有待提高'],
        opportunities: ['智能设备普及', '政策扶持力度加大', '居民环保意识提升'],
        monthlyTrend: [
          { month: '1月', volume: 42000, efficiency: 89 },
          { month: '2月', volume: 43200, efficiency: 90 },
          { month: '3月', volume: 44500, efficiency: 91 },
          { month: '4月', volume: 45680, efficiency: 92 },
          { month: '5月', volume: 44200, efficiency: 90 },
          { month: '6月', volume: 45800, efficiency: 91 },
          { month: '7月', volume: 46500, efficiency: 92 },
          { month: '8月', volume: 47200, efficiency: 93 },
          { month: '9月', volume: 46800, efficiency: 92 },
          { month: '10月', volume: 48000, efficiency: 93 },
          { month: '11月', volume: 48500, efficiency: 94 },
          { month: '12月', volume: 49200, efficiency: 94 }
        ]
      }
    },
    {
      stage: '分拣',
      volume: 42130,
      efficiency: 88,
      companies: 28,
      employees: 850,
      revenue: 8500000,
      growth: 12,
      detailData: {
        topCompanies: [
          { name: '智能分拣科技公司', volume: 9800, share: 23.3 },
          { name: '环保分拣中心', volume: 7500, share: 17.8 },
          { name: '绿色分类处理厂', volume: 6200, share: 14.7 }
        ],
        technologies: ['AI视觉识别', '自动化分拣线', '红外光谱分析', '机械臂分拣'],
        challenges: ['设备投资大', '技术人才缺乏', '分拣精度需提升'],
        opportunities: ['自动化设备升级', 'AI技术应用', '政府补贴支持'],
        monthlyTrend: [
          { month: '1月', volume: 39500, efficiency: 85 },
          { month: '2月', volume: 40200, efficiency: 86 },
          { month: '3月', volume: 41000, efficiency: 87 },
          { month: '4月', volume: 42130, efficiency: 88 },
          { month: '5月', volume: 41500, efficiency: 87 },
          { month: '6月', volume: 42800, efficiency: 88 },
          { month: '7月', volume: 43500, efficiency: 89 },
          { month: '8月', volume: 44200, efficiency: 89 },
          { month: '9月', volume: 43800, efficiency: 88 },
          { month: '10月', volume: 45000, efficiency: 90 },
          { month: '11月', volume: 45600, efficiency: 90 },
          { month: '12月', volume: 46200, efficiency: 91 }
        ]
      }
    },
    {
      stage: '加工',
      volume: 38900,
      efficiency: 85,
      companies: 32,
      employees: 980,
      revenue: 15000000,
      growth: 18,
      detailData: {
        topCompanies: [
          { name: '再生资源加工厂', volume: 8900, share: 22.9 },
          { name: '环保材料加工中心', volume: 7100, share: 18.3 },
          { name: '绿色加工产业园', volume: 5800, share: 14.9 }
        ],
        technologies: ['热解技术', '化学回收', '物理再生', '生物降解处理'],
        challenges: ['环保标准严格', '能耗较高', '原料质量不稳定'],
        opportunities: ['新技术研发', '产业园区建设', '国际合作机会'],
        monthlyTrend: [
          { month: '1月', volume: 36200, efficiency: 82 },
          { month: '2月', volume: 37100, efficiency: 83 },
          { month: '3月', volume: 38000, efficiency: 84 },
          { month: '4月', volume: 38900, efficiency: 85 },
          { month: '5月', volume: 38200, efficiency: 84 },
          { month: '6月', volume: 39500, efficiency: 85 },
          { month: '7月', volume: 40200, efficiency: 86 },
          { month: '8月', volume: 41000, efficiency: 86 },
          { month: '9月', volume: 40500, efficiency: 85 },
          { month: '10月', volume: 41800, efficiency: 87 },
          { month: '11月', volume: 42500, efficiency: 87 },
          { month: '12月', volume: 43200, efficiency: 88 }
        ]
      }
    },
    {
      stage: '再生',
      volume: 35200,
      efficiency: 82,
      companies: 25,
      employees: 720,
      revenue: 18000000,
      growth: 20,
      detailData: {
        topCompanies: [
          { name: '再生材料科技公司', volume: 7800, share: 22.2 },
          { name: '循环经济产业集团', volume: 6500, share: 18.5 },
          { name: '绿色再生制造厂', volume: 5200, share: 14.8 }
        ],
        technologies: ['高分子材料再生', '闭环回收系统', '绿色制造工艺', '质量检测技术'],
        challenges: ['市场接受度', '成本控制', '质量保证'],
        opportunities: ['绿色产品需求增长', '品牌合作', '政策激励'],
        monthlyTrend: [
          { month: '1月', volume: 32500, efficiency: 79 },
          { month: '2月', volume: 33600, efficiency: 80 },
          { month: '3月', volume: 34400, efficiency: 81 },
          { month: '4月', volume: 35200, efficiency: 82 },
          { month: '5月', volume: 34800, efficiency: 81 },
          { month: '6月', volume: 36000, efficiency: 82 },
          { month: '7月', volume: 36800, efficiency: 83 },
          { month: '8月', volume: 37500, efficiency: 84 },
          { month: '9月', volume: 37000, efficiency: 83 },
          { month: '10月', volume: 38200, efficiency: 84 },
          { month: '11月', volume: 39000, efficiency: 85 },
          { month: '12月', volume: 39800, efficiency: 85 }
        ]
      }
    }
  ];

  regionData = [
    { region: '朝阳区', recycleRate: 95, regenerationRate: 88, marketPrice: 3.2, companies: 35, volume: 12500, trend: 'up' },
    { region: '海淀区', recycleRate: 88, regenerationRate: 85, marketPrice: 3.1, companies: 28, volume: 10200, trend: 'stable' },
    { region: '西城区', recycleRate: 93, regenerationRate: 87, marketPrice: 3.3, companies: 22, volume: 8900, trend: 'up' },
    { region: '东城区', recycleRate: 76, regenerationRate: 72, marketPrice: 2.9, companies: 18, volume: 7800, trend: 'down' },
    { region: '丰台区', recycleRate: 91, regenerationRate: 86, marketPrice: 3.0, companies: 25, volume: 6280, trend: 'up' }
  ];

  categoryData = [
    {
      category: '纸类',
      recycleRate: 95,
      regenerationRate: 92,
      trend: 'up',
      volume: 18500,
      value: 55500000,
      companies: 35,
      marketDemand: 'high'
    },
    {
      category: '塑料',
      recycleRate: 88,
      regenerationRate: 85,
      trend: 'stable',
      volume: 12800,
      value: 38400000,
      companies: 28,
      marketDemand: 'medium'
    },
    {
      category: '金属',
      recycleRate: 96,
      regenerationRate: 94,
      trend: 'up',
      volume: 9200,
      value: 92000000,
      companies: 20,
      marketDemand: 'high'
    },
    {
      category: '玻璃',
      recycleRate: 82,
      regenerationRate: 78,
      trend: 'down',
      volume: 5180,
      value: 15540000,
      companies: 12,
      marketDemand: 'low'
    }
  ];

  risks = [
    {
      id: 1,
      level: 'high',
      type: '市场风险',
      content: '再生塑料价格波动较大，近3个月波动幅度达15%',
      strategy: '建立价格调控机制，引入期货市场对冲',
      impact: '可能影响企业利润率下降8-12%',
      probability: 75
    },
    {
      id: 2,
      level: 'medium',
      type: '政策风险',
      content: '部分区域政策执行不到位，监管力度不足',
      strategy: '加强监管力度，建立考核机制',
      impact: '回收效率可能降低5-8%',
      probability: 55
    },
    {
      id: 3,
      level: 'low',
      type: '技术风险',
      content: '分拣技术需要升级，自动化水平有待提高',
      strategy: '推动技术创新，引进先进设备',
      impact: '影响分拣效率2-3%',
      probability: 30
    },
    {
      id: 4,
      level: 'medium',
      type: '环保风险',
      content: '加工环节环保标准提高，部分企业面临整改',
      strategy: '制定过渡期政策，提供技术支持',
      impact: '10-15%小企业可能被淘汰',
      probability: 60
    }
  ];

  ngOnInit(): void {
    // 初始化时不需要做什么，图表会在打开详情时更新
  }

  switchTab(tab: 'chain' | 'region' | 'category' | 'risk'): void {
    this.activeTab = tab;
  }

  // 查看产业链环节详情
  viewChainDetail(stage: ChainStageDetail): void {
    this.selectedStage = stage;
    this.showDetailModal = true;
    this.updateChart(); // 更新图表
  }

  // 关闭详情弹窗
  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedStage = null;
    this.trendViewMode = 'recent'; // 重置为最近4个月
  }

  // 切换趋势图视图模式
  toggleTrendView(): void {
    this.trendViewMode = this.trendViewMode === 'recent' ? 'full' : 'recent';
    this.updateChart(); // 切换后更新图表
  }

  // 获取显示的趋势数据
  get displayedTrendData() {
    if (!this.selectedStage) return [];
    if (this.trendViewMode === 'recent') {
      // 返回最近4个月（取最后4个）
      return this.selectedStage.detailData.monthlyTrend.slice(-4);
    }
    // 返回全年12个月
    return this.selectedStage.detailData.monthlyTrend;
  }

  // 更新ECharts图表配置
  updateChart(): void {
    if (!this.selectedStage) return;

    const data = this.displayedTrendData;
    const months = data.map(d => d.month);
    const volumes = data.map(d => (d.volume / 1000).toFixed(1)); // 转换为吨
    const efficiencies = data.map(d => d.efficiency);

    this.chartOption = {
      title: {
        text: this.trendViewMode === 'recent' ? '近4个月趋势' : '全年趋势',
        left: 'center',
        textStyle: {
          color: '#2c3e50',
          fontSize: 16,
          fontWeight: 600
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#ddd',
        borderWidth: 1,
        textStyle: {
          color: '#333'
        }
      },
      legend: {
        data: ['处理量 (吨)', '效率 (%)'],
        bottom: 10,
        textStyle: {
          color: '#666'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '15%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: months,
          axisPointer: {
            type: 'shadow'
          },
          axisLine: {
            lineStyle: {
              color: '#e0e0e0'
            }
          },
          axisLabel: {
            color: '#666',
            fontSize: this.trendViewMode === 'full' ? 11 : 12
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '处理量 (吨)',
          nameTextStyle: {
            color: '#666',
            fontSize: 12
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#3498db'
            }
          },
          axisLabel: {
            color: '#666',
            formatter: '{value}'
          },
          splitLine: {
            lineStyle: {
              color: '#f0f0f0',
              type: 'dashed'
            }
          }
        },
        {
          type: 'value',
          name: '效率 (%)',
          nameTextStyle: {
            color: '#666',
            fontSize: 12
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#2ecc71'
            }
          },
          axisLabel: {
            color: '#666',
            formatter: '{value}%'
          },
          splitLine: {
            show: false
          }
        }
      ],
      series: [
        {
          name: '处理量 (吨)',
          type: 'bar',
          data: volumes,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#3498db' },
                { offset: 1, color: '#2980b9' }
              ]
            },
            borderRadius: [4, 4, 0, 0]
          },
          emphasis: {
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: '#5dade2' },
                  { offset: 1, color: '#3498db' }
                ]
              }
            }
          },
          barWidth: this.trendViewMode === 'full' ? '35%' : '40%'
        },
        {
          name: '效率 (%)',
          type: 'line',
          yAxisIndex: 1,
          data: efficiencies,
          smooth: true,
          lineStyle: {
            width: 3,
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: '#2ecc71' },
                { offset: 1, color: '#27ae60' }
              ]
            }
          },
          itemStyle: {
            color: '#2ecc71',
            borderWidth: 2,
            borderColor: '#fff'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(46, 204, 113, 0.3)' },
                { offset: 1, color: 'rgba(46, 204, 113, 0.05)' }
              ]
            }
          },
          symbol: 'circle',
          symbolSize: 8,
          emphasis: {
            itemStyle: {
              color: '#27ae60',
              borderWidth: 3,
              borderColor: '#fff',
              shadowBlur: 10,
              shadowColor: 'rgba(46, 204, 113, 0.5)'
            }
          }
        }
      ],
      dataZoom: this.trendViewMode === 'full' ? [
        {
          type: 'inside',
          start: 0,
          end: 100
        },
        {
          start: 0,
          end: 100,
          height: 20,
          bottom: 40,
          handleStyle: {
            color: '#3498db'
          },
          textStyle: {
            color: '#666'
          }
        }
      ] : undefined
    };
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
  
  getDemandClass(demand: string): string {
    return `demand-${demand}`;
  }
  
  getDemandText(demand: string): string {
    const map: any = { high: '旺盛', medium: '一般', low: '疲软' };
    return map[demand] || demand;
  }

  // 计算产业链总览数据的getter方法
  get totalCompanies(): number {
    return this.chainData.reduce((sum, item) => sum + item.companies, 0);
  }

  get totalEmployees(): string {
    return (this.chainData.reduce((sum, item) => sum + item.employees, 0) / 1000).toFixed(1);
  }

  get totalRevenue(): string {
    return (this.chainData.reduce((sum, item) => sum + item.revenue, 0) / 100000000).toFixed(1);
  }

  get averageGrowth(): string {
    return (this.chainData.reduce((sum, item) => sum + item.growth, 0) / this.chainData.length).toFixed(1);
  }

  constructor() {}
}
