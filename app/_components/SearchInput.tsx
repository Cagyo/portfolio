"use client";

import { SearchIcon } from "@/assets/icons/SearchIcon";
import { XMarkIcon } from "@/assets/icons/XMarkIcon";
import styles from "./SearchInput.module.css";

type SearchInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder: string
  clearLabel: string
  label?: string
  className?: string
}

export function SearchInput({ value, onChange, placeholder, clearLabel, label, className = "max-w-sm" }: SearchInputProps) {
  return (
    <div className={`${styles.container} ${className}`}>
      <SearchIcon className={styles.searchIcon} />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={label ?? placeholder}
        className={`form-input ${styles.input}`}
      />
      {value ? (
        <button
          type="button"
          className={styles.clearButton}
          onClick={() => onChange("")}
          aria-label={clearLabel}
        >
          <XMarkIcon className={styles.clearIcon} />
        </button>
      ) : null}
    </div>
  );
}
