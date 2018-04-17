import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators  } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

	link: string;
  contactForm: FormGroup;

  name: FormControl;
  email: FormControl;
  subject: FormControl;
  message: FormControl;

  errMessage: string;

  constructor() { 
    this.errMessage = '';
  	this.link = 'contact';
    this.createFormControls();
    this.contactForm = new FormGroup({
      name: this.name,
      email: this.email,
      subject: this.subject,
      message: this.message
    });
     
  }

  private createFormControls(): void { 
    this.name = new FormControl('', Validators.required);
    this.email = new FormControl('', [ Validators.required, Validators.email]);
    this.subject = new FormControl('', Validators.required);
    this.message = new FormControl('', [Validators.required]);
  }

  ngOnInit() {
  }

  onSubmit(): void {
    if (!this.contactForm.valid) {
      this.errMessage = 'Please fix the invalid inputs.';
      return;
    }


    this.errMessage = '';
    console.log('Form submitted:', this.contactForm.value);
    this.contactForm.reset();
  }

}