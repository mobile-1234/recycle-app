import { Injectable } from '@angular/core';
import OpenAI from 'openai';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface DeepSeekConfig {
  apiKey: string;
  baseURL?: string;
  model?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DeepSeekAIService {
  private openai: OpenAI | null = null;
  private model = 'deepseek-chat';
  private conversationHistory: ChatMessage[] = [];
  private systemPrompt = `你是一个专业的回收行业AI运营助手。你的职责是：
1. 帮助企业分析回收数据，提供数据洞察
2. 预测回收量趋势，优化运营策略
3. 监控设备运行状态，提供维护建议
4. 分析财务数据，提供收入优化建议
5. 推荐适合的政策补贴
6. 优化人员调度和路线规划

回答要求：
- 使用清晰的结构化内容
- 用适当的表情符号增强可读性（如 📊 📈 💰 ⚙️ 等）
- 重要数据用具体数字表示
- 提供可执行的建议
- 语气专业、友好、简洁
- 避免使用 Markdown 格式符号（如 **、###、\`\`\`等），直接用自然文本表达
- 使用数字列表（1. 2. 3.）和要点（• 或 -）来组织内容
- 金额使用 ¥ 符号，百分比使用 % 符号`;

  constructor() {
    this.initializeClient();
  }

  /**
   * 初始化 DeepSeek 客户端
   */
  private initializeClient() {
    // 从环境变量或配置中获取 API Key
    const apiKey = this.getApiKey();
    
    if (!apiKey) {
      console.warn('DeepSeek API Key 未配置，将使用模拟模式');
      return;
    }

    try {
      this.openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // 允许在浏览器中使用（生产环境建议通过后端代理）
      });
      
      // 初始化对话历史，添加系统提示
      this.conversationHistory = [
        { role: 'system', content: this.systemPrompt }
      ];
      
      console.log('DeepSeek AI 客户端初始化成功');
    } catch (error) {
      console.error('DeepSeek AI 客户端初始化失败:', error);
    }
  }

  /**
   * 获取 API Key
   */
  private getApiKey(): string {
    // 优先从 localStorage 获取（用户配置）
    const storedKey = localStorage.getItem('deepseek_api_key');
    if (storedKey) {
      return storedKey;
    }

    // 默认 API Key（已预配置）
    // 生产环境建议通过环境变量或后端获取
    return 'sk-3ae5d07978a54d369b8e9fb9bc944e78';
  }

  /**
   * 设置 API Key
   */
  setApiKey(apiKey: string) {
    localStorage.setItem('deepseek_api_key', apiKey);
    this.initializeClient();
  }

  /**
   * 检查是否已配置 API Key
   */
  isConfigured(): boolean {
    return this.openai !== null;
  }

  /**
   * 发送消息到 DeepSeek AI
   */
  async sendMessage(userMessage: string): Promise<string> {
    // 如果未配置 API，返回提示
    if (!this.openai) {
      throw new Error('请先配置 DeepSeek API Key');
    }

    try {
      // 添加用户消息到对话历史
      this.conversationHistory.push({
        role: 'user',
        content: userMessage
      });

      // 调用 DeepSeek API
      const completion = await this.openai.chat.completions.create({
        messages: this.conversationHistory,
        model: this.model,
        temperature: 0.7,
        max_tokens: 2000,
        stream: false
      });

      // 获取 AI 回复
      const aiResponse = completion.choices[0]?.message?.content || '抱歉，我现在无法回答。';

      // 添加 AI 回复到对话历史
      this.conversationHistory.push({
        role: 'assistant',
        content: aiResponse
      });

      return aiResponse;
    } catch (error: any) {
      console.error('DeepSeek API 调用失败:', error);
      
      // 处理特定错误
      if (error?.status === 401) {
        throw new Error('API Key 无效，请检查配置');
      } else if (error?.status === 429) {
        throw new Error('请求过于频繁，请稍后再试');
      } else if (error?.status === 500) {
        throw new Error('DeepSeek 服务暂时不可用');
      }
      
      throw new Error('AI 服务异常，请稍后再试');
    }
  }

  /**
   * 流式发送消息（用于实时显示）
   */
  async *sendMessageStream(userMessage: string): AsyncGenerator<string, void, unknown> {
    if (!this.openai) {
      throw new Error('请先配置 DeepSeek API Key');
    }

    try {
      // 添加用户消息到对话历史
      this.conversationHistory.push({
        role: 'user',
        content: userMessage
      });

      // 调用流式 API
      const stream = await this.openai.chat.completions.create({
        messages: this.conversationHistory,
        model: this.model,
        temperature: 0.7,
        max_tokens: 2000,
        stream: true
      });

      let fullResponse = '';

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullResponse += content;
          yield content;
        }
      }

      // 添加完整的 AI 回复到对话历史
      this.conversationHistory.push({
        role: 'assistant',
        content: fullResponse
      });
    } catch (error: any) {
      console.error('DeepSeek 流式 API 调用失败:', error);
      throw new Error('AI 服务异常，请稍后再试');
    }
  }

  /**
   * 清空对话历史
   */
  clearHistory() {
    this.conversationHistory = [
      { role: 'system', content: this.systemPrompt }
    ];
  }

  /**
   * 获取对话历史
   */
  getHistory(): ChatMessage[] {
    return [...this.conversationHistory];
  }

  /**
   * 设置系统提示词
   */
  setSystemPrompt(prompt: string) {
    this.systemPrompt = prompt;
    // 重置对话历史
    this.conversationHistory = [
      { role: 'system', content: prompt }
    ];
  }

  /**
   * 获取模拟响应（当 API Key 未配置时）
   */
  getMockResponse(userMessage: string): string {
    // 这是后备方案，与原有的逻辑类似
    if (userMessage.includes('利润') || userMessage.includes('品类')) {
      return `📊 本月品类利润分析\n\n根据数据分析，纸类回收利润最高：\n\n• 纸类：¥45,820（占比38%）↑12%\n• 塑料：¥32,150（占比28%）↑8%\n• 金属：¥28,900（占比25%）↓3%\n• 玻璃：¥10,600（占比9%）→0%\n\n建议：加大纸类回收力度，优化塑料回收渠道。`;
    } else if (userMessage.includes('预测') || userMessage.includes('回收量')) {
      return `📈 下周回收量预测\n\n基于历史数据和AI算法预测：\n\n• 预计总量：2,850kg\n• 环比增长：+12.5%\n• 置信度：89%\n\n详细预测：\n周一：380kg | 周二：420kg | 周三：390kg\n周四：450kg | 周五：410kg | 周六：420kg | 周日：380kg`;
    } else if (userMessage.includes('设备') || userMessage.includes('效率')) {
      return `⚙️ 3号设备效率分析\n\n• 运行状态：良好 ✅\n• 处理效率：92.5%（高于平均8%）\n• 运行时长：156小时\n• 故障率：0.8%（低）\n\n维护建议：\n1. 本周末安排常规保养\n2. 更换磨损部件（预计费用¥800）\n3. 优化运行参数可提升5%效率`;
    }
    
    return `我理解您的问题了。由于 DeepSeek API Key 未配置，当前为模拟模式。\n\n您的问题：${userMessage}\n\n如需使用真实的 AI 分析，请配置 API Key。`;
  }
}
