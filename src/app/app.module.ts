import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NavItemComponent } from './nav-item/nav-item.component';
import { NavListComponent } from './nav-list/nav-list.component';
import { HomeJumboComponent } from './home-jumbo/home-jumbo.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { TitleComponent } from './page-components/title/title.component';
import { FormInputComponent } from './page-components/form-input/form-input.component';
import { FormTextAreaComponent } from './page-components/form-text-area/form-text-area.component';
import { LoginComponent } from './login/login.component';
import {AUTH_PROVIDERS } from './services/auth.service';
import { LoggedInGuard } from './guards/logged-in.guard';
import { LoginRedirectGuard } from './guards/login-redirect.guard';
import { SubmitButtonComponent } from './page-components/submit-button/submit-button.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeJumboComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'portfolio', component: PortfolioComponent },

  // authentication.
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate:[LoginRedirectGuard] }

];

@NgModule({
  declarations: [
    AppComponent,
    NavItemComponent,
    NavListComponent,
    HomeJumboComponent,
    AboutComponent,
    ContactComponent,
    TitleComponent,
    FormInputComponent,
    FormTextAreaComponent,
    LoginComponent,
    SubmitButtonComponent,
    PortfolioComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    AUTH_PROVIDERS,
    LoggedInGuard,
    LoginRedirectGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
