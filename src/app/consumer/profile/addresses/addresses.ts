import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface Address {
  id: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  fullAddress: string;
  label?: 'home' | 'company' | 'school' | 'other';
  isDefault: boolean;
}

interface LabelOption {
  value: 'home' | 'company' | 'school' | 'other';
  text: string;
  icon: string;
}

@Component({
  selector: 'app-addresses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './addresses.html',
  styleUrls: ['./addresses.scss']
})
export class AddressesComponent implements OnInit {
  
  // 地址列表
  addresses: Address[] = [
    {
      id: '1',
      name: '张三',
      phone: '138****8888',
      province: '北京市',
      city: '北京市',
      district: '朝阳区',
      detail: '建国路88号SOHO现代城A座1201室',
      fullAddress: '北京市朝阳区建国路88号SOHO现代城A座1201室',
      label: 'home',
      isDefault: true
    },
    {
      id: '2',
      name: '张三',
      phone: '138****8888',
      province: '北京市',
      city: '北京市',
      district: '海淀区',
      detail: '中关村大街1号海龙大厦15层',
      fullAddress: '北京市海淀区中关村大街1号海龙大厦15层',
      label: 'company',
      isDefault: false
    }
  ];
  
  // 标签选项
  labelOptions: LabelOption[] = [
    { value: 'home', text: '家', icon: 'fas fa-home' },
    { value: 'company', text: '公司', icon: 'fas fa-building' },
    { value: 'school', text: '学校', icon: 'fas fa-graduation-cap' },
    { value: 'other', text: '其他', icon: 'fas fa-map-marker-alt' }
  ];
  
  // 模态框状态
  showModal = false;
  isEditing = false;
  currentAddress: Address = this.getEmptyAddress();
  
  constructor(private router: Router) {}
  
  ngOnInit() {
    // 初始化
  }
  
  // 获取空地址对象
  getEmptyAddress(): Address {
    return {
      id: '',
      name: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      detail: '',
      fullAddress: '',
      label: undefined,
      isDefault: false
    };
  }
  
  // 获取标签文本
  getLabelText(label: string): string {
    const labelMap: { [key: string]: string } = {
      'home': '家',
      'company': '公司',
      'school': '学校',
      'other': '其他'
    };
    return labelMap[label] || '';
  }
  
  // 显示添加模态框
  showAddModal() {
    this.isEditing = false;
    this.currentAddress = this.getEmptyAddress();
    this.showModal = true;
  }
  
  // 编辑地址
  editAddress(address: Address) {
    this.isEditing = true;
    this.currentAddress = { ...address };
    this.showModal = true;
  }
  
  // 删除地址
  deleteAddress(address: Address) {
    if (confirm('确定要删除这个地址吗？')) {
      const index = this.addresses.findIndex(a => a.id === address.id);
      if (index > -1) {
        this.addresses.splice(index, 1);
        
        // 如果删除的是默认地址，设置第一个为默认
        if (address.isDefault && this.addresses.length > 0) {
          this.addresses[0].isDefault = true;
        }
        
        this.showAlert('地址删除成功', 'success');
      }
    }
  }
  
  // 设为默认地址
  setDefault(address: Address) {
    // 取消所有默认状态
    this.addresses.forEach(a => a.isDefault = false);
    // 设置当前为默认
    address.isDefault = true;
    this.showAlert('默认地址设置成功', 'success');
  }
  
  // 选择标签
  selectLabel(label: 'home' | 'company' | 'school' | 'other') {
    this.currentAddress.label = label;
  }
  
  // 保存地址
  saveAddress() {
    // 验证表单
    if (!this.validateForm()) {
      return;
    }
    
    // 生成完整地址
    this.currentAddress.fullAddress = 
      `${this.currentAddress.province}${this.currentAddress.city}${this.currentAddress.district}${this.currentAddress.detail}`;
    
    if (this.isEditing) {
      // 更新地址
      const index = this.addresses.findIndex(a => a.id === this.currentAddress.id);
      if (index > -1) {
        // 如果设为默认，取消其他默认状态
        if (this.currentAddress.isDefault) {
          this.addresses.forEach(a => a.isDefault = false);
        }
        this.addresses[index] = { ...this.currentAddress };
        this.showAlert('地址更新成功', 'success');
      }
    } else {
      // 添加新地址
      this.currentAddress.id = Date.now().toString();
      
      // 如果设为默认，取消其他默认状态
      if (this.currentAddress.isDefault) {
        this.addresses.forEach(a => a.isDefault = false);
      }
      
      // 如果是第一个地址，自动设为默认
      if (this.addresses.length === 0) {
        this.currentAddress.isDefault = true;
      }
      
      this.addresses.push({ ...this.currentAddress });
      this.showAlert('地址添加成功', 'success');
    }
    
    this.showModal = false;
  }
  
  // 验证表单
  validateForm(): boolean {
    if (!this.currentAddress.name.trim()) {
      this.showAlert('请输入联系人姓名', 'error');
      return false;
    }
    
    if (!this.currentAddress.phone.trim()) {
      this.showAlert('请输入手机号', 'error');
      return false;
    }
    
    if (!/^1[3-9]\d{9}$/.test(this.currentAddress.phone.replace(/\*/g, '8'))) {
      this.showAlert('请输入正确的手机号', 'error');
      return false;
    }
    
    if (!this.currentAddress.province) {
      this.showAlert('请选择省份', 'error');
      return false;
    }
    
    if (!this.currentAddress.city) {
      this.showAlert('请选择城市', 'error');
      return false;
    }
    
    if (!this.currentAddress.district) {
      this.showAlert('请选择区县', 'error');
      return false;
    }
    
    if (!this.currentAddress.detail.trim()) {
      this.showAlert('请输入详细地址', 'error');
      return false;
    }
    
    return true;
  }
  
  // 关闭模态框
  closeModal(event: Event) {
    if (event.target === event.currentTarget) {
      this.showModal = false;
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