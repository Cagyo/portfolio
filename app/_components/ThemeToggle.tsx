"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { MoonIcon } from "../../assets/icons/MoonIcon";
import { SunIcon } from "../../assets/icons/SunIcon";
import styles from "./ThemeToggle.module.css";

export function ThemeToggle() {
  const t = useTranslations("common");
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    setIsDark(stored !== "light");
  }, []);

  function toggle() {
    const next = isDark ? "light" : "dark";
    setIsDark(!isDark);
    if (next === "light") {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.removeItem("theme");
    }
  }

  return (
    <button
      onClick={toggle}
      className={styles.themeToggle}
      aria-label={t("toggleTheme")}
    >
      {isDark ? (
        <SunIcon className="w-[18px] h-[18px]" />
      ) : (
        <MoonIcon className="w-[18px] h-[18px]" />
      )}
    </button>
  );
}
