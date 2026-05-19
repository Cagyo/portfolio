"use client";

import Link from "next/link"
import { useTranslations } from "next-intl"
import { Tag } from "@/app/_components/tag/Tag"
import { OUTCOME_BUCKETS, type OutcomeBucketKey } from "@/app/_data/projects/get-stack-stats"

const CARD_TITLE_KEYS: Record<OutcomeBucketKey, "fullStackCardTitle" | "mobileCardTitle" | "greenfieldCardTitle"> = {
  "full-stack": "fullStackCardTitle",
  mobile: "mobileCardTitle",
  greenfield: "greenfieldCardTitle",
}

export function ShippableStacks() {
  const t = useTranslations("skills")
  const buckets = OUTCOME_BUCKETS.filter((bucket) => bucket.count > 0)

  if (buckets.length === 0) return null

  return (
    <div className="reveal mb-10">
      <div className="mb-5">
        <h3 className="font-heading font-bold text-xl text-foreground leading-tight">{t("shippableStacksTitle")}</h3>
        <p className="text-muted-foreground text-sm mt-1">{t("shippableStacksSubtitle")}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {buckets.map((bucket) => {
          const title = t(CARD_TITLE_KEYS[bucket.key])

          return (
            <Link
              key={bucket.key}
              href={bucket.href}
              className="glass rounded-2xl p-5 flex flex-col gap-3 no-underline text-inherit border border-[color-mix(in_srgb,var(--amber)_8%,transparent)] transition-[transform,border-color,box-shadow] duration-200 ease hover:-translate-y-[3px] hover:border-[color-mix(in_srgb,var(--amber)_35%,transparent)] hover:shadow-[0_12px_32px_color-mix(in_srgb,var(--amber)_12%,transparent)] focus-visible:outline-2 focus-visible:outline-[var(--amber)] focus-visible:outline-offset-2 group/card"
            >
              <h4 className="font-heading font-bold text-[1.0625rem] leading-[1.2] text-foreground">{title}</h4>
              <div className="flex flex-wrap gap-1.5">
                {bucket.topStacks.map((stack) => (
                  <Tag key={stack} variant="amber">{stack}</Tag>
                ))}
              </div>
              <p className="text-[0.8125rem] text-muted-foreground mt-auto">
                {t("projectsShipped", { count: bucket.count })}
              </p>
              <span className="inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-amber-foreground tracking-[0.01em]">
                {t("viewProjectsCta")}
                <span aria-hidden="true" className="inline-block transition-transform duration-200 ease group-hover/card:translate-x-[3px]">→</span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
