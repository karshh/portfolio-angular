# Portfolio

This project uses Angular 22. Use Node.js 22.23.4 and npm 10. Run `npm ci`, then copy `config.ts.example` to `config.ts` and fill in the API settings you need.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm run build` to build the project. The build artifacts are stored in `dist/portfolio`. Use `npm run build -- --configuration production` for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `npx playwright install chromium` once, then `npm run e2e` to check page rendering, navigation, and contact-form validation. Playwright starts the local development server when needed. The tests use local API responses and skip the external Maps API.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Dependency compatibility

Angular 22 currently requires TypeScript 6.0.x, so TypeScript remains on 6.0.3 until Angular supports the next major release.

The minimatch override upgrades affected versions (7.x through 11.0.0) to patched 11.0.8 for ESLint and TypeScript ESLint. It leaves the older minimatch APIs used by Karma and coverage tooling unchanged. Remove the override once upstream dependencies request a patched release.
