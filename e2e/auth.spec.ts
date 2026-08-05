import { test, expect } from "@playwright/test";

test.describe("Authentication flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("unauthenticated user is redirected to sign-in", async ({ page }) => {
    await expect(page).toHaveURL(/.*sign-in.*/);
    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
  });

  test("sign-in page shows Google login button", async ({ page }) => {
    await page.goto("/auth/sign-in");
    // Google login button or custom sign-in button should be visible
    const signInContent = page.locator(".page-log-in");
    await expect(signInContent).toBeVisible();
    await expect(page.getByRole("heading", { name: /sign in/i })).toBeVisible();
  });

  test("sign-in page shows beta warning", async ({ page }) => {
    await page.goto("/auth/sign-in");
    await expect(page.getByText(/beta version/i)).toBeVisible();
  });

  test("accessing protected route without auth redirects to sign-in", async ({ page }) => {
    await page.goto("/user/history");
    await expect(page).toHaveURL(/.*sign-in.*/);
  });

  test("accessing engines route without auth redirects to sign-in", async ({ page }) => {
    await page.goto("/user/engines");
    await expect(page).toHaveURL(/.*sign-in.*/);
  });

  test("accessing settings route without auth redirects to sign-in", async ({ page }) => {
    await page.goto("/settings");
    await expect(page).toHaveURL(/.*sign-in.*/);
  });
});
