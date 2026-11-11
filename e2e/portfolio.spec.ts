import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('**/cors-anywhere.herokuapp.com/**', async route => {
    const body = route.request().url().includes('weatherapi.com')
      ? { current: { temp_c: 20 } }
      : [];
    await route.fulfill({ json: body });
  });
  await page.route('**/maps.googleapis.com/**', route => route.abort());
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
