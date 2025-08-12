import { Address } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Define a type for the slice state
interface CounterState {
  addresses: Address[];
}

// Define the initial state using that type
const initialState: CounterState = {
  addresses: [],
};

const normalize = (s?: string) => (s ?? "").replace(/\s+/g, " ").trim().toLowerCase();

export const addressBookSlice = createSlice({
  name: "address",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addAddress: (state, action: PayloadAction<Address>) => {
      const incoming = action.payload;
      const exists = state.addresses.some((a) => {
        if (a.id === incoming.id) return true;
        // If both have a `line` field, compare normalized values to avoid subtle dupes
        const hasLine = (obj: any): obj is { line: string } => obj && typeof obj.line === "string";
        if (hasLine(a) && hasLine(incoming)) {
          return normalize(a.line) === normalize(incoming.line);
        }
        return false;
      });
      if (!exists) state.addresses.push(incoming);
    },
    removeAddress: (state, action: PayloadAction<string>) => {
      state.addresses = state.addresses.filter((a) => a.id !== action.payload);
    },
    updateAddresses: (state, action: PayloadAction<Address[]>) => {
      state.addresses = action.payload;
    },
  },
});

export const { addAddress, removeAddress, updateAddresses } =
  addressBookSlice.actions;

// // Other code such as selectors can use the imported `RootState` type
export const selectAddress = (state: RootState) => state.addressBook.addresses;

export default addressBookSlice.reducer;
