import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

export interface VoiceRecognitionResult {
  text: string;
  confidence: number;
}

export interface TTSRequest {
  text: string;
  voice?: string;
  rate?: number;
  pitch?: number;
}

@Injectable({
  providedIn: 'root'
})
export class VoiceService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private audioContext: AudioContext | null = null;
  
  // 状态管理
  private _isRecording = new BehaviorSubject<boolean>(false);
  private _isPlaying = new BehaviorSubject<boolean>(false);
  private _isSpeechSupported = new BehaviorSubject<boolean>(false);
  
  public isRecording$ = this._isRecording.asObservable();
  public isPlaying$ = this._isPlaying.asObservable();
  public isSpeechSupported$ = this._isSpeechSupported.asObservable();
  
  // Web Speech API 支持
  private recognition: any = null;
  private synthesis: SpeechSynthesis | null = null;
  
  // API 端点配置
  private readonly ASR_API_URL = '/api/voice/recognize'; // Whisper ASR endpoint
  private readonly TTS_API_URL = '/api/voice/synthesize'; // Edge TTS endpoint

  constructor(private http: HttpClient) {
    this.initializeSpeechServices();
  }

  private initializeSpeechServices(): void {
    // 检查 Web Speech API 支持
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'zh-CN';
      this._isSpeechSupported.next(true);
    }
    
    // 检查语音合成支持
    if ('speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }
  }

  /**
   * 使用浏览器原生 Web Speech API 进行语音识别
   * 适用于快速原型和简单场景
   */
  startWebSpeechRecognition(): Observable<VoiceRecognitionResult> {
    return new Observable(observer => {
      if (!this.recognition) {
        observer.error(new Error('语音识别不受支持'));
        return;
      }

      this._isRecording.next(true);
      
      this.recognition.onresult = (event: any) => {
        const result = event.results[event.results.length - 1];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence;
        
        if (result.isFinal) {
          observer.next({ text: transcript, confidence });
          observer.complete();
        }
      };

      this.recognition.onerror = (event: any) => {
        this._isRecording.next(false);
        observer.error(new Error(`语音识别错误: ${event.error}`));
      };

      this.recognition.onend = () => {
        this._isRecording.next(false);
      };

      this.recognition.start();

      return () => {
        this.recognition?.stop();
        this._isRecording.next(false);
      };
    });
  }

  /**
   * 停止 Web Speech API 识别
   */
  stopWebSpeechRecognition(): void {
    if (this.recognition) {
      this.recognition.stop();
      this._isRecording.next(false);
    }
  }

  /**
   * 开始录制音频（用于发送到 Whisper API）
   */
  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioChunks = [];
      
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: this.getSupportedMimeType()
      });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(100); // 每100ms收集一次数据
      this._isRecording.next(true);
    } catch (error) {
      console.error('无法访问麦克风:', error);
      throw new Error('无法访问麦克风，请检查权限设置');
    }
  }

  /**
   * 停止录制并返回音频 Blob
   */
  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('没有正在进行的录音'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { 
          type: this.getSupportedMimeType() 
        });
        this._isRecording.next(false);
        
        // 停止所有音轨
        this.mediaRecorder?.stream.getTracks().forEach(track => track.stop());
        
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  /**
   * 发送音频到 Whisper API 进行识别
   */
  async recognizeWithWhisper(audioBlob: Blob): Promise<string> {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('language', 'zh');

    try {
      const response = await this.http.post<{ text: string }>(
        this.ASR_API_URL, 
        formData
      ).toPromise();
      return response?.text || '';
    } catch (error) {
      console.error('Whisper API 调用失败:', error);
      throw new Error('语音识别服务暂时不可用');
    }
  }

  /**
   * 使用 Edge TTS API 合成语音
   */
  async synthesizeWithEdgeTTS(text: string, voice: string = 'zh-CN-XiaoxiaoNeural'): Promise<ArrayBuffer> {
    try {
      const response = await this.http.post(
        this.TTS_API_URL,
        { text, voice },
        { responseType: 'arraybuffer' }
      ).toPromise();
      return response as ArrayBuffer;
    } catch (error) {
      console.error('Edge TTS API 调用失败:', error);
      throw new Error('语音合成服务暂时不可用');
    }
  }

  /**
   * 使用浏览器原生 TTS 朗读文本
   * 作为 Edge TTS 的备用方案
   */
  speakWithWebSpeech(text: string, options?: { rate?: number; pitch?: number; voice?: string }): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('语音合成不受支持'));
        return;
      }

      // 停止当前播放
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = options?.rate || 1;
      utterance.pitch = options?.pitch || 1;

      // 尝试使用中文语音
      const voices = this.synthesis.getVoices();
      const chineseVoice = voices.find(v => v.lang.includes('zh'));
      if (chineseVoice) {
        utterance.voice = chineseVoice;
      }

      utterance.onstart = () => {
        this._isPlaying.next(true);
      };

      utterance.onend = () => {
        this._isPlaying.next(false);
        resolve();
      };

      utterance.onerror = (event) => {
        this._isPlaying.next(false);
        reject(new Error(`语音播放错误: ${event.error}`));
      };

      this.synthesis.speak(utterance);
    });
  }

  /**
   * 播放音频数据
   */
  async playAudio(audioData: ArrayBuffer): Promise<void> {
    try {
      if (!this.audioContext) {
        this.audioContext = new AudioContext();
      }

      const audioBuffer = await this.audioContext.decodeAudioData(audioData);
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);

      this._isPlaying.next(true);

      source.onended = () => {
        this._isPlaying.next(false);
      };

      source.start(0);
    } catch (error) {
      this._isPlaying.next(false);
      console.error('音频播放失败:', error);
      throw new Error('音频播放失败');
    }
  }

  /**
   * 停止当前播放
   */
  stopPlaying(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
    this._isPlaying.next(false);
  }

  /**
   * 获取支持的音频 MIME 类型
   */
  private getSupportedMimeType(): string {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4',
      'audio/wav'
    ];
    
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return 'audio/webm';
  }

  /**
   * 检查麦克风权限
   */
  async checkMicrophonePermission(): Promise<boolean> {
    try {
      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      return result.state === 'granted';
    } catch {
      // 某些浏览器不支持 permissions API
      return true;
    }
  }

  /**
   * 获取录音状态
   */
  get isRecording(): boolean {
    return this._isRecording.value;
  }

  /**
   * 获取播放状态
   */
  get isPlaying(): boolean {
    return this._isPlaying.value;
  }
}
