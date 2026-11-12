import { expect, test, type Page } from '@playwright/test';
import { calgaryWeather } from './fixtures/weather';
import { activeDetours, trafficIncidents } from './fixtures/maps';

const newsItems = Array.from({ length: 11 }, (_, index) => ({ title: `Calgary headline ${index + 1}`, pubdate: '2026-11-11T12:00:00', link: `https://newsroom.calgary.ca/story-${index + 1}/` }));

async function stabilize(page: Page, route: string) {
  await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}.leafletMap{background:#ddd!important}.leafletMap>*{visibility:hidden!important}' });
  if (route === 'home') await page.getByTestId('calgary-clock').evaluate(element => (element as HTMLElement).style.color = 'transparent');
  if (route === 'contact') await page.locator('.turnstile-container').evaluate(element => element.replaceChildren());
}

for (const { name, viewport } of [
  { name: 'desktop', viewport: { width: 1440, height: 1000 } },
  { name: 'mobile', viewport: { width: 390, height: 844 } },
]) {
  for (const route of ['home', 'news', 'sait', 'contact']) {
    test(`${route} ${name} visual baseline`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.clock.setFixedTime(new Date('2026-11-11T20:30:05Z'));
      await page.route('https://api.weather.gc.ca/collections/swob-realtime/items?**', request => request.fulfill({ json: calgaryWeather(12.3, '2026-11-11T20:30:05Z') }));
      await page.route('https://data.calgary.ca/resource/3x6m-4vs7.json?**', request => request.fulfill({ json: newsItems }));
      await page.route('https://data.calgary.ca/resource/35ra-9556.json?**', request => request.fulfill({ json: trafficIncidents }));
      await page.route('https://data.calgary.ca/resource/w8zq-79bq.json?**', request => request.fulfill({ json: activeDetours }));
      await page.route('https://tile.openstreetmap.org/**', request => request.abort());
      await page.route('**/api/contact/config', request => request.fulfill({ status: 503, json: { error: 'unavailable' } }));
      await page.goto(`/${route}`);
      await stabilize(page, route);
      await expect(page).toHaveScreenshot(`${route}-${name}.png`, { fullPage: true, animations: 'disabled', maxDiffPixelRatio: 0.005 });
    });
  }
}
