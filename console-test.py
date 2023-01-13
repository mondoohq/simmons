from playwright.sync_api import Playwright, sync_playwright, expect, Locator
import re
import os

def run(playwright: Playwright) -> None:
    browser = playwright.chromium.launch(headless=False)
    context = browser.new_context()
    page = context.new_page()
    page.goto("https://console.mondoo.com/")
    page.get_by_role("button", name="Sign in with email instead").click()
    page.get_by_label("Email").fill(os.environ['MONDOO_USER'])
    page.get_by_label("Password").fill(os.environ['MONDOO_PASSWORD'])
    page.get_by_role("button", name="Sign in").click()
    # Navigate to Fleet View and select the "alpine" asset
    page.get_by_role("tab", name="Fleet").click()
    page.get_by_role("cell", name="alpine").click()
    # Check for a vulnerability count (should be 0 of 15 for Alpine Image)
    page.get_by_text("Platform Vulnerabilities").click()
    totalVulns = page.get_by_text("total")
    expect(totalVulns).to_have_text(re.compile("of 15"))
    # Delete the asset and confirm
    page.get_by_role("main").get_by_role("button").first.click()
    page.get_by_role("button", name="Delete").click()
    page.get_by_role("button").nth(3).click()
    # Logout
    page.get_by_role("menuitem", name="Logout").click()

    # Cleanup
    context.close()
    browser.close()


with sync_playwright() as playwright:
    run(playwright)
