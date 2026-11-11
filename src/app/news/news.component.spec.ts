import { Loader } from '@googlemaps/js-api-loader';
import { NewsModule } from './news.module';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewsComponent } from './news.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('NewsComponent', () => {
  let component: NewsComponent;
  let fixture: ComponentFixture<NewsComponent>;

  beforeEach(waitForAsync(() => {
    spyOn(Loader.prototype, 'importLibrary').and.callFake(() => Promise.reject(new Error('Maps API unavailable')));
    TestBed.configureTestingModule({
      imports: [NewsModule],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    })
    .compileComponents();
  }));

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
