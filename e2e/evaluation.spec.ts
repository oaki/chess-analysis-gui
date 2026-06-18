import { test, expect } from "@playwright/test";

test.describe("Evaluation display", () => {
  test("sign-in page is accessible", async ({ page }) => {
    const response = await page.goto("/auth/sign-in");
    expect(response?.status()).toBe(200);
    await expect(page.locator("#root")).not.toBeEmpty();
  });
});

test.describe("Error handling", () => {
  test("app renders without JS errors on sign-in page", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await page.goto("/auth/sign-in");
    await page.waitForLoadState("networkidle");

    expect(errors.filter(e => !e.includes("warning"))).toHaveLength(0);
  });

  test("app does not crash on unknown route", async ({ page }) => {
    await page.goto("/unknown-route-xyz");
    await page.waitForLoadState("networkidle");
    // Should redirect to sign-in or show something
    const body = page.locator("body");
    await expect(body).toBeVisible();
  });
});
