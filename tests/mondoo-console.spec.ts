// @ts-check
import { test, expect } from '@playwright/test';

// Determine the desired region
let region: string = 'US'
if (process.env.REGION){
        region = process.env.REGION;
}


test('Console Test', async ({ page }) => {
  await page.goto('https://console.mondoo.com/');

  // Phase 1: Login to US Default Space
  await page.getByRole('button', { name: 'Sign in with email instead' }).click();
  await page.getByLabel('Email').fill('ops+checkly@mondoo.com');
  await page.getByLabel('Password').fill('kCSSicE#*MARoR@B^U7KTw#zqJpN6gM5');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.locator('footer svg')).toBeVisible;

  // Phase 2: Click the logo to get the dashboard & Select Region 
  await page.getByRole('link', { name: 'Mondoo Dashboard' }).click();
  await page.getByRole('button', { name: 'US' }).click();

  // Choose our region:
  console.log('Region is:', region);
  await page.getByRole('button', { name: region }).click();

  // Phase 3: Navigate to Default Space and Find the Alpine Container Scan
  await page.getByRole('link', { name: 'default Open assets' }).click();
  await page.getByRole('link', { name: 'Fleet', exact: true }).click();
  await expect(page.getByRole('tab', { name: 'Settings' })).toBeVisible();

  // Phase 4: Find Alpine Scan
  await page.getByRole('cell', { name: 'alpine' }).nth(0).click();
  // Check for a vulnerability count (should be 0 of 15 for Alpine Image)
  await page.getByRole('tab', { name: 'Platform Vulnerabilities' }).click();
  await expect(page.getByText('total')).toContainText('of 15');

  // Phase 5: Delete the Asset and confirm
  await page.getByRole('link', { name: 'Fleet' }).click();
  await page.getByRole('main').locator('button').nth(1).click();
  await new Promise(resolve => setTimeout(resolve, 1000)); //Explicit wait
  await page.getByRole('row', { name: 'Asset Name Platform Score Last Updated' }).getByRole('checkbox').check();
  await page.locator('#assets-batch-edit-selection').click();
  await page.getByRole('option', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Done' }).click();
  await page.getByRole('button', { name: 'Delete' }).click();
  await expect(page.getByRole('heading', { name: 'WELCOME TO MONDOO' })).toBeVisible();

  // Phase 6: Logout
  await page.getByRole('button', { name: 'Checkly Test' }).click();
  await page.getByRole("menuitem", { name: 'Logout'}).click();

});