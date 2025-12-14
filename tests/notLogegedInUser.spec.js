const { test, expect } = require("@playwright/test");
test("not logged in user to profile", async ({ page }) => {
  await page.goto("http://localhost:3000/user/profile");
  
  // Poczekaj na przekierowanie
  await page.waitForURL("**/user/signin**", { timeout: 10000 });
  
  
  await expect(page).toHaveURL("http://localhost:3000/user/signin?returnUrl=/user/profile");
  

  const loginHeading = page.getByRole('heading', { name: 'Logowanie', level: 2 });
  await expect(loginHeading).toBeVisible();
  
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('input[name="password"]')).toBeVisible();
  
});
