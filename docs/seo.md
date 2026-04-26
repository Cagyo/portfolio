# SEO

> Read when adding a route, editing the `metadata` / `og` namespaces in `messages/en.json`, adding a JSON-LD schema, or wiring a new OG image.

Five layers. Each one has a single home in the codebase — never duplicate the logic elsewhere.

```
Discovery        → app/sitemap.ts, app/robots.ts                static, sourced from siteConfig.url
Metadata         → generateMetadata() + getTranslations()       root layout + per-route page.tsx
Social cards     → opengraph-image.tsx / twitter-image.tsx      per route, via renderOg()
Structured data  → <JsonLd> + app/_schema/* builders            root layout (Person, WebSite) + per route
URL hygiene      → absoluteUrl()                                app/_schema/absolute-url.ts (single source)
```

## Single source of truth — `siteConfig`

All external URLs, social handles, author name, and email come from `app/_config/site-config.ts`. SEO consumers read:

```ts
siteConfig.url                // base URL — feeds sitemap, robots, absoluteUrl, OG card footer
siteConfig.author.name        // OG card signature, openGraph.siteName
siteConfig.author.email       // Person schema
siteConfig.social.{github, linkedin, twitter}.url   // Person.sameAs (empty entries filtered out)
```

Never hardcode a URL or handle in a component or schema builder.

## Metadata — always `generateMetadata`, never static export

This mirrors the next-intl rule from [docs/i18n.md](i18n.md). Static `export const metadata` cannot call `getTranslations`.

**Root layout** (`app/layout.tsx`) sets the site-wide tags once:

```ts
export async function generateMetadata() {
  const t = await getTranslations('metadata')
  return {
    metadataBase: new URL(siteConfig.url),
    title: t('title'),
    description: t('description'),
    openGraph: { type: 'website', siteName: siteConfig.author.name, locale: 'en_US' },
    twitter:   { card: 'summary_large_image' },
  }
}

export const viewport = { themeColor: '#F59E0B' }
```

**Per-route `page.tsx`** sets only `title`, suffixed with the author name:

```ts
export async function generateMetadata() {
  const t = await getTranslations('projectsPage')
  return { title: `${t('title')} — Oleksii Berliziev` }
}
```

Don't re-declare `metadataBase`, `openGraph`, `twitter`, or `description` per route — they cascade from the root layout.

## i18n namespaces for SEO

| Namespace | Used by | Keys |
| --- | --- | --- |
| `metadata` | root layout, `Person` schema | `title`, `description`, `jobTitle` |
| `og.home` | `app/opengraph-image.tsx` | `eyebrow`, `title`, `description` |
| `og.projects` | `app/projects/opengraph-image.tsx` | same shape |
| `og.mentorship` | `app/mentorship/opengraph-image.tsx` | same shape |
| `<route>Page` | per-route `generateMetadata` | `title` (e.g. `projectsPage.title`) |

Adding a route always means adding one `og.<route>` block and one `<route>Page.title`.

## Sitemap — `app/sitemap.ts`

Static `MetadataRoute.Sitemap` array. Adding a route = adding one entry.

```ts
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return [
    { url: siteConfig.url, lastModified },
    { url: `${siteConfig.url}/projects`, lastModified },
    // { url: `${siteConfig.url}/mentorship`, lastModified },
  ]
}
```

`/mentorship` is intentionally commented out — uncomment when the page is ready to be indexed. Don't switch to a dynamic sitemap unless the route set actually becomes data-driven.

## Robots — `app/robots.ts`

```ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: '/api/' }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  }
}
```

Don't add per-bot rules ad-hoc — discuss before narrowing crawler access.

## OG images — one template, three callers

`app/_og/og-template.tsx` exports `renderOg(props)`, `size`, and `contentType`. Each route's `opengraph-image.tsx` is a thin wrapper:

```tsx
// app/projects/opengraph-image.tsx
import { getTranslations } from 'next-intl/server'
import { renderOg, size, contentType } from '@/app/_og/og-template'

export { size, contentType }
export const alt = 'Projects — Oleksii Berliziev portfolio'

export default async function Image() {
  const t = await getTranslations({ locale: 'en', namespace: 'og.projects' })
  return renderOg({ eyebrow: t('eyebrow'), title: t('title'), description: t('description') })
}
```

`twitter-image.tsx` re-exports the OG file — never duplicate the asset:

```ts
export { default, alt, size, contentType } from './opengraph-image'
```

### Soft caps (template warns at render time)

| Field | Cap | Why |
| --- | --- | --- |
| `eyebrow` | ~20 chars | Single uppercase line beside the amber dot |
| `title` | 52 chars | Archivo 700 88px, two lines max in the bbox |
| `description` | 110 chars | Space Grotesk 28px, three lines max |

### Assets

Fonts: `assets/fonts/Archivo-Bold.ttf`, `Archivo-Medium.ttf`, `SpaceGrotesk-Regular.ttf`. Avatar: `public/og/avatar.png`. `loadAsset()` throws a descriptive error if anything is missing — commit the file before referencing it.

Visual restyling goes through `app/_og/tokens.ts`, never inline `style={{}}` values in the template.

## Structured data — JSON-LD

Render with `<JsonLd data={...} />` from `app/_schema/JsonLd.tsx`. It emits a plain `<script type="application/ld+json">` anywhere in the tree — Google parses JSON-LD from anywhere in the document, no `<head>` injection or `next/script` needed.

### Where each schema is emitted

| Route | Schemas |
| --- | --- |
| **Root layout** (every route) | `Person`, `WebSite` |
| `/` | (root only) |
| `/projects` | `BreadcrumbList`, `ItemList` |
| `/mentorship` | `BreadcrumbList`, `ProfessionalService` |

`Person` and `WebSite` are emitted **once** in the root layout. **Never re-emit them on subpages** — duplicate Person nodes confuse the entity graph. Per-route schemas reference the root nodes via `@id`:

```ts
// in a per-route schema builder
provider: { '@id': absoluteUrl('/#person') }
author:   { '@id': absoluteUrl('/#person') }
```

### Builders

All builders live in `app/_schema/` and have a co-located `*.test.ts`:

```
person.ts                  buildPersonSchema(t)              — root layout, once
website.ts                 buildWebSiteSchema(t)             — root layout, once
breadcrumb.ts              buildBreadcrumbSchema(items)      — every subpage
item-list.ts               buildProjectsItemListSchema(...)  — /projects
professional-service.ts    buildMentorshipServiceSchema(...) — /mentorship
```

### Rules baked into the builders — preserve them

- **`ItemList` project names go through `getProjectTitle()`** so JSON-LD mirrors the displayed title (respects `SHOW_REAL_PROJECT_NAMES`). Don't bypass it — that's cloaking, and it breaks the alignment guard test.
- **`Person.sameAs` filters empty social URLs.** When `siteConfig.social.twitter.url` is `''`, it's dropped — keep this filter when adding new social links.
- **`ProfessionalService` has no `hasOfferCatalog`.** Pricing is marketing copy, not authoritative config; publishing it from on-page text risks the "structured data inconsistent with on-page content" manual action. Don't add a catalog until real prices land in a config block.
- **`WebSite` has no `potentialAction`/`SearchAction`.** There is no search endpoint — inventing one misleads crawlers.

## `absoluteUrl()` — always use it

`app/_schema/absolute-url.ts`:

```ts
export function absoluteUrl(path = ''): string {
  const base = siteConfig.url.replace(/\/$/, '')
  if (!path || path === '/') return base
  if (path.startsWith('http')) return path
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}
```

Every `@id`, `url`, and `image` in the schema builders goes through it.

```ts
// ❌
url: `${siteConfig.url}/projects`
'@id': siteConfig.url + '/#person'

// ✅
url: absoluteUrl('/projects')
'@id': absoluteUrl('/#person')
```

## Checklist — adding a new route

1. Add `generateMetadata()` to the route's `page.tsx` using `getTranslations('<route>Page')` and the `\`${t('title')} — Oleksii Berliziev\`` suffix.
2. Add a sitemap entry in `app/sitemap.ts`.
3. Add an `og.<route>` block to `messages/en.json` (`eyebrow`, `title`, `description`) — respect the soft caps.
4. Create `app/<route>/opengraph-image.tsx` calling `renderOg(...)` with that namespace, plus an `alt` string.
5. Create `app/<route>/twitter-image.tsx` as a one-line re-export of `./opengraph-image`.
6. Emit `<JsonLd data={buildBreadcrumbSchema([{ name: 'Home', path: '/' }, { name: t('title'), path: '/<route>' }])} />` on the page.
7. If the page has list / service / article / event content → add a builder under `app/_schema/<schema>.ts` (with a co-located `*.test.ts`) and emit it on the page. Reference Person/WebSite via `@id`, never re-inline.
8. Run `yarn check`.
9. Verify locally:
   - `/sitemap.xml` lists the new route
   - `/robots.txt` is unchanged
   - `/<route>/opengraph-image` renders the card
   - Page HTML passes Google's Rich Results Test for every emitted schema

## Anti-patterns

- ❌ `siteConfig.url + '/foo'` — use `absoluteUrl('/foo')`.
- ❌ Re-emitting `Person` or `WebSite` on a subpage.
- ❌ Hardcoded URLs, social handles, or author name in components or builders — read from `siteConfig`.
- ❌ `export const metadata = { ... }` — must be `async generateMetadata()` so it can call `getTranslations` (see [docs/i18n.md](i18n.md)).
- ❌ Inventing `potentialAction` / `SearchAction` on `WebSite` — there is no search endpoint.
- ❌ Adding fonts or images to `og-template.tsx` without committing them under `assets/fonts/` or `public/og/`.
- ❌ `twitter-image.tsx` as a copy of the OG file — it must be a re-export.
- ❌ Schema builder without a co-located `*.test.ts` under `app/_schema/`.
- ❌ Inline `style={{}}` overrides in `og-template.tsx` — restyle via `app/_og/tokens.ts`.
