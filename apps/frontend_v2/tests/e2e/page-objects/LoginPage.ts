import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Login Page Object
 *
 * Encapsulates interactions with the login page (/login)
 */
export class LoginPage extends BasePage {
  // Locators
  private get emailInput() {
    return this.page.locator('input[type="email"]');
  }

  private get passwordInput() {
    return this.page.locator('input[type="password"]');
  }

  private get signInButton() {
    return this.page.locator('button:has-text("Sign in")');
  }

  private get googleSignInButton() {
    return this.page.locator('.google-button, button:has-text("Sign in with Google")');
  }

  private get signUpLink() {
    return this.page.locator('a[href="/user/signup"], a:has-text("Sign up")');
  }

  private get forgotPasswordLink() {
    return this.page.locator('a[href="/requestPasswordReset"], a:has-text("Forgot")');
  }

  private get errorMessage() {
    return this.page.locator('.text-red-500, [role="alert"]');
  }

  /**
   * Navigate to the login page
   */
  async navigateToLoginPage() {
    await this.goto('/login');
  }

  /**
   * Log in with email and password (without waiting for navigation)
   */
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  /**
   * Log in with email/password and wait for redirect
   */
  async loginAndWaitForRedirect(email: string, password: string, expectedUrl = '/mydecks') {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);

    // Click and wait for navigation in parallel to avoid race condition
    await Promise.all([
      this.page.waitForURL((url) => url.pathname.includes(expectedUrl), { timeout: 30000 }),
      this.signInButton.click(),
    ]);

    // Wait for auth data to be persisted
    await this.page.waitForFunction(
      () => {
        const authData = localStorage.getItem('yawudb_authUser');
        return authData !== null && authData !== '';
      },
      { timeout: 10000 }
    );
  }

  /**
   * Click the Google sign-in button
   */
  async clickGoogleSignIn() {
    await this.googleSignInButton.click();
  }

  /**
   * Navigate to the sign-up page
   */
  async clickSignUpLink() {
    await this.signUpLink.click();
  }

  /**
   * Navigate to the forgot password page
   */
  async clickForgotPasswordLink() {
    await this.forgotPasswordLink.click();
  }

  /**
   * Assert that an error message is displayed
   */
  async assertLoginError(expectedMessage?: string) {
    await expect(this.errorMessage).toBeVisible();
    if (expectedMessage) {
      await expect(this.errorMessage).toContainText(expectedMessage);
    }
  }

  /**
   * Assert that the user is redirected after successful login
   */
  async assertRedirectedToMyDecks() {
    await expect(this.page).toHaveURL(/\/mydecks/);
  }

  /**
   * Verify auth token exists in localStorage
   */
  async assertAuthTokenExists() {
    const authData = await this.getLocalStorageItem('yawudb_authUser');
    expect(authData).not.toBeNull();
    expect(authData).not.toBe('');
  }
}
