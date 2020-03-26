import { Component, OnInit } from '@angular/core';
import { NewsService } from './services/news.service';
import { News } from './classes/news';
import { DetourService } from './services/detour.service';
import { MapInfo } from './classes/map-info';
import { TrafficIncidentService } from './services/traffic-incident.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  constructor(
    private news: NewsService,
    private trafficIncidentService: TrafficIncidentService,
    private detourService: DetourService
  ) {}

  trafficIncident$: Observable<MapInfo[]>;
  detour$: Observable<MapInfo[]>;

  ngOnInit() {
    this.detour$ = this.detourService.getDetours();
    this.trafficIncident$ = this.trafficIncidentService.getTrafficIncidents();
  }

  // News from the Calgary Newsroom.

  isNewsLoaded(): boolean {
    return this.news.isLoaded();
  }

  getNewsByRange(a: number, b: number): Array<News> {
    let newsList = this.news.getNewsByRange(a, b);
    return newsList;
  }
}
