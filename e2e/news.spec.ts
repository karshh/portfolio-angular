import { expect, test } from '@playwright/test';
import { activeDetours, trafficIncidents } from './fixtures/maps';

const NEWS_ENDPOINT = 'https://data.calgary.ca/resource/3x6m-4vs7.json?**';
const newsItems = Array.from({ length: 11 }, (_, index) => ({
  title: `Calgary headline ${index + 1}`,
  pubdate: `2026-11-${String(11 - index).padStart(2, '0')}T12:00:00`,
  link: `https://newsroom.calgary.ca/story-${index + 1}/`
}));

test.beforeEach(async ({ page }) => {
  await page.route('**/cors-anywhere.herokuapp.com/**', route => route.fulfill({ json: [] }));
  await page.route('https://data.calgary.ca/resource/35ra-9556.json?**', route => route.fulfill({ json: trafficIncidents }));
  await page.route('https://data.calgary.ca/resource/w8zq-79bq.json?**', route => route.fulfill({ json: activeDetours }));
  await page.route('https://tile.openstreetmap.org/**', route => route.abort());
});

test('renders current Calgary news response data and safe external links', async ({ page }) => {
  await page.route(NEWS_ENDPOINT, route => route.fulfill({ json: [
    {
      title: 'City of Calgary Newsroom',
      pubdate: '2026-11-11T13:00:00',
      link: 'https://newsroom.calgary.ca/'
    },
    ...newsItems
  ] }));
  await page.goto('/news');

  const panels = page.locator('[data-testid="news-list"] app-news-panel .panel');
  await expect(panels).toHaveCount(11);
  await expect(page.getByText('City of Calgary Newsroom.', { exact: true })).toHaveCount(0);
  await expect(panels.first()).toContainText('Calgary headline 1');
  const firstLink = panels.first().getByRole('link');
  await expect(firstLink).toHaveAttribute('href', 'https://newsroom.calgary.ca/story-1/');
  await expect(firstLink).toHaveAttribute('rel', 'noopener noreferrer');
  await expect(page.getByText('Loading local news…')).toHaveCount(0);
});

test('shows a recoverable error instead of loading forever', async ({ page }) => {
  let attempts = 0;
  await page.route(NEWS_ENDPOINT, route => {
    attempts += 1;
    return attempts === 1
      ? route.fulfill({ status: 503, body: 'Unavailable' })
      : route.fulfill({ json: newsItems });
  });
  await page.goto('/news');

  await expect(page.getByRole('alert')).toContainText('Local news is temporarily unavailable.');
  await page.getByRole('button', { name: 'Retry news' }).click();
  await expect(page.locator('[data-testid="news-list"] app-news-panel .panel')).toHaveCount(11);
  await expect(page.getByRole('alert')).toHaveCount(0);
});
