import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: string;
  username: string;
  email: string;
  userType: 'consumer' | 'business' | 'government';
}

export interface LoginRequest {
  username: string;
  password: string;
  userType: 'consumer' | 'business' | 'government';
}

export interface RegisterRequest {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  userType: 'consumer' | 'business' | 'government';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private router: Router) {
    // 检查本地存储中的用户信息
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(loginRequest: LoginRequest): Observable<User> {
    return new Observable(observer => {
      // 模拟登录API调用
      setTimeout(() => {
        const user: User = {
          id: '1',
          username: loginRequest.username,
          email: `${loginRequest.username}@example.com`,
          userType: loginRequest.userType
        };
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        
        // 根据用户类型导航到相应页面
        switch (loginRequest.userType) {
          case 'consumer':
            this.router.navigate(['/consumer']);
            break;
          case 'business':
            this.router.navigate(['/business']);
            break;
          case 'government':
            this.router.navigate(['/government']);
            break;
        }
        
        observer.next(user);
        observer.complete();
      }, 1000);
    });
  }

  register(registerRequest: RegisterRequest): Observable<User> {
    return new Observable(observer => {
      // 模拟注册API调用
      setTimeout(() => {
        const user: User = {
          id: Date.now().toString(),
          username: registerRequest.username,
          email: registerRequest.email,
          userType: registerRequest.userType
        };
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        
        // 根据用户类型导航到相应页面
        switch (registerRequest.userType) {
          case 'consumer':
            this.router.navigate(['/consumer']);
            break;
          case 'business':
            this.router.navigate(['/business']);
            break;
          case 'government':
            this.router.navigate(['/government']);
            break;
        }
        
        observer.next(user);
        observer.complete();
      }, 1000);
    });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
