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

interface Region {
  id: string;
  name: string;
  manager: string;
  contact: string;
  status: 'active' | 'inactive';
  address: string;
  population: number;
  recyclePoints: number;
  complianceRate: number;
  monthlyVolume: number;
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
  showRegionModal = false;
  showAddRegionModal = false;
  selectedRegion: Region | null = null;
  regionForm: Partial<Region> = {};
  
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

  regions: Region[] = [
    { 
      id: 'R001', 
      name: '朝阳区', 
      manager: '张主任', 
      contact: '138****1234', 
      status: 'active' as const,
      address: '北京市朝阳区朝外大街',
      population: 350000,
      recyclePoints: 45,
      complianceRate: 95,
      monthlyVolume: 12500
    },
    { 
      id: 'R002', 
      name: '海淀区', 
      manager: '李主任', 
      contact: '139****5678', 
      status: 'active' as const,
      address: '北京市海淀区中关村大街',
      population: 320000,
      recyclePoints: 38,
      complianceRate: 88,
      monthlyVolume: 10200
    },
    { 
      id: 'R003', 
      name: '西城区', 
      manager: '王主任', 
      contact: '137****9012', 
      status: 'active' as const,
      address: '北京市西城区西单北大街',
      population: 280000,
      recyclePoints: 32,
      complianceRate: 93,
      monthlyVolume: 8900
    },
    { 
      id: 'R004', 
      name: '东城区', 
      manager: '赵主任', 
      contact: '136****3456', 
      status: 'active' as const,
      address: '北京市东城区东单北大街',
      population: 260000,
      recyclePoints: 28,
      complianceRate: 76,
      monthlyVolume: 7800
    },
    { 
      id: 'R005', 
      name: '丰台区', 
      manager: '刘主任', 
      contact: '135****7890', 
      status: 'inactive' as const,
      address: '北京市丰台区丰台路',
      population: 290000,
      recyclePoints: 25,
      complianceRate: 91,
      monthlyVolume: 6280
    }
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

  // 打开辖区详情
  manageRegion(region: Region): void {
    this.selectedRegion = region;
    this.showRegionModal = true;
  }
  
  // 关闭辖区详情
  closeRegionModal(): void {
    this.showRegionModal = false;
    this.selectedRegion = null;
  }
  
  // 打开添加辖区弹窗
  openAddRegionModal(): void {
    this.regionForm = {
      status: 'active',
      population: 0,
      recyclePoints: 0,
      complianceRate: 0,
      monthlyVolume: 0
    };
    this.showAddRegionModal = true;
  }
  
  // 关闭添加辖区弹窗
  closeAddRegionModal(): void {
    this.showAddRegionModal = false;
    this.regionForm = {};
  }
  
  // 添加辖区
  addRegion(): void {
    if (!this.regionForm.name || !this.regionForm.manager || !this.regionForm.contact) {
      alert('请填写必填项：辖区名称、负责人、联系方式');
      return;
    }
    
    const newRegion: Region = {
      id: 'R' + String(this.regions.length + 1).padStart(3, '0'),
      name: this.regionForm.name!,
      manager: this.regionForm.manager!,
      contact: this.regionForm.contact!,
      status: this.regionForm.status || 'active',
      address: this.regionForm.address || '',
      population: this.regionForm.population || 0,
      recyclePoints: this.regionForm.recyclePoints || 0,
      complianceRate: this.regionForm.complianceRate || 0,
      monthlyVolume: this.regionForm.monthlyVolume || 0
    };
    
    this.regions.push(newRegion);
    alert(`辖区 ${newRegion.name} 添加成功！`);
    this.closeAddRegionModal();
  }
  
  // 编辑辖区
  editRegion(region: Region): void {
    this.regionForm = { ...region };
    this.closeRegionModal();
    this.showAddRegionModal = true;
  }
  
  // 更新辖区
  updateRegion(): void {
    if (!this.regionForm.id) {
      this.addRegion();
      return;
    }
    
    const index = this.regions.findIndex(r => r.id === this.regionForm.id);
    if (index !== -1) {
      this.regions[index] = {
        ...this.regions[index],
        ...this.regionForm as Region
      };
      alert('辖区信息更新成功！');
      this.closeAddRegionModal();
    }
  }
  
  // 删除辖区
  deleteRegion(region: Region): void {
    if (confirm(`确定要删除辖区 ${region.name} 吗？此操作不可恢复！`)) {
      const index = this.regions.findIndex(r => r.id === region.id);
      if (index !== -1) {
        this.regions.splice(index, 1);
        alert(`辖区 ${region.name} 已删除`);
        this.closeRegionModal();
      }
    }
  }
  
  // 切换辖区状态
  toggleRegionStatus(region: Region): void {
    region.status = region.status === 'active' ? 'inactive' : 'active';
    const statusText = region.status === 'active' ? '启用' : '停用';
    alert(`辖区 ${region.name} 已${statusText}`);
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
