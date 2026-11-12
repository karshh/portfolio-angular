import { ContactModule } from './contact.module';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactComponent } from './contact.component';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactModule],
      providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
    })
    .compileComponents();
  });

  beforeEach(() => {
    window.turnstile = {
      render: (_container, options) => {
        (options['callback'] as (token: string) => void)('test-token');
        return 'widget-id';
      },
      reset: () => undefined
    };
    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    http = TestBed.inject(HttpTestingController);
    http.expectOne('/api/contact/config').flush({ turnstileSiteKey: 'public-key' });
    fixture.detectChanges();
  });

  afterEach(() => {
    http.verify();
    fixture.destroy();
    delete window.turnstile;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('submits the verified form through the same-origin API', () => {
    component.contactForm.patchValue({
      name: 'Visitor',
      email: 'visitor@example.com',
      subject: 'Hello',
      message: 'A test message',
      turnstileToken: 'test-token'
    });
    component.onSubmit();
    const request = http.expectOne('/api/contact');
    expect(request.request.body.email).toBe('visitor@example.com');
    expect(request.request.body.turnstileToken).toBe('test-token');
    request.flush({ sent: true });
    expect(component.isSuccess()).toBeTrue();
  });
});
