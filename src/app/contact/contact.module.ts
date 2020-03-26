
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './contact.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactService } from '../services/contact.service';
import { SubmitButtonComponent } from '../page-components/submit-button/submit-button.component';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  { path: '', component: ContactComponent }
];

@NgModule({
  declarations: [
    ContactComponent,
    SubmitButtonComponent
  ],
  providers: [
    ContactService
  ],
  imports: [
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(routes)
  ] // import MODULES
})
export class ContactModule { }