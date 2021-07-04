import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MapInfo } from '../classes/map-info';
import { Config } from '../../../../config';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable()
export class DetourService {

	private url = Config.PROXY_URL + 'https://data.calgary.ca/resource/w8zq-79bq.json';

	constructor(private http: HttpClient) {
	}

	getDetours(): Observable<MapInfo[]> {
		let headers = new HttpHeaders().set('$$app_token', Config.YYC_APP_TOKEN);
		return this.http.get(this.url, { headers })
			.pipe(map((result: Array<any>) => result.map((ts: any) => new MapInfo(ts.description, ts.construction_info, +ts.latitude, +ts.longitude, new Date(ts.start_dt)))));
	}
}
