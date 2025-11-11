import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";

test.describe("Accessibility", () => {
  test("public homepage passes Axe checks", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});

