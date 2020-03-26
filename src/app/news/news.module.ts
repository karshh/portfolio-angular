
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewsComponent } from './news.component';
import { NewsService } from './services/news.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core'
import { Config } from '../../../config';
import { MapsComponent } from './maps/maps.component';
import { NewsPanelComponent } from './news-panel/news-panel.component';
import { DetourService } from './services/detour.service';
import { TrafficIncidentService } from './services/traffic-incident.service';

const routes: Routes = [
  { path: '', component: NewsComponent }
];

@NgModule({
  declarations: [
    NewsComponent,
    NewsPanelComponent,
    MapsComponent
  ],
  providers: [
    NewsService,
    DetourService,
    TrafficIncidentService
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    AgmCoreModule.forRoot({
      apiKey: Config.GOOGLE_API_KEY,
      libraries: ["places"]
    })
  ] // import MODULES
})
export class NewsModule {}