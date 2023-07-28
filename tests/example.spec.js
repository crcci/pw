// @ts-check
const { test, expect } = require('@playwright/test');

test.skip('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('env link', async ({ page }) => {
  const reactAppServerURL = process.env.REACT_APP_SERVER_URL;
  await page.goto(reactAppServerURL);
  await expect(page).toHaveTitle("No title");
  await expect(page).toHaveURL(/.*checkout/);
});