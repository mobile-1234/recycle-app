import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface FavoriteProduct {
  id: string;
  name: string;
  image: string;
  points: number;
  stock: number;
  selected?: boolean;
}

interface FavoriteKnowledge {
  id: string;
  title: string;
  summary: string;
  image: string;
  category: string;
  categoryIcon: string;
  collectTime: string;
  selected?: boolean;
}

interface CategoryTab {
  id: 'products' | 'knowledge';
  name: string;
  icon: string;
  active: boolean;
  count: number;
}

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './favorites.html',
  styleUrls: ['./favorites.scss']
})
export class FavoritesComponent implements OnInit {
  
  // 分类标签
  categoryTabs: CategoryTab[] = [
    { id: 'products', name: '商品', icon: 'fas fa-shopping-bag', active: true, count: 0 },
    { id: 'knowledge', name: '知识', icon: 'fas fa-book', active: false, count: 0 }
  ];
  
  // 收藏商品
  favoriteProducts: FavoriteProduct[] = [
    {
      id: '1',
      name: '环保购物袋',
      image: 'assets/images/eco-bag.jpg',
      points: 200,
      stock: 50
    },
    {
      id: '2',
      name: '竹纤维牙刷套装',
      image: 'assets/images/bamboo-toothbrush.jpg',
      points: 150,
      stock: 30
    },
    {
      id: '3',
      name: '可降解餐具套装',
      image: 'assets/images/eco-utensils.jpg',
      points: 300,
      stock: 25
    },
    {
      id: '4',
      name: '太阳能充电宝',
      image: 'assets/images/solar-powerbank.jpg',
      points: 800,
      stock: 15
    }
  ];
  
  // 收藏知识
  favoriteKnowledge: FavoriteKnowledge[] = [
    {
      id: '1',
      title: '垃圾分类小贴士：如何正确分类生活垃圾',
      summary: '详细介绍生活中常见垃圾的分类方法，帮助大家养成正确的垃圾分类习惯...',
      image: 'assets/images/waste-sorting.jpg',
      category: '垃圾分类',
      categoryIcon: 'fas fa-recycle',
      collectTime: '2024-01-15'
    },
    {
      id: '2',
      title: '废纸回收的环保价值：每吨废纸可以拯救多少棵树',
      summary: '废纸回收不仅能减少垃圾填埋，还能大大减少对森林资源的消耗...',
      image: 'assets/images/paper-recycle.jpg',
      category: '回收知识',
      categoryIcon: 'fas fa-newspaper',
      collectTime: '2024-01-14'
    },
    {
      id: '3',
      title: '塑料制品的生命周期：从生产到回收的环保之路',
      summary: '了解塑料制品的完整生命周期，学习如何减少塑料污染...',
      image: 'assets/images/plastic-lifecycle.jpg',
      category: '环保科普',
      categoryIcon: 'fas fa-leaf',
      collectTime: '2024-01-13'
    }
  ];
  
  // 当前激活的标签
  activeTab: 'products' | 'knowledge' = 'products';
  
  // 编辑模式
  isEditMode = false;
  
  constructor(private router: Router) {}
  
  ngOnInit() {
    this.updateTabCounts();
  }
  
  // 更新标签计数
  updateTabCounts() {
    this.categoryTabs.forEach(tab => {
      if (tab.id === 'products') {
        tab.count = this.favoriteProducts.length;
      } else if (tab.id === 'knowledge') {
        tab.count = this.favoriteKnowledge.length;
      }
    });
  }
  
  // 选择标签
  selectTab(selectedTab: CategoryTab) {
    this.categoryTabs.forEach(tab => tab.active = false);
    selectedTab.active = true;
    this.activeTab = selectedTab.id;
    this.isEditMode = false; // 切换标签时退出编辑模式
  }
  
  // 切换编辑模式
  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      // 退出编辑模式时清除所有选择
      this.clearAllSelections();
    }
  }
  
  // 清除所有选择
  clearAllSelections() {
    this.favoriteProducts.forEach(product => product.selected = false);
    this.favoriteKnowledge.forEach(article => article.selected = false);
  }
  
  // 更新选择状态
  updateSelection() {
    // 这个方法会在复选框状态改变时被调用
  }
  
  // 获取选中数量
  get selectedCount(): number {
    if (this.activeTab === 'products') {
      return this.favoriteProducts.filter(p => p.selected).length;
    } else {
      return this.favoriteKnowledge.filter(a => a.selected).length;
    }
  }
  
  // 是否全选
  get isAllSelected(): boolean {
    if (this.activeTab === 'products') {
      return this.favoriteProducts.length > 0 && 
             this.favoriteProducts.every(p => p.selected);
    } else {
      return this.favoriteKnowledge.length > 0 && 
             this.favoriteKnowledge.every(a => a.selected);
    }
  }
  
  // 切换全选
  toggleSelectAll() {
    const selectAll = !this.isAllSelected;
    if (this.activeTab === 'products') {
      this.favoriteProducts.forEach(product => product.selected = selectAll);
    } else {
      this.favoriteKnowledge.forEach(article => article.selected = selectAll);
    }
  }
  
  // 切换商品收藏状态
  toggleProductFavorite(product: FavoriteProduct) {
    if (confirm('确定要取消收藏这个商品吗？')) {
      const index = this.favoriteProducts.findIndex(p => p.id === product.id);
      if (index > -1) {
        this.favoriteProducts.splice(index, 1);
        this.updateTabCounts();
        this.showAlert('已取消收藏', 'success');
      }
    }
  }
  
  // 切换知识收藏状态
  toggleKnowledgeFavorite(article: FavoriteKnowledge, event: Event) {
    event.stopPropagation();
    if (confirm('确定要取消收藏这篇文章吗？')) {
      const index = this.favoriteKnowledge.findIndex(a => a.id === article.id);
      if (index > -1) {
        this.favoriteKnowledge.splice(index, 1);
        this.updateTabCounts();
        this.showAlert('已取消收藏', 'success');
      }
    }
  }
  
  // 兑换商品
  exchangeProduct(product: FavoriteProduct) {
    this.showAlert('跳转到商品详情页面', 'info');
  }
  
  // 查看文章
  viewArticle(article: FavoriteKnowledge) {
    this.showAlert('跳转到文章详情页面', 'info');
  }
  
  // 批量删除商品
  batchDeleteProducts() {
    const selectedProducts = this.favoriteProducts.filter(p => p.selected);
    if (selectedProducts.length === 0) {
      this.showAlert('请选择要删除的商品', 'error');
      return;
    }
    
    if (confirm(`确定要删除选中的 ${selectedProducts.length} 个商品吗？`)) {
      this.favoriteProducts = this.favoriteProducts.filter(p => !p.selected);
      this.updateTabCounts();
      this.isEditMode = false;
      this.showAlert(`已删除 ${selectedProducts.length} 个商品`, 'success');
    }
  }
  
  // 批量删除知识
  batchDeleteKnowledge() {
    const selectedArticles = this.favoriteKnowledge.filter(a => a.selected);
    if (selectedArticles.length === 0) {
      this.showAlert('请选择要删除的文章', 'error');
      return;
    }
    
    if (confirm(`确定要删除选中的 ${selectedArticles.length} 篇文章吗？`)) {
      this.favoriteKnowledge = this.favoriteKnowledge.filter(a => !a.selected);
      this.updateTabCounts();
      this.isEditMode = false;
      this.showAlert(`已删除 ${selectedArticles.length} 篇文章`, 'success');
    }
  }
  
  // 跳转到积分商城
  goToMall() {
    this.router.navigate(['/consumer/points-mall']);
  }
  
  // 跳转到环保知识
  goToKnowledge() {
    this.showAlert('跳转到环保知识页面', 'info');
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