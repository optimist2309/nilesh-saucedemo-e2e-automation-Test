import { test as base, Page, expect } from '@playwright/test';
import { chromium } from 'playwright';
import { LoginPage } from '../pages';

/**
 * Helper function to get environment variables with fallback values
 * @param key - Environment variable key
 * @param defaultValue - Default value if key is not set
 * @returns The environment variable value or default
 */
const getEnv = (key: string, defaultValue: string | boolean): string | boolean => {
  const value = process.env[key];
  
  if (value === undefined) {
    return defaultValue;
  }
  
  if (typeof defaultValue === 'boolean') {
    return value === 'true' || value === '1' || value === 'yes';
  }
  
  return value;
};

/**
 * Extended test fixture with authentication support
 * Allows reusing authenticated sessions across tests
 */

export type TestFixtures = {
  authenticatedPage: Page;
};

/**
 * Custom test fixture that provides an authenticated page
 * This allows tests to reuse the same authenticated session,
 * improving test execution speed significantly
 */
export const test = base.extend<TestFixtures>({
  // Override the default `page` fixture so each test launches its own browser
  page: async ({ }, use) => {
    const headless = getEnv('HEADLESS', true) as boolean;
    const browser = await chromium.launch({ headless });
    const context = await browser.newContext();
    const page = await context.newPage();
    try {
      await use(page);
    } finally {
      // Ensure the browser is closed after each test
      await browser.close();
    }
  },

  // Provide an authenticatedPage fixture that logs in using the per-test page
  authenticatedPage: async ({ page }, use) => {
    // Navigate to login page using environment variable
    const baseURL = getEnv('BASE_URL', 'https://www.saucedemo.com') as string;
    await page.goto(baseURL);

    // Perform login with standard user
    const loginPage = new LoginPage(page);
    await loginPage.login('standard_user', 'secret_sauce');

    // Wait for navigation to products page
    await page.waitForURL('**/inventory.html');

    // Pass authenticated page to test
    await use(page);
  },
});
export { expect };
