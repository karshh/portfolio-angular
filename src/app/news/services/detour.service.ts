import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { defer, map, Observable } from 'rxjs';
import { MapInfo } from '../classes/map-info';

interface CalgaryDetour {
  construction_info?: string;
  description?: string;
  start_dt?: string;
  end_dt?: string;
  latitude?: string;
  longitude?: string;
}

const DETOUR_ENDPOINT = 'https://data.calgary.ca/resource/w8zq-79bq.json';
const PERMANENT_ALBERTA_TIME_START = Date.parse('2026-11-01T08:00:00Z');

@Injectable()
export class DetourService {
  constructor(private readonly http: HttpClient) {}

  getDetours(now?: Date): Observable<MapInfo[]> {
    return defer(() => {
      const calgaryNow = this.toCalgaryFloatingTimestamp(now ?? new Date());
      const params = new HttpParams()
        .set('$select', 'construction_info,description,start_dt,end_dt,longitude,latitude')
        .set('$where', `start_dt <= '${calgaryNow}' AND end_dt >= '${calgaryNow}'`)
        .set('$order', 'start_dt DESC')
        .set('$limit', '500');

      return this.http.get<CalgaryDetour[]>(DETOUR_ENDPOINT, { params }).pipe(
        map(items => items
          .map(item => this.toMapInfo(item))
          .filter((item): item is MapInfo => item !== null))
      );
    });
  }

  private toMapInfo(item: CalgaryDetour): MapInfo | null {
    const latitude = Number(item.latitude);
    const longitude = Number(item.longitude);
    const created = item.start_dt ? new Date(item.start_dt) : null;
    if (!item.description?.trim() || !item.construction_info?.trim() ||
        !Number.isFinite(latitude) || !Number.isFinite(longitude) ||
        !created || Number.isNaN(created.valueOf())) return null;

    return new MapInfo(item.description.trim(), item.construction_info.trim(), latitude, longitude, created);
  }

  private toCalgaryFloatingTimestamp(instant: Date): string {
    const timeZone = instant.valueOf() >= PERMANENT_ALBERTA_TIME_START ? 'Etc/GMT+6' : 'America/Edmonton';
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hourCycle: 'h23'
    }).formatToParts(instant);
    const value = (type: Intl.DateTimeFormatPartTypes) => parts.find(part => part.type === type)?.value;
    return `${value('year')}-${value('month')}-${value('day')}T${value('hour')}:${value('minute')}:${value('second')}`;
  }
}
