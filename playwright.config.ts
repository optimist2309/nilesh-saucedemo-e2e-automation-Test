import { defineConfig, devices } from '@playwright/test';
import path from 'path';

// Helper function to get env variable with fallback
const getEnv = (key: string, defaultValue: string | number): string | number => {
  return process.env[key] ?? defaultValue;
};

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? parseInt(getEnv('RETRIES_CI', '2') as string) : parseInt(getEnv('RETRIES_LOCAL', '0') as string),
  workers: parseInt(getEnv('WORKERS', '1') as string),
  timeout: parseInt(getEnv('TEST_TIMEOUT', '60000') as string),
  reporter: [
    ['html', { outputFolder: getEnv('REPORT_DIR', 'playwright-report') as string }],
    ['list'],
    ['junit', { outputFile: getEnv('JUNIT_REPORT_FILE', 'junit.xml') as string }],
  ] as any,
  use: {
    baseURL: getEnv('BASE_URL', 'https://www.saucedemo.com') as string,
    trace: getEnv('TRACE_MODE', 'on-first-retry') as 'on-first-retry' | 'off' | 'on' | 'retain-on-failure',
    screenshot: getEnv('SCREENSHOT_MODE', 'only-on-failure') as 'off' | 'on' | 'only-on-failure',
    video: getEnv('VIDEO_MODE', 'retain-on-failure') as 'off' | 'on' | 'retain-on-failure',
    navigationTimeout: parseInt(getEnv('NAVIGATION_TIMEOUT', '30000') as string),
    actionTimeout: parseInt(getEnv('ACTION_TIMEOUT', '10000') as string),
    headless: getEnv('HEADLESS', 'true') === 'true',
    locale: getEnv('LOCALE', 'en-US') as string,
    timezoneId: getEnv('TIMEZONE', 'America/New_York') as string,
    ignoreHTTPSErrors: getEnv('IGNORE_HTTPS_ERRORS', 'false') === 'true',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: undefined, // No local server needed for saucedemo.com
});
