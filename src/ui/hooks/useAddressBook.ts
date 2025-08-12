import {
  addAddress,
  removeAddress,
  selectAddress,
  updateAddresses,
} from "../../core/reducers/addressBookSlice";
import { Address } from "@/types";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../core/store/hooks";

import transformAddress, { RawAddressModel } from "../../core/models/address";
import databaseService from "../../core/services/databaseService";

export default function useAddressBook() {
  const dispatch = useAppDispatch();
  const addresses = useAppSelector(selectAddress);
  const [loading, setLoading] = React.useState(true);

  // Persist address book whenever it changes
  React.useEffect(() => {
    databaseService.setItem("addresses", addresses);
  }, [addresses]);

  return {
    /** Add address to the redux store */
    addAddress: (address: Address) => {
      dispatch(addAddress(address));
    },
    /** Remove address by ID from the redux store */
    removeAddress: (id: string) => {
      dispatch(removeAddress(id));
    },
    /** Loads saved addresses from the indexedDB */
    loadSavedAddresses: async () => {
      try {
        const saved: RawAddressModel[] | null = await databaseService.getItem("addresses");
        if (saved && Array.isArray(saved)) {
          dispatch(updateAddresses(saved.map((address) => transformAddress(address))));
        }
      } catch (err) {
        // Optionally log or surface the error; keeping silent per challenge scope
      } finally {
        setLoading(false);
      }
    },
    loading,
    addresses,
  };
}
