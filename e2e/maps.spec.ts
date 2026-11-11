import { expect, test } from '@playwright/test';
import { activeDetours, trafficIncidents } from './fixtures/maps';

const news = [{
  title: 'Calgary headline',
  pubdate: '2026-11-11T12:00:00',
  link: 'https://newsroom.calgary.ca/story/'
}];

test.beforeEach(async ({ page }) => {
  await page.route('https://data.calgary.ca/resource/3x6m-4vs7.json?**', route => route.fulfill({ json: news }));
  await page.route('https://tile.openstreetmap.org/**', route => route.abort());
});

test('renders both muted Leaflet maps, markers, attribution, and safe popup text', async ({ page }) => {
  await page.route('https://data.calgary.ca/resource/35ra-9556.json?**', route => route.fulfill({ json: trafficIncidents }));
  await page.route('https://data.calgary.ca/resource/w8zq-79bq.json?**', route => route.fulfill({ json: activeDetours }));
  await page.goto('/news');

  const traffic = page.locator('app-maps').filter({ hasText: 'Traffic Incidents' });
  const detours = page.locator('app-maps').filter({ hasText: 'Current Detours' });
  await expect(traffic.locator('.leaflet-interactive')).toHaveCount(2);
  await expect(detours.locator('.leaflet-interactive')).toHaveCount(2);
  await expect(traffic.getByText('OpenStreetMap')).toBeVisible();
  await expect(traffic.locator('.leaflet-tile-pane')).toHaveCSS('filter', /grayscale/);

  await traffic.locator('.leaflet-interactive').first().click();
  await expect(traffic.locator('.leaflet-popup-content')).toContainText('Memorial Drive and 5a Street NW');
  await expect(traffic.locator('.leaflet-popup-content')).toContainText('Traffic incident.');
});

test('shows a retryable feed error and recovers without rebuilding the map', async ({ page }) => {
  let attempts = 0;
  await page.route('https://data.calgary.ca/resource/35ra-9556.json?**', route => {
    attempts += 1;
    return attempts === 1 ? route.fulfill({ status: 503, body: 'Unavailable' }) : route.fulfill({ json: trafficIncidents });
  });
  await page.route('https://data.calgary.ca/resource/w8zq-79bq.json?**', route => route.fulfill({ json: activeDetours }));
  await page.goto('/news');

  const traffic = page.locator('app-maps').filter({ hasText: 'Traffic Incidents' });
  await expect(traffic.getByRole('alert')).toContainText('temporarily unavailable');
  await traffic.getByRole('button', { name: 'Retry traffic incidents' }).click();
  await expect(traffic.locator('.leaflet-interactive')).toHaveCount(2);
  await expect(traffic.getByRole('alert')).toHaveCount(0);
});

test('keeps both maps inside the mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route('https://data.calgary.ca/resource/35ra-9556.json?**', route => route.fulfill({ json: trafficIncidents }));
  await page.route('https://data.calgary.ca/resource/w8zq-79bq.json?**', route => route.fulfill({ json: activeDetours }));
  await page.goto('/news');

  for (const map of await page.locator('[data-testid="leaflet-map"]').all()) {
    const bounds = await map.boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(390);
  }
});
