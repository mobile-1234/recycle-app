import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { DeepSeekAIService } from './deepseek-ai';

export type VoiceCallState = 'idle' | 'connecting' | 'listening' | 'processing' | 'speaking' | 'error';

export interface VoiceCallConfig {
  wsUrl?: string;
  sampleRate?: number;
  vadThreshold?: number;
  silenceTimeout?: number;
  maxRecordingTime?: number;
}

export interface AudioVisualizationData {
  waveform: number[];
  volume: number;
  isSpeaking: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RealtimeVoiceService {
  // AI助手信息
  public readonly aiName = '再生视界AI助手';
  public readonly aiNickname = '小回';

  // 状态管理
  private _callState = new BehaviorSubject<VoiceCallState>('idle');
  private _isMuted = new BehaviorSubject<boolean>(false);
  private _volume = new BehaviorSubject<number>(0);
  private _transcript = new BehaviorSubject<string>('');
  private _aiResponse = new BehaviorSubject<string>('');
  private _visualizationData = new BehaviorSubject<AudioVisualizationData>({
    waveform: [],
    volume: 0,
    isSpeaking: false
  });

  public callState$ = this._callState.asObservable();
  public isMuted$ = this._isMuted.asObservable();
  public volume$ = this._volume.asObservable();
  public transcript$ = this._transcript.asObservable();
  public aiResponse$ = this._aiResponse.asObservable();
  public visualizationData$ = this._visualizationData.asObservable();

  // 事件
  public onCallStart = new Subject<void>();
  public onCallEnd = new Subject<void>();
  public onError = new Subject<string>();
  public onTranscriptUpdate = new Subject<string>();
  public onAIResponseStart = new Subject<void>();
  public onAIResponseEnd = new Subject<void>();

  // 音频相关
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private analyserNode: AnalyserNode | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private processorNode: ScriptProcessorNode | null = null;
  private gainNode: GainNode | null = null;

  // WebSocket
  private websocket: WebSocket | null = null;
  private wsUrl = 'wss://api.example.com/voice-chat'; // 需要配置实际的WebSocket地址

  // VAD (语音活动检测)
  private vadThreshold = 0.02; // 音量阈值
  private silenceTimeout = 2000; // 静音超时(ms) - 增加到2秒避免误判
  private silenceTimer: any = null;
  private isSpeaking = false;
  private speechStartTime = 0;

  // 音频缓冲
  private audioBuffer: Float32Array[] = [];
  private isRecording = false;

  // 配置
  private config: VoiceCallConfig = {
    sampleRate: 16000,
    vadThreshold: 0.02,
    silenceTimeout: 2000,
    maxRecordingTime: 60000
  };

  // 语音合成
  private synthesis: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private preferredVoice: SpeechSynthesisVoice | null = null;

  // Web Speech API 识别
  private recognition: any = null;
  private isRecognitionPaused = false; // 控制识别暂停
  private lastProcessedText = ''; // 防止重复处理
  private processingLock = false; // 处理锁，防止并发

  // 动画帧
  private animationFrameId: number | null = null;

  // AI服务
  private deepSeekService: DeepSeekAIService | null = null;

  constructor() {
    this.initSpeechServices();
  }

  /**
   * 设置AI服务（由组件注入）
   */
  setAIService(service: DeepSeekAIService): void {
    this.deepSeekService = service;
  }

  private initSpeechServices(): void {
    // 初始化语音合成
    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
      // 预加载语音列表
      this.loadPreferredVoice();
      // 语音列表可能异步加载
      this.synthesis.onvoiceschanged = () => {
        this.loadPreferredVoice();
      };
    }

    // 初始化语音识别
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'zh-CN';
      this.recognition.maxAlternatives = 1;
    }
  }

  /**
   * 加载优选的中文语音
   */
  private loadPreferredVoice(): void {
    if (!this.synthesis) return;
    
    const voices = this.synthesis.getVoices();
    // 优先选择女性中文语音，音质更好
    const preferredNames = ['Microsoft Xiaoxiao', 'Xiaoxiao', 'Google 普通话', 'Huihui', 'Yaoyao'];
    
    for (const name of preferredNames) {
      const voice = voices.find(v => v.name.includes(name));
      if (voice) {
        this.preferredVoice = voice;
        console.log('选择语音:', voice.name);
        return;
      }
    }
    
    // 退而求其次，选择任意中文语音
    const chineseVoice = voices.find(v => v.lang.includes('zh-CN') || v.lang.includes('zh_CN'));
    if (chineseVoice) {
      this.preferredVoice = chineseVoice;
      console.log('选择语音:', chineseVoice.name);
    }
  }

  /**
   * 开始语音通话
   */
  async startCall(config?: VoiceCallConfig): Promise<void> {
    if (this._callState.value !== 'idle') {
      console.warn('通话已在进行中');
      return;
    }

    if (config) {
      this.config = { ...this.config, ...config };
    }

    try {
      this._callState.next('connecting');

      // 获取麦克风权限
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: this.config.sampleRate
        }
      });

      // 初始化音频上下文
      this.audioContext = new AudioContext({
        sampleRate: this.config.sampleRate
      });

      // 创建音频节点
      this.setupAudioNodes();

      // 启动语音识别
      this.startSpeechRecognition();

      // 启动可视化
      this.startVisualization();

      this._callState.next('listening');
      this.onCallStart.next();

    } catch (error: any) {
      console.error('启动通话失败:', error);
      this._callState.next('error');
      this.onError.next(error.message || '无法访问麦克风');
      throw error;
    }
  }

  /**
   * 结束语音通话
   */
  endCall(): void {
    // 先设置状态为idle，防止onend事件中重启识别
    this._callState.next('idle');
    this.isRecognitionPaused = true;
    this.processingLock = false;

    // 停止语音识别
    if (this.recognition) {
      try {
        // 移除事件监听器，防止重启
        this.recognition.onend = null;
        this.recognition.onresult = null;
        this.recognition.onerror = null;
        this.recognition.stop();
      } catch (e) {
        console.warn('停止语音识别时出错:', e);
      }
    }

    // 停止语音合成
    if (this.synthesis) {
      this.synthesis.cancel();
    }

    // 停止可视化
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // 关闭音频节点
    if (this.processorNode) {
      this.processorNode.disconnect();
      this.processorNode = null;
    }
    if (this.analyserNode) {
      this.analyserNode.disconnect();
      this.analyserNode = null;
    }
    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }
    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }

    // 关闭音频上下文
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    // 停止媒体流
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    // 关闭WebSocket
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }

    // 清理定时器
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }

    // 重置状态
    this.audioBuffer = [];
    this.isRecording = false;
    this.isSpeaking = false;
    this._transcript.next('');
    this._aiResponse.next('');
    this._callState.next('idle');
    this._volume.next(0);
    this._visualizationData.next({
      waveform: [],
      volume: 0,
      isSpeaking: false
    });

    this.onCallEnd.next();
  }

  /**
   * 切换静音
   */
  toggleMute(): void {
    const newMuted = !this._isMuted.value;
    this._isMuted.next(newMuted);

    if (this.mediaStream) {
      this.mediaStream.getAudioTracks().forEach(track => {
        track.enabled = !newMuted;
      });
    }
  }

  /**
   * 设置音量
   */
  setVolume(volume: number): void {
    if (this.gainNode && this.audioContext) {
      this.gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    }
  }

  /**
   * 设置音频节点
   */
  private setupAudioNodes(): void {
    if (!this.audioContext || !this.mediaStream) return;

    // 创建源节点
    this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);

    // 创建分析器节点（用于可视化和VAD）
    this.analyserNode = this.audioContext.createAnalyser();
    this.analyserNode.fftSize = 256;
    this.analyserNode.smoothingTimeConstant = 0.8;

    // 创建增益节点
    this.gainNode = this.audioContext.createGain();

    // 创建处理器节点（用于捕获音频数据）
    this.processorNode = this.audioContext.createScriptProcessor(4096, 1, 1);
    this.processorNode.onaudioprocess = (event) => {
      if (this.isRecording && !this._isMuted.value) {
        const inputData = event.inputBuffer.getChannelData(0);
        this.audioBuffer.push(new Float32Array(inputData));
      }
    };

    // 连接节点
    this.sourceNode.connect(this.analyserNode);
    this.analyserNode.connect(this.gainNode);
    this.gainNode.connect(this.processorNode);
    this.processorNode.connect(this.audioContext.destination);
  }

  /**
   * 启动可视化
   */
  private startVisualization(): void {
    if (!this.analyserNode) return;

    const bufferLength = this.analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateVisualization = () => {
      if (!this.analyserNode) return;

      this.analyserNode.getByteFrequencyData(dataArray);

      // 计算音量
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const volume = sum / bufferLength / 255;
      this._volume.next(volume);

      // VAD检测
      this.detectVoiceActivity(volume);

      // 生成波形数据
      const waveform = Array.from(dataArray).map(v => v / 255);

      this._visualizationData.next({
        waveform,
        volume,
        isSpeaking: this.isSpeaking
      });

      this.animationFrameId = requestAnimationFrame(updateVisualization);
    };

    updateVisualization();
  }

  /**
   * VAD语音活动检测
   */
  private detectVoiceActivity(volume: number): void {
    const threshold = this.config.vadThreshold || 0.02;

    if (volume > threshold) {
      // 检测到说话
      if (!this.isSpeaking) {
        this.isSpeaking = true;
        this.speechStartTime = Date.now();
        this.isRecording = true;
        console.log('检测到语音开始');
      }

      // 重置静音计时器
      if (this.silenceTimer) {
        clearTimeout(this.silenceTimer);
        this.silenceTimer = null;
      }
    } else if (this.isSpeaking) {
      // 静音检测
      if (!this.silenceTimer) {
        this.silenceTimer = setTimeout(() => {
          this.isSpeaking = false;
          this.isRecording = false;
          console.log('检测到语音结束');
          this.onSpeechEnd();
        }, this.config.silenceTimeout || 1500);
      }
    }
  }

  /**
   * 用户说话结束处理
   */
  private onSpeechEnd(): void {
    // 这里可以发送音频数据到服务器
    // 或者使用Web Speech API的结果
    if (this.audioBuffer.length > 0) {
      console.log('音频数据已收集，共', this.audioBuffer.length, '个片段');
      this.audioBuffer = [];
    }
  }

  /**
   * 暂停语音识别（AI说话时调用）
   */
  private pauseRecognition(): void {
    this.isRecognitionPaused = true;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
  }

  /**
   * 恢复语音识别（AI说话结束后调用）
   */
  private resumeRecognition(): void {
    this.isRecognitionPaused = false;
    if (this.recognition && this._callState.value !== 'idle') {
      try {
        this.recognition.start();
      } catch (e) {
        console.warn('恢复语音识别失败');
      }
    }
  }

  /**
   * 启动语音识别
   */
  private startSpeechRecognition(): void {
    if (!this.recognition) {
      console.warn('语音识别不可用');
      return;
    }

    this.recognition.onresult = (event: any) => {
      // 如果识别已暂停（AI正在说话），忽略结果
      if (this.isRecognitionPaused || this._callState.value === 'speaking' || this._callState.value === 'processing') {
        return;
      }

      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      const currentTranscript = finalTranscript || interimTranscript;
      
      // 只有在聆听状态才更新转写
      if (this._callState.value === 'listening') {
        this._transcript.next(currentTranscript);
        this.onTranscriptUpdate.next(currentTranscript);
      }

      // 如果是最终结果且不是重复的，触发AI回复
      if (finalTranscript && finalTranscript !== this.lastProcessedText && !this.processingLock) {
        this.lastProcessedText = finalTranscript;
        this.processUserSpeech(finalTranscript);
      }
    };

    this.recognition.onerror = (event: any) => {
      // 忽略常见的非致命错误
      if (event.error === 'no-speech' || event.error === 'aborted') {
        return;
      }
      console.error('语音识别错误:', event.error);
      this.onError.next(`语音识别错误: ${event.error}`);
    };

    this.recognition.onend = () => {
      // 如果通话仍在进行且没有暂停，重新启动识别
      if (this._callState.value !== 'idle' && !this.isRecognitionPaused) {
        setTimeout(() => {
          if (this._callState.value !== 'idle' && !this.isRecognitionPaused) {
            try {
              this.recognition.start();
            } catch (e) {
              console.warn('重启语音识别失败');
            }
          }
        }, 100);
      }
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.error('启动语音识别失败:', e);
    }
  }

  /**
   * 处理用户语音输入
   */
  private async processUserSpeech(text: string): Promise<void> {
    if (!text.trim() || this.processingLock) return;

    // 设置处理锁，防止并发
    this.processingLock = true;
    
    console.log('用户说:', text);
    
    // 暂停语音识别，防止识别到AI的回复
    this.pauseRecognition();
    
    this._callState.next('processing');
    this.onAIResponseStart.next();

    try {
      // 这里调用AI服务获取回复
      const response = await this.getAIResponse(text);
      
      this._aiResponse.next(response);
      this._callState.next('speaking');

      // 语音合成播放回复
      await this.speakResponse(response);

      // 播放完成后恢复识别
      this._callState.next('listening');
      this._transcript.next(''); // 清空转写文本
      this.onAIResponseEnd.next();

    } catch (error: any) {
      // "interrupted" 不是真正的错误，只是被打断了
      if (error.message !== 'interrupted') {
        console.error('AI回复失败:', error);
      }
      this._callState.next('listening');
    } finally {
      // 延迟恢复识别，给系统一点缓冲时间
      setTimeout(() => {
        this.processingLock = false;
        this.resumeRecognition();
      }, 500);
    }
  }

  /**
   * 获取AI回复（调用DeepSeek API）
   */
  private async getAIResponse(userText: string): Promise<string> {
    // 如果有配置AI服务，调用真实AI
    if (this.deepSeekService && this.deepSeekService.isConfigured()) {
      try {
        console.log('调用DeepSeek AI获取回复...');
        const response = await this.deepSeekService.sendMessage(userText);
        console.log('AI回复:', response);
        return response;
      } catch (error: any) {
        console.error('DeepSeek API调用失败:', error);
        // 如果API调用失败，使用备用回复
        return this.getFallbackResponse(userText);
      }
    }
    
    // 没有配置AI服务时使用备用回复
    return this.getFallbackResponse(userText);
  }

  /**
   * 备用回复（当AI服务不可用时）
   */
  private getFallbackResponse(userText: string): string {
    // 小回的回复风格：亲切、活泼、专业
    const responses: { [key: string]: string } = {
      '你好': `你好呀！我是${this.aiNickname}，${this.aiName}的语音助手。有什么可以帮你的吗？`,
      '小回': `我在呢！我是${this.aiNickname}，很高兴为你服务！`,
      '什么可以回收': '常见的可回收物有很多哦！比如纸张、塑料瓶、金属罐、玻璃瓶、旧衣物等等。你想了解哪种物品呢？',
      '预约回收': '好的，我来帮你预约上门回收服务。请问你方便的时间是什么时候呢？',
      '附近站点': '让我帮你查一下附近的回收站点。请问你现在在哪个位置呀？',
      '塑料': '塑料制品大部分是可以回收的，比如饮料瓶、洗衣液瓶等。但要注意，塑料袋和一次性餐具通常不太好回收哦。',
      '纸': '纸张是很好的可回收物！报纸、书本、纸箱都可以回收。但要注意，沾了油污的纸巾和餐巾纸就不行了。',
      '电池': '电池属于有害垃圾，需要专门投放到有害垃圾桶里，千万不要随便扔哦！',
      '价格': '回收价格会根据市场行情变化。你想查询什么物品的回收价格呢？我可以帮你查一下。'
    };

    // 简单匹配
    for (const key of Object.keys(responses)) {
      if (userText.includes(key)) {
        return responses[key];
      }
    }

    return `好的，我收到了你的问题："${userText}"。让我来帮你解答。`;
  }

  /**
   * 语音合成播放回复
   */
  private speakResponse(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('语音合成不可用'));
        return;
      }

      // 取消之前的播放
      this.synthesis.cancel();

      this.currentUtterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance.lang = 'zh-CN';
      this.currentUtterance.rate = 0.95; // 稍微慢一点，更自然
      this.currentUtterance.pitch = 1.1; // 稍微高一点，更甜美
      this.currentUtterance.volume = 1.0;

      // 使用预选的语音
      if (this.preferredVoice) {
        this.currentUtterance.voice = this.preferredVoice;
      }

      this.currentUtterance.onend = () => {
        resolve();
      };

      this.currentUtterance.onerror = (event) => {
        // "interrupted" 是正常的打断，不算错误
        if (event.error === 'interrupted') {
          resolve(); // 打断时正常返回
        } else {
          reject(new Error(event.error));
        }
      };

      this.synthesis.speak(this.currentUtterance);
    });
  }

  /**
   * 中断AI说话
   */
  interruptSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
    if (this._callState.value === 'speaking') {
      this._callState.next('listening');
    }
  }

  /**
   * 获取当前状态
   */
  get callState(): VoiceCallState {
    return this._callState.value;
  }

  get isMuted(): boolean {
    return this._isMuted.value;
  }

  get isInCall(): boolean {
    return this._callState.value !== 'idle' && this._callState.value !== 'error';
  }
}
