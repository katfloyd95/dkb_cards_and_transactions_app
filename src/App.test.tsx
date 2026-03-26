import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "./test-utils/renderWithProviders";
import App from "./App";

describe("App", () => {
  it("renders the page heading", () => {
    renderWithProviders(<App />);
    expect(
      screen.getByRole("heading", { name: /cards & transactions/i }),
    ).toBeInTheDocument();
  });

  it("renders cards inside a Payment Cards region", async () => {
    renderWithProviders(<App />);
    await waitFor(() => {
      expect(
        screen.getByRole("region", { name: /payment cards/i }),
      ).toBeInTheDocument();
    });
  });

  it("loads and displays transactions after selecting a card", () => {
    renderWithProviders(<App />);
    expect(screen.getByText(/select a card above/i)).toBeInTheDocument();
  });

  it("shows transactions after a card is selected", async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);

    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /private card/i }),
      ).toBeInTheDocument(),
    );

    await user.click(screen.getByRole("button", { name: /private card/i }));

    await waitFor(() => {
      expect(screen.getByText("Food")).toBeInTheDocument();
    });
  });

  it("restores the selected card from the URL on load", async () => {
    renderWithProviders(<App />, {
      initialEntries: ["/?cardId=lkmfkl-mlfkm-dlkfm"],
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /private card/i }),
      ).toHaveAttribute("aria-pressed", "true");
    });
  });
});
