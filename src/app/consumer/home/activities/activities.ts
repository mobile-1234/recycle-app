import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SvgIconComponent } from '../../../shared/components/svg-icons/svg-icons.component';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [CommonModule, SvgIconComponent],
  templateUrl: './activities.html',
  styleUrls: ['./activities.scss']
})
export class ActivitiesComponent implements OnInit {
  selectedTab = 'ongoing';
  
  activities = {
    ongoing: [
      {
        id: 1,
        title: '绿色生活挑战赛',
        subtitle: '21天环保习惯养成',
        description: '参与21天环保挑战，每日完成环保任务，养成绿色生活习惯',
        image: 'green-challenge.jpg',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        participants: 1250,
        maxParticipants: 2000,
        status: 'ongoing',
        rewards: ['环保达人徽章', '100积分奖励', '专属头像框'],
        progress: 65,
        category: 'challenge',
        tags: ['环保', '挑战', '习惯养成']
      },
      {
        id: 2,
        title: '社区回收日',
        subtitle: '每周六集中回收活动',
        description: '每周六上午9-11点，社区集中回收活动，专业回收员现场指导',
        image: 'community-recycle.jpg',
        startDate: '2024-01-06',
        endDate: '2024-12-31',
        participants: 89,
        maxParticipants: 150,
        status: 'ongoing',
        rewards: ['参与证书', '50积分', '环保小礼品'],
        progress: 59,
        category: 'community',
        tags: ['社区', '回收', '定期活动']
      }
    ],
    upcoming: [
      {
        id: 3,
        title: '地球日特别活动',
        subtitle: '保护地球，从我做起',
        description: '4月22日地球日特别活动，线上线下结合，共同为地球环保贡献力量',
        image: 'earth-day.jpg',
        startDate: '2024-04-22',
        endDate: '2024-04-22',
        participants: 0,
        maxParticipants: 5000,
        status: 'upcoming',
        rewards: ['地球守护者徽章', '200积分', '环保纪念品'],
        progress: 0,
        category: 'special',
        tags: ['地球日', '特别活动', '环保']
      },
      {
        id: 4,
        title: '废物利用创意大赛',
        subtitle: '变废为宝，创意无限',
        description: '发挥创意，将废弃物品改造成实用或艺术品，展示环保创意',
        image: 'creative-contest.jpg',
        startDate: '2024-02-15',
        endDate: '2024-03-15',
        participants: 0,
        maxParticipants: 500,
        status: 'upcoming',
        rewards: ['创意奖金', '作品展示', '媒体报道'],
        progress: 0,
        category: 'contest',
        tags: ['创意', '比赛', '废物利用']
      }
    ],
    completed: [
      {
        id: 5,
        title: '新年环保决心',
        subtitle: '2024新年环保目标设定',
        description: '新年伊始，设定个人环保目标，记录环保行动，分享环保心得',
        image: 'new-year-eco.jpg',
        startDate: '2024-01-01',
        endDate: '2024-01-07',
        participants: 2340,
        maxParticipants: 3000,
        status: 'completed',
        rewards: ['新年徽章', '80积分', '环保日历'],
        progress: 100,
        category: 'goal',
        tags: ['新年', '目标', '环保决心']
      }
    ]
  };

  constructor(private router: Router) {}

  ngOnInit() {}

  goBack() {
    this.router.navigate(['/consumer/home']);
  }

  switchTab(tab: string) {
    this.selectedTab = tab;
  }

  getTabTitle(tab: string): string {
    switch (tab) {
      case 'ongoing':
        return '进行中';
      case 'upcoming':
        return '即将开始';
      case 'completed':
        return '已结束';
      default:
        return '';
    }
  }

  getTabCount(tab: string): number {
    return this.activities[tab as keyof typeof this.activities]?.length || 0;
  }

  getCurrentActivities() {
    return this.activities[this.selectedTab as keyof typeof this.activities] || [];
  }

  joinActivity(activity: any) {
    if (activity.status === 'ongoing' || activity.status === 'upcoming') {
      // 模拟加入活动
      activity.participants += 1;
      alert(`成功加入活动: ${activity.title}`);
    }
  }

  viewActivityDetails(activity: any) {
    // 可以导航到活动详情页面
    console.log('查看活动详情:', activity);
  }

  shareActivity(activity: any) {
    // 分享活动功能
    if (navigator.share) {
      navigator.share({
        title: activity.title,
        text: activity.description,
        url: window.location.href
      });
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href);
      alert('活动链接已复制到剪贴板');
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'ongoing':
        return '进行中';
      case 'upcoming':
        return '即将开始';
      case 'completed':
        return '已结束';
      default:
        return '';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'ongoing':
        return '#4CAF50';
      case 'upcoming':
        return '#2196F3';
      case 'completed':
        return '#9E9E9E';
      default:
        return '#9E9E9E';
    }
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'challenge':
        return 'challenge';
      case 'community':
        return 'community';
      case 'special':
        return 'special';
      case 'contest':
        return 'contest';
      case 'goal':
        return 'goal';
      default:
        return 'activity';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      month: 'short',
      day: 'numeric'
    });
  }

  getParticipationRate(activity: any): number {
    return Math.round((activity.participants / activity.maxParticipants) * 100);
  }
}