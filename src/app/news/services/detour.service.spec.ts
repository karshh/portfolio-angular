import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';

import { DetourService } from './detour.service';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

describe('DetourService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [DetourService, provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
    });
  });

  it('should be created', inject([DetourService], (service: DetourService) => {
    expect(service).toBeTruthy();
  }));
});
