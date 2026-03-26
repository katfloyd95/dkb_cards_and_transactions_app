import { test, expect } from "@playwright/test";

test.describe("Cards & Transactions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test.describe("page structure", () => {
    test("has a visible page heading", async ({ page }) => {
      await expect(
        page.getByRole("heading", { name: /cards & transactions/i }),
      ).toBeVisible();
    });

    test("renders both cards after loading", async ({ page }) => {
      await expect(
        page.getByRole("button", { name: /private card/i }),
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: /business card/i }),
      ).toBeVisible();
    });

    test("prompts the user to select a card on initial load", async ({
      page,
    }) => {
      await expect(page.getByText(/select a card above/i)).toBeVisible();
    });

    test("does not show the amount filter before a card is selected", async ({
      page,
    }) => {
      await expect(
        page.getByRole("spinbutton", { name: /amount filter/i }),
      ).not.toBeVisible();
    });
  });

  test.describe("card selection", () => {
    test("marks a card as pressed when selected", async ({ page }) => {
      const privateCard = page.getByRole("button", { name: /private card/i });
      await privateCard.click();
      await expect(privateCard).toHaveAttribute("aria-pressed", "true");
    });

    test("only one card is pressed at a time", async ({ page }) => {
      await page.getByRole("button", { name: /private card/i }).click();
      await page.getByRole("button", { name: /business card/i }).click();

      await expect(
        page.getByRole("button", { name: /private card/i }),
      ).toHaveAttribute("aria-pressed", "false");
      await expect(
        page.getByRole("button", { name: /business card/i }),
      ).toHaveAttribute("aria-pressed", "true");
    });

    test("shows transactions for the selected card", async ({ page }) => {
      await page.getByRole("button", { name: /private card/i }).click();

      await expect(page.getByText("Food")).toBeVisible();
      await expect(page.getByText("Snack")).toBeVisible();
      await expect(page.getByText("Tickets")).toBeVisible();
    });

    test("shows different transactions when switching cards", async ({
      page,
    }) => {
      await page.getByRole("button", { name: /private card/i }).click();
      await expect(page.getByText("Food")).toBeVisible();

      await page.getByRole("button", { name: /business card/i }).click();
      await expect(page.getByText("T-Shirt")).toBeVisible();
      await expect(page.getByText("Food")).not.toBeVisible();
    });

    test("persists the selected card in the URL", async ({ page }) => {
      await page.getByRole("button", { name: /private card/i }).click();
      await expect(page).toHaveURL(/cardId=lkmfkl-mlfkm-dlkfm/);
    });
  });

  test.describe("amount filter", () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole("button", { name: /private card/i }).click();
      await expect(page.getByText("Food")).toBeVisible();
    });

    test("shows the filter input once a card is selected", async ({ page }) => {
      await expect(
        page.getByRole("spinbutton", { name: /amount filter/i }),
      ).toBeVisible();
    });

    test("hides transactions below the entered minimum amount", async ({
      page,
    }) => {
      await page
        .getByRole("spinbutton", { name: /amount filter/i })
        .fill("100");

      await expect(page.getByText("Food")).toBeVisible();
      await expect(page.getByText("Tickets")).toBeVisible();
      await expect(page.getByText("Snack")).not.toBeVisible();
    });

    test("shows a message when no transactions match the filter", async ({
      page,
    }) => {
      await page
        .getByRole("spinbutton", { name: /amount filter/i })
        .fill("9999");

      await expect(
        page.getByText(/no transactions match the current filter/i),
      ).toBeVisible();
    });

    test("includes transactions equal to the minimum amount", async ({
      page,
    }) => {
      await page
        .getByRole("spinbutton", { name: /amount filter/i })
        .fill("123.88");
      await expect(page.getByText("Food")).toBeVisible();
      await expect(page.getByText("Snack")).not.toBeVisible();
    });

    test("restores all transactions when the filter is cleared", async ({
      page,
    }) => {
      const filterInput = page.getByRole("spinbutton", {
        name: /amount filter/i,
      });
      await filterInput.fill("100");
      await expect(page.getByText("Snack")).not.toBeVisible();

      await filterInput.clear();
      await expect(page.getByText("Snack")).toBeVisible();
    });

    test("persists the filter value in the URL", async ({ page }) => {
      await page
        .getByRole("spinbutton", { name: /amount filter/i })
        .fill("100");
      await expect(page).toHaveURL(/minAmount=100/);
    });

    test("restores the filter from the URL on page load", async ({ page }) => {
      await page.goto("/?cardId=lkmfkl-mlfkm-dlkfm&minAmount=100");

      await expect(page.getByText("Food")).toBeVisible();
      await expect(page.getByText("Snack")).not.toBeVisible();
      await expect(
        page.getByRole("spinbutton", { name: /amount filter/i }),
      ).toHaveValue("100");
    });

    test("resets the filter when switching to another card", async ({
      page,
    }) => {
      await page
        .getByRole("spinbutton", { name: /amount filter/i })
        .fill("100");
      await page.getByRole("button", { name: /business card/i }).click();

      await expect(
        page.getByRole("spinbutton", { name: /amount filter/i }),
      ).toHaveValue("");
    });
  });

  test.describe("negative amounts", () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole("button", { name: /business card/i }).click();
      await expect(page.getByText("T-Shirt")).toBeVisible();
    });

    test("displays refund transactions when no filter is applied", async ({
      page,
    }) => {
      await expect(page.getByText("Refund for Smart Phone")).toBeVisible();
    });

    test("hides refund transactions when filter is set to zero or above", async ({
      page,
    }) => {
      await page.getByRole("spinbutton", { name: /amount filter/i }).fill("0");
      await expect(page.getByText("Refund for Smart Phone")).not.toBeVisible();
    });
  });

  test.describe("keyboard accessibility", () => {
    test("cards are reachable and activatable by keyboard", async ({
      page,
    }) => {
      const firstCard = page.getByRole("button", { name: /private card/i });

      await firstCard.focus();
      await page.keyboard.press("Enter");

      await expect(firstCard).toHaveAttribute("aria-pressed", "true");
      await expect(
        page.getByRole("spinbutton", { name: /amount filter/i }),
      ).toBeVisible();
    });

    test("filter input is reachable by keyboard", async ({ page }) => {
      await page.getByRole("button", { name: /private card/i }).click();
      await page.getByRole("spinbutton", { name: /amount filter/i }).focus();

      await expect(
        page.getByRole("spinbutton", { name: /amount filter/i }),
      ).toBeFocused();
    });
  });
});
