import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { randomBytes } from 'node:crypto';
import { join } from 'node:path';
import { createContactRouter } from './contact-api';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine({
  trustProxyHeaders: ['x-forwarded-host', 'x-forwarded-proto']
});

app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use((_request, response, next) => {
  const nonce = randomBytes(18).toString('base64');
  response.locals['cspNonce'] = nonce;
  response.set({
    'Content-Security-Policy': `default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; font-src 'self' data: https://cdnjs.cloudflare.com; script-src 'self' 'nonce-${nonce}' https://challenges.cloudflare.com https://cdn.jsdelivr.net; frame-src https://challenges.cloudflare.com; connect-src 'self' https://challenges.cloudflare.com https://api.weather.gc.ca https://data.calgary.ca https://*.tile.openstreetmap.org; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`,
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY'
  });
  next();
});
app.use('/api/contact', express.json({ limit: '12kb', type: 'application/json' }), createContactRouter());
app.get('/health', (_request, response) => response.json({ status: 'ok' }));

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then(async (response) => {
      if (!response) {
        next();
        return;
      }

      if (response.headers.get('content-type')?.includes('text/html')) {
        const nonce = res.locals['cspNonce'] as string;
        const html = (await response.text())
          .replace('<app-root', `<app-root ngCspNonce="${nonce}"`)
          .replace(/<script\b(?![^>]*\bnonce=)/g, `<script nonce="${nonce}"`);
        response.headers.forEach((value, key) => {
          if (key !== 'content-length' && key !== 'content-security-policy') res.setHeader(key, value);
        });
        res.status(response.status).set('Cache-Control', 'no-store').send(html);
        return;
      }

      writeResponseToNodeResponse(response, res);
    })
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
