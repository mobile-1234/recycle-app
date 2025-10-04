import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  expanded: boolean;
}

interface FeedbackType {
  value: string;
  label: string;
  icon: string;
}

interface UploadedImage {
  name: string;
  url: string;
  file?: File;
}

interface FeedbackHistory {
  id: string;
  type: string;
  title: string;
  content: string;
  status: 'pending' | 'processing' | 'resolved' | 'closed';
  createTime: Date;
  updateTime: Date;
  reply?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'service';
  content: string;
  time: Date;
}

@Component({
  selector: 'app-customer-service',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-service.html',
  styleUrls: ['./customer-service.scss']
})
export class CustomerServiceComponent implements OnInit {
  
  // 常见问题
  faqList: FAQ[] = [
    {
      id: '1',
      question: '如何预约上门回收服务？',
      answer: '您可以在首页点击"预约回收"，选择回收物品类型、重量和上门时间，填写地址信息后提交预约。我们的回收员会按时上门服务。',
      expanded: false
    },
    {
      id: '2',
      question: '回收价格是如何计算的？',
      answer: '回收价格根据物品类型、重量、品质等因素综合计算。您可以在预约时查看预估价格，实际价格以回收员现场评估为准。',
      expanded: false
    },
    {
      id: '3',
      question: '积分如何兑换现金？',
      answer: '在"我的收益"页面，您可以将积分兑换为现金。100积分=1元，满10元即可提现到支付宝或微信。',
      expanded: false
    },
    {
      id: '4',
      question: '如何查看我的回收记录？',
      answer: '在个人中心的"我的订单"中，您可以查看所有的回收记录，包括订单状态、回收详情和收益情况。',
      expanded: false
    }
  ];
  
  // 反馈类型
  feedbackTypes: FeedbackType[] = [
    { value: 'bug', label: '功能异常', icon: 'fas fa-bug' },
    { value: 'suggestion', label: '功能建议', icon: 'fas fa-lightbulb' },
    { value: 'service', label: '服务问题', icon: 'fas fa-user-tie' },
    { value: 'other', label: '其他问题', icon: 'fas fa-question-circle' }
  ];
  
  // 反馈表单数据
  selectedFeedbackType = '';
  feedbackContent = '';
  contactInfo = '';
  uploadedImages: UploadedImage[] = [];
  
  // 反馈历史记录
  feedbackHistory: FeedbackHistory[] = [
    {
      id: '1',
      type: 'bug',
      title: '预约页面无法选择时间',
      content: '在预约回收时，时间选择器无法正常显示，点击没有反应。',
      status: 'resolved',
      createTime: new Date('2024-01-15'),
      updateTime: new Date('2024-01-16'),
      reply: '感谢您的反馈，该问题已修复，请更新到最新版本。'
    },
    {
      id: '2',
      type: 'suggestion',
      title: '希望增加夜间回收服务',
      content: '建议增加夜间回收时段，方便上班族用户。',
      status: 'processing',
      createTime: new Date('2024-01-10'),
      updateTime: new Date('2024-01-12')
    }
  ];
  
  // 在线客服相关
  showChatModal = false;
  chatInputText = '';
  chatMessages: ChatMessage[] = [
    {
      id: '1',
      sender: 'service',
      content: '您好！我是智能客服小绿，很高兴为您服务。请问有什么可以帮助您的吗？',
      time: new Date()
    }
  ];
  
  constructor(private router: Router) {}
  
  ngOnInit() {
    // 初始化数据
  }
  
  // 开始在线聊天
  startOnlineChat() {
    this.showChatModal = true;
  }
  
  // 拨打客服电话
  callService() {
    if (confirm('是否拨打客服热线 400-888-6666？')) {
      // 在移动端可以直接拨打电话
      window.location.href = 'tel:400-888-6666';
    }
  }
  
  // 发送邮件
  sendEmail() {
    const subject = encodeURIComponent('回收应用反馈');
    const body = encodeURIComponent('请在此处描述您的问题或建议...');
    window.location.href = `mailto:service@recycle-app.com?subject=${subject}&body=${body}`;
  }
  
  // 查看全部FAQ
  viewAllFAQ() {
    this.showAlert('跳转到帮助中心页面', 'info');
  }
  
  // 切换FAQ展开状态
  toggleFAQ(faq: FAQ) {
    faq.expanded = !faq.expanded;
  }
  
  // 选择反馈类型
  selectFeedbackType(type: string) {
    this.selectedFeedbackType = type;
  }
  
  // 上传图片
  uploadImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          this.showAlert('图片大小不能超过5MB', 'error');
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.uploadedImages.push({
            name: file.name,
            url: e.target.result,
            file: file
          });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }
  
  // 移除图片
  removeImage(index: number) {
    this.uploadedImages.splice(index, 1);
  }
  
  // 检查是否可以提交
  canSubmit(): boolean {
    return this.selectedFeedbackType !== '' && 
           this.feedbackContent.trim() !== '';
  }
  
  // 提交反馈
  submitFeedback() {
    if (!this.canSubmit()) {
      this.showAlert('请填写必要信息', 'error');
      return;
    }
    
    const newFeedback: FeedbackHistory = {
      id: Date.now().toString(),
      type: this.selectedFeedbackType,
      title: this.feedbackContent.substring(0, 20) + (this.feedbackContent.length > 20 ? '...' : ''),
      content: this.feedbackContent,
      status: 'pending',
      createTime: new Date(),
      updateTime: new Date()
    };
    
    this.feedbackHistory.unshift(newFeedback);
    
    // 重置表单
    this.selectedFeedbackType = '';
    this.feedbackContent = '';
    this.contactInfo = '';
    this.uploadedImages = [];
    
    this.showAlert('反馈提交成功，我们会尽快处理', 'success');
  }
  
  // 获取反馈类型标签
  getFeedbackTypeLabel(type: string): string {
    const typeObj = this.feedbackTypes.find(t => t.value === type);
    return typeObj ? typeObj.label : type;
  }
  
  // 获取状态标签
  getStatusLabel(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': '待处理',
      'processing': '处理中',
      'resolved': '已解决',
      'closed': '已关闭'
    };
    return statusMap[status] || status;
  }
  
  // 查看反馈详情
  viewFeedbackDetail(item: FeedbackHistory) {
    this.showAlert(`查看反馈详情: ${item.title}`, 'info');
  }
  
  // 关闭聊天模态框
  closeChatModal() {
    this.showChatModal = false;
  }
  
  // 发送消息
  sendMessage() {
    if (!this.chatInputText.trim()) return;
    
    // 添加用户消息
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: this.chatInputText,
      time: new Date()
    };
    this.chatMessages.push(userMessage);
    
    const userInput = this.chatInputText;
    this.chatInputText = '';
    
    // 模拟客服回复
    setTimeout(() => {
      const serviceReply = this.generateServiceReply(userInput);
      const serviceMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'service',
        content: serviceReply,
        time: new Date()
      };
      this.chatMessages.push(serviceMessage);
    }, 1000);
  }
  
  // 生成客服回复
  private generateServiceReply(userInput: string): string {
    const input = userInput.toLowerCase();
    
    if (input.includes('预约') || input.includes('回收')) {
      return '关于预约回收服务，您可以在首页点击"预约回收"按钮，选择回收物品和时间。如果遇到问题，我可以为您详细介绍操作步骤。';
    } else if (input.includes('价格') || input.includes('多少钱')) {
      return '回收价格会根据物品类型、重量和品质来计算。您可以在预约时查看预估价格，具体价格以回收员现场评估为准。';
    } else if (input.includes('积分') || input.includes('兑换')) {
      return '积分可以在"我的收益"页面兑换现金，100积分=1元。您也可以在积分商城兑换各种环保商品。';
    } else if (input.includes('问题') || input.includes('bug') || input.includes('异常')) {
      return '如果您遇到了技术问题，建议您先尝试重启应用。如果问题仍然存在，请通过意见反馈功能详细描述问题，我们会尽快修复。';
    } else {
      return '感谢您的咨询。如果您有其他问题，可以详细描述，我会尽力为您解答。您也可以拨打客服热线400-888-6666获得人工服务。';
    }
  }
  
  // 关闭模态框
  closeModal(event: Event) {
    if (event.target === event.currentTarget) {
      this.showChatModal = false;
    }
  }
  
  // 格式化日期
  formatDate(date: Date): string {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return '今天';
    } else if (diffDays === 1) {
      return '昨天';
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    } else {
      return date.toLocaleDateString('zh-CN', {
        month: 'short',
        day: 'numeric'
      });
    }
  }
  
  // 格式化时间
  formatTime(date: Date): string {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
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