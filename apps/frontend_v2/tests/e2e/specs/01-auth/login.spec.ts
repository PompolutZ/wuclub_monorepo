import { test, expect } from '@playwright/test';
import { LoginPage } from '../../page-objects/LoginPage';

/**
 * Login Feature Tests
 *
 * Tests the user authentication flow including:
 * - Successful login with valid credentials
 * - Error handling for invalid credentials
 * - Navigation to sign up and password reset pages
 */
test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    // Start each test on the login page
    await loginPage.navigateToLoginPage();
  });

  test('should successfully log in with valid credentials', async ({ page }) => {
    // Get test credentials from environment
    const testEmail = process.env.E2E_TEST_USER_EMAIL!;
    const testPassword = process.env.E2E_TEST_USER_PASSWORD!;

    // Perform login
    await loginPage.loginAndWaitForRedirect(testEmail, testPassword);

    // Verify successful login
    await loginPage.assertRedirectedToMyDecks();
    await loginPage.assertAuthTokenExists();
  });

  test('should show error message for invalid credentials', async ({ page }) => {
    // Attempt login with invalid credentials
    await loginPage.login('invalid@example.com', 'wrongpassword');

    // Wait for error message to appear
    await page.waitForTimeout(2000); // Firebase error may take a moment

    // Verify error is displayed (error message text may vary)
    await loginPage.assertLoginError();
  });

  test('should navigate to sign up page when clicking sign up link', async ({ page }) => {
    // Click the sign up link
    await loginPage.clickSignUpLink();

    // Verify navigation to sign up page
    await expect(page).toHaveURL(/\/user\/signup/);
  });

  test('should navigate to password reset page when clicking forgot password', async ({ page }) => {
    // Click the forgot password link
    await loginPage.clickForgotPasswordLink();

    // Verify navigation to password reset page
    await expect(page).toHaveURL(/\/requestPasswordReset/);
  });

  test('should have all necessary form elements', async ({ page }) => {
    // Verify email input exists
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();

    // Verify password input exists
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();

    // Verify sign in button exists
    const signInButton = page.locator('button:has-text("Sign in")');
    await expect(signInButton).toBeVisible();
  });
});
