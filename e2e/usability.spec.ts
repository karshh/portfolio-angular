import { expect, test } from '@playwright/test';
import { calgaryWeather } from './fixtures/weather';
import { activeDetours, trafficIncidents } from './fixtures/maps';

const routes = ['home', 'news', 'sait', 'contact'];

test.beforeEach(async ({ page }) => {
  await page.route('https://api.weather.gc.ca/collections/swob-realtime/items?**', route => route.fulfill({ json: calgaryWeather() }));
  await page.route('https://data.calgary.ca/resource/3x6m-4vs7.json?**', route => route.fulfill({ json: [] }));
  await page.route('https://data.calgary.ca/resource/35ra-9556.json?**', route => route.fulfill({ json: trafficIncidents }));
  await page.route('https://data.calgary.ca/resource/w8zq-79bq.json?**', route => route.fulfill({ json: activeDetours }));
  await page.route('https://tile.openstreetmap.org/**', route => route.abort());
});

for (const width of [390, 768, 1440]) {
  for (const route of routes) {
    test(`${route} remains within a ${width}px viewport`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${route}`);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await expect(page.getByRole('navigation')).toBeVisible();
      await expect(page.locator('.footer')).toContainText('Karsh Sharma');
    });
  }
}

test('shared visual tokens match the portfolio contract', async ({ page }) => {
  await page.goto('/home');
  await expect(page.getByRole('navigation')).toHaveCSS('background-color', 'rgb(38, 38, 38)');
  await expect(page.locator('.footer')).toHaveCSS('background-color', 'rgb(32, 32, 32)');
  await expect(page.locator('body')).toHaveCSS('font-family', /LucidaConsole/);
  const footerHeight = await page.locator('.footer').evaluate(element => element.getBoundingClientRect().height);
  expect(footerHeight).toBe(60);
});

test('mobile navigation collapses and exposes every route', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/home');
  const toggle = page.getByRole('button', { name: 'Toggle navigation' });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('navigation').getByRole('link', { name: /^news$/i })).toBeVisible();
});

test('contact controls are keyboard reachable in label order', async ({ page }) => {
  await page.route('**/api/contact/config', route => route.fulfill({ status: 503, json: { error: 'unavailable' } }));
  await page.goto('/contact#contact-form');
  await page.getByLabel('Name').focus();
  await expect(page.getByLabel('Name')).toBeFocused();
  await page.keyboard.press('Tab'); await expect(page.getByLabel('Email')).toBeFocused();
  await page.keyboard.press('Tab'); await expect(page.getByLabel('Subject')).toBeFocused();
  await page.keyboard.press('Tab'); await expect(page.getByLabel('Message')).toBeFocused();
});
