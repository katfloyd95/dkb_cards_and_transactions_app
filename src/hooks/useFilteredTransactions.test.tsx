import { waitFor } from "@testing-library/react";
import { renderWithProviders } from "../test-utils/renderWithProviders";
import { useFilteredTransactions } from "./useFilteredTransactions";

const PRIVATE_CARD_ID = "lkmfkl-mlfkm-dlkfm";
const BUSINESS_CARD_ID = "elek-n3lk-4m3lk4";

function setup(cardId: string | null, initialEntries: string[] = ["/"]) {
  let hookResult!: ReturnType<typeof useFilteredTransactions>;

  function TestComponent() {
    hookResult = useFilteredTransactions(cardId);
    return null;
  }

  renderWithProviders(<TestComponent />, { initialEntries });

  return () => hookResult;
}

describe("useFilteredTransactions", () => {
  describe("when no card is selected", () => {
    it("returns an empty transactions array", () => {
      const getResult = setup(null);
      expect(getResult().transactions).toEqual([]);
    });

    it("is not in a loading state", () => {
      const getResult = setup(null);
      expect(getResult().isLoading).toBe(false);
    });

    it("is not in an error state", () => {
      const getResult = setup(null);
      expect(getResult().isError).toBe(false);
    });

    it("returns an empty filter value", () => {
      const getResult = setup(null);
      expect(getResult().filterValue).toBe("");
    });
  });

  describe("when a card is selected", () => {
    it("starts in a loading state", () => {
      const getResult = setup(PRIVATE_CARD_ID);
      expect(getResult().isLoading).toBe(true);
    });

    it("returns all transactions after loading", async () => {
      const getResult = setup(PRIVATE_CARD_ID);
      await waitFor(() => {
        expect(getResult().transactions).toHaveLength(3);
      });
    });

    it("returns transactions with correct shape", async () => {
      const getResult = setup(PRIVATE_CARD_ID);
      await waitFor(() => {
        const first = getResult().transactions[0];
        expect(first).toHaveProperty("id");
        expect(first).toHaveProperty("amount");
        expect(first).toHaveProperty("description");
      });
    });
  });

  describe("filtering logic", () => {
    it("returns all transactions when filter is empty", async () => {
      const getResult = setup(PRIVATE_CARD_ID, ["/"]);
      await waitFor(() => expect(getResult().transactions).toHaveLength(3));
    });

    it("filters out transactions below the minimum amount", async () => {
      const getResult = setup(PRIVATE_CARD_ID, ["/?minAmount=100"]);
      await waitFor(() => {
        expect(getResult().transactions).toHaveLength(2);
      });
      const descriptions = getResult().transactions.map((tx) => tx.description);
      expect(descriptions).toContain("Food");
      expect(descriptions).toContain("Tickets");
      expect(descriptions).not.toContain("Snack");
    });

    it("includes transactions equal to the minimum amount", async () => {
      const getResult = setup(PRIVATE_CARD_ID, ["/?minAmount=123.88"]);
      await waitFor(() => {
        const descriptions = getResult().transactions.map(
          (tx) => tx.description,
        );
        expect(descriptions).toContain("Food");
        expect(descriptions).not.toContain("Snack");
      });
    });

    it("returns empty array when no transactions match the filter", async () => {
      const getResult = setup(PRIVATE_CARD_ID, ["/?minAmount=9999"]);
      await waitFor(() => {
        expect(getResult().transactions).toHaveLength(0);
      });
    });

    it("returns all transactions when filter input is invalid", async () => {
      const getResult = setup(PRIVATE_CARD_ID, ["/?minAmount=abc"]);
      await waitFor(() => {
        expect(getResult().transactions).toHaveLength(3);
      });
    });

    it("reads the filter value from the URL", async () => {
      const getResult = setup(PRIVATE_CARD_ID, ["/?minAmount=50"]);
      await waitFor(() => {
        expect(getResult().filterValue).toBe("50");
      });
    });

    it("returns empty filter value when param is not in URL", async () => {
      const getResult = setup(PRIVATE_CARD_ID, ["/"]);
      await waitFor(() => expect(getResult().transactions).toHaveLength(3));
      expect(getResult().filterValue).toBe("");
    });
  });

  describe("negative amounts", () => {
    it("includes negative amount transactions when no filter is set", async () => {
      const getResult = setup(BUSINESS_CARD_ID, ["/"]);
      await waitFor(() => {
        const descriptions = getResult().transactions.map(
          (tx) => tx.description,
        );
        expect(descriptions).toContain("Refund for Smart Phone");
      });
    });

    it("excludes negative amount transactions when filter is set to zero", async () => {
      const getResult = setup(BUSINESS_CARD_ID, ["/?minAmount=0"]);
      await waitFor(() => {
        const descriptions = getResult().transactions.map(
          (tx) => tx.description,
        );
        expect(descriptions).not.toContain("Refund for Smart Phone");
      });
    });
  });
});
