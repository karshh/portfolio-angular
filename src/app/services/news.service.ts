import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { News } from '../classes/news';
import { Config } from './config'

@Injectable()
export class NewsService {

	private loaded: boolean;
	private newsList: Array<News>;


  constructor(private http: HttpClient) {
  	this.loaded = false;
  	this.newsList = [];
    for (var i = 0; i < 20; i++) this.newsList.push(new News()); // dummy news.
  	this.updateNews();
  }

  private updateNews(): void {
  	this.getNews();
  	setTimeout(this.updateNews, 1000 * 60 * 30); // update every 30 mins.
  }

  private getNews() {
    this.loaded = false; // enter loading view screen.
    
    let headers = new HttpHeaders().set('$$app_token', Config.YYC_APP_TOKEN);
    this.http.get(this.buildURL(), { headers })
  	.subscribe((data: any) => {
      this.newsList = [];
  		for (var i = 0; i < data.length; i++) {
  			if (!data[i].pubdate) continue;
  			let news: News = this.convertToNews(data[i]);
  			this.newsList.push(news);
  		}
  		this.newsList.sort((a: any,b: any) => b.pubdate - a.pubdate);
  		this.loaded = true;
  	});
  }
  
  private buildURL(): string {
  	return Config.PROXY_URL + 'https://data.calgary.ca/resource/3x6m-4vs7.json';
  }

  getNewsByRange(start:number, end:number): Array<News> {
  	return this.newsList.slice(start, Math.min(end, this.newsList.length));

  }

  convertToNews(newsInfo: any): News {
  	let news: News = new News(); 
  	news.title = newsInfo.title;
  	news.pubdate = new Date(newsInfo.pubdate);
  	news.link = new URL(newsInfo.link.url);

		return news;

  }

  isLoaded(): boolean {
  	return this.loaded && this.newsList != null;
  }


  getCurrentNews(): Array<News> {
  	return this.newsList;
  }


}
