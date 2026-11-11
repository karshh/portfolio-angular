import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';

import { NewsService } from './news.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('NewsroomService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [NewsService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    });
  });

  it('should be created', inject([NewsService], (service: NewsService) => {
    expect(service).toBeTruthy();
  }));
});
