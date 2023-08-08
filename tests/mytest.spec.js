const { test, expect } = require('@playwright/test');

test('should fail now', async ({ page }) => {
  console.log("start test2");
  const reactAppServerURL = process.env.REACT_APP_SERVER_URL;
  await page.goto("http://172.18.0.2:3000");
  await expect.soft(page).toHaveTitle("No title");
  await expect.soft(page).toHaveURL(/.*checkout/);
});