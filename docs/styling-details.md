# Styling — details

> Read when adding an `@utility`, working inside a `ComponentName.module.css`, or introducing a new React UI primitive. The top-level rules (three-layer table, no-inline-style, light-mode requirement) live in `CLAUDE.md`.

## `@utility` (shared primitives in `globals.css`)

Current registered utilities: `glass`, `glass-amber`, `blob`, `text-gradient`, `dot-grid`, `reveal`, `form-input`

Use `@utility` when a class is:
- Consumed by 3+ components, **or**
- Applied to varying HTML element types (e.g. `div`, `nav`, `form`, `span`)

`@utility` blocks support CSS nesting for states: `&:hover`, `&:focus`, `&.active`, `&::before`.

> **Never** move `reveal` to a CSS module — `use-reveal.ts` queries `.reveal` via `document.querySelectorAll` and adds `.visible` via `classList.add`. Global class name must be stable.

## CSS Modules

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

## React UI primitives

Extract a React component (not just a CSS class) when a styled element has:
- A fixed semantic HTML element (`<a>` or `<button>`)
- Consistent interactive structure across all call sites
- Behavioral logic (polymorphic rendering, state, forwarded refs)

Current UI primitives: `<Button>` — `variant?: "primary" | "outline"`, renders `<a>` when `href` is provided, `<button>` otherwise. Children are wrapped in `<span className={styles.inner}>` so that bare text nodes are lifted above the `::before` shimmer layer via `z-index`.

## Tokens, inline styles, and light mode — expanded rules

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

- Every CSS module must include `html[data-theme="light"]` overrides for any property that uses white-based opacity colors (`oklch(from white ...)`, `color-mix(in srgb, white ...)`), foreground amber on light surfaces (`color: var(--amber)` or low-opacity amber text), or hardcoded dark backgrounds (`#080810`, `#0d0d18`, `#16162a`, etc.). Use design tokens (`var(--text-primary)`, `var(--surface)`, `var(--border)`, `var(--tag-color)`, etc.) in light mode overrides. Similarly, any new Tailwind utility class using white opacity (`text-white/N`, `border-white/N`, `bg-white/N`), uncovered amber opacity variants, `bg-black/*`, `bg-zinc-*`, or `bg-gray-*` must have a corresponding `html[data-theme="light"]` override in `globals.css` only when the class is genuinely shared.

- Light mode text tokens are contrast-led, not opacity mirrors of dark mode. Use `--text-primary`, `--text-secondary`, `--text-muted`, and `--text-faint` for readable copy; reserve `--text-ghost`, `--text-invisible`, low-opacity borders, and pale backgrounds for decorative meta, disabled hints, dividers, and atmospheric details.

- Do not combine a CSS-module class and Tailwind utility classes to style the same visual concern on the same element (e.g. `` `${isTeal ? styles.kickerTeal : 'italic text-white/40'}` ``). Either promote both branches to the CSS module (preferred when one branch already lives there) or handle both with Tailwind. Mixing forces readers to cross-reference two styling systems to understand one element.

## Light-mode audit checklist

Run a scoped search before and after theme work for:
- White-opacity CSS and utilities: `text-white/`, `border-white/`, `bg-white/`, `color-mix(in srgb, white`, `oklch(from white`
- Amber foreground states: `text-amber-`, `hover:text-amber-`, `color: var(--amber)`, and low-opacity amber text used as readable copy
- Hardcoded dark utilities and surfaces: `bg-black/`, `bg-zinc-`, `bg-gray-`, `#080810`, `#0d0d18`, `#16162a`
- Component-specific overlays, tooltips, drawers, native control options, and disabled/private states

If a risky class appears in 3+ unrelated call sites, add or extend a global light utility override. If it is component-specific, move the visual state into the co-located CSS module and add a local `html[data-theme="light"]` override. Keep dark-mode declarations unchanged unless the task explicitly asks for a dark-mode redesign.
