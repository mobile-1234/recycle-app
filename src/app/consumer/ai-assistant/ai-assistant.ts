import { Component, ElementRef, ViewChild, AfterViewChecked, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DeepSeekAIService } from '../../core/services/deepseek-ai';
import { VoiceService } from '../../core/services/voice.service';
import { FileUploadService, UploadedFile } from '../../core/services/file-upload.service';
import { RealtimeVoiceService, VoiceCallState, AudioVisualizationData } from '../../core/services/realtime-voice.service';
import { Subscription } from 'rxjs';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  isError?: boolean;
  audioUrl?: string;
  attachments?: UploadedFile[]; // 消息附件
}

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './ai-assistant.html',
  styleUrl: './ai-assistant.scss'
})
export class AiAssistant implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @ViewChild('inputField') private inputField!: ElementRef;

  messages: ChatMessage[] = [];
  inputText = '';
  isLoading = false;
  showScrollButton = false;
  private shouldScrollToBottom = true;

  // 语音助手相关属性
  isRecording = false;
  isPlayingAudio = false;
  voiceEnabled = true;
  recordingTime = 0;
  private recordingTimer: any = null;
  private voiceSubscriptions: Subscription[] = [];

  // 文件上传相关属性
  uploadedFiles: UploadedFile[] = [];
  showAttachmentPanel = false;
  isDragging = false;

  // 实时语音通话相关属性
  isInVoiceCall = false;
  voiceCallState: VoiceCallState = 'idle';
  voiceCallMuted = false;
  voiceCallVolume = 0;
  voiceCallTranscript = '';
  voiceCallAIResponse = '';
  voiceVisualizationData: AudioVisualizationData = { waveform: [], volume: 0, isSpeaking: false };
  private voiceCallSubscriptions: Subscription[] = [];

  // 能力卡片（对应头部快捷操作按钮）
  abilities = [
    { name: '识别物品', question: '帮我识别一个可回收物品' },
    { name: '查询价格', question: '查询当前废纸的回收价格' },
    { name: '预约上门', question: '我想预约上门回收服务' },
    { name: '附近站点', question: '查找附近的回收投递点' },
    { name: '环保知识', question: '介绍一些环保回收知识' }
  ];

  constructor(
    private router: Router,
    private deepSeekService: DeepSeekAIService,
    private cdr: ChangeDetectorRef,
    private voiceService: VoiceService,
    public fileUploadService: FileUploadService,
    private realtimeVoiceService: RealtimeVoiceService
  ) {}

  ngOnInit(): void {
    this.deepSeekService.setSystemPrompt(`你是"小回"，再生视界AI助手的语音助手，专门为普通用户提供回收相关的服务。

你的性格特点：
- 亲切、活泼、热情，像一个贴心的朋友
- 专业但不死板，用通俗易懂的语言解释
- 有耐心，善于倾听用户需求

回复要求：
1. 回复要简洁，适合语音朗读（控制在100字以内为佳）
2. 不要使用任何Markdown格式、特殊符号或表情
3. 语气自然口语化，像真人对话
4. 遇到不确定的问题，诚实告知并提供建议
5. 可以适当使用语气词如"嗯"、"好的"、"没问题"等

你可以帮助用户：
- 识别和分类可回收物品
- 查询回收价格
- 预约上门回收服务
- 查找附近回收站点
- 解答环保回收知识`);
    this.addWelcomeMessage();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
    }
  }

  ngOnDestroy(): void {
    this.stopRecording();
    this.voiceService.stopPlaying();
    this.voiceSubscriptions.forEach(sub => sub.unsubscribe());
    if (this.recordingTimer) {
      clearInterval(this.recordingTimer);
    }
  }

  private addWelcomeMessage(): void {
    const welcomeContent = `你好！我是小回，再生视界AI助手，随时为你服务。你可以直接输入问题、语音提问，或点击上方快捷按钮。`;

    this.messages.push({
      id: this.generateId(),
      role: 'assistant',
      content: welcomeContent,
      timestamp: new Date(),
      isStreaming: false
    });
  }

  goHome(): void {
    this.router.navigate(['/consumer/home']);
  }

  async sendMessage(): Promise<void> {
    const text = this.inputText.trim();
    const hasAttachments = this.uploadedFiles.length > 0;
    
    if ((!text && !hasAttachments) || this.isLoading) return;

    // 构建包含附件上下文的消息
    let messageContent = text;
    const currentAttachments = [...this.uploadedFiles];
    
    // 如果有附件，添加附件上下文
    if (hasAttachments) {
      const attachmentContext = this.fileUploadService.buildAttachmentContext();
      messageContent = text + attachmentContext;
    }

    this.messages.push({
      id: this.generateId(),
      role: 'user',
      content: text || '请分析我上传的附件',
      timestamp: new Date(),
      attachments: hasAttachments ? currentAttachments : undefined
    });

    this.inputText = '';
    this.uploadedFiles = [];
    this.fileUploadService.clearFiles();
    this.showAttachmentPanel = false;
    this.shouldScrollToBottom = true;
    this.isLoading = true;

    const assistantMessage: ChatMessage = {
      id: this.generateId(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true
    };
    this.messages.push(assistantMessage);
    this.cdr.detectChanges();
    this.scrollToBottom();

    try {
      let fullContent = '';
      const stream = this.deepSeekService.sendMessageStream(messageContent);

      for await (const chunk of stream) {
        fullContent += chunk;
        assistantMessage.content = fullContent;
        this.cdr.detectChanges();
        
        // 在流式输出过程中，只有当 shouldScrollToBottom 为 true 时才滚动
        if (this.shouldScrollToBottom) {
          this.scrollToBottom();
        }
      }

      assistantMessage.isStreaming = false;
    } catch (error: any) {
      console.error('AI回复失败:', error);
      assistantMessage.content = '抱歉，我现在遇到了一些问题 😅\n\n请稍后再试，或者换个问题问我吧！';
      assistantMessage.isStreaming = false;
      assistantMessage.isError = true;
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  useAbility(ability: any): void {
    this.inputText = ability.question;
    this.sendMessage();
  }

  clearChat(): void {
    this.messages = [];
    this.deepSeekService.clearHistory();
    this.addWelcomeMessage();
  }

  stopGeneration(): void {
    this.isLoading = false;
    const lastMessage = this.messages[this.messages.length - 1];
    if (lastMessage && lastMessage.isStreaming) {
      lastMessage.isStreaming = false;
      lastMessage.content += '\n\n[已停止生成]';
    }
  }

  copyMessage(message: ChatMessage): void {
    navigator.clipboard.writeText(message.content).then(() => {
      console.log('已复制到剪贴板');
    });
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        const element = this.messagesContainer.nativeElement;
        // 使用 setTimeout 确保 DOM 更新后再滚动
        setTimeout(() => {
          element.scrollTop = element.scrollHeight;
        }, 0);
      }
    } catch (err) {}
  }

  onScroll(event: any): void {
    const element = event.target;
    const atBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 50;
    this.showScrollButton = !atBottom;
    // 更新自动滚动状态：只有当用户在底部时才启用自动滚动
    this.shouldScrollToBottom = atBottom;
  }

  scrollToBottomClick(): void {
    this.shouldScrollToBottom = true;
    this.scrollToBottom();
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  trackByMessageId(index: number, message: ChatMessage): string {
    return message.id;
  }

  askQuestion(question: string): void {
    this.inputText = question;
    this.sendMessage();
  }

  formatMessage(content: string): string {
    if (!content) return '';
    
    let formatted = content;
    
    // 1. 处理关键词添加图标 (个性化输出)
    const iconMap: { [key: string]: string } = {
      '可回收': '♻️',
      '有害垃圾': '☠️',
      '厨余垃圾': '🥬',
      '其他垃圾': '🗑️',
      '价格': '💰',
      '预约': '📅',
      '站点': '📍',
      '注意': '⚠️',
      '提示': '💡',
      '玻璃': '🍾',
      '金属': '🔧',
      '塑料': '🥤',
      '纸': '📄',
      '织物': '👕',
      '电子': '🔋'
    };

    Object.keys(iconMap).forEach(key => {
      // 使用正则替换，避免重复添加
      const regex = new RegExp(`(?<!${iconMap[key]}\\s)${key}`, 'g');
      formatted = formatted.replace(regex, `${iconMap[key]} ${key}`);
    });
    
    // 2. 处理换行符，确保段落间距
    formatted = formatted.replace(/\n\n/g, '</p><p>');
    formatted = formatted.replace(/\n/g, '<br>');
    
    // 3. 处理数字列表 (1. 2. 3.)
    formatted = formatted.replace(/(\d+)\.\s+([^\n<]+)/g, '<div class="list-item"><span class="list-number">$1.</span> <span class="list-content">$2</span></div>');
    
    // 4. 处理表情符号，给它们添加样式
    formatted = formatted.replace(/([\u{1F300}-\u{1F9FF}])/gu, '<span class="emoji">$1</span>');
    
    // 5. 关键词高亮
    formatted = formatted.replace(/(温馨提示|注意|建议|例如|特别说明)：/g, '<span class="highlight-title">$1：</span>');

    // 包裹在段落标签中
    if (!formatted.includes('<p>') && !formatted.includes('<div')) {
      formatted = '<p>' + formatted + '</p>';
    }
    
    return formatted;
  }

  // ==================== 语音助手功能 ====================

  /**
   * 切换语音输入（开始/停止录音）
   */
  async toggleVoiceInput(): Promise<void> {
    if (this.isRecording) {
      await this.stopRecording();
    } else {
      await this.startRecording();
    }
  }

  /**
   * 开始语音录制
   */
  async startRecording(): Promise<void> {
    try {
      // 使用 Web Speech API 进行实时语音识别
      this.isRecording = true;
      this.recordingTime = 0;
      this.cdr.detectChanges();

      // 开始计时
      this.recordingTimer = setInterval(() => {
        this.recordingTime++;
        this.cdr.detectChanges();
      }, 1000);

      // 使用 Web Speech API
      const sub = this.voiceService.startWebSpeechRecognition().subscribe({
        next: (result) => {
          this.inputText = result.text;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('语音识别错误:', error);
          this.showVoiceError('语音识别失败，请重试');
          this.stopRecordingUI();
        },
        complete: () => {
          this.stopRecordingUI();
          // 如果识别到文本，自动发送
          if (this.inputText.trim()) {
            this.sendMessage();
          }
        }
      });

      this.voiceSubscriptions.push(sub);
    } catch (error) {
      console.error('启动录音失败:', error);
      this.showVoiceError('无法访问麦克风');
      this.stopRecordingUI();
    }
  }

  /**
   * 停止语音录制
   */
  async stopRecording(): Promise<void> {
    this.voiceService.stopWebSpeechRecognition();
    this.stopRecordingUI();
  }

  /**
   * 停止录音UI更新
   */
  private stopRecordingUI(): void {
    this.isRecording = false;
    if (this.recordingTimer) {
      clearInterval(this.recordingTimer);
      this.recordingTimer = null;
    }
    this.recordingTime = 0;
    this.cdr.detectChanges();
  }

  /**
   * 播放AI回复语音
   */
  async playMessageAudio(message: ChatMessage): Promise<void> {
    if (this.isPlayingAudio) {
      this.voiceService.stopPlaying();
      this.isPlayingAudio = false;
      this.cdr.detectChanges();
      return;
    }

    try {
      this.isPlayingAudio = true;
      this.cdr.detectChanges();

      // 清理HTML标签，只保留纯文本
      const plainText = message.content
        .replace(/<[^>]*>/g, '')
        .replace(/\[已停止生成\]/g, '')
        .trim();

      // 使用浏览器原生TTS（作为Edge TTS的备用方案）
      await this.voiceService.speakWithWebSpeech(plainText, {
        rate: 1.0,
        pitch: 1.0
      });

      this.isPlayingAudio = false;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('语音播放失败:', error);
      this.isPlayingAudio = false;
      this.cdr.detectChanges();
    }
  }

  /**
   * 切换语音回复功能
   */
  toggleVoiceEnabled(): void {
    this.voiceEnabled = !this.voiceEnabled;
  }

  /**
   * 显示语音错误提示
   */
  private showVoiceError(message: string): void {
    // 可以通过添加一个临时消息或toast来显示错误
    console.error(message);
  }

  /**
   * 格式化录音时间显示
   */
  formatRecordingTime(): string {
    const minutes = Math.floor(this.recordingTime / 60);
    const seconds = this.recordingTime % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  // ==================== 文件上传功能 ====================

  /**
   * 切换附件面板显示
   */
  toggleAttachmentPanel(): void {
    this.showAttachmentPanel = !this.showAttachmentPanel;
  }

  /**
   * 触发文件选择
   */
  triggerFileInput(): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = '.pdf,.doc,.docx,.txt,.md,.jpg,.jpeg,.png,.gif,.webp,.xls,.xlsx,.csv,.ppt,.pptx';
    fileInput.onchange = (event: any) => {
      const files = event.target.files;
      if (files) {
        this.handleFiles(files);
      }
    };
    fileInput.click();
  }

  /**
   * 处理文件选择
   */
  async handleFiles(files: FileList): Promise<void> {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const uploadedFile = this.fileUploadService.addFile(file);
      if (uploadedFile) {
        this.uploadedFiles.push(uploadedFile);
        // 本地处理文件
        await this.fileUploadService.processFileLocally(uploadedFile);
        this.cdr.detectChanges();
      }
    }
    this.showAttachmentPanel = true;
  }

  /**
   * 移除已上传的文件
   */
  removeUploadedFile(file: UploadedFile): void {
    this.uploadedFiles = this.uploadedFiles.filter(f => f.id !== file.id);
    this.fileUploadService.removeFile(file.id);
  }

  /**
   * 拖拽进入
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  /**
   * 拖拽离开
   */
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  /**
   * 拖拽放置
   */
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFiles(files);
    }
  }

  /**
   * 获取文件图标
   */
  getFileIcon(type: string): string {
    return this.fileUploadService.getFileIcon(type);
  }

  /**
   * 格式化文件大小
   */
  formatFileSize(bytes: number): string {
    return this.fileUploadService.formatFileSize(bytes);
  }

  // ==================== 实时语音通话功能 ====================

  /**
   * 开始语音通话
   */
  async startVoiceCall(): Promise<void> {
    try {
      // 注入AI服务到语音服务，使语音通话能获取真实AI回复
      this.realtimeVoiceService.setAIService(this.deepSeekService);
      
      // 订阅语音通话状态
      this.subscribeToVoiceCallEvents();
      
      await this.realtimeVoiceService.startCall();
      this.isInVoiceCall = true;
      this.cdr.detectChanges();
    } catch (error: any) {
      console.error('启动语音通话失败:', error);
      this.isInVoiceCall = false;
    }
  }

  /**
   * 结束语音通话
   */
  endVoiceCall(): void {
    this.realtimeVoiceService.endCall();
    this.isInVoiceCall = false;
    this.voiceCallState = 'idle';
    this.voiceCallTranscript = '';
    this.voiceCallAIResponse = '';
    this.unsubscribeVoiceCallEvents();
    this.cdr.detectChanges();
  }

  /**
   * 切换语音通话静音
   */
  toggleVoiceCallMute(): void {
    this.realtimeVoiceService.toggleMute();
  }

  /**
   * 中断AI说话
   */
  interruptAISpeaking(): void {
    this.realtimeVoiceService.interruptSpeaking();
  }

  /**
   * 订阅语音通话事件
   */
  private subscribeToVoiceCallEvents(): void {
    // 订阅通话状态
    this.voiceCallSubscriptions.push(
      this.realtimeVoiceService.callState$.subscribe(state => {
        this.voiceCallState = state;
        this.cdr.detectChanges();
      })
    );

    // 订阅静音状态
    this.voiceCallSubscriptions.push(
      this.realtimeVoiceService.isMuted$.subscribe(muted => {
        this.voiceCallMuted = muted;
        this.cdr.detectChanges();
      })
    );

    // 订阅音量
    this.voiceCallSubscriptions.push(
      this.realtimeVoiceService.volume$.subscribe(volume => {
        this.voiceCallVolume = volume;
        this.cdr.detectChanges();
      })
    );

    // 订阅转写文本
    this.voiceCallSubscriptions.push(
      this.realtimeVoiceService.transcript$.subscribe(transcript => {
        this.voiceCallTranscript = transcript;
        this.cdr.detectChanges();
      })
    );

    // 订阅AI回复
    this.voiceCallSubscriptions.push(
      this.realtimeVoiceService.aiResponse$.subscribe(response => {
        this.voiceCallAIResponse = response;
        this.cdr.detectChanges();
      })
    );

    // 订阅可视化数据
    this.voiceCallSubscriptions.push(
      this.realtimeVoiceService.visualizationData$.subscribe(data => {
        this.voiceVisualizationData = data;
        this.cdr.detectChanges();
      })
    );

    // 订阅AI回复结束事件，将对话添加到聊天记录
    this.voiceCallSubscriptions.push(
      this.realtimeVoiceService.onAIResponseEnd.subscribe(() => {
        if (this.voiceCallTranscript && this.voiceCallAIResponse) {
          // 添加用户消息
          this.messages.push({
            id: this.generateId(),
            role: 'user',
            content: this.voiceCallTranscript,
            timestamp: new Date()
          });
          // 添加AI回复
          this.messages.push({
            id: this.generateId(),
            role: 'assistant',
            content: this.voiceCallAIResponse,
            timestamp: new Date()
          });
          this.voiceCallTranscript = '';
          this.voiceCallAIResponse = '';
          this.cdr.detectChanges();
          this.scrollToBottom();
        }
      })
    );
  }

  /**
   * 取消订阅语音通话事件
   */
  private unsubscribeVoiceCallEvents(): void {
    this.voiceCallSubscriptions.forEach(sub => sub.unsubscribe());
    this.voiceCallSubscriptions = [];
  }

  /**
   * 获取通话状态文本
   */
  getVoiceCallStateText(): string {
    const stateTexts: { [key: string]: string } = {
      'idle': '小回准备就绪',
      'connecting': '正在连接小回...',
      'listening': '小回正在聆听...',
      'processing': '小回正在思考...',
      'speaking': '小回正在回复...',
      'error': '连接出错'
    };
    return stateTexts[this.voiceCallState] || '未知状态';
  }

  /**
   * 获取通话状态图标
   */
  getVoiceCallStateIcon(): string {
    const stateIcons: { [key: string]: string } = {
      'idle': '🎙️',
      'connecting': '🔄',
      'listening': '👂',
      'processing': '🤔',
      'speaking': '🗣️',
      'error': '❌'
    };
    return stateIcons[this.voiceCallState] || '❓';
  }

  /**
   * 计算音量条高度
   */
  getVolumeBarHeight(index: number): number {
    const baseHeight = 20;
    const volumeEffect = this.voiceCallVolume * 80;
    const variation = 1 + Math.sin(index * 0.5) * 0.3;
    return baseHeight + volumeEffect * variation;
  }
}
