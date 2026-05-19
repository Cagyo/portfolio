import { getTranslations } from 'next-intl/server'
import { ExternalLinkIcon } from '@/assets/icons/ExternalLinkIcon'
import { TelegramLogo } from '@/assets/logos/TelegramLogo'
import { WhatsAppLogo } from '@/assets/logos/WhatsAppLogo'
import { TrackedLink } from '@/app/_components/tracked-link/TrackedLink'
import { siteConfig } from '@/app/_config/site-config'
import type { LinkTracking } from '@/app/_analytics/analytics'
import styles from './ChannelChooser.module.css'

type Channel = {
  href: string
  title: string
  meta: string
  icon: React.ReactNode
  bubbleClass: string
  hoverClass: string
  tracking: LinkTracking
}

export async function ChannelChooser() {
  const t = await getTranslations('contact')

  const channels: Channel[] = [
    {
      href: siteConfig.social.telegram.url,
      title: t('channels.telegramTitle'),
      meta: t('channels.telegramMeta'),
      icon: <TelegramLogo className="w-5 h-5 text-foreground" />,
      bubbleClass: styles.bubbleTelegram,
      hoverClass: styles.cardTelegram,
      tracking: { action: 'outbound', target: 'telegram' },
    },
    {
      href: siteConfig.social.whatsapp.url,
      title: t('channels.whatsappTitle'),
      meta: t('channels.whatsappMeta'),
      icon: <WhatsAppLogo className="w-5 h-5 text-foreground" />,
      bubbleClass: styles.bubbleWhatsapp,
      hoverClass: styles.cardWhatsapp,
      tracking: { action: 'outbound', target: 'whatsapp' },
    },
  ]

  return (
    <div className={styles.wrapper}>
      <p className={styles.eyebrow}>{t('channels.eyebrow')}</p>
      <div className={styles.grid}>
        {channels.map((channel) => (
          <TrackedLink
            key={channel.title}
            href={channel.href}
            target="_blank"
            rel="noopener noreferrer"
            tracking={channel.tracking}
            className={`group ${styles.channelLink} ${channel.hoverClass}`}
          >
            <span className={`${styles.bubble} ${channel.bubbleClass}`}>
              {channel.icon}
            </span>
            <span className={styles.linkText}>
              <span className={styles.cardTitle}>{channel.title}</span>
              <span className={styles.cardMeta}>{channel.meta}</span>
            </span>
            <ExternalLinkIcon className={styles.externalIcon} />
          </TrackedLink>
        ))}
      </div>
    </div>
  )
}
