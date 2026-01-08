import { chromium } from 'playwright';

try {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('console', msg => {
    console.log(`console[${msg.type()}] ${msg.text()}`);
  });

  page.on('pageerror', err => {
    console.log(`pageerror ${err.message}`);
  });

  page.on('requestfailed', req => {
    console.log(`requestfailed ${req.url()} (${req.failure().errorText})`);
  });

  const target = process.argv[2] || 'http://localhost:3000/';
  console.log(`Opening ${target} ...`);
  await page.goto(target, { waitUntil: 'networkidle' });
  // give the page some time to finish loading and run client-side scripts
  await page.waitForTimeout(4000);
  await browser.close();
  console.log('Done capturing console messages.');
} catch (err) {
  console.error('Error while capturing console:', err);
  process.exit(1);
}
