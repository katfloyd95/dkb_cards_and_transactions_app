import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test-utils/renderWithProviders";
import CardList from "./CardList";

describe("CardList", () => {
  describe("loading state", () => {
    it("shows a loading indicator while cards are being fetched", () => {
      renderWithProviders(<CardList />);
      expect(screen.getByText(/loading cards/i)).toBeInTheDocument();
    });
  });

  describe("loaded state", () => {
    it("renders all cards as buttons after loading", async () => {
      renderWithProviders(<CardList />);
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /private card/i }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("button", { name: /business card/i }),
        ).toBeInTheDocument();
      });
    });

    it("renders cards inside a Payment Cards region", async () => {
      renderWithProviders(<CardList />);
      await waitFor(() => {
        expect(
          screen.getByRole("region", { name: /payment cards/i }),
        ).toBeInTheDocument();
      });
    });

    it("renders no card as selected initially", async () => {
      renderWithProviders(<CardList />);
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /private card/i }),
        ).toHaveAttribute("aria-pressed", "false");
        expect(
          screen.getByRole("button", { name: /business card/i }),
        ).toHaveAttribute("aria-pressed", "false");
      });
    });

    it("restores the selected card from the URL on load", async () => {
      renderWithProviders(<CardList />, {
        initialEntries: ["/?cardId=lkmfkl-mlfkm-dlkfm"],
      });

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /private card/i }),
        ).toHaveAttribute("aria-pressed", "true");
      });
    });
  });

  describe("interaction", () => {
    it("marks a card as pressed after it is clicked", async () => {
      const user = userEvent.setup();
      renderWithProviders(<CardList />);

      await waitFor(() =>
        expect(
          screen.getByRole("button", { name: /private card/i }),
        ).toBeInTheDocument(),
      );

      await user.click(screen.getByRole("button", { name: /private card/i }));

      expect(
        screen.getByRole("button", { name: /private card/i }),
      ).toHaveAttribute("aria-pressed", "true");
    });

    it("marks only one card as pressed at a time", async () => {
      const user = userEvent.setup();
      renderWithProviders(<CardList />);

      await waitFor(() =>
        expect(
          screen.getByRole("button", { name: /private card/i }),
        ).toBeInTheDocument(),
      );

      await user.click(screen.getByRole("button", { name: /private card/i }));
      await user.click(screen.getByRole("button", { name: /business card/i }));

      expect(
        screen.getByRole("button", { name: /private card/i }),
      ).toHaveAttribute("aria-pressed", "false");
      expect(
        screen.getByRole("button", { name: /business card/i }),
      ).toHaveAttribute("aria-pressed", "true");
    });
  });
});
