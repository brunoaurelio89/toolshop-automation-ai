import { defineConfig, devices } from '@playwright/test';
import { environment } from './src/config/env';

/**
 * Ambiente escolhido por TEST_ENV (normal | with-bugs), ver src/config/env.ts.
 * https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 2, // site público e compartilhado: pouco paralelismo
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: environment.uiURL,
    testIdAttribute: 'data-test', // o Toolshop usa data-test (E0, seção 3)
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
