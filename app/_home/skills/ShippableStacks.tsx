"use client";

import Link from "next/link"
import { useTranslations } from "next-intl"
import { Tag } from "@/app/_components/tag/Tag"
import { getOutcomeBuckets, type OutcomeBucketKey } from "@/app/_data/projects/get-stack-stats"
import styles from "./ShippableStacks.module.css"

const CARD_TITLE_KEYS: Record<OutcomeBucketKey, "fullStackCardTitle" | "mobileCardTitle" | "paymentsCardTitle"> = {
  "full-stack": "fullStackCardTitle",
  mobile: "mobileCardTitle",
  payments: "paymentsCardTitle",
}

export function ShippableStacks() {
  const t = useTranslations("skills")
  const buckets = getOutcomeBuckets().filter((bucket) => bucket.count > 0)

  if (buckets.length === 0) return null

  return (
    <div className="reveal mb-10">
      <div className="mb-5">
        <h3 className="font-heading font-bold text-xl text-white leading-tight">{t("shippableStacksTitle")}</h3>
        <p className="text-white/45 text-sm mt-1">{t("shippableStacksSubtitle")}</p>
      </div>

      <div className={styles.grid}>
        {buckets.map((bucket) => {
          const title = t(CARD_TITLE_KEYS[bucket.key])

          return (
            <Link key={bucket.key} href={bucket.href} className={`glass rounded-2xl p-5 ${styles.card}`}>
              <h4 className={styles.cardTitle}>{title}</h4>
              <div className={styles.tagRow}>
                {bucket.topStacks.map((stack) => (
                  <Tag key={stack} variant="amber">{stack}</Tag>
                ))}
              </div>
              <p className={styles.shippedLine}>
                {t("projectsShipped", { count: bucket.count })}
              </p>
              <span className={styles.cta}>
                {t("viewProjectsCta")}
                <span aria-hidden="true" className={styles.ctaArrow}>→</span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
