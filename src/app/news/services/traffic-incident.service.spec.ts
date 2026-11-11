import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';
import { TrafficIncidentService } from './traffic-incident.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';


describe('TrafficIncidentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [TrafficIncidentService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    });
  });

  it('should be created', inject([TrafficIncidentService], (service: TrafficIncidentService) => {
    expect(service).toBeTruthy();
  }));
});
