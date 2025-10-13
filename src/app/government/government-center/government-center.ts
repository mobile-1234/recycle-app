import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-government-center',
  imports: [CommonModule, RouterModule],
  templateUrl: './government-center.html',
  styleUrl: './government-center.scss'
})
export class GovernmentCenter {
  activeTab: 'region' | 'user' | 'notice' | 'log' | 'settings' = 'region';

  regions = [
    { name: '朝阳区', manager: '张主任', contact: '138****1234', status: 'active' },
    { name: '海淀区', manager: '李主任', contact: '139****5678', status: 'active' },
    { name: '西城区', manager: '王主任', contact: '137****9012', status: 'active' }
  ];

  users = [
    { name: '赵专员', role: '数据分析员', status: 'active' },
    { name: '钱专员', role: '政策审核员', status: 'active' },
    { name: '孙专员', role: '监管员', status: 'inactive' }
  ];

  notices = [
    { title: '新版补贴政策发布', date: '2023-05-20', status: 'published' },
    { title: '环保标准更新通知', date: '2023-05-18', status: 'draft' }
  ];

  logs = [
    { user: '张主任', action: '审批补贴申请', time: '2023-05-20 10:30' },
    { user: '李主任', action: '发布政策公告', time: '2023-05-20 09:15' }
  ];

  switchTab(tab: 'region' | 'user' | 'notice' | 'log' | 'settings'): void {
    this.activeTab = tab;
  }

  manageRegion(region: any): void {
    alert(`管理辖区: ${region.name}`);
  }

  manageUser(user: any): void {
    alert(`管理用户: ${user.name}`);
  }

  publishNotice(notice: any): void {
    alert(`发布公告: ${notice.title}`);
  }

  logout(): void {
    if (confirm('确定要退出登录吗？')) {
      alert('已退出登录');
    }
  }

  constructor() {}
}
