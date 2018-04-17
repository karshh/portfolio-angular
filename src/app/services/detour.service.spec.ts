import { TestBed, inject } from '@angular/core/testing';

import { DetourService } from './detour.service';

describe('DetourService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DetourService]
    });
  });

  it('should be created', inject([DetourService], (service: DetourService) => {
    expect(service).toBeTruthy();
  }));
});
