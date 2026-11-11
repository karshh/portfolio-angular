import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { Observable, Subscription } from 'rxjs';
import { MapInfo } from '../classes/map-info';

type MapStatus = 'loading' | 'ready' | 'empty' | 'error';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class MapsComponent implements AfterViewInit, OnDestroy {
  @Input() title: string;
  @Input() mapInfo: Observable<MapInfo[]>;
  @Input() showLastUpdated = false;
  @ViewChild('mapContainer') private mapContainer: ElementRef<HTMLDivElement>;

  status: MapStatus = 'loading';
  private map: L.Map;
  private markers: L.LayerGroup;
  private subscription: Subscription;

  constructor(private readonly changeDetector: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.map = L.map(this.mapContainer.nativeElement, {
      center: [51.0486, -114.0516],
      zoom: 10,
      zoomControl: true
    });
    this.map.getPane('tilePane').style.filter = 'grayscale(1) contrast(0.9) brightness(1.08)';
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    this.markers = L.layerGroup().addTo(this.map);
    Promise.resolve().then(() => this.loadMarkers());
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.map?.remove();
  }

  retry(): void {
    this.loadMarkers();
  }

  private loadMarkers(): void {
    this.subscription?.unsubscribe();
    this.status = 'loading';
    this.changeDetector.markForCheck();
    this.subscription = this.mapInfo.subscribe({
      next: items => this.renderMarkers(items),
      error: () => {
        this.markers.clearLayers();
        this.status = 'error';
        this.changeDetector.markForCheck();
      }
    });
  }

  private renderMarkers(items: MapInfo[]): void {
    this.markers.clearLayers();
    const bounds = L.latLngBounds([]);
    for (const item of items) {
      const marker = L.circleMarker([item.latitude, item.longitude], {
        radius: 7,
        color: '#fff',
        weight: 2,
        fillColor: '#dc3545',
        fillOpacity: 0.9
      });
      marker.bindPopup(this.createPopup(item));
      marker.addTo(this.markers);
      bounds.extend([item.latitude, item.longitude]);
    }
    if (bounds.isValid()) this.map.fitBounds(bounds.pad(0.2), { maxZoom: 14 });
    else this.map.setView([51.0486, -114.0516], 10);
    this.status = items.length ? 'ready' : 'empty';
    this.changeDetector.markForCheck();
  }

  private createPopup(item: MapInfo): HTMLElement {
    const popup = document.createElement('div');
    const location = document.createElement('strong');
    location.textContent = item.location;
    const description = document.createElement('p');
    description.textContent = item.description;
    popup.append(location, description);
    if (this.showLastUpdated) {
      const timestamp = document.createElement('p');
      timestamp.textContent = `Started: ${item.created.toLocaleString()}`;
      popup.append(timestamp);
    }
    return popup;
  }
}
