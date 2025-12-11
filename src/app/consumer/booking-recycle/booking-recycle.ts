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
  
  // 废品分类 - 采用简约清新的图标设计（Font Awesome 6.0兼容）
  wasteCategories: WasteCategory[] = [
    { id: 'paper', name: '纸类', icon: 'fas fa-newspaper', active: true },
    { id: 'plastic', name: '塑料', icon: 'fas fa-recycle', active: false },
    { id: 'glass', name: '玻璃', icon: 'fas fa-wine-bottle', active: false },
    { id: 'electronic', name: '电子', icon: 'fas fa-mobile-alt', active: false },
    { id: 'textile', name: '衣物', icon: 'fas fa-tshirt', active: false },
    { id: 'metal', name: '金属', icon: 'fas fa-wrench', active: false },
    { id: 'furniture', name: '家具', icon: 'fas fa-chair', active: false },
    { id: 'other', name: '其他', icon: 'fas fa-cube', active: false }
  ];

  // 回收方式 - 直观表意的图标设计（Font Awesome 6.0兼容）
  recycleMethods: RecycleMethod[] = [
    { id: 'pickup', name: '上门回收', description: '回收员上门收取', icon: 'fas fa-truck', active: true },
    { id: 'dropoff', name: '自助投递', description: '送至自助点', icon: 'fas fa-box', active: false }
  ];

  // 时间选项
  timeOptions: TimeOption[] = [
    { id: 'immediate', name: '立即上门', description: '最快30分钟', icon: 'fas fa-rocket', active: true },
    { id: 'scheduled', name: '预约时间', description: '选择日期', icon: 'fas fa-calendar-check', active: false }
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
    { id: 'carry', name: '搬运服务', description: '协助搬运重物（楼层搬运、电梯搬运）', price: '免费', icon: 'fas fa-people-carry', enabled: false },
    { id: 'clean', name: '清洁服务', description: '清理回收区域，保持环境整洁', price: '+5元', icon: 'fas fa-spray-can', enabled: false },
    { id: 'sort', name: '分类服务', description: '专业分类指导，提高回收效率', price: '免费', icon: 'fas fa-sort-alpha-down', enabled: false },
    { id: 'dismantle', name: '拆解服务', description: '大件家具、电器拆解服务', price: '+10元', icon: 'fas fa-hammer', enabled: false },
    { id: 'package', name: '打包服务', description: '提供环保袋、纸箱等打包材料', price: '+3元', icon: 'fas fa-gift', enabled: false },
    { id: 'express', name: '加急服务', description: '15分钟内上门，优先处理', price: '+8元', icon: 'fas fa-tachometer-alt', enabled: false },
    { id: 'insurance', name: '保价服务', description: '贵重物品保价，安全保障', price: '+5元', icon: 'fas fa-shield-alt', enabled: false },
    { id: 'certificate', name: '回收凭证', description: '开具正规回收凭证，可抵税', price: '免费', icon: 'fas fa-award', enabled: false }
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
    this.loadSavedAddress();
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

  // 照片上传相关
  showPhotoOptions: boolean = false;
  showCamera: boolean = false;
  videoStream: MediaStream | null = null;

  // 打开照片选项
  openPhotoOptions(): void {
    this.showPhotoOptions = true;
  }

  closePhotoOptions(): void {
    this.showPhotoOptions = false;
  }

  // 从相册选择
  selectFromGallery(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = (e: any) => {
      const files = e.target.files;
      if (files) {
        Array.from(files).forEach((file: any) => {
          if (this.photos.length < 9) {
            const reader = new FileReader();
            reader.onload = (event: any) => {
              this.photos.push(event.target.result);
            };
            reader.readAsDataURL(file);
          }
        });
      }
    };
    input.click();
    this.closePhotoOptions();
  }

  // 打开摄像头拍照
  async openCamera(): Promise<void> {
    this.closePhotoOptions();
    this.showCamera = true;
    try {
      this.videoStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false 
      });
      
      // 等待 DOM 更新
      setTimeout(() => {
        const video = document.getElementById('camera-video') as HTMLVideoElement;
        if (video && this.videoStream) {
          video.srcObject = this.videoStream;
          video.play();
        }
      }, 100);
    } catch (err) {
      console.error('无法访问摄像头:', err);
      alert('无法访问摄像头，请检查权限设置或从相册选择照片');
      this.closeCamera();
    }
  }

  // 拍照
  takePhoto(): void {
    const video = document.getElementById('camera-video') as HTMLVideoElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const photoData = canvas.toDataURL('image/jpeg');
      this.photos.push(photoData);
      this.closeCamera();
      this.showSuccessToast('照片已添加');
    }
  }

  // 关闭摄像头
  closeCamera(): void {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
      this.videoStream = null;
    }
    this.showCamera = false;
  }

  // 删除照片
  removePhoto(index: number): void {
    this.photos.splice(index, 1);
  }

  // 显示成功提示
  private showSuccessToast(message: string): void {
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
      z-index: 99999;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 2000);
  }

  // 更改地址 - 跳转到地址管理页面
  changeAddress(): void {
    this.router.navigate(['/consumer/address-management']);
  }

  // 加载保存的地址信息
  loadSavedAddress(): void {
    const savedAddresses = localStorage.getItem('userAddresses');
    if (savedAddresses) {
      const addresses = JSON.parse(savedAddresses);
      const defaultAddress = addresses.find((addr: any) => addr.isDefault);
      if (defaultAddress) {
        this.address = `${defaultAddress.province}${defaultAddress.city}${defaultAddress.district}${defaultAddress.detail}`;
        this.contactName = defaultAddress.name;
        this.contactPhone = defaultAddress.phone;
      }
    }
  }

  // 导航到投递点
  navigateToPoint(): void {
    console.log('导航到投递点');
  }

  // 返回上一页
  goBack(): void {
    this.router.navigate(['/consumer/home']);
  }

  // 显示帮助信息
  showHelp(): void {
    alert('预约回收帮助：\n\n1. 选择废品分类和重量\n2. 上传废品照片（可选）\n3. 选择回收方式和时间\n4. 添加备注信息\n5. 确认提交预约\n\n如有问题请联系客服：400-123-4567');
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
