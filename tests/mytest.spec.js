const { test, expect } = require('@playwright/test');
test.afterEach(async ({}, testInfo, testCase) => {
  console.log(testCase.id)
  if (testInfo.status == "failed")
    console.log(`${testInfo.title} did not run as expected!`);
  });

test('should fail now', async ({page}, testInfo) => {
  expect(testInfo.title).toBe('basic test');
  // const reactAppServerURL = process.env.REACT_APP_SERVER_URL;
  // console.log(reactAppServerURL);

  // console.log("Test Title:", test.title);

  await page.goto(`http://localhost:3000`);
  await expect(page).toHaveTitle("React App");
  await expect(page).toHaveTitle("No title");
  await expect(page).toHaveURL(/.*checkout/);
  


}); 