"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import Lightbox from "yet-another-react-lightbox"
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen"
import Zoom from "yet-another-react-lightbox/plugins/zoom"
import Counter from "yet-another-react-lightbox/plugins/counter"
import type { Screenshot } from "@/app/_data/projects-data"
import styles from "./ProjectScreenshots.module.css"

type ProjectScreenshotsProps = {
  screenshots: Screenshot[]
  projectTitle: string
}

export function ProjectScreenshots({ screenshots, projectTitle }: ProjectScreenshotsProps) {
  const t = useTranslations("projectsPage")
  const [viewerIndex, setViewerIndex] = useState(-1)
  const [failedIndices, setFailedIndices] = useState<Set<number>>(new Set())

  const handleImageError = useCallback((index: number) => {
    setFailedIndices((prev) => new Set(prev).add(index))
  }, [])

  if (!screenshots.length) return null

  const slides = screenshots.map((shot, index) => ({
    src: shot.src,
    alt: shot.alt || t("screenshotAltFallback", { title: projectTitle, n: index + 1 }),
    width: shot.width ?? 1200,
    height: shot.height ?? 675,
  }))

  return (
    <div className={styles.wrap}>
      <p className={styles.heading}>{t("screenshotsHeading")}</p>

      <div className={styles.grid} data-count={screenshots.length}>
        {screenshots.map((shot, index) => {
          const alt = shot.alt || t("screenshotAltFallback", { title: projectTitle, n: index + 1 })
          const failed = failedIndices.has(index)

          return (
            <button
              key={shot.src}
              type="button"
              className={styles.tile}
              onClick={() => setViewerIndex(index)}
              aria-label={alt}
            >
              {failed ? (
                <div className={styles.errorPlaceholder}>—</div>
              ) : (
                <Image
                  src={shot.src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 240px, 33vw"
                  className={styles.tileImage}
                  onError={() => handleImageError(index)}
                />
              )}

              {shot.kind === "blurred" && (
                <span className={`${styles.chip} ${styles.chipBlurred}`}>
                  {t("ndaAnonymized")}
                </span>
              )}
              {shot.kind === "web" && (
                <span className={`${styles.chip} ${styles.chipWeb}`}>
                  {t("screenshotWebLabel")}
                </span>
              )}
              {shot.kind === "mobile" && (
                <span className={`${styles.chip} ${styles.chipMobile}`}>
                  {t("screenshotMobileLabel")}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <Lightbox
        open={viewerIndex >= 0}
        close={() => setViewerIndex(-1)}
        index={viewerIndex}
        slides={slides}
        plugins={[Fullscreen, Zoom, Counter]}
      />
    </div>
  )
}
