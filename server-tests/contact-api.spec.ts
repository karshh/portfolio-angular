import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import express from 'express';
import type { Server } from 'node:http';
import { createContactRouter, validateContactMessage, type ContactApiOptions } from '../src/contact-api';

const validContact = {
  name: 'Test Visitor',
  email: 'visitor@example.com',
  subject: 'Hello',
  message: 'A test message.',
  website: '',
  turnstileToken: 'XXXX.DUMMY.TOKEN.XXXX'
};

const servers: Server[] = [];

afterEach(async () => {
  await Promise.all(servers.splice(0).map((server) => new Promise<void>((resolve) => server.close(() => resolve()))));
});

async function startApi(options: ContactApiOptions = {}): Promise<string> {
  const application = express();
  application.set('trust proxy', 1);
  application.use('/api/contact', express.json({ limit: '12kb' }), createContactRouter(options));
  const server = application.listen(0, '127.0.0.1');
  servers.push(server);
  await new Promise<void>((resolve) => server.once('listening', resolve));
  const address = server.address();
  assert(address && typeof address === 'object');
  return `http://127.0.0.1:${address.port}`;
}

describe('contact API', () => {
  it('strictly validates contact fields and the honeypot', () => {
    assert.deepEqual(validateContactMessage(validContact), validContact);
    assert.equal(validateContactMessage({ ...validContact, website: 'spam.example' }), null);
    assert.equal(validateContactMessage({ ...validContact, email: 'not-an-email' }), null);
    assert.equal(validateContactMessage({ ...validContact, message: 'x'.repeat(5001) }), null);
  });

  it('exposes only the public Turnstile site key', async () => {
    const baseUrl = await startApi({
      environment: {
        NODE_ENV: 'production',
        TURNSTILE_SITE_KEY: 'public-site-key',
        TURNSTILE_SECRET_KEY: 'private-secret',
        RESEND_API_KEY: 'resend-key',
        CONTACT_TO_EMAIL: 'owner@example.com',
        CONTACT_FROM_EMAIL: 'Portfolio <portfolio@example.com>'
      }
    });
    const response = await fetch(`${baseUrl}/api/contact/config`);
    assert.equal(response.status, 200);
    const body = await response.text();
    assert.deepEqual(JSON.parse(body), { turnstileSiteKey: 'public-site-key' });
    assert.equal(body.includes('private-secret'), false);
  });

  it('fails closed in production when delivery secrets are missing', async () => {
    const baseUrl = await startApi({
      environment: {
        NODE_ENV: 'production',
        TURNSTILE_SITE_KEY: 'public-site-key',
        TURNSTILE_SECRET_KEY: 'private-secret'
      }
    });
    const response = await fetch(`${baseUrl}/api/contact/config`);
    assert.equal(response.status, 503);
  });

  it('rejects a failed anti-spam challenge without sending email', async () => {
    let calls = 0;
    const baseUrl = await startApi({
      fetch: async () => {
        calls += 1;
        return new Response(JSON.stringify({ success: false }), { status: 200 });
      }
    });
    const response = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validContact)
    });
    assert.equal(response.status, 400);
    assert.equal(calls, 1);
  });

  it('delivers to the fixed server-side recipient and escapes HTML', async () => {
    const calls: Array<{ url: string; body: string }> = [];
    const baseUrl = await startApi({
      environment: {
        NODE_ENV: 'production',
        TURNSTILE_SITE_KEY: 'public-key',
        TURNSTILE_SECRET_KEY: 'secret-key',
        RESEND_API_KEY: 'resend-key',
        CONTACT_TO_EMAIL: 'owner@example.com',
        CONTACT_FROM_EMAIL: 'Portfolio <portfolio@example.com>'
      },
      fetch: async (input, init) => {
        calls.push({ url: String(input), body: String(init?.body ?? '') });
        return new Response(JSON.stringify(calls.length === 1 ? { success: true } : { id: 'email-id' }), { status: 200 });
      }
    });
    const response = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...validContact, name: '<Visitor>' })
    });
    assert.equal(response.status, 202);
    assert.equal(calls.length, 2);
    const email = JSON.parse(calls[1].body);
    assert.deepEqual(email.to, ['owner@example.com']);
    assert.equal(email.reply_to, 'visitor@example.com');
    assert.match(email.html, /&lt;Visitor&gt;/);
    assert.doesNotMatch(email.html, /<Visitor>/);
  });

  it('rate limits repeated successful submissions', async () => {
    let timestamp = 1_000_000;
    const baseUrl = await startApi({
      now: () => timestamp,
      fetch: async () => new Response(JSON.stringify({ success: true }), { status: 200 })
    });
    const send = () => fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validContact)
    });
    assert.equal((await send()).status, 202);
    timestamp += 1000;
    assert.equal((await send()).status, 202);
    timestamp += 1000;
    const limited = await send();
    assert.equal(limited.status, 429);
    assert.equal(limited.headers.get('retry-after'), '600');
  });
});
