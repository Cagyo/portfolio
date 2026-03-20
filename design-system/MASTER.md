# Portfolio Design System — Oleksii Berliziev
> Single source of truth for all design decisions, tokens, components, and patterns.
> Last updated: 2026-03-20

---

## 1. Foundation

### 1.1 Design Principles

| Principle | Description |
|-----------|-------------|
| **Dark-first** | Every component is designed for `#080810` background. No light mode. |
| **Amber as accent only** | Amber is used for CTAs, highlights, and interactive states — never as a background fill. |
| **Glass over solid** | Cards and surfaces use glassmorphism (`rgba(255,255,255,0.04)` + `backdrop-filter: blur`) rather than solid fills. |
| **Numbered structure** | Sections are sequentially numbered (`01.` → `07.`) to signal intentional, ordered narrative. |
| **Reveal on scroll** | All major blocks use `.reveal` (opacity + translateY) — threshold 12%, no re-trigger. |
| **No emoji icons** | All iconography uses inline SVG (Heroicons stroke style, 24×24 viewBox). |

---

## 2. Color Tokens

### 2.1 Core Palette

```css
:root {
  /* Background */
  --bg:           #080810;   /* Page background — near-black with blue tint */

  /* Amber accent */
  --amber:        #F59E0B;   /* Primary accent — Amber-500 */
  --amber-light:  #FBBF24;   /* Amber-400 — hover states, gradient start */
  --amber-dark:   #D97706;   /* Amber-600 — gradient end, scrollbar thumb */

  /* Surfaces */
  --surface:      rgba(255,255,255,0.04);   /* Glass card background */
  --surface-hover:rgba(255,255,255,0.07);   /* Glass card hover */

  /* Borders */
  --border:       rgba(255,255,255,0.08);   /* Default glass border */
  --border-amber: rgba(245,158,11,0.30);    /* Amber glass border */
}
```

### 2.2 Semantic Color Usage

| Token | Usage | Hex / Value |
|-------|-------|-------------|
| `--amber` | Nav underline, section numbers, icon fills, CTA background | `#F59E0B` |
| `--amber-light` | Gradient text start, chip dot, hover glow | `#FBBF24` |
| `--amber-dark` | Gradient text end, scrollbar, button gradient end | `#D97706` |
| `text-white` | Primary headings | `#F8FAFC` |
| `text-white/70` | Body paragraphs | rgba(248,250,252,0.70) |
| `text-white/50` | Secondary body, descriptions | rgba(248,250,252,0.50) |
| `text-white/40` | Labels, meta text | rgba(248,250,252,0.40) |
| `text-white/30` | Placeholder, muted | rgba(248,250,252,0.30) |
| `text-white/25` | Dividers, timestamps | rgba(248,250,252,0.25) |

### 2.3 Accent Colors (Section-specific)

| Color | Tailwind | Usage |
|-------|----------|-------|
| Purple `#a78bfa` | `violet-400` / `purple-400` | Full Product card, Deep Dive plan |
| Teal `#2dd4bf` | `teal-400` | Project SOS card |
| Green `#4ade80` | `green-400` | Good Fit section, availability dot, success states |
| Red `#f87171` | `red-400` | Not a Fit section |
| LinkedIn Blue | `#0A66C2` | LinkedIn icon hover only |
| Calendly Blue | `#006BFF` | Calendly CTA button background |

---

## 3. Typography

### 3.1 Font Stack

```css
font-family: 'Archivo', sans-serif;      /* Headings — font-heading */
font-family: 'Space Grotesk', sans-serif; /* Body — default */
```

**Google Fonts CDN:**
```html
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600;700;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
```

### 3.2 Type Scale

| Role | Class | Size | Weight | Font |
|------|-------|------|--------|------|
| Hero H1 | `text-5xl sm:text-6xl lg:text-7xl` | 48–72px | 900 (Black) | Archivo |
| Section heading | `text-4xl sm:text-5xl` | 36–48px | 900 (Black) | Archivo |
| Card heading | `text-xl` / `text-2xl` | 20–24px | 700–900 | Archivo |
| Sub-heading | `text-lg` / `text-xl` | 18–20px | 700 | Archivo |
| Body large | `text-lg` | 18px | 300–400 | Space Grotesk |
| Body default | `text-sm` / `text-base` | 14–16px | 400 | Space Grotesk |
| Label / meta | `text-xs` | 12px | 600–700 | Space Grotesk |
| Mono section number | `font-mono text-sm` | 14px | 700 | System mono |

### 3.3 Type Rules

- **Line height:** Body text uses `leading-relaxed` (1.625)
- **Tracking:** Labels use `tracking-widest` (`letter-spacing: 0.1em`); section numbers use `tracking-tight`
- **Gradient text:** Apply via `.text-gradient` — amber 400 → 500 → 600, `-webkit-text-fill-color: transparent`
- **Max line length:** Body paragraphs capped at `max-w-md` (448px) or `max-w-xl` (576px) for readability

---

## 4. Spacing & Layout

### 4.1 Grid System

```
Max content width:  max-w-6xl (1152px)
Page gutter:        px-4 sm:px-6 lg:px-8
Section padding:    py-32 (128px) vertical
Nav offset:         pt-24 on hero section
```

### 4.2 Spacing Scale (key values)

| Token | px | Usage |
|-------|----|-------|
| `gap-2` | 8px | Chip / tag gaps |
| `gap-4` | 16px | CTA button groups |
| `gap-6` | 24px | Card grids |
| `gap-8` | 32px | Section sub-blocks |
| `gap-12` | 48px | Two-column splits |
| `gap-16` | 64px | Hero two-column |
| `mb-6` | 24px | Section header → controls |
| `mb-16` | 64px | Section header → content |

### 4.3 Grid Patterns

```
Two-column layout:     grid lg:grid-cols-2 gap-16
Three-column cards:    grid sm:grid-cols-2 lg:grid-cols-3 gap-6
About 5-col split:     grid lg:grid-cols-5 gap-12  (3:2 ratio)
Contact 5-col split:   grid lg:grid-cols-5 gap-12  (2:3 ratio)
```

### 4.4 Border Radius Scale

| Token | px | Usage |
|-------|----|-------|
| `rounded-lg` | 8px | Small chips, scope tags |
| `rounded-xl` | 12px | Buttons, form inputs, icon boxes |
| `rounded-2xl` | 16px | Cards, panels, strips |
| `rounded-3xl` | 24px | Featured cards, profile card |
| `rounded-full` | 50% | Pills, filter tabs, avatar dots |

---

## 5. Component Library

### 5.1 Glass Card — `.glass`

```css
.glass {
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.08);
}
```

**Hover state:** `hover:border-amber-500/20` + `transition-colors duration-300`
**Featured variant:** Add amber top border `h-0.5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500`

### 5.2 Amber Glass — `.glass-amber`

```css
.glass-amber {
  background: rgba(245,158,11,0.06);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(245,158,11,0.30);
}
```

Used for: availability badge, hero card, "Best for" boxes in engagement cards.

### 5.3 Buttons

#### Primary — `.btn-amber`
```css
background: linear-gradient(135deg, #F59E0B, #D97706);
color: #0D0D0D;
font-weight: 600;
border-radius: 0.75rem; /* rounded-xl */
/* Hover: lighter gradient overlay, translateY(-2px), amber glow shadow */
```
- Always wrap text in `<span>` (required for z-index over ::before pseudo)
- Arrow icon: `<svg class="w-4 h-4 relative z-10">` (z-10 required)
- Sizes: `px-5 py-2` (small) · `px-6 py-2.5` (medium) · `px-7 py-3.5` (large)

#### Secondary — `.btn-outline`
```css
border: 1px solid rgba(245,158,11,0.5);
color: #F59E0B;
/* Hover: bg-amber-500/10, border-amber-500 full, translateY(-2px) */
```

### 5.4 Tags / Chips

#### `.tag` — Project & skill tags
```css
background: rgba(245,158,11,0.10);
border: 1px solid rgba(245,158,11,0.25);
color: #FBBF24;
font-size: 0.7rem; font-weight: 600;
padding: 2px 8px; border-radius: 4px;
text-transform: uppercase; letter-spacing: 0.05em;
```

#### `.skill-chip-top` — Core expertise chips
- Amber border, amber text, amber dot marker
- Larger padding: `8px 14px`, `border-radius: 12px`

#### `.skill-chip-rest` — Additional skill chips
- Neutral surface, white/60 text
- Smaller: `6px 12px`, `border-radius: 10px`

#### Section badge tags (colored variants)
| Variant | Background | Border | Text |
|---------|------------|--------|------|
| Amber (Ship fast) | `amber-500/15` | `amber-500/30` | `amber-400` |
| Purple (Long-term) | `purple-500/15` | `purple-500/30` | `purple-400` |
| Teal (Existing) | `teal-500/12` | `teal-500/25` | `teal-400` |

### 5.5 Form Inputs — `.form-input`

```css
background: rgba(255,255,255,0.04);
border: 1px solid rgba(255,255,255,0.10);
color: #F8FAFC;
/* Focus: border-amber-500, box-shadow 0 0 0 3px rgba(245,158,11,0.15) */
```

Standard padding: `px-4 py-3`, `rounded-xl`, `text-sm`
Placeholder color: `rgba(255,255,255,0.25)`

### 5.6 Section Header Pattern

```html
<div class="flex items-center gap-4 mb-16">
  <span class="text-amber-500 font-mono text-sm font-bold">NN.</span>
  <h2 class="font-heading font-black text-4xl sm:text-5xl text-white">Title</h2>
  <div class="flex-1 h-px bg-gradient-to-r from-amber-500/30 to-transparent ml-4"></div>
</div>
```

### 5.7 Nav Link — `.nav-link`

```css
/* Animated underline on hover/active */
.nav-link::after {
  content: ''; position: absolute; bottom: -4px; left: 0;
  width: 0; height: 2px; background: #F59E0B;
  transition: width 0.25s ease;
}
.nav-link:hover::after,
.nav-link.active::after { width: 100%; }
```

### 5.8 Timeline / Experience Card

```
Left amber bar: absolute left-0, w-1, h-full, gradient from-amber-500 to-amber-600
Logo box: w-9 h-9, rounded-xl, brand background color
Company name: text-amber-400/80
Date range: text-white/30 text-xs whitespace-nowrap
```

### 5.9 Scroll Reveal — `.reveal`

```css
.reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.reveal.visible { opacity: 1; transform: translateY(0); }
```

- IntersectionObserver threshold: `0.12`
- Stagger via inline `style="transition-delay: 0.1s"` increments

---

## 6. Page Structure & Sections

| # | ID | Title | Section type |
|---|----|-------|-------------|
| — | `#hero` | Hero | Full-screen, 2-col (text + float card) |
| 01 | `#about` | About Me | 5-col (3 text + 2 timeline) |
| 02 | `#skills` | Skills | Filterable chip grid with collapse |
| 03 | `#projects` | Projects | 3-col card grid (md:2, lg:3) |
| 04 | `#recommendations` | What people say | 2-col quote cards |
| 05 | `#engagement` | Ways to work together | 3-col service cards |
| — | `#fit` | Good / Not a fit | 2-col checklist (no number) |
| 06 | `#courses` | Mentorship & Courses | Tech chips + 2 pricing cards |
| 07 | `#contact` | Contact | 5-col (2 info + 3 form) |

### Navigation Links (desktop)

```
About · Skills · Projects · Reviews · Services · Fit · Courses · Contact
```

> ⚠️ "Courses" is currently missing from the nav.

---

## 7. Animation Tokens

| Name | Value | Usage |
|------|-------|-------|
| `animate-float` | `6s ease-in-out infinite, translateY 0→-20px` | Hero profile card |
| `animate-spin-slow` | `8s linear infinite` | Hero orbit ring |
| `animate-glow` | `2s alternate, box-shadow amber pulse` | Orbit dot |
| `animate-pulse-slow` | `3s infinite` | Availability dot |
| Micro-interaction | `150–200ms ease` | Hover color changes |
| Reveal animation | `700ms ease` | Scroll-triggered entries |
| Button hover | `250ms ease` | translateY(-2px) + shadow |
| prefers-reduced-motion | `0.01ms !important` | All animations/transitions |

---

## 8. Icons

All icons use **inline SVG**, Heroicons stroke style:
```html
<svg class="w-N h-N" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="…"/>
</svg>
```

| Size class | px | Usage |
|------------|----|-------|
| `w-3 h-3` | 12px | Tag icons, small badges |
| `w-3.5 h-3.5` | 14px | Tech chips |
| `w-4 h-4` | 16px | Button arrows, inline icons |
| `w-5 h-5` | 20px | Contact method icons |
| `w-6 h-6` | 24px | Nav hamburger |

**Brand logos** use `fill="currentColor"` from Simple Icons paths.
**Never use emoji as icons.**

---

## 9. Responsive Breakpoints

| Breakpoint | Width | Key changes |
|-----------|-------|-------------|
| `base` | 0–639px (mobile) | Single column, hamburger nav, full-width cards |
| `sm` | 640px+ | 2-column grids, inline contact info |
| `md` | 768px+ | Desktop nav visible, hide hamburger |
| `lg` | 1024px+ | 3-column grids, 5-col contact split, hero 2-col |

### Mobile-specific overrides

- Engagement cards: `Full Product Build & Support` is `order-1` (first)
- Good Fit: `Good fit` column is always `order-1` (first)
- Hero floating card: `hidden lg:flex` (desktop only)
- Nav full-name: `hidden sm:block` (hidden on smallest mobile)
- "View on LinkedIn" text: `hidden sm:inline` (icon-only on mobile)

---

## 10. Known Issues / Fix Backlog

| Priority | Issue | Fix |
|----------|-------|-----|
| `P0` | `#courses` missing from both navbars | Add `<a href="#courses">Courses</a>` to desktop + mobile nav |
| `P1` | Nav overflows at ~900px (7 links too many) | Group or abbreviate secondary links |
| `P1` | "View All Projects" arrow points ← not → | Change icon path to right arrow |
| `P1` | `opacity-8` invalid Tailwind class | Replace with `opacity-[0.08]` |
| `P1` | `border-white/8` invalid | Replace with `border-white/[0.08]` |
| `P1` | `bg-white/6` invalid | Replace with `bg-white/5` |
| `P2` | NestJS + Prisma SVG icons incorrect | Use correct brand SVGs from Simple Icons |
| `P2` | `#fit` section has no section number | Add to sequence or label as a sub-section |
| `P2` | 5.0 star rating on hero card unverified | Replace with a real metric or remove |
| `P3` | CSS duplicated across index.html + projects.html | Extract to shared `styles.css` |

---

## 11. Files

```
/portfolio-design/
├── index.html          — Main page (7 numbered sections + hero + contact)
├── projects.html       — Full projects listing with multi-axis filters
└── design-system/
    └── MASTER.md       — This file (single source of truth)
```

---

## 12. Quick-reference Checklist (before any new component)

- [ ] Background: `var(--bg)` (#080810) — never white/light
- [ ] Surface: `.glass` with `rgba(255,255,255,0.04)` — not solid fills
- [ ] Accent: amber only for interactive/highlight elements
- [ ] Icons: inline SVG, `fill="none"` Heroicons, correct `viewBox="0 0 24 24"`
- [ ] All clickable elements: `cursor-pointer`
- [ ] Hover: `transition-colors duration-200` minimum
- [ ] Focus: `focus-visible:ring-2 focus-visible:ring-amber-500`
- [ ] Animations: respect `prefers-reduced-motion`
- [ ] Responsive: test at 375, 768, 1024, 1440
- [ ] Reveal: add `.reveal` class to all new section-level blocks
- [ ] No inline `var(--amber)` in Tailwind context — use `text-amber-500` etc.
