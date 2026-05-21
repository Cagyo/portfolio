# Portfolio — Copilot instructions

**This is NOT the Next.js you know.** Next 16.2, React 19.2, TS 5 strict, Tailwind 4. Read `node_modules/next/dist/docs/` before writing code.

## Hard rules

- Package manager: **yarn only** for install/run/build — never `npm` or `pnpm`.
- One-off tools: use `npx <tool>` (e.g. `npx shadcn@latest add ...`). Never `yarn dlx`.
- Run `yarn check` (typecheck + lint) after every change.
- Tailwind-first. Never use raw palette opacities (`text-white/N`, `bg-amber-500/N`, `bg-zinc-*`, hex literals) in `.tsx`. Use semantic tokens: `text-foreground`, `bg-card`, `border-border`, `text-amber-foreground`, `bg-amber`.
- All external `href` values come from `siteConfig` (`app/_config/site-config.ts`). Never hardcode URLs.
- No barrel files (`index.ts`). Use the `@/` alias for cross-directory imports.
- Server Components by default. `'use client'` only when needed; push it deep and narrow.
- Convert `Date` → ISO `string` at the RSC boundary.
- One `<main>` per page. Footer lives only in the root layout (never in `page.tsx`).
- i18n: `await getTranslations('ns')` (server) / `useTranslations('ns')` (client). `generateMetadata` must be `async`, never static `export const metadata`.
- Copy / commit messages / PR text: no em dashes, no marketing-speak, every word earns its place. (Inline code comments exempt.)

## File naming

| Type | Convention | Example |
| --- | --- | --- |
| Next.js special files | `kebab-case` | `page.tsx`, `not-found.tsx` |
| Route folders / private folders | `kebab-case` / `_kebab-case` | `app/blog/[slug]/`, `_components/` |
| Components | `PascalCase.tsx` | `PostCard.tsx` |
| Hooks | `use-kebab-case.ts` | `use-scroll-position.ts` |
| Utilities, actions, queries, types, schemas | `kebab-case.ts` | `post-actions.ts` |

## Where to look

- Full conventions → [`/CLAUDE.md`](../CLAUDE.md)
- Product scope and voice → [`/PRODUCT.md`](../PRODUCT.md)
- Visual / UX intent → [`/DESIGN.md`](../DESIGN.md)
- Deep dives → `/docs/` (auth, i18n, forms, error-handling, styling-details, seo, svg-icons)
