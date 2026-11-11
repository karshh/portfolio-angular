import { expect, test } from '@playwright/test';
import { calgaryWeather } from './fixtures/weather';
import { activeDetours, trafficIncidents } from './fixtures/maps';

test.beforeEach(async ({ page }) => {
  await page.route('**/cors-anywhere.herokuapp.com/**', route => route.fulfill({ json: [] }));
  await page.route('https://data.calgary.ca/resource/35ra-9556.json?**', route => route.fulfill({ json: trafficIncidents }));
  await page.route('https://data.calgary.ca/resource/w8zq-79bq.json?**', route => route.fulfill({ json: activeDetours }));
  await page.route('https://tile.openstreetmap.org/**', route => route.abort());
  await page.route('https://api.weather.gc.ca/collections/swob-realtime/items?**', route =>
    route.fulfill({ json: calgaryWeather() }));
});

for (const [route, heading] of [
  ['home', '{ name = Karsh }'],
  ['news', 'Recent Local News'],
  ['sait', 'Technical Summary'],
  ['contact', 'Contact Form']
]) {
  test(`${route} loads directly and navigates home`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`/${route}`);
    await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();

    if (route === 'contact') {
      const submit = page.getByRole('button', { name: 'Submit', exact: true });
      await expect(submit).toBeDisabled();
      await page.locator('#name').fill('Local verification');
      await page.locator('input[name=email]').fill('invalid');
      await page.locator('input[name=subject]').fill('Local verification');
      await page.locator('textarea[name=message]').fill('Local verification');
      await expect(submit).toBeDisabled();
      await page.locator('input[name=email]').fill('local@example.com');
      await expect(submit).toBeEnabled();
    }

    await page.getByRole('link', { name: /^home$/i }).click();
    await expect(page.getByRole('heading', { name: '{ name = Karsh }', exact: true })).toBeVisible();
    expect(errors).toEqual([]);
  });
}
