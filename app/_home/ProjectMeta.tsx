type ProjectMetaProps = {
  category: string
  role: string
  year: string
}

export function ProjectMeta({ category, role, year }: ProjectMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-3">
      <span className="proj-meta-chip">{category}</span>
      <span className="proj-meta-dot">·</span>
      <span className="proj-meta-chip">{role}</span>
      <span className="proj-meta-dot">·</span>
      <span className="proj-meta-chip">{year}</span>
    </div>
  );
}
