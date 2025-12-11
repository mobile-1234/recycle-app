import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FmodeParse } from 'fmode-ng';
import { AuthService } from '../services/auth.service';
// 定义登录表单接口
interface LoginForm {
  account: string;
  password: string;
  remember: boolean;
  verificationCode?: string;
}

// 定义用户接口
interface User {
  id: string;
  account: string;
  name: string;
  identity?: string;
  [key: string]: any; // 允许其他动态属性
}

// 错误消息接口
interface ErrorMessage {
  show: boolean;
  message: string;
  type: 'error' | 'success';
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  // 表单数据
  loginForm: LoginForm = {
    account: '',
    password: '',
    remember: false
  };

  // 表单错误
  errors = {
    account: '',
    password: ''
  };

  // 错误/成功消息
  errorMessage: ErrorMessage = {
    show: false,
    message: '',
    type: 'error'
  };

  // 密码可见性
  passwordVisible = false;

  // 登录状态
  isLoading = false;

  // 登录方式：'password' | 'phone'
  loginMode: 'password' | 'phone' = 'password';

  // 是否启用手机验证码登录（临时禁用，等待后端实现 Cloud Functions）
  enablePhoneLogin: boolean = false;

  // 验证码倒计时
  countdown: number = 0;
  countdownTimer: any = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  // 切换密码可见性
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  // 验证账户信息
  validateAccount(): boolean {
    this.errors.account = '';
    
    if (!this.loginForm.account.trim()) {
      this.errors.account = '请输入有效的账户信息';
      return false;
    }
    
    return true;
  }

  // 验证密码
  validatePassword(): boolean {
    this.errors.password = '';
    
    if (!this.loginForm.password.trim()) {
      this.errors.password = '密码不能为空';
      return false;
    }
    
    return true;
  }

  // 切换登录方式
  switchLoginMode(mode: 'password' | 'phone'): void {
    this.loginMode = mode;
    this.loginForm.account = '';
    this.loginForm.password = '';
    this.loginForm.verificationCode = '';
    this.errors = { account: '', password: '' };
    this.errorMessage = { show: false, message: '', type: 'error' };
  }

  // 发送验证码
  async sendVerificationCode(): Promise<void> {
    if (!this.loginForm.account.trim()) {
      this.errors.account = '请输入手机号';
      return;
    }

    if (!this.authService.validatePhone(this.loginForm.account)) {
      this.errors.account = '请输入有效的手机号';
      return;
    }

    try {
      const result = await this.authService.sendVerificationCode(
        this.loginForm.account,
        'login'
      );

      if (result.success) {
        this.errorMessage = {
          show: true,
          message: '验证码已发送',
          type: 'success'
        };
        this.startCountdown();
      } else {
        this.errorMessage = {
          show: true,
          message: result.message,
          type: 'error'
        };
      }
    } catch (error: any) {
      this.errorMessage = {
        show: true,
        message: '发送验证码失败',
        type: 'error'
      };
    }
  }

  // 开始倒计时
  private startCountdown(): void {
    this.countdown = 60;
    this.countdownTimer = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.countdownTimer);
      }
    }, 1000);
  }

  // 表单提交
  async onSubmit(): Promise<void> {
    // 重置错误信息
    this.errors = { account: '', password: '' };
    this.errorMessage = { show: false, message: '', type: 'error' };

    if (this.loginMode === 'password') {
      // 密码登录
      await this.loginWithPassword();
    } else {
      // 验证码登录
      await this.loginWithPhoneCode();
    }
  }

  // 密码登录
  private async loginWithPassword(): Promise<void> {
    // 验证表单
    const isAccountValid = this.validateAccount();
    const isPasswordValid = this.validatePassword();

    if (!isAccountValid || !isPasswordValid) {
      return;
    }

    // 开始登录
    this.isLoading = true;

    const result = await this.authService.loginWithPassword(
      this.loginForm.account,
      this.loginForm.password
    );

    if (result.success && result.user) {
      // 处理记住登录
      if (this.loginForm.remember) {
        localStorage.setItem('rememberLogin', 'true');
        localStorage.setItem('rememberedAccount', this.loginForm.account);
      } else {
        localStorage.removeItem('rememberLogin');
        localStorage.removeItem('rememberedAccount');
      }

      // 显示成功消息
      this.errorMessage = {
        show: true,
        message: '登录成功！即将跳转...',
        type: 'success'
      };

      // 延迟跳转
      setTimeout(() => {
        this.authService.navigateToHome(result.user!.identity);
      }, 1000);
    } else {
      this.errorMessage = {
        show: true,
        message: result.message,
        type: 'error'
      };
      this.isLoading = false;
    }
  }

  // 验证码登录
  private async loginWithPhoneCode(): Promise<void> {
    // 验证手机号
    if (!this.loginForm.account.trim()) {
      this.errors.account = '请输入手机号';
      return;
    }

    if (!this.authService.validatePhone(this.loginForm.account)) {
      this.errors.account = '请输入有效的手机号';
      return;
    }

    // 验证验证码
    if (!this.loginForm.verificationCode || this.loginForm.verificationCode.length !== 6) {
      this.errors.password = '请输入6位验证码';
      return;
    }

    this.isLoading = true;

    const result = await this.authService.loginWithPhoneCode(
      this.loginForm.account,
      this.loginForm.verificationCode
    );

    if (result.success && result.user) {
      // 显示成功消息
      this.errorMessage = {
        show: true,
        message: '登录成功！即将跳转...',
        type: 'success'
      };

      // 延迟跳转
      setTimeout(() => {
        this.authService.navigateToHome(result.user!.identity);
      }, 1000);
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
        // 默认跳转到consumer首页
        this.router.navigate(['/consumer']);
        break;
    }
  }

  // 社交登录
  socialLogin(platform: string): void {
    alert(`即将通过${platform}登录`);
  }

  // 忘记密码
  forgotPassword(): void {
    alert('忘记密码功能开发中...');
  }

  // 跳转到注册页面
  goToRegister() {
    this.router.navigate(['/auth/register']);
  }

  // 跳转到忘记密码页面
  goToForgotPassword() {
    this.router.navigate(['/auth/forgot-password']);
  }

  // 组件销毁时清除定时器
  ngOnDestroy(): void {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
  }

  // 返回上一页
  goBack(): void {
    window.history.back();
  }
}
