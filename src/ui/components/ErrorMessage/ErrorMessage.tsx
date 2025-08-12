import React from "react";
import styles from "./ErrorMessage.module.css";

interface Props {
  message?: string;
}

export default function ErrorMessage({ message }: Props) {
  if (!message) return null;

  return (
    <div className={styles.error} role="alert" aria-live="assertive">
      <span className={styles.icon} aria-hidden="true">⚠️</span>
      <span className={styles.text}>{message}</span>
    </div>
  );
}