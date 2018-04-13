import { Component, OnInit } from '@angular/core';

import { WeatherService } from '../services/weather.service';
import { ClockService } from '../services/clock.service';

@Component({
  selector: 'app-home-jumbo',
  templateUrl: './home-jumbo.component.html',
  styleUrls: ['./home-jumbo.component.css']
})
export class HomeJumboComponent implements OnInit {

	link: string = 'home';
	today: number = Date.now();


  constructor(private weather: WeatherService, private clock: ClockService) { 

  }

  getClock(): number {
  	return this.clock.getClock();
  }

  isWeatherLoaded() {
    return this.weather.isLoaded();
  }

  getCurrentWeatherData(): string {
    if (!this.isWeatherLoaded()) return; 
  	return Math.round(this.weather.getCurrentWeather().temperature).toString();	
  }

  getHourlyWeatherData(): Array<string> {
    if (!this.isWeatherLoaded()) return;
    let dt = this.weather.getHourlyWeather();
    let output: Array<string> = []; 
    for (var i = 0; i < dt.length; i++) {
      let temp = Math.round(dt[i].temperature).toString();
      output.push(temp); 
    }
    return output;
  }

  ngOnInit() {
  }


}
