import { getTranslations } from "next-intl/server"
import { BlobBackground } from "@/app/_components/BlobBackground"
import { CookieSettingsLink } from "@/app/_components/cookie-consent/CookieSettingsLink"
import { SubpageNav } from "@/app/_components/nav/SubpageNav"
import { siteConfig } from "@/app/_config/site-config"
import { JsonLd } from "@/app/_schema/JsonLd"
import { absoluteUrl } from "@/app/_schema/absolute-url"
import { buildBreadcrumbSchema } from "@/app/_schema/breadcrumb"
import styles from "./PrivacyPage.module.css"

const LAST_UPDATED = "2026-04-28"

type PrivacyTableItem = {
  name: string
  category: string
  duration: string
  purpose: string
}

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
    <div className={styles.page}>
      <JsonLd data={breadcrumbSchema} />
      <SubpageNav />
      <BlobBackground position="top-0 right-0" opacity={0.1} />
      <BlobBackground shade={600} position="bottom-0 left-0" opacity={0.08} />
      <main className={styles.main}>
        <header className={styles.header}>
          <h1 className={styles.title}>{t("title")}</h1>
          <p className={styles.description}>{t("description")}</p>
          <p className={styles.updated}>
            {t("lastUpdatedLabel")} <time dateTime={LAST_UPDATED}>{LAST_UPDATED}</time>
          </p>
        </header>

        <div className={styles.content}>
          <PrivacyTable title={t("storedTitle")} items={storedItems} />
          <PrivacyTable title={t("wouldStoreTitle")} items={wouldStoreItems} />

          <section className={styles.section} aria-labelledby="privacy-third-parties">
            <h2 id="privacy-third-parties" className={styles.sectionTitle}>{t("thirdPartiesTitle")}</h2>
            <p className={styles.bodyText}>{t("thirdPartiesBody")}</p>
          </section>

          <section className={styles.section} aria-labelledby="privacy-revoke">
            <h2 id="privacy-revoke" className={styles.sectionTitle}>{t("revokeTitle")}</h2>
            <p className={styles.bodyText}>{t("revokeBody")}</p>
            <CookieSettingsLink className={styles.settingsButton} />
          </section>

          <section className={styles.section} aria-labelledby="privacy-contact">
            <h2 id="privacy-contact" className={styles.sectionTitle}>{t("contactTitle")}</h2>
            <p className={styles.bodyText}>
              {t("contactBody")} {" "}
              <a className={styles.emailLink} href={`mailto:${siteConfig.author.email}`}>
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
    <section className={styles.section} aria-labelledby={headingId}>
      <h2 id={headingId} className={styles.sectionTitle}>{title}</h2>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">{t("name")}</th>
              <th scope="col">{t("category")}</th>
              <th scope="col">{t("duration")}</th>
              <th scope="col">{t("purpose")}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.name}>
                <td><span className={styles.cookieName}>{item.name}</span></td>
                <td>{item.category}</td>
                <td>{item.duration}</td>
                <td>{item.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}