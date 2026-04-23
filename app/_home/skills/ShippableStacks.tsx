"use client";

import Link from "next/link"
import { useTranslations } from "next-intl"
import { Tag } from "@/app/_components/tag/Tag"
import { getStackBundleLabel, getStackSignatures } from "@/app/_data/projects/get-stack-stats"
import styles from "./ShippableStacks.module.css"

export function ShippableStacks() {
  const t = useTranslations("skills")
  const signatures = getStackSignatures()

  if (signatures.length === 0) return null

  return (
    <div className="reveal mb-10">
      <div className="mb-5">
        <h3 className="font-heading font-bold text-xl text-white leading-tight">{t("shippableStacksTitle")}</h3>
        <p className="text-white/45 text-sm mt-1">{t("shippableStacksSubtitle")}</p>
      </div>

      <div className={styles.grid}>
        {signatures.map((signature) => {
          const href =
            "/projects?" +
            signature.skills.map((skill) => `stackFilters=${encodeURIComponent(skill)}`).join("&")
          const label = getStackBundleLabel(signature.skills)
          const key = signature.skills.join("+")

          return (
            <Link key={key} href={href} className={`glass rounded-2xl p-5 ${styles.card}`}>
              <h4 className={styles.cardTitle}>{label}</h4>
              <div className={styles.tagRow}>
                {signature.skills.map((skill) => (
                  <Tag key={skill} variant="amber">{skill}</Tag>
                ))}
              </div>
              <p className={styles.shippedLine}>
                {t("projectsShipped", { count: signature.count })}
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
