import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './privacy-policy.html',
  styleUrls: ['./privacy-policy.scss']
})
export class PrivacyPolicyPage implements OnInit {
  // 政策信息
  updateDate = '2024年1月15日';
  effectiveDate = '2024年1月20日';
  
  // 是否显示同意/不同意按钮（用于注册流程）
  showActions = false;
  
  // 来源页面（用于判断是否来自注册流程）
  fromPage = '';

  constructor(
    private router: Router
  ) {}

  ngOnInit() {
    // 可以从路由参数获取信息
    // this.fromPage = this.route.snapshot.queryParams['from'] || '';
    // this.showActions = this.fromPage === 'register';
  }

  /**
   * 返回上一页
   */
  goBack() {
    this.router.navigate(['/consumer/profile']);
  }

  /**
   * 用户同意政策
   */
  agree() {
    if (this.fromPage === 'register') {
      // 如果是从注册页面来的，返回注册页面并传递同意状态
      this.router.navigate(['/register'], { queryParams: { privacyAgreed: 'true' } });
    } else {
      this.showAlert('感谢您同意我们的隐私政策！');
    }
  }

  /**
   * 用户不同意政策
   */
  disagree() {
    if (this.fromPage === 'register') {
      if (confirm('不同意隐私政策将无法完成注册，确定要返回吗？')) {
        this.router.navigate(['/register']);
      }
    } else {
      this.showAlert('您选择了不同意隐私政策。');
    }
  }

  // 滚动到顶部
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // 滚动到指定章节
  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // 显示提示
  private showAlert(message: string) {
    alert(message);
  }
}