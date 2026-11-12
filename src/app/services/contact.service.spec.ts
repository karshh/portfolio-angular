import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ContactService } from './contact.service';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

describe('ContactService', () => {
  let service: ContactService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [ContactService, provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
    });
    service = TestBed.inject(ContactService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('loads only the public contact configuration', () => {
    let siteKey = '';
    service.getConfig().subscribe(config => siteKey = config.turnstileSiteKey);
    http.expectOne('/api/contact/config').flush({ turnstileSiteKey: 'public-key' });
    expect(siteKey).toBe('public-key');
  });

  it('posts contact messages to the same-origin API and reports success', () => {
    const contact = {
      name: 'Visitor',
      email: 'visitor@example.com',
      subject: 'Hello',
      message: 'Test message',
      website: '',
      turnstileToken: 'test-token'
    };
    service.sendEmail(contact);
    expect(service.isBusy()).toBeTrue();
    const request = http.expectOne('/api/contact');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(contact);
    request.flush({ sent: true });
    expect(service.isSuccess()).toBeTrue();
  });

  it('reports a failed send', () => {
    service.sendEmail({
      name: 'Visitor', email: 'visitor@example.com', subject: 'Hello', message: 'Test', website: '', turnstileToken: 'token'
    });
    http.expectOne('/api/contact').flush({ error: 'failed' }, { status: 502, statusText: 'Bad Gateway' });
    expect(service.isFailure()).toBeTrue();
  });
});
