import { Component, OnInit } from '@angular/core';
import { NewsService } from '../services/news.service';
import { News } from '../classes/news';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

	link: string;

  constructor(private news: NewsService) {
  	this.link = "news";
  }

  ngOnInit() {
  }

  isNewsLoaded(): boolean {
  	return this.news.isLoaded();
  }

  getNewsByRange(a: number, b:number): Array<News> {
  	let newsList = this.news.getNewsByRange(a,b)
  	console.log(newsList);
  	return newsList;
  }

}
