import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { News } from '../classes/news';
import { Config } from './config'
import { map } from 'rxjs/operators';

@Injectable()
export class NewsService {



	constructor(private http: HttpClient) {
	}


	getNews() {
		let headers = new HttpHeaders().set('$$app_token', Config.YYC_APP_TOKEN);
		return this.http.get(this.buildURL(), { headers }).pipe(map((data: any) => {
			let newsList = [];
			for (var i = 0;i < data.length;i++) {
				if (!data[i].pubdate) continue;
				let news: News = this.convertToNews(data[i]);
				newsList.push(news);
			}
			newsList.sort((a: any, b: any) => b.pubdate - a.pubdate);
			console.log(newsList);
			return newsList;

		}));
	}

	private buildURL(): string {
		return Config.PROXY_URL + 'https://data.calgary.ca/resource/3x6m-4vs7.json';
	}

	convertToNews(newsInfo: any): News {
		let news: News = new News();
		news.title = newsInfo.title;
		news.pubdate = new Date(newsInfo.pubdate);
		news.link = new URL(newsInfo.link.url);

		return news;

	}
}
