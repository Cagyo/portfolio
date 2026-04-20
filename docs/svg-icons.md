# SVG Icons & Logos

> Read when adding a new icon or logo under `assets/icons/` or `assets/logos/`.

All SVGs must be extracted as React components — never inline `<svg>` elements in page or feature components.

## Location

```
assets/
  icons/   ← general UI icons (stroke-based, theme-aware)
  logos/   ← brand logos (may have hardcoded fills)
```

## Component pattern

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

## Rules

- Props: `className?: string` on every component; add `strokeWidth?: number` (default `2`) only when the icon is used with multiple stroke widths
- Icons use `stroke="currentColor"` so they inherit text color via Tailwind (`text-amber-400`, `text-white/50`, etc.)
- Brand logos with fixed colors (Figma, Stripe, etc.) hardcode their fill values — no `className` for color
- `strokeWidth` defaults: most icons `2`; toggles/chips `2.5`; fine icons (e.g. `EmptyFaceIcon`) `1.5`; structural icons (e.g. `MonitorIcon`) `1`
- Photo-placeholder SVGs and dynamic icon-path props (`d={badge.iconPath}`) stay inline — do not extract
- No barrel `index.ts` — import directly from the source file:
  ```tsx
  import { ArrowRightIcon } from '@/assets/icons/ArrowRightIcon'
  import { GitHubLogo } from '@/assets/logos/GitHubLogo'
  ```
