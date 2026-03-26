import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test-utils/renderWithProviders";
import CardItem from "./CardItem";

const mockCard = {
  id: "test-card-id-001",
  description: "Private Card",
  color: "#5b9cf6",
};

describe("CardItem", () => {
  describe("rendering", () => {
    it("renders a labelled button with the card description", () => {
      renderWithProviders(
        <CardItem card={mockCard} isSelected={false} onSelect={vi.fn()} />,
      );
      expect(
        screen.getByRole("button", { name: /private card/i }),
      ).toBeInTheDocument();
      expect(screen.getByText("Private Card")).toBeInTheDocument();
    });
  });

  describe("selection state", () => {
    it("indicates it is not pressed when not selected", () => {
      renderWithProviders(
        <CardItem card={mockCard} isSelected={false} onSelect={vi.fn()} />,
      );
      expect(
        screen.getByRole("button", { name: /private card/i }),
      ).toHaveAttribute("aria-pressed", "false");
    });

    it("indicates it is pressed when selected", () => {
      renderWithProviders(
        <CardItem card={mockCard} isSelected={true} onSelect={vi.fn()} />,
      );
      expect(
        screen.getByRole("button", { name: /private card/i }),
      ).toHaveAttribute("aria-pressed", "true");
    });
  });

  describe("interaction", () => {
    it("calls onSelect with the card id when clicked", async () => {
      const onSelect = vi.fn();
      const user = userEvent.setup();

      renderWithProviders(
        <CardItem card={mockCard} isSelected={false} onSelect={onSelect} />,
      );
      await user.click(screen.getByRole("button", { name: /private card/i }));

      expect(onSelect).toHaveBeenCalledOnce();
      expect(onSelect).toHaveBeenCalledWith("test-card-id-001");
    });

    it("is activatable via keyboard", async () => {
      const onSelect = vi.fn();
      const user = userEvent.setup();

      renderWithProviders(
        <CardItem card={mockCard} isSelected={false} onSelect={onSelect} />,
      );
      screen.getByRole("button", { name: /private card/i }).focus();
      await user.keyboard("{Enter}");

      expect(onSelect).toHaveBeenCalledOnce();
    });
  });
});
