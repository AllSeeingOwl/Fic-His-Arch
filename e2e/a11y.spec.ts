import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = [
  '/',
  '/about',
  '/browse',
  '/contact',
  '/contribute',
  '/directory',
  '/faq',
  '/handbook',
  '/junior-handbook',
  '/privacy-policy',
  '/terms-of-service',
  '/time-travelers',
  '/timeline',
  '/404',
];

test.describe('Accessibility audit', () => {
  for (const route of routes) {
    test(`should not have any automatically detectable accessibility issues on ${route}`, async ({
      page,
    }) => {
      await page.goto(route);
      const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }
});
