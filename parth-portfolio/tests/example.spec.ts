import { expect, test } from "@playwright/test";

test("renders the portfolio 3D achievement cards", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Parth Sankhla/);
  await expect(
    page.getByRole("heading", { name: "Selected proofs, not scattered claims" }),
  ).toBeVisible();
  await expect(
    page.getByText("React Three Fiber proof carousel"),
  ).toBeVisible();
  await expect(page.locator("canvas")).toHaveCount(1);

  await page.getByRole("button", { name: /Athletics/i }).click();

  await expect(
    page.getByRole("dialog", { name: "Athletics details" }),
  ).toBeVisible();
});
