const { test, expect } = require("@playwright/test");
test("logging in", async ({ page }) => {
  await page.goto("http://localhost:3000/user/signin");

  await page.fill('input[name="email"]', "test@test.pl");
  await page.fill('input[name="password"]', "123456");

  await page.click('button[type="submit"]');
  await expect(page).toHaveURL("http://localhost:3000/user/profile");

   await expect(page.locator('h2').first()).toContainText('Profil użytkownika');

});
