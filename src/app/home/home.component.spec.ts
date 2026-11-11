import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject, of, throwError } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { HomeComponent } from './home.component';
import { WeatherObservation, WeatherService } from './services/weather.service';

const observation: WeatherObservation = {
  temperatureC: 12.3,
  observedAt: '2026-11-11T11:45:00.000Z',
  station: "CALGARY INT'L CS"
};

describe('HomeComponent weather widget', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let weather: jasmine.SpyObj<WeatherService>;
  let response: Subject<WeatherObservation>;

  beforeEach(async () => {
    weather = jasmine.createSpyObj<WeatherService>('WeatherService', ['getWeather']);
    response = new Subject<WeatherObservation>();
    weather.getWeather.and.returnValue(response);
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [CommonModule],
      providers: [{ provide: WeatherService, useValue: weather }]
    }).compileComponents();
  });

  afterEach(() => fixture?.destroy());

  function create() {
    fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    return fixture.nativeElement.querySelector('[aria-label="Calgary temperature"]') as HTMLElement;
  }

  it('shows an accessible loading indicator while the request is pending', () => {
    const widget = create();
    expect(widget.getAttribute('aria-busy')).toBe('true');
    expect(widget.querySelector('img').alt).toBe('Loading Calgary temperature');
    expect(weather.getWeather).toHaveBeenCalledTimes(1);
  });

  for (const temperature of [12.3, 0, -18.4]) {
    it(`displays ${temperature} degrees without a loading indicator`, () => {
      const widget = create();
      response.next({ ...observation, temperatureC: temperature });
      fixture.detectChanges();
      expect(widget.querySelector('[data-testid="temperature"]').textContent.trim()).toBe(`${temperature} °C`);
      expect(widget.querySelector('img')).toBeNull();
      expect(widget.getAttribute('aria-busy')).toBe('false');
      expect(widget.querySelector('[data-testid="temperature"]').getAttribute('title')).toContain(observation.observedAt);
      expect(widget.textContent).toContain('Environment and Climate Change Canada');
    });
  }

  it('shows an error, stops loading, and recovers when Retry is clicked', () => {
    const widget = create();
    response.error(new Error('Offline'));
    fixture.detectChanges();
    expect(widget.textContent).toContain('Weather unavailable');
    expect(widget.querySelector('img')).toBeNull();
    expect(widget.getAttribute('aria-busy')).toBe('false');
    weather.getWeather.and.returnValue(of(observation));
    widget.querySelector('button').click();
    fixture.detectChanges();
    expect(weather.getWeather).toHaveBeenCalledTimes(2);
    expect(widget.querySelector('[data-testid="temperature"]').textContent).toContain('12.3 °C');
    expect(widget.textContent).not.toContain('Weather unavailable');
  });

  it('continues automatic refresh after an API failure', () => {
    const scheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected));
    weather.getWeather.and.returnValues(throwError(() => new Error('Offline')), of(observation));
    scheduler.run(({ expectObservable }) => {
      const component = new HomeComponent(weather);
      component.ngOnInit();
      expectObservable(component.weather$, '600001ms !').toBe('(le) 599996ms (lr)', {
        l: { status: 'loading' }, e: { status: 'error' }, r: { status: 'ready', observation }
      });
    });
    expect(weather.getWeather).toHaveBeenCalledTimes(2);
  });
});
