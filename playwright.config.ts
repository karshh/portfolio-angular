import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  projects: [
    { name: 'app', testIgnore: '**/*.live.spec.ts' },
    { name: 'live-weather', testMatch: '**/*.live.spec.ts', timeout: 45000 }
  ],
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4200',
    viewport: { width: 1440, height: 1000 },
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
    }
  },
  webServer: {
    command: 'npm start -- --host localhost --port 4200',
    url: 'http://localhost:4200',
    reuseExistingServer: true
  }
});
