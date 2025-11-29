import { test, expect } from '../fixtures';
import { LoginPage, ProductsPage, CartPage, CheckoutStepOnePage, CheckoutStepTwoPage, CheckoutCompletePage } from '../pages';
import { CHECKOUT_USER_DATA } from '../data/checkoutTestData';
import { logger } from '../utils/logger';

/**
 * Positive Test Scenarios
 * Tests for successful user workflows
 */

test.describe('Positive Test Cases - E-Commerce Workflows', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    logger.debug('beforeEach: Navigating to login page');
    await page.goto('https://www.saucedemo.com/');
  });

  test.afterEach(async ({ page }) => {
    // Logout after each test to ensure clean state
    logger.debug('afterEach: Starting cleanup');
    try {
      const productsPage = new ProductsPage(page);
      // Check if we're still on a logged-in page
      if (await productsPage.isProductsPageDisplayed()) {
        logger.debug('afterEach: Products page displayed, logging out');
        await productsPage.logout();
        // Wait for redirect to login page
        await page.waitForURL('**/');
        logger.debug('afterEach: Successfully logged out');
      }
    } catch (e) {
      // Log error for debugging but don't fail the test teardown
      const errorMsg = e instanceof Error ? e.message : String(e);
      logger.warn('afterEach: Logout attempted but page context may have changed', {
        error: errorMsg,
        currentUrl: page.url(),
      });
      // The test itself may have already logged out or navigated away
    }
    logger.debug('afterEach: Cleanup complete');
  });

  /**
   * TEST 1: Successful Login with Valid Credentials
   * PRIORITY: CRITICAL
   * Tests that a valid user can successfully login and access the products page
   */
  test('TC-001: Should successfully login with valid credentials', async ({ page }) => {
    // Arrange
    logger.step(1, 'Initialize login page', 'in-progress');
    const loginPage = new LoginPage(page);
    const username = 'standard_user';
    const password = 'secret_sauce';
    logger.step(1, 'Initialize login page', 'completed');

    // Act
    logger.step(2, 'Perform login', 'in-progress');
    await loginPage.login(username, password);
    logger.step(2, 'Perform login', 'completed');

    // Assert
    logger.step(3, 'Verify navigation', 'in-progress');
    await page.waitForURL('**/inventory.html');
    expect(page.url()).toContain('/inventory.html');
    logger.step(3, 'Verify navigation', 'completed');

    // Verify products page elements are visible
    logger.step(4, 'Verify products page', 'in-progress');
    const productsPage = new ProductsPage(page);
    const isDisplayed = await productsPage.isProductsPageDisplayed();
    expect(isDisplayed).toBe(true);
    logger.step(4, 'Verify products page', 'completed');

    // Verify product count is greater than 0
    logger.step(5, 'Verify product count', 'in-progress');
    const productCount = await productsPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
    logger.step(5, 'Verify product count', 'completed');

    logger.info('TC-001: Test passed successfully', { 
      username, 
      productCount,
      url: page.url() 
    });
  });

  /**
   * TEST 2: Browse Products Page
   * PRIORITY: HIGH
   * Tests that all products are displayed and accessible
   */
  test('TC-002: Should display all products with correct information', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    await loginPage.login('standard_user', 'secret_sauce');

    const productsPage = new ProductsPage(page);
    await productsPage.navigateToProducts();

    // Act
    const productCount = await productsPage.getProductCount();
    const productNames = await productsPage.getProductNames();
    const productPrices = await productsPage.getProductPrices();

    // Assert
    expect(productCount).toBeGreaterThan(0);
    expect(productNames.length).toBe(productCount);
    expect(productPrices.length).toBe(productCount);

    // Verify product names are not empty
    productNames.forEach(name => {
      expect(name.trim().length).toBeGreaterThan(0);
    });

    // Verify prices are in correct format ($X.XX)
    productPrices.forEach(price => {
      expect(price).toMatch(/\$\d+\.\d{2}/);
    });
  });

  /**
   * TEST 3: Add Product to Cart
   * PRIORITY: CRITICAL
   * Tests that users can add products to their cart
   */
  test('TC-003: Should add product to cart successfully', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    await loginPage.login('standard_user', 'secret_sauce');
    await page.waitForURL('**/inventory.html');

    const productsPage = new ProductsPage(page);
    await productsPage.waitForElement(productsPage.productsList);
    const initialCartCount = await productsPage.getCartBadgeCount();

    // Act - Add first product to cart
    await productsPage.addProductToCart(0);
    await page.waitForTimeout(1000); // Wait for cart to update

    // Assert
    const updatedCartCount = await productsPage.getCartBadgeCount();
    expect(updatedCartCount).toBe('1');
    expect(updatedCartCount).not.toBe(initialCartCount);
  });

  /**
   * TEST 4: Add Multiple Products to Cart
   * PRIORITY: HIGH
   * Tests that users can add multiple products to cart
   */
  test('TC-004: Should add multiple products to cart', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    await loginPage.login('standard_user', 'secret_sauce');
    await page.waitForURL('**/inventory.html');

    const productsPage = new ProductsPage(page);
    await productsPage.waitForElement(productsPage.productsList);

    // Act - Add first 3 products
    await productsPage.addProductToCart(0);
    await page.waitForTimeout(500);
    await productsPage.addProductToCart(1);
    await page.waitForTimeout(500);
    await productsPage.addProductToCart(2);
    await page.waitForTimeout(500);

    // Assert
    const cartCount = await productsPage.getCartBadgeCount();
    expect(cartCount).toBe('3');
  });

  /**
   * TEST 5: View Cart
   * PRIORITY: HIGH
   * Tests that users can view their cart with added items
   */
  test('TC-005: Should view cart with added items', async ({ page }) => {
    // Arrange
    const loginPage = new LoginPage(page);
    await loginPage.login('standard_user', 'secret_sauce');

    const productsPage = new ProductsPage(page);
    await productsPage.navigateToProducts();

    // Add 2 products to cart
    await productsPage.addProductToCart(0);
    await page.waitForTimeout(500);
    await productsPage.addProductToCart(1);
    await page.waitForTimeout(500);

    // Act
    await productsPage.goToCart();
    const cartPage = new CartPage(page);

    // Assert
    await page.waitForURL('**/cart.html');
    expect(page.url()).toContain('/cart.html');

    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBe(4);

  
  });

});
