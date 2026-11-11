import { expect, test } from '@playwright/test';

test('loads a recent live ECCC Calgary observation without a key or proxy', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const observation = page.waitForResponse(response =>
    response.url().startsWith('https://api.weather.gc.ca/collections/swob-realtime/items?'));
  await page.goto('/home');
  const response = await observation;
  expect(response.status()).toBe(200);
  const body = await response.json();
  const url = new URL(response.url());
  expect(url.searchParams.get('msc_id-value')).toBe('3031094');
  expect(url.searchParams.has('key')).toBe(false);
  const valid = body.features.map(feature => feature.properties).filter(properties =>
    properties['msc_id-value'] === '3031094' &&
    properties['air_temp-uom'] === '°C' &&
    typeof properties.air_temp === 'number' &&
    Number.isFinite(properties.air_temp) &&
    Date.parse(properties['date_tm-value']) >= Date.now() - 3 * 60 * 60 * 1000);
  valid.sort((a, b) => Date.parse(b['date_tm-value']) - Date.parse(a['date_tm-value']));
  expect(valid.length).toBeGreaterThan(0);
  const widget = page.getByRole('region', { name: 'Calgary temperature' });
  const expected = new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(valid[0].air_temp);
  await expect(widget.getByTestId('temperature')).toHaveText(`${expected} °C`);
  await expect(widget.getByTestId('temperature')).toHaveAttribute('title', new RegExp(valid[0]['date_tm-value'].slice(0, 19)));
  await expect(widget).toHaveAttribute('aria-busy', 'false');
  expect(errors).toEqual([]);
});
