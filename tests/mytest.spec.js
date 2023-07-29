const { test, expect } = require('@playwright/test');

test('test passes', async ({ page }) => {
  const reactAppServerURL = process.env.REACT_APP_SERVER_URL;
  await page.goto("htpp://www.apple.com");
});

test('test update2', async ({ page }) => {
  const reactAppServerURL = process.env.REACT_APP_SERVER_URL;
  await page.goto(reactAppServerURL);
  await expect(page).toHaveTitle("No title");
  await expect(page).toHaveURL(/.*checkout/);
});