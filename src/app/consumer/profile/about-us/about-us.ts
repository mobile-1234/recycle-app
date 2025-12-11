import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface ChangelogItem {
  version: string;
  date: Date;
  changes: string[];
}

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-us.html',
  styleUrls: ['./about-us.scss']
})
export class AboutUsPage implements OnInit {
  // 应用信息
  appVersion = '2.1.0';
  updateDate = '2024-01-15';
  appSize = '45.2MB';

  // 统计数据
  totalUsers = '50万+';
  totalOrders = '120万+';
  totalWeight = '8,500';
  carbonReduction = '12,300';

  // 最近更新日志
  recentChangelogs: ChangelogItem[] = [
    {
      version: '2.1.0',
      date: new Date('2024-01-15'),
      changes: [
        '新增积分商城功能',
        '优化回收预约流程',
        '修复已知问题，提升稳定性',
        '新增环保知识分享功能'
      ]
    },
    {
      version: '2.0.5',
      date: new Date('2023-12-20'),
      changes: [
        '优化用户界面设计',
        '提升应用启动速度',
        '修复部分机型兼容性问题'
      ]
    },
    {
      version: '2.0.0',
      date: new Date('2023-11-30'),
      changes: [
        '全新UI设计',
        '新增碳足迹追踪功能',
        '支持多种回收物品类型',
        '优化积分奖励机制'
      ]
    }
  ];

  constructor(
    private router: Router
  ) {}

  ngOnInit() {
    // 页面初始化
  }

  /**
   * 返回上一页
   */
  goBack() {
    this.router.navigate(['/consumer/profile']);
  }

  /**
   * 关注微信公众号
   */
  async followWeChat() {
    if (confirm('是否关注我们的微信公众号？')) {
      try {
        await this.copyToClipboard('再生视界助手');
        this.showAlert('公众号名称已复制到剪贴板');
      } catch (error) {
        this.showAlert('复制失败，请手动搜索：再生视界助手');
      }
    }
  }

  /**
   * 关注微博
   */
  async followWeibo() {
    if (confirm('是否关注我们的官方微博？')) {
      try {
        await this.copyToClipboard('@再生视界助手官方');
        this.showAlert('微博账号已复制到剪贴板');
      } catch (error) {
        this.showAlert('复制失败，请手动搜索：@再生视界助手官方');
      }
    }
  }

  /**
   * 关注抖音号
   */
  async followDouyin() {
    if (confirm('是否关注我们的抖音账号？')) {
      try {
        await this.copyToClipboard('再生视界小助手');
        this.showAlert('抖音账号已复制到剪贴板');
      } catch (error) {
        this.showAlert('复制失败，请手动搜索：再生视界小助手');
      }
    }
  }

  /**
   * 查看用户协议
   */
  viewUserAgreement() {
    this.router.navigate(['/consumer/profile/user-agreement']);
  }

  /**
   * 查看隐私政策
   */
  viewPrivacyPolicy() {
    this.router.navigate(['/consumer/profile/privacy-policy']);
  }

  /**
   * 查看完整更新日志
   */
  async viewAllChangelog() {
    this.showAlert('完整更新日志功能开发中...');
  }

  /**
   * 格式化日期
   */
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * 复制到剪贴板
   */
  private async copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  }

  /**
   * 打开网站
   */
  private openWebsite(url: string) {
    window.open(url, '_blank');
  }

  /**
   * 显示提示信息
   */
  private showAlert(message: string) {
    alert(message);
  }
}