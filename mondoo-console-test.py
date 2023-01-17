# Mondoo Production Console Test
# This script assumes the following environment variables are defined:
#   - MONDOO_USER: A valid login for the Mondoo console, with access in both US & EU Regions
#   - MONDOO_PASSWWORD: The password associated with the USER
#   - REGION: The region to test, either US or EU (case sensative)

from playwright.sync_api import Playwright, sync_playwright, expect, Locator
import re
import os
import time
import atexit

def run(playwright: Playwright) -> None:
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(record_video_dir="videos/")
    atexit.register(context.close)
    page = context.new_page()
    page.goto("https://console.mondoo.com/")
    page.get_by_role("button", name="Sign in with email instead").click()
    page.get_by_label("Email").fill(os.environ['MONDOO_USER'])
    page.get_by_label("Password").fill(os.environ['MONDOO_PASSWORD'])
    page.get_by_role("button", name="Sign in").click()
    # Select Region & Select Default Space
    page.get_by_role("link", name="Mondoo Dashboard").click()
    page.get_by_role("button", name="US").click()
    page.get_by_role("button", name=os.environ['REGION']).click()
    time.sleep(2) # The UI needs a sec to catch up here.
    # Navigate to Default Space, thenFleet View and select the "alpine" asset
    #page.goto("https://console.mondoo.com/space/overview")  ## Alternate method to open default space
    page.get_by_role("link", name=re.compile("default Open")).click() 
    page.get_by_role("tab", name="Fleet").click()
    page.get_by_role("cell", name="alpine").nth(0).click()
    # Check for a vulnerability count (should be 0 of 15 for Alpine Image)
    page.get_by_text("Platform Vulnerabilities").click()
    totalVulns = page.get_by_text("total")
    expect(totalVulns).to_have_text(re.compile("of 15"))
    # Delete the asset and confirm
    page.get_by_role("link", name="Fleet").click()
    page.get_by_role("main").locator("button").nth(1).click()
    time.sleep(1)
    page.get_by_role("row", name="Asset Name Platform Score Last Updated").get_by_role("checkbox").check()
    page.locator("#assets-batch-edit-selection").click()
    page.get_by_role("option", name="Delete").click()
    page.get_by_role("button", name="Done").click()
    page.get_by_role("button", name="Delete").click()
    # Logout
    page.get_by_role("button").nth(3).click()
    page.get_by_role("menuitem", name="Logout").click()

    # Cleanup
    context.close()
    browser.close()


with sync_playwright() as playwright:
    run(playwright)
