import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-jumbo',
  templateUrl: './home-jumbo.component.html',
  styleUrls: ['./home-jumbo.component.css']
})
export class HomeJumboComponent implements OnInit {

	link: string;

  constructor() { 
  	this.link = 'home';
  }

  ngOnInit() {
  }

}
