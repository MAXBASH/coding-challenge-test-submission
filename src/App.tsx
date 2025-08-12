import React from "react";

import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Button from "@/components/Button/Button";
import InputText from "@/components/InputText/InputText";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import useAddressBook from "@/hooks/useAddressBook";
import { useFormFields } from "@/hooks/useFormFields";

import styles from "./App.module.css";
import { Address as AddressType } from "./types";

// Ensures houseNumber is present on each address from the API
function transformAddress(addr: any, houseNumber: string): AddressType {
  return { ...(addr as any), houseNumber } as AddressType;
}

function App() {
  /**
   * Form fields states
   * TODO: Write a custom hook to set form fields in a more generic way:
   * - Hook must expose an onChange handler to be used by all <InputText /> and <Radio /> components
   * - Hook must expose all text form field values, like so: { postCode: '', houseNumber: '', ...etc }
   * - Remove all individual React.useState
   * - Remove all individual onChange handlers, like handlePostCodeChange for example
   */
  const { fields, onChange, reset } = useFormFields({
    postCode: "",
    houseNumber: "",
    firstName: "",
    lastName: "",
  });
  const [selectedAddress, setSelectedAddress] = React.useState("");
  /**
   * Results states
   */
  const [error, setError] = React.useState<undefined | string>(undefined);
  const [addresses, setAddresses] = React.useState<AddressType[]>([]);
  const [isFetchingAddresses, setIsFetchingAddresses] = React.useState(false);
  /**
   * Redux actions
   */
  const { addAddress } = useAddressBook();

  const handleSelectedAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log("-------setSelectedAddress----", e.target.value);
    setSelectedAddress(e.target.value);
  }

  /** TODO: Fetch addresses based on houseNumber and postCode using the local BE api
   * - Example URL of API: ${process.env.NEXT_PUBLIC_URL}/api/getAddresses?postcode=1345&streetnumber=350
   * - Ensure you provide a BASE URL for api endpoint for grading purposes!
   * - Handle errors if they occur
   * - Handle successful response by updating the `addresses` in the state using `setAddresses`
   * - Make sure to add the houseNumber to each found address in the response using `transformAddress()` function
   * - Ensure to clear previous search results on each click
   * - Bonus: Add a loading state in the UI while fetching addresses
   */
  const handleAddressSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Clear previous UI states
    setError(undefined);
    setAddresses([]);
    setSelectedAddress("");

    // --- Step 7: Basic validations for Find Address form ---
    const trimmedPostCode = fields.postCode.trim();
    const trimmedHouseNumber = fields.houseNumber.trim();

    if (!trimmedHouseNumber) {
      setError("House number is required.");
      return;
    }

    if (!trimmedPostCode || !/^\d{3,4}$/.test(trimmedPostCode)) {
      setError("Please enter a valid numeric postcode (3–4 digits).");
      return;
    }

    try {
      setIsFetchingAddresses(true);

      const base = process.env.NEXT_PUBLIC_URL ?? "";
      const params = new URLSearchParams({
        postcode: trimmedPostCode,
        streetnumber: trimmedHouseNumber,
      });
      const url = `${base}/api/getAddresses?${params.toString()}`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to fetch addresses (${res.status})`);
      }

      const data = await res.json();
      const raw = Array.isArray(data) ? data : data?.details || [];
      console.log("---raw--", raw)
      const transformed = raw.map((a: any, i: number) => {
        const streetNumber = String(i + 1);
        const withHN = transformAddress(a, streetNumber);
        const id = (withHN as any).id ?? `${trimmedHouseNumber}-${trimmedPostCode}-${i}`;
        console.log("-------id-----", id)
        return { ...withHN, id } as AddressType;
      });
      console.log("-------transformed-----", transformed)
      setAddresses(transformed);
    } catch (err) {
      setError((err as Error).message || "Failed to fetch addresses.");
      setAddresses([]);
    } finally {
      setIsFetchingAddresses(false);
    }
  };

  /** TODO: Add basic validation to ensure first name and last name fields aren't empty
   * Use the following error message setError("First name and last name fields mandatory!")
   */
  const handlePersonSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // --- Step 7: Basic validations for Personal Info form ---
    if (!fields.firstName.trim() || !fields.lastName.trim()) {
      setError("First name and last name fields mandatory!");
      return;
    }

    if (!selectedAddress || !addresses.length) {
      setError(
        "No address selected, try to select an address or find one if you haven't"
      );
      return;
    }

    const foundAddress = addresses.find(
      (address) => address.id === selectedAddress
    );
console.log("-------foundAddress---", foundAddress)
    if (!foundAddress) {
      setError("Selected address not found");
      return;
    }

    addAddress({ ...foundAddress, firstName: fields.firstName, lastName: fields.lastName });
  };

  // --- Step 6: Clear all fields, results, and errors ---
  const handleClearAll = () => {
    reset();
    setSelectedAddress("");
    setAddresses([]);
    setError(undefined);
  };

  return (
    <main>
      <Section>
        <h1>
          Create your own address book!
          <br />
          <small>
            Enter an address by postcode add personal info and done! 👏
          </small>
        </h1>
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
        <form onSubmit={handleAddressSubmit}>
          <fieldset>
            <legend>🏠 Find an address</legend>
            <div className={styles.formRow}>
              <InputText
                name="postCode"
                onChange={onChange}
                placeholder="Post Code"
                value={fields.postCode}
              />
            </div>
            <div className={styles.formRow}>
              <InputText
                name="houseNumber"
                onChange={onChange}
                value={fields.houseNumber}
                placeholder="House number"
              />
            </div>
            <Button type="submit" loading={isFetchingAddresses}>
              Find
            </Button>
          </fieldset>
        </form>
        {addresses.length > 0 &&
          addresses.map((address) => {
            return (
              <Radio
                name="selectedAddress"
                id={address.id}
                key={address.id}
                value={address.id}
                checked={selectedAddress === address.id}
                onChange={handleSelectedAddressChange}
              >
                <Address {...address} />
              </Radio>
            );
          })}
        {/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
        {selectedAddress && (
          <form onSubmit={handlePersonSubmit}>
            <fieldset>
              <legend>✏️ Add personal info to address</legend>
              <div className={styles.formRow}>
                <InputText
                  name="firstName"
                  placeholder="First name"
                  onChange={onChange}
                  value={fields.firstName}
                />
              </div>
              <div className={styles.formRow}>
                <InputText
                  name="lastName"
                  placeholder="Last name"
                  onChange={onChange}
                  value={fields.lastName}
                />
              </div>
              <Button type="submit">Add to addressbook</Button>
            </fieldset>
          </form>
        )}

        {/* TODO: Create an <ErrorMessage /> component for displaying an error message */}
        <ErrorMessage message={error} />
        <div style={{ marginTop: 8 }}>
          <Button
            type="button"
            variant="secondary"
            onClick={handleClearAll}
          >
            Clear all fields
          </Button>
        </div>
      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;
