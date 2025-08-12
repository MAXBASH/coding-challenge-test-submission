import React, { FunctionComponent } from 'react';
import type { ComponentProps } from 'react';

import Button from '../Button/Button';
import InputText from '../InputText/InputText';
import $ from './Form.module.css';

// Use the real props of InputText so extraProps matches what the component accepts
type InputTextProps = ComponentProps<typeof InputText>;

interface FormEntry {
  name: string;
  placeholder: string;
  // Covers strings, numbers, booleans, event handlers, etc., from InputText
  // Prevent duplicate keys by omitting name/placeholder (they're provided above)
  extraProps?: Omit<InputTextProps, 'name' | 'placeholder'>;
}

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  label: string;
  loading: boolean;
  formEntries: FormEntry[];
  onFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitText: string;
}

const Form: FunctionComponent<FormProps> = ({
  label,
  loading,
  formEntries,
  onFormSubmit,
  submitText,
  ...rest
}) => {
  return (
    <form onSubmit={onFormSubmit} {...rest}>
      <fieldset>
        <legend>{label}</legend>
        {formEntries.map(({ name, placeholder, extraProps }, index) => (
          <div key={`${name}-${index}`} className={$.formRow}>
            <InputText
              key={`${name}-${index}`}
              name={name}
              placeholder={placeholder}
              {...(extraProps || {})}
            />
          </div>
        ))}

        <Button loading={loading} type="submit">
          {submitText}
        </Button>
      </fieldset>
    </form>
  );
};

export default Form;
