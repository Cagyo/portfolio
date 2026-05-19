import { getTranslations } from 'next-intl/server'
import { CalendarIcon } from '@/assets/icons/CalendarIcon'
import { ExternalLinkIcon } from '@/assets/icons/ExternalLinkIcon'
import { TrackedLink } from '@/app/_components/tracked-link/TrackedLink'
import { siteConfig } from '@/app/_config/site-config'

export async function ContactCallCard() {
  const t = await getTranslations('contact')

  return (
    <div
      className={[
        "grid gap-3.5 p-4 rounded-[1.25rem] border border-border-amber backdrop-blur-[8px]",
        "bg-[radial-gradient(circle_at_100%_0%,color-mix(in_srgb,var(--amber)_22%,transparent)_0%,transparent_46%),var(--glass-amber-bg)]",
        "[html[data-theme=light]_&]:bg-[radial-gradient(circle_at_100%_0%,color-mix(in_srgb,var(--amber)_16%,transparent)_0%,transparent_48%),color-mix(in_srgb,var(--amber)_7%,var(--surface))]",
        "sm:grid-cols-[minmax(0,1fr)_minmax(14rem,auto)] sm:items-center sm:p-[1rem_1.125rem]",
      ].join(' ')}
    >
      <div className="grid gap-1">
        <p className="text-amber-foreground text-xs font-bold tracking-[0.14em] uppercase [html[data-theme=light]_&]:text-[var(--tag-color)]">
          {t('preferCall')}
        </p>
        <p className="text-muted-foreground text-sm leading-[1.45]">{t('bookDiscoveryMeta')}</p>
      </div>
      <TrackedLink
        href={siteConfig.calendly.url}
        target="_blank"
        rel="noopener noreferrer"
        tracking={{ action: 'calendly' }}
        className={[
          "flex min-h-14 items-center justify-center gap-2.5 px-4 py-3.5 rounded-[0.875rem] text-center",
          "border border-amber/42 bg-amber/16 text-foreground text-[0.9375rem] font-bold leading-[1.25]",
          "transition-[transform,border-color,background] duration-[180ms] ease-[ease]",
          "hover:-translate-y-px hover:border-amber/62 hover:bg-amber/22",
          "[html[data-theme=light]_&]:text-foreground [html[data-theme=light]_&]:bg-amber/13 [html[data-theme=light]_&]:border-border-amber",
          "[html[data-theme=light]_&]:hover:bg-amber/19 [html[data-theme=light]_&]:hover:border-amber/42",
          "focus-visible:outline-2 focus-visible:outline-amber-foreground focus-visible:outline-offset-[3px]",
          "sm:justify-between sm:text-left",
          "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        ].join(' ')}
      >
        <CalendarIcon className="w-[1.125rem] h-[1.125rem] shrink-0 text-amber-foreground [html[data-theme=light]_&]:text-[var(--tag-color)]" />
        <span className="min-w-0">{t('bookDiscovery')}</span>
        <ExternalLinkIcon className="w-[1.125rem] h-[1.125rem] shrink-0 text-amber-foreground [html[data-theme=light]_&]:text-[var(--tag-color)]" />
      </TrackedLink>
    </div>
  )
}
