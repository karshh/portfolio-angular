import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home-jumbo',
  templateUrl: './home-jumbo.component.html',
  styleUrls: ['./home-jumbo.component.css']
})
export class HomeJumboComponent implements OnInit {

	link: string = 'home';
	today: number = Date.now();

  constructor() { 
  	this.updateClock();
  }

  updateClock(): void {
  	setInterval(() => {
  		this.today = Date.now();
  	}, 995 * 60);
  }

  ngOnInit() {
  }

}
