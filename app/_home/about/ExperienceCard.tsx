'use client'

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Tag } from "../../_components/tag/Tag";

type ExperienceCardProps = {
  title: string
  company: string
  period: string
  description: string
  tags: string[]
  logo?: React.ReactNode
  accentOpacity?: string
  projectsHref?: string
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

export function ExperienceCard({ title, company, period, description, tags, logo, accentOpacity = "1", projectsHref }: ExperienceCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const descRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = descRef.current;
    if (el) setIsClamped(el.scrollHeight > el.clientHeight);
  }, [description]);

  const logoNode = logo ?? (
    <div className="glass w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0">
      <span className="text-amber-400 text-xs font-bold tracking-wider leading-none">
        {getInitials(company)}
      </span>
    </div>
  );

  return (
    <div className="glass rounded-2xl p-5 relative overflow-hidden group cursor-default hover:border-amber-500/30 transition-colors duration-200">
      <div
        className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500 to-amber-600 rounded-l-2xl"
        style={{ opacity: accentOpacity }}
      />
      <div className="pl-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex-shrink-0 mt-0.5">{logoNode}</div>
            <div>
              <p className="font-heading font-bold text-white">{title}</p>
              <p className="text-amber-400/80 text-sm font-medium mt-0.5">{company}</p>
            </div>
          </div>
          <span className="text-white/30 text-xs whitespace-nowrap mt-1">{period}</span>
        </div>

        <p
          ref={descRef}
          className={`text-white/50 text-sm mt-3 leading-relaxed transition-all duration-300 ${expanded ? "" : "line-clamp-2"}`}
        >
          {description}
        </p>
        {isClamped && !expanded && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="text-amber-500/70 text-xs mt-1 hover:text-amber-400 transition-colors cursor-pointer"
          >
            Show more
          </button>
        )}
        {expanded && (
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="text-amber-500/70 text-xs mt-1 hover:text-amber-400 transition-colors cursor-pointer"
          >
            Show less
          </button>
        )}

        <div className="flex items-center justify-between gap-2 mt-3">
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
          {projectsHref && (
            <Link
              href={projectsHref}
              className="text-amber-500/60 text-xs whitespace-nowrap hover:text-amber-400 transition-colors flex-shrink-0"
            >
              View projects →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
