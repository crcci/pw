const { test, expect } = require('@playwright/test');

test('test passes', async ({ page }) => {
  console.log("start test");
  const reactAppServerURL = process.env.REACT_APP_SERVER_URL;
  await page.goto("http://www.apple.com");
});

test('should fail now', async ({ page }) => {
  console.log("start test2");
  const reactAppServerURL = process.env.REACT_APP_SERVER_URL;
  await page.goto("htpp://react-app:3000");
  await expect(page).toHaveTitle("No title");
  await expect(page).toHaveURL(/.*checkout/);
});