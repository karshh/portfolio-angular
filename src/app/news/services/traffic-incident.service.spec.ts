import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TrafficIncidentService } from './traffic-incident.service';

const ENDPOINT = 'https://data.calgary.ca/resource/35ra-9556.json';

describe('TrafficIncidentService', () => {
  let service: TrafficIncidentService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrafficIncidentService, provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
    });
    service = TestBed.inject(TrafficIncidentService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('queries recently modified incidents and maps the current API fields', () => {
    let result;
    service.getTrafficIncidents(new Date('2026-11-11T21:14:00Z')).subscribe(items => result = items);

    const request = http.expectOne(req => req.url === ENDPOINT);
    expect(request.request.headers.has('$$app_token')).toBeFalse();
    expect(request.request.params.get('$where')).toBe("modified_dt_utc >= '2026-11-11T15:14:00.000'");
    expect(request.request.params.get('$order')).toBe('modified_dt_utc DESC');
    request.flush([
      {
        incident_info: 'Memorial Drive and 5a Street NW',
        description: 'Traffic incident.',
        start_dt_utc: '2026-11-11T18:51:38.000',
        modified_dt_utc: '2026-11-11T18:52:55.000',
        latitude: '51.056973', longitude: '-114.07577'
      },
      { incident_info: 'Invalid', description: '', start_dt_utc: 'bad', latitude: 'none', longitude: 'none' }
    ]);

    expect(result.length).toBe(1);
    expect(result[0].location).toBe('Memorial Drive and 5a Street NW');
    expect(result[0].created.toISOString()).toBe('2026-11-11T18:51:38.000Z');
  });
});
