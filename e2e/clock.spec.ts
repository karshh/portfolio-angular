import { expect, test } from '@playwright/test';
import { calgaryWeather } from './fixtures/weather';

test.beforeEach(async ({ page }) => {
  await page.route(/^https:\/\/api\.weather\.gc\.ca\/collections\/swob-realtime\/items\?/, route =>
    route.fulfill({ json: calgaryWeather(12.3, '2026-11-11T20:30:05Z') }));
});

for (const timezoneId of ['UTC', 'Asia/Tokyo']) {
  test.describe(`visitor time zone ${timezoneId}`, () => {
    test.use({ timezoneId });

    test('shows Calgary time and keeps ticking independently of the visitor zone', async ({ page }) => {
      await page.clock.install({ time: new Date('2026-11-11T20:30:00Z') });
      await page.clock.pauseAt(new Date('2026-11-11T20:30:05Z'));
      await page.goto('/home');
      await page.clock.runFor(1);
      const clock = page.getByRole('timer', { name: 'Calgary time' });
      await expect(clock).toHaveText('2:30:05 PM ABT');
      await page.clock.runFor(1000);
      await expect(clock).toHaveText('2:30:06 PM ABT');
    });
  });
}

test('does not move Calgary back an hour at the November 2026 changeover', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-11-01T07:59:54Z') });
  await page.clock.pauseAt(new Date('2026-11-01T07:59:59Z'));
  await page.goto('/home');
  await page.clock.runFor(1);
  const clock = page.getByRole('timer', { name: 'Calgary time' });
  await expect(clock).toHaveText('1:59:59 AM MDT');
  await page.clock.runFor(1000);
  await expect(clock).toHaveText('2:00:00 AM ABT');
});

test('keeps UTC−6 in the following winter', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-01-15T20:30:05Z'));
  await page.goto('/home');
  await expect(page.getByRole('timer', { name: 'Calgary time' })).toHaveText('2:30:05 PM ABT');
});
