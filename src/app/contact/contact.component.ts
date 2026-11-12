import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Inject, NgZone, OnDestroy, PLATFORM_ID, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ContactService } from '../services/contact.service';
import { Contact } from '../portfolio/classes/contact';

interface TurnstileApi {
  render(container: HTMLElement, options: Record<string, unknown>): string;
  reset(widgetId?: string): void;
}

declare global {
  interface Window { turnstile?: TurnstileApi; }
}

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})

export class ContactComponent implements AfterViewInit, OnDestroy {

  @ViewChild('turnstileContainer') turnstileContainer?: ElementRef<HTMLElement>;

	link: string;
  contactForm: UntypedFormGroup;

  name: UntypedFormControl;
  email: UntypedFormControl;
  subject: UntypedFormControl;
  message: UntypedFormControl;
  website: UntypedFormControl;
  turnstileToken: UntypedFormControl;

  messagePassed: boolean;
  messageSent: boolean;

  errMessage: string;

  private widgetId?: string;
  constructor(
    private contactService: ContactService,
    private zone: NgZone,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.link = 'contact';

    this.messagePassed = false;
    this.errMessage = '';

    this.createFormControls();
    this.contactForm = new UntypedFormGroup({
      name: this.name,
      email: this.email,
      subject: this.subject,
      message: this.message,
      website: this.website,
      turnstileToken: this.turnstileToken
    });
     
  }

  private createFormControls(): void { 
    this.name = new UntypedFormControl('', Validators.required);
    this.email = new UntypedFormControl('', [ Validators.required, Validators.email]);
    this.subject = new UntypedFormControl('', Validators.required);
    this.message = new UntypedFormControl('', [Validators.required]);
    this.website = new UntypedFormControl('');
    this.turnstileToken = new UntypedFormControl('', Validators.required);
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.contactService.getConfig().subscribe({
      next: ({ turnstileSiteKey }) => this.loadTurnstile(turnstileSiteKey),
      error: () => this.errMessage = 'The contact form is temporarily unavailable.'
    });
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId) && this.widgetId && window.turnstile) {
      window.turnstile.reset(this.widgetId);
    }
  }

  onSubmit(): void {
    this.messagePassed = false;
    
    if (!this.contactForm.valid) {
      this.errMessage = 'Please fix the invalid inputs.';
      return;
    }


    this.errMessage = '';
    let contact: Contact = this.buildContact(this.contactForm.value);
    
    // checking this.messagePassed after this return checks if the 
    // service is already sending a message.
    if (!this.isAvailable()) {
      this.errMessage = 'The service is currently busy. Please try again in a bit.';
      return;
    }

    this.contactService.sendEmail(contact);
    this.messagePassed = true;
    this.contactForm.reset({ website: '', turnstileToken: '' });
    if (isPlatformBrowser(this.platformId) && window.turnstile) {
      window.turnstile.reset(this.widgetId);
    }
  }

  isAvailable():boolean {
    return this.contactService.isAvailable();
  }

  isSuccess():boolean {
    return this.contactService.isSuccess();
  }

  isFailure():boolean {
    return this.contactService.isFailure();
  }

  isBusy():boolean {
    return this.contactService.isBusy();
  }

  resetStatus(): boolean {
    if (!this.contactService.resetStatus()) return false;
    this.messagePassed = false;
    return true;
  }

  buildContact(form:any): Contact {
    let contact:Contact = new Contact();

    contact.name = form.name;
    contact.email = form.email;
    contact.subject = form.subject;
    contact.message = form.message;
    contact.website = form.website;
    contact.turnstileToken = form.turnstileToken;

    return contact;
  }

  private loadTurnstile(siteKey: string): void {
    if (window.turnstile) {
      this.renderTurnstile(siteKey);
      return;
    }

    const existing = this.document.querySelector<HTMLScriptElement>('script[data-portfolio-turnstile]');
    const script = existing ?? this.document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.dataset['portfolioTurnstile'] = 'true';
    script.addEventListener('load', () => this.renderTurnstile(siteKey), { once: true });
    script.addEventListener('error', () => {
      this.errMessage = 'The anti-spam check could not load. Please refresh and try again.';
    }, { once: true });
    if (!existing) this.document.head.appendChild(script);
  }

  private renderTurnstile(siteKey: string): void {
    if (!this.turnstileContainer || !window.turnstile || this.widgetId) return;
    this.widgetId = window.turnstile.render(this.turnstileContainer.nativeElement, {
      sitekey: siteKey,
      theme: 'light',
      size: 'flexible',
      callback: (token: string) => this.zone.run(() => this.turnstileToken.setValue(token)),
      'expired-callback': () => this.zone.run(() => this.turnstileToken.reset('')),
      'error-callback': () => this.zone.run(() => {
        this.turnstileToken.reset('');
        this.errMessage = 'The anti-spam check failed. Please try again.';
      })
    });
  }

}
