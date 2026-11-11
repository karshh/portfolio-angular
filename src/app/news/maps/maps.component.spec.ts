import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GoogleMapsModule, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { MapInfo } from '../classes/map-info';
import { MapsComponent } from './maps.component';

describe('MapsComponent', () => {
  let component: MapsComponent;
  let fixture: ComponentFixture<MapsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapsComponent],
      imports: [GoogleMapsModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapsComponent);
    component = fixture.componentInstance;
  });

  it('keeps the map hidden and shows a fallback if the Maps API fails to load', async () => {
    spyOn(google.maps, 'importLibrary').and.callFake(() => Promise.reject(new Error('Maps API unavailable')));

    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('google-map')).toBeNull();

    expect(await component.mapsStatus$.toPromise()).toBe('unavailable');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Map unavailable.');
  });

  it('shows the selected incident in the shared info window', () => {
    const marker = {} as MapMarker;
    const infoWindow = jasmine.createSpyObj<MapInfoWindow>('MapInfoWindow', ['open']);
    const incident = new MapInfo('Road closure', 'Calgary', 51.0486, -114.0516, new Date());

    component.openInfoWindow(marker, incident, infoWindow);

    expect(component.selectedIncident).toBe(incident);
    expect(infoWindow.open).toHaveBeenCalledWith(marker);
  });
});
