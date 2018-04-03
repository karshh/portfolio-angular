import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

	link: string;

  constructor() { 
  	this.link = 'contact';
  }

  ngOnInit() {
  }

  onSubmit(form: any): void {
  	console.log(form);
  }

}