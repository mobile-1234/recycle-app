import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-help-center',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './help-center.html',
  styleUrl: './help-center.scss'
})
export class HelpCenter {
  activeTab: 'faq' | 'tutorial' | 'contact' = 'faq';
  searchQuery = '';
  
  faqs = [
    {
      question: '如何查看辖区详细数据？',
      answer: '点击地图上的区域标记或区域列表中的任意项目，即可查看该辖区的详细数据统计，包括人口、网点、合规率等信息。您也可以通过筛选功能快速定位特定辖区。',
      expanded: false
    },
    {
      question: '预警通知如何处理？',
      answer: '在实时预警列表中点击预警项目，查看详情后可以点击"处理"按钮标记为处理中，处理完成后点击"解决"按钮完成流程。系统会自动记录处理时间和处理人。',
      expanded: false
    },
    {
      question: '如何切换不同的监管视图？',
      answer: '在区域监管地图上方有三个切换按钮：网点分布、合规状态、政策覆盖，点击即可切换不同的数据视图。每个视图都会展示相应的统计数据和地图分布。',
      expanded: false
    },
    {
      question: '数据多久更新一次？',
      answer: '系统数据实时更新，核心指标每5分钟刷新一次，预警信息即时推送。您可以在页面右上角查看最后更新时间。',
      expanded: false
    },
    {
      question: '如何导出报表数据？',
      answer: '在数据统计页面点击"导出"按钮，可以选择Excel或PDF格式导出当前查看的数据报表。导出的数据包含当前筛选条件下的所有统计结果。',
      expanded: false
    },
    {
      question: '如何设置通知提醒？',
      answer: '进入"系统设置"-"通知设置"，可以自定义接收哪些类型的通知，以及选择邮件、短信等不同的接收方式。',
      expanded: false
    },
    {
      question: '忘记密码怎么办？',
      answer: '请联系系统管理员重置密码，或拨打技术支持热线400-123-4567。为了账号安全，密码重置需要验证身份信息。',
      expanded: false
    },
    {
      question: '如何添加新的监管区域？',
      answer: '请联系系统管理员提交区域添加申请，需要提供区域名称、范围、人口等基础信息。审核通过后系统会自动添加到监管地图中。',
      expanded: false
    }
  ];
  
  tutorials = [
    {
      icon: 'fas fa-play-circle',
      title: '快速入门指南',
      description: '了解系统基本功能和操作流程，5分钟快速上手',
      duration: '5分钟',
      level: '入门',
      videoUrl: 'https://www.douyin.com/video/7328088546456677675'
    },
    {
      icon: 'fas fa-chart-bar',
      title: '数据分析教程',
      description: '学习如何使用数据分析工具进行决策支持',
      duration: '15分钟',
      level: '进阶',
      videoUrl: 'https://www.douyin.com/video/7329876543210123456'
    },
    {
      icon: 'fas fa-bell',
      title: '预警管理指南',
      description: '掌握预警处理和问题解决的完整流程',
      duration: '10分钟',
      level: '中级',
      videoUrl: 'https://www.douyin.com/video/7330123456789012345'
    },
    {
      icon: 'fas fa-cog',
      title: '系统设置说明',
      description: '个性化配置系统参数和通知偏好',
      duration: '8分钟',
      level: '入门',
      videoUrl: 'https://www.douyin.com/video/7331234567890123456'
    },
    {
      icon: 'fas fa-map-marked-alt',
      title: '地图功能详解',
      description: '深入了解监管地图的各项功能和使用技巧',
      duration: '12分钟',
      level: '中级',
      videoUrl: 'https://www.douyin.com/video/7332345678901234567'
    },
    {
      icon: 'fas fa-file-export',
      title: '报表导出教程',
      description: '学习如何导出和分析各类数据报表',
      duration: '10分钟',
      level: '进阶',
      videoUrl: 'https://www.douyin.com/video/7333456789012345678'
    }
  ];
  
  showVideoModal = false;
  selectedVideo: any = null;
  
  constructor(private router: Router) {}
  
  // 切换标签页
  switchTab(tab: 'faq' | 'tutorial' | 'contact'): void {
    this.activeTab = tab;
  }
  
  // 切换FAQ展开状态
  toggleFaq(faq: any): void {
    faq.expanded = !faq.expanded;
  }
  
  // 获取过滤后的FAQs
  get filteredFaqs() {
    if (!this.searchQuery) return this.faqs;
    
    const query = this.searchQuery.toLowerCase();
    return this.faqs.filter(faq => 
      faq.question.toLowerCase().includes(query) || 
      faq.answer.toLowerCase().includes(query)
    );
  }
  
  // 打开视频播放
  openVideoModal(tutorial: any): void {
    this.selectedVideo = tutorial;
    this.showVideoModal = true;
  }
  
  // 关闭视频播放
  closeVideoModal(): void {
    this.showVideoModal = false;
    this.selectedVideo = null;
  }
  
  // 复制视频链接
  copyVideoLink(): void {
    if (this.selectedVideo?.videoUrl) {
      navigator.clipboard.writeText(this.selectedVideo.videoUrl).then(() => {
        alert('视频链接已复制到剪贴板！');
      }).catch(err => {
        console.error('复制失败:', err);
        alert('复制失败，请手动复制链接');
      });
    }
  }
  
  // 返回政务中心
  goBack(): void {
    this.router.navigate(['/government/government-center']);
  }
}

