import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    (window as any).turnstile = {
      render: (_container: HTMLElement, options: Record<string, unknown>) => {
        (options['callback'] as (token: string) => void)('XXXX.DUMMY.TOKEN.XXXX');
        return 'test-widget';
      },
      reset: () => undefined
    };
  });
  await page.route('**/api/contact/config', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ turnstileSiteKey: '1x00000000000000000000AA' })
  }));
});

test('contact page hides the recipient and submits through the same-origin API', async ({ page }) => {
  let submitted: Record<string, string> | undefined;
  await page.route('**/api/contact', async route => {
    submitted = route.request().postDataJSON();
    await route.fulfill({ status: 202, contentType: 'application/json', body: JSON.stringify({ sent: true }) });
  });

  await page.goto('/contact');
  await expect(page.getByRole('heading', { name: 'Contact Form' })).toBeVisible();
  await expect(page.locator('body')).not.toContainText('usharma_@live.com');
  expect(await page.content()).not.toContain('mailto:');

  await page.getByLabel('Name').fill('Playwright Visitor');
  await page.getByLabel('Email').fill('visitor@example.com');
  await page.getByLabel('Subject').fill('E2E contact');
  await page.getByLabel('Message').fill('This verifies the secure contact flow.');
  await page.getByRole('button', { name: 'Submit' }).click();

  await expect(page.getByText('Sent.', { exact: true })).toBeVisible();
  expect(submitted).toMatchObject({
    name: 'Playwright Visitor',
    email: 'visitor@example.com',
    subject: 'E2E contact',
    message: 'This verifies the secure contact flow.',
    website: '',
    turnstileToken: 'XXXX.DUMMY.TOKEN.XXXX'
  });
});

test('contact page reports delivery failures without exposing server details', async ({ page }) => {
  await page.route('**/api/contact', route => route.fulfill({
    status: 502,
    contentType: 'application/json',
    body: JSON.stringify({ error: 'Unable to send this message right now.' })
  }));

  await page.goto('/contact');
  await page.getByLabel('Name').fill('Playwright Visitor');
  await page.getByLabel('Email').fill('visitor@example.com');
  await page.getByLabel('Subject').fill('E2E contact');
  await page.getByLabel('Message').fill('This verifies failure handling.');
  await page.getByRole('button', { name: 'Submit' }).click();

  await expect(page.getByText('Could not send message. Try again in a bit.')).toBeVisible();
});
