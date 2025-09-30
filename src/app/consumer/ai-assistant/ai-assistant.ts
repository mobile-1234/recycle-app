import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './ai-assistant.html',
  styleUrl: './ai-assistant.scss'
})
export class AiAssistant {
  // 简易对话数据
  messages: { role: 'user' | 'assistant'; text: string }[] = [
    { role: 'assistant', text: '你好！我是AI回收助手，很高兴为你服务～' }
  ];

  inputText = '';
  isRecording = false;

  constructor(private router: Router) {}

  // 返回首页
  goHome(): void {
    this.router.navigate(['/consumer/home']);
  }

  // 发送消息
  sendMessage(): void {
    const text = this.inputText.trim();
    if (!text) return;
    this.messages.push({ role: 'user', text });
    this.inputText = '';
    // 简易应答，占位逻辑
    setTimeout(() => {
      this.messages.push({ role: 'assistant', text: '已收到你的问题：' + text + '，我来帮你处理～' });
    }, 300);
  }

  // 快速提问
  askQuickQuestion(text: string): void {
    this.messages.push({ role: 'user', text });
    setTimeout(() => {
      this.messages.push({ role: 'assistant', text: '这是关于“' + text + '”的建议与说明...' });
    }, 300);
  }

  // 语音录制占位
  startRecording(): void {
    this.isRecording = true;
  }

  stopRecording(): void {
    this.isRecording = false;
    // 占位：结束录音后填充识别文本
    this.inputText = this.inputText || '（语音已转换为文本占位）';
  }
}
