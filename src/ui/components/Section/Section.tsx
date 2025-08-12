import React, { FunctionComponent } from 'react';
import type { ComponentProps } from 'react';
import cx from 'classnames';

import $ from './Section.module.css';

type VariantType = 'light' | 'dark';
interface SectionProps extends Omit<ComponentProps<'section'>, 'className' | 'children'> {
  variant?: VariantType;
  className?: string;
  children: React.ReactNode;
}

const Section: FunctionComponent<SectionProps> = ({ children, variant = 'light', className, ...rest }) => {
  return (
    <section
      className={cx(
        $.section,
        { [$.light]: variant === 'light', [$.dark]: variant === 'dark' },
        className
      )}
      {...rest}
    >
      {children}
    </section>
  );
};

export default Section;
