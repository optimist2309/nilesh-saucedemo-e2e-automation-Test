import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Cart Page Object
 * Represents the shopping cart page
 */
export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly cartItemName: Locator;
  readonly cartItemPrice: Locator;
  readonly cartItemQuantity: Locator;
  readonly removeButton: Locator;
  readonly checkoutButton: Locator;
  readonly continueShopping: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    super(page);
    // Locators for cart page elements
    this.cartItems = page.locator('[data-test="cart-list"] > *');
    this.cartItemName = page.locator('[data-test="inventory-item-name"]');
    this.cartItemPrice = page.locator('[data-test="inventory-item-price"]');
    this.cartItemQuantity = page.locator('[data-test="item-quantity"]');
    this.removeButton = page.locator('[data-test="remove-button"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShopping = page.locator('[data-test="continue-shopping"]');
    this.emptyCartMessage = page.locator('text=Your Cart is empty');
  }

  /**
   * Navigate to cart page
   */
  async navigateToCart(): Promise<void> {
    await this.goto('/cart.html');
  }

  /**
   * Get number of items in cart
   */
  async getCartItemCount(): Promise<number> {
    return this.getElementCount(this.cartItems);
  }

  /**
   * Get cart item names
   */
  async getCartItemNames(): Promise<string[]> {
    return this.page.locator('[data-test="inventory-item-name"]').allTextContents();
  }

  /**
   * Get cart item prices
   */
  async getCartItemPrices(): Promise<string[]> {
    return this.page.locator('[data-test="inventory-item-price"]').allTextContents();
  }

  /**
   * Remove item from cart by index
   */
  async removeItemFromCart(itemIndex: number = 0): Promise<void> {
    const removeButtons = this.page.locator('[data-test="remove-button"]');
    await removeButtons.nth(itemIndex).click();
  }

  /**
   * Click checkout button
   */
  async clickCheckout(): Promise<void> {
    await this.click(this.checkoutButton);
  }

  /**
   * Click continue shopping
   */
  async clickContinueShopping(): Promise<void> {
    await this.click(this.continueShopping);
  }

  /**
   * Check if cart is empty
   */
  async isCartEmpty(): Promise<boolean> {
    return this.isVisible(this.emptyCartMessage);
  }

  /**
   * Check if checkout button is enabled
   */
  async isCheckoutButtonEnabled(): Promise<boolean> {
    return this.page.locator('[data-test="checkout"]').isEnabled();
  }
}
