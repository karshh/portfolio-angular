import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { News } from '../classes/news';
import { Config } from '../../../../config';

@Injectable()
export class NewsService {

	private loaded: boolean;
	private newsList: Array<News>;
	private url = Config.PROXY_URL + 'https://data.calgary.ca/resource/3x6m-4vs7.json';

  constructor(private http: HttpClient) {
  	this.loaded = false;
  	this.newsList = [];
    for (var i = 0; i < 20; i++) this.newsList.push(new News(null, null, null)); // dummy news.
  	this.updateNews();
  }

  private updateNews(): void {
  	this.getNews();
  	setTimeout(this.updateNews, 1000 * 60 * 30); // update every 30 mins.
  }

  private getNews() {
    this.loaded = false; // enter loading view screen.
    let headers = new HttpHeaders().set('$$app_token', Config.YYC_APP_TOKEN);
    this.http.get(this.url, { headers })
  	.subscribe((data: any[]) => {
    	this.newsList = data
		.filter(newsItem => newsItem.pubdate !== null)
		.map(newsItem => new News(newsItem.title, new Date(newsItem.pubdate), new URL(newsItem.link.url)))
		.sort((a: News,b: News) => b.pubdate.valueOf() - a.pubdate.valueOf())
  		this.loaded = true;
  	});
  }

  getNewsByRange(start:number, end:number): Array<News> {
  	return this.newsList.slice(start, Math.min(end, this.newsList.length));
  }

  isLoaded(): boolean {
  	return this.loaded && this.newsList != null;
  }


  getCurrentNews(): Array<News> {
  	return this.newsList;
  }


}
