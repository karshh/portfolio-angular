import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core'

import { Config } from './services/config';
import { AppComponent } from './app.component';
import { NavItemComponent } from './nav-item/nav-item.component';
import { NavListComponent } from './nav-list/nav-list.component';
import { HomeJumboComponent } from './home-jumbo/home-jumbo.component';
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
import { ClockService } from './services/clock.service';
import { NewsService } from './services/news.service';
import { ProjectInfoService } from './services/project-info.service';
import { SkillInfoService } from './services/skill-info.service';
import { TrafficIncidentService } from './services/traffic-incident.service';
import { DetourService } from './services/detour.service';
import { FooterComponent } from './footer/footer.component';
import { NewsComponent } from './news/news.component';
import { NewsPanelComponent } from './page-components/news-panel/news-panel.component';
import { MapsComponent } from './page-components/maps/maps.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeJumboComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'portfolio', component: PortfolioComponent },
  { path: 'news', component: NewsComponent },

  // authentication.
];

@NgModule({
  declarations: [
    AppComponent,
    NavItemComponent,
    NavListComponent,
    HomeJumboComponent,
    ContactComponent,
    TitleComponent,
    FormInputComponent,
    FormTextAreaComponent,
    SubmitButtonComponent,
    PortfolioComponent,
    ProfileComponent,
    SkillListComponent,
    ProjectInfoComponent,
    FooterComponent,
    NewsComponent,
    NewsPanelComponent,
    MapsComponent
  ],
  imports: [
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
    WeatherService,
    ClockService,
    SkillInfoService,
    ProjectInfoService,
    TrafficIncidentService,
    DetourService,
    NewsService,
    HttpClient ],
  bootstrap: [AppComponent]
})
export class AppModule { }
