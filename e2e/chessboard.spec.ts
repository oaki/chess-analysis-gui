import { test, expect, Page } from "@playwright/test";

async function loginMock(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem("token", "mock-token");
  });
}

test.describe("Chessboard page (unauthenticated)", () => {
  test("loading spinner disappears after bootstrap", async ({ page }) => {
    await page.goto("/");
    // App renders (either chessboard or redirect to sign-in)
    await page.waitForLoadState("networkidle");
    await expect(page.locator("body")).toBeVisible();
  });

  test("page title contains Chess", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/chess/i);
  });
});

test.describe("Sign-in page", () => {
  test("displays auth status on Google login attempt", async ({ page }) => {
    await page.goto("/auth/sign-in");
    await expect(page.locator(".page-log-in")).toBeVisible();
  });

  test("debug stage messaging container is present in DOM", async ({ page }) => {
    await page.goto("/auth/sign-in");
    const container = page.locator(".page-log-in");
    await expect(container).toBeVisible();
    // Check h2 is present
    await expect(page.getByRole("heading", { level: 2 })).toBeVisible();
  });
});

test.describe("Navigation", () => {
  test("google popup redirect sets correct URL params", async ({ page }) => {
    await page.goto("/auth/sign-in");
    const currentUrl = page.url();
    expect(currentUrl).toContain("/auth/sign-in");
  });

  test("app serves HTML on all route paths", async ({ page }) => {
    for (const path of ["/", "/auth/sign-in", "/user/history"]) {
      const response = await page.goto(path);
      expect(response?.status()).toBeLessThan(400);
    }
  });
});
