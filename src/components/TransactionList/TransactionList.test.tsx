import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test-utils/renderWithProviders";
import TransactionList from "./TransactionList";

const PRIVATE_CARD_ID = "lkmfkl-mlfkm-dlkfm";
const BUSINESS_CARD_ID = "elek-n3lk-4m3lk4";
const privateCardState = {
  preloadedState: {
    ui: { selectedCardId: PRIVATE_CARD_ID, selectedCardColor: "#5b9cf6" },
  },
};

describe("TransactionList", () => {
  describe("no card selected", () => {
    it("prompts the user to select a card", () => {
      renderWithProviders(<TransactionList />);
      expect(screen.getByText(/select a card above/i)).toBeInTheDocument();
    });

    it("does not render the amount filter when no card is selected", () => {
      renderWithProviders(<TransactionList />);
      expect(
        screen.queryByRole("spinbutton", { name: /amount filter/i }),
      ).not.toBeInTheDocument();
    });
  });

  describe("card selected", () => {
    it("shows a loading indicator while transactions are being fetched", () => {
      renderWithProviders(<TransactionList />, {
        preloadedState: {
          ui: { selectedCardId: PRIVATE_CARD_ID, selectedCardColor: "#5b9cf6" },
        },
      });
      expect(screen.getByText(/loading transactions/i)).toBeInTheDocument();
    });

    it("renders the amount filter input once a card is selected", () => {
      renderWithProviders(<TransactionList />, privateCardState);
      expect(
        screen.getByRole("spinbutton", { name: /amount filter/i }),
      ).toBeInTheDocument();
    });

    it("renders transactions for the selected card after loading", async () => {
      renderWithProviders(<TransactionList />, privateCardState);

      await waitFor(() => {
        expect(screen.getByText("Food")).toBeInTheDocument();
        expect(screen.getByText("Snack")).toBeInTheDocument();
        expect(screen.getByText("Tickets")).toBeInTheDocument();
      });
    });

    it("renders transactions inside a list landmark", async () => {
      renderWithProviders(<TransactionList />, privateCardState);

      await waitFor(() => {
        expect(screen.getByText("Food")).toBeInTheDocument();
        expect(screen.getByText("Snack")).toBeInTheDocument();
        expect(screen.getByText("Tickets")).toBeInTheDocument();
      });
    });
  });

  describe("amount filtering", () => {
    it("hides transactions below the entered minimum amount", async () => {
      const user = userEvent.setup();

      renderWithProviders(<TransactionList />, privateCardState);

      await waitFor(() => expect(screen.getByText("Food")).toBeInTheDocument());

      await user.type(
        screen.getByRole("spinbutton", { name: /amount filter/i }),
        "100",
      );

      await waitFor(() => {
        expect(screen.getByText("Food")).toBeInTheDocument();
        expect(screen.getByText("Tickets")).toBeInTheDocument();
        expect(screen.queryByText("Snack")).not.toBeInTheDocument();
      });
    });

    it("shows a message when no transactions match the filter", async () => {
      const user = userEvent.setup();

      renderWithProviders(<TransactionList />, privateCardState);

      await waitFor(() => expect(screen.getByText("Food")).toBeInTheDocument());

      await user.type(
        screen.getByRole("spinbutton", { name: /amount filter/i }),
        "9999",
      );

      await waitFor(() => {
        expect(
          screen.getByText(/no transactions match the current filter/i),
        ).toBeInTheDocument();
      });
    });

    it("includes transactions equal to the entered minimum amount", async () => {
      const user = userEvent.setup();

      renderWithProviders(<TransactionList />, privateCardState);

      await waitFor(() => expect(screen.getByText("Food")).toBeInTheDocument());

      await user.type(
        screen.getByRole("spinbutton", { name: /amount filter/i }),
        "123.88",
      );

      await waitFor(() => {
        expect(screen.getByText("Food")).toBeInTheDocument();
        expect(screen.queryByText("Snack")).not.toBeInTheDocument();
      });
    });

    it("restores all transactions when the filter is cleared", async () => {
      const user = userEvent.setup();

      renderWithProviders(<TransactionList />, privateCardState);

      await waitFor(() =>
        expect(screen.getByText("Snack")).toBeInTheDocument(),
      );

      const filterInput = screen.getByRole("spinbutton", {
        name: /amount filter/i,
      });
      await user.type(filterInput, "100");
      await waitFor(() =>
        expect(screen.queryByText("Snack")).not.toBeInTheDocument(),
      );

      await user.clear(filterInput);
      await waitFor(() =>
        expect(screen.getByText("Snack")).toBeInTheDocument(),
      );
    });

    it("reads an initial filter value from the URL", async () => {
      renderWithProviders(<TransactionList />, {
        preloadedState: {
          ui: { selectedCardId: PRIVATE_CARD_ID, selectedCardColor: "#5b9cf6" },
        },
        initialEntries: ["/?minAmount=100"],
      });

      await waitFor(() => {
        expect(screen.getByText("Food")).toBeInTheDocument();
        expect(screen.queryByText("Snack")).not.toBeInTheDocument();
      });
    });
  });

  describe("negative amounts", () => {
    it("includes refund transactions when no filter is applied", async () => {
      renderWithProviders(<TransactionList />, {
        preloadedState: {
          ui: {
            selectedCardId: BUSINESS_CARD_ID,
            selectedCardColor: "#f97316",
          },
        },
      });

      await waitFor(() => {
        expect(screen.getByText("Refund for Smart Phone")).toBeInTheDocument();
      });
    });

    it("hides refund transactions when the filter is set above zero", async () => {
      renderWithProviders(<TransactionList />, {
        preloadedState: {
          ui: {
            selectedCardId: BUSINESS_CARD_ID,
            selectedCardColor: "#f97316",
          },
        },
        initialEntries: ["/?minAmount=0"],
      });

      await waitFor(() => {
        expect(
          screen.queryByText("Refund for Smart Phone"),
        ).not.toBeInTheDocument();
      });
    });
  });
});
