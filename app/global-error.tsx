"use client";

import { useEffect, useState } from "react";
import styles from "./global-error.module.css";

type GlobalErrorProps = {
  error: Error & { digest?: string }
  reset: () => void
}

function getPersistedTheme(): "light" | undefined {
  if (typeof document === "undefined") return undefined;

  return document.cookie
    .split("; ")
    .some((cookie) => cookie === "theme=light")
    ? "light"
    : undefined;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const [theme] = useState<"light" | undefined>(getPersistedTheme);

  useEffect(() => {
    // TODO: report to error tracking service (e.g. Sentry)
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en" data-theme={theme} suppressHydrationWarning>
      <body className={styles.body} suppressHydrationWarning>
        <div className={styles.content}>
          <p className={styles.title}>Something went wrong</p>
          <p className={styles.message}>
            An unexpected error occurred. Please try again.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className={styles.button}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
