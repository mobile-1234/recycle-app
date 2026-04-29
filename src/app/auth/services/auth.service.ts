import { Injectable } from '@angular/core';
import { FmodeParse } from 'fmode-ng';
import { Router } from '@angular/router';

/**
 * 用户信息接口
 */
export interface UserInfo {
  id: string;
  account: string;
  name: string;
  identity: 'user' | 'business' | 'government';
  phone?: string;
  email?: string;
  // C端用户字段
  avatar?: string;
  address?: string;
  // B端企业字段
  companyName?: string;
  companyCode?: string;
  contactPerson?: string;
  contactPhone?: string;
  businessLicense?: string;
  // G端政府字段
  departmentName?: string;
  position?: string;
  govPhone?: string;
  govEmail?: string;
  departmentCode?: string;
  [key: string]: any;
}

/**
 * 认证响应接口
 */
export interface AuthResponse {
  success: boolean;
  message: string;
  user?: UserInfo;
  error?: any;
}

/**
 * 认证服务
 * 提供统一的用户认证、注册、密码重置等功能
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(private router: Router) {}

  /**
   * 用户名密码登录
   */
  async loginWithPassword(username: string, password: string): Promise<AuthResponse> {
    try {
      const fmodeUser = await FmodeParse.User.logIn(username, password);
      const userInfo = this.parseUserInfo(fmodeUser);
      
      // 保存用户信息到本地存储
      this.saveUserToLocalStorage(userInfo);
      
      return {
        success: true,
        message: '登录成功',
        user: userInfo
      };
    } catch (error: any) {
      return this.handleAuthError(error, '登录失败');
    }
  }

  /**
   * 手机验证码登录
   * @param phone 手机号
   * @param verificationCode 验证码
   */
  async loginWithPhoneCode(phone: string, verificationCode: string): Promise<AuthResponse> {
    try {
      // 使用 Parse Cloud Function 进行验证码登录
      const result = await FmodeParse.Cloud.run('loginWithPhoneCode', {
        phoneNumber: phone,
        smsCode: verificationCode
      });
      
      // 验证码登录成功后，使用返回的 session token 进行登录
      const fmodeUser = await FmodeParse.User.become(result.sessionToken);
      
      const userInfo = this.parseUserInfo(fmodeUser);
      this.saveUserToLocalStorage(userInfo);
      
      return {
        success: true,
        message: '登录成功',
        user: userInfo
      };
    } catch (error: any) {
      return this.handleAuthError(error, '验证码登录失败');
    }
  }

  /**
   * 发送手机验证码
   * @param phone 手机号
   * @param purpose 用途：'login' | 'register' | 'resetPassword'
   */
  async sendVerificationCode(phone: string, purpose: string = 'login'): Promise<AuthResponse> {
    try {
      // 调用 Parse Cloud Function 发送验证码
      await FmodeParse.Cloud.run('sendSMSCode', {
        phoneNumber: phone,
        purpose: purpose
      });
      
      return {
        success: true,
        message: '验证码已发送'
      };
    } catch (error: any) {
      return this.handleAuthError(error, '发送验证码失败');
    }
  }

  /**
   * 用户注册
   */
  async register(
    username: string, 
    password: string, 
    identity: string, 
    extraFields: any
  ): Promise<AuthResponse> {
    try {
      console.log('AuthService.register 开始:', { username, identity, extraFields });

      // 创建用户 - 使用扩展的 signUp 方法
      const user = new FmodeParse.User();
      user.set('username', username);
      user.set('password', password);
      user.set('identity', identity);
      
      // 设置额外字段
      Object.keys(extraFields).forEach(key => {
        if (extraFields[key]) {
          console.log(`设置字段 ${key}:`, extraFields[key]);
          user.set(key, extraFields[key]);
        }
      });
      
      console.log('准备调用 signUp...');
      
      // 执行注册
      await user.signUp();
      
      console.log('注册成功');
      
      return {
        success: true,
        message: '注册成功'
      };
    } catch (error: any) {
      console.error('注册详细错误:', {
        code: error.code,
        message: error.message,
        error: error
      });
      return this.handleAuthError(error, '注册失败');
    }
  }

  /**
   * 请求重置密码（发送重置邮件或短信）
   * @param account 账号（邮箱或手机号）
   * @param type 类型：'email' | 'phone'
   */
  async requestPasswordReset(account: string, type: 'email' | 'phone' = 'email'): Promise<AuthResponse> {
    try {
      if (type === 'email') {
        // 通过邮箱重置密码
        await FmodeParse.User.requestPasswordReset(account);
        return {
          success: true,
          message: '密码重置邮件已发送，请查收'
        };
      } else {
        // 通过手机号重置密码
        await FmodeParse.Cloud.run('requestPasswordResetBySMS', {
          phoneNumber: account
        });
        return {
          success: true,
          message: '验证码已发送到您的手机'
        };
      }
    } catch (error: any) {
      return this.handleAuthError(error, '请求密码重置失败');
    }
  }

  /**
   * 使用验证码重置密码
   * @param phone 手机号
   * @param code 验证码
   * @param newPassword 新密码
   */
  async resetPasswordWithCode(phone: string, code: string, newPassword: string): Promise<AuthResponse> {
    try {
      await FmodeParse.Cloud.run('resetPasswordWithSMS', {
        phoneNumber: phone,
        smsCode: code,
        newPassword: newPassword
      });
      
      return {
        success: true,
        message: '密码重置成功'
      };
    } catch (error: any) {
      return this.handleAuthError(error, '密码重置失败');
    }
  }

  /**
   * 修改密码（已登录用户）
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<AuthResponse> {
    try {
      const currentUser = FmodeParse.User.current();
      if (!currentUser || !currentUser.username) {
        return {
          success: false,
          message: '请先登录'
        };
      }

      // 验证旧密码
      await FmodeParse.User.logIn(currentUser.username, oldPassword);
      
      // 设置新密码
      currentUser.password = newPassword;
      await currentUser.save();
      
      return {
        success: true,
        message: '密码修改成功'
      };
    } catch (error: any) {
      return this.handleAuthError(error, '密码修改失败');
    }
  }

  /**
   * 退出登录
   */
  async logout(): Promise<void> {
    try {
      await FmodeParse.User.logOut();
      localStorage.removeItem('currentUser');
      localStorage.removeItem('rememberLogin');
      localStorage.removeItem('rememberedAccount');
      this.router.navigate(['/auth/login']);
    } catch (error) {
      console.error('退出登录失败:', error);
    }
  }

  /**
   * 获取当前用户
   */
  getCurrentUser(): UserInfo | null {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * 检查是否已登录
   */
  isLoggedIn(): boolean {
    return !!FmodeParse.User.current() && !!this.getCurrentUser();
  }

  /**
   * 验证手机号格式
   */
  validatePhone(phone: string): boolean {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(phone);
  }

  /**
   * 验证邮箱格式
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * 解析 FmodeParse User 对象为 UserInfo
   */
  private parseUserInfo(fmodeUser: any): UserInfo {
    const identity = fmodeUser.get('identity') || 'user';
    const userInfo: UserInfo = {
      id: fmodeUser.id || '',
      account: fmodeUser.username || '',
      name: '',
      identity: identity,
      token: fmodeUser.getSessionToken() || ''  // ✅ 保存sessionToken
    };

    // 获取显示名称
    userInfo.name = fmodeUser.get('name') || 
                    fmodeUser.get('companyName') || 
                    fmodeUser.get('departmentName') || 
                    userInfo.account;

    // 通用字段
    if (fmodeUser.get('phone')) userInfo['phone'] = fmodeUser.get('phone');
    if (fmodeUser.get('email')) userInfo['email'] = fmodeUser.get('email');

    // 根据身份类型获取对应字段
    if (identity === 'user') {
      // C端用户字段
      if (fmodeUser.get('avatar')) userInfo['avatar'] = fmodeUser.get('avatar');
      if (fmodeUser.get('address')) userInfo['address'] = fmodeUser.get('address');
    } else if (identity === 'business') {
      // B端企业字段
      if (fmodeUser.get('companyName')) userInfo['companyName'] = fmodeUser.get('companyName');
      if (fmodeUser.get('companyCode')) userInfo['companyCode'] = fmodeUser.get('companyCode');
      if (fmodeUser.get('contactPerson')) userInfo['contactPerson'] = fmodeUser.get('contactPerson');
      if (fmodeUser.get('contactPhone')) userInfo['contactPhone'] = fmodeUser.get('contactPhone');
      if (fmodeUser.get('businessLicense')) userInfo['businessLicense'] = fmodeUser.get('businessLicense');
    } else if (identity === 'government') {
      // G端政府字段
      if (fmodeUser.get('departmentName')) userInfo['departmentName'] = fmodeUser.get('departmentName');
      if (fmodeUser.get('position')) userInfo['position'] = fmodeUser.get('position');
      if (fmodeUser.get('govPhone')) userInfo['govPhone'] = fmodeUser.get('govPhone');
      if (fmodeUser.get('govEmail')) userInfo['govEmail'] = fmodeUser.get('govEmail');
      if (fmodeUser.get('departmentCode')) userInfo['departmentCode'] = fmodeUser.get('departmentCode');
    }

    return userInfo;
  }

  /**
   * 保存用户信息到本地存储
   */
  private saveUserToLocalStorage(userInfo: UserInfo): void {
    localStorage.setItem('currentUser', JSON.stringify(userInfo));
  }

  /**
   * 统一错误处理
   */
  private handleAuthError(error: any, defaultMessage: string): AuthResponse {
    let errorMsg = defaultMessage;
    
    // Parse 常见错误码
    if (error.code === 101) {
      errorMsg = '账号或密码错误';
    } else if (error.code === 202) {
      errorMsg = '该账号已被注册';
    } else if (error.code === 203) {
      errorMsg = '该邮箱已被注册';
    } else if (error.code === 205) {
      errorMsg = '该手机号已被注册';
    } else if (error.code === 100) {
      errorMsg = '无法连接到服务器';
    } else if (error.code === 125) {
      errorMsg = '邮箱地址无效';
    } else if (error.message) {
      errorMsg = error.message;
    }

    console.error('认证错误:', error);
    
    return {
      success: false,
      message: errorMsg,
      error: error
    };
  }

  /**
   * 根据用户身份导航到对应首页
   */
  navigateToHome(identity: string): void {
    switch (identity) {
      case 'user':
        this.router.navigate(['/consumer']);
        break;
      case 'business':
        this.router.navigate(['/business/dashboard']);
        break;
      case 'government':
        this.router.navigate(['/government']);
        break;
      default:
        this.router.navigate(['/']);
        break;
    }
  }
}
