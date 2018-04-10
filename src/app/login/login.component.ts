import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators }   from '@angular/forms';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	errMessage: string;
  successMessage: string;

  regLoading: boolean = false;
  loginLoading: boolean = false;

  link: string;

  constructor(private authService: AuthService, private route: Router) {
    this.errMessage = '';
    this.successMessage = '';
    this.link = 'login';
  }

  login(email: string, password: string): boolean {
    this.errMessage = '';
    this.successMessage = '';
    this.loginLoading = true;

    var dt;
    console.log(email + ": " + password);
    this.authService.login(email, password)
    .subscribe((data) => {
      dt = data;
      this.authService.setUser(email, dt.user);
      this.loginLoading = false;

      this.route.navigate(['/']);
    }, (err: any) => {
      this.loginLoading = false;
      this.errMessage = 'Error:' + err.error.message;
    });

    return false;
  }

  register(username: string, email: string, password: string): boolean {

    this.errMessage = '';
    this.successMessage = '';
    this.regLoading = true;
    this.authService.register(username, email, password)
    .subscribe(() => {
      this.successMessage = 'Successfully registered!'
      this.regLoading = false;
    }, (err: any) => {
      
      this.regLoading = false;
      this.errMessage = 'Could not register.' + err.error.message;
    });

    return false;
  }

  ngOnInit() {
  }

}
