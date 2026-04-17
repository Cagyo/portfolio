import { SearchIcon } from "@/assets/icons/SearchIcon";

type SearchInputProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  className?: string
}

export function SearchInput({ value, onChange, placeholder = "Search…", label, className = "max-w-sm" }: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={label ?? placeholder}
        className="form-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-white/25"
      />
    </div>
  );
}
