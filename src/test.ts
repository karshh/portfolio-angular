// Initializes the Angular test environment. The Angular CLI discovers the test files.

import { provideZonelessChangeDetection } from '@angular/core';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  { teardown: { destroyAfterEach: false } }
);

// Native async tests avoid patching Jasmine APIs, which are read-only in Jasmine 7.
beforeEach(() => {
  getTestBed().configureTestingModule({ providers: [provideZonelessChangeDetection()] });
});
