"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { Button } from "@/app/_components/button/Button"
import { cn } from "@/app/_lib/cn"
import { useConsent } from "./consent-context"
import styles from "./CookieConsent.module.css"

export function CookieConsent() {
  const t = useTranslations("cookieConsent")
  const { status, hydrated, forceOpen, focusRequestId, setConsent } = useConsent()
  const panelRef = useRef<HTMLElement>(null)
  const [isRendered, setIsRendered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [focusedRequestId, setFocusedRequestId] = useState(0)
  const shouldBeOpen = hydrated && (status === "unset" || forceOpen)

  useEffect(() => {
    if (!shouldBeOpen) return

    const enterDelay = forceOpen ? 16 : 250
    const renderTimer = window.setTimeout(() => setIsRendered(true), 0)
    const visibleTimer = window.setTimeout(() => setIsVisible(true), enterDelay)

    return () => {
      window.clearTimeout(renderTimer)
      window.clearTimeout(visibleTimer)
    }
  }, [shouldBeOpen, forceOpen])

  useEffect(() => {
    if (shouldBeOpen || !isRendered) return

    const closeTimer = window.setTimeout(() => setIsVisible(false), 0)
    const unmountTimer = window.setTimeout(() => setIsRendered(false), 300)

    return () => {
      window.clearTimeout(closeTimer)
      window.clearTimeout(unmountTimer)
    }
  }, [shouldBeOpen, isRendered])

  useEffect(() => {
    if (!isVisible || focusRequestId <= focusedRequestId) return

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const focusDelay = prefersReducedMotion ? 150 : 350
    const timer = window.setTimeout(() => {
      panelRef.current?.focus({ preventScroll: true })
      setFocusedRequestId(focusRequestId)
    }, focusDelay)

    return () => window.clearTimeout(timer)
  }, [isVisible, focusRequestId, focusedRequestId])

  if (!isRendered) return null

  function handleTransitionEnd(event: React.TransitionEvent<HTMLElement>) {
    if (event.target !== event.currentTarget) return
    if (isVisible) return
    if (event.propertyName !== "opacity" && event.propertyName !== "transform") return

    setIsRendered(false)
  }

  return (
    <section
      ref={panelRef}
      role="region"
      aria-label={t("regionLabel")}
      aria-live="polite"
      tabIndex={-1}
      data-state={isVisible ? "open" : "closed"}
      className={cn(
        styles.panel,
        "fixed right-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-3 z-[35] mx-auto grid max-w-[min(720px,calc(100%_-_1.5rem))] grid-rows-[auto_auto] gap-y-3.5 rounded-[14px] border border-border px-[1.125rem] py-4 shadow-[var(--card-shadow)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber md:right-4 md:bottom-[max(1rem,env(safe-area-inset-bottom))] md:left-4 md:flex md:max-w-[min(720px,calc(100%_-_2rem))] md:flex-wrap md:items-end md:gap-6 md:rounded-2xl md:px-6 md:py-5 print:hidden",
      )}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className="min-w-0 md:min-w-80 md:flex-[1_1_320px]">
        <h2 className="mb-1.5 font-heading text-[0.9375rem] leading-[1.2] font-semibold text-foreground md:text-base">
          {t("title")}
        </h2>
        <p className="max-w-[56ch] font-body text-[0.8125rem] leading-[1.5] text-foreground-soft md:text-sm md:leading-[1.55]">
          {t.rich("description", {
            policyLink: (chunks) => (
              <Link
                href="/privacy"
                className="text-amber underline underline-offset-[0.16em] transition-colors hover:text-amber-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
              >
                {chunks}
              </Link>
            ),
          })}
        </p>
      </div>
      <div className="flex flex-col gap-2 md:flex-[0_0_20rem] md:flex-row md:flex-wrap md:items-end md:gap-6">
        <Button
          type="button"
          variant="outline"
          className="min-h-11 cursor-pointer justify-center rounded-[10px] px-[1.125rem] py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
          onClick={() => setConsent("denied")}
        >
          {t("decline")}
        </Button>
        <Button
          type="button"
          variant="primary"
          className="min-h-11 cursor-pointer justify-center rounded-[10px] px-[1.125rem] py-2.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber max-[359px]:order-first"
          onClick={() => setConsent("granted")}
        >
          {t("accept")}
        </Button>
      </div>
    </section>
  )
}
