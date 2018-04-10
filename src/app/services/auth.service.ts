import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AuthService {

  api: string = "http://localhost:3000/";
  loading: boolean;

  // Dummy login and logout for now. Change to interact with db later!!!
  constructor(private router: Router, private http: HttpClient) {
  }
  
  register(user: string, email: string, password: string) {
    return this.http.post(this.api + 'auth/register', {'username': user, 'email': email, 'password': password});

  }

  login(email: string, password: string) {
    console.log(email + ": " + password);
    return this.http.post(this.api + 'auth/login', {'email': email, 'password': password});
  }

  logout() {
    return this.http.post(this.api + 'auth/logout', {});
  }

  clearUser() {
    localStorage.removeItem('user');
    localStorage.removeItem('email');
  }

  getUser(): any {
    return localStorage.getItem('user');
  }

  setUser(email: string, user: string) {
    localStorage.setItem('user', user);
    localStorage.setItem('email', email);
  }

  isLoggedIn(): boolean {
    return this.getUser() !== null;
  }
}

export const AUTH_PROVIDERS: Array<any> = [
  { provide: AuthService, useClass: AuthService }
];
