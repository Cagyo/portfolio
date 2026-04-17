@AGENTS.md

# Code Conventions

## Stack

- **Next.js 16.2.0** (App Router only — no Pages Router)
- **React 19.2.4**
- **TypeScript 5** (strict)
- **Tailwind CSS 4**

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
| Utility files | `kebab-case.ts` | `format-date.ts` |
| Action files | `kebab-case.ts` | `post-actions.ts` |
| Data/query files | `kebab-case.ts` | `post-queries.ts` |
| Type files | `kebab-case.ts` | `post-types.ts` |
| Schema files | `kebab-case.ts` | `post-schema.ts` |
| Constants | `kebab-case.ts` | `site-config.ts` |

**Config directory**: `app/_config/` — app-wide structural config (URLs, social handles, feature flags). See `## Application Config`.

### Component Subdirectory Grouping

Within `_components/` and feature folders, group logically related files into `kebab-case` subdirectories. A component file, its CSS module, co-located hooks, and data files all move together.

```
app/_components/
  nav/           ← Nav, NavLinks+css, NavLogo, MobileMenu
  button/        ← Button+css
  tag/           ← Tag+css
  theme/         ← ThemeScript, ThemeToggle+css

app/_home/
  hero/          ← HeroSection, ProfileCard, OrbitRings, Typewriter
  about/         ← AboutSection and its sub-components
  skills/        ← SkillsSection+css, SkillChip+css, SkillFilterTabs+css, skills-data.ts
  projects/      ← ProjectsSection, ProjectCard+css, ProjectMeta+css
  engagement/    ← EngagementSection, EngagementCard
  recommendations/ ← RecommendationsSection, TestimonialCard
  contact/       ← ContactSection, ContactForm, ContactInfo

app/projects/_components/
  filter/        ← ActiveChips, FilterGroup, FilterPanelMobile+css, FilterSidebar+css
  project-card/  ← ProjectCard+css
```

**Rules:**
- Group when 3+ files share a domain/feature and are only consumed together
- CSS modules always move with their component (never split across directories)
- No `index.ts` barrel files — import directly from the source file
- Use `@/` alias for all imports that cross more than one directory level — never write `../../` paths
- Same-directory imports (`./foo`) stay as-is
- Shared utilities/data used across groups stay at the parent level (e.g. `projects-data.ts` in `_components/` root)

### Components

- **PascalCase**, always matches filename
- `page.tsx` and `layout.tsx` export a component named `Page` / `Layout` — the file path carries the semantic identity
- Default export for pages and layouts; named export for UI components

```tsx
// UI component
type PostCardProps = { title: string; slug: string }
export function PostCard({ title, slug }: PostCardProps) { ... }

// Page
export default async function Page({ params }: PageProps<'/blog/[slug]'>) { ... }
```

### Server Functions

Verb + noun, camelCase. Grouped by domain, not by operation:

```ts
// post-actions.ts — not create.ts / update.ts
export async function createPost(...) {}
export async function updatePost(...) {}
export async function deletePost(...) {}
```

### Data / Query Functions

`get` + noun (singular or plural):

```ts
export async function getPost(slug: string) {}
export async function getPosts() {}
export async function getPostsByAuthor(authorId: string) {}
```

### Constants

```ts
export const SITE_NAME = 'My Portfolio'        // SCREAMING_SNAKE for primitives
export const siteConfig = { name: '...' }      // camelCase for objects
```

### Variables

Never use single-letter variable names. Name the variable after what it represents.

Common mappings:

| Short | Use instead |
| --- | --- |
| `s` | contextual noun — `skill`, `stackItem`, `set` |
| `q` | `query` |
| `e` | `entry` (IntersectionObserver) / `event` (DOM/React events) |
| `c` | contextual noun — `category`, `categoryCounts` |
| `p` | `project` |
| `v` | `value` |
| `g` | `filterGroup` |
| `a` | contextual noun — `achievement` |
| `d` | contextual noun — `duty` |

**Exception**: `t` from `useTranslations()` / `getTranslations()` is the accepted next-intl convention — do not rename.

For boolean setter callbacks, use `prev` not a single letter:

```ts
// ❌
setOpen((e) => !e)
setCollapsed((c) => !c)

// ✅
setOpen((prev) => !prev)
setCollapsed((prev) => !prev)
```

---

## Application Config

Single source of truth for all URLs, social handles, email, resume path, and feature flags.

- **File**: `app/_config/site-config.ts`
- **Exported as**: `siteConfig` (camelCase object, `as const`)
- **Contains**: external URLs, social handles, email, resume path, feature flags
- **Does NOT contain**: i18n strings (→ `messages/en.json`), visual/styling data (→ component data arrays), feature data (→ `_data/`)

All external `href` values in the app must come from `siteConfig`. Never hardcode URL strings in components.

Import directly (no barrel):

```ts
import { siteConfig } from '@/app/_config/site-config'
```

Shape:

```ts
export const siteConfig = {
  social: {
    github:   { url: 'https://github.com/...', handle: '...' },
  },
  resume: { url: '/assets/resume.pdf' },
  author: { name: 'Oleksii Berliziev', email: '' },
} as const
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

```
types/
  routes.d.ts      # auto-generated — PageProps/LayoutProps globals
  validator.ts     # auto-generated — validates page/layout exports
  cache-life.d.ts  # auto-generated — cacheLife() overloads
```

### Component props — inline, same file

```tsx
// PostCard.tsx
type PostCardProps = {
  title: string
  slug: string
  publishedAt: Date
}
export function PostCard({ title, slug, publishedAt }: PostCardProps) { ... }
```

### Domain types — `_types/` at the appropriate level

```ts
// app/_types/post-types.ts  (global) or  app/(blog)/_types/post-types.ts  (local)
export type Post = { id: string; slug: string; title: string; status: PostStatus }
export type PostSummary = Pick<Post, 'id' | 'slug' | 'title'>
export type PostStatus = 'draft' | 'published' | 'archived'
```

### Schema-first with Zod for external input

```ts
// post-schema.ts
export const createPostSchema = z.object({ title: z.string().min(1), ... })
export type CreatePostInput = z.infer<typeof createPostSchema>
```

### `type` vs `interface`

Default to `type`. Use `interface` only when declaration merging is explicitly needed.

### No barrel files (`index.ts`)

Import directly from the source. Barrels break tree-shaking and can leak server modules into client bundles.

### `@/` path alias — always use for cross-directory imports

`tsconfig.json` maps `@/*` → `./`. Use this alias for every import that would otherwise require `../` traversal. Same-directory imports (`./foo`) are the only exception.

```ts
// ❌
import { Button } from '../../../_components/button/Button'

// ✅
import { Button } from '@/app/_components/button/Button'
```

### Serializable props across the RSC boundary

```ts
type Post = { publishedAt: Date }            // server-side
type SerializablePost = { publishedAt: string } // safe to pass as Client Component props
```

### Page and layout props — use the auto-generated globals

```tsx
export default async function Page({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params  // fully typed, params is a Promise
}
```

---

## Server vs. Client Components

Default is **Server Components**. Add `'use client'` only when needed.

Use **Client Components** for: `useState`, `useEffect`, event handlers, browser APIs.

Use **Server Components** for: data fetching, secrets, reducing JS bundle size.

Push `'use client'` as deep and narrow as possible. A layout can stay a Server Component even if a child is a Client Component.

```tsx
// ✅ only the interactive leaf is a Client Component
export default async function Layout({ children }: LayoutProps<'/'>) {
  return (
    <nav>
      <Logo />       {/* Server Component */}
      <Search />     {/* 'use client' */}
    </nav>
  )
}
```

Mark server-only modules explicitly:

```ts
import 'server-only'
```

---

## Data Fetching

`fetch` is **not cached by default**. Use `'use cache'` to cache:

```ts
export async function getPosts() {
  'use cache'
  cacheLife('hours')
  return db.query('SELECT * FROM posts')
}
```

Fetch in parallel, not sequentially:

```ts
// ❌ sequential
const artist = await getArtist(id)
const albums = await getAlbums(id)

// ✅ parallel
const [artist, albums] = await Promise.all([getArtist(id), getAlbums(id)])
```

Wrap slow components in `<Suspense>` for streaming:

```tsx
<Suspense fallback={<Skeleton />}>
  <SlowComponent />
</Suspense>
```

---

## Error Handling

### Two categories — different handling

```
Expected errors   → return values (validation, not-found, auth failures)
Uncaught errors   → throw (bugs, infrastructure failures)
```

### Expected errors in Server Functions — return, don't throw

```ts
type ActionResult = { success: true } | { success: false; error: string }

export async function createPost(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const result = schema.safeParse(Object.fromEntries(formData))
  if (!result.success) return { success: false, error: result.error.flatten().formErrors[0] }
  // ...
  return { success: true }
}
```

### Not-found and redirects — control flow, not errors

```ts
import { notFound } from 'next/navigation'
if (!post) notFound()         // → nearest not-found.tsx
if (!authorized) redirect('/') // → never wrap in try/catch
```

### Uncaught exceptions — `error.tsx` at isolation boundaries

Place `error.tsx` where you want a section to fail independently. Don't add it everywhere preemptively.

```
app/
  error.tsx              # catches everything below root layout
  global-error.tsx       # catches root layout itself — must include <html><body>
  (dashboard)/
    error.tsx            # isolates dashboard failures
```

`error.tsx` must be a Client Component. Always log to an error reporting service in `useEffect`.

### Component-level boundaries — `catchError`

```tsx
'use client'
import { unstable_catchError as catchError, type ErrorInfo } from 'next/error'

function ErrorFallback(props: { title?: string }, { error, unstable_retry: retry }: ErrorInfo) {
  return (
    <div role="alert">
      <p>{props.title ?? 'Something went wrong'}</p>
      <button onClick={() => retry()}>Retry</button>
    </div>
  )
}

export const ErrorBoundary = catchError(ErrorFallback)
```

`unstable_catchError` API is volatile — abstract it behind one wrapper.

### Event handler errors — manual state

```tsx
const [error, setError] = useState<string | null>(null)
const handleClick = async () => {
  try { await doWork() } catch { setError('Failed. Try again.') }
}
```

---

## Styling

### Architecture — three layers, do not mix

| Layer | Mechanism | When to use |
| --- | --- | --- |
| Design tokens | CSS custom properties in `:root` / `html[data-theme]` in `globals.css` | Colors, surfaces, spacing scale |
| Shared primitives | `@utility` blocks in `globals.css` | Classes used across 3+ components or applied to varying element types |
| Component styles | Co-located `ComponentName.module.css` | Component-specific visual identity |

Never add new plain `.className { }` blocks to `globals.css`. Use `@utility` or a CSS module instead.

### `@utility` (shared primitives in `globals.css`)

Current registered utilities: `glass`, `glass-amber`, `blob`, `text-gradient`, `dot-grid`, `reveal`, `form-input`

Use `@utility` when a class is:
- Consumed by 3+ components, **or**
- Applied to varying HTML element types (e.g. `div`, `nav`, `form`, `span`)

`@utility` blocks support CSS nesting for states: `&:hover`, `&:focus`, `&.active`, `&::before`.

> **Never** move `reveal` to a CSS module — `use-reveal.ts` queries `.reveal` via `document.querySelectorAll` and adds `.visible` via `classList.add`. Global class name must be stable.

### CSS Modules

- File: `ComponentName.module.css` co-located next to its `ComponentName.tsx`
- Class names: camelCase — `.navLink`, `.skillChipTop`, `.projectOverlay`
- Conditional classes: use module refs directly

```tsx
className={`${styles.btn} ${isActive ? styles.active : ''}`}
```

- Descendant selectors are fine within one module when both elements are in the same component:

```css
.projectCard:hover .projectOverlay { opacity: 1; }
```

- `html[data-theme="light"]` ancestor selectors work inside module files for co-located theme overrides
- Do not duplicate shared classes across multiple module files — promote to `@utility` instead

### React UI primitives

Extract a React component (not just a CSS class) when a styled element has:
- A fixed semantic HTML element (`<a>` or `<button>`)
- Consistent interactive structure across all call sites
- Behavioral logic (polymorphic rendering, state, forwarded refs)

Current UI primitives: `<Button>` — `variant?: "primary" | "outline"`, renders `<a>` when `href` is provided, `<button>` otherwise. Children are wrapped in `<span className={styles.inner}>` so that bare text nodes are lifted above the `::before` shimmer layer via `z-index`.

### Rules

- No inline `style={{}}` — use Tailwind utility classes or a co-located CSS module instead. Static RGBA colors, box-shadows, border colors, brand hex values, gradients, and fixed transition/animation delays must always move to a CSS module.
- **Exception**: JS-computed or runtime-derived values only — e.g. `style={{ opacity: value }}`, `style={{ maxHeight: open ? 1000 : 0 }}`, `style={{ animationDelay: \`${delay}s\` }}` (prop-driven), data-driven colors from a data array (e.g. `style={{ color: item.iconColor }}`).
- Do not use Tailwind `arbitrary values` (`w-[123px]`) for values that belong in a token
- Do not add `position: relative; z-index: N` to individual child elements — let the component wrapper handle stacking context
- CSS modules must use design tokens (`var(--amber)`, `var(--border)`, etc.) — never raw RGBA values that duplicate a token. Use `color-mix(in srgb, var(--token) N%, transparent)` for opacity variants:
  ```css
  /* ❌ */  background: rgba(245, 158, 11, 0.4);
  /* ✅ */  background: color-mix(in srgb, var(--amber) 40%, transparent);
  ```

- In `style={{}}`, include only the runtime-derived property. Co-locate static values (`display`, `transition`, `overflow`, `min-height`) in a CSS module class, then merge:
  ```tsx
  /* ❌ */  style={{ display: 'grid', gridTemplateRows: expanded ? '1fr' : '0fr', transition: '...' }}
  /* ✅ */  <div className={styles.expandGrid} style={{ gridTemplateRows: expanded ? '1fr' : '0fr' }}>
  ```

- **Light mode support is mandatory**: every CSS module must include `html[data-theme="light"]` overrides for any property that uses white-based opacity colors (`oklch(from white ...)`, `color-mix(in srgb, white ...)`) or hardcoded dark backgrounds (`#080810`, `#0d0d18`, `#16162a`, etc.). Use design tokens (`var(--text-primary)`, `var(--surface)`, `var(--border)`, etc.) in light mode overrides. Similarly, any new Tailwind utility class using white opacity (`text-white/N`, `border-white/N`, `bg-white/N`) or amber hover variants must have a corresponding `html[data-theme="light"]` override in `globals.css`.

---

## SVG Icons & Logos

All SVGs must be extracted as React components — never inline `<svg>` elements in page or feature components.

### Location

```
assets/
  icons/   ← general UI icons (stroke-based, theme-aware)
  logos/   ← brand logos (may have hardcoded fills)
```

### Component pattern

```tsx
// assets/icons/ArrowRightIcon.tsx
type IconProps = { className?: string; strokeWidth?: number }

export function ArrowRightIcon({ className, strokeWidth = 2 }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  )
}
```

### Rules

- Props: `className?: string` on every component; add `strokeWidth?: number` (default `2`) only when the icon is used with multiple stroke widths
- Icons use `stroke="currentColor"` so they inherit text color via Tailwind (`text-amber-400`, `text-white/50`, etc.)
- Brand logos with fixed colors (Figma, Stripe, etc.) hardcode their fill values — no `className` for color
- `strokeWidth` defaults: most icons `2`; toggles/chips `2.5`; fine icons (e.g. `EmptyFaceIcon`) `1.5`; structural icons (e.g. `MonitorIcon`) `1`
- Photo-placeholder SVGs and dynamic icon-path props (`d={badge.iconPath}`) stay inline — do not extract
- No barrel `index.ts` — import directly from the source file:
  ```tsx
  import { ArrowRightIcon } from '../../assets/icons/ArrowRightIcon'
  import { GitHubLogo } from '../../assets/logos/GitHubLogo'
  ```

---

## State Management

Pick the lowest viable tier:

```
Server state (Server Components + use cache)  ← default
URL state (searchParams)                      ← shareable / survives navigation
Local UI state (useState)                     ← transient, one component
Form state (useActionState)                   ← server-bound forms
Cross-component (context)                     ← truly global client state
External store (Zustand/Jotai)                ← last resort, scoped to feature
```

### Forms with client-side validation

Use **react-hook-form + zod** (`@hookform/resolvers/zod`) for any form that needs client-side validation or per-field inline errors.

```
react-hook-form   ← form state, registration, submission lifecycle
zod               ← validation schema (already in package.json — do not add yup/valibot)
useActionState    ← still used for the server action binding
```

**Schema split** — two separate zod schemas:
- `contact-form-schema.ts` (client) — validates browser values (`Blob[]`, string defaults). Error messages are i18n keys (e.g. `'nameTooShort'`), translated at render time.
- `contact-schema.ts` (server) — authoritative defense-in-depth check; never replace it with client-only validation.

**Key conventions:**
- Native inputs (`input`, `select`, `textarea`): `{...register('fieldName')}`
- Controlled non-native inputs (`VoiceRecorder`, `TurnstileWidget`, date pickers): `<Controller name="..." control={control} render={({ field }) => <Widget onChange={field.onChange} />} />`
- Mode toggles: `setValue('mode', 'voice', { shouldValidate: true })`
- `mode: 'onBlur'` — errors appear on blur, not on every keystroke
- Inline errors: `{errors.field && <p className={styles.fieldError}>{t(\`form.errors.\${errors.field.message}\`)}</p>}`
- The bottom error banner surfaces **server-only** keys (`turnstile`, `rateLimited`, `sendFailed`, `unknown`); per-field keys should never reach it if client validation is working
- On server error, reset controlled widgets (e.g. Turnstile) **and** `setValue` their field to `''` so the form re-disables

**Schema shape** — use a flat object + `.superRefine` for mode-conditional rules instead of a discriminated union; discriminated unions make `errors.subject` sometimes-present and complicate `register` typing.

**Do not use `.default()`** on zod fields in the form schema — it splits input/output types and breaks the resolver's TypeScript inference. Pass initial values via `useForm({ defaultValues: ... })` instead.

**`.fieldError` CSS** — add to the co-located CSS module using `var(--red)`:
```css
.fieldError { color: var(--red); font-size: 0.75rem; margin-top: 0.375rem; }
```



With `cacheComponents: true`, Next.js hides pages on navigation instead of unmounting them (via React `<Activity>`). State is preserved for up to 3 routes.

- **Transient UI** (dropdowns, popovers) — reset in `useLayoutEffect` cleanup:
  ```ts
  useLayoutEffect(() => { return () => setOpen(false) }, [])
  ```
- **Persistent UI** (scroll, expanded panels) — do nothing, Activity preserves it for free
- **Dialog open state** — prefer URL searchParams over `useState` when the dialog has initialization logic (focus, data fetch on open)

### Context — sparingly, as deep as possible

```tsx
'use client'
export function ToastProvider({ children }: { children: React.ReactNode }) { ... }
```

Never put server data in context. Keep providers as deep as possible, not everything in root layout.

### External stores — scoped to the feature

```ts
// editor-store.ts — not a global app store
export const useEditorStore = create<EditorState>(...)
```

---

## Component Patterns

### No IIFE in JSX

Extract variables above the `return` statement. Never use an immediately-invoked function inside JSX.

```tsx
// ❌
return (
  <div>
    {(() => {
      const items = t.raw('experience') as Item[]
      return <ExperienceList items={items} ... />
    })()}
  </div>
)

// ✅
const items = t.raw('experience') as Item[]
return (
  <div>
    <ExperienceList items={items} ... />
  </div>
)
```

### No JSX in module-level constants

Module-level constants with JSX values are evaluated at module load, not per-render. Use a function.

```ts
// ❌
const ICONS: Record<string, React.ReactNode> = { Stripe: <StripeIcon /> }

// ✅
function getIcon(name: string): React.ReactNode {
  switch (name) {
    case 'Stripe': return <StripeIcon />
    default: return undefined
  }
}
```

### No `React.Children` manipulation

Pass data and a `renderItem` callback instead of slicing children. `React.Children.toArray` destroys keys and breaks identity on rerender.

```tsx
// ❌
type Props = { children: React.ReactNode; total: number }
const all = React.Children.toArray(children)

// ✅
type Props<T> = { items: T[]; renderItem: (item: T, index: number) => React.ReactNode }
<List items={data} renderItem={(item) => <Card key={item.id} {...item} />} />
```

### No copy-pasted JSX structures

When 3 or more JSX blocks share the same structure, extract a local component and map over a data array. Two repetitions may be acceptable; three or more always require extraction.

### Stable list keys

Never use array index as `key` when a stable unique identifier exists (id, slug, name, title).

```tsx
// ❌  positions.map((pos, i) => <div key={i}>)
// ✅  positions.map((pos) => <div key={pos.title}>)
```

### Honest initial state

Never use a magic number as initial `useState` value to approximate a pre-measurement layout. Use `0` or `null`; `useLayoutEffect` sets the correct value synchronously before paint.

```ts
// ❌  const [height, setHeight] = useState(44)
// ✅  const [height, setHeight] = useState(0)
```

---

## Auth

Three separate concerns:

```
Authentication  → who are you?        lib/auth.ts (getCurrentUser)
Session         → are you still you?  lib/session.ts (cookies)
Authorization   → what can you do?    Server Functions + route group layouts
```

### Data Access Layer — `lib/auth.ts`

```ts
import 'server-only'
import { cache } from 'react'

// React.cache = one DB hit per request regardless of how many callers
export const getCurrentUser = cache(async () => {
  const token = (await cookies()).get('session')?.value
  if (!token) return null
  const payload = await decrypt(token)
  if (!payload?.userId) return null
  return db.user.findUnique({ where: { id: payload.userId as string }, select: { id: true, name: true, role: true } })
})

export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  return user
}

export async function requireRole(role: Role) {
  const user = await requireUser()
  if (user.role !== role) redirect('/unauthorized')
  return user
}
```

### Session — `lib/session.ts`

Required cookie options — none are optional:

```ts
cookieStore.set('session', token, {
  httpOnly: true,    // no JS access
  secure: true,      // HTTPS only
  sameSite: 'lax',   // CSRF protection
  expires: expiresAt,
  path: '/',
})
```

### Route protection — layout-level gate

```tsx
// app/(protected)/layout.tsx
export default async function Layout({ children }: LayoutProps<'/'>) {
  await requireUser()  // redirects if unauthenticated
  return <>{children}</>
}
```

Individual pages do not repeat the check. But **every Server Function must re-verify independently** — the layout check only controls rendering, not server-side execution.

### Server Functions — always re-verify, always check ownership

```ts
'use server'
export async function deletePost(postId: string) {
  const user = await requireUser()                          // authentication
  const post = await db.post.findUnique({ where: { id: postId } })
  if (post?.authorId !== user.id) throw new Error('Forbidden') // authorization
  await db.post.delete({ where: { id: postId } })
}
```

### Never trust client input for auth decisions

```tsx
// ❌ URL param
const isAdmin = searchParams.role === 'admin'

// ✅ session
const user = await requireUser()
const isAdmin = user.role === 'admin'
```

### DTOs only — never pass raw DB records to clients

```ts
// ✅ explicit select projection in every query
db.user.findUnique({ where: { id }, select: { id: true, name: true, role: true } })
```

---

## Internationalisation (i18n)

**Stack**: `next-intl@4` — no locale routing, single static `en` locale.

### Setup

```
i18n/request.ts          # getRequestConfig — returns locale: 'en' + messages
messages/en.json         # single file, namespaced keys
```

`next.config.ts` wraps the config with `createNextIntlPlugin`:

```ts
import createNextIntlPlugin from 'next-intl/plugin'
const withNextIntl = createNextIntlPlugin('./i18n/request.ts')
export default withNextIntl({ /* … */ })
```

`app/layout.tsx` provides messages to the client tree:

```tsx
import { getLocale, getMessages } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'

export default async function RootLayout({ children }) {
  const [locale, messages] = await Promise.all([getLocale(), getMessages()])
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
```

### Server vs. Client API

| Context | Import | Hook/function |
| --- | --- | --- |
| Server Components | `next-intl/server` | `await getTranslations('namespace')` |
| Client Components | `next-intl` | `useTranslations('namespace')` |

A component that is **imported by a Client Component** must use `useTranslations`, even if it has no other client-side code. `getTranslations` is server-only and will fail at runtime if called from the client tree.

```tsx
// ❌ NavLogo used inside client <Nav> — cannot use getTranslations
import { getTranslations } from 'next-intl/server'   // WRONG

// ✅ correct
'use client'
import { useTranslations } from 'next-intl'
export function NavLogo() { const t = useTranslations('footer'); … }
```

### Message file structure

Single `messages/en.json` with top-level namespaces matching feature domains:

```json
{
  "nav": { "cta": "Hire Me", "links": { "about": "About" } },
  "hero": { "badge": "Available for work", "typewriterRoles": ["Developer"] },
  "skills": { "sectionTitle": "Skills", "categories": { "all": "All" } },
  "common": { "toggleTheme": "Toggle theme", "scroll": "Scroll" }
}
```

### Array data — `t.raw()`

Use `t.raw('key')` to retrieve JSON arrays, then cast to the typed shape:

```ts
const items = t.raw('items') as ProjectItem[]
const roles = t.raw('typewriterRoles') as string[]
```

Never store arrays as comma-separated strings.

### ICU message format — interpolation and plurals

```json
{ "counter": "Showing {filtered} of {total} skills" }
```

```tsx
t('counter', { filtered: filtered.length, total: SKILLS.length })
```

Rich text (bold, links) uses `t.rich()`:

```tsx
t.rich('bio1', { highlight: (chunks) => <span className="text-amber-400">{chunks}</span> })
```

### Namespace conventions

| Purpose | Namespace |
| --- | --- |
| Navigation links + CTA | `nav` |
| Hero section | `hero` |
| About / bio | `about` |
| Skills section + categories | `skills` |
| Projects section | `projects` |
| Recommendations | `recommendations` |
| Engagement / services | `engagement` |
| Fit section | `fit` |
| Contact form + info | `contact` |
| Mentorship teaser | `mentorship` |
| Footer | `footer` |
| Shared labels (aria, theme, scroll) | `common` |
| `<head>` metadata | `metadata` |

### `generateMetadata` — use `getTranslations`, not static export

```ts
// ✅ async function, not a static `export const metadata`
export async function generateMetadata() {
  const t = await getTranslations('metadata')
  return { title: t('title'), description: t('description') }
}
```

### Static visual data stays in code

Strings that are UI labels belong in `messages/en.json`. Data that is purely visual (gradient class names, SVG `d` paths, `imageBg` strings, animation delays) stays in the component or a co-located data array — do not put it in messages.

```ts
// ✅ visual metadata lives in a parallel JS array, text in messages
const PROJECT_META = [
  { iconPath: 'M13 7h8…', imageBg: 'bg-gradient-to-br …', overlayType: 'live-lg' },
]
const items = t.raw('items') as ProjectItem[]  // titles / descriptions from messages
```
