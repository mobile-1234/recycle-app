import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

interface ResetForm {
  account: string;
  resetType: 'email' | 'phone';
  verificationCode?: string;
  newPassword?: string;
  confirmPassword?: string;
}

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ForgotPasswordComponent {
  // 重置步骤：1-输入账号，2-输入验证码和新密码
  currentStep: number = 1;
  
  resetForm: ResetForm = {
    account: '',
    resetType: 'phone'
  };

  // 验证码倒计时
  countdown: number = 0;
  countdownTimer: any = null;

  // 加载状态
  isLoading = false;
  isSendingCode = false;

  // 消息提示
  errorMessage = {
    show: false,
    message: '',
    type: 'error' as 'error' | 'success'
  };

  // 表单错误
  errors = {
    account: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: ''
  };

  // 密码显示状态
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * 切换重置类型
   */
  switchResetType(type: 'email' | 'phone'): void {
    this.resetForm.resetType = type;
    this.resetForm.account = '';
    this.errors.account = '';
  }

  /**
   * 验证账号
   */
  validateAccount(): boolean {
    this.errors.account = '';
    
    if (!this.resetForm.account.trim()) {
      this.errors.account = this.resetForm.resetType === 'phone' ? '请输入手机号' : '请输入邮箱地址';
      return false;
    }

    if (this.resetForm.resetType === 'phone') {
      if (!this.authService.validatePhone(this.resetForm.account)) {
        this.errors.account = '请输入有效的手机号';
        return false;
      }
    } else {
      if (!this.authService.validateEmail(this.resetForm.account)) {
        this.errors.account = '请输入有效的邮箱地址';
        return false;
      }
    }

    return true;
  }

  /**
   * 发送验证码或重置邮件
   */
  async sendResetRequest(): Promise<void> {
    if (!this.validateAccount()) {
      return;
    }

    this.isSendingCode = true;
    this.errorMessage = { show: false, message: '', type: 'error' };

    try {
      if (this.resetForm.resetType === 'phone') {
        // 发送手机验证码
        const result = await this.authService.sendVerificationCode(
          this.resetForm.account,
          'resetPassword'
        );

        if (result.success) {
          this.errorMessage = {
            show: true,
            message: '验证码已发送到您的手机',
            type: 'success'
          };
          this.startCountdown();
          this.currentStep = 2;
        } else {
          this.errorMessage = {
            show: true,
            message: result.message,
            type: 'error'
          };
        }
      } else {
        // 发送邮件
        const result = await this.authService.requestPasswordReset(
          this.resetForm.account,
          'email'
        );

        if (result.success) {
          this.errorMessage = {
            show: true,
            message: '重置密码邮件已发送，请查收邮箱',
            type: 'success'
          };
          
          // 邮箱重置直接返回登录页
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 3000);
        } else {
          this.errorMessage = {
            show: true,
            message: result.message,
            type: 'error'
          };
        }
      }
    } catch (error: any) {
      this.errorMessage = {
        show: true,
        message: error.message || '请求失败，请稍后重试',
        type: 'error'
      };
    } finally {
      this.isSendingCode = false;
    }
  }

  /**
   * 重新发送验证码
   */
  async resendCode(): Promise<void> {
    if (this.countdown > 0) {
      return;
    }
    await this.sendResetRequest();
  }

  /**
   * 开始倒计时
   */
  private startCountdown(): void {
    this.countdown = 60;
    this.countdownTimer = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.countdownTimer);
      }
    }, 1000);
  }

  /**
   * 验证新密码
   */
  validateNewPassword(): boolean {
    this.errors.newPassword = '';
    
    if (!this.resetForm.newPassword) {
      this.errors.newPassword = '请输入新密码';
      return false;
    }

    if (this.resetForm.newPassword.length < 6) {
      this.errors.newPassword = '密码长度至少6位';
      return false;
    }

    return true;
  }

  /**
   * 验证确认密码
   */
  validateConfirmPassword(): boolean {
    this.errors.confirmPassword = '';
    
    if (!this.resetForm.confirmPassword) {
      this.errors.confirmPassword = '请确认新密码';
      return false;
    }

    if (this.resetForm.newPassword !== this.resetForm.confirmPassword) {
      this.errors.confirmPassword = '两次密码输入不一致';
      return false;
    }

    return true;
  }

  /**
   * 提交重置密码
   */
  async submitReset(): Promise<void> {
    // 验证验证码
    if (!this.resetForm.verificationCode || this.resetForm.verificationCode.length !== 6) {
      this.errors.verificationCode = '请输入6位验证码';
      return;
    }

    // 验证新密码
    if (!this.validateNewPassword() || !this.validateConfirmPassword()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = { show: false, message: '', type: 'error' };

    try {
      const result = await this.authService.resetPasswordWithCode(
        this.resetForm.account,
        this.resetForm.verificationCode!,
        this.resetForm.newPassword!
      );

      if (result.success) {
        this.errorMessage = {
          show: true,
          message: '密码重置成功，即将跳转到登录页面',
          type: 'success'
        };

        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      } else {
        this.errorMessage = {
          show: true,
          message: result.message,
          type: 'error'
        };
        this.isLoading = false;
      }
    } catch (error: any) {
      this.errorMessage = {
        show: true,
        message: error.message || '密码重置失败，请重试',
        type: 'error'
      };
      this.isLoading = false;
    }
  }

  /**
   * 返回登录页
   */
  goBack(): void {
    this.router.navigate(['/auth/login']);
  }

  /**
   * 组件销毁时清除定时器
   */
  ngOnDestroy(): void {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
  }
}
