import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SkillListComponent } from './skill-list.component';

describe('SkillListComponent', () => {
  let component: SkillListComponent;
  let fixture: ComponentFixture<SkillListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
