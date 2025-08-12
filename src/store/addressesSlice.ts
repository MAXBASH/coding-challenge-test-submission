import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Address as AddressType } from "../types";

type State = { addresses: AddressType[] };

const initialState: State = { addresses: [] };

const normalize = (s?: string) => (s ?? "").replace(/\s+/g, " ").trim().toLowerCase();

const addressesSlice = createSlice({
  name: "addresses",
  initialState,
  reducers: {
    addAddress(state, action: PayloadAction<AddressType>) {
      const incoming = action.payload;
      const exists = state.addresses.some(
        (a) => a.id === incoming.id || normalize(a.line) === normalize(incoming.line)
      );
      if (!exists) state.addresses.push(incoming);
    },
    removeAddress(state, action: PayloadAction<string /* id */>) {
      state.addresses = state.addresses.filter(a => a.id !== action.payload);
    }
  }
});

export const { addAddress, removeAddress } = addressesSlice.actions;
export default addressesSlice.reducer;