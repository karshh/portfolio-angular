import { Injectable } from '@angular/core';
import { ProjectInfo } from '../classes/project-info';
import { Projects } from './projects';

@Injectable()
export class ProjectInfoService {
  
  projects: Array<ProjectInfo>;

  
  constructor() {
  	this.projects = new Array<ProjectInfo>();

  	for (var i = 0; i < Projects.length; i++) {
  		this.projects.push(this.convertToProject(Projects[i]));
  	}
  }

  getProjects(): Array<ProjectInfo> {
  	return this.projects;
  }

  convertToProject(project: any): ProjectInfo {
  	let projectInfo: ProjectInfo = new ProjectInfo(); 
	projectInfo.title = project.title;
	projectInfo.skillList = project.skillList;
	projectInfo.timeLine = project.timeLine;
	projectInfo.website = project.website;
	projectInfo.github = project.github;
	projectInfo.description = project.description;

  	return projectInfo;

  }

}
