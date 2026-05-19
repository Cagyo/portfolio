"use client"

import { useTranslations } from "next-intl"
import { cn } from "@/app/_lib/cn"
import { useConsent } from "./consent-context"

export function CookieSettingsLink({ className = "" }: { className?: string }) {
  const t = useTranslations("cookieConsent")
  const { reopen } = useConsent()

  return (
    <button
      type="button"
      className={cn(
        "cursor-pointer appearance-none border-0 bg-transparent p-0 font-[inherit] text-[inherit]",
        className,
      )}
      onClick={reopen}
    >
      {t("settingsLink")}
    </button>
  )
}