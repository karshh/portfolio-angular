import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DetourService } from './detour.service';

const ENDPOINT = 'https://data.calgary.ca/resource/w8zq-79bq.json';

describe('DetourService', () => {
  let service: DetourService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DetourService, provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
    });
    service = TestBed.inject(DetourService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('queries detours active at Calgary time and validates their coordinates', () => {
    let result;
    service.getDetours(new Date('2026-11-11T21:14:00Z')).subscribe(items => result = items);

    const request = http.expectOne(req => req.url === ENDPOINT);
    expect(request.request.headers.has('$$app_token')).toBeFalse();
    expect(request.request.params.get('$where')).toBe("start_dt <= '2026-11-11T15:14:00' AND end_dt >= '2026-11-11T15:14:00'");
    request.flush([
      {
        construction_info: 'Memorial Drive at 3 Street NW',
        description: 'Right lane closure westbound.',
        start_dt: '2026-11-09T10:00:00.000', end_dt: '2026-11-12T15:00:00.000',
        latitude: '51.057504', longitude: '-114.070122'
      },
      { construction_info: '', description: 'Invalid', start_dt: 'bad', latitude: '', longitude: '' }
    ]);

    expect(result.length).toBe(1);
    expect(result[0].location).toBe('Memorial Drive at 3 Street NW');
  });
});
