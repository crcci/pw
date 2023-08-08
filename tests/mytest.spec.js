const { test, expect } = require('@playwright/test');

test('should fail now', async ({ page }) => {
  console.log("start test2");
  const reactAppServerURL = process.env.REACT_APP_SERVER_URL;
  await page.goto(reactAppServerURL);
  await expect(page).toHaveTitle("No title");
  await expect(page).toHaveURL(/.*checkout/);
});s