import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {

  links = ['home', 'news', 'sait', 'contact'];
  getClock = Date.now();

  navItemClass = {
    'nav-item': true,
    'nav-link': true,
    'nav-link-extra': true,
  };
  constructor() { }

  ngOnInit(): void {
  }

}
