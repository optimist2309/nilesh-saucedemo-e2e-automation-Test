import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Products Page Object
 * Represents the inventory/products page after successful login
 */
export class ProductsPage extends BasePage {
  readonly productsList: Locator;
  readonly productItem: Locator;
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly addToCartButton: Locator;
  readonly removeButton: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly sortDropdown: Locator;
  readonly menuButton: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    // Locators for products page elements
    this.productsList = page.locator('[data-test="inventory-list"]');
    this.productItem = page.locator('[data-test="inventory-item"]');
    this.productName = page.locator('[data-test="inventory-item-name"]');
    this.productPrice = page.locator('[data-test="inventory-item-price"]');
    this.addToCartButton = page.locator('button:has-text("Add to cart")');
    this.removeButton = page.locator('button:has-text("Remove")');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutButton = page.locator('[data-test="logout-sidebar-link"]');
  }

  /**
   * Navigate to products page
   */
  async navigateToProducts(): Promise<void> {
    await this.goto('/inventory.html');
    await this.waitForElement(this.productsList);
  }

  /**
   * Get number of products displayed
   */
  async getProductCount(): Promise<number> {
    return this.getElementCount(this.productItem);
  }

  /**
   * Get all product names
   */
  async getProductNames(): Promise<string[]> {
    const names = await this.page.locator('[data-test="inventory-item-name"]').allTextContents();
    return names;
  }

  /**
   * Get all product prices
   */
  async getProductPrices(): Promise<string[]> {
    const prices = await this.page.locator('[data-test="inventory-item-price"]').allTextContents();
    return prices;
  }

  /**
   * Add product to cart by index
   */
  async addProductToCart(productIndex: number = 0): Promise<void> {
    const addButtons = this.page.locator('text=Add to cart');
    await addButtons.nth(productIndex).waitFor({ state: 'visible' });
    await addButtons.nth(productIndex).click();
  }

  /**
   * Remove product from cart by index
   */
  async removeProductFromCart(productIndex: number = 0): Promise<void> {
    const removeButtons = this.page.locator('text=Remove');
    await removeButtons.nth(productIndex).waitFor({ state: 'visible' });
    await removeButtons.nth(productIndex).click();
  }

  /**
   * Get cart badge count
   */
  async getCartBadgeCount(): Promise<string> {
    if (await this.isVisible(this.cartBadge)) {
      return this.getText(this.cartBadge);
    }
    return '0';
  }

  /**
   * Navigate to cart
   */
  async goToCart(): Promise<void> {
    await this.click(this.cartLink);
  }

  /**
   * Sort products by option
   */
  async sortProducts(sortOption: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.click(this.sortDropdown);
    const option = this.page.locator(`[data-test="product-sort-container"] [value="${sortOption}"]`);
    await this.click(option);
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    await this.click(this.menuButton);
    await this.waitForElement(this.logoutButton);
    await this.click(this.logoutButton);
  }

  /**
   * Check if products page is displayed
   */
  async isProductsPageDisplayed(): Promise<boolean> {
    return this.isVisible(this.productsList);
  }

  /**
   * Get product by name and click it
   */
  async getProductByName(productName: string): Promise<Locator> {
    return this.page.locator(`//a[@href="./inventory-item.html"]/../*:has-text("${productName}")`).first();
  }
}
