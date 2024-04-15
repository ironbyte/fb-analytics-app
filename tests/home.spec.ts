import { expect, test } from '@playwright/test';

test('[smoke test] has title', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Moncy/);
});

test('[smoke test] has welcome text on home page', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByText("Welcome to Moncy's FB Analytics App"),
  ).toBeVisible();
});
