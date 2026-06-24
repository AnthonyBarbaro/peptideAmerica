import { expect, test } from "playwright/test";

test("home and shop pages render", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: /Premium research peptides, organized for faster lab purchasing/i,
    }),
  ).toBeVisible();

  await page.getByRole("link", { name: /Shop research catalog/i }).click();

  await expect(page).toHaveURL(/\/shop$/);
  await expect(page.getByRole("heading", { name: /Shop products/i })).toBeVisible();
});

test("cart page renders", async ({ page }) => {
  await page.goto("/cart");

  await expect(page).toHaveTitle(/Cart/);
  await expect(page.getByRole("heading", { name: /Your cart/i })).toBeVisible();
});
