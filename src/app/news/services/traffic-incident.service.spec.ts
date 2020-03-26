import { TestBed, inject } from '@angular/core/testing';
import { TrafficIncidentService } from './traffic-incident.service';


describe('TrafficIncidentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrafficIncidentService]
    });
  });

  it('should be created', inject([TrafficIncidentService], (service: TrafficIncidentService) => {
    expect(service).toBeTruthy();
  }));
});
