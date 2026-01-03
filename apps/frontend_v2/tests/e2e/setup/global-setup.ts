import { chromium, FullConfig } from '@playwright/test';
import path from 'path';

/**
 * Global setup function that runs once before all tests
 * Authenticates a test user and saves the auth state for reuse
 */
async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use;
  const authFile = path.join(__dirname, '../../.auth/user.json');

  // Get test user credentials from environment
  const testEmail = process.env.E2E_TEST_USER_EMAIL;
  const testPassword = process.env.E2E_TEST_USER_PASSWORD;

  if (!testEmail || !testPassword) {
    throw new Error(
      'E2E_TEST_USER_EMAIL and E2E_TEST_USER_PASSWORD must be set in .env.test'
    );
  }

  console.log('🔐 Setting up authentication state...');

  // Launch browser and create a new page
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Navigate to login page
    await page.goto(`${baseURL}/login`);

    // Fill in login credentials
    await page.locator('input[type="email"]').fill(testEmail);
    await page.locator('input[type="password"]').fill(testPassword);

    // Click sign in button and wait for navigation
    await Promise.all([
      page.waitForURL('**/mydecks', { timeout: 15000 }),
      page.locator('button:has-text("Sign in")').click(),
    ]);

    // Wait for auth data to be stored in localStorage
    await page.waitForFunction(
      () => {
        const authData = localStorage.getItem('yawudb_authUser');
        return authData !== null && authData !== '';
      },
      { timeout: 10000 }
    );

    console.log('✅ Authentication successful');

    // Save signed-in state to file
    await page.context().storageState({ path: authFile });

    console.log(`✅ Auth state saved to ${authFile}`);
  } catch (error) {
    console.error('❌ Authentication setup failed:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

export default globalSetup;
