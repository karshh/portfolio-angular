import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateComponent } from './template.component';

describe('TemplateComponent', () => {
  let component: TemplateComponent;
  let fixture: ComponentFixture<TemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateComponent ],
      imports: [RouterTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the shared brand and route order', () => {
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('.navbar-brand')?.textContent?.trim()).toBe('usharma');
    expect(Array.from(element.querySelectorAll('.nav-link')).map(link => link.textContent?.trim()))
      .toEqual(['home', 'news', 'sait', 'contact']);
  });

  it('keeps the mobile navigation accessible', () => {
    const toggle = fixture.nativeElement.querySelector('.navbar-toggler') as HTMLButtonElement;
    expect(toggle.getAttribute('aria-label')).toBe('Toggle navigation');
    expect(toggle.getAttribute('aria-controls')).toBe('navbarNavAltMarkup');
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('renders the current copyright year in the shared footer', () => {
    const footer = fixture.nativeElement.querySelector('.footer') as HTMLElement;
    expect(footer.textContent).toContain(`Karsh Sharma ${new Date().getFullYear()}`);
  });
});
