import { getTranslations } from 'next-intl/server'
import { CalendarIcon } from '@/assets/icons/CalendarIcon'
import { ExternalLinkIcon } from '@/assets/icons/ExternalLinkIcon'
import { TrackedLink } from '@/app/_components/tracked-link/TrackedLink'
import { siteConfig } from '@/app/_config/site-config'
import styles from './ContactCallCard.module.css'

export async function ContactCallCard() {
  const t = await getTranslations('contact')

  return (
    <div className={styles.card}>
      <div className={styles.copy}>
        <p className={styles.kicker}>{t('preferCall')}</p>
        <p className={styles.meta}>{t('bookDiscoveryMeta')}</p>
      </div>
      <TrackedLink
        href={siteConfig.calendly.url}
        target="_blank"
        rel="noopener noreferrer"
        tracking={{ action: 'calendly' }}
        className={styles.cta}
      >
        <CalendarIcon className={styles.ctaIcon} />
        <span className={styles.ctaText}>{t('bookDiscovery')}</span>
        <ExternalLinkIcon className={styles.externalIcon} />
      </TrackedLink>
    </div>
  )
}