import { expect, test } from '@playwright/test';
import { activeDetours, trafficIncidents } from './fixtures/maps';
import { calgaryWeather } from './fixtures/weather';

const routes = [
  { path: 'home', heading: '{ name = Karsh }' },
  { path: 'news', heading: 'Recent Local News' },
  { path: 'sait', heading: 'Technical Summary' },
  { path: 'contact', heading: 'Contact Form' }
] as const;

const newsItems = Array.from({ length: 11 }, (_, index) => ({
  title: `Calgary headline ${index + 1}`,
  pubdate: '2026-11-11T12:00:00',
  link: `https://newsroom.calgary.ca/story-${index + 1}/`
}));

test.beforeEach(async ({ page }) => {
  await page.route('https://api.weather.gc.ca/collections/swob-realtime/items?**', route =>
    route.fulfill({ json: calgaryWeather(12.3, '2026-11-11T20:30:05Z') }));
  await page.route('https://data.calgary.ca/resource/3x6m-4vs7.json?**', route =>
    route.fulfill({ json: newsItems }));
  await page.route('https://data.calgary.ca/resource/35ra-9556.json?**', route =>
    route.fulfill({ json: trafficIncidents }));
  await page.route('https://data.calgary.ca/resource/w8zq-79bq.json?**', route =>
    route.fulfill({ json: activeDetours }));
  await page.route('https://tile.openstreetmap.org/**', route => route.abort());
});

test('root and unknown routes redirect to home', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/home$/);
  await expect(page.getByRole('heading', { name: '{ name = Karsh }' })).toBeVisible();

  await page.goto('/not-a-real-page');
  await expect(page).toHaveURL(/\/home$/);
  await expect(page.getByRole('heading', { name: '{ name = Karsh }' })).toBeVisible();
});

for (const route of routes) {
  test(`${route.path} supports direct navigation without browser errors`, async ({ page }) => {
    const browserErrors: string[] = [];
    page.on('pageerror', error => browserErrors.push(error.message));

    await page.goto(`/${route.path}`);
    await expect(page.getByRole('heading', { name: route.heading, exact: true })).toBeVisible();
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.locator('.footer')).toContainText('Karsh Sharma');
    expect(browserErrors).toEqual([]);
  });
}

test('document metadata and shared landmarks are present', async ({ page }) => {
  await page.goto('/home');

  await expect(page).toHaveTitle('Portfolio');
  expect(await page.locator('html').getAttribute('lang')).toBe('en');
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(page.locator('router-outlet')).toHaveCount(1);
  await expect(page.locator('.footer')).toBeVisible();
});

test('home exposes deterministic weather, Calgary time, and profile links', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-11-11T20:30:05Z'));
  await page.goto('/home');

  await expect(page.getByTestId('temperature')).toHaveText('12.3 °C');
  await expect(page.getByRole('timer', { name: 'Calgary time' })).toHaveText('2:30:05 PM ABT');
  await expect(page.getByRole('link', { name: 'linkedin' })).toHaveAttribute(
    'href',
    'https://www.linkedin.com/in/karshsharma'
  );
  await expect(page.getByRole('link', { name: 'github' })).toHaveAttribute(
    'href',
    'https://github.com/karshh'
  );
});

test('news exposes all stories, map datasets, attribution, and popup details', async ({ page }) => {
  await page.goto('/news');

  const stories = page.locator('[data-testid="news-list"] app-news-panel .panel');
  await expect(stories).toHaveCount(11);
  await expect(stories.first()).toContainText('Calgary headline 1');
  await expect(page.getByTestId('leaflet-map')).toHaveCount(2);
  await expect(page.locator('.leaflet-interactive')).toHaveCount(4);
  await expect(page.getByText('OpenStreetMap').first()).toBeVisible();

  await page.locator('.leaflet-interactive').first().click();
  await expect(page.locator('.leaflet-popup-content')).toContainText(
    'Memorial Drive and 5a Street NW'
  );
});

test('SAIT route exposes all skill groups and projects', async ({ page }) => {
  await page.goto('/sait');

  await expect(page.locator('app-skill-list')).toHaveCount(8);
  await expect(page.locator('app-project-info')).toHaveCount(5);
  await expect(page.getByRole('heading', { name: 'Medium-Fake' })).toBeVisible();
});

test('contact form enforces native validation before submission', async ({ page }) => {
  await page.addInitScript(() => {
    (window as any).turnstile = {
      render: (_element: HTMLElement, options: Record<string, unknown>) => {
        (options['callback'] as (token: string) => void)('XXXX.DUMMY.TOKEN.XXXX');
        return 'test-widget';
      },
      reset: () => undefined
    };
  });
  await page.route('**/api/contact/config', route =>
    route.fulfill({ json: { turnstileSiteKey: '1x00000000000000000000AA' } }));
  await page.goto('/contact');

  const submit = page.getByRole('button', { name: 'Submit' });
  await expect(submit).toBeDisabled();
  await page.getByLabel('Name').fill('Visitor');
  await page.getByLabel('Email').fill('invalid');
  await page.getByLabel('Subject').fill('Subject');
  await page.getByLabel('Message').fill('Message');
  await expect(submit).toBeDisabled();
  await page.getByLabel('Email').fill('visitor@example.com');
  await expect(submit).toBeEnabled();
});
