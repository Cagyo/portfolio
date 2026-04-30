"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MoonIcon } from "@/assets/icons/MoonIcon";
import { SunIcon } from "@/assets/icons/SunIcon";
import styles from "./ThemeToggle.module.css";

type ThemeToggleProps = {
  /**
   * Initial theme resolved on the server from the `theme` cookie.
   * Required to keep first-paint icon in sync with `<html data-theme>` and
   * avoid a hydration mismatch. Use `getInitialIsDark()` to obtain it.
   */
  initialIsDark: boolean
}

export function ThemeToggle({ initialIsDark }: ThemeToggleProps) {
  const t = useTranslations("common");
  const [isDark, setIsDark] = useState(initialIsDark);

  function toggle() {
    const next = isDark ? "light" : "dark";
    setIsDark(!isDark);
    if (next === "light") {
      document.documentElement.setAttribute("data-theme", "light");
      document.cookie = "theme=light; path=/; max-age=31536000; SameSite=Lax";
    } else {
      document.documentElement.removeAttribute("data-theme");
      document.cookie = "theme=; path=/; max-age=0; SameSite=Lax";
    }
  }

  return (
    <button
      onClick={toggle}
      className={styles.themeToggle}
      aria-label={t("toggleTheme")}
    >
      {isDark ? (
        <SunIcon className="w-4.5 h-4.5" />
      ) : (
        <MoonIcon className="w-4.5 h-4.5" />
      )}
    </button>
  );
}
