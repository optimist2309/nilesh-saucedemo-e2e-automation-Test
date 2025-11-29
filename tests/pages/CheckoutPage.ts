import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Checkout Page Objects
 * Represents checkout step pages (Step One, Step Two, Confirmation)
 */

export class CheckoutStepOnePage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;
  readonly errorButton: Locator;

  constructor(page: Page) {
    super(page);
    // Locators for checkout step one elements
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorButton = page.locator('[data-test="error-button"]');
  }

  /**
   * Navigate to checkout step one
   */
  async navigateToCheckoutStepOne(): Promise<void> {
    await this.goto('/checkout-step-one.html');
    await this.waitForElement(this.firstNameInput);
  }

  /**
   * Fill checkout form
   */
  async fillCheckoutForm(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.fillInput(this.firstNameInput, firstName);
    await this.fillInput(this.lastNameInput, lastName);
    await this.fillInput(this.postalCodeInput, postalCode);
  }

  /**
   * Click continue to next step
   */
  async clickContinue(): Promise<void> {
    await this.click(this.continueButton);
  }

  /**
   * Click cancel
   */
  async clickCancel(): Promise<void> {
    await this.click(this.cancelButton);
  }

  /**
   * Get error message
   */
  async getErrorMessage(): Promise<string> {
    await this.waitForElement(this.errorMessage);
    return this.getText(this.errorMessage);
  }

  /**
   * Check if error message is displayed
   */
  async isErrorMessageDisplayed(): Promise<boolean> {
    return this.isVisible(this.errorMessage);
  }

  /**
   * Close error message
   */
  async closeErrorMessage(): Promise<void> {
    if (await this.isVisible(this.errorButton)) {
      await this.click(this.errorButton);
    }
  }

  /**
   * Check if checkout form is displayed
   */
  async isCheckoutFormDisplayed(): Promise<boolean> {
    return this.isVisible(this.firstNameInput);
  }
}

export class CheckoutStepTwoPage extends BasePage {
  readonly finishButton: Locator;
  readonly cancelButton: Locator;
  readonly cartItems: Locator;
  readonly itemSubtotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;

  constructor(page: Page) {
    super(page);
    // Locators for checkout step two elements
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.cartItems = page.locator('[data-test="cart-list"] [data-test="cart-item"]');
    this.itemSubtotal = page.locator('[data-test="subtotal-label"]');
    this.tax = page.locator('[data-test="tax-label"]');
    this.total = page.locator('[data-test="total-label"]');
  }

  /**
   * Navigate to checkout step two
   */
  async navigateToCheckoutStepTwo(): Promise<void> {
    await this.goto('/checkout-step-two.html');
    await this.waitForElement(this.finishButton);
  }

  /**
   * Get order summary - subtotal
   */
  async getSubtotal(): Promise<string> {
    return this.getText(this.itemSubtotal);
  }

  /**
   * Get order summary - tax
   */
  async getTax(): Promise<string> {
    return this.getText(this.tax);
  }

  /**
   * Get order summary - total
   */
  async getTotal(): Promise<string> {
    return this.getText(this.total);
  }

  /**
   * Click finish to complete order
   */
  async clickFinish(): Promise<void> {
    await this.click(this.finishButton);
  }

  /**
   * Click cancel
   */
  async clickCancel(): Promise<void> {
    await this.click(this.cancelButton);
  }

  /**
   * Get number of items in order summary
   */
  async getItemCount(): Promise<number> {
    return this.getElementCount(this.cartItems);
  }
}

export class CheckoutCompletePage extends BasePage {
  readonly confirmationMessage: Locator;
  readonly completeHeader: Locator;
  readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    // Locators for checkout complete page
    this.confirmationMessage = page.locator('[data-test="complete-text"]');
    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  /**
   * Navigate to checkout complete page
   */
  async navigateToCheckoutComplete(): Promise<void> {
    await this.goto('/checkout-complete.html');
    await this.waitForElement(this.completeHeader);
  }

  /**
   * Get confirmation message
   */
  async getConfirmationMessage(): Promise<string> {
    return this.getText(this.confirmationMessage);
  }

  /**
   * Get complete header text
   */
  async getCompleteHeaderText(): Promise<string> {
    return this.getText(this.completeHeader);
  }

  /**
   * Check if order completion page is displayed
   */
  async isOrderCompletePageDisplayed(): Promise<boolean> {
    return this.isVisible(this.completeHeader);
  }

  /**
   * Click back to home/products
   */
  async clickBackToHome(): Promise<void> {
    await this.click(this.backHomeButton);
  }
}
