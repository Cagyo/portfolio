> **This is NOT the Next.js you know.** This version has breaking changes — APIs, conventions, and file structure may differ from your training data. Read `node_modules/next/dist/docs/` before writing code. Heed deprecation notices.

# Code Conventions

## Deep-dive docs (read when relevant)

- Auth changes → [docs/auth.md](docs/auth.md)
- i18n / `messages/en.json` edits → [docs/i18n.md](docs/i18n.md)
- Adding SVG icons or logos → [docs/svg-icons.md](docs/svg-icons.md)
- Error boundaries / `error.tsx` / Server Function error contracts → [docs/error-handling.md](docs/error-handling.md)
- Forms (react-hook-form + zod) → [docs/forms.md](docs/forms.md)
- `@utility` blocks, CSS module internals, `color-mix` usage → [docs/styling-details.md](docs/styling-details.md)
- SEO: metadata, sitemap/robots, OG images, JSON-LD → [docs/seo.md](docs/seo.md)
- Product scope, audience, brand voice, anti-references → [PRODUCT.md](PRODUCT.md)
- Visual / UX intent and design rationale → [DESIGN.md](DESIGN.md)

## Stack

- **Next.js 16.2.0** (App Router only — no Pages Router)
- **React 19.2.4**
- **TypeScript 5** (strict)
- **Tailwind CSS 4**

## Tooling

- **Package manager**: `yarn` — never use `pnpm` or `npm`. All install/run/build commands must use `yarn`.
- **One-off tool execution**: use `npx <tool>` (e.g. `npx shadcn@latest add ...`, `npx tsx ...`). Never `yarn dlx` — it resolves through Yarn's plugin layer and silently fails on tools that assume an npm-style env.
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

**Tailwind-first.** Default to utility classes built on semantic tokens. CSS modules are a narrow exception, not a default.

### Architecture — three layers, in priority order

| Layer | Mechanism | When to use |
| --- | --- | --- |
| Design tokens | `@theme` block in `globals.css` (mapped from `:root` / `html[data-theme]`) | All colors, surfaces, borders. Single source of truth. |
| Tailwind utilities | `bg-card`, `text-foreground`, `border-border`, `text-amber-foreground`, `cn()` / `cva` | **Default for every component.** |
| `@utility` blocks | `globals.css` | Classes used by 3+ components: `glass`, `glass-amber`, `blob`, `text-gradient`, `dot-grid`, `reveal`, `form-input`, `active-chip`, `btn-shimmer`, `btn-outline`, `show-more-toggle`, `mobile-overlay`. |
| CSS modules | Co-located `ComponentName.module.css` | **Exception only** — must satisfy one of six retention criteria below. |

Never add new plain `.className { }` blocks to `globals.css`. Use `@utility` or, as a last resort, a CSS module.

### Tailwind-first rules

- **Use semantic tokens, never raw palette opacities.** Forbidden in `.tsx`:
  - `text-white/N`, `bg-white/N`, `border-white/N` → use `text-foreground` / `text-foreground-soft` / `text-muted-foreground` / `text-faint-foreground` / `text-ghost-foreground` / `text-invisible-foreground`, `bg-card`, `border-border`.
  - `text-amber-400`, `text-amber-500`, `bg-amber-500/N`, `border-amber-500/N`, `from-amber-400`, `to-amber-600` → use `text-amber-foreground`, `bg-amber`, `bg-amber/10`, `border-border-amber`, `from-amber-light`, `to-amber-dark`.
  - `bg-black/*`, `bg-zinc-*`, `bg-gray-*`, hex backgrounds (`#080810`, `#0d0d18`, etc.) → use `bg-background` / `bg-background-elevated` / `bg-card`.
  Review will catch these.
- **No inline `style={{}}` for static values.** Reserve inline `style` exclusively for JS-derived values: `style={{ opacity: value }}`, `style={{ maxHeight: open ? 1000 : 0 }}`, `style={{ animationDelay: \`${i * 0.1}s\` }}`, or data-driven colors pulled from a data array.
- **No Tailwind arbitrary values for tokenable concerns** — use the semantic token (`bg-card`, not `bg-[#080810]/82`).
- **`cn()` from `@/app/_lib/cn.ts`** for conditional class composition. **`cva`** for primitives with variants.
- **Prefer Tailwind v4 selectors over CSS modules**:
  - One-level descendant hover → `group` + `group-hover:`
  - Two-level descendant hover → named groups: `group/card` + `group-hover/card:`
  - `:has()` → `has-[...]`; `:focus-within` → `focus-within:`; `:nth-child` → `nth-[3n+1]:`
  - Simple `::before` / `::after` (≤3 props) → `before:content-[''] before:absolute before:inset-0 ...`
  - State variants → `aria-pressed:`, `data-[state=open]:`, `peer-*`

### CSS-module retention criteria (the six exceptions)

A `.module.css` file is justified ONLY if the component meets at least one of:

1. **`@keyframes` tied to component-local state** (generic keyframes belong in `@theme { --animate-foo: ... }`).
2. **`::before` / `::after` with ≥5 properties or state-dependent gradients.**
3. **Descendant selector chains spanning >1 nesting level.**
4. **Sibling selectors (`~`, `+`) with state beyond what `peer-*` provides.**
5. **`@property` registered custom properties** (animating gradient stops, conic gradients).
6. **Named container queries with multiple rules.**

Additional exception: **vendor pseudo-elements** (`::-webkit-scrollbar*`) and **`:global()` selectors** that theme third-party CSS — Tailwind cannot express these.

### Every surviving `.module.css` must start with a justification comment

```css
/* Retained per refactor policy: <criterion from the list above>.
   <Specific reason — e.g., "ringPulse keyframe coupled to recorder state machine">. */
```

**No comment = the file should not exist.** Migrate the styles to Tailwind utilities and delete the module.

### Budget

- ≤ 20 `.module.css` files total (target ≤ 15).
- ≤ 1,500 LOC total across all modules (target ≤ 1,200).
- Crossing either ceiling requires explicit discussion in the PR.

### Light mode

All styling must work in both themes. The `data-theme="light"` overrides in `globals.css` cover the small set of non-migrated palette utilities (`text-violet-400`, `text-green-400`, `text-red-400`, violet pill backgrounds) plus `@utility` consumers (`.glass`, `.glass-amber`, `.blob`) and the `hover:text-amber-light` custom-token hover. Do not introduce new escape-hatch utility classes that require their own override block — use semantic tokens instead.

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

### Layout shell

- **Footer** (`app/_components/footer/Footer.tsx`) is rendered once in the root layout. Never import or render `<Footer />` inside a `page.tsx`.
- **Nav** stays per-page (`Nav` on home, `SubpageNav` on subpages) because nav choice is page-specific.
- The body sets `bg-[var(--bg)] font-body text-[var(--text-primary)]` and `min-h-full flex flex-col`. The layout wraps children in `<div className="flex-1">` so the Footer sticks to the bottom on short pages.
- Each page renders its own `<main>` element wrapping the primary content. `<main>` must NOT contain the page's `<Nav>` / `<SubpageNav>` — they are siblings of `<main>`, not children. Exactly one `<main>` per document.
- Footer copy/aria keys live in the `footer` i18n namespace.

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
