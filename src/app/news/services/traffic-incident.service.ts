import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from '../../../../config';
import { MapInfo } from '../classes/map-info';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class TrafficIncidentService {


	constructor(private http: HttpClient) {
	}


	getTrafficIncidents(): Observable<MapInfo[]> {
		let headers = new HttpHeaders().set('$$app_token', Config.YYC_APP_TOKEN);
		return this.http.get(this.buildURL(), { 'headers': headers })
			.pipe(map((data: any) => {
				let trafficIncidentList: MapInfo[] = [];
				let yesterday = new Date();
				yesterday.setHours(yesterday.getHours() - 6); // only show traffic data thats been updated in the last 6 hours
				for (var i = 0; i < data.length; i++) {
					let ts: MapInfo = this.convertToTrafficIncident(data[i]);
					if (ts.created >= yesterday) trafficIncidentList.push(ts);
				}
				return trafficIncidentList;
			}));
	}

	private buildURL(): string {
		return Config.PROXY_URL + 'https://data.calgary.ca/resource/35ra-9556.json?$limit=20000';
	}

	convertToTrafficIncident(ts: any): MapInfo {
		let trafficIncident: MapInfo = new MapInfo();
		trafficIncident.description = ts.description;
		trafficIncident.location = ts.incident_info;
		trafficIncident.latitude = +ts.latitude;
		trafficIncident.longitude = +ts.longitude;

		trafficIncident.created = new Date(ts.start_dt);

		return trafficIncident;

	}
}
