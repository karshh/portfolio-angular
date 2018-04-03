import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-nav-list',
  templateUrl: './nav-list.component.html',
  styleUrls: ['./nav-list.component.css']
})
export class NavListComponent implements OnInit {

  links: string[];

  @Input() currentLink: string;

  constructor() { 
  	this.links = ['home', 'portfolio', 'blog', 'about' ,'contact'];

  }

  ngOnInit() {
  }

}
