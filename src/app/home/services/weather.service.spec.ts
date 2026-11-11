import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';
import { WeatherService } from './weather.service';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';


describe('WeatherService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [WeatherService, provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
    });
  });

  it('should be created', inject([WeatherService], (service: WeatherService) => {
    expect(service).toBeTruthy();
  }));
});
