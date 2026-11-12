import { defineConfig } from '@playwright/test';

const baseURL = process.env['PLAYWRIGHT_BASE_URL'] ?? 'http://localhost:4200';

export default defineConfig({
  testDir: './e2e',
  snapshotPathTemplate: '{testDir}/{testFilePath}-snapshots/{arg}{ext}',
  projects: [
    { name: 'app', testIgnore: '**/*.live.spec.ts' },
    { name: 'live-weather', testMatch: '**/*.live.spec.ts', timeout: 45000 }
  ],
  workers: 1,
  reporter: 'list',
  use: {
    baseURL,
    viewport: { width: 1440, height: 1000 },
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
    }
  },
  webServer: process.env['PLAYWRIGHT_SKIP_WEBSERVER'] ? undefined : {
    command: 'npm start -- --port 4200',
    url: 'http://localhost:4200',
    reuseExistingServer: true
  }
});
