import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Address {
  id: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  tag: string; // 家、公司、学校
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
}

@Component({
  selector: 'app-address-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './address-management.html',
  styleUrls: ['./address-management.scss']
})
export class AddressManagement implements OnInit {
  addresses: Address[] = [];
  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showMapModal: boolean = false;
  currentAddress: Address | null = null;
  
  // 新地址表单
  newAddress: Address = {
    id: '',
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    detail: '',
    tag: '家',
    isDefault: false
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadAddresses();
  }

  loadAddresses(): void {
    // 从localStorage加载地址
    const savedAddresses = localStorage.getItem('userAddresses');
    if (savedAddresses) {
      this.addresses = JSON.parse(savedAddresses);
    } else {
      // 初始化默认地址
      this.addresses = [
        {
          id: '1',
          name: '张三',
          phone: '138****8888',
          province: '北京市',
          city: '北京市',
          district: '朝阳区',
          detail: '建国路88号SOHO现代城A座2088室',
          tag: '家',
          isDefault: true,
          latitude: 39.9042,
          longitude: 116.4074
        }
      ];
      this.saveAddresses();
    }
  }

  saveAddresses(): void {
    localStorage.setItem('userAddresses', JSON.stringify(this.addresses));
  }

  goBack(): void {
    this.router.navigate(['/consumer/booking-recycle']);
  }

  openAddModal(): void {
    this.newAddress = {
      id: Date.now().toString(),
      name: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      detail: '',
      tag: '家',
      isDefault: false
    };
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  openEditModal(address: Address): void {
    this.currentAddress = { ...address };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.currentAddress = null;
  }

  openMapModal(): void {
    this.showMapModal = true;
  }

  closeMapModal(): void {
    this.showMapModal = false;
  }

  async pasteFromClipboard(): Promise<void> {
    try {
      const text = await navigator.clipboard.readText();
      // 尝试解析地址文本
      this.parseAddressText(text);
      this.showSuccessToast('已粘贴剪贴板内容');
    } catch (err) {
      console.error('读取剪贴板失败:', err);
      this.showSuccessToast('读取剪贴板失败，请手动输入');
    }
  }

  parseAddressText(text: string): void {
    // 简单的地址解析逻辑（实际项目中可以使用更复杂的解析）
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    if (lines.length > 0) {
      // 尝试识别姓名和电话
      const firstLine = lines[0];
      const phoneMatch = firstLine.match(/1[3-9]\d{9}/);
      if (phoneMatch) {
        this.newAddress.phone = phoneMatch[0];
        this.newAddress.name = firstLine.replace(phoneMatch[0], '').trim();
      } else {
        this.newAddress.name = firstLine;
      }

      // 尝试识别地址
      if (lines.length > 1) {
        const addressLine = lines.slice(1).join(' ');
        // 提取省市区
        const provinceMatch = addressLine.match(/([\u4e00-\u9fa5]{2,}省)/);
        const cityMatch = addressLine.match(/([\u4e00-\u9fa5]{2,}市)/);
        const districtMatch = addressLine.match(/([\u4e00-\u9fa5]{2,}区|[\u4e00-\u9fa5]{2,}县)/);
        
        if (provinceMatch) this.newAddress.province = provinceMatch[0];
        if (cityMatch) this.newAddress.city = cityMatch[0];
        if (districtMatch) this.newAddress.district = districtMatch[0];
        
        // 剩余部分作为详细地址
        let detail = addressLine;
        if (provinceMatch) detail = detail.replace(provinceMatch[0], '');
        if (cityMatch) detail = detail.replace(cityMatch[0], '');
        if (districtMatch) detail = detail.replace(districtMatch[0], '');
        this.newAddress.detail = detail.trim();
      }
    }
  }

  selectLocation(): void {
    // 这里可以集成高德地图或其他地图服务
    // 现在先显示一个模拟的地图选择界面
    this.openMapModal();
  }

  confirmLocation(lat: number, lng: number, address: string): void {
    // 从地图选择的位置更新地址信息
    this.newAddress.latitude = lat;
    this.newAddress.longitude = lng;
    // 可以通过逆地理编码获取详细地址
    this.parseAddressFromLocation(address);
    this.closeMapModal();
  }

  parseAddressFromLocation(address: string): void {
    // 解析地图返回的地址
    this.newAddress.detail = address;
  }

  saveNewAddress(): void {
    // 验证表单
    if (!this.newAddress.name || !this.newAddress.phone || !this.newAddress.detail) {
      this.showSuccessToast('请填写完整信息');
      return;
    }

    // 如果设置为默认地址，取消其他地址的默认状态
    if (this.newAddress.isDefault) {
      this.addresses.forEach(addr => addr.isDefault = false);
    }

    this.addresses.push({ ...this.newAddress });
    this.saveAddresses();
    this.closeAddModal();
    this.showSuccessToast('地址已保存');
  }

  saveEditAddress(): void {
    if (!this.currentAddress) return;

    // 验证表单
    if (!this.currentAddress.name || !this.currentAddress.phone || !this.currentAddress.detail) {
      this.showSuccessToast('请填写完整信息');
      return;
    }

    // 如果设置为默认地址，取消其他地址的默认状态
    if (this.currentAddress.isDefault) {
      this.addresses.forEach(addr => {
        if (addr.id !== this.currentAddress!.id) {
          addr.isDefault = false;
        }
      });
    }

    const index = this.addresses.findIndex(addr => addr.id === this.currentAddress!.id);
    if (index !== -1) {
      this.addresses[index] = { ...this.currentAddress };
      this.saveAddresses();
      this.closeEditModal();
      this.showSuccessToast('地址已更新');
    }
  }

  deleteAddress(id: string): void {
    if (confirm('确定要删除这个地址吗？')) {
      this.addresses = this.addresses.filter(addr => addr.id !== id);
      this.saveAddresses();
      this.showSuccessToast('地址已删除');
    }
  }

  setDefaultAddress(id: string): void {
    this.addresses.forEach(addr => {
      addr.isDefault = addr.id === id;
    });
    this.saveAddresses();
    this.showSuccessToast('已设置为默认地址');
  }

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
}

