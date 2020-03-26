import { TestBed, inject } from '@angular/core/testing';

import { NewsService } from './news.service';

describe('NewsroomService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewsService]
    });
  });

  it('should be created', inject([NewsService], (service: NewsService) => {
    expect(service).toBeTruthy();
  }));
});
