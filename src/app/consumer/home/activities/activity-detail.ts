import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

interface ActivityDetail {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  image: string;
  startDate: string;
  endDate: string;
  participants: number;
  maxParticipants: number;
  status: 'ongoing' | 'upcoming' | 'completed';
  rewards: string[];
  progress: number;
  category: string;
  tags: string[];
  rules: string[];
  timeline: Array<{ date: string; title: string; description: string }>;
  organizer: string;
  location: string;
  contactInfo: string;
  relatedActivities?: Array<{ id: string; title: string; image: string }>;
}

@Component({
  selector: 'app-activity-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-detail.html',
  styleUrls: ['./activity-detail.scss']
})
export class ActivityDetailComponent implements OnInit {
  activity: ActivityDetail | null = null;
  isLoading: boolean = true;
  hasJoined: boolean = false;
  
  // 模拟活动数据库（包含所有5个活动的完整数据）
  private activitiesDatabase: { [key: string]: ActivityDetail } = {
    '1': {
      id: '1',
      tag: '环保挑战',
      title: '绿色生活挑战赛',
      subtitle: '21天环保习惯养成',
      description: '参与21天环保挑战，每日完成环保任务，养成绿色生活习惯',
      longDescription: `🌱 21天养成一个好习惯！加入我们的绿色生活挑战赛，通过每天的环保小任务，让环保成为你生活的一部分。

挑战内容：
📅 连续21天完成环保任务
✅ 每日打卡记录环保行动
🏆 累计积分解锁成就徽章
👥 邀请好友一起参与挑战
📊 查看个人环保数据统计

每日任务示例：
♻️ 正确分类投放垃圾
🚶 步行或骑行代替开车
💧 节约用水（洗菜水浇花等）
💡 随手关灯关电器
🛍️ 使用环保购物袋
📱 学习一个环保知识

坚持21天，让环保成为习惯！你准备好接受挑战了吗？`,
      image: 'green-challenge.jpg',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      participants: 1250,
      maxParticipants: 2000,
      status: 'ongoing',
      rewards: ['环保达人徽章', '300积分奖励', '专属头像框', '挑战完成证书'],
      progress: 65,
      category: 'challenge',
      tags: ['环保', '挑战', '习惯养成'],
      rules: [
        '连续21天每日完成至少1项环保任务',
        '每日打卡时间为早6:00至晚23:59',
        '打卡时需上传环保行动照片或记录',
        '中断打卡需重新开始计算天数',
        '完成挑战后3个工作日内发放奖励'
      ],
      timeline: [
        {
          date: '2024-01-01',
          title: '挑战开始',
          description: '开启21天环保习惯养成之旅'
        },
        {
          date: '2024-01-08',
          title: '第一周完成',
          description: '坚持7天，获得"初心不改"徽章'
        },
        {
          date: '2024-01-15',
          title: '第二周完成',
          description: '坚持14天，获得"持之以恒"徽章'
        },
        {
          date: '2024-01-21',
          title: '挑战完成',
          description: '完成21天挑战，获得"环保达人"认证'
        },
        {
          date: '2024-01-31',
          title: '活动结束',
          description: '颁发奖励，优秀参与者展示'
        }
      ],
      organizer: '智能回收平台 × 绿色生活推广中心',
      location: '线上活动（全国范围）',
      contactInfo: '客服热线：400-888-6666',
      relatedActivities: [
        { id: '2', title: '社区回收日', image: 'community.jpg' },
        { id: '5', title: '新年环保决心', image: 'new-year.jpg' }
      ]
    },
    '2': {
      id: '2',
      tag: '社区活动',
      title: '社区回收日',
      subtitle: '每周六集中回收活动',
      description: '每周六上午9-11点，社区集中回收活动，专业回收员现场指导',
      longDescription: `🏘️ 让环保融入社区生活！每周六上午，我们在社区设立回收点，专业回收员现场为您提供分类指导，让垃圾分类变得简单易行。

活动特色：
👨‍🏫 专业指导：回收员现场讲解分类知识
📦 便捷回收：一站式回收各类可回收物
💰 现场返利：当场结算回收费用
🎁 积分奖励：每次参与获得环保积分
📚 知识科普：免费领取环保宣传册

可回收物品：
📄 纸类：报纸、书本、纸箱等
🍾 塑料：饮料瓶、塑料盒等
🥫 金属：易拉罐、废铁等
📱 电子：旧手机、电池等
👕 纺织：旧衣服、布料等

让我们一起行动，让社区更美好！每周六，不见不散！`,
      image: 'community-recycle.jpg',
      startDate: '2024-01-06',
      endDate: '2024-12-31',
      participants: 89,
      maxParticipants: 150,
      status: 'ongoing',
      rewards: ['参与证书', '每次50积分', '环保小礼品', '优秀参与者奖励'],
      progress: 59,
      category: 'community',
      tags: ['社区', '回收', '定期活动'],
      rules: [
        '每周六上午9:00-11:00 在社区指定地点参与',
        '携带分类好的可回收物品',
        '现场扫码登记，完成积分累计',
        '遵守现场秩序，配合工作人员指导',
        '累计参与满10次可获得优秀参与者证书'
      ],
      timeline: [
        {
          date: '每周六 09:00',
          title: '活动开始',
          description: '回收点开放，接收可回收物'
        },
        {
          date: '每周六 09:30',
          title: '知识讲座',
          description: '环保知识科普讲座（自愿参加）'
        },
        {
          date: '每周六 10:30',
          title: '互动问答',
          description: '环保知识问答，答对有奖'
        },
        {
          date: '每周六 11:00',
          title: '活动结束',
          description: '统计数据，发放积分'
        }
      ],
      organizer: '社区居委会 × 智能回收平台',
      location: '各社区指定回收点（详见活动公告）',
      contactInfo: '社区热线：查看所在社区公告栏',
      relatedActivities: [
        { id: '1', title: '绿色生活挑战赛', image: 'green-challenge.jpg' },
        { id: '4', title: '废物利用创意大赛', image: 'creative.jpg' }
      ]
    },
    '3': {
      id: '3',
      tag: '环保活动',
      title: '地球日特别活动',
      subtitle: '保护地球，从我做起',
      description: '4月22日地球日特别活动，线上线下结合，共同为地球环保贡献力量',
      longDescription: `🌍 4月22日是世界地球日，今年的主题是"珍爱地球，人与自然和谐共生"。为响应全球环保行动，我们特别策划了一系列精彩活动，让每个人都能为地球环保贡献自己的力量。

活动亮点：
🌱 环保知识竞答：在线答题，测试你的环保知识
🎁 丰厚奖品：现金红包、环保用品、积分奖励
📸 环保打卡：完成环保任务，养成绿色生活习惯
👥 社区互动：与志同道合的环保达人交流心得
🌳 植树活动：线下植树，为地球增添一抹绿色

让我们携手共建美丽地球家园！每个人的小小行动，都能为地球带来大大改变！`,
      image: 'earth-day.jpg',
      startDate: '2024-04-22',
      endDate: '2024-04-22',
      participants: 156,
      maxParticipants: 5000,
      status: 'upcoming',
      rewards: ['地球守护者徽章', '500积分', '现金红包¥50', '环保纪念品'],
      progress: 0,
      category: 'special',
      tags: ['地球日', '知识竞答', '环保行动'],
      rules: [
        '注册成为平台用户',
        '参与线上环保知识竞答（共50题）',
        '完成至少3项环保打卡任务',
        '邀请好友参与活动（每邀请1人额外获得50积分）',
        '分享活动海报至社交媒体'
      ],
      timeline: [
        {
          date: '2024-04-01',
          title: '活动预热',
          description: '发布活动详情，开放报名通道'
        },
        {
          date: '2024-04-15',
          title: '知识预习',
          description: '发布环保知识学习资料'
        },
        {
          date: '2024-04-22 09:00',
          title: '竞答开始',
          description: '线上知识竞答正式开始'
        },
        {
          date: '2024-04-22 20:00',
          title: '颁奖典礼',
          description: '线上直播颁奖，公布获奖名单'
        }
      ],
      organizer: '市环保协会 × 智能回收平台',
      location: '线上活动（全国范围）',
      contactInfo: '客服微信：EcoHelper2024',
      relatedActivities: [
        { id: '1', title: '绿色生活挑战赛', image: 'green-challenge.jpg' },
        { id: '4', title: '废物利用创意大赛', image: 'creative.jpg' }
      ]
    },
    '4': {
      id: '4',
      tag: '创意比赛',
      title: '废物利用创意大赛',
      subtitle: '变废为宝，创意无限',
      description: '发挥创意，将废弃物品改造成实用或艺术品，展示环保创意',
      longDescription: `♻️ 一个人的垃圾，可能是另一个人的宝藏！废物利用创意大赛邀请您发挥无限创意，将日常生活中的废弃物品改造成精美的艺术品或实用的生活用品。

比赛主题：
🎨 艺术创作：利用废旧材料创作艺术品
🏠 家居改造：废弃物品变身家居装饰
👗 时尚设计：环保材料制作服装配饰
🎁 实用改造：废品改造成日用品
🌱 绿色科技：创新环保科技产品

奖项设置：
🥇 一等奖（1名）：奖金5000元 + 作品展览机会
🥈 二等奖（3名）：奖金2000元 + 媒体报道
🥉 三等奖（5名）：奖金1000元 + 环保礼包
🎖️ 优秀奖（10名）：500积分 + 纪念证书

让创意点亮环保，让废物焕发新生！`,
      image: 'creative-contest.jpg',
      startDate: '2024-02-15',
      endDate: '2024-03-15',
      participants: 89,
      maxParticipants: 500,
      status: 'upcoming',
      rewards: ['创意奖金最高5000元', '作品展示机会', '媒体专访报道', '环保达人认证'],
      progress: 0,
      category: 'contest',
      tags: ['创意', '比赛', '废物利用'],
      rules: [
        '参赛作品必须由废弃物品制作而成',
        '提交作品照片及制作说明（不少于200字）',
        '每人最多提交3件作品',
        '作品必须为原创，不得抄袭',
        '评选结果将在活动结束后7个工作日内公布'
      ],
      timeline: [
        {
          date: '2024-02-15',
          title: '报名开始',
          description: '开放作品提交通道'
        },
        {
          date: '2024-03-01',
          title: '作品征集截止',
          description: '停止接收新作品'
        },
        {
          date: '2024-03-08',
          title: '专家评审',
          description: '环保专家和艺术家评选优秀作品'
        },
        {
          date: '2024-03-15',
          title: '颁奖典礼',
          description: '线上颁奖，作品展示'
        }
      ],
      organizer: '市文化艺术中心 × 环保协会',
      location: '线上提交作品，线下颁奖展览',
      contactInfo: '邮箱：creative@eco-platform.com',
      relatedActivities: [
        { id: '3', title: '地球日特别活动', image: 'earth-day.jpg' },
        { id: '2', title: '社区回收日', image: 'community.jpg' }
      ]
    },
    '5': {
      id: '5',
      tag: '环保目标',
      title: '新年环保决心',
      subtitle: '2024新年环保目标设定',
      description: '新年伊始，设定个人环保目标，记录环保行动，分享环保心得',
      longDescription: `🎊 新年新气象，让我们从设定环保目标开始，用实际行动守护地球家园！2024年，让环保成为你的生活方式。

活动内容：
📝 目标设定：制定个人年度环保目标
📊 进度追踪：记录每日环保行动
🏆 成就解锁：完成目标获得徽章奖励
📱 社区打卡：分享环保心得和经验
🎁 惊喜奖励：坚持打卡赢取现金红包

推荐目标：
♻️ 每月至少参与1次垃圾分类活动
🚶 每周至少3次步行或骑行代替开车
🛍️ 使用环保购物袋，拒绝一次性塑料袋
💧 节约用水用电，培养环保好习惯
🌱 每月学习一个环保知识

虽然活动已结束，但环保行动永不停止！快来看看其他正在进行的活动吧！`,
      image: 'new-year-eco.jpg',
      startDate: '2024-01-01',
      endDate: '2024-01-07',
      participants: 2340,
      maxParticipants: 3000,
      status: 'completed',
      rewards: ['新年环保徽章', '100积分', '环保台历', '优秀目标奖金¥88'],
      progress: 100,
      category: 'goal',
      tags: ['新年', '目标', '环保决心'],
      rules: [
        '活动期间设定至少3个环保目标',
        '每日打卡记录环保行动',
        '连续打卡7天完成活动',
        '分享环保心得至朋友圈（至少1次）',
        '邀请好友参与（可选，额外奖励）'
      ],
      timeline: [
        {
          date: '2024-01-01',
          title: '活动启动',
          description: '新年第一天，开启环保新旅程'
        },
        {
          date: '2024-01-03',
          title: '中期检查',
          description: '检查目标完成情况，互相鼓励'
        },
        {
          date: '2024-01-05',
          title: '经验分享',
          description: '分享环保小技巧和心得'
        },
        {
          date: '2024-01-07',
          title: '活动结束',
          description: '统计完成情况，发放奖励'
        }
      ],
      organizer: '智能回收平台',
      location: '线上活动',
      contactInfo: '客服热线：400-888-6666',
      relatedActivities: [
        { id: '1', title: '绿色生活挑战赛', image: 'green-challenge.jpg' },
        { id: '2', title: '社区回收日', image: 'community.jpg' }
      ]
    }
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    // 获取路由参数中的活动ID
    this.route.paramMap.subscribe(params => {
      const activityId = params.get('id');
      if (activityId) {
        this.loadActivityDetail(activityId);
      } else {
        this.router.navigate(['/consumer/home']);
      }
    });

    // 检查是否已参与
    this.checkJoinStatus();
  }

  loadActivityDetail(id: string): void {
    this.isLoading = true;
    
    // 模拟API调用延迟
    setTimeout(() => {
      this.activity = this.activitiesDatabase[id] || null;
      this.isLoading = false;
      
      if (!this.activity) {
        // 活动不存在，返回首页
        alert('活动不存在或已下架');
        this.router.navigate(['/consumer/home']);
      }
    }, 500);
  }

  checkJoinStatus(): void {
    // 从本地存储检查是否已参与
    const joinedActivities = localStorage.getItem('joinedActivities');
    if (joinedActivities && this.activity) {
      const joined = JSON.parse(joinedActivities);
      this.hasJoined = joined.includes(this.activity.id);
    }
  }

  goBack(): void {
    // 使用浏览器历史返回，如果没有历史则返回首页
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/consumer/home']);
    }
  }

  joinActivity(): void {
    if (!this.activity || this.hasJoined) return;
    
    if (this.activity.participants >= this.activity.maxParticipants) {
      alert('活动人数已满，请关注其他活动！');
      return;
    }

    // 更新参与状态
    this.activity.participants += 1;
    this.hasJoined = true;

    // 保存到本地存储
    const joinedActivities = localStorage.getItem('joinedActivities');
    const joined = joinedActivities ? JSON.parse(joinedActivities) : [];
    joined.push(this.activity.id);
    localStorage.setItem('joinedActivities', JSON.stringify(joined));

    // 显示成功提示
    this.showSuccessToast(`成功加入活动：${this.activity.title}`);
  }

  shareActivity(): void {
    if (!this.activity) return;

    if (navigator.share) {
      navigator.share({
        title: this.activity.title,
        text: this.activity.description,
        url: window.location.href
      }).catch(err => console.log('分享失败:', err));
    } else {
      // 复制链接到剪贴板
      navigator.clipboard.writeText(window.location.href).then(() => {
        this.showSuccessToast('活动链接已复制到剪贴板');
      }).catch(() => {
        this.showSuccessToast('分享功能暂不可用');
      });
    }
  }

  viewRelatedActivity(activityId: string): void {
    this.router.navigate(['/consumer/activity-detail', activityId]);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'ongoing': return '进行中';
      case 'upcoming': return '即将开始';
      case 'completed': return '已结束';
      default: return '';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'ongoing': return '#4CAF50';
      case 'upcoming': return '#2196F3';
      case 'completed': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  }

  getParticipationRate(): number {
    if (!this.activity) return 0;
    return Math.round((this.activity.participants / this.activity.maxParticipants) * 100);
  }

  getDaysRemaining(): number {
    if (!this.activity) return 0;
    const endDate = new Date(this.activity.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }

  private showSuccessToast(message: string): void {
    // 简单的Toast提示实现
    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(76, 175, 80, 0.95);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      z-index: 9999;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      animation: fadeInOut 2s ease-in-out;
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 2000);
  }
}

