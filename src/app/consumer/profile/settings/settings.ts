import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Language {
  code: string;
  name: string;
}

interface UserInfo {
  nickname: string;
  avatar?: string;
  phone?: string;
  email?: string;
}

interface NotificationSettings {
  push: boolean;
  sms: boolean;
  email: boolean;
}

interface PrivacySettings {
  location: boolean;
  analytics: boolean;
  personalization: boolean;
}

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.html',
  styleUrls: ['./settings.scss']
})
export class SettingsComponent implements OnInit {
  // 用户信息
  userInfo: UserInfo = {
    nickname: '用户昵称',
    avatar: '',
    phone: '',
    email: ''
  };

  // 通知设置
  notificationSettings: NotificationSettings = {
    push: true,
    sms: false,
    email: true
  };

  // 隐私设置
  privacySettings: PrivacySettings = {
    location: true,
    analytics: false,
    personalization: true
  };

  // 语言设置
  languages: Language[] = [
    { code: 'zh-CN', name: '简体中文' },
    { code: 'zh-TW', name: '繁體中文' },
    { code: 'en-US', name: 'English' },
    { code: 'ja-JP', name: '日本語' },
    { code: 'ko-KR', name: '한국어' }
  ];

  selectedLanguage = 'zh-CN';
  currentLanguage = '简体中文';

  // 应用信息
  appVersion = '1.2.3';
  cacheSize = '12.5MB';

  // 模态框状态
  showLanguageModal = false;
  showProfileModal = false;

  // 头像预览
  avatarPreview: string | null = null;

  // 提示消息
  showAlert = false;
  alertMessage = '';
  alertType = 'alert-success';

  // 用户手机号
  userPhone = '';

  constructor(
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    this.loadUserInfo();
    this.loadSettings();
  }

  // 加载用户信息
  loadUserInfo() {
    // 从本地存储或API获取用户信息
    const savedUserInfo = localStorage.getItem('userInfo');
    if (savedUserInfo) {
      this.userInfo = { ...this.userInfo, ...JSON.parse(savedUserInfo) };
    }

    const savedPhone = localStorage.getItem('userPhone');
    if (savedPhone) {
      this.userPhone = savedPhone;
    }
  }

  // 加载设置
  loadSettings() {
    // 加载通知设置
    const savedNotificationSettings = localStorage.getItem('notificationSettings');
    if (savedNotificationSettings) {
      this.notificationSettings = { ...this.notificationSettings, ...JSON.parse(savedNotificationSettings) };
    }

    // 加载隐私设置
    const savedPrivacySettings = localStorage.getItem('privacySettings');
    if (savedPrivacySettings) {
      this.privacySettings = { ...this.privacySettings, ...JSON.parse(savedPrivacySettings) };
    }

    // 加载语言设置
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      this.selectedLanguage = savedLanguage;
      const lang = this.languages.find(l => l.code === savedLanguage);
      if (lang) {
        this.currentLanguage = lang.name;
      }
    }
  }

  // 返回上一页
  goBack() {
    this.location.back();
  }

  // 编辑个人资料
  editProfile() {
    this.showProfileModal = true;
  }

  // 修改密码
  changePassword() {
    this.router.navigate(['/consumer/profile/change-password']);
  }

  // 绑定手机
  bindPhone() {
    this.router.navigate(['/consumer/profile/bind-phone']);
  }

  // 更新通知设置
  updateNotificationSetting(type: keyof NotificationSettings, event: any) {
    this.notificationSettings[type] = event.target.checked;
    localStorage.setItem('notificationSettings', JSON.stringify(this.notificationSettings));
    
    this.showAlertMessage(
      `${this.getNotificationTypeName(type)}${event.target.checked ? '已开启' : '已关闭'}`,
      'alert-success'
    );
  }

  // 更新隐私设置
  updatePrivacySetting(type: keyof PrivacySettings, event: any) {
    this.privacySettings[type] = event.target.checked;
    localStorage.setItem('privacySettings', JSON.stringify(this.privacySettings));
    
    this.showAlertMessage(
      `${this.getPrivacyTypeName(type)}${event.target.checked ? '已开启' : '已关闭'}`,
      'alert-success'
    );
  }

  // 获取通知类型名称
  getNotificationTypeName(type: keyof NotificationSettings): string {
    const names = {
      push: '推送通知',
      sms: '短信通知',
      email: '邮件通知'
    };
    return names[type];
  }

  // 获取隐私类型名称
  getPrivacyTypeName(type: keyof PrivacySettings): string {
    const names = {
      location: '位置服务',
      analytics: '数据分析',
      personalization: '个性化推荐'
    };
    return names[type];
  }

  // 选择语言
  selectLanguage() {
    this.showLanguageModal = true;
  }

  // 选择语言选项
  selectLanguageOption(language: Language) {
    this.selectedLanguage = language.code;
    this.currentLanguage = language.name;
    localStorage.setItem('selectedLanguage', language.code);
    this.showLanguageModal = false;
    
    this.showAlertMessage(`语言已切换为${language.name}`, 'alert-success');
  }

  // 清理缓存
  clearCache() {
    // 模拟清理缓存
    setTimeout(() => {
      this.cacheSize = '0MB';
      this.showAlertMessage('缓存清理完成', 'alert-success');
    }, 1000);
    
    this.showAlertMessage('正在清理缓存...', 'alert-info');
  }

  // 检查更新
  checkUpdate() {
    this.showAlertMessage('正在检查更新...', 'alert-info');
    
    // 模拟检查更新
    setTimeout(() => {
      this.showAlertMessage('当前已是最新版本', 'alert-success');
    }, 2000);
  }

  // 查看用户协议
  viewAgreement() {
    this.router.navigate(['/consumer/agreement']);
  }

  // 查看隐私政策
  viewPrivacyPolicy() {
    this.router.navigate(['/consumer/privacy-policy']);
  }

  // 联系客服
  contactSupport() {
    this.router.navigate(['/consumer/support']);
  }

  // 退出登录
  logout() {
    if (confirm('确定要退出登录吗？')) {
      // 清除本地存储
      localStorage.removeItem('userToken');
      localStorage.removeItem('userInfo');
      
      // 跳转到登录页
      this.router.navigate(['/auth/login']);
    }
  }

  // 关闭语言模态框
  closeLanguageModal(event: any) {
    if (event.target === event.currentTarget) {
      this.showLanguageModal = false;
    }
  }

  // 关闭个人资料模态框
  closeProfileModal(event: any) {
    if (event.target === event.currentTarget) {
      this.showProfileModal = false;
      this.avatarPreview = null;
    }
  }

  // 选择头像
  onAvatarSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // 验证文件类型
      if (!file.type.startsWith('image/')) {
        this.showAlertMessage('请选择图片文件', 'alert-error');
        return;
      }

      // 验证文件大小（限制为2MB）
      if (file.size > 2 * 1024 * 1024) {
        this.showAlertMessage('图片大小不能超过2MB', 'alert-error');
        return;
      }

      // 创建预览
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.avatarPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // 保存个人资料
  saveProfile() {
    // 验证昵称
    if (!this.userInfo.nickname || this.userInfo.nickname.trim().length === 0) {
      this.showAlertMessage('请输入昵称', 'alert-error');
      return;
    }

    if (this.userInfo.nickname.trim().length > 20) {
      this.showAlertMessage('昵称长度不能超过20个字符', 'alert-error');
      return;
    }

    // 更新头像
    if (this.avatarPreview) {
      this.userInfo.avatar = this.avatarPreview;
    }

    // 保存到本地存储
    localStorage.setItem('userInfo', JSON.stringify(this.userInfo));

    // 关闭模态框
    this.showProfileModal = false;
    this.avatarPreview = null;

    this.showAlertMessage('个人资料保存成功', 'alert-success');
  }

  // 显示提示消息
  showAlertMessage(message: string, type: string) {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;

    // 3秒后自动隐藏
    setTimeout(() => {
      this.showAlert = false;
    }, 3000);
  }
}