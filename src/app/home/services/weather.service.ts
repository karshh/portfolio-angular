import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Config } from '../../../../config'

@Injectable()
export class WeatherService {

  private API_KEY: string = Config.WEATHER_API_KEY;

  constructor(private http: HttpClient) {}

  getWeather() {
    return this.http.get(this.buildURL(), {'responseType': 'json' })
  }

  private buildURL(): string {
    return Config.PROXY_URL + `https://api.weatherapi.com/v1/current.json?key=${this.API_KEY}&q=Calgary&aqi=no`;
  }
}