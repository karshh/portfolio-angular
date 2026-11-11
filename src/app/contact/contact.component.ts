import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ContactService } from '../services/contact.service';
import { Contact } from '../portfolio/classes/contact';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  standalone: false
})
export class ContactComponent implements OnInit {

	link: string;
  contactForm: UntypedFormGroup;

  name: UntypedFormControl;
  email: UntypedFormControl;
  subject: UntypedFormControl;
  message: UntypedFormControl;
  additionalInfo: UntypedFormControl;

  messagePassed: boolean;
  messageSent: boolean;

  errMessage: string;

  constructor(private contactService: ContactService) { 
    this.link = 'contact';

    this.messagePassed = false;
    this.errMessage = '';

    this.createFormControls();
    this.contactForm = new UntypedFormGroup({
      name: this.name,
      email: this.email,
      subject: this.subject,
      message: this.message,
      additionalInfo: this.additionalInfo
    });
     
  }

  private createFormControls(): void { 
    this.name = new UntypedFormControl('', Validators.required);
    this.email = new UntypedFormControl('', [ Validators.required, Validators.email]);
    this.subject = new UntypedFormControl('', Validators.required);
    this.message = new UntypedFormControl('', [Validators.required]);
    this.additionalInfo = new UntypedFormControl();
  }

  ngOnInit() {
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
    };

    this.contactService.sendEmail(contact);
    this.messagePassed = true;
    this.contactForm.reset();
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
    contact._replyto = form.email;
    contact._subject = form.subject;
    contact.message = form.message;
    contact._honeypot = form.additionalInfo;
    contact._confirmation = 'sent.';

    return contact;
  }

}
