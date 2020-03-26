import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MapInfo } from '../classes/map-info';
import { Config } from '../../../../config';


@Injectable()
export class DetourService {

	private loaded: boolean;
	private detoursList: Array<MapInfo>;

	constructor(private http: HttpClient) {
		this.loaded = false;
		this.detoursList = [];
		this.updateDetours();
	}

	private updateDetours(): void {
		this.getDetours();
		setTimeout(this.updateDetours, 1000 * 60 * 60 * 1); // update every 1 hour.
	}

	private getDetours() {
		this.detoursList = [];
		let headers = new HttpHeaders().set('$$app_token', Config.YYC_APP_TOKEN);
		this.http.get(this.buildURL(), { headers })
			.subscribe((data: any) => {
				for (var i = 0; i < data.length; i++) {
					let ts: MapInfo = this.convertToDetours(data[i]);
					this.detoursList.push(ts);
				}
				this.loaded = true;
			});
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

	isLoaded(): boolean {
		return this.loaded && this.detoursList != null;
	}


	getDetoursList(): Array<MapInfo> {
		return this.detoursList;
	}

}
