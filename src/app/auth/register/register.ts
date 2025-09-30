import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

interface RegisterForm {
  identity: string;
  account: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  identity: boolean;
  account: boolean;
  password: boolean;
  confirmPassword: boolean;
}

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  // 表单数据
  registerForm: RegisterForm = {
    identity: 'user',
    account: '',
    password: '',
    confirmPassword: ''
  };

  // 错误状态
  formErrors: FormErrors = {
    identity: false,
    account: false,
    password: false,
    confirmPassword: false
  };

  // 密码显示状态
  showPassword = false;
  showConfirmPassword = false;

  // 身份选项
  identityOptions = [
    { value: 'user', label: 'C端用户', icon: '👤' },
    { value: 'business', label: 'B端企业', icon: '🏢' },
    { value: 'government', label: 'G端政府', icon: '🏛️' }
  ];

  constructor(private router: Router) {}

  // 选择身份
  selectIdentity(identity: string) {
    this.registerForm.identity = identity;
    this.formErrors.identity = false;
  }

  // 切换密码显示
  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  // 实时验证密码
  validatePassword() {
    const passwordRegex = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,20}$/;
    this.formErrors.password = !passwordRegex.test(this.registerForm.password);
  }

  // 实时验证确认密码
  validateConfirmPassword() {
    this.formErrors.confirmPassword = this.registerForm.password !== this.registerForm.confirmPassword;
  }

  // 验证账户信息
  validateAccount() {
    this.formErrors.account = !this.registerForm.account.trim();
  }

  // 表单提交
  onSubmit() {
    // 重置错误状态
    this.formErrors = {
      identity: false,
      account: false,
      password: false,
      confirmPassword: false
    };

    let isValid = true;

    // 验证身份选择
    if (!this.registerForm.identity) {
      this.formErrors.identity = true;
      isValid = false;
    }

    // 验证账户信息
    if (!this.registerForm.account.trim()) {
      this.formErrors.account = true;
      isValid = false;
    }

    // 验证密码
    const passwordRegex = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,20}$/;
    if (!passwordRegex.test(this.registerForm.password)) {
      this.formErrors.password = true;
      isValid = false;
    }

    // 验证确认密码
    if (this.registerForm.password !== this.registerForm.confirmPassword) {
      this.formErrors.confirmPassword = true;
      isValid = false;
    }

    if (isValid) {
      // Mock 注册成功
      this.mockRegister();
    }
  }

  // Mock 注册处理
  private mockRegister() {
    // 模拟API调用延迟
    setTimeout(() => {
      // Mock 注册成功响应
      const mockResponse = {
        success: true,
        message: '注册成功！',
        user: {
          id: Math.random().toString(36).substr(2, 9),
          identity: this.registerForm.identity,
          account: this.registerForm.account,
          createdAt: new Date().toISOString()
        }
      };

      console.log('Mock 注册响应:', mockResponse);
      
      // 显示成功消息
      alert('注册成功！即将跳转到登录页面。');
      
      // 跳转到登录页面
      this.router.navigate(['/auth/login']);
    }, 1000);
  }

  // 返回上一页
  goBack() {
    this.router.navigate(['/auth/login']);
  }

  // 跳转到登录页面
  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
