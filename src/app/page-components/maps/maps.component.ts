import { Component, OnInit, Input } from '@angular/core';
import { MapStyle } from '../../services/config';
import { MapInfo } from '../../classes/map-info';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {

  zoom: number = 10;
  latitude: number = 51.0486;
  longitude: number = -114.0708;
  mapStyles: any = MapStyle;

  @Input() title:string;
  @Input() mapInfoList:Array<MapInfo>;

  constructor() { }

  ngOnInit() {
  }

}
