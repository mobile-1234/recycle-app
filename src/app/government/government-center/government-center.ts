import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface GovernmentInfo {
  name: string;
  department: string;
  position: string;
  phone: string;
  email: string;
  region: string;
  avatar: string;
}

@Component({
  selector: 'app-government-center',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './government-center.html',
  styleUrl: './government-center.scss'
})
export class GovernmentCenter {
  activeTab: 'region' | 'user' | 'notice' | 'log' | 'settings' | 'profile' = 'profile';
  showProfileModal = false;
  showAvatarModal = false;
  
  // 政府信息
  governmentInfo: GovernmentInfo = {
    name: '政府管理员',
    department: '环保监管局',
    position: '局长',
    phone: '010-12345678',
    email: 'admin@gov.cn',
    region: '全市',
    avatar: ''
  };

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

  switchTab(tab: 'region' | 'user' | 'notice' | 'log' | 'settings' | 'profile'): void {
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
      // 清除用户信息
      localStorage.removeItem('currentUser');
      localStorage.removeItem('governmentInfo');
      alert('已退出登录');
      // 跳转到登录页
      this.router.navigate(['/auth/login']);
    }
  }

  // 打开个人信息编辑弹窗
  openProfileModal(): void {
    this.showProfileModal = true;
  }

  // 关闭个人信息编辑弹窗
  closeProfileModal(): void {
    this.showProfileModal = false;
  }

  // 保存个人信息
  saveProfile(): void {
    // 保存到localStorage
    localStorage.setItem('governmentInfo', JSON.stringify(this.governmentInfo));
    alert('信息保存成功！');
    this.closeProfileModal();
  }

  // 打开头像上传弹窗
  openAvatarModal(): void {
    this.showAvatarModal = true;
  }

  // 关闭头像上传弹窗
  closeAvatarModal(): void {
    this.showAvatarModal = false;
  }

  // 选择头像
  onAvatarSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.governmentInfo.avatar = e.target?.result as string;
        localStorage.setItem('governmentInfo', JSON.stringify(this.governmentInfo));
        this.closeAvatarModal();
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  // 使用默认头像
  useDefaultAvatar(avatar: string): void {
    this.governmentInfo.avatar = avatar;
    localStorage.setItem('governmentInfo', JSON.stringify(this.governmentInfo));
    this.closeAvatarModal();
  }

  constructor(private router: Router) {
    // 从localStorage加载政府信息
    const savedInfo = localStorage.getItem('governmentInfo');
    if (savedInfo) {
      this.governmentInfo = JSON.parse(savedInfo);
    }
  }
}
