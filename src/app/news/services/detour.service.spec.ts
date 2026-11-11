import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';

import { DetourService } from './detour.service';

describe('DetourService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DetourService]
    });
  });

  it('should be created', inject([DetourService], (service: DetourService) => {
    expect(service).toBeTruthy();
  }));
});
