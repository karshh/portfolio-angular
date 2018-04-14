import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.css']
})
export class ProjectInfoComponent implements OnInit {

	@Input() title: string;
	@Input() skilLList: Array<string>;
	@Input() timeLine: string;
	@Input() description: string;
	@Input() githubURL: string;
	@Input() websiteURL: string;

  constructor() { }

  ngOnInit() {
  	console.log(this.description);
  }

}
