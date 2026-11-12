# Portfolio

This project uses Angular 22 with server-side rendering. Use Node.js 22.23.4 and npm 10, then run `npm ci`.

## Development server

Run `npm run dev:ssr -- --port 4200` for the Angular and Node development server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm run build:ssr` to build the browser and server bundles in `dist/portfolio`. Run `npm run serve:ssr` to serve the completed build.

## Running unit tests

Run `npm test -- --watch=false --browsers=ChromeHeadless` for browser unit tests and `npm run test:server` for the contact API tests.

## Running end-to-end tests

Run `npx playwright install chromium` once, then `npm run e2e` to check page rendering, navigation, and contact-form validation. Playwright starts the local development server when needed. The tests use local API responses and skip the external Maps API.

## Secure contact form

The contact form posts to the same-origin Node endpoint at `/api/contact`. The recipient address and email-provider key are server-only environment variables and are never included in the browser bundle. The endpoint validates field types and lengths, checks a hidden honeypot, verifies Cloudflare Turnstile, rate-limits each client, and sends mail through Resend's HTTPS API.

Local development uses Cloudflare's official always-pass Turnstile test credentials and treats delivery as a dry run. Production fails closed unless all of these variables are set:

- `TURNSTILE_SITE_KEY`: public key for the deployed hostname
- `TURNSTILE_SECRET_KEY`: private Turnstile verification key
- `RESEND_API_KEY`: private Resend API key
- `CONTACT_TO_EMAIL`: fixed private recipient address
- `CONTACT_FROM_EMAIL`: verified sender, such as `Portfolio <contact@example.com>`
- `NG_ALLOWED_HOSTS`: optional comma-separated custom hostnames; `localhost`, `127.0.0.1`, and `*.koyeb.app` are already allowed

Do not use the local test keys in production. No auto-reply is sent, which avoids giving spammers an email relay.

### Free hobby deployment

Build the included Dockerfile as one Koyeb Web Service using its `free` instance, port `4000`, and health path `/health`. Add the production variables above as secrets. The free Koyeb hostname works without buying a domain; its instance scales to zero after an idle hour, so the first request after inactivity can be slower. Resend's free plan and Cloudflare Turnstile's free plan are sufficient for hobby traffic.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Dependency compatibility

Angular 22 currently requires TypeScript 6.0.x, so TypeScript remains on 6.0.3 until Angular supports the next major release. Chokidar 5 is an explicit development dependency to satisfy Angular DevKit's optional `^5.0.0` peer; Karma keeps its own compatible Chokidar 3 copy.

The minimatch override upgrades affected versions (7.x through 11.0.0) to patched 11.0.8 for ESLint and TypeScript ESLint. It leaves the older minimatch APIs used by Karma and coverage tooling unchanged. Remove the override once upstream dependencies request a patched release.

## Calgary weather widget

The Home page reads Celsius observations directly from [Environment and Climate Change Canada GeoMet](https://api.weather.gc.ca/collections/swob-stations/items/3031094?f=html), using Calgary International CS station `3031094`. No weather API key, SDK, or CORS proxy is needed. The widget credits ECCC as required by its [data licence](https://eccc-msc.github.io/open-data/licence/readme_en/).

The News page reads recent traffic incidents and currently active construction detours directly from [Open Calgary](https://data.calgary.ca/) and displays them with Leaflet and OpenStreetMap. The maps require no API key or billing account and retain visible OpenStreetMap attribution.

Weather loads on entry and refreshes every ten minutes. Requests time out after 15 seconds. Missing, malformed, or more than three-hour-old observations show “Weather unavailable” with a retry button; automatic refresh continues after errors. Zero and negative temperatures display normally. Hover over the temperature to see its station and observation timestamp.

`npm run e2e` uses deterministic GeoMet responses for widget states. Run `npx playwright test --project=live-weather` for the opt-in check against the real GeoMet API; it requires internet access and fails if the live service is unavailable.

## Calgary clock

The Home clock follows Calgary time independently of the visitor’s time zone. From November 1, 2026 it uses Alberta Time (ABT), UTC−6 year-round, as specified by the [Government of Alberta](https://www.alberta.ca/albertas-new-time-system-abt). A fixed IANA offset is used after that transition so older browser time-zone databases cannot incorrectly move the clock back an hour in winter. Earlier dates use the historical `America/Edmonton` rules.
