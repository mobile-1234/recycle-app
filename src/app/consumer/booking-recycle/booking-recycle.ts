import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BottomNavComponent } from '../../shared/bottom-nav/bottom-nav.component';

interface WasteCategory {
  id: string;
  name: string;
  icon: string;
  active: boolean;
}

interface RecycleMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
  active: boolean;
}

interface TimeOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  active: boolean;
}

interface DateItem {
  date: string;
  day: string;
  week: string;
  active: boolean;
}

interface TimeSlot {
  time: string;
  active: boolean;
}

interface AdditionalService {
  id: string;
  name: string;
  description: string;
  price: string;
  icon: string;
  enabled: boolean;
}

@Component({
  selector: 'app-booking-recycle',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, BottomNavComponent],
  templateUrl: './booking-recycle.html',
  styleUrl: './booking-recycle.scss'
})
export class BookingRecycle implements OnInit {
  
  // 废品分类
  wasteCategories: WasteCategory[] = [
    { id: 'paper', name: '纸类', icon: 'fas fa-newspaper', active: true },
    { id: 'plastic', name: '塑料', icon: 'fas fa-bottle-water', active: false },
    { id: 'glass', name: '玻璃', icon: 'fas fa-wine-glass', active: false },
    { id: 'electronic', name: '电子', icon: 'fas fa-microchip', active: false },
    { id: 'textile', name: '衣物', icon: 'fas fa-shirt', active: false },
    { id: 'other', name: '其他', icon: 'fas fa-box', active: false }
  ];

  // 回收方式
  recycleMethods: RecycleMethod[] = [
    { id: 'pickup', name: '上门回收', description: '回收员上门收取', icon: 'fas fa-home', active: true },
    { id: 'dropoff', name: '自助投递', description: '送至自助点', icon: 'fas fa-location-dot', active: false }
  ];

  // 时间选项
  timeOptions: TimeOption[] = [
    { id: 'immediate', name: '立即上门', description: '最快30分钟', icon: 'fas fa-bolt', active: true },
    { id: 'scheduled', name: '预约时间', description: '选择日期', icon: 'fas fa-calendar-days', active: false }
  ];

  // 日期选项
  dateItems: DateItem[] = [
    { date: '10月12日', day: '今天', week: '', active: true },
    { date: '10月13日', day: '明天', week: '', active: false },
    { date: '10月14日', day: '周六', week: '', active: false },
    { date: '10月15日', day: '周日', week: '', active: false }
  ];

  // 时间段
  timeSlots: TimeSlot[] = [
    { time: '09:00-11:00', active: true },
    { time: '11:00-13:00', active: false },
    { time: '13:00-15:00', active: false },
    { time: '15:00-17:00', active: false },
    { time: '17:00-19:00', active: false },
    { time: '19:00-21:00', active: false }
  ];

  // 附加服务
  additionalServices: AdditionalService[] = [
    { id: 'carry', name: '搬运服务', description: '协助搬运重物', price: '免费', icon: 'fas fa-dolly', enabled: false },
    { id: 'clean', name: '清洁服务', description: '清理回收区域', price: '+5元', icon: 'fas fa-broom', enabled: false },
    { id: 'sort', name: '分类服务', description: '专业分类指导', price: '免费', icon: 'fas fa-sort', enabled: false }
  ];

  // 表单数据
  weight: number = 2.5;
  address: string = '北京市朝阳区建国路88号SOHO现代城';
  contactName: string = '张三';
  contactPhone: string = '138****8888';
  notes: string = '';
  photos: string[] = [];
  estimatedEarnings: number = 12.50;

  // 当前选中的导航标签
  currentTab: string = 'booking';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.calculateEarnings();
  }

  // 选择废品分类
  selectCategory(category: WasteCategory): void {
    this.wasteCategories.forEach(c => c.active = false);
    category.active = true;
    this.calculateEarnings();
  }

  // 选择回收方式
  selectMethod(method: RecycleMethod): void {
    this.recycleMethods.forEach(m => m.active = false);
    method.active = true;
  }

  // 选择时间选项
  selectTimeOption(option: TimeOption): void {
    this.timeOptions.forEach(o => o.active = false);
    option.active = true;
  }

  // 选择日期
  selectDate(date: DateItem): void {
    this.dateItems.forEach(d => d.active = false);
    date.active = true;
  }

  // 选择时间段
  selectTimeSlot(slot: TimeSlot): void {
    this.timeSlots.forEach(s => s.active = false);
    slot.active = true;
  }

  // 切换附加服务
  toggleService(service: AdditionalService): void {
    service.enabled = !service.enabled;
    this.calculateEarnings();
  }

  // 计算预估收益
  calculateEarnings(): void {
    const activeCategory = this.wasteCategories.find(c => c.active);
    let basePrice = 0;
    
    switch(activeCategory?.id) {
      case 'paper': basePrice = 2.5; break;
      case 'plastic': basePrice = 3.0; break;
      case 'glass': basePrice = 1.5; break;
      case 'electronic': basePrice = 8.0; break;
      case 'textile': basePrice = 2.0; break;
      default: basePrice = 2.0;
    }

    this.estimatedEarnings = basePrice * this.weight;
    
    // 添加附加服务费用
    this.additionalServices.forEach(service => {
      if (service.enabled && service.price.includes('+')) {
        const fee = parseFloat(service.price.replace('+', '').replace('元', ''));
        this.estimatedEarnings += fee;
      }
    });
  }

  // 上传照片
  uploadPhoto(): void {
    // 模拟照片上传
    if (this.photos.length < 3) {
      this.photos.push('https://via.placeholder.com/80');
    }
  }

  // 删除照片
  removePhoto(index: number): void {
    this.photos.splice(index, 1);
  }

  // 更改地址
  changeAddress(): void {
    // 跳转到地址选择页面
    console.log('更改地址');
  }

  // 导航到投递点
  navigateToPoint(): void {
    console.log('导航到投递点');
  }

  // 返回上一页
  goBack(): void {
    this.router.navigate(['/consumer/home']);
  }

  // 提交预约
  submitBooking(): void {
    const bookingData = {
      category: this.wasteCategories.find(c => c.active),
      weight: this.weight,
      method: this.recycleMethods.find(m => m.active),
      timeOption: this.timeOptions.find(o => o.active),
      selectedDate: this.dateItems.find(d => d.active),
      selectedTime: this.timeSlots.find(s => s.active),
      address: this.address,
      contact: { name: this.contactName, phone: this.contactPhone },
      services: this.additionalServices.filter(s => s.enabled),
      notes: this.notes,
      photos: this.photos,
      estimatedEarnings: this.estimatedEarnings
    };

    console.log('预约数据:', bookingData);
    
    // 这里可以调用API提交数据
    // 提交成功后跳转到确认页面
    alert('预约提交成功！');
    this.router.navigate(['/consumer/home']);
  }

  // 获取当前选中的回收方式
  get isPickupMethod(): boolean {
    return this.recycleMethods.find(m => m.active)?.id === 'pickup';
  }

  // 获取当前选中的时间选项
  get isScheduledTime(): boolean {
    return this.timeOptions.find(o => o.active)?.id === 'scheduled';
  }

  // 底部导航栏切换
  switchTab(tab: string): void {
    this.currentTab = tab;
    switch (tab) {
      case 'home':
        this.router.navigate(['/consumer/home']);
        break;
      case 'booking':
        // 当前页面，不需要跳转
        break;
      case 'earnings':
        this.router.navigate(['/consumer/earnings']);
        break;
      case 'mall':
        this.router.navigate(['/consumer/points-mall']);
        break;
      case 'profile':
        this.router.navigate(['/consumer/profile']);
        break;
    }
  }
}
