import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Config } from './config'
import { tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable()
export class WeatherService {

  private BASE_URL: string = 'https://api.darksky.net/forecast/';
  private API_KEY: string = Config.WEATHER_API_KEY;
  private COORDS: string = Config.YYC_COORDS // SAIT

  constructor(private http: HttpClient) {}

  getWeather() {
    return this.http.get(this.buildURL(), {'responseType': 'json' })
  }

  private buildURL(): string {
  	return Config.PROXY_URL + this.BASE_URL + this.API_KEY + '/' +  this.COORDS + '?units=si';
  }
}