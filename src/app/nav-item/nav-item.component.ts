import { Component, OnInit, Input } from '@angular/core';
@Component({
  selector: 'app-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.css']
})
export class NavItemComponent implements OnInit {

	@Input() title: string;

	@Input() currentLink : string;

	classesObj : Object;

  constructor() {
  }

  ngOnInit() {
  	this.classesObj = {
  		'nav-item': true,
  		'nav-link': true,
  		'nav-link-extra': true,
  		'active': this.currentLink == this.title
  	};
  }

}
