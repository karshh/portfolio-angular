import { NewsModule } from './news.module';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsComponent } from './news.component';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

describe('NewsComponent', () => {
  let component: NewsComponent;
  let fixture: ComponentFixture<NewsComponent>;

  beforeEach(async () => {
    spyOn(google.maps, 'importLibrary').and.callFake(() => Promise.reject(new Error('Maps API unavailable')));
    await TestBed.configureTestingModule({
      imports: [NewsModule],
      providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
