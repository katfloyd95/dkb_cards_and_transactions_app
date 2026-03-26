import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  selectedCardId: string | null;
  // Stored alongside id so components can access the colour
  // without needing to look up the card from the RTK Query cache
  selectedCardColor: string;
}

const initialState: UiState = {
  selectedCardId: null,
  selectedCardColor: "",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    selectCard(state, action: PayloadAction<{ id: string; color: string }>) {
      state.selectedCardId = action.payload.id;
      state.selectedCardColor = action.payload.color;
    },
    clearSelectedCard(state) {
      state.selectedCardId = null;
      state.selectedCardColor = "";
    },
  },
});

export const { selectCard, clearSelectedCard } = uiSlice.actions;
export default uiSlice.reducer;
