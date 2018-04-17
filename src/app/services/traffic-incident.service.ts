import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MapInfo } from '../classes/map-info';
import { Config } from './config';

@Injectable()
export class TrafficIncidentService {

	private loaded: boolean;
	private trafficIncidentList: Array<MapInfo>;

  constructor(private http: HttpClient) {
  	this.loaded = false;
  	this.trafficIncidentList = [];
  	this.updateTrafficIncidents();
  }

  private updateTrafficIncidents(): void {
  	this.getTrafficIncidents();
  	setTimeout(this.updateTrafficIncidents, 1000 * 60 * 30); // update every 30 mins.
  }

  private getTrafficIncidents() {
  	this.trafficIncidentList = [];
  	let headers = new HttpHeaders().set('$$app_token', Config.YYC_APP_TOKEN);
  	this.http.get(this.buildURL(), { 'headers': headers})
  	.subscribe((data: any) => {
		let yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
  		for (var i = 0; i < data.length; i++) {
  			let ts: MapInfo = this.convertToTrafficIncident(data[i]);
  			// Only add in data from the last 24 hours.
  			if (ts.updated > yesterday) this.trafficIncidentList.push(ts);
  		}
  		this.loaded = true;
  	});
  }
  
  private buildURL(): string {
  	return 'https://data.calgary.ca/resource/m328-x8wy.json?$limit=20000';
  }

  convertToTrafficIncident(ts: any): MapInfo {
  	let trafficIncident: MapInfo = new MapInfo(); 
	trafficIncident.description = ts.description;
	trafficIncident.location = ts.incident_info;
	trafficIncident.latitude = +ts.latitude;
	trafficIncident.longitude = +ts.longitude;

	trafficIncident.updated = new Date(ts.modified_dt);
	trafficIncident.created = new Date(ts.start_dt);

	return trafficIncident;

  }

  isLoaded(): boolean {
  	return this.loaded && this.trafficIncidentList != null;
  }


  getTrafficIncidentList(): Array<MapInfo> {
  	return this.trafficIncidentList;
  }

}
