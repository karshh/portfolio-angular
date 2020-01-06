import { Component, OnInit } from '@angular/core';

import { WeatherService } from '../services/weather.service';

@Component({
  selector: 'app-home-jumbo',
  templateUrl: './home-jumbo.component.html',
  styleUrls: ['./home-jumbo.component.css']
})
export class HomeJumboComponent implements OnInit {

	link: string = 'home';
	today: number = Date.now();


  constructor(private weather: WeatherService) { 

  }

  getClock = new Date().toLocaleTimeString("en-US", {timeZone: "America/Denver"});

  isWeatherLoaded() {
    return this.weather.isLoaded();
  }

  getCurrentTemperature(): string {
    if (!this.isWeatherLoaded()) return; 
  	return Math.round(this.weather.getCurrentWeather().temperature).toString();	
  }

  ngOnInit() {
  }


}
