import { test, expect } from '../fixtures';
import { LoginPage, ProductsPage } from '../pages';

// Debug helper test for TC-001 - step-by-step login
// Run with: npx playwright test tests/debug/tc001.debug.ts --headed --debug

test('DEBUG TC-001: Step-by-step login (interactive)', async ({ page }) => {
  console.log('DEBUG: Starting TC-001 interactive debug');

  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);

  // Step 1: Navigate to login page
  console.log('DEBUG: Navigating to https://www.saucedemo.com/');
  await page.goto('https://www.saucedemo.com/');
  await page.waitForLoadState('domcontentloaded');
  console.log('DEBUG: Page loaded - pausing for inspection');
  await page.pause(); // open Inspector here

  // Step 2: Fill username and password
  console.log("DEBUG: Filling username 'standard_user'");
  await loginPage.fillInput(loginPage.usernameInput, 'standard_user');
  console.log("DEBUG: Filling password 'secret_sauce'");
  await loginPage.fillInput(loginPage.passwordInput, 'secret_sauce');

  // Pause so you can inspect the filled fields and DOM
  console.log('DEBUG: Fields filled - pausing before clicking login');
  await page.pause();

  // Step 3: Click login
  console.log('DEBUG: Clicking login button');
  await loginPage.click(loginPage.loginButton);

  // Wait for navigation to inventory
  console.log('DEBUG: Waiting for inventory page');
  await page.waitForURL('**/inventory.html', { timeout: 10000 });
  console.log('DEBUG: Reached inventory page - verifying products');

  // Verify products page visible and product count
  const isDisplayed = await productsPage.isProductsPageDisplayed();
  console.log('DEBUG: products page displayed =', isDisplayed);
  expect(isDisplayed).toBe(true);

  const productCount = await productsPage.getProductCount();
  console.log('DEBUG: product count =', productCount);
  expect(productCount).toBeGreaterThan(0);

  console.log('DEBUG: TC-001 interactive debug completed');
});
