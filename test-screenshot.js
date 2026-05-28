import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 }
  });

  await page.goto('http://localhost:3000/archive/jfk-assassination-112263');
  // Wait for React components to potentially hydrate
  await page.waitForTimeout(1000);

  await page.screenshot({ path: '/home/jules/verification/screenshots/verification2.png', fullPage: true });
  await browser.close();
  console.log('Screenshot saved to /home/jules/verification/screenshots/verification2.png');
})();
