import { Component, OnInit } from '@angular/core';
import { NewsService } from '../services/news.service';
import { News } from '../classes/news';
import { TrafficIncidentService } from '../services/traffic-incident.service';
import { TrafficIncident } from '../classes/traffic-incident';
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
    private trafficIncident: TrafficIncidentService
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

  getTrafficIncidentList(): Array<TrafficIncident> {
    return this.trafficIncident.getTrafficIncidentList();
  }






}
