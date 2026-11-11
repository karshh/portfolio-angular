import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MapInfo } from '../classes/map-info';
import { MapsComponent } from './maps.component';

describe('MapsComponent', () => {
  let component: MapsComponent;
  let fixture: ComponentFixture<MapsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ declarations: [MapsComponent] }).compileComponents();
    fixture = TestBed.createComponent(MapsComponent);
    component = fixture.componentInstance;
    component.title = 'Traffic Incidents';
  });

  afterEach(() => fixture.destroy());

  it('renders a Leaflet map and marker with the muted legacy visual treatment', async () => {
    component.mapInfo = of([
      new MapInfo('Road closure', 'Memorial Drive', 51.0569, -114.0757, new Date('2026-11-11T18:51:38Z'))
    ]);

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.status).toBe('ready');
    expect(fixture.nativeElement.querySelector('.leaflet-container')).not.toBeNull();
    expect(fixture.nativeElement.querySelectorAll('.leaflet-interactive').length).toBe(1);
    expect(fixture.nativeElement.querySelector('.leaflet-tile-pane').style.filter).toContain('grayscale');
  });

  it('shows a retryable error and recovers', async () => {
    component.mapInfo = throwError(() => new Error('Unavailable'));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.status).toBe('error');
    expect(fixture.nativeElement.textContent).toContain('temporarily unavailable');

    component.mapInfo = of([]);
    component.retry();
    fixture.detectChanges();
    expect(component.status).toBe('empty');
    expect(fixture.nativeElement.textContent).toContain('No traffic incidents to display.');
  });
});
