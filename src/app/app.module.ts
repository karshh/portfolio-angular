import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { TemplateComponent } from './template/template.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
  { path: 'contact', loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule) },
  { path: 'sait', loadChildren: () => import('./portfolio/portfolio.module').then(m => m.PortfolioModule) },
  { path: 'news', loadChildren: () => import('./news/news.module').then(m => m.NewsModule) },
  { path: '**', redirectTo: '/home', pathMatch: 'full'}

  // authentication.
];

@NgModule({
  declarations: [
    AppComponent,
    TemplateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
