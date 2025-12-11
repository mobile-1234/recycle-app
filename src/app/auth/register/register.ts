import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FmodeParse } from 'fmode-ng';
import { AuthService } from '../services/auth.service';
interface RegisterForm {
  identity: string;
  account: string;
  password: string;
  confirmPassword: string;
  // C端用户字段
  name?: string;
  phone?: string;
  // B端企业字段
  companyName?: string;
  companyCode?: string;
  contactPerson?: string;
  contactPhone?: string;
  // G端政府字段
  departmentName?: string;
  position?: string;
  govPhone?: string;
  govEmail?: string;
}

interface FormErrors {
  identity: boolean;
  account: boolean;
  password: boolean;
  confirmPassword: boolean;
}

interface ErrorMessage {
  show: boolean;
  message: string;
  type: 'error' | 'success';
}

@Component({
  selector: 'app-register',
  standalone: true,
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
    confirmPassword: '',
    // C端
    name: '',
    phone: '',
    // B端
    companyName: '',
    companyCode: '',
    contactPerson: '',
    contactPhone: '',
    // G端
    departmentName: '',
    position: '',
    govPhone: '',
    govEmail: ''
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

  // 加载状态
  isLoading = false;

  // 错误消息
  errorMessage: ErrorMessage = {
    show: false,
    message: '',
    type: 'error'
  };

  // 身份选项
  identityOptions = [
    { value: 'user', label: 'C端用户', icon: '👤' },
    { value: 'business', label: 'B端企业', icon: '🏢' },
    { value: 'government', label: 'G端政府', icon: '🏛️' }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  // 选择身份
  selectIdentity(identity: string) {
    this.registerForm.identity = identity;
    this.formErrors.identity = false;
    // 清空其他类型的字段
    if (identity !== 'user') {
      this.registerForm.name = '';
      this.registerForm.phone = '';
    }
    if (identity !== 'business') {
      this.registerForm.companyName = '';
      this.registerForm.companyCode = '';
      this.registerForm.contactPerson = '';
      this.registerForm.contactPhone = '';
    }
    if (identity !== 'government') {
      this.registerForm.departmentName = '';
      this.registerForm.position = '';
      this.registerForm.govPhone = '';
      this.registerForm.govEmail = '';
    }
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
      // 调用注册方法
      this.registerUser();
    }
  }

  // 注册处理
  private async registerUser() {
    this.isLoading = true;
    this.errorMessage = { show: false, message: '', type: 'error' };

    // 准备额外字段
    const extraFields: any = {};

    // 根据不同身份类型准备字段
    if (this.registerForm.identity === 'user') {
      // C端用户字段
      if (this.registerForm.name) extraFields.name = this.registerForm.name;
      if (this.registerForm.phone) extraFields.phone = this.registerForm.phone;
    } else if (this.registerForm.identity === 'business') {
      // B端企业字段
      if (this.registerForm.companyName) extraFields.companyName = this.registerForm.companyName;
      if (this.registerForm.companyCode) extraFields.companyCode = this.registerForm.companyCode;
      if (this.registerForm.contactPerson) extraFields.contactPerson = this.registerForm.contactPerson;
      if (this.registerForm.contactPhone) extraFields.contactPhone = this.registerForm.contactPhone;
    } else if (this.registerForm.identity === 'government') {
      // G端政府字段
      if (this.registerForm.departmentName) extraFields.departmentName = this.registerForm.departmentName;
      if (this.registerForm.position) extraFields.position = this.registerForm.position;
      if (this.registerForm.govPhone) extraFields.govPhone = this.registerForm.govPhone;
      if (this.registerForm.govEmail) extraFields.govEmail = this.registerForm.govEmail;
    }

    // 添加调试日志
    console.log('注册数据:', {
      account: this.registerForm.account,
      identity: this.registerForm.identity,
      extraFields: extraFields
    });

    // 调用 AuthService 注册
    const result = await this.authService.register(
      this.registerForm.account,
      this.registerForm.password,
      this.registerForm.identity,
      extraFields
    );

    if (result.success) {
      // 显示成功消息
      this.errorMessage = {
        show: true,
        message: '注册成功！即将跳转到登录页面...',
        type: 'success'
      };

      // 延迟跳转
      setTimeout(() => {
        this.router.navigate(['/auth/login']);
      }, 1500);
    } else {
      this.errorMessage = {
        show: true,
        message: result.message,
        type: 'error'
      };
      this.isLoading = false;
    }
  }

  // 根据用户身份类型导航到对应首页
  private navigateToHomePage(identity: string) {
    switch (identity) {
      case 'user':
        // C端用户跳转到consumer首页
        this.router.navigate(['/consumer']);
        break;
      case 'business':
        // B端企业跳转到business dashboard
        this.router.navigate(['/business/dashboard']);
        break;
      case 'government':
        // G端政府跳转到government首页
        this.router.navigate(['/government']);
        break;
      default:
        // 默认跳转到登录页面
        this.router.navigate(['/auth/login']);
        break;
    }
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
