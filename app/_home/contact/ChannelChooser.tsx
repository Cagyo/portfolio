import { getTranslations } from 'next-intl/server'
import { ExternalLinkIcon } from '@/assets/icons/ExternalLinkIcon'
import { TelegramLogo } from '@/assets/logos/TelegramLogo'
import { WhatsAppLogo } from '@/assets/logos/WhatsAppLogo'
import { TrackedLink } from '@/app/_components/tracked-link/TrackedLink'
import { siteConfig } from '@/app/_config/site-config'
import type { LinkTracking } from '@/app/_analytics/analytics'

type Channel = {
  href: string
  title: string
  meta: string
  icon: React.ReactNode
  bubbleClass: string
  hoverBorderClass: string
  hoverIconClass: string
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
      bubbleClass: "bg-[var(--telegram-blue)]",
      hoverBorderClass: "hover:border-[color-mix(in_srgb,var(--telegram-blue)_40%,transparent)]",
      hoverIconClass: "group-hover:text-[var(--telegram-blue)] group-hover:translate-x-0.5",
      tracking: { action: 'outbound', target: 'telegram' },
    },
    {
      href: siteConfig.social.whatsapp.url,
      title: t('channels.whatsappTitle'),
      meta: t('channels.whatsappMeta'),
      icon: <WhatsAppLogo className="w-5 h-5 text-foreground" />,
      bubbleClass: "bg-[var(--whatsapp-green)]",
      hoverBorderClass: "hover:border-[color-mix(in_srgb,var(--whatsapp-green)_40%,transparent)]",
      hoverIconClass: "group-hover:text-[var(--whatsapp-green)] group-hover:translate-x-0.5",
      tracking: { action: 'outbound', target: 'whatsapp' },
    },
  ]

  return (
    <div>
      <p className="text-ghost-foreground text-[0.6875rem] uppercase tracking-[0.18em] font-semibold mb-2">
        {t('channels.eyebrow')}
      </p>
      <div className="flex flex-wrap gap-2">
        {channels.map((channel) => (
          <TrackedLink
            key={channel.title}
            href={channel.href}
            target="_blank"
            rel="noopener noreferrer"
            tracking={channel.tracking}
            className={`group inline-flex items-center gap-2 min-h-10 px-2.5 py-1.5 rounded-full text-foreground-soft bg-foreground/3 border border-foreground/8 transition-[color,background,border-color] duration-200 hover:bg-foreground/5 ${channel.hoverBorderClass}`}
          >
            <span className={`w-[1.625rem] h-[1.625rem] rounded-full flex items-center justify-center shrink-0 ${channel.bubbleClass}`}>
              {channel.icon}
            </span>
            <span className="flex items-baseline gap-1.5 min-w-0">
              <span className="text-foreground-soft">{channel.title}</span>
              <span className="text-ghost-foreground">{channel.meta}</span>
            </span>
            <ExternalLinkIcon
              className={`w-3.5 h-3.5 shrink-0 text-faint-foreground transition-[color,transform] duration-200 ${channel.hoverIconClass}`}
            />
          </TrackedLink>
        ))}
      </div>
    </div>
  )
}
