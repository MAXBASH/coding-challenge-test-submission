import { useCallback, useState } from "react";
import type { ChangeEvent } from "react";

type Fields = Record<string, string>;

export function useFormFields<T extends Fields>(initial: T) {
  const [fields, setFields] = useState<T>(initial);

  const setField = useCallback(
    (name: keyof T, value: string) =>
      setFields(prev => ({ ...prev, [name]: value })),
    []
  );

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target as (HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) & {
        name: keyof T;
        value: string;
      };
      setFields(prev => ({ ...prev, [name]: value }));
    },
    []
  );

  const reset = useCallback(() => setFields(() => ({ ...initial })), [initial]);

  return { fields, setField, onChange, reset, setFields };
}