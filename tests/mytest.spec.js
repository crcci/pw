const { test, expect } = require('@playwright/test');

test('env link', async ({ page }) => {
  const reactAppServerURL = process.env.REACT_APP_SERVER_URL;
  await page.goto("nonrelated");
  await page.goto(reactAppServerURL);
  await expect(page).toHaveTitle("No title");
  await expect(page).toHaveURL(/.*checkout/);
  await page.goto("nonrelated");
});