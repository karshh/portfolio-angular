import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ContactComponent } from './contact/contact.component';
import { TitleComponent } from './page-components/title/title.component';
import { FormInputComponent } from './page-components/form-input/form-input.component';
import { FormTextAreaComponent } from './page-components/form-text-area/form-text-area.component';
import { SubmitButtonComponent } from './page-components/submit-button/submit-button.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { SkillListComponent } from './page-components/skill-list/skill-list.component';
import { ProjectInfoComponent } from './page-components/project-info/project-info.component';

import { ProjectInfoService } from './services/project-info.service';
import { SkillInfoService } from './services/skill-info.service';
import { ContactService } from './services/contact.service';
import { TemplateComponent } from './template/template.component';
import { HomeModule } from './home/home.module';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: 'contact', component: ContactComponent },
  { path: 'sait', component: PortfolioComponent },
  { path: 'news', loadChildren: () => import('./news/news.module').then(m => m.NewsModule) },
  { path: '**', redirectTo: '/home', pathMatch: 'full'}

  // authentication.
];

@NgModule({
  declarations: [
    AppComponent,
    ContactComponent,
    TitleComponent,
    FormInputComponent,
    FormTextAreaComponent,
    SubmitButtonComponent,
    PortfolioComponent,
    SkillListComponent,
    ProjectInfoComponent,
    TemplateComponent
  ],
  imports: [
    HomeModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    SkillInfoService,
    ProjectInfoService,
    ContactService 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
