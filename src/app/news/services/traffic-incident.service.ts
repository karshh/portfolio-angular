import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from '../../../../config';
import { MapInfo } from '../classes/map-info';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class TrafficIncidentService {

	private url = Config.PROXY_URL + 'https://data.calgary.ca/resource/35ra-9556.json?$limit=20000';

	constructor(private http: HttpClient) {}

	getTrafficIncidents(): Observable<MapInfo[]> {
		let headers = new HttpHeaders().set('$$app_token', Config.YYC_APP_TOKEN);
		return this.http.get(this.url, { 'headers': headers })
			.pipe(map((data: Array<any>) => {
				let yesterday = new Date();
				yesterday.setHours(yesterday.getHours() - 6); // only show traffic data thats been updated in the last 6 hours

				let trafficIncidentList: MapInfo[] = data
				.filter((ts) => ts.created < yesterday)
				.map((ts) => new MapInfo(ts.description, ts.incident_info, +ts.latitude, +ts.longitude, new Date(ts.start_dt)));
				return trafficIncidentList;
			}));
	}
}
