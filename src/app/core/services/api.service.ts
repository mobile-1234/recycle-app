import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

/**
 * API响应接口
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  code?: number;
  total?: number;
}

/**
 * 分页请求参数
 */
export interface PageParams {
  page?: number;
  size?: number;
  sort?: string;
  [key: string]: any;
}

/**
 * 分页响应数据
 */
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

/**
 * 统一API服务基类
 * 提供HTTP请求的统一封装和错误处理
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * GET请求
   */
  get<T>(endpoint: string, params?: any): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const options = {
      headers: this.getHeaders(),
      params: this.buildParams(params)
    };
    
    return this.http.get<ApiResponse<T>>(url, options).pipe(
      map(response => this.handleResponse(response)),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * POST请求
   */
  post<T>(endpoint: string, data?: any, params?: any): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const options = {
      headers: this.getHeaders(),
      params: this.buildParams(params)
    };
    
    return this.http.post<ApiResponse<T>>(url, data, options).pipe(
      map(response => this.handleResponse(response)),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * PUT请求
   */
  put<T>(endpoint: string, data?: any, params?: any): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const options = {
      headers: this.getHeaders(),
      params: this.buildParams(params)
    };
    
    return this.http.put<ApiResponse<T>>(url, data, options).pipe(
      map(response => this.handleResponse(response)),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * DELETE请求
   */
  delete<T>(endpoint: string, params?: any): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const options = {
      headers: this.getHeaders(),
      params: this.buildParams(params)
    };
    
    return this.http.delete<ApiResponse<T>>(url, options).pipe(
      map(response => this.handleResponse(response)),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * 分页查询
   */
  getPage<T>(endpoint: string, params?: PageParams): Observable<PageResponse<T>> {
    return this.get<PageResponse<T>>(endpoint, params);
  }

  /**
   * 文件上传
   */
  upload<T>(endpoint: string, file: File, additionalData?: any): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }
    
    const headers = new HttpHeaders({
      'Authorization': this.getToken()
    });
    
    return this.http.post<ApiResponse<T>>(url, formData, { headers }).pipe(
      map(response => this.handleResponse(response)),
      catchError(error => this.handleError(error))
    );
  }

  /**
   * 获取请求头
   */
  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    const token = this.getToken();
    if (token) {
      // ✅ 添加Bearer前缀（如果token本身不包含）
      const authToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      headers = headers.set('Authorization', authToken);
    }
    
    return headers;
  }

  /**
   * 获取Token
   */
  private getToken(): string {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.token || '';
      } catch {
        return '';
      }
    }
    return '';
  }

  /**
   * 构建查询参数
   */
  private buildParams(params?: any): HttpParams {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key];
        if (value !== null && value !== undefined && value !== '') {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }
    
    return httpParams;
  }

  /**
   * 处理响应
   */
  private handleResponse<T>(response: ApiResponse<T>): T {
    if (response.success !== false && response.data !== undefined) {
      return response.data;
    }
    
    // 如果响应直接是数据（后端返回格式可能不统一）
    return response as any;
  }

  /**
   * 统一错误处理
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = '请求失败，请稍后重试';
    
    if (error.error instanceof ErrorEvent) {
      // 客户端错误
      errorMessage = `客户端错误: ${error.error.message}`;
    } else {
      // 服务端错误
      if (error.status === 0) {
        errorMessage = '无法连接到服务器，请检查网络';
      } else if (error.status === 401) {
        errorMessage = '未授权，请重新登录';
        // ✅ 只在特定情况下才自动登出（避免误登出）
        // 如果后端明确返回token过期或无效，才清除登录
        const errorCode = error.error?.code;
        if (errorCode === 'TOKEN_EXPIRED' || errorCode === 'TOKEN_INVALID' || errorCode === 'UNAUTHORIZED') {
          console.warn('Token失效，自动登出');
          localStorage.removeItem('currentUser');
          setTimeout(() => {
            window.location.href = '/auth/login';
          }, 1000);
        }
        // ⚠️ 其他401情况（如后端接口未实现）不强制登出，只显示错误
      } else if (error.status === 403) {
        errorMessage = '没有权限访问此资源';
      } else if (error.status === 404) {
        errorMessage = '请求的资源不存在';
      } else if (error.status === 500) {
        errorMessage = '服务器内部错误';
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      }
    }
    
    console.error('API请求错误:', {
      status: error.status,
      message: errorMessage,
      error: error
    });
    
    return throwError(() => new Error(errorMessage));
  }
}
