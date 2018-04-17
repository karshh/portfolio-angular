import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-news-panel',
  templateUrl: './news-panel.component.html',
  styleUrls: ['./news-panel.component.css']
})
export class NewsPanelComponent implements OnInit {

	@Input() title: string;
	@Input() link: URL;
	@Input() pubdate: Date;

  @Input() loaded: boolean;
	
  constructor() { }

  ngOnInit() {
  }

}
