import { Page, Locator } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger';

/**
 * Base Page Object
 * Contains common functionality shared across all page objects
 */
export class BasePage {
  readonly page: Page;
  private readonly screenshotDir = './screenshots';

  constructor(page: Page) {
    this.page = page;
    this.ensureScreenshotDirectory();
  }

  /**
   * Ensure screenshot directory exists
   */
  private ensureScreenshotDirectory(): void {
    try {
      if (!fs.existsSync(this.screenshotDir)) {
        fs.mkdirSync(this.screenshotDir, { recursive: true });
        logger.debug(`Screenshot directory created: ${this.screenshotDir}`);
      }
    } catch (error) {
      logger.error('Failed to create screenshot directory', error as Error, {
        directory: this.screenshotDir,
      });
    }
  }

  /**
   * Navigate to a specific path
   */
  async goto(path: string = '/'): Promise<void> {
    try {
      logger.debug(`Navigating to: ${path}`);
      await this.page.goto(path);
      logger.debug(`Navigation complete`);
    } catch (error) {
      logger.error('Navigation failed', error as Error, { path });
      throw error;
    }
  }

  /**
   * Wait for URL to match a pattern
   */
  async waitForURL(urlPattern: string | RegExp): Promise<void> {
    try {
      logger.debug(`Waiting for URL: ${urlPattern}`);
      await this.page.waitForURL(urlPattern);
      logger.debug(`URL matched: ${urlPattern}`);
    } catch (error) {
      logger.error('URL wait timeout', error as Error, { urlPattern });
      throw error;
    }
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Get current URL
   */
  async getCurrentURL(): Promise<string> {
    return this.page.url();
  }

  /**
   * Fill input field and clear it first
   * @param locator - The element to fill
   * @param text - Text to enter
   * @param timeout - Maximum time to wait for element visibility (ms)
   */
  async fillInput(locator: Locator, text: string, timeout: number = 5000): Promise<void> {
    try {
      logger.debug(`Waiting for input element to be visible (timeout: ${timeout}ms)`);
      // Ensure element is visible before interaction
      await locator.waitFor({ state: 'visible', timeout });
      logger.debug(`Input element is visible, clearing and filling`);
      await locator.clear();
      await locator.fill(text);
      logger.debug(`Successfully filled input with text (length: ${text.length})`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      logger.error(`Failed to fill input field: ${errorMsg}`, error as Error, {
        textLength: text.length,
        timeout,
      });
      throw new Error(`Failed to fill input field: ${errorMsg}`);
    }
  }

  /**
   * Click on an element
   */
  async click(locator: Locator): Promise<void> {
    try {
      logger.debug(`Clicking element`);
      await locator.click();
      logger.debug(`Element clicked successfully`);
    } catch (error) {
      logger.error('Failed to click element', error as Error);
      throw error;
    }
  }

  /**
   * Get text from an element
   */
  async getText(locator: Locator): Promise<string> {
    try {
      const text = (await locator.textContent()) || '';
      logger.debug(`Retrieved text: ${text.substring(0, 50)}...`);
      return text;
    } catch (error) {
      logger.error('Failed to get element text', error as Error);
      throw error;
    }
  }

  /**
   * Check if element is visible
   */
  async isVisible(locator: Locator): Promise<boolean> {
    try {
      const visible = await locator.isVisible();
      logger.debug(`Element visibility check: ${visible}`);
      return visible;
    } catch (error) {
      logger.warn('Element visibility check failed, assuming not visible', {
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(locator: Locator, timeout: number = 5000): Promise<void> {
    try {
      logger.debug(`Waiting for element to be visible (timeout: ${timeout}ms)`);
      await locator.waitFor({ state: 'visible', timeout });
      logger.debug(`Element became visible`);
    } catch (error) {
      logger.error('Element wait timeout', error as Error, { timeout });
      throw error;
    }
  }

  /**
   * Get element count
   */
  async getElementCount(locator: Locator): Promise<number> {
    try {
      const count = await locator.count();
      logger.debug(`Element count: ${count}`);
      return count;
    } catch (error) {
      logger.error('Failed to get element count', error as Error);
      throw error;
    }
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(name: string): Promise<Buffer> {
    try {
      const timestamp = Date.now();
      const screenshotPath = path.join(this.screenshotDir, `${name}-${timestamp}.png`);
      logger.info(`Taking screenshot`, { name, path: screenshotPath });
      return this.page.screenshot({ path: screenshotPath });
    } catch (error) {
      logger.error('Failed to take screenshot', error as Error, { name });
      throw error;
    }
  }

  /**
   * Wait for element to disappear
   */
  async waitForElementToDisappear(locator: Locator, timeout: number = 5000): Promise<void> {
    try {
      logger.debug(`Waiting for element to disappear (timeout: ${timeout}ms)`);
      await locator.waitFor({ state: 'hidden', timeout });
      logger.debug(`Element disappeared`);
    } catch (error) {
      logger.error('Element disappear timeout', error as Error, { timeout });
      throw error;
    }
  }

  /**
   * Reload page
   */
  async reload(): Promise<void> {
    try {
      logger.debug(`Reloading page`);
      await this.page.reload();
      logger.debug(`Page reloaded`);
    } catch (error) {
      logger.error('Page reload failed', error as Error);
      throw error;
    }
  }

  /**
   * Get attribute value
   */
  async getAttribute(locator: Locator, attributeName: string): Promise<string | null> {
    try {
      const value = await locator.getAttribute(attributeName);
      logger.debug(`Retrieved attribute ${attributeName}: ${value}`);
      return value;
    } catch (error) {
      logger.error('Failed to get attribute', error as Error, { attributeName });
      throw error;
    }
  }
}
