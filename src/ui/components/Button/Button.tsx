import { ButtonType, ButtonVariant } from "@/types";
import React, { FunctionComponent } from "react";

import $ from "./Button.module.css";

interface ButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: ButtonType;
  variant?: ButtonVariant;
  loading?: boolean;
  children: React.ReactNode;
}

const Button: FunctionComponent<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  loading = false,
}) => {
  // Build class list with variant condition
  const classes = [
    $.button,
    variant === "secondary" ? $.secondary : $.primary, // default to primary
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={classes}
      type={type}
      onClick={onClick}
      disabled={loading}
      aria-busy={loading}
    >
      {/* Display loading spinner per demo video */}
      {loading && (
        <span className={$.spinner} data-testid="loading-spinner" aria-hidden="true" />
      )}
      <span className={$.label}>{children}</span>
    </button>
  );
};

export default Button;
