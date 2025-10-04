import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface InviteRecord {
  id: string;
  nickname: string;
  avatar?: string;
  inviteTime: Date;
  status: 'pending' | 'success' | 'expired';
  rewardPoints: number;
  completedOrders: number;
}

type TabType = 'all' | 'success' | 'pending';

@Component({
  selector: 'app-invite-friends',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invite-friends.html',
  styleUrls: ['./invite-friends.scss']
})
export class InviteFriendsComponent implements OnInit {
  
  // 邀请码
  inviteCode = 'RCY2024';
  
  // 当前选中的标签
  activeTab: TabType = 'all';
  
  // 邀请记录
  inviteRecords: InviteRecord[] = [
    {
      id: '1',
      nickname: '环保小达人',
      avatar: '',
      inviteTime: new Date('2024-01-15'),
      status: 'success',
      rewardPoints: 35,
      completedOrders: 3
    },
    {
      id: '2',
      nickname: '绿色生活家',
      avatar: '',
      inviteTime: new Date('2024-01-10'),
      status: 'success',
      rewardPoints: 25,
      completedOrders: 1
    },
    {
      id: '3',
      nickname: '回收新手',
      avatar: '',
      inviteTime: new Date('2024-01-08'),
      status: 'pending',
      rewardPoints: 10,
      completedOrders: 0
    },
    {
      id: '4',
      nickname: '地球守护者',
      avatar: '',
      inviteTime: new Date('2024-01-05'),
      status: 'success',
      rewardPoints: 45,
      completedOrders: 5
    },
    {
      id: '5',
      nickname: '环保志愿者',
      avatar: '',
      inviteTime: new Date('2024-01-03'),
      status: 'pending',
      rewardPoints: 10,
      completedOrders: 0
    }
  ];
  
  // 统计数据
  totalInvites = 0;
  totalRewardPoints = 0;
  totalRewardCash = 0;
  successfulInvites = 0;
  thisMonthRewards = 0;
  
  constructor(private router: Router) {}
  
  ngOnInit() {
    this.calculateStats();
  }
  
  // 计算统计数据
  calculateStats() {
    this.totalInvites = this.inviteRecords.length;
    this.successfulInvites = this.inviteRecords.filter(r => r.status === 'success').length;
    this.totalRewardPoints = this.inviteRecords.reduce((sum, r) => sum + r.rewardPoints, 0);
    this.totalRewardCash = Math.floor(this.totalRewardPoints / 100 * 10) / 10; // 100积分=1元
    
    // 计算本月奖励
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    this.thisMonthRewards = this.inviteRecords
      .filter(r => {
        const recordDate = new Date(r.inviteTime);
        return recordDate.getMonth() === currentMonth && 
               recordDate.getFullYear() === currentYear;
      })
      .reduce((sum, r) => sum + r.rewardPoints, 0);
  }
  
  // 复制邀请码
  copyInviteCode() {
    navigator.clipboard.writeText(this.inviteCode).then(() => {
      this.showAlert('邀请码已复制到剪贴板', 'success');
    }).catch(() => {
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = this.inviteCode;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      this.showAlert('邀请码已复制到剪贴板', 'success');
    });
  }
  
  // 保存二维码
  saveQRCode() {
    this.showAlert('二维码保存功能开发中', 'info');
  }
  
  // 分享到微信
  shareToWeChat() {
    const shareText = `我在使用一个很棒的回收应用，邀请你一起加入环保行动！使用我的邀请码 ${this.inviteCode} 注册，我们都能获得奖励哦！`;
    this.shareContent(shareText, 'wechat');
  }
  
  // 分享到QQ
  shareToQQ() {
    const shareText = `我在使用一个很棒的回收应用，邀请你一起加入环保行动！使用我的邀请码 ${this.inviteCode} 注册，我们都能获得奖励哦！`;
    this.shareContent(shareText, 'qq');
  }
  
  // 分享到微博
  shareToWeibo() {
    const shareText = `我在使用一个很棒的回收应用，邀请你一起加入环保行动！使用我的邀请码 ${this.inviteCode} 注册，我们都能获得奖励哦！#环保回收# #绿色生活#`;
    this.shareContent(shareText, 'weibo');
  }
  
  // 复制分享链接
  shareLink() {
    const shareLink = `https://recycle-app.com/invite?code=${this.inviteCode}`;
    navigator.clipboard.writeText(shareLink).then(() => {
      this.showAlert('邀请链接已复制到剪贴板', 'success');
    }).catch(() => {
      this.showAlert('复制失败，请手动复制', 'error');
    });
  }
  
  // 通用分享内容处理
  private shareContent(text: string, platform: string) {
    // 在实际应用中，这里会调用相应平台的分享API
    this.showAlert(`正在打开${this.getPlatformName(platform)}分享`, 'info');
  }
  
  // 获取平台名称
  private getPlatformName(platform: string): string {
    const names: { [key: string]: string } = {
      'wechat': '微信',
      'qq': 'QQ',
      'weibo': '微博'
    };
    return names[platform] || platform;
  }
  
  // 切换标签
  switchTab(tab: TabType) {
    this.activeTab = tab;
  }
  
  // 获取过滤后的记录
  getFilteredRecords(): InviteRecord[] {
    switch (this.activeTab) {
      case 'success':
        return this.inviteRecords.filter(r => r.status === 'success');
      case 'pending':
        return this.inviteRecords.filter(r => r.status === 'pending');
      default:
        return this.inviteRecords;
    }
  }
  
  // 获取成功邀请数量
  getSuccessCount(): number {
    return this.inviteRecords.filter(r => r.status === 'success').length;
  }
  
  // 获取待完成数量
  getPendingCount(): number {
    return this.inviteRecords.filter(r => r.status === 'pending').length;
  }
  
  // 获取状态文本
  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'success': '已完成首次回收',
      'pending': '已注册，待首次回收',
      'expired': '邀请已过期'
    };
    return statusMap[status] || status;
  }
  
  // 格式化日期
  formatDate(date: Date): string {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return '今天';
    } else if (diffDays === 1) {
      return '昨天';
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return date.toLocaleDateString('zh-CN', {
        month: 'short',
        day: 'numeric'
      });
    }
  }
  
  // 获取空状态消息
  getEmptyMessage(): string {
    switch (this.activeTab) {
      case 'success':
        return '还没有成功的邀请记录';
      case 'pending':
        return '没有待完成的邀请';
      default:
        return '还没有邀请记录，快去邀请好友吧！';
    }
  }
  
  // 返回上一页
  goBack() {
    this.router.navigate(['/consumer/profile']);
  }
  
  // 显示提示信息
  private showAlert(message: string, type: 'success' | 'error' | 'info') {
    // 简单的提示实现
    alert(message);
  }
}