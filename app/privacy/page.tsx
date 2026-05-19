import { getTranslations } from "next-intl/server"
import { BlobBackground } from "@/app/_components/BlobBackground"
import { CookieSettingsLink } from "@/app/_components/cookie-consent/CookieSettingsLink"
import { SubpageNav } from "@/app/_components/nav/SubpageNav"
import { siteConfig } from "@/app/_config/site-config"
import { JsonLd } from "@/app/_schema/JsonLd"
import { absoluteUrl } from "@/app/_schema/absolute-url"
import { buildBreadcrumbSchema } from "@/app/_schema/breadcrumb"

const LAST_UPDATED = "2026-04-28"

type PrivacyTableItem = {
  name: string
  category: string
  duration: string
  purpose: string
}

const sectionClassName = "min-w-0 rounded-[20px] border border-border bg-card p-5 shadow-[var(--card-shadow)] backdrop-blur-[10px] [html[data-theme=light]_&]:bg-[color-mix(in_srgb,var(--bg)_90%,transparent)] max-md:p-4"
const sectionTitleClassName = "mb-[0.85rem] font-heading text-[1.15rem] font-bold"
const bodyTextClassName = "leading-[1.7] text-foreground-soft"
const tableCellClassName = "border-b border-border px-4 py-3.5 text-left align-top text-[0.95rem] leading-[1.55] text-foreground-soft"
const tableHeaderCellClassName = "border-b border-border px-4 py-3.5 text-left align-top text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground"

export async function generateMetadata() {
  const t = await getTranslations("privacyPage")
  const title = `${t("title")} — ${siteConfig.author.name}`
  const description = t("description")
  const url = absoluteUrl("/privacy")

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

export default async function Page({ params }: PageProps<"/privacy">) {
  await params

  const t = await getTranslations("privacyPage")
  const storedItems = t.raw("storedItems") as PrivacyTableItem[]
  const wouldStoreItems = t.raw("wouldStoreItems") as PrivacyTableItem[]
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: t("title"), path: "/privacy" },
  ])

  return (
    <div className="relative overflow-hidden">
      <JsonLd data={breadcrumbSchema} />
      <SubpageNav />
      <BlobBackground position="top-0 right-0" opacity={0.1} />
      <BlobBackground shade={600} position="bottom-0 left-0" opacity={0.08} />
      <main className="relative z-[1] mx-auto w-full max-w-[58rem] px-4 pb-20 pt-32 max-md:px-3 max-md:pt-28">
        <header className="mb-8">
          <h1 className="mb-3 font-heading text-[clamp(2.75rem,8vw,5rem)] font-black leading-[0.95] tracking-[-0.06em]">{t("title")}</h1>
          <p className="max-w-3xl text-lg leading-[1.7] text-foreground-soft max-md:text-base">{t("description")}</p>
          <p className="mt-4 text-sm text-muted-foreground">
            {t("lastUpdatedLabel")} <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time>
          </p>
        </header>

        <div className="grid gap-4">
          <PrivacyTable title={t("storedTitle")} items={storedItems} />
          <PrivacyTable title={t("wouldStoreTitle")} items={wouldStoreItems} />

          <section className={sectionClassName} aria-labelledby="privacy-third-parties">
            <h2 id="privacy-third-parties" className={sectionTitleClassName}>{t("thirdPartiesTitle")}</h2>
            <p className={bodyTextClassName}>{t("thirdPartiesBody")}</p>
          </section>

          <section className={sectionClassName} aria-labelledby="privacy-revoke">
            <h2 id="privacy-revoke" className={sectionTitleClassName}>{t("revokeTitle")}</h2>
            <p className={bodyTextClassName}>{t("revokeBody")}</p>
            <CookieSettingsLink className="mt-4 inline-flex min-h-11 items-center rounded-xl border border-[color-mix(in_srgb,var(--amber)_45%,transparent)] px-4 py-2.5 text-[0.9rem] font-bold text-amber transition-[background-color,border-color] duration-200 hover:border-amber hover:bg-amber/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber [html[data-theme=light]_&]:border-border-amber [html[data-theme=light]_&]:text-[var(--tag-color)] [html[data-theme=light]_&]:hover:border-[color-mix(in_srgb,var(--amber-dark)_45%,transparent)] [html[data-theme=light]_&]:hover:bg-[color-mix(in_srgb,var(--amber)_12%,transparent)] [html[data-theme=light]_&]:hover:text-[color-mix(in_srgb,var(--amber-dark)_80%,black)]" />
          </section>

          <section className={sectionClassName} aria-labelledby="privacy-contact">
            <h2 id="privacy-contact" className={sectionTitleClassName}>{t("contactTitle")}</h2>
            <p className={bodyTextClassName}>
              {t("contactBody")} {" "}
              <a className="text-amber underline-offset-[0.16em] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber [html[data-theme=light]_&]:text-[var(--tag-color)]" href={`mailto:${siteConfig.author.email}`}>
                {siteConfig.author.email}
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}

async function PrivacyTable({ title, items }: { title: string; items: PrivacyTableItem[] }) {
  const t = await getTranslations("privacyPage.tableHeaders")
  const headingId = `privacy-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`

  return (
    <section className={sectionClassName} aria-labelledby={headingId}>
      <h2 id={headingId} className={sectionTitleClassName}>{title}</h2>
      <div className="min-w-0 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[42rem] border-collapse">
          <thead>
            <tr>
              <th className={tableHeaderCellClassName} scope="col">{t("name")}</th>
              <th className={tableHeaderCellClassName} scope="col">{t("category")}</th>
              <th className={tableHeaderCellClassName} scope="col">{t("duration")}</th>
              <th className={tableHeaderCellClassName} scope="col">{t("purpose")}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.name} className="last:[&>td]:border-b-0">
                <td className={tableCellClassName}><span className="inline-flex items-center rounded-full border border-[color-mix(in_srgb,var(--amber)_24%,transparent)] bg-amber/10 px-[0.55rem] py-[0.2rem] font-mono text-[0.8125rem] text-amber [html[data-theme=light]_&]:border-[var(--tag-border)] [html[data-theme=light]_&]:bg-[var(--tag-bg)] [html[data-theme=light]_&]:text-[var(--tag-color)]">{item.name}</span></td>
                <td className={tableCellClassName}>{item.category}</td>
                <td className={tableCellClassName}>{item.duration}</td>
                <td className={tableCellClassName}>{item.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}