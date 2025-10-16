import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notification-settings',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './notification-settings.html',
  styleUrl: './notification-settings.scss'
})
export class NotificationSettings implements OnInit {
  // 通知设置
  notificationSettings = {
    systemAlerts: true,
    dataReports: true,
    policyUpdates: true,
    emailNotifications: false,
    email: '',
    smsNotifications: false,
    phone: ''
  };
  
  constructor(private router: Router) {}
  
  ngOnInit(): void {
    // 从本地存储加载通知设置
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      this.notificationSettings = JSON.parse(savedSettings);
    }
  }
  
  // 保存通知设置
  saveNotificationSettings(): void {
    if (this.notificationSettings.emailNotifications && !this.notificationSettings.email) {
      alert('请输入接收邮箱');
      return;
    }
    
    if (this.notificationSettings.smsNotifications && !this.notificationSettings.phone) {
      alert('请输入手机号码');
      return;
    }
    
    // 保存到本地存储
    localStorage.setItem('notificationSettings', JSON.stringify(this.notificationSettings));
    alert('通知设置保存成功！');
  }
  
  // 返回政务中心
  goBack(): void {
    this.router.navigate(['/government/government-center']);
  }
}

