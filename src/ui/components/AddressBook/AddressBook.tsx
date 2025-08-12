import React from "react";
import { useAppSelector } from "../../../core/store";

import useAddressBook from "../../hooks/useAddressBook";
import Address from "../Address/Address";
import Button from "../Button/Button";
import Card from "../Card/Card";
import $ from "./AddressBook.module.css";
import { selectAddress } from "../../../core/reducers/addressBookSlice";

const AddressBook = () => {
  const addresses = useAppSelector(selectAddress);
  const { removeAddress, loadSavedAddresses, loading } = useAddressBook();
  const addressBookTitle = `📓 Address book (${addresses.length})`;

  React.useEffect(() => {
    loadSavedAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className={$.addressBook}>
      <h2>{addressBookTitle}</h2>

      {loading ? (
        <p aria-live="polite">Loading saved addresses…</p>
      ) : (
        <>
          {addresses.length === 0 && (
            <p>No addresses found, try add one 😉</p>
          )}
          {addresses.map((address, index) => {
            const fullName = `${address.firstName} ${address.lastName}`.trim();
            return (
              <Card key={address.id}>
                <div data-testid={`address-${index}`} className={$.item}>
                  <div>
                    <h3>{fullName}</h3>
                    <Address {...address} />
                  </div>
                  <div className={$.remove}>
                    <Button
                      variant="secondary"
                      onClick={() => removeAddress(address.id)}
                      aria-label={`Remove ${fullName} from address book`}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </>
      )}
    </section>
  );
};

export default AddressBook;
