import { CATEGORIES } from "./skills-data";

type SkillFilterTabsProps = {
  active: string
  counts: Record<string, number>
  onSelect: (cat: string) => void
}

export function SkillFilterTabs({ active, counts, onSelect }: SkillFilterTabsProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
      {CATEGORIES.map((cat) => {
        const key = cat.toLowerCase();
        const isActive = active === key;
        return (
          <button
            key={cat}
            onClick={() => onSelect(key)}
            className={`skill-filter-btn px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500 ${isActive ? "active" : ""}`}
          >
            {cat}
            {cat === "All" && (
              <span className="skill-count ml-1 opacity-60">{counts.all ?? 0}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
