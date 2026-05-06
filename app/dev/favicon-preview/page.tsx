import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import { ThemeToggle } from '@/app/_components/theme/ThemeToggle'
import { getInitialIsDark } from '@/app/_components/theme/get-initial-is-dark'
import { siteConfig } from '@/app/_config/site-config'
import { IconMarkFace } from '@/app/_og/icon-mark-face'
import styles from './FaviconPreview.module.css'

const PREVIEW_SIZES = [16, 32, 48, 64, 128, 180, 512] as const
const NAV_BADGE_SIZES = [32, 64, 128] as const

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Favicon preview — Oleksii Berliziev',
    robots: { index: false, follow: false },
  }
}

type CandidateName = 'face' | 'mono'

type CandidateRowProps = {
  name: CandidateName
  title: string
  note: string
}

function renderCandidate(name: CandidateName, previewSize: number) {
  if (name === 'face') {
    return <IconMarkFace size={previewSize} />
  }

  return <IconMarkMono size={previewSize} />
}

function CandidateRow({ name, title, note }: CandidateRowProps) {
  return (
    <section className={styles.section} aria-labelledby={`${name}-candidate-title`}>
      <div className={styles.sectionHeader}>
        <h2 id={`${name}-candidate-title`} className={styles.sectionTitle}>
          {title}
        </h2>
        <p className={styles.sectionNote}>{note}</p>
      </div>
      <div className={styles.samples}>
        {PREVIEW_SIZES.map((previewSize) => {
          const isLargeSample = previewSize === 512
          const sampleClassName = isLargeSample
            ? `${styles.sample} ${styles.sampleLarge}`
            : styles.sample

          return (
            <div key={`${name}-${previewSize}`} className={sampleClassName}>
              <div className={styles.markStage}>{renderCandidate(name, previewSize)}</div>
              <span className={styles.label}>{previewSize}px</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function NavBadgeReference() {
  return (
    <div className={styles.navBadgeGroup}>
      {NAV_BADGE_SIZES.map((badgeSize) => (
        <div key={badgeSize}>
          <div
            className={styles.navBadge}
            style={{
              width: badgeSize,
              height: badgeSize,
              fontSize: badgeSize * 0.38,
            }}
          >
            OB
          </div>
          <span className={styles.label}>{badgeSize}px</span>
        </div>
      ))}
    </div>
  )
}

export default async function Page() {
  if (process.env.NODE_ENV !== 'development') notFound()

  const initialIsDark = await getInitialIsDark()

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>berliziev.dev</p>
            <h1 className={styles.title}>Favicon candidates</h1>
            <p className={styles.summary}>
              Dark-background favicon marks paired against the existing amber navigation badge and
              the current OG card system.
            </p>
          </div>
          <div className={styles.toggleWrap}>
            <span>Theme</span>
            <ThemeToggle initialIsDark={initialIsDark} />
          </div>
        </header>

        <CandidateRow
          name="face"
          title="Rotated B face mark"
          note="Archivo letterforms rotate into a compact face read."
        />

        <section className={styles.section} aria-labelledby="reference-title">
          <div className={styles.sectionHeader}>
            <h2 id="reference-title" className={styles.sectionTitle}>
              Brand references
            </h2>
            <p className={styles.sectionNote}>
              The favicon should feel related to these without becoming identical to either one.
            </p>
          </div>
          <div className={styles.referenceGrid}>
            <div className={styles.referencePanel}>
              <p className={styles.referenceTitle}>Nav badge clone</p>
              <NavBadgeReference />
            </div>
            <div className={styles.referencePanel}>
              <p className={styles.referenceTitle}>Root OG image</p>
              <Image
                className={styles.ogImage}
                src="/opengraph-image"
                alt={`${siteConfig.author.name} portfolio OG card`}
                width={1200}
                height={630}
                priority
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}