import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-password-settings',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './password-settings.html',
  styleUrl: './password-settings.scss'
})
export class PasswordSettings {
  // 密码显示控制
  showOldPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  
  // 密码表单
  passwordForm = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  
  constructor(private router: Router) {}
  
  // 获取密码强度
  getPasswordStrength(): number {
    const password = this.passwordForm.newPassword;
    if (!password) return 0;
    
    let strength = 0;
    
    // 长度
    if (password.length >= 6) strength += 20;
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 10;
    
    // 包含小写字母
    if (/[a-z]/.test(password)) strength += 15;
    
    // 包含大写字母
    if (/[A-Z]/.test(password)) strength += 15;
    
    // 包含数字
    if (/\d/.test(password)) strength += 10;
    
    // 包含特殊字符
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 10;
    
    return Math.min(strength, 100);
  }
  
  // 获取密码强度文本
  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    if (strength < 40) return '弱';
    if (strength < 70) return '中等';
    return '强';
  }
  
  // 提交密码修改
  submitPasswordChange(): void {
    const { oldPassword, newPassword, confirmPassword } = this.passwordForm;
    
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert('请填写所有字段');
      return;
    }
    
    if (newPassword.length < 6) {
      alert('新密码长度至少6位');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      alert('两次输入的新密码不一致');
      return;
    }
    
    if (oldPassword === newPassword) {
      alert('新密码不能与旧密码相同');
      return;
    }
    
    // 模拟密码修改
    alert('密码修改成功！');
    this.passwordForm = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  }
  
  // 返回政务中心
  goBack(): void {
    this.router.navigate(['/government/government-center']);
  }
}

