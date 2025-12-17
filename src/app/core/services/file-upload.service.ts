import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpProgressEvent } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  thumbnail?: string;
  status: 'pending' | 'uploading' | 'processing' | 'ready' | 'error';
  progress: number;
  extractedText?: string;
  error?: string;
  file?: File;
}

export interface FileProcessingResult {
  success: boolean;
  text?: string;
  summary?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  // 支持的文件类型
  private readonly SUPPORTED_TYPES = {
    document: ['.pdf', '.doc', '.docx', '.txt', '.md', '.rtf'],
    image: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'],
    spreadsheet: ['.xls', '.xlsx', '.csv'],
    presentation: ['.ppt', '.pptx']
  };

  private readonly MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

  // 文件上传状态
  private _uploadedFiles = new BehaviorSubject<UploadedFile[]>([]);
  public uploadedFiles$ = this._uploadedFiles.asObservable();

  // API 端点
  private readonly UPLOAD_API = '/api/files/upload';
  private readonly PROCESS_API = '/api/files/process';

  constructor(private http: HttpClient) {}

  /**
   * 获取当前上传的文件列表
   */
  get uploadedFiles(): UploadedFile[] {
    return this._uploadedFiles.value;
  }

  /**
   * 验证文件类型和大小
   */
  validateFile(file: File): { valid: boolean; error?: string } {
    // 检查文件大小
    if (file.size > this.MAX_FILE_SIZE) {
      return { valid: false, error: `文件大小超过限制（最大 ${this.MAX_FILE_SIZE / 1024 / 1024}MB）` };
    }

    // 检查文件类型
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    const allSupported = [
      ...this.SUPPORTED_TYPES.document,
      ...this.SUPPORTED_TYPES.image,
      ...this.SUPPORTED_TYPES.spreadsheet,
      ...this.SUPPORTED_TYPES.presentation
    ];

    if (!allSupported.includes(extension)) {
      return { valid: false, error: `不支持的文件类型: ${extension}` };
    }

    return { valid: true };
  }

  /**
   * 添加文件到待上传列表
   */
  addFile(file: File): UploadedFile | null {
    const validation = this.validateFile(file);
    if (!validation.valid) {
      console.error(validation.error);
      return null;
    }

    const uploadedFile: UploadedFile = {
      id: this.generateId(),
      name: file.name,
      size: file.size,
      type: this.getFileCategory(file),
      status: 'pending',
      progress: 0,
      file: file
    };

    // 为图片生成缩略图
    if (uploadedFile.type === 'image') {
      this.generateThumbnail(file).then(thumbnail => {
        uploadedFile.thumbnail = thumbnail;
        this.updateFileList();
      });
    }

    const currentFiles = this._uploadedFiles.value;
    this._uploadedFiles.next([...currentFiles, uploadedFile]);

    return uploadedFile;
  }

  /**
   * 移除文件
   */
  removeFile(fileId: string): void {
    const currentFiles = this._uploadedFiles.value;
    this._uploadedFiles.next(currentFiles.filter(f => f.id !== fileId));
  }

  /**
   * 清空所有文件
   */
  clearFiles(): void {
    this._uploadedFiles.next([]);
  }

  /**
   * 处理文件内容提取（本地处理）
   */
  async processFileLocally(uploadedFile: UploadedFile): Promise<FileProcessingResult> {
    if (!uploadedFile.file) {
      return { success: false, error: '文件不存在' };
    }

    try {
      uploadedFile.status = 'processing';
      this.updateFileList();

      let extractedText = '';

      if (uploadedFile.type === 'image') {
        // 图片：返回描述信息，后续可接入视觉模型
        extractedText = `[图片文件: ${uploadedFile.name}]`;
        uploadedFile.url = await this.fileToBase64(uploadedFile.file);
      } else if (uploadedFile.type === 'document') {
        // 文档：尝试提取文本
        extractedText = await this.extractTextFromDocument(uploadedFile.file);
      } else {
        extractedText = `[文件: ${uploadedFile.name}]`;
      }

      uploadedFile.extractedText = extractedText;
      uploadedFile.status = 'ready';
      uploadedFile.progress = 100;
      this.updateFileList();

      return { success: true, text: extractedText };
    } catch (error: any) {
      uploadedFile.status = 'error';
      uploadedFile.error = error.message || '处理失败';
      this.updateFileList();
      return { success: false, error: uploadedFile.error };
    }
  }

  /**
   * 上传文件到服务器（用于RAG处理）
   */
  uploadFileToServer(uploadedFile: UploadedFile): Observable<FileProcessingResult> {
    if (!uploadedFile.file) {
      return new Observable(observer => {
        observer.error({ success: false, error: '文件不存在' });
      });
    }

    const formData = new FormData();
    formData.append('file', uploadedFile.file);

    uploadedFile.status = 'uploading';
    this.updateFileList();

    return this.http.post<any>(this.UPLOAD_API, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const progress = event.total ? Math.round(100 * event.loaded / event.total) : 0;
          uploadedFile.progress = progress;
          this.updateFileList();
          return { success: false }; // Still uploading
        } else if (event.type === HttpEventType.Response) {
          uploadedFile.status = 'ready';
          uploadedFile.progress = 100;
          uploadedFile.extractedText = event.body?.text;
          this.updateFileList();
          return { success: true, text: event.body?.text };
        }
        return { success: false };
      }),
      catchError(error => {
        uploadedFile.status = 'error';
        uploadedFile.error = '上传失败';
        this.updateFileList();
        return new Observable<FileProcessingResult>(observer => {
          observer.next({ success: false, error: '上传失败' });
          observer.complete();
        });
      })
    );
  }

  /**
   * 从文档中提取文本（本地简单实现）
   */
  private async extractTextFromDocument(file: File): Promise<string> {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (extension === '.txt' || extension === '.md') {
      // 纯文本文件直接读取
      return await file.text();
    }

    // 对于PDF/Word等复杂格式，返回占位符
    // 实际项目中应接入后端RAG服务进行处理
    return `[文档内容: ${file.name}]\n请注意：复杂文档格式（PDF/Word）需要后端RAG服务支持才能完整解析。`;
  }

  /**
   * 生成图片缩略图
   */
  private generateThumbnail(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 100;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width;
              width = MAX_SIZE;
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height;
              height = MAX_SIZE;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * 文件转Base64
   */
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * 获取文件类别
   */
  private getFileCategory(file: File): string {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (this.SUPPORTED_TYPES.image.includes(extension)) return 'image';
    if (this.SUPPORTED_TYPES.document.includes(extension)) return 'document';
    if (this.SUPPORTED_TYPES.spreadsheet.includes(extension)) return 'spreadsheet';
    if (this.SUPPORTED_TYPES.presentation.includes(extension)) return 'presentation';
    return 'unknown';
  }

  /**
   * 获取文件图标
   */
  getFileIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'image': '🖼️',
      'document': '📄',
      'spreadsheet': '📊',
      'presentation': '📽️',
      'unknown': '📎'
    };
    return icons[type] || icons['unknown'];
  }

  /**
   * 格式化文件大小
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  /**
   * 更新文件列表
   */
  private updateFileList(): void {
    this._uploadedFiles.next([...this._uploadedFiles.value]);
  }

  /**
   * 生成唯一ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * 构建附件上下文（用于发送给AI）
   */
  buildAttachmentContext(): string {
    const readyFiles = this._uploadedFiles.value.filter(f => f.status === 'ready');
    if (readyFiles.length === 0) return '';

    let context = '\n\n--- 附件内容 ---\n';
    readyFiles.forEach((file, index) => {
      context += `\n[附件${index + 1}] ${file.name}:\n`;
      if (file.extractedText) {
        context += file.extractedText + '\n';
      }
    });
    context += '\n--- 附件结束 ---\n';

    return context;
  }

  /**
   * 获取图片附件（用于视觉模型）
   */
  getImageAttachments(): UploadedFile[] {
    return this._uploadedFiles.value.filter(f => f.type === 'image' && f.status === 'ready');
  }
}
