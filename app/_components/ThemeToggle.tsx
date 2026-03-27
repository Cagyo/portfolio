"use client";

import { useEffect, useState } from "react";
import { MoonIcon } from "../../assets/icons/MoonIcon";
import { SunIcon } from "../../assets/icons/SunIcon";

export function ThemeToggle() {
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
      className="theme-toggle"
      aria-label="Toggle theme"
    >
      {isDark ? (
        // Sun icon
        <SunIcon className="w-[18px] h-[18px]" />
      ) : (
        // Moon icon
        <MoonIcon className="w-[18px] h-[18px]" />
      )}
    </button>
  );
}
