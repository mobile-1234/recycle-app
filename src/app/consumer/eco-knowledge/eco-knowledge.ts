import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BottomNavComponent } from '../../shared/bottom-nav/bottom-nav.component';

@Component({
  selector: 'app-eco-knowledge',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, BottomNavComponent],
  templateUrl: './eco-knowledge.html',
  styleUrl: './eco-knowledge.scss'
})
export class EcoKnowledge {
  // 顶部导航返回
  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/consumer/points-mall']);
  }

  // 搜索与分类
  searchText = '';
  categories = [
    { id: 'all', name: '全部', icon: 'fas fa-th-large', active: true },
    { id: 'ar', name: 'AR分类教程', icon: 'fas fa-cube', active: false },
    { id: 'policy', name: '政策解读', icon: 'fas fa-file-alt', active: false },
    { id: 'share', name: '达人分享', icon: 'fas fa-users', active: false },
    { id: 'ranking', name: '环保榜单', icon: 'fas fa-trophy', active: false }
  ];

  selectCategory(catId: string): void {
    this.categories.forEach(c => (c.active = c.id === catId));
    this.selectedCategory = catId;
  }

  selectedCategory = 'all';

  // 内容列表（示例数据）
  contents = [
    {
      id: 1,
      title: 'AR智能分类教程：如何正确区分可回收物与干垃圾',
      desc: '使用AR功能快速识别各类可回收物品，提高分类准确率，避免错误投放...',
      tag: 'AR教程',
      time: '15分钟前',
      icon: 'fas fa-play-circle',
      imageClass: 'image-1 video',
      liked: false,
      likes: 86,
      favorited: false
    },
    {
      id: 2,
      title: '最新环保政策解读：以旧换新补贴标准与申请流程',
      desc: '了解国家最新出台的以旧换新政策，掌握补贴申请流程，享受政策红利...',
      tag: '政策解读',
      time: '1天前',
      icon: 'fas fa-newspaper',
      imageClass: 'image-2',
      liked: false,
      likes: 142,
      favorited: false
    },
    {
      id: 3,
      title: '环保达人分享：我是如何月赚500元回收金的经验技巧',
      desc: '听听环保达人的经验分享，学习高效回收的小技巧，让废品变废为宝...',
      tag: '达人分享',
      time: '3天前',
      icon: 'fas fa-user',
      imageClass: 'image-3',
      liked: false,
      likes: 328,
      favorited: false,
      progress: 75
    },
    {
      id: 4,
      title: '2023年度环保达人榜单发布，看看谁是最强回收王',
      desc: '年度环保达人榜单新鲜出炉，学习榜样的回收经验，提升自己的环保贡献...',
      tag: '环保榜单',
      time: '1周前',
      icon: 'fas fa-trophy',
      imageClass: 'image-4',
      liked: false,
      likes: 528,
      favorited: false
    }
  ];

  // 交互方法
  toggleFavorite(item: any): void {
    item.favorited = !item.favorited;
  }

  toggleLike(item: any): void {
    item.liked = !item.liked;
    item.likes += item.liked ? 1 : -1;
  }

  // 模态框
  showModal = false;
  modalTitle = '';
  modalTag = '';
  modalIcon = '';
  openContent(item: any): void {
    this.modalTitle = item.title;
    this.modalTag = item.tag;
    this.modalIcon = item.icon;
    this.showModal = true;
  }
  closeModal(): void {
    this.showModal = false;
  }
}
