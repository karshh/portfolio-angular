import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { defer, map, Observable } from 'rxjs';
import { MapInfo } from '../classes/map-info';

interface CalgaryTrafficIncident {
  incident_info?: string;
  description?: string;
  start_dt_utc?: string;
  modified_dt_utc?: string;
  latitude?: string;
  longitude?: string;
}

const TRAFFIC_ENDPOINT = 'https://data.calgary.ca/resource/35ra-9556.json';
const RECENT_INCIDENT_WINDOW_MS = 6 * 60 * 60 * 1000;

@Injectable()
export class TrafficIncidentService {
  constructor(private readonly http: HttpClient) {}

  getTrafficIncidents(now?: Date): Observable<MapInfo[]> {
    return defer(() => {
      const cutoff = new Date((now ?? new Date()).getTime() - RECENT_INCIDENT_WINDOW_MS).toISOString().replace(/Z$/, '');
      const params = new HttpParams()
        .set('$select', 'incident_info,description,start_dt_utc,modified_dt_utc,longitude,latitude')
        .set('$where', `modified_dt_utc >= '${cutoff}'`)
        .set('$order', 'modified_dt_utc DESC')
        .set('$limit', '200');

      return this.http.get<CalgaryTrafficIncident[]>(TRAFFIC_ENDPOINT, { params }).pipe(
        map(items => items
          .map(item => this.toMapInfo(item))
          .filter((item): item is MapInfo => item !== null))
      );
    });
  }

  private toMapInfo(item: CalgaryTrafficIncident): MapInfo | null {
    const latitude = Number(item.latitude);
    const longitude = Number(item.longitude);
    const created = this.parseUtcDate(item.start_dt_utc);
    if (!item.description?.trim() || !item.incident_info?.trim() ||
        !Number.isFinite(latitude) || !Number.isFinite(longitude) || !created) return null;

    return new MapInfo(item.description.trim(), item.incident_info.trim(), latitude, longitude, created);
  }

  private parseUtcDate(value?: string): Date | null {
    if (!value) return null;
    const date = new Date(value.endsWith('Z') ? value : `${value}Z`);
    return Number.isNaN(date.valueOf()) ? null : date;
  }
}
