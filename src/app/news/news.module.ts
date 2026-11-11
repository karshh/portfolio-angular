
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewsComponent } from './news.component';
import { NewsService } from './services/news.service';
import { HttpClientModule } from '@angular/common/http';
import { GoogleMapsModule } from '@angular/google-maps';
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
    GoogleMapsModule
  ] // import MODULES
})
export class NewsModule {}
