import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { Loader } from '@googlemaps/js-api-loader';
import { defer, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Config, MapStyle } from '../../../../config';
import { MapInfo } from '../classes/map-info';

const mapsLoader = new Loader({ apiKey: Config.GOOGLE_API_KEY });

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class MapsComponent {
  @Input() title: string;
  @Input() mapInfo: Observable<MapInfo[]>;
  @Input() showLastUpdated = false;

  readonly mapOptions: google.maps.MapOptions = {
    center: { lat: 51.0486, lng: -114.0516 },
    zoom: 10,
    disableDefaultUI: true,
    styles: MapStyle
  };
  readonly mapsStatus$ = defer(() => Promise.all([
    mapsLoader.importLibrary('maps'),
    mapsLoader.importLibrary('marker')
  ])).pipe(
    map(() => 'ready'),
    catchError(() => of('unavailable'))
  );

  selectedIncident: MapInfo;

  openInfoWindow(marker: MapMarker, incident: MapInfo, infoWindow: MapInfoWindow): void {
    this.selectedIncident = incident;
    infoWindow.open(marker);
  }
}
