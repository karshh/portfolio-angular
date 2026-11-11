import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, timeout } from 'rxjs/operators';

export interface WeatherObservation {
  temperatureC: number;
  observedAt: string;
  station: string;
}

interface GeoMetObservations {
  features?: { properties?: Record<string, unknown> }[];
}

const STATION_ID = '3031094'; // ECCC Calgary International CS.
const MAX_OBSERVATION_AGE_MS = 3 * 60 * 60 * 1000;

@Injectable()
export class WeatherService {
  constructor(private http: HttpClient) {}

  getWeather(): Observable<WeatherObservation> {
    const now = Date.now();
    const params = new HttpParams()
      .set('f', 'json')
      .set('msc_id-value', STATION_ID)
      .set('datetime', new Date(now - MAX_OBSERVATION_AGE_MS).toISOString() + '/..')
      .set('sortby', '-date_tm-value')
      .set('limit', '10')
      .set('properties', 'air_temp,air_temp-uom,date_tm-value,stn_nam-value,msc_id-value');

    return this.http.get<GeoMetObservations>('https://api.weather.gc.ca/collections/swob-realtime/items', { params }).pipe(
      timeout(15000),
      map(response => {
        const observations: WeatherObservation[] = [];
        for (const feature of Array.isArray(response?.features) ? response.features : []) {
          const properties = feature?.properties;
          if (!properties || properties['msc_id-value'] !== STATION_ID || properties['air_temp-uom'] !== '°C') continue;

          const temperature = properties.air_temp;
          const observedAt = properties['date_tm-value'];
          if (typeof temperature !== 'number' || !Number.isFinite(temperature) || typeof observedAt !== 'string') continue;
          const timestamp = Date.parse(observedAt);
          if (!Number.isFinite(timestamp) || timestamp < now - MAX_OBSERVATION_AGE_MS || timestamp > now + 5 * 60 * 1000) continue;

          observations.push({
            temperatureC: temperature,
            observedAt: new Date(timestamp).toISOString(),
            station: typeof properties['stn_nam-value'] === 'string' ? properties['stn_nam-value'] : 'Calgary International CS'
          });
        }
        observations.sort((a, b) => Date.parse(b.observedAt) - Date.parse(a.observedAt));
        if (!observations.length) throw new Error('No recent Calgary temperature observation is available.');
        return observations[0];
      })
    );
  }
}
