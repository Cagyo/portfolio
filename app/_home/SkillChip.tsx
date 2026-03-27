type SkillChipProps = {
  name: string
  category: string
  variant: "top" | "rest"
}

export function SkillChip({ name, category, variant }: SkillChipProps) {
  if (variant === "top") {
    return (
      <span className="skill-chip-top">
        <span className="chip-dot" />
        {name}
        <span className="skill-chip-cat">{category}</span>
      </span>
    );
  }

  return (
    <span className="skill-chip-rest">
      {name}
      <span className="skill-chip-cat">{category}</span>
    </span>
  );
}
