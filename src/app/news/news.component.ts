import { Component, OnInit } from '@angular/core';
import { NewsService } from '../services/news.service';
import { News } from '../classes/news';
import { TrafficIncidentService } from '../services/traffic-incident.service';
import { DetourService } from '../services/detour.service';
import { MapInfo } from '../classes/map-info';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  link: string;

  news: News[];

  constructor(
    private newsService: NewsService,
    private trafficIncident: TrafficIncidentService,
    private detour: DetourService
  ) {
    this.link = "news";
    this.news = [];
    for (var i = 0; i < 25; i++) this.news.push(new News());

  }

  ngOnInit() {
    this.newsService.getNews().subscribe(data => this.news = data);
  }

  // News from the Calgary Newsroom.

  getNewsByRange(a: number, b: number): News[] {
    return this.news.slice(a, b);
  }

  // Traffic Incidents

  isTrafficIncidentLoaded(): boolean {
    return this.trafficIncident.isLoaded();
  }

  getTrafficIncidentList(): Array<MapInfo> {
    return this.trafficIncident.getTrafficIncidentList();
  }

  // Detours


  isDetoursLoaded(): boolean {
    return this.detour.isLoaded();
  }

  getDetoursList(): Array<MapInfo> {
    return this.detour.getDetoursList();
  }





}
