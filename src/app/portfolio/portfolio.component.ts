import { Component, OnInit } from '@angular/core';
import { ProjectInfoService } from '../services/project-info.service';
import { ProjectInfo } from '../classes/project-info'

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})

export class PortfolioComponent implements OnInit {

  link: string;

  constructor(private projectInfo: ProjectInfoService) { 
  	this.link = 'portfolio';  
  }
   
  getProjectInfoList(): Array<ProjectInfo> {
  	return this.projectInfo.getProjects();
  }

  ngOnInit() {
  }

}
