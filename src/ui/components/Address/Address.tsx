import React, { FunctionComponent, useMemo } from "react";

import $ from "./Address.module.css";

export interface AddressProps {
  /** If provided, this preformatted line will be displayed */
  line?: string;
  street?: string;
  houseNumber?: string;
  postcode?: string;
  city?: string;
}

const Address: FunctionComponent<AddressProps> = ({ line, street, houseNumber, postcode, city }) => {
  const displayedAddress = useMemo(() => {
    // Prefer a preformatted line when available
    const fromLine = (line ?? "").trim();
    if (fromLine) return fromLine;

    // Otherwise construct a readable line from parts, skipping empties
    const first = [street, houseNumber].filter(Boolean).join(" ").trim();
    const rest = [postcode, city].filter(v => (v ?? "").toString().trim()).join(", ");
    return [first, rest].filter(Boolean).join(", ");
  }, [line, street, houseNumber, postcode, city]);

  return (
    <address className={$.address} data-testid="address-text">
      {displayedAddress}
    </address>
  );
};

export default Address;
