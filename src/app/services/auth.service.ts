import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {

  // Dummy login and logout for now. Change to interact with db later!!!
  authMap: { [user: string]: string; };

  constructor(private router: Router) {
    this.authMap = {};
  }
  
  register(user: string, email: string, password: string): boolean {

    if (this.authMap[user]) return false;

    this.authMap[user] = password;
    return true;
  }

  login(user: string, password: string): boolean {
    
    console.log("Current authmap:");
    console.log(this.authMap);

    if (this.authMap[user] && this.authMap[user] == password) {
      localStorage.setItem('username', user);
      this.router.navigate(['']);
    }

    return false;
  }

  logout(): any {
    localStorage.removeItem('username');
  }

  getUser(): any {
    return localStorage.getItem('username');
  }

  isLoggedIn(): boolean {
    return this.getUser() !== null;
  }
}

export const AUTH_PROVIDERS: Array<any> = [
  { provide: AuthService, useClass: AuthService }
];
