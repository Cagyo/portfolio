import { getTranslations } from 'next-intl/server'
import { ExternalLinkIcon } from '@/assets/icons/ExternalLinkIcon'
import { CalendarIcon } from '@/assets/icons/CalendarIcon'
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
      icon: <TelegramLogo className="w-5 h-5 text-white" />,
      bubbleClass: styles.bubbleTelegram,
      hoverClass: styles.cardTelegram,
      tracking: { action: 'outbound', target: 'telegram' },
    },
    {
      href: siteConfig.social.whatsapp.url,
      title: t('channels.whatsappTitle'),
      meta: t('channels.whatsappMeta'),
      icon: <WhatsAppLogo className="w-5 h-5 text-white" />,
      bubbleClass: styles.bubbleWhatsapp,
      hoverClass: styles.cardWhatsapp,
      tracking: { action: 'outbound', target: 'whatsapp' },
    },
    {
      href: siteConfig.calendly.url,
      title: t('channels.calendlyTitle'),
      meta: t('channels.calendlyMeta'),
      icon: <CalendarIcon className="w-5 h-5 text-white" />,
      bubbleClass: styles.bubbleCalendly,
      hoverClass: styles.cardCalendly,
      tracking: { action: 'calendly' },
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
            className={`group glass rounded-2xl p-4 flex items-center gap-3 transition-all duration-200 cursor-pointer ${channel.hoverClass}`}
          >
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105 ${channel.bubbleClass}`}
            >
              {channel.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm">{channel.title}</p>
              <p className="text-white/35 text-xs mt-0.5">{channel.meta}</p>
            </div>
            <ExternalLinkIcon className={`w-4 h-4 flex-shrink-0 ${styles.externalIcon}`} />
          </TrackedLink>
        ))}
      </div>
    </div>
  )
}
