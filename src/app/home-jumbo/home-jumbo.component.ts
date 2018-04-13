import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import { WeatherService } from '../services/weather.service';

@Component({
  selector: 'app-home-jumbo',
  templateUrl: './home-jumbo.component.html',
  styleUrls: ['./home-jumbo.component.css']
})
export class HomeJumboComponent implements OnInit {

	link: string = 'home';
	today: number = Date.now();

	weatherLoaded: boolean;

  constructor(private weather: WeatherService) { 
  	this.weatherLoaded = false;

  	this.updateClock();
  	this.getWeatherData();
  }

  updateClock(): void {
  	setInterval(() => {
  		this.today = Date.now();
  	}, 995 * 60);
  }

  getWeatherData(): number {
  	if (this.weather.isLoaded()) this.weatherLoaded = true;

  	if (this.weatherLoaded) {
	  	let dt = this.weather.getCurrentWeather();
	  	return Math.round(parseInt(dt.temperature));	
  	}
  }

  ngOnInit() {
  }

}
