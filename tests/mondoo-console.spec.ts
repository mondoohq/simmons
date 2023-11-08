/**
 * Copyright (c) Mondoo, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

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
  await page.getByPlaceholder('Your Email...').fill(process.env.MONDOO_USER);
  await page.keyboard.press('Tab');
  await page.getByRole('button', { name: 'continue' }).click();
  await page.getByPlaceholder('Your password...').fill(process.env.MONDOO_PASSWORD);
  await page.keyboard.press('Tab');
  await page.getByRole('button', { name: 'log in' }).click();
  await expect(page.locator('footer svg')).toBeVisible;

  // Phase 2: Click the logo to get the dashboard & Select Region
  await page.getByRole('link', { name: 'Mondoo Dashboard' }).click();
  await page.getByRole('button', { name: 'US' }).click();

  // Choose our region:
  console.log('Region is:', region);
  await page.getByRole('button', { name: region }).click();

  // Phase 3: Pick the Simmons Org, then Navigate to Default Space and Find the Alpine Container Scan
  await page.getByRole('link', { name: 'Simmons' }).click();
  await page.getByRole('link', { name: 'Spaces' }).click();
  await page.getByRole('link', { name: 'default' }).click();
  await page.getByRole('button', { name: 'Inventory' }).click();
  await page.getByRole('link', { name: 'All Assets' }).click();
  await expect(page.getByRole('link', { name: /Operating System/ })).toBeVisible();

  // Phase 4: Find Alpine Scan
  await page.getByRole('cell', { name: 'alpine' }).nth(0).click();
  // Check for a vulnerability count (should be 0 of 15 for Alpine Image)
  await page.getByRole('tab', { name: 'Platform Vulnerabilities' }).click();
  await expect(page.getByText('total')).toContainText('total');

  // Phase 5: Delete the Asset and confirm
  await page.getByRole('link', { name: 'Inventory' }).click();
  await new Promise(resolve => setTimeout(resolve, 1000)); //Explicit wait
  await page.getByRole('row', { name: 'Asset Name Platform Score Last Updated' }).getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Delete' }).click(); // Confirm Delete
  //await expect(page.getByRole('heading', { name: 'WELCOME TO MONDOO' })).toBeVisible();

  // Phase 6: Logout
  await page.getByRole('button', { name: 'Richard Simmons' }).click();
  await page.getByRole("menuitem", { name: 'Logout'}).click();

});
