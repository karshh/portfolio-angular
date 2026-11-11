import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NewsService, NewsState } from './services/news.service';
import { News } from './classes/news';
import { DetourService } from './services/detour.service';
import { MapInfo } from './classes/map-info';
import { TrafficIncidentService } from './services/traffic-incident.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class NewsComponent implements OnInit {

  constructor(
    private news: NewsService,
    private trafficIncidentService: TrafficIncidentService,
    private detourService: DetourService
  ) {}

  trafficIncident$: Observable<MapInfo[]>;
  detour$: Observable<MapInfo[]>;
  newsState$: Observable<NewsState>;

  ngOnInit() {
    this.newsState$ = this.news.state$;
    this.detour$ = this.detourService.getDetours();
    this.trafficIncident$ = this.trafficIncidentService.getTrafficIncidents();
  }

  // News from the Calgary Newsroom.

  retryNews(): void {
    this.news.retry();
  }

  getNewsByRange(news: News[], a: number, b: number): News[] {
    return news.slice(a, Math.min(b, news.length));
  }
}
