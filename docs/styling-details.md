# Styling — details

> Tailwind-first. CSS modules are a narrow, justified exception. The top-level rules (semantic tokens, retention criteria, budget, justification comments) live in [`CLAUDE.md`](../CLAUDE.md). This file is the deep reference.

## 1. Semantic tokens — single source of truth

Declared once in the `@theme` block of [`app/globals.css`](../app/globals.css). Each property maps a Tailwind utility prefix to a `:root` (dark) custom property; light overrides flow through `html[data-theme="light"]` redefinitions of those same `:root` properties.

| Tailwind | Mapped property | Purpose |
| --- | --- | --- |
| `bg-background`, `bg-background-elevated` | `--bg`, `--bg-secondary` | Page + raised surfaces |
| `bg-card`, `bg-card-hover` | `--surface`, `--surface-hover` | Glass card body |
| `text-foreground` | `--text-primary` | Default body/heading text |
| `text-foreground-soft` | `--text-secondary` | De-emphasized body copy |
| `text-muted-foreground` | `--text-muted` | Captions, meta |
| `text-faint-foreground` | `--text-faint` | Disabled hints |
| `text-ghost-foreground` | `--text-ghost` | Decorative meta, dividers |
| `text-invisible-foreground` | `--text-invisible` | Atmospheric only |
| `border-border`, `border-border-amber` | `--border`, `--border-amber` | Default + amber borders |
| `bg-amber`, `bg-amber-light`, `bg-amber-dark` | `--amber`, `--amber-light`, `--amber-dark` | Brand fills |
| `text-amber-foreground` | `--amber-fg` (theme-aware) | Readable amber on either theme |
| `from-amber-light` / `to-amber-dark` | gradient stops | Brand gradients |

Tailwind's opacity modifier works on every token: `bg-amber/10`, `border-border/50`, `text-muted-foreground/70`.

**Rule:** Never refer to a raw palette utility (`text-white`, `text-amber-400`, `bg-zinc-*`) or a hex literal in `.tsx`. If a value isn't covered by a token, add the token rather than the literal.

## 2. Tailwind v4 patterns to prefer over CSS modules

### Conditional class composition

```ts
import { cn } from '@/app/_lib/cn'

<button className={cn('px-3 py-1.5 rounded-md', isActive && 'bg-amber/10 text-amber-foreground')}>
```

### Variants

Use `cva` (class-variance-authority) for primitives that have multiple variants:

```ts
import { cva } from 'class-variance-authority'

const button = cva('inline-flex items-center justify-center rounded-md transition-colors', {
  variants: {
    variant: {
      primary: 'bg-amber text-foreground hover:bg-amber-light',
      outline: 'border border-border-amber text-amber-foreground hover:bg-amber/6',
    },
    size: { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2', lg: 'px-6 py-3 text-lg' },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
})
```

### Descendant hover

```tsx
{/* One level — built-in `group` */}
<article className="group">
  <h3 className="group-hover:text-amber-foreground" />
</article>

{/* Two or more — named groups */}
<article className="group/card">
  <div className="group/inner">
    <span className="group-hover/card:opacity-100 group-hover/inner:translate-x-1" />
  </div>
</article>
```

### State / ARIA / selectors

| CSS | Tailwind v4 |
| --- | --- |
| `:has(input:checked) > label` | `has-[input:checked]:bg-card-hover` |
| `:focus-within` | `focus-within:ring-2` |
| `:nth-child(3n+1)` | `nth-[3n+1]:` |
| `[aria-pressed="true"]` | `aria-pressed:bg-amber/14` |
| `[data-state="open"]` | `data-[state=open]:rotate-180` |
| `:nth-child(odd)` | `odd:bg-card` |
| Peer-driven sibling state | `peer-checked:`, `peer-hover:` |

### Pseudo-elements (≤3 props)

```tsx
<div className="relative before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-amber/0 before:to-amber/20" />
```

If the pseudo-element needs ≥5 properties or a state-dependent gradient, move it to a CSS module (criterion 2).

### Inline `style` — the only legal uses

```tsx
{/* JS-derived only */}
style={{ opacity: scrollProgress }}
style={{ maxHeight: open ? 1200 : 0 }}
style={{ animationDelay: `${i * 0.1}s` }}
style={{ '--accent': item.color } as React.CSSProperties}
```

Static values (`display`, `transition`, `overflow`, `box-shadow`) never belong in `style`.

## 3. `@utility` blocks in `globals.css`

Use `@utility` when a class is **consumed by 3+ components** OR **applied to varying element types** (e.g. `<div>` and `<form>` and `<a>`). Current registered utilities:

`glass`, `glass-amber`, `blob`, `text-gradient`, `text-gradient-amber`, `text-gradient-violet`, `dot-grid`, `reveal`, `form-input`, `hover-transitions`, `btn-shimmer`, `btn-outline`, `show-more-toggle`, `mobile-overlay`, `active-chip`

> **Interactive elements must use `hover-transitions`.** It owns the canonical hover transition list — `translate, box-shadow, border-color, background-color, color, opacity` — at 250ms ease, plus a built-in 2px lift on hover and motion-reduce handling. Apply it once and add the desired hover state classes (`hover:bg-…`, `hover:border-…`, `hover:shadow-…`); do not hand-roll a `transition-[…]` list. The name says "lift" but the contract is broader: removing it strips animation from every property in the list, not just translate. Background: Tailwind v4 writes `-translate-y-*` to the CSS `translate` property, so `transition-[transform,...]` silently drops the lift animation.

`@utility` blocks support CSS nesting: `&:hover`, `&:focus`, `&.active`, `&::before`, and `html[data-theme="light"] & { … }` for theme-scoped variants.

> **Specificity escape hatch — `&&`.** Tailwind v4 sorts compiled utilities alphabetically. When a utility must win over another utility that is co-applied to the same element AND declared later alphabetically (notably `.reveal`, which sets the `transition` shorthand), source order cannot rescue it. Wrap the conflicting declarations in `&& { … }` to double the class selector (`.foo.foo`) and bump specificity. `hover-transitions` uses this pattern to keep its transition list from being clobbered by `.reveal`.

> **Never** move `reveal` to a CSS module — `use-reveal.ts` queries `.reveal` via `document.querySelectorAll` and toggles `.visible` via `classList`. Global class name must be stable.

## 4. React UI primitives

Extract a React component (not just a class) when a styled element has:

- A fixed semantic HTML element (`<a>` or `<button>`)
- Consistent interactive structure across all call sites
- Behavioral logic (polymorphic rendering, state, forwarded refs)

Current UI primitives:
- `<Button>` — `variant?: "primary" | "outline"`; renders `<a>` when `href` is provided, `<button>` otherwise. Built with `cva`.
- `<Tag>` — uses `active-chip` `@utility`.

---

## Appendix: when you legitimately need a CSS module

A `.module.css` file is justified ONLY if the component meets at least one of:

1. **`@keyframes` tied to component-local state** (generic keyframes live in `@theme { --animate-foo: … }` so they become `animate-foo` utilities).
2. **`::before` / `::after` with ≥5 properties or state-dependent gradients.**
3. **Descendant selector chains spanning >1 nesting level.** (One level — use `group/name` + `group-hover/name:`.)
4. **Sibling selectors (`~`, `+`) with state beyond what `peer-*` provides.**
5. **`@property` registered custom properties** (animating gradient stops, conic gradients).
6. **Named container queries with multiple rules.**

Additional accepted exception: **vendor pseudo-elements** (`::-webkit-scrollbar*`) and **`:global()` selectors** that theme a third-party library — Tailwind cannot express these.

**File-level exceptions:**
- **`app/global-error.tsx`** may use a co-located module — it is the top-level uncaught error boundary and must render even if the Tailwind/Next.js layer has failed.
- **`app/dev/*`** routes are outside the styling policy. They are internal preview tools, not in the public sitemap, and not part of any user-facing budget.

### Required justification comment

Every surviving `.module.css` must start with:

```css
/* Retained per refactor policy: <criterion from the list above>.
   <Specific reason — e.g., "ringPulse keyframe coupled to recorder state machine">. */
```

No comment = the file should not exist. Migrate the styles to Tailwind utilities and delete the module.

### Conventions inside a module

- File: `ComponentName.module.css` co-located next to its `ComponentName.tsx`.
- Class names: camelCase (`.navLink`, `.skillChipTop`).
- Use design tokens, never raw RGBA literals:
  ```css
  /* ❌ */  background: rgba(245, 158, 11, 0.4);
  /* ✅ */  background: color-mix(in srgb, var(--amber) 40%, transparent);
  ```
- Co-locate `html[data-theme="light"]` overrides at the bottom of the file. Use semantic tokens (`var(--text-primary)`, `var(--surface)`, `var(--border)`, `var(--tag-color)`) — never new hex literals.
- Do not duplicate shared classes across multiple modules — promote to `@utility` instead.
- Do not combine a CSS-module class and Tailwind utilities to style the same visual concern on the same element. Pick one tier per concern.

## Light-mode audit checklist

The override block at the top of `globals.css` is now intentionally small. Before and after any styling change, grep for:

- `text-white/`, `border-white/`, `bg-white/` in `app/**/*.tsx` → **zero matches** (these are migrated escape hatches; any new occurrence is a regression).
- `text-amber-[0-9]`, `bg-amber-[0-9]+/`, `border-amber-[0-9]+/` → **zero matches** (use `text-amber-foreground`, `bg-amber/N`, `border-border-amber`).
- `bg-black/*`, `bg-zinc-*`, `bg-gray-*`, hex backgrounds (`#080810`, `#0d0d18`, `#16162a`) → **zero matches** (use `bg-background` / `bg-background-elevated` / `bg-card`).
- `color-mix(in srgb, white`, `oklch(from white` → only inside CSS modules with explicit `html[data-theme="light"]` overrides.

If a regression appears, fix it at the source by replacing with a semantic token. Do **not** re-add a `data-theme="light"` override block.

## Verification commands

```bash
# Count surviving modules and total LOC
find app -name "*.module.css" | wc -l
find app -name "*.module.css" -exec wc -l {} + | tail -1

# Find regressions in TSX
grep -rE "(text-white/[0-9]|border-white/[0-9]|bg-white/[0-9]|text-amber-[0-9]|bg-amber-[0-9]+/|border-amber-[0-9]+/)" --include='*.tsx' app/

# Find modules missing a justification comment
for f in $(find app -name "*.module.css"); do
  head -1 "$f" | grep -q "Retained per refactor policy" || echo "UNJUSTIFIED: $f"
done
```

Budget: ≤ 20 module files (target ≤ 15), ≤ 1,500 LOC (target ≤ 1,200). Crossing either ceiling requires explicit discussion in the PR.
