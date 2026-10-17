import { test, expect } from "@playwright/test";

test.describe("Regressão visual — Kurio Marketplace", () => {
  test("deve manter o visual da página inicial", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("img[alt]:visible").first()).toBeVisible();

    await expect(page).toHaveScreenshot("marketplace-home.png", {
      animations: "disabled",
      caret: "hide",
      maxDiffPixelRatio: 0.03,
    });
  });
});
