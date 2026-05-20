import { Fragment } from "react"

type ProjectMetaProps = {
  category: string
  role: string
  year: string
}

const chipClassName = "text-[0.68rem] font-semibold tracking-[0.03em] text-ghost-foreground"
const dotClassName = "text-invisible-foreground text-[0.68rem]"

export function ProjectMeta({ category, role, year }: ProjectMetaProps) {
  const items = [
    { id: "category", label: category },
    { id: "role", label: role },
    { id: "year", label: year },
  ]
  return (
    <div className="flex flex-wrap items-center gap-2 mb-3">
      {items.map((item, index) => (
        <Fragment key={item.id}>
          {index > 0 && <span className={dotClassName}>·</span>}
          <span className={chipClassName}>{item.label}</span>
        </Fragment>
      ))}
    </div>
  );
}
