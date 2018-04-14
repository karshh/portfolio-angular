import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  link: string;
  mediumDescription: string;
  constructor() { 
  	this.link = 'portfolio';
  	this.mediumDescription = `
			<p> 
				This web application demonstrates server support and database, in addition to web componentization and layout in Laravel.
				A basic layout resembling <a href="https://www.medium.com" target="_blank">medium.com</a> was implemented.
				Laravel blades were used to break down the website into components, along with ensuring ease of routing.
			</p>

			<p> 
				Controllers and Eloquent models were implemented to hook up the client with a MySQL database, such that data could be persisted. 
				The application is hosted on Amazon EC2.
			</p>
  	`;
  }
  ngOnInit() {
  }

}
