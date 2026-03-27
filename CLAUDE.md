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

### Cache Components + Activity

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
