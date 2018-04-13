import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Config } from './config'

@Injectable()
export class WeatherService {

  private BASE_URL: string = 'https://api.darksky.net/forecast/';
  private API_KEY: string = Config.WEATHER_API_KEY;
  private COORDS: string = Config.YYC_COORDS // SAIT
  private loaded: boolean;
  

  private currentWeather: JSON ;
  private hourlyWeather: Array<JSON>; // for now I'll just pump out the next three hours and their weather


  private coords: string;


  constructor(private http: HttpClient) { 
  	this.loaded = false;
  	this.updateWeather();
  }

  private updateWeather(): void {
  	this.getWeather();
  	setTimeout(this.updateWeather, 1000 * 60 * 30); // update every 30 mins.
  }

  private getWeather() {
  	this.http.get(this.buildURL())
  	.subscribe((data) => {
  		console.log(data);
  		let dt, currentDt, hourlyDt; 
  		this.loaded = true;
  		dt = data;
  		this.currentWeather = dt.hourly.data[0];
  		this.hourlyWeather = dt.hourly.data.slice(1,4);  
  	});
  }

  private buildURL(): string {
  	return this.BASE_URL + this.API_KEY + '/' +  this.COORDS + '?units=si';
  }

  isLoaded(): boolean {
  	return this.loaded;
  }

  getCurrentWeather(): any {
  	return this.currentWeather;
  }

  getHourlyWeather(): Array<any> {
  	return this.hourlyWeather;
  }
}
