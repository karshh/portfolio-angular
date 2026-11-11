import { expect, test } from '@playwright/test';
import { calgaryWeather } from './fixtures/weather';

const ENDPOINT = 'https://api.weather.gc.ca/collections/swob-realtime/items?**';

test.beforeEach(async ({ page }) => {
  await page.route('**/cors-anywhere.herokuapp.com/**', route => route.abort());
});

for (const temperature of [12.3, 0, -18.4]) {
  test(`Calgary widget displays ${temperature} °C from GeoMet`, async ({ page }) => {
    let requests = 0;
    const legacyRequests: string[] = [];
    page.on('request', request => {
      if (/weatherapi\.com|cors-anywhere/.test(request.url())) legacyRequests.push(request.url());
    });
    await page.route(ENDPOINT, async route => {
      const url = new URL(route.request().url());
      expect(url.searchParams.get('msc_id-value')).toBe('3031094');
      expect(url.searchParams.get('sortby')).toBe('-date_tm-value');
      expect(url.searchParams.has('key')).toBe(false);
      requests++;
      await route.fulfill({ json: calgaryWeather(temperature) });
    });
    await page.goto('/home');
    const widget = page.getByRole('region', { name: 'Calgary temperature' });
    await expect(widget.getByTestId('temperature')).toHaveText(`${temperature} °C`);
    await expect(widget).toHaveAttribute('aria-busy', 'false');
    await expect(widget.getByRole('img', { name: 'Loading Calgary temperature' })).toHaveCount(0);
    await expect(widget.getByRole('link', { name: 'Environment and Climate Change Canada' })).toBeVisible();
    expect(requests).toBe(1);
    expect(legacyRequests).toEqual([]);
  });
}

test('shows loading until the observation arrives', async ({ page }) => {
  let release: () => void;
  const gate = new Promise<void>(resolve => release = resolve);
  await page.route(ENDPOINT, async route => {
    await gate;
    await route.fulfill({ json: calgaryWeather(8.5) });
  });
  await page.goto('/home');
  const widget = page.getByRole('region', { name: 'Calgary temperature' });
  await expect(widget).toHaveAttribute('aria-busy', 'true');
  await expect(widget.getByRole('img', { name: 'Loading Calgary temperature' })).toBeVisible();
  release();
  await expect(widget.getByTestId('temperature')).toHaveText('8.5 °C');
  await expect(widget).toHaveAttribute('aria-busy', 'false');
});

for (const failure of ['http', 'empty', 'stale', 'malformed', 'network']) {
  test(`${failure} failure shows unavailable and Retry recovers`, async ({ page }) => {
    let attempts = 0;
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route(ENDPOINT, async route => {
      if (++attempts > 1) return route.fulfill({ json: calgaryWeather(5) });
      if (failure === 'network') return route.abort();
      if (failure === 'http') return route.fulfill({ status: 503, body: 'Unavailable' });
      if (failure === 'empty') return route.fulfill({ json: { features: [] } });
      if (failure === 'malformed') return route.fulfill({ json: { features: 'invalid' } });
      return route.fulfill({ json: calgaryWeather(5, new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()) });
    });
    await page.goto('/home');
    const widget = page.getByRole('region', { name: 'Calgary temperature' });
    await expect(widget).toContainText('Weather unavailable');
    await expect(widget).toHaveAttribute('aria-busy', 'false');
    await expect(widget.getByRole('img')).toHaveCount(0);
    await widget.getByRole('button', { name: 'Retry weather' }).click();
    await expect(widget.getByTestId('temperature')).toHaveText('5 °C');
    expect(attempts).toBe(2);
    expect(errors).toEqual([]);
  });
}

test('a hung request stops loading after 15 seconds and can be retried', async ({ page }) => {
  await page.clock.install();
  let attempts = 0;
  await page.route(ENDPOINT, route => {
    if (++attempts > 1) return route.fulfill({ json: calgaryWeather(2) });
    // Intentionally leave the first intercepted request unanswered; the app must time out.
  });
  await page.goto('/home');
  const widget = page.getByRole('region', { name: 'Calgary temperature' });
  await expect(widget.getByRole('img', { name: 'Loading Calgary temperature' })).toBeVisible();
  await page.clock.runFor(15001);
  await expect(widget).toContainText('Weather unavailable');
  await widget.getByRole('button', { name: 'Retry weather' }).click();
  await expect(widget.getByTestId('temperature')).toHaveText('2 °C');
});

test('automatic refresh recovers after an error', async ({ page }) => {
  await page.clock.install();
  let attempts = 0;
  await page.route(ENDPOINT, route => ++attempts === 1
    ? route.fulfill({ status: 503, body: 'Unavailable' })
    : route.fulfill({ json: calgaryWeather(3.2) }));
  await page.goto('/home');
  const widget = page.getByRole('region', { name: 'Calgary temperature' });
  await expect(widget).toContainText('Weather unavailable');
  await page.clock.runFor(600001);
  await expect(widget.getByTestId('temperature')).toHaveText('3.2 °C');
  expect(attempts).toBe(2);
});

test('Calgary temperature and source attribution remain usable on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route(ENDPOINT, route => route.fulfill({ json: calgaryWeather(-5.6) }));
  await page.goto('/home');
  const widget = page.getByRole('region', { name: 'Calgary temperature' });
  await expect(widget.getByTestId('temperature')).toHaveText('-5.6 °C');
  await expect(widget.getByRole('link', { name: 'Environment and Climate Change Canada' })).toBeVisible();
  const bounds = await widget.boundingBox();
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(390);
});
