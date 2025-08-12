import React, { FunctionComponent } from "react";

import $ from "./InputText.module.css";

// Accept all native input attributes, but keep name/placeholder/value/onChange explicit
export type InputTextProps = Omit<React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "name" | "placeholder" | "value" | "onChange"
> & {
  name: string;
  placeholder: string;
  value: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
};

const InputText: FunctionComponent<InputTextProps> = ({
  name,
  onChange,
  placeholder,
  value,
  className,
  ...rest
}) => {
  const classes = [$.inputText, className].filter(Boolean).join(" ");
  return (
    <input
      aria-label={name}
      className={classes}
      name={name}
      onChange={onChange}
      placeholder={placeholder}
      type="text"
      value={value}
      {...rest}
    />
  );
};

export default InputText;
