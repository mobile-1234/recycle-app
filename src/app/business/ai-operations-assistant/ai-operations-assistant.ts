import { Component, OnInit, ViewChild, ElementRef, Pipe, PipeTransform, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DeepSeekAIService } from '../../core/services/deepseek-ai';

// 换行符转HTML管道
@Pipe({
  name: 'nl2br',
  standalone: true
})
export class Nl2brPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) return '';
    const html = value.replace(/\n/g, '<br>');
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  attachments?: FileAttachment[];
  suggestions?: string[];
}

interface FileAttachment {
  name: string;
  size: number;
  type: string;
  url?: string;
}

interface QuickQuestion {
  icon: string;
  text: string;
  category: string;
}

interface Insight {
  id: string;
  title: string;
  description: string;
  type: 'warning' | 'info' | 'success';
  icon: string;
  action?: string;
  route?: string;
}

interface Policy {
  id: string;
  title: string;
  description: string;
  amount: string;
  deadline: string;
  status: 'available' | 'applied' | 'expired';
  requirements: string[];
}

@Component({
  selector: 'app-ai-operations-assistant',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, Nl2brPipe],
  templateUrl: './ai-operations-assistant.html',
  styleUrl: './ai-operations-assistant.scss'
})
export class AiOperationsAssistant implements OnInit {
  @ViewChild('messageContainer') messageContainer!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  // 当前激活的模块
  activeModule: 'chat' | 'insights' | 'policies' = 'chat';

  // 聊天相关
  messages: Message[] = [];
  userInput = '';
  isTyping = false;
  isRecording = false;
  recordingTime = 0;
  recordingInterval: any;
  isStreamingResponse = false;
  streamingMessageId: string | null = null;

  // 文件上传
  attachedFiles: FileAttachment[] = [];

  // 快捷问题
  quickQuestions: QuickQuestion[] = [
    { icon: '📊', text: '本月哪个品类利润最高？', category: '数据分析' },
    { icon: '📈', text: '预测下周的回收量', category: '趋势预测' },
    { icon: '⚙️', text: '分析3号设备的运行效率', category: '设备监控' },
    { icon: '💰', text: '查看本月收入趋势', category: '财务分析' },
    { icon: '🚨', text: '显示所有未处理预警', category: '预警管理' },
    { icon: '👥', text: '优化人员调度建议', category: '人员管理' }
  ];

  // 智能洞察
  insights: Insight[] = [
    {
      id: '1',
      title: '价格波动预警',
      description: '塑料回收价格上涨15%，建议调整收购策略',
      type: 'warning',
      icon: '⚠️',
      route: '/business/data-reports'
    },
    {
      id: '2',
      title: '设备维护提醒',
      description: '3号设备运行156小时，建议本周末进行保养',
      type: 'info',
      icon: 'ℹ️',
      route: '/business/device-management'
    },
    {
      id: '3',
      title: '运营效率优化',
      description: '优化回收路线可节省20%运输成本',
      type: 'success',
      icon: '✅',
      action: 'optimize-route'
    }
  ];

  // 政策推荐
  policies: Policy[] = [
    {
      id: '1',
      title: '再生视界企业补贴',
      description: '符合条件的回收企业可申请政府补贴，用于设备升级和运营支持',
      amount: '¥50,000 - ¥200,000',
      deadline: '2025年12月31日',
      status: 'available',
      requirements: ['年回收量≥500吨', '环保资质齐全', '无违规记录']
    },
    {
      id: '2',
      title: '智能化改造专项资金',
      description: '支持企业进行智能化、数字化改造的专项资金',
      amount: '¥100,000 - ¥500,000',
      deadline: '2025年11月30日',
      status: 'available',
      requirements: ['投资额≥50万', '技术方案审核通过', '3年内完成改造']
    }
  ];

  constructor(
    private router: Router,
    private deepseekService: DeepSeekAIService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    // 初始化欢迎消息
    const welcomeMsg = this.deepseekService.isConfigured() 
      ? '您好！我是您的AI运营助手，由 DeepSeek AI 驱动。我可以帮您分析数据、预测趋势、优化运营，还能推荐适合的政策补贴。有什么我可以帮您的吗？'
      : '您好！我是您的AI运营助手。⚠️ 当前为演示模式，如需启用真实 AI 分析，请配置 DeepSeek API Key。';
    
    this.addAIMessage(
      welcomeMsg,
      ['查看数据分析', '预测回收量', '设备效率分析', '政策推荐']
    );
  }

  // 切换模块
  switchModule(module: 'chat' | 'insights' | 'policies') {
    this.activeModule = module;
  }

  // 发送消息
  async sendMessage() {
    if (!this.userInput.trim() && this.attachedFiles.length === 0) return;

    const userMessage = this.userInput;
    const message: Message = {
      id: Date.now().toString(),
      content: userMessage,
      sender: 'user',
      timestamp: new Date(),
      attachments: this.attachedFiles.length > 0 ? [...this.attachedFiles] : undefined
    };

    this.messages.push(message);
    this.userInput = '';
    this.attachedFiles = [];

    // 滚动到底部
    setTimeout(() => this.scrollToBottom(), 100);

    // AI回复
    this.isTyping = true;
    
    try {
      // 使用 DeepSeek API（如果已配置）
      if (this.deepseekService.isConfigured()) {
        await this.generateDeepSeekResponse(userMessage);
      } else {
        // 使用模拟响应
        setTimeout(() => {
          this.generateMockResponse(userMessage);
          this.isTyping = false;
        }, 1500);
      }
    } catch (error: any) {
      this.isTyping = false;
      this.addAIMessage(
        `❌ 抱歉，服务出现异常：${error.message}\n\n您可以：\n• 检查 API Key 配置\n• 稍后重试\n• 切换到演示模式`,
        ['重新配置 API Key', '使用演示模式']
      );
    }
  }

  // 使用 DeepSeek API 生成回复（流式输出）
  async generateDeepSeekResponse(userMessage: string) {
    try {
      // 创建一个空的 AI 消息用于流式更新
      const aiMessageId = Date.now().toString();
      const aiMessage: Message = {
        id: aiMessageId,
        content: '',
        sender: 'ai' as const,  // 明确类型为 'ai'
        timestamp: new Date(),
        suggestions: []
      };
      
      // 先添加空消息到列表
      this.messages.push(aiMessage);
      this.isTyping = false;
      this.isStreamingResponse = true;
      this.streamingMessageId = aiMessageId;
      
      // 触发一次变更检测
      this.cdr.detectChanges();
      
      // 滚动到底部
      setTimeout(() => this.scrollToBottom(), 100);
      
      // 使用流式 API（在 Zone 外运行以提高性能）
      let fullResponse = '';
      let updateCounter = 0;
      
      await this.ngZone.runOutsideAngular(async () => {
        for await (const chunk of this.deepseekService.sendMessageStream(userMessage)) {
          fullResponse += chunk;
          updateCounter++;
          
          // 实时更新消息内容
          const messageIndex = this.messages.findIndex(m => m.id === aiMessageId);
          if (messageIndex !== -1) {
            // 直接修改内容，避免创建新对象减少闪烁
            this.messages[messageIndex].content = fullResponse;
            // 确保 sender 字段存在且正确（仅在必要时设置）
            if (this.messages[messageIndex].sender !== 'ai') {
              this.messages[messageIndex].sender = 'ai';
            }
            
            // 减少 UI 更新频率，每 15 个字符更新一次（进一步减少闪烁）
            if (updateCounter % 15 === 0) {
              this.ngZone.run(() => {
                this.cdr.detectChanges();
              });
            }
            
            // 定期滚动到底部
            if (fullResponse.length % 150 === 0) {
              this.ngZone.run(() => {
                setTimeout(() => this.scrollToBottom(), 0);
              });
            }
          }
        }
      });
      
      // 流式输出完成后，最后确保内容完整且 sender 正确
      const finalIndex = this.messages.findIndex(m => m.id === aiMessageId);
      if (finalIndex !== -1) {
        this.messages[finalIndex].content = fullResponse;
        if (this.messages[finalIndex].sender !== 'ai') {
          this.messages[finalIndex].sender = 'ai';
        }
      }
      
      // 流式输出完成
      this.isStreamingResponse = false;
      this.streamingMessageId = null;
      
      // 提取建议并更新消息
      const suggestions = this.extractSuggestions(fullResponse);
      const messageIndex = this.messages.findIndex(m => m.id === aiMessageId);
      if (messageIndex !== -1) {
        // 直接更新建议，避免创建新对象
        this.messages[messageIndex].suggestions = suggestions;
        // 确保 sender 正确
        if (this.messages[messageIndex].sender !== 'ai') {
          this.messages[messageIndex].sender = 'ai';
        }
      }
      
      // 最后触发一次变更检测
      this.cdr.detectChanges();
      
      // 最后滚动到底部
      setTimeout(() => this.scrollToBottom(), 100);
      
    } catch (error) {
      this.isStreamingResponse = false;
      this.streamingMessageId = null;
      throw error;
    }
  }

  // 使用模拟响应（演示模式）
  generateMockResponse(userMessage: string) {
    let response = '';
    let suggestions: string[] = [];

    // 根据关键词匹配回复
    if (userMessage.includes('利润') || userMessage.includes('品类')) {
      response = `📊 **本月品类利润分析** (演示模式)\n\n根据数据分析，纸类回收利润最高：\n\n• 纸类：¥45,820（占比38%）↑12%\n• 塑料：¥32,150（占比28%）↑8%\n• 金属：¥28,900（占比25%）↓3%\n• 玻璃：¥10,600（占比9%）→0%\n\n**建议**：加大纸类回收力度，优化塑料回收渠道。`;
      suggestions = ['查看详细报表', '导出数据', '设置提醒'];
    } else if (userMessage.includes('预测') || userMessage.includes('回收量')) {
      response = `📈 **下周回收量预测** (演示模式)\n\n基于历史数据和AI算法预测：\n\n• 预计总量：2,850kg\n• 环比增长：+12.5%\n• 置信度：89%\n\n**详细预测**：\n周一：380kg | 周二：420kg | 周三：390kg\n周四：450kg | 周五：410kg | 周六：420kg | 周日：380kg\n\n**影响因素**：季节性上升、节假日效应`;
      suggestions = ['查看预测详情', '调整人员安排', '优化路线'];
    } else if (userMessage.includes('设备') || userMessage.includes('效率')) {
      response = `⚙️ **3号设备效率分析** (演示模式)\n\n• 运行状态：良好 ✅\n• 处理效率：92.5%（高于平均8%）\n• 运行时长：156小时\n• 故障率：0.8%（低）\n\n**维护建议**：\n1. 本周末安排常规保养\n2. 更换磨损部件（预计费用¥800）\n3. 优化运行参数可提升5%效率`;
      suggestions = ['查看设备详情', '安排维护', '查看历史记录'];
    } else if (userMessage.includes('收入') || userMessage.includes('趋势')) {
      response = `💰 **本月收入趋势分析** (演示模式)\n\n• 总收入：¥156,470\n• 环比增长：+18.5%\n• 日均收入：¥5,216\n\n**收入构成**：\n• 回收业务：¥98,200（63%）\n• 加工服务：¥42,150（27%）\n• 其他收入：¥16,120（10%）\n\n**趋势**：持续上升，预计下月可突破¥18万`;
      suggestions = ['查看详细账单', '导出财务报表', '设置收入目标'];
    } else if (userMessage.includes('预警') || userMessage.includes('警告')) {
      response = `🚨 **未处理预警列表** (演示模式)\n\n1. **高优先级**\n   • 塑料价格异常波动（+15%）\n   • 3号设备需要保养\n\n2. **中优先级**\n   • 库存即将满载（85%）\n   • 人员调度不均衡\n\n3. **低优先级**\n   • 本周订单量下降5%\n\n**建议**：优先处理高优先级预警`;
      suggestions = ['查看预警详情', '一键处理', '设置预警规则'];
    } else if (userMessage.includes('人员') || userMessage.includes('调度')) {
      response = `👥 **人员调度优化建议** (演示模式)\n\n**当前状况**：\n• 总人员：28人\n• 平均利用率：76%\n• 高峰时段：周三、周五\n\n**优化方案**：\n1. 周三增加2名人员（+8%效率）\n2. 周一减少1名人员（节省¥300/天）\n3. 调整班次时间（提升15%覆盖率）\n\n**预期效果**：月节省成本¥4,500，效率提升12%`;
      suggestions = ['应用优化方案', '查看人员详情', '调整排班'];
    } else if (userMessage.includes('分配') || userMessage.includes('订单')) {
      response = `✅ **订单分配完成** (演示模式)\n\n已将XX小区的所有订单分配给张三：\n\n• 订单数量：15个\n• 预计完成时间：2天\n• 路线已优化\n\n张三将在30分钟内收到通知。`;
      suggestions = ['查看订单详情', '调整分配', '通知客户'];
    } else if (userMessage.includes('补贴') || userMessage.includes('政策')) {
      response = `🎁 **可申请的补贴政策** (演示模式)\n\n根据您的企业情况，推荐以下政策：\n\n1. **再生视界企业补贴**\n   金额：¥50,000 - ¥200,000\n   匹配度：95%\n\n2. **智能化改造专项资金**\n   金额：¥100,000 - ¥500,000\n   匹配度：88%\n\n**申请流程**：准备材料 → 在线提交 → 审核 → 发放`;
      suggestions = ['查看政策详情', '开始申请', '咨询客服'];
    } else {
      response = `我理解您的问题了。(演示模式)\n\n${userMessage}\n\n如果您需要更详细的信息，可以：\n• 查看数据报表\n• 咨询具体业务\n• 查看相关政策\n\n💡 提示：配置 DeepSeek API Key 以获得真实的 AI 智能分析。`;
      suggestions = ['数据分析', '设备监控', '政策推荐', '配置 API Key'];
    }

    this.addAIMessage(response, suggestions);
  }

  // 从 AI 响应中提取建议
  extractSuggestions(response: string): string[] {
    const suggestions: string[] = [];
    
    // 简单的建议提取逻辑
    if (response.includes('报表') || response.includes('数据')) {
      suggestions.push('查看详细报表');
    }
    if (response.includes('优化') || response.includes('改进')) {
      suggestions.push('查看优化方案');
    }
    if (response.includes('设备') || response.includes('维护')) {
      suggestions.push('设备管理');
    }
    if (response.includes('政策') || response.includes('补贴')) {
      suggestions.push('政策推荐');
    }
    
    return suggestions.length > 0 ? suggestions : ['继续对话', '查看更多'];
  }

  // 添加AI消息
  addAIMessage(content: string, suggestions?: string[]) {
    const message: Message = {
      id: Date.now().toString(),
      content,
      sender: 'ai',
      timestamp: new Date(),
      suggestions
    };
    this.messages.push(message);
    setTimeout(() => this.scrollToBottom(), 100);
  }

  // 点击快捷问题
  askQuickQuestion(question: string) {
    this.userInput = question;
    this.sendMessage();
  }

  // 点击建议按钮
  clickSuggestion(suggestion: string) {
    // 处理特殊建议
    if (suggestion.includes('配置 API Key') || suggestion.includes('重新配置')) {
      this.configureApiKey();
      return;
    }
    
    this.userInput = suggestion;
    this.sendMessage();
  }

  // 语音输入
  startRecording() {
    this.isRecording = true;
    this.recordingTime = 0;

    // 模拟录音计时
    this.recordingInterval = setInterval(() => {
      this.recordingTime++;
      if (this.recordingTime >= 3) {
        this.stopRecording();
      }
    }, 1000);
  }

  stopRecording() {
    this.isRecording = false;
    clearInterval(this.recordingInterval);

    // 模拟语音转文字
    setTimeout(() => {
      this.userInput = '本月哪个品类利润最高？';
    }, 500);
  }

  // 文件上传
  triggerFileUpload() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    for (let file of files) {
      const attachment: FileAttachment = {
        name: file.name,
        size: file.size,
        type: file.type
      };
      this.attachedFiles.push(attachment);
    }
  }

  removeFile(index: number) {
    this.attachedFiles.splice(index, 1);
  }

  getFileIcon(type: string): string {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('excel') || type.includes('spreadsheet')) return '📊';
    if (type.includes('image')) return '🖼️';
    return '📎';
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  // 滚动到底部
  scrollToBottom() {
    if (this.messageContainer) {
      const element = this.messageContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  // 清空对话
  clearChat() {
    this.messages = [];
    this.deepseekService.clearHistory();
    this.ngOnInit();
  }

  // 配置 API Key
  configureApiKey() {
    const apiKey = prompt('请输入您的 DeepSeek API Key：');
    if (apiKey && apiKey.trim()) {
      this.deepseekService.setApiKey(apiKey.trim());
      this.clearChat();
      this.addAIMessage(
        '✅ API Key 配置成功！现在我将使用 DeepSeek AI 为您提供智能分析服务。',
        ['开始使用', '数据分析', '预测回收量']
      );
    }
  }

  // 洞察操作
  handleInsightAction(insight: Insight) {
    if (insight.route) {
      this.router.navigate([insight.route]);
    } else if (insight.action === 'optimize-route') {
      this.activeModule = 'chat';
      this.userInput = '如何优化回收路线？';
      this.sendMessage();
    }
  }

  // 政策操作
  viewPolicyDetails(policy: Policy) {
    this.activeModule = 'chat';
    this.userInput = `请详细介绍${policy.title}的申请流程`;
    this.sendMessage();
  }

  applyPolicy(policy: Policy) {
    if (policy.status === 'available') {
      policy.status = 'applied';
      this.addAIMessage(
        `✅ 已为您准备申请材料，请查收：\n\n1. 企业营业执照\n2. 环保资质证明\n3. 近一年财务报表\n4. 回收量统计表\n\n材料准备完成后，可在政务平台提交申请。`,
        ['下载申请表', '查看进度', '咨询客服']
      );
    }
  }

  getPolicyStatusText(status: string): string {
    const statusMap: any = {
      'available': '可申请',
      'applied': '已申请',
      'expired': '已过期'
    };
    return statusMap[status] || status;
  }

  getPolicyStatusClass(status: string): string {
    return `status-${status}`;
  }
}
