import React, { FunctionComponent } from 'react';

import $ from './Radio.module.css';

type NativeProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'id' | 'name' | 'onChange' | 'value'>;

interface RadioProps extends NativeProps {
  id: string;
  name: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  children: React.ReactNode;
  className?: string; // optional wrapper class to merge with module class
}

const Radio: FunctionComponent<RadioProps> = ({ children, id, name, value, onChange, className, ...rest }) => {
  const wrapperClass = [$.radio, className].filter(Boolean).join(' ');
  return (
    <div className={wrapperClass}>
      <input
        type="radio"
        id={id}
        name={name}
        onChange={onChange}
        value={value ?? id}
        {...rest}
      />
      <label htmlFor={id}>{children}</label>
    </div>
  );
};

export default Radio;
