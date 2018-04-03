import { Component, OnInit, Input } from '@angular/core';

import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-nav-list',
  templateUrl: './nav-list.component.html',
  styleUrls: ['./nav-list.component.css']
})
export class NavListComponent implements OnInit {

  links: string[];


  @Input() currentLink: string;

  constructor(private authService: AuthService) { 
  	this.links = ['home', 'portfolio', 'blog', 'about' ,'contact'];
    if (authService.isLoggedIn()) this.links.push('profile', 'logout');
    else this.links.push('login')
  }

  ngOnInit() {
  }

}
