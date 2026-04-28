"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { Button } from "@/app/_components/button/Button"
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
      className={styles.panel}
      onTransitionEnd={handleTransitionEnd}
    >
      <div className={styles.content}>
        <h2 className={styles.title}>{t("title")}</h2>
        <p className={styles.description}>
          {t.rich("description", {
            policyLink: (chunks) => (
              <Link href="/privacy" className={styles.policyLink}>
                {chunks}
              </Link>
            ),
          })}
        </p>
      </div>
      <div className={styles.actions}>
        <Button type="button" variant="outline" className={styles.actionButton} onClick={() => setConsent("denied")}>
          {t("decline")}
        </Button>
        <Button
          type="button"
          variant="primary"
          className={`${styles.actionButton} ${styles.acceptButton}`}
          onClick={() => setConsent("granted")}
        >
          {t("accept")}
        </Button>
      </div>
    </section>
  )
}