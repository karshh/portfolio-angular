import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';

import { ContactService } from './contact.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ContactService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [ContactService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    });
  });

  it('should be created', inject([ContactService], (service: ContactService) => {
    expect(service).toBeTruthy();
  }));
});
