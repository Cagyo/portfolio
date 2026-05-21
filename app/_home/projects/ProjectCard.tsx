import Link from "next/link";
import { ArrowRightIcon } from "@/assets/icons/ArrowRightIcon";
import { CheckIcon } from "@/assets/icons/CheckIcon";
import { Tag } from "@/app/_components/tag/Tag";
import { cn } from "@/app/_lib/cn";
import { ProjectMeta } from "./ProjectMeta";

type ProjectCardProps = {
  title: string
  description: string
  problem?: string
  outcome?: string[]
  meta: { category: string; role: string; year: string }
  badge: { icon: React.ReactNode; label: string }
  tags: string[]
  imageBg: string
  imageContent: React.ReactNode
  linkOverlay: React.ReactNode
  featured?: boolean
  viewInProjectsHref: string
  viewInProjectsLabel: string
}

function getFeaturedStyles(featured: boolean) {
  return {
    body: featured
      ? "p-[clamp(1.5rem,3vw,2rem)] md:grid md:grid-cols-[minmax(0,0.95fr)_minmax(17rem,1fr)] md:gap-[clamp(1.25rem,3vw,2.25rem)]"
      : "p-5 lg:p-[1.125rem]",
    proof: featured
      ? "md:self-end md:border-l md:border-border md:pl-[clamp(1.25rem,2.5vw,2rem)]"
      : "",
    title: featured
      ? "text-[1.55rem] leading-[1.12] [@media(min-width:1160px)]:text-[1.9rem]"
      : "text-lg leading-[1.18] lg:text-[1.05rem]",
    problem: featured
      ? "text-[0.95rem] leading-[1.65] text-foreground-soft"
      : "text-[0.8125rem] leading-[1.55] text-muted-foreground lg:text-[0.78rem]",
    outcome: featured
      ? "text-[0.9rem] leading-[1.5]"
      : "text-[0.8125rem] leading-[1.45] lg:text-[0.78rem]",
    badgeText: featured ? "" : "lg:text-[0.7rem]",
  }
}

export function ProjectCard({
  title,
  description,
  problem,
  outcome,
  meta,
  badge,
  tags,
  imageBg,
  imageContent,
  linkOverlay,
  featured = false,
  viewInProjectsHref,
  viewInProjectsLabel,
}: ProjectCardProps) {
  const v = getFeaturedStyles(featured);

  return (
    <div className="reveal flex">
    <article className="glass hover-transitions group/card relative flex min-w-0 flex-1 cursor-pointer flex-col overflow-hidden rounded-lg hover:shadow-[var(--card-shadow)]">
      <div className={cn("relative min-h-[10.5rem] shrink-0 overflow-hidden lg:min-h-[12.5rem]", imageBg)}>
        <div className="absolute inset-0 flex items-center justify-center">
          {imageContent}
        </div>
        <div className="absolute inset-0 z-[3] flex items-center justify-center bg-[var(--overlay-bg)] opacity-0 transition-opacity duration-300 ease-[ease] group-hover/card:opacity-100">
          {linkOverlay}
        </div>
      </div>
      <div className={cn("flex min-w-0 flex-1 flex-col gap-4 max-[520px]:p-4", v.body)}>
        <div className="min-w-0">
          <ProjectMeta {...meta} />
          <h3 className={cn("mb-2 font-heading font-bold text-foreground", v.title)}>
            <Link href={viewInProjectsHref} className="text-inherit no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber">
              {title}
            </Link>
          </h3>
          {problem && (
            <p className={v.problem}>{problem}</p>
          )}
          {!problem && (
            <p className="text-sm leading-[1.6] text-muted-foreground">{description}</p>
          )}
        </div>
        <div className={cn("mt-auto flex min-w-0 flex-col", v.proof)}>
          {outcome && outcome.length > 0 && (
            <ul className="mb-3.5 flex flex-col gap-[0.45rem]">
              {outcome.map((item) => (
                <li key={item} className={cn("flex items-start gap-2 text-foreground-soft", v.outcome)}>
                  <CheckIcon className="relative top-0.5 h-3.5 w-3.5 shrink-0 text-amber" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="glass-amber mb-2.5 inline-flex max-w-full items-center self-start gap-1.5 rounded-lg px-2.5 py-1.5">
            {badge.icon}
            <span className={cn("min-w-0 [overflow-wrap:anywhere] text-xs font-bold leading-[1.35] text-amber-foreground", v.badgeText)}>
              {badge.label}
            </span>
          </div>
          <div className="mb-3.5 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
          <div className="mt-auto flex justify-end">
            <Link
              href={viewInProjectsHref}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-foreground transition-colors duration-200 before:absolute before:inset-0 before:z-[1] before:content-[''] hover:text-amber-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber"
              aria-hidden="true"
              tabIndex={-1}
            >
              {viewInProjectsLabel}
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
    </div>
  );
}
