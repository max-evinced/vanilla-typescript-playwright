import { test, expect } from '@playwright/test';
import { setCredentials, EvincedSDK } from '@evinced/js-playwright-sdk';

test.beforeAll(async () => {
  console.log('Before all tests');
  await setCredentials({
    serviceId: process.env.AUTH_SERVICE_ID || 'NO_VARIABLE_FOUND',
    secret: process.env.AUTH_SECRET || 'NO_VARIABLE_FOUND'
  })
});

test('has title', async ({ page }) => {
  await page.goto('https://demo.evinced.com');
  const evincedService = new EvincedSDK(page)
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Home | Evinced, Demo Site/);
  const issues = await evincedService.evAnalyze();
  evincedService.evSaveFile(issues, 'html', 'test-results/evinced-single-run-report.html')
});

test('search button', async ({ page }) => {
  await page.goto('https://demo.evinced.com');
  await page.pause()
  const evincedService = new EvincedSDK(page)
  await evincedService.evStart()
  await page.getByRole('link', { name: 'Search' }).isVisible();
  const issues = await evincedService.evStop()
  await evincedService.evSaveFile(issues, 'html', 'test-results/evinced-continuous-report.html')
});

test('doe page render', async ({ page }, testInfo) => {
  await page.goto('https://demo.evinced.com');
  const buffer = await page.screenshot();
  await testInfo.attach('screenshot', { body: buffer, contentType: 'image/png' });
});