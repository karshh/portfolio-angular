import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.css'],
  standalone: false
})
export class ProjectInfoComponent implements OnInit {

	@Input() title: string;
	@Input() skillList: Array<string>;
	@Input() timeLine: string;
	@Input() description: string;
	@Input() githubURL: string;
	@Input() websiteURL: string;

  constructor() { }

  ngOnInit() {
  }

}
