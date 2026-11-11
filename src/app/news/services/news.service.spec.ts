import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { NewsService, NewsState } from './news.service';

const ENDPOINT = 'https://data.calgary.ca/resource/3x6m-4vs7.json';

describe('NewsService', () => {
  let service: NewsService;
  let http: HttpTestingController;
  let subscription: Subscription | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewsService, provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
    });
    service = TestBed.inject(NewsService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    subscription?.unsubscribe();
    http.verify();
  });

  it('loads, validates, and sorts the current City of Calgary response shape', () => {
    const states: NewsState[] = [];
    subscription = service.state$.subscribe(state => states.push(state));

    const request = http.expectOne(req => req.url === ENDPOINT);
    expect(request.request.headers.has('$$app_token')).toBeFalse();
    expect(request.request.params.get('$limit')).toBe('11');
    expect(request.request.params.get('$order')).toBe('pubdate DESC');
    request.flush([
      { title: ' Older story ', pubdate: '2026-11-09T12:00:00', link: 'https://newsroom.calgary.ca/older/' },
      { title: 'Newest story', pubdate: '2026-11-11T12:00:00', link: 'https://newsroom.calgary.ca/newest/' },
      { title: 'Bad date', pubdate: 'not-a-date', link: 'https://newsroom.calgary.ca/bad/' },
      { title: 'Unsafe link', pubdate: '2026-11-10T12:00:00', link: 'http://example.com/' }
    ]);

    expect(states[0].status).toBe('loading');
    const ready = states.at(-1);
    expect(ready?.status).toBe('ready');
    if (ready?.status !== 'ready') fail('Expected ready news state');
    expect(ready.news.map(item => item.title)).toEqual(['Newest story', 'Older story']);
    expect(ready.news[0].link.href).toBe('https://newsroom.calgary.ca/newest/');
  });

  it('shows an error and successfully retries without ending future refreshes', () => {
    const states: NewsState[] = [];
    subscription = service.state$.subscribe(state => states.push(state));

    http.expectOne(req => req.url === ENDPOINT).flush('Unavailable', { status: 503, statusText: 'Unavailable' });
    expect(states.at(-1)?.status).toBe('error');

    service.retry();
    expect(states.at(-1)?.status).toBe('loading');
    http.expectOne(req => req.url === ENDPOINT).flush([
      { title: 'Recovered story', pubdate: '2026-11-11T12:00:00', link: 'https://newsroom.calgary.ca/recovered/' }
    ]);

    const recovered = states.at(-1);
    expect(recovered?.status).toBe('ready');
    if (recovered?.status !== 'ready') fail('Expected recovered news state');
    expect(recovered.news[0].title).toBe('Recovered story');
  });
});
