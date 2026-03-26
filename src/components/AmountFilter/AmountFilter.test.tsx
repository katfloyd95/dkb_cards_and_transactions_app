import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test-utils/renderWithProviders";
import AmountFilter from "./AmountFilter";

describe("AmountFilter", () => {
  describe("accessibility", () => {
    it("renders a labelled number input", () => {
      renderWithProviders(<AmountFilter value="" onChange={vi.fn()} />);
      const input = screen.getByRole("spinbutton", { name: /amount filter/i });
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("type", "number");
    });
  });

  describe("controlled behaviour", () => {
    it("displays the current filter value", () => {
      renderWithProviders(<AmountFilter value="50" onChange={vi.fn()} />);
      expect(
        screen.getByRole("spinbutton", { name: /amount filter/i }),
      ).toHaveValue(50);
    });

    it("calls onChange when the user types", async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      renderWithProviders(<AmountFilter value="" onChange={onChange} />);
      await user.type(
        screen.getByRole("spinbutton", { name: /amount filter/i }),
        "5",
      );

      expect(onChange).toHaveBeenCalledWith("5");
    });

    it("calls onChange when the input is cleared", async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      renderWithProviders(<AmountFilter value="50" onChange={onChange} />);
      await user.clear(
        screen.getByRole("spinbutton", { name: /amount filter/i }),
      );

      expect(onChange).toHaveBeenLastCalledWith("");
    });

    it("calls onChange when the user types a non-numeric character", async () => {
      const onChange = vi.fn();
      const user = userEvent.setup();

      renderWithProviders(<AmountFilter value="" onChange={onChange} />);
      await user.type(
        screen.getByRole("spinbutton", { name: /amount filter/i }),
        "e",
      );

      expect(onChange).toHaveBeenCalled();
    });
  });
});
