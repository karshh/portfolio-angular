import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { News } from '../classes/news';

@Injectable()
export class NewsService {

	private loaded: boolean;
	private newsList: Array<News>;

  constructor(private http: HttpClient) {
  	this.loaded = false;
  	this.newsList = [];
  	this.updateNews();
  }

  private updateNews(): void {
  	this.getNews();
  	setTimeout(this.updateNews, 1000 * 60 * 30); // update every 30 mins.
  }

  private getNews() {
  	this.newsList = [];
  	this.http.get(this.buildURL())
  	.subscribe((data: any) => {
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
  	return 'https://data.calgary.ca/resource/5ehk-wfu2.json';
  }

  getNewsByRange(start:number, end:number): Array<News> {

  	if (!this.loaded || this.newsList.length < start+1) return [];

  	return this.newsList.slice(start, Math.min(end, this.newsList.length));
  }

  convertToNews(newsInfo: any): News {
  	let news: News = new News(); 
  	news.title = newsInfo.title;
  	news.pubdate = new Date(newsInfo.pubdate);
  	news.link = new URL(newsInfo.link);

		return news;

  }

  isLoaded(): boolean {
  	return this.loaded && this.newsList != null;
  }


  getCurrentNews(): Array<News> {
  	return this.newsList;
  }


}
