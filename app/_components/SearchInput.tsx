"use client";

import { SearchIcon } from "@/assets/icons/SearchIcon";
import { XMarkIcon } from "@/assets/icons/XMarkIcon";

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
    <div className={`relative ${className}`}>
      <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ghost-foreground pointer-events-none" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={label ?? placeholder}
        className="form-input w-full px-10 py-2.5 rounded-xl text-sm bg-card border border-border placeholder:text-invisible-foreground"
      />
      {value ? (
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-8 h-8 border-0 rounded-[0.625rem] bg-transparent text-ghost-foreground cursor-pointer transition-[background,color] duration-200 hover:bg-amber/10 hover:text-amber-foreground focus-visible:outline-2 focus-visible:outline-amber motion-reduce:transition-none"
          onClick={() => onChange("")}
          aria-label={clearLabel}
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      ) : null}
    </div>
  );
}
