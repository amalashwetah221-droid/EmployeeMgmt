import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  private authSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  authState$: Observable<boolean> = this.authSubject.asObservable();

  private roleSubject = new BehaviorSubject<string | null>(this.getUserRole());
  role$: Observable<string | null> = this.roleSubject.asObservable();

  login(payload: { username: string; password: string }): Observable<string> {
    return this.http.post(`${this.baseUrl}/validate`, payload, { responseType: 'text' }).pipe(
      tap(token => {
        if (token) {
          localStorage.setItem('jwt', token);
          this.authSubject.next(true);
          this.roleSubject.next(this.getUserRole());
        }
      })
    );
  }

  signup(payload: { username: string; password: string; email: string; roleName: string }) {
    return this.http.post(`${this.baseUrl}/signup`, payload, { observe: 'response', responseType: 'text' }).pipe(
      map((response: HttpResponse<string>) => {
        if (response.status >= 200 && response.status < 300) {
          return response.body || 'Signup successful';
        } else {
          throw new Error('Signup failed');
        }
      })
    );
  }

  private urlBase64Decode(str: string): string {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0: break;
      case 2: output += '=='; break;
      case 3: output += '='; break;
      default: throw 'Illegal base64url string!';
    }
    return decodeURIComponent(escape(window.atob(output)));
  }

  private decodeToken(): any | null {
    const token = this.getToken();
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const decoded = this.urlBase64Decode(parts[1]);
    return JSON.parse(decoded);
  }

  getUserRole(): string | null {
    const decodedToken = this.decodeToken();
    if (!decodedToken || !decodedToken.roles) return null;
    if (typeof decodedToken.roles === 'string') return decodedToken.roles;
    if (Array.isArray(decodedToken.roles) && decodedToken.roles.length > 0) return decodedToken.roles[0];
    return null;
  }

  // Checks if user has at least one role in the given list
  hasAnyRole(roles: string[]): boolean {
    const userRole = this.getUserRole();
    if (!userRole) return false;
    return roles.includes(userRole);
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'ROLE_ADMIN';
  }

  logout(): void {
    localStorage.removeItem('jwt');
    this.authSubject.next(false);
    this.roleSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwt');
  }
  isAuthenticated(): boolean {
    return !!localStorage.getItem('jwt');
  }
}
