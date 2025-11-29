import { test, expect } from '../fixtures';
import { LoginPage, ProductsPage, CartPage, CheckoutStepOnePage, CheckoutCompletePage } from '../pages';
import { LOGIN_TEST_DATA, CHECKOUT_USER_DATA } from '../data/index';
import { logger } from '../utils/logger';

/**
 * Negative Test Scenarios
 * Tests for error handling and edge cases
 */

test.describe('Negative Test Cases - Error Handling & Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    logger.debug('beforeEach: Navigating to login page for negative test');
    await page.goto('https://www.saucedemo.com/');
  });

  /**
   * TEST 1: Login with Invalid Username and Password
   * PRIORITY: HIGH
   * Tests that login fails with invalid credentials
   */
  test('TC-N001: Should fail login with invalid credentials', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const invalidUser = LOGIN_TEST_DATA.find((u) => u.username === 'invalid_user');

    // Act
    await loginPage.login(invalidUser!.username, invalidUser!.password);

    // Assert
    const isErrorVisible = await loginPage.isErrorMessageDisplayed();
    expect(isErrorVisible).toBe(true);

    const errorMessage = await loginPage.getErrorMessage();
  // Exact wording on the site: "Epic sadface: Username and password do not match any user in this service"
  expect(errorMessage.toLowerCase()).toContain('username and password do not match');

    // Verify user is still on login page
    expect(page.url()).toContain('saucedemo.com/');
  });

  /**
   * TEST 2: Login with Locked Out User
   * PRIORITY: HIGH
   * Tests that locked out users cannot login
   */
  test('TC-N002: Should fail login with locked out user account', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    const lockedUser = LOGIN_TEST_DATA.find((u) => u.username === 'locked_out_user');

    // Act
    await loginPage.login(lockedUser!.username, lockedUser!.password);

    // Assert
    const isErrorVisible = await loginPage.isErrorMessageDisplayed();
    expect(isErrorVisible).toBe(true);

    const errorMessage = await loginPage.getErrorMessage();
  // Locked out message contains 'locked out' (case-insensitive)
  expect(errorMessage.toLowerCase()).toContain('locked out');

    // Verify user is still on login page
    expect(page.url()).toContain('saucedemo.com/');
  });

  /**
   * TEST 3: Data-Driven Login Tests - Multiple Invalid Credentials
   * PRIORITY: HIGH
   * Tests various invalid credential combinations
   */
  test.describe('Data-Driven Login Tests - Invalid Credentials', () => {
    const invalidCredentials = LOGIN_TEST_DATA.filter((u) => !u.isValid);

    invalidCredentials.forEach((userData) => {
      test(`Should fail login: ${userData.description}`, async ({ page }) => {
        // Arrange
        const loginPage = new LoginPage(page);

        // Act
        await loginPage.login(userData.username, userData.password);

        // Assert
        const isErrorVisible = await loginPage.isErrorMessageDisplayed();
        expect(isErrorVisible).toBe(true);

        const errorMessage = await loginPage.getErrorMessage();
        const msg = errorMessage.toLowerCase();

        // Verify specific expected messages depending on the invalid data
        if (userData.username === 'locked_out_user') {
          expect(msg).toContain('locked out');
        } else if (!userData.username) {
          // Empty username
          expect(msg).toContain('username is required');
        } else if (!userData.password) {
          // Empty password
          expect(msg).toContain('password is required');
        } else {
          // Generic invalid credentials message
          expect(msg).toContain('username and password do not match');
        }

        // Verify user remains on login page
        expect(page.url()).toContain('saucedemo.com/');
      });
    });
  });

  /**
   * TEST 4: Checkout with Missing First Name
   * PRIORITY: MEDIUM
   * Tests form validation for missing first name
   */
  test('TC-N004: Should not proceed to checkout with missing first name', async ({ page }) => {
    // Arrange - Login and add to cart
    const loginPage = new LoginPage(page);
    await loginPage.login('standard_user', 'secret_sauce');
    await page.waitForURL('**/inventory.html');

    const productsPage = new ProductsPage(page);
    await productsPage.navigateToProducts();
    await productsPage.addProductToCart(0);
    await page.waitForTimeout(500);

    // Navigate to cart and checkout
    await productsPage.goToCart();
    const cartPage = new CartPage(page);
    await cartPage.clickCheckout();

    // Arrange - Prepare checkout data
    const checkoutStepOne = new CheckoutStepOnePage(page);
    await page.waitForURL('**/checkout-step-one.html');
    const invalidUser = CHECKOUT_USER_DATA.find((u) => u.description === 'Missing first name');

    // Act - Fill form with missing first name
    await checkoutStepOne.fillCheckoutForm(invalidUser!.firstName, invalidUser!.lastName, invalidUser!.postalCode);
    await checkoutStepOne.clickContinue();

    // Assert
    const isErrorVisible = await checkoutStepOne.isErrorMessageDisplayed();
    expect(isErrorVisible).toBe(true);

    const errorMessage = await checkoutStepOne.getErrorMessage();
    expect(errorMessage.toLowerCase()).toContain('first name');

    // Verify form is still displayed
    expect(page.url()).toContain('checkout-step-one.html');
  });
  
});
