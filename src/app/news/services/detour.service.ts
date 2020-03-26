import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MapInfo } from '../classes/map-info';
import { Config } from '../../../../config';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Injectable()
export class DetourService {


	constructor(private http: HttpClient) {
	}


	getDetours(): Observable<MapInfo[]> {
		let headers = new HttpHeaders().set('$$app_token', Config.YYC_APP_TOKEN);
		return this.http.get(this.buildURL(), { headers })
			.pipe(map((result: Array<any>) => result.map(data => this.convertToDetours(data))));
	}

	private buildURL(): string {
		return Config.PROXY_URL + 'https://data.calgary.ca/resource/q5fe-imxj.json';
	}

	convertToDetours(ts: any): MapInfo {
		let detours: MapInfo = new MapInfo();
		detours.description = ts.description;
		detours.location = ts.construction_info;
		detours.latitude = +ts.latitude;
		detours.longitude = +ts.longitude;
		detours.created = new Date(ts.start_dt);

		return detours;

	}
}
