import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewsPanelComponent } from './news-panel.component';

describe('NewsPanelComponent', () => {
  let component: NewsPanelComponent;
  let fixture: ComponentFixture<NewsPanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewsPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
