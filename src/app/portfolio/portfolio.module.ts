
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortfolioComponent } from '../portfolio/portfolio.component';
import { ProjectInfoService } from './services/project-info.service';
import { SkillInfoService } from './services/skill-info.service';
import { ProjectInfoComponent } from '../page-components/project-info/project-info.component';
import { SkillListComponent } from '../page-components/skill-list/skill-list.component';

const routes: Routes = [
  { path: '', component: PortfolioComponent }
];

@NgModule({
  declarations: [
    ProjectInfoComponent,
    SkillListComponent,
    PortfolioComponent
  ],
  providers: [
    ProjectInfoService,
    SkillInfoService
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ] // import MODULES
})
export class PortfolioModule { }