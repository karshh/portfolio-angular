import { Component, OnInit, Input } from '@angular/core';
import { MapStyle } from '../../../../config';
import { MapInfo } from '../classes/map-info';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {

  zoom: number = 10;
  latitude: number = 51.0486;
  longitude: number = -114.0516;
  mapStyles: any = MapStyle;

  @Input() title:string;
  @Input() mapInfo: Observable<MapInfo[]>;
  @Input() showLastUpdated = false;
  constructor() { }

  ngOnInit() {
  }

}
