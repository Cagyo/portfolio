"use client"

import { useTranslations } from "next-intl"
import { useConsent } from "./consent-context"
import styles from "./CookieConsent.module.css"

export function CookieSettingsLink({ className = "" }: { className?: string }) {
  const t = useTranslations("cookieConsent")
  const { reopen } = useConsent()

  return (
    <button type="button" className={`${styles.settingsLink} ${className}`} onClick={reopen}>
      {t("settingsLink")}
    </button>
  )
}