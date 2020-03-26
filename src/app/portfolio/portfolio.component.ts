import { Component, OnInit } from '@angular/core';
import { ProjectInfo } from './classes/project-info'
import { SkillInfo } from './classes/skill-info'
import { ProjectInfoService } from './services/project-info.service';
import { SkillInfoService } from './services/skill-info.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})

export class PortfolioComponent implements OnInit {

  link: string;

  constructor(
    private projectInfo: ProjectInfoService, 
    private skillInfo: SkillInfoService
    ) {}
   
  getProjectInfoList(): Array<ProjectInfo> {
  	return this.projectInfo.getProjects();
  }

  getSkillInfoList(): Array<SkillInfo> {
    return this.skillInfo.getSkills();
  }
  ngOnInit() {
    this.link = "sait";
  }

}
