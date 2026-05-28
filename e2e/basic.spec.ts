import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/index.html');
  await expect(page).toHaveTitle(/Fictional History Archive/);
});
