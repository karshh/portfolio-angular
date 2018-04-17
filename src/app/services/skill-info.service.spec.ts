import { TestBed, inject } from '@angular/core/testing';

import { SkillInfoService } from './skill-info.service';

describe('SkillInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SkillInfoService]
    });
  });

  it('should be created', inject([SkillInfoService], (service: SkillInfoService) => {
    expect(service).toBeTruthy();
  }));
});
