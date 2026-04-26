@AGENTS.md

# Code Conventions

## Deep-dive docs (read when relevant)

- Auth changes → [docs/auth.md](docs/auth.md)
- i18n / `messages/en.json` edits → [docs/i18n.md](docs/i18n.md)
- Adding SVG icons or logos → [docs/svg-icons.md](docs/svg-icons.md)
- Error boundaries / `error.tsx` / Server Function error contracts → [docs/error-handling.md](docs/error-handling.md)
- Forms (react-hook-form + zod) → [docs/forms.md](docs/forms.md)
- `@utility` blocks, CSS module internals, `color-mix` usage → [docs/styling-details.md](docs/styling-details.md)
- SEO: metadata, sitemap/robots, OG images, JSON-LD → [docs/seo.md](docs/seo.md)

## Stack

- **Next.js 16.2.0** (App Router only — no Pages Router)
- **React 19.2.4**
- **TypeScript 5** (strict)
- **Tailwind CSS 4**

## Tooling

- **Package manager**: `yarn` — never use `pnpm` or `npm`. All install/run/build commands must use `yarn`.
- **Verification after changes**: run `yarn check` (typecheck + lint) to confirm no regressions.

---

## Naming

### Files & Folders

| Type | Convention | Example |
| --- | --- | --- |
| Next.js special files | `kebab-case` (framework-enforced) | `page.tsx`, `loading.tsx`, `not-found.tsx` |
| Route folders | `kebab-case` | `app/blog-posts/[slug]/` |
| Route groups | `kebab-case` in parens | `app/(marketing)/` |
| Private folders | `_kebab-case` | `app/blog/_components/` |
| Component files | `PascalCase.tsx` | `PostCard.tsx`, `NavMenu.tsx` |
| Hook files | `use-kebab-case.ts` | `use-scroll-position.ts` |
| Utility / action / query / type / schema / constants files | `kebab-case.ts` | `format-date.ts`, `post-actions.ts`, `post-queries.ts`, `post-types.ts`, `post-schema.ts`, `site-config.ts` |

**Config directory**: `app/_config/` — app-wide structural config (URLs, social handles, feature flags).

### Component Subdirectory Grouping

Within `_components/` and feature folders, group logically related files into `kebab-case` subdirectories. A component file, its CSS module, co-located hooks, and data files all move together.

**Rules:**
- Group when 3+ files share a domain/feature and are only consumed together
- CSS modules always move with their component (never split across directories)
- No `index.ts` barrel files — import directly from the source file
- Use `@/` alias for all imports that cross more than one directory level — never write `../../` paths
- Same-directory imports (`./foo`) stay as-is
- Shared utilities/data used across groups stay at the parent level

### Components

- **PascalCase**, always matches filename
- `page.tsx` and `layout.tsx` export a component named `Page` / `Layout` — the file path carries the semantic identity
- Default export for pages and layouts; named export for UI components

### Server Functions

Verb + noun, camelCase. Grouped by domain, not by operation (`post-actions.ts` with `createPost` / `updatePost` / `deletePost` — not `create.ts`).

### Data / Query Functions

`get` + noun — `getPost(slug)`, `getPosts()`, `getPostsByAuthor(authorId)`.

### Constants

```ts
export const SITE_NAME = 'My Portfolio'        // SCREAMING_SNAKE for primitives
export const siteConfig = { name: '...' }      // camelCase for objects
```

### Variables

Never use single-letter variable names. Name the variable after what it represents.

| Short | Use instead |
| --- | --- |
| `s` | contextual noun — `skill`, `stackItem`, `set` |
| `q` | `query` |
| `e` | `entry` (IntersectionObserver) / `event` (DOM/React events) |
| `c` | contextual noun — `category`, `categoryCounts` |
| `p` | `project` |
| `v` | `value` |
| `g` | `filterGroup` |
| `a` / `d` | contextual noun — `achievement`, `duty` |

**Exception**: `t` from `useTranslations()` / `getTranslations()` is the accepted next-intl convention.

For boolean setter callbacks, use `prev` not a single letter: `setOpen((prev) => !prev)`.

---

## Application Config

Single source of truth for all URLs, social handles, email, resume path, and feature flags.

- **File**: `app/_config/site-config.ts` — exported as `siteConfig` (camelCase object, `as const`)
- **Contains**: external URLs, social handles, email, resume path, feature flags
- **Does NOT contain**: i18n strings (→ `messages/en.json`), visual/styling data (→ component data arrays), feature data (→ `_data/`)

All external `href` values in the app must come from `siteConfig`. Never hardcode URL strings in components.

```ts
import { siteConfig } from '@/app/_config/site-config'
```

---

## Types

### Three tiers — types live at the narrowest scope that covers all consumers

```
Inline          → defined in the same file (component props, local shapes)
Local           → app/(feature)/_types/feature-types.ts
Global          → app/_types/domain-types.ts
```

Promote upward only when a second consumer appears. Never pre-promote.

### `types/` directory — auto-generated, do not touch

`routes.d.ts` (PageProps/LayoutProps globals), `validator.ts`, `cache-life.d.ts`.

### Rules

- Component props: inline, same file
- Domain types: `_types/` at the narrowest level
- Schema-first with Zod for external input (`z.infer<typeof ...>` for derived types)
- Default to `type`; use `interface` only when declaration merging is explicitly needed
- No barrel files (`index.ts`) — import directly from the source. Barrels break tree-shaking and can leak server modules into client bundles.
- **`@/` path alias** — `tsconfig.json` maps `@/*` → `./`. Use for every cross-directory import. Same-directory imports (`./foo`) are the only exception.
- Serializable props across the RSC boundary — convert `Date` to `string` when passing to Client Components
- Page/layout props: use the auto-generated globals: `PageProps<'/blog/[slug]'>`, `LayoutProps<'/'>`. `params` is a `Promise`.

---

## Server vs. Client Components

Default is **Server Components**. Add `'use client'` only when needed.

- **Client Components** for: `useState`, `useEffect`, event handlers, browser APIs
- **Server Components** for: data fetching, secrets, reducing JS bundle size

Push `'use client'` as deep and narrow as possible. A layout can stay a Server Component even if a child is a Client Component.

Mark server-only modules explicitly: `import 'server-only'`.

---

## Data Fetching

`fetch` is **not cached by default**. Use `'use cache'` + `cacheLife('...')` to cache.

Fetch in parallel, not sequentially — `Promise.all([getArtist(id), getAlbums(id)])`.

Wrap slow components in `<Suspense fallback={<Skeleton />}>` for streaming.

---

## Error Handling — summary

- Expected errors (validation, not-found, auth) → return values, don't throw
- Uncaught exceptions → `error.tsx` at isolation boundaries; must be a Client Component
- Not-found / redirects → control flow (`notFound()`, `redirect()`), never wrap in try/catch
- Event handler errors → manual `useState<string|null>` state

Full patterns (Server Function result types, `catchError` wrapper, `global-error.tsx` rules): [docs/error-handling.md](docs/error-handling.md).

---

## Styling

### Architecture — three layers, do not mix

| Layer | Mechanism | When to use |
| --- | --- | --- |
| Design tokens | CSS custom properties in `:root` / `html[data-theme]` in `globals.css` | Colors, surfaces, spacing scale |
| Shared primitives | `@utility` blocks in `globals.css` | Classes used across 3+ components or applied to varying element types |
| Component styles | Co-located `ComponentName.module.css` | Component-specific visual identity |

Never add new plain `.className { }` blocks to `globals.css`. Use `@utility` or a CSS module instead.

### Top rules

- **No inline `style={{}}`** — use Tailwind utilities or a co-located CSS module. Static RGBA, box-shadows, border colors, brand hex, gradients, and fixed transition/animation delays always move to a CSS module.
  - **Exception**: JS-computed values only — `style={{ opacity: value }}`, `style={{ maxHeight: open ? 1000 : 0 }}`, `style={{ animationDelay: \`${delay}s\` }}`, data-driven colors from a data array.
- Do not use Tailwind arbitrary values (`w-[123px]`) for values that belong in a token.
- Do not add `position: relative; z-index: N` to individual child elements — let the component wrapper handle stacking context.
- **Light mode is mandatory**: any white-opacity color (`text-white/N`, `color-mix(in srgb, white ...)`, `oklch(from white ...)`) or hardcoded dark background (`#080810`, `#0d0d18`, `#16162a`, etc.) needs a `html[data-theme="light"]` override using design tokens.
- Do not combine a CSS-module class and Tailwind utilities to style the same visual concern on the same element.

`@utility` registry, CSS module patterns, React UI primitive extraction rules, `color-mix` usage: [docs/styling-details.md](docs/styling-details.md).

---

## State Management

Pick the lowest viable tier:

```
Server state (Server Components + use cache)  ← default
URL state (searchParams)                      ← shareable / survives navigation
Local UI state (useState)                     ← transient, one component
Form state (useActionState / react-hook-form) ← server-bound forms
Cross-component (context)                     ← truly global client state
External store (Zustand/Jotai)                ← last resort, scoped to feature
```

### Cross-component communication — pick a tier, never a global event bus

Do not use `window.dispatchEvent` / `window.addEventListener` / `CustomEvent` to pass data between components. It bypasses the type system, couples callers via magic-string event names, and is invisible to React devtools.

- Shareable/bookmarkable → URL searchParams (`useSearchParams`)
- Transient, page-local → feature-scoped Zustand store or React context
- Parent/child in the tree → props

Validate inbound URL params against the zod schema of the consuming field — never `setValue(param as Enum)`.

### Activity-preserved state (`cacheComponents: true`)

Next.js hides pages on navigation instead of unmounting them (React `<Activity>`). State is preserved for up to 3 routes.

- Transient UI (dropdowns, popovers) — reset in `useLayoutEffect` cleanup: `return () => setOpen(false)`
- Persistent UI (scroll, expanded panels) — do nothing, Activity preserves it for free
- Dialog open state — prefer URL searchParams over `useState` when the dialog has initialization logic (focus, data fetch on open)

### Context

Never put server data in context. Keep providers as deep as possible, not everything in root layout.

### External stores

Scope to the feature (`editor-store.ts`), not a global app store.

### Forms

react-hook-form + zod with a client/server schema split. See [docs/forms.md](docs/forms.md).

---

## Component Patterns

### No IIFE in JSX

Extract variables above the `return` statement. Never use an immediately-invoked function inside JSX.

### No JSX in module-level constants

Module-level constants with JSX values are evaluated at module load, not per-render. Use a function:

```ts
// ❌
const ICONS: Record<string, React.ReactNode> = { Stripe: <StripeIcon /> }

// ✅
function getIcon(name: string): React.ReactNode {
  switch (name) { case 'Stripe': return <StripeIcon />; default: return undefined }
}
```

### No `React.Children` manipulation

Pass data and a `renderItem` callback instead of slicing children. `React.Children.toArray` destroys keys and breaks identity on rerender.

### No copy-pasted JSX structures

When 3+ JSX blocks share the same structure, extract a local component and map over a data array. Two repetitions may be acceptable; three or more always require extraction.

### Stable list keys

Never use array index as `key` when a stable unique identifier exists (id, slug, name, title).

### No parallel arrays coupled by index

Do not maintain multiple top-level arrays that must stay aligned by index (`VARIANTS[i]`, `ICONS[i]`, `DELAYS[i]`, …). A single array of objects is safer — adding, removing, or reordering items can't silently desync. The same rule applies to variant-dependent class maps: one meta object per variant beats parallel lookups.

### Honest initial state

Never use a magic number as initial `useState` value to approximate a pre-measurement layout. Use `0` or `null`; `useLayoutEffect` sets the correct value synchronously before paint.

---

## i18n — summary

- Stack: `next-intl@4`, single static `en` locale, `messages/en.json`
- Server Components: `await getTranslations('namespace')`; Client Components (and anything imported by them): `useTranslations('namespace')`
- Arrays: `t.raw('key') as Type[]`
- Rich text: `t.rich('key', { highlight: (chunks) => <span>{chunks}</span> })`
- `generateMetadata` must be an async function using `getTranslations`, not a static `export const metadata`
- Visual-only data (gradients, SVG paths, `imageBg`) stays in component data arrays, not in messages

Namespaces, file structure, ICU interpolation: [docs/i18n.md](docs/i18n.md).

---

## SEO — summary

- Stack: `generateMetadata` + `next-intl`, `MetadataRoute.{Sitemap,Robots}`, `next/og` `ImageResponse`, JSON-LD via plain `<script>` tags
- All external URLs source from `app/_config/site-config.ts` via `absoluteUrl()` (`app/_schema/absolute-url.ts`) — never concatenate `siteConfig.url + path`
- Root layout emits `Person` + `WebSite` JSON-LD **once**; per-route pages emit `BreadcrumbList` + their page-specific schema (reference root nodes via `@id`)
- OG images: one template at `app/_og/og-template.tsx`; each route has `opengraph-image.tsx` (calls `renderOg()`) and `twitter-image.tsx` (re-exports the OG file)
- i18n namespaces: `metadata` for site-wide tags, `og.<route>` for OG card text, `<route>Page` for per-page titles

Full patterns + new-route checklist: [docs/seo.md](docs/seo.md).

---

## Auth — summary

No auth code exists in this repo today. When adding it: separate authentication (`lib/auth.ts`), session (`lib/session.ts`), and authorization (Server Functions + route group layouts). Every Server Function must re-verify independently — layout checks don't gate server-side execution. Full patterns: [docs/auth.md](docs/auth.md).
