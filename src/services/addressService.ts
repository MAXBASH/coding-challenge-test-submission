export async function fetchAddresses(houseNumber: string, postCode: string) {
  const params = new URLSearchParams({ houseNumber, postCode });
  const res = await fetch(`/api/getAddresses?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch addresses");
  return (await res.json()) as { addresses: string[] };
}