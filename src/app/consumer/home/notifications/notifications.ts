import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SvgIconComponent } from '../../../shared/components/svg-icons/svg-icons.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, SvgIconComponent],
  templateUrl: './notifications.html',
  styleUrls: ['./notifications.scss']
})
export class NotificationsComponent implements OnInit {
  notifications = [
    {
      id: 1,
      type: 'system',
      title: '系统通知',
      message: '您的回收订单已完成，获得积分 50 分',
      time: '2024-01-15 10:30',
      read: false,
      icon: 'notification'
    },
    {
      id: 2,
      type: 'activity',
      title: '活动通知',
      message: '环保知识竞赛开始啦！参与即可获得额外积分',
      time: '2024-01-14 16:20',
      read: false,
      icon: 'activity'
    },
    {
      id: 3,
      type: 'reward',
      title: '奖励通知',
      message: '恭喜您完成每日回收任务，获得现金奖励 ¥5.00',
      time: '2024-01-14 09:15',
      read: true,
      icon: 'reward'
    },
    {
      id: 4,
      type: 'system',
      title: '系统通知',
      message: '您的账户余额已更新，当前余额 ¥125.50',
      time: '2024-01-13 14:45',
      read: true,
      icon: 'notification'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {}

  goBack() {
    this.router.navigate(['/consumer/home']);
  }

  markAsRead(notification: any) {
    notification.read = true;
  }

  markAllAsRead() {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
  }

  deleteNotification(id: number) {
    this.notifications = this.notifications.filter(notification => notification.id !== id);
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'system':
        return 'notification';
      case 'activity':
        return 'activity';
      case 'reward':
        return 'reward';
      default:
        return 'notification';
    }
  }
}