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

  loginForm: FormGroup;
  regForm: FormGroup;

  regLoading: boolean = false;
  loginLoading: boolean = false;

  link: string;

  constructor(private fb: FormBuilder, private authService: AuthService, private route: Router) {
    this.errMessage = '';
    this.successMessage = '';
    this.link = 'login';


    this.loginForm = fb.group({
      'email': ['', Validators.required, Validators.email, Validators.min(4)],
      'password': ['', Validators.required]
    });
  }

  login(email: string, password: string): boolean {

    if (!this.loginForm.valid) return false;

    this.loginLoading = true;

    this.authService.login(email, password)
    .subscribe(() => {
      this.loginLoading = false;
      this.route.navigate(['/']);
    }, (err: any) => {

      this.loginLoading = false;
      this.errMessage = 'Invalid username or password.';
    });

    return false;
  }

  register(username: string, email: string, password: string): boolean {

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
