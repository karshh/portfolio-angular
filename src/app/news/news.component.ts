import { Component, OnInit } from '@angular/core';
import { NewsService } from '../services/news.service';
import { News } from '../classes/news';
import { TrafficIncidentService } from '../services/traffic-incident.service';
import { DetourService } from '../services/detour.service';
import { MapInfo } from '../classes/map-info';
import { MapStyle } from '../services/config';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

	link: string;

  zoom: number = 10;
  latitude: number = 51.0486;
  longitude: number = -114.0708;
  mapStyles: any = MapStyle;

  constructor(
    private news: NewsService, 
    private trafficIncident: TrafficIncidentService,
    private detour : DetourService
    ) {
  	
    this.link = "news";

  }

  ngOnInit() {

  }


  // News from the Calgary Newsroom.
  
  isNewsLoaded(): boolean {
  	return this.news.isLoaded();
  }

  getNewsByRange(a: number, b:number): Array<News> {
  	let newsList = this.news.getNewsByRange(a,b);
  	return newsList;
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
