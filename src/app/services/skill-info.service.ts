import { Injectable } from '@angular/core';
import { SkillInfo } from '../classes/skill-info';
import { Skills } from './skills';

@Injectable()
export class SkillInfoService {

  skills: Array<SkillInfo>;

  
  constructor() {
  	this.skills = new Array<SkillInfo>();

  	for (var i = 0; i < Skills.length; i++) {
  		this.skills.push(this.convertToSkill(Skills[i]));
  	}
  }

  getSkills(): Array<SkillInfo> {
  	return this.skills;
  }

  convertToSkill(skill: any): SkillInfo {
  	let skillInfo: SkillInfo = new SkillInfo(); 
	skillInfo.title = skill.title;
	skillInfo.skillList = skill.skillList;

  	return skillInfo;

  }

}
