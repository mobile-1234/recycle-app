import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FmodeParse } from 'fmode-ng';
// 定义登录表单接口
interface LoginForm {
  account: string;
  password: string;
  remember: boolean;
}

// 定义用户接口
interface User {
  id: string;
  account: string;
  password: string;
  name: string;
  identity?: string; // 添加身份类型字段
}

@Component({
  selector: 'app-login',
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

  // 错误信息
  errors = {
    account: '',
    password: ''
  };

  // 密码可见性
  passwordVisible = false;

  // 登录状态
  isLoading = false;

  // Mock用户数据
  private mockUsers: User[] = [
    {
      id: '1',
      account: '13800138000',
      password: '123456',
      name: '张三',
      identity: 'user'
    },
    {
      id: '2',
      account: 'user@example.com',
      password: 'password',
      name: '李四',
      identity: 'business'
    },
    {
      id: '3',
      account: 'admin',
      password: 'admin123',
      name: '管理员',
      identity: 'government'
    }
  ];

  constructor(private router: Router) {}

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

  // 表单提交
  onSubmit(): void {
    // 重置错误信息
    this.errors = { account: '', password: '' };

    // 验证表单
    const isAccountValid = this.validateAccount();
    const isPasswordValid = this.validatePassword();

    if (!isAccountValid || !isPasswordValid) {
      return;
    }

    // 开始登录
    this.isLoading = true;

    // 模拟登录API调用
    setTimeout(() => {
      const user = this.authenticateUser(this.loginForm.account, this.loginForm.password);
      
      if (user) {
        // 登录成功
        console.log('登录成功:', user);
        
        // 保存用户信息到localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        if (this.loginForm.remember) {
          localStorage.setItem('rememberLogin', 'true');
        }

        // 显示成功消息并根据用户身份跳转
        alert('登录成功！即将跳转到对应首页。');
        this.navigateToHomePage(user.identity || 'user');
        
      } else {
        // 登录失败
        this.errors.account = '账户或密码错误';
      }
      
      this.isLoading = false;
    }, 1500);
  }

  // 验证用户凭据
  private authenticateUser(account: string, password: string): User | null {
    FmodeParse.User.logIn(account, password).then(user => {
      console.log('FmodeParse login success', user);
      
      // 如果FmodeParse登录成功，尝试从localStorage获取用户身份信息
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        // 合并FmodeParse用户信息和本地存储的身份信息
        const mergedUser = {
          ...userData,
          fmodeUser: user
        };
        localStorage.setItem('currentUser', JSON.stringify(mergedUser));
      }
      
    }).catch(err => {
      console.log('FmodeParse login failed', err);
    });
    
    // 首先检查是否有注册用户信息
    const registeredUser = localStorage.getItem('registeredUser');
    if (registeredUser) {
      const userData = JSON.parse(registeredUser);
      // 检查账号密码是否匹配注册的用户
      if (userData.account === account) {
        // 将注册用户信息转移到当前用户
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.removeItem('registeredUser'); // 清除注册临时数据
        return {
          id: userData.id,
          account: userData.account,
          password: password,
          name: userData.account, // 使用账号作为名称
          identity: userData.identity
        };
      }
    }
    
    // 如果没有匹配的注册用户，则使用Mock用户数据进行验证
    return this.mockUsers.find(user => 
      user.account === account && user.password === password
    ) || null;
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
  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  // 返回上一页
  goBack(): void {
    window.history.back();
  }
}
