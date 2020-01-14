import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Config } from './config'

@Injectable()
export class WeatherService {

  private BASE_URL: string = 'https://api.darksky.net/forecast/';
  private API_KEY: string = Config.WEATHER_API_KEY;
  private COORDS: string = Config.YYC_COORDS // SAIT
  private loaded: boolean;
  

  private currentWeather: any ;


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
    this.http.get(this.buildURL(), {headers: {'Content-Type': 'application/json'}})
  	.subscribe((data: any) => { 
      console.log(data);
      console.log(this.buildURL());
  		this.loaded = true;
  		this.currentWeather = data.hourly.data[0];  
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

}
