import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeJumboComponent } from './home-jumbo.component';

describe('HomeJumboComponent', () => {
  let component: HomeJumboComponent;
  let fixture: ComponentFixture<HomeJumboComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeJumboComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeJumboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
