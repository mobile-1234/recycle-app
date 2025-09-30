import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

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
      name: '张三'
    },
    {
      id: '2',
      account: 'user@example.com',
      password: 'password',
      name: '李四'
    },
    {
      id: '3',
      account: 'admin',
      password: 'admin123',
      name: '管理员'
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

        // 跳转到主页面（这里可以根据实际需要修改路由）
        alert('登录成功！');
        // this.router.navigate(['/dashboard']); // 实际项目中取消注释
        
      } else {
        // 登录失败
        this.errors.account = '账户或密码错误';
      }
      
      this.isLoading = false;
    }, 1500);
  }

  // 验证用户凭据
  private authenticateUser(account: string, password: string): User | null {
    return this.mockUsers.find(user => 
      user.account === account && user.password === password
    ) || null;
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
