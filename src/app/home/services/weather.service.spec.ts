import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { WeatherService } from './weather.service';

const URL = 'https://api.weather.gc.ca/collections/swob-realtime/items';
const NOW = Date.parse('2026-11-11T12:00:00Z');

function feature(temperature: unknown, overrides: Record<string, unknown> = {}) {
  return { properties: {
    air_temp: temperature,
    'air_temp-uom': '°C',
    'date_tm-value': '2026-11-11T11:45:00Z',
    'msc_id-value': '3031094',
    'stn_nam-value': "CALGARY INT'L CS",
    ...overrides
  } };
}

describe('WeatherService', () => {
  let service: WeatherService;
  let http: HttpTestingController;

  beforeEach(() => {
    spyOn(Date, 'now').and.returnValue(NOW);
    TestBed.configureTestingModule({ providers: [WeatherService, provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(WeatherService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('requests recent Calgary observations directly without an API key or proxy', async () => {
    const observation = firstValueFrom(service.getWeather());
    const request = http.expectOne(r => r.url === URL);
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('msc_id-value')).toBe('3031094');
    expect(request.request.params.get('datetime')).toBe('2026-11-11T09:00:00.000Z/..');
    expect(request.request.params.get('sortby')).toBe('-date_tm-value');
    expect(request.request.params.get('limit')).toBe('10');
    expect(request.request.params.get('properties')).toContain('air_temp-uom');
    expect(request.request.params.has('key')).toBeFalse();
    request.flush({ features: [feature(12.3)] });
    expect(await observation).toEqual({ temperatureC: 12.3, observedAt: '2026-11-11T11:45:00.000Z', station: "CALGARY INT'L CS" });
  });

  for (const temperature of [0, -18.4]) {
    it(`accepts ${temperature} degrees Celsius`, async () => {
      const observation = firstValueFrom(service.getWeather());
      http.expectOne(r => r.url === URL).flush({ features: [feature(temperature)] });
      expect((await observation).temperatureC).toBe(temperature);
    });
  }

  it('selects the newest valid observation and skips missing readings', async () => {
    const observation = firstValueFrom(service.getWeather());
    http.expectOne(r => r.url === URL).flush({ features: [
      feature(2, { 'date_tm-value': '2026-11-11T11:00:00Z' }),
      feature(null, { 'date_tm-value': '2026-11-11T11:59:00Z' }),
      feature(4, { 'date_tm-value': '2026-11-11T11:50:00Z' })
    ] });
    expect((await observation).temperatureC).toBe(4);
  });

  const invalidResponses = [
    { name: 'empty observations', body: { features: [] } },
    { name: 'malformed data', body: { features: 'invalid' } },
    { name: 'null temperature', body: { features: [feature(null)] } },
    { name: 'a string temperature', body: { features: [feature('12')] } },
    { name: 'another station', body: { features: [feature(12, { 'msc_id-value': 'other' })] } },
    { name: 'non-Celsius units', body: { features: [feature(60, { 'air_temp-uom': '°F' })] } },
    { name: 'an invalid timestamp', body: { features: [feature(12, { 'date_tm-value': 'invalid' })] } },
    { name: 'stale data', body: { features: [feature(12, { 'date_tm-value': '2026-11-11T08:00:00Z' })] } },
    { name: 'future data', body: { features: [feature(12, { 'date_tm-value': '2026-11-11T13:00:00Z' })] } }
  ];
  for (const { name, body } of invalidResponses) {
    it(`rejects ${name} instead of displaying a misleading temperature`, async () => {
      const observation = firstValueFrom(service.getWeather());
      http.expectOne(r => r.url === URL).flush(body);
      await expectAsync(observation).toBeRejectedWithError('No recent Calgary temperature observation is available.');
    });
  }

  it('propagates HTTP failures for the widget error state', async () => {
    const observation = firstValueFrom(service.getWeather());
    http.expectOne(r => r.url === URL).flush('Unavailable', { status: 503, statusText: 'Service Unavailable' });
    await expectAsync(observation).toBeRejectedWith(jasmine.objectContaining({ status: 503 }));
  });

  it('times out a stalled request after 15 seconds', () => {
    const scheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected));
    scheduler.run(() => {
      let failure: Error;
      service.getWeather().subscribe({ error: error => failure = error });
      const request = http.expectOne(r => r.url === URL);
      scheduler.flush();
      expect(failure.name).toBe('TimeoutError');
      expect(request.cancelled).toBeTrue();
    });
  });
});
