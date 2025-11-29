import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Login Page Object
 * Represents the login page at https://www.saucedemo.com/
 */
export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly errorButton: Locator;

  constructor(page: Page) {
    super(page);
    // Locators for login page elements
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.errorButton = page.locator('[data-test="error-button"]');
  }

  /**
   * Navigate to login page
   */
  async navigateToLoginPage(): Promise<void> {
    await this.goto('/');
    await this.waitForElement(this.usernameInput);
  }

  /**
   * Perform login with username and password
   */
  async login(username: string, password: string): Promise<void> {
    await this.fillInput(this.usernameInput, username);
    await this.fillInput(this.passwordInput, password);
    await this.click(this.loginButton);
  }

  /**
   * Get login error message
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
   * Check if login page is displayed
   */
  async isLoginPageDisplayed(): Promise<boolean> {
    return this.isVisible(this.usernameInput);
  }
}
