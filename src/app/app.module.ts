import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core'

import { Config } from './services/config';
import { AppComponent } from './app.component';
import { ContactComponent } from './contact/contact.component';
import { TitleComponent } from './page-components/title/title.component';
import { FormInputComponent } from './page-components/form-input/form-input.component';
import { FormTextAreaComponent } from './page-components/form-text-area/form-text-area.component';
import { SubmitButtonComponent } from './page-components/submit-button/submit-button.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { ProfileComponent } from './profile/profile.component';
import { SkillListComponent } from './page-components/skill-list/skill-list.component';
import { ProjectInfoComponent } from './page-components/project-info/project-info.component';

import { WeatherService } from './services/weather.service';
import { NewsService } from './services/news.service';
import { ProjectInfoService } from './services/project-info.service';
import { SkillInfoService } from './services/skill-info.service';
import { TrafficIncidentService } from './services/traffic-incident.service';
import { DetourService } from './services/detour.service';
import { ContactService } from './services/contact.service';
import { NewsComponent } from './news/news.component';
import { NewsPanelComponent } from './page-components/news-panel/news-panel.component';
import { MapsComponent } from './page-components/maps/maps.component';
import { TemplateComponent } from './template/template.component';
import { HomeModule } from './home/home.module';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: 'contact', component: ContactComponent },
  { path: 'sait', component: PortfolioComponent },
  { path: 'news', component: NewsComponent },
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
    ProfileComponent,
    SkillListComponent,
    ProjectInfoComponent,
    NewsComponent,
    NewsPanelComponent,
    MapsComponent,
    TemplateComponent
  ],
  imports: [
    HomeModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    AgmCoreModule.forRoot({
      apiKey: Config.GOOGLE_API_KEY,
      libraries: ["places"]
    })
  ],
  providers: [
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: ResponseInterceptor,
    //   multi: true
    // },
    WeatherService,
    SkillInfoService,
    ProjectInfoService,
    TrafficIncidentService,
    DetourService,
    NewsService,
    ContactService,
    HttpClient ],
  bootstrap: [AppComponent]
})
export class AppModule { }
