const { test, expect } = require('@playwright/test');

test('test passes', async ({ page }) => {
  const reactAppServerURL = process.env.REACT_APP_SERVER_URL;
  await page.goto("http://www.apple.com");
});

test('test update2', async ({ page }) => {
  const reactAppServerURL = process.env.REACT_APP_SERVER_URL;
  await page.goto("htpp://react-app:3000");
  await expect(page).toHaveTitle("No title");
  await expect(page).toHaveURL(/.*checkout/);
});