---
name: Fractional CTO Portfolio
description: A calm, amber-on-graphite portfolio that converts qualified founders into a discovery call by proving craft instead of claiming it.
colors:
  amber: "#F59E0B"
  amber-light: "#FBBF24"
  amber-dark: "#D97706"
  graphite-black: "#080810"
  graphite-secondary: "#0c0c18"
  text-primary-dark: "#F8FAFC"
  text-primary-light: "#0F172A"
  text-secondary-light: "#1E293B"
  text-muted-light: "#475569"
  surface-dark: "#0F0F1A"
  surface-light: "#FFFFFF"
  border-light: "#1F2937"
  signal-green: "#22C55E"
  signal-green-light: "#4ADE80"
  signal-red: "#EF4444"
  accent-violet: "#A78BFA"
  accent-purple: "#A855F7"
  accent-teal: "#14B8A6"
  brand-linkedin: "#0A66C2"
  brand-calendly: "#006BFF"
  brand-telegram: "#229ED9"
  brand-whatsapp: "#25D366"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "3.25rem"
    fontWeight: 900
    lineHeight: 0.92
    letterSpacing: "0"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 4vw, 3rem)"
    fontWeight: 900
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.55rem"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "normal"
  body:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  body-sm:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "0.7rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.05em"
  section-number:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0"
rounded:
  xs: "4px"
  sm: "5px"
  md: "8px"
  cta: "0.875rem"
  nav-cta: "0.75rem"
  nav-bar: "1.125rem"
  frame: "1rem"
  pill: "9999px"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.25rem"
  xl: "1.5rem"
  2xl: "2rem"
  section: "5rem"
  hero-top: "7rem"
components:
  button-primary:
    backgroundColor: "{colors.amber}"
    textColor: "#0D0D0D"
    rounded: "{rounded.cta}"
    padding: "0 1.5rem"
    height: "3.25rem"
  button-primary-hover:
    backgroundColor: "{colors.amber-light}"
    textColor: "#0D0D0D"
    rounded: "{rounded.cta}"
    padding: "0 1.5rem"
    height: "3.25rem"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.amber}"
    rounded: "{rounded.cta}"
    padding: "0 1.25rem"
    height: "3rem"
  button-outline-hover:
    backgroundColor: "rgba(245,158,11,0.10)"
    textColor: "{colors.amber}"
    rounded: "{rounded.cta}"
    padding: "0 1.25rem"
    height: "3rem"
  tag-amber:
    backgroundColor: "rgba(245,158,11,0.10)"
    textColor: "{colors.amber-light}"
    rounded: "{rounded.xs}"
    padding: "2px 8px"
    typography: "{typography.label}"
  tag-neutral:
    backgroundColor: "rgba(255,255,255,0.04)"
    textColor: "rgba(248,250,252,0.50)"
    rounded: "{rounded.sm}"
    padding: "2px 7px"
    typography: "{typography.label}"
  tag-green:
    backgroundColor: "rgba(34,197,94,0.10)"
    textColor: "{colors.signal-green-light}"
    rounded: "{rounded.sm}"
    padding: "2px 7px"
    typography: "{typography.label}"
  card-project:
    backgroundColor: "rgba(255,255,255,0.04)"
    textColor: "{colors.text-primary-dark}"
    rounded: "{rounded.md}"
    padding: "1.25rem"
  card-project-hover:
    backgroundColor: "rgba(255,255,255,0.07)"
    textColor: "{colors.text-primary-dark}"
    rounded: "{rounded.md}"
    padding: "1.25rem"
  nav-bar:
    backgroundColor: "rgba(12,12,24,0.82)"
    textColor: "{colors.text-primary-dark}"
    rounded: "{rounded.nav-bar}"
    padding: "0.75rem 0.875rem 0.75rem 1rem"
  input:
    backgroundColor: "rgba(255,255,255,0.04)"
    textColor: "{colors.text-primary-dark}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1rem"
  input-focus:
    backgroundColor: "rgba(255,255,255,0.04)"
    textColor: "{colors.text-primary-dark}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1rem"
---

# Design System: Fractional CTO Portfolio

## 1. Overview

**Creative North Star: "The Lit Workbench"**

A dark workshop with a single warm work-light overhead. The surface is graphite, almost black, faintly violet under the lamp. Amber is the only light in the room: it falls on the work, not on the worker. Nothing decorative, nothing demonstrative. The interface is a tool, not a stage.

The system is built around restraint as the seniority signal. Type is set in Archivo (display) and Space Grotesk (body) with high weight contrast (400 → 900) and a tight scale. Section headers are numbered in mono, like notebook entries. The amber accent does heavy work but appears on ≤10% of any given screen: the last name in the hero, the primary CTA, the section numbers, focus rings, hover lifts. Hovers are gentle and surface-specific: home-page project cards and rare featured surfaces may use the warm glow, while `/projects` list items use a quiet border/background highlight with at most a 1px lift. Surfaces are translucent glass (`backdrop-filter: blur(8px)`) over the graphite base; light mode swaps to warm-white with the same chroma logic inverted.

The system explicitly rejects: pastel-gradient dev-portfolio templates, the SaaS hero-metric template (big number / small label / supporting stats), neon-on-black "futuristic dev" cosplay, and McKinsey-style navy-and-gold corporate gravitas. If a screen could be reskinned as any of those four, it has drifted.

**Key Characteristics:**
- Amber on graphite, never amber on amber, never amber on white.
- Numbered, mono-labeled sections (`01`, `02`, `03`) as the structural rhythm.
- Glass surfaces with warm-amber glow only where the surface is marquee or home-page proof; `/projects` list items stay quiet.
- High weight contrast in type (400 body, 900 display); flat scale forbidden.
- One accent color carries the entire identity. Secondary hues (violet, teal, green, purple) appear only as semantic role colors, never as decoration.

## 2. Colors: The Workbench Amber Palette

A two-color identity: Workbench Amber against Graphite Black. Every other color is either a state signal (success, error) or a brand override (LinkedIn, Calendly, Telegram, WhatsApp) where the platform's own color must be honored.

### Primary
- **Workbench Amber** (`#F59E0B`): the single accent. Carries the hero last-name, the primary CTA gradient, section numbers (paired with mono type), focus rings, hover glows. Light variants `#FBBF24` (amber-light) and `#D97706` (amber-dark) are used only as the two endpoints of a 135° gradient on the primary button and inside `--gradient-amber-text` for the brand wordmark.

### Secondary
- **Light-mode Amber** (`#B45309` / `#92400E`): in `html[data-theme="light"]`, every amber-on-light occurrence shifts to these darker burnt-amber values to maintain WCAG AA contrast on warm-white surfaces. The CSS variable `--tag-color` resolves to `#B45309` in light mode.

### Tertiary (semantic role colors only)
- **Signal Green** (`#22C55E`, light `#4ADE80`): "available for work" badge, success states, the green project-status tag.
- **Signal Red** (`#EF4444`): error states only.
- **Accent Violet** (`#A78BFA`) / **Accent Purple** (`#A855F7`): the violet section-header accent (alternate to amber) and the mentorship subroute's secondary identity. Never decorative.
- **Accent Teal** (`#14B8A6`): tertiary category chip color in projects filter. Never primary.

### Neutral
- **Graphite Black** (`#080810`): the canonical page background. Faintly violet (chroma toward blue, not pure neutral). Pure `#000` is forbidden.
- **Graphite Secondary** (`#0c0c18`): elevated surfaces (nav bar, mobile menu), one shade up from page background.
- **Text Primary Dark** (`#F8FAFC`): not pure `#fff`. Cool, slightly blue-tinted off-white.
- **Text scale**: `rgba(248,250,252,0.70|0.50|0.40|0.30|0.12)` for secondary / muted / faint / ghost / invisible. Opacity, not separate hues. In light mode, these resolve to literal slate values (`#1E293B`, `#475569`, `#5B677A`, `#64748B`).

### Named Rules

**The One Light Rule.** Workbench Amber appears on ≤10% of any given screen. Its rarity is the point. If a screen reads as "amber", reduce until amber reads as a punctuation mark, not a color field. Store-button hover visibility should prefer neutral surface contrast before adding amber; amber is an accent, not the whole hover state.

**The No-Pure-Extreme Rule.** `#000` and `#fff` are forbidden. Use Graphite Black (`#080810`, faint violet) and Text Primary Dark (`#F8FAFC`, faint blue). Every neutral is tinted.

**The Brand-Override Exception.** `--linkedin-blue`, `--calendly-blue`, `--telegram-blue`, `--whatsapp-green` are platform-mandated and do not theme. They appear only on the corresponding contact-thread CTAs and are excluded from the One Light Rule.

## 3. Typography

**Display Font:** Archivo (with `system-ui, sans-serif` fallback). Weights 700 and 900 only.
**Body Font:** Space Grotesk (with `system-ui, sans-serif` fallback). Weights 400, 500, 600, 700.
**Label/Mono Font:** Tailwind's `font-mono` stack (`ui-monospace, SFMono-Regular, Menlo, ...`). No custom mono.

**Character:** Archivo Black is the only display weight; the contrast between it (900) and Space Grotesk body (400) carries the entire hierarchy. Mono numbers (`01`, `02`) against the sans headlines feels like a senior engineer's notebook, not a marketing page.

### Hierarchy
- **Display** (Archivo 900, `3.25rem`, line-height `0.92`): the hero `<h1>` — first and last name stacked, last name in `--amber-light`. Drops to `2.875rem` below 400px.
- **Headline** (Archivo 900, `text-4xl sm:text-5xl` → `clamp(2.25rem, 4vw, 3rem)`, line-height ~`1.05`): every section `<h2>`. Always paired with a mono section number and a fading amber/violet rule on the right.
- **Title** (Archivo 700, `1.55rem` featured / `1.125rem` regular, line-height `1.12`–`1.18`): project card titles.
- **Body** (Space Grotesk 400, `1.0625rem`, line-height `1.7`): hero description and primary reading body. Smaller variant at `0.875rem`/line-height `1.6` for card body copy. Body line length is capped by `max-width: 32rem` (description) / `34rem` (tagline) — well under the 65–75ch ceiling.
- **Label** (Space Grotesk 600/700, `0.65–0.7rem`, letter-spacing `0.04–0.05em`, `text-transform: uppercase`): tag chips, stack chips, status badges. Never for sentences.
- **Section Number** (mono 700, `0.875rem`/`text-sm`): the numbered prefix in `<SectionHeader>` (`01`, `02`, `03`). Always amber or violet, never neutral.

### Named Rules

**The 1.25-Step Rule.** Adjacent type roles must differ by at least 1.25× in size OR by a weight class. Body (400, 1.0625rem) → Title (700, 1.125rem) is weight-led; Title (700, 1.55rem) → Headline (900, ~3rem) is size+weight-led. Flat scales are forbidden.

**The Mono-For-Numbers-Only Rule.** Mono type appears exclusively on section numbers and inline code. Never on labels, never on body, never on CTAs.

**The No-Em-Dash Rule.** PRODUCT.md voice rule, enforced visually: no `—` and no `--` in copy. Use commas, colons, semicolons, periods, or parentheses.

## 4. Elevation

The system is **flat surfaces + intentional state change**. Surfaces at rest have no shadow vocabulary; they read as panes of translucent glass over the graphite base (`background: rgba(255,255,255,0.04)` + `backdrop-filter: blur(8px)` + 1px hairline border in `rgba(255,255,255,0.08)`). Depth arrives only on state change, and glow is reserved for home-page project cards, CTAs, and rare marquee surfaces. Ordinary `/projects` list items use border and background contrast instead of glow.

### Shadow Vocabulary

- **Home Project Card Hover Glow** (`box-shadow: 0 20px 60px rgba(245,158,11,0.15)`): allowed for home-page project cards and rare marquee proof surfaces, exposed as `--card-shadow`. In light mode, the same token resolves to a cooler neutral (`0 20px 60px rgba(15,23,42,0.10)`).
- **Projects List Quiet Hover**: `/projects` list cards shift border/background and may lift by `translateY(-1px)`. They do not use `--card-shadow` or warm glow on ordinary list hover.
- **CTA Hover Glow** (`box-shadow: 0 8px 30px color-mix(in srgb, var(--amber) 40%, transparent)`): primary button lift on hover, paired with a `-2px` translate.
- **Hero Photo Frame** (`box-shadow: 0 18px 54px color-mix(in srgb, var(--amber) 10%, transparent)`): the only resting shadow in the system, and it is warm, not neutral. Reserved for the hero photo frames and tablet photo frame.
- **Nav Bar Ambient** (`box-shadow: 0 16px 48px color-mix(in srgb, var(--bg) 62%, transparent)`): the floating glass nav bar's ambient lift away from the page. Same-hue-as-background shadow, not coloured.
- **Focus Ring** (`box-shadow: 0 0 0 3px rgba(245,158,11,0.15)`): input focus only. Always amber, always 3px, always 15% alpha.

### Named Rules

**The Warm-Shadow Rule.** Every state-change shadow that exists is amber-tinted, not neutral grey. Generic `rgba(0,0,0,0.X)` shadows are forbidden. If a shadow needs to feel warmer, raise the amber percentage; if cooler, use the page background (`var(--bg)`) at low alpha. `/projects` list cards are the explicit quiet exception: use no hover shadow there.

**The Flat-At-Rest Rule.** Surfaces do not lift until the user interacts. No resting drop-shadows on cards, tags, or buttons. The hero photo frame is the single intentional exception.

**The No-Glassmorphism-For-Decoration Rule.** The `glass` and `glass-amber` utilities are reserved for actually-functional surfaces (nav bar, mobile menu, photo card overlay). They are not a decorative finish to sprinkle on hero blobs or marketing cards.

## 5. Components

### Buttons
- **Shape:** `border-radius: 0.875rem` (`rounded-cta`, 14px). Same radius across primary and outline; consistency over variant.
- **Primary:** `linear-gradient(135deg, var(--amber), var(--amber-dark))` background, near-black text (`#0D0D0D`, not `#000`), font-weight 600. Hover swaps a `::before` overlay to a lighter gradient (`amber-light → amber`) and lifts `-2px` with a warm amber glow. Height `3.25rem`, padding `0 1.5rem`.
- **Outline:** 1px border in `color-mix(in srgb, var(--amber) 50%, transparent)`, amber text, no fill. Hover fills with 10% amber and saturates the border to solid amber. Height `3rem`, padding `0 1.25rem`. Light mode swaps text to the darker burnt-amber for contrast.
- **Focus:** light-mode outline buttons get a `2px solid var(--amber-dark)` outline with 3px offset. Dark-mode buttons inherit the system focus ring from `form-input` utility patterns.

### Chips & Tags
Three variants, all share the uppercase / letter-spaced label typography.
- **Amber Tag** (`--tag-bg` / `--tag-border` / `--tag-color`): the canonical project skill chip. Soft amber fill, ~10% alpha. Anchor variant has hover that warms toward amber.
- **Neutral Tag**: `rgba(255,255,255,0.04)` fill, muted text. For secondary metadata (year, category).
- **Green Tag**: signal green at 10% fill. For "shipped", "live", status confirmations.
- **Active Chip** (filter pill): pill-shaped (20px radius), 12% amber fill, 30% amber border, amber text. Hovers to 20% fill. The "selected" state in projects-page filter rails.

### Cards / Containers
- **Home-page Project Card**: `border-radius: 8px`, surface fill at `rgba(255,255,255,0.04)`, 1px hairline border. Padding `1.25rem`. Hover may use `translateY(-6px)` + `--card-shadow` (warm amber, 0 20px 60px / 15% alpha). This warmer behavior belongs to the home page and rare featured proof surfaces.
- **`/projects` List Item**: the project hub uses calmer list cards. Hover shifts border/background and may lift by `translateY(-1px)` only. No `--card-shadow` glow on ordinary list items, including the first visible projects.
- **Project Proof Artifact**: proof is conditional, prioritized as first screenshot, then project logo, then none. Cards without a usable screenshot or logo collapse to a full-width text layout. Never reserve an empty desktop rail, empty image frame, or generic placeholder for missing proof.
- **Project Store Buttons**: App Store and Google Play buttons must visibly change fill, border, label text, and logo/icon color on hover in both dark and light themes. On warm-white light surfaces, prefer neutral fill/border contrast for hover readability; amber may remain a small accent.
- **Featured Project Card**: same base, padding scales `clamp(1.5rem, 3vw, 2rem)`. Title jumps from `1.125rem` to `1.55rem`. Problem text steps up in color from `--text-muted` to `--text-secondary` and from `0.8125rem` to `0.95rem`.
- **Glass Surfaces** (`@utility glass`): `--surface` background, 8px backdrop-blur, 1px border in `--border`. Used for the photo card overlay, mobile menu, and the floating nav bar's interior states. Not for decoration.

### Inputs / Fields
- **Form Input** (`@utility form-input`): `--input-bg` (4% white in dark / 92% white in light), 1px border in `--input-border`, primary text color. Focus shifts border to `--amber` and emits a `0 0 0 3px rgba(245,158,11,0.15)` ring; outline is removed in favor of the ring. Transitions border and box-shadow at 200ms, no other properties.

### Navigation
- **Floating Glass Nav Bar**: fixed top, with side margins (`top: 1rem; left: 1rem; right: 1rem`), `max-width: 72rem`. Background `rgba(12,12,24,0.82)`, `backdrop-filter: blur(14px) saturate(1.08)`, 1px border at 9% primary-tint, `border-radius: 1.125rem` (18px), ambient shadow tinted with the page background. Slides up `top: 0.5rem` on scroll. Desktop links visible from `1024px`, mobile actions hide at the same breakpoint. Light mode swaps the surface to 94% surface-tint and uses a cool neutral shadow.

### Signature Component: SectionHeader
The structural rhythm of every long section: `[mono number] [Archivo Black h2] [horizontal rule fading from amber/violet 30% to transparent]`. The mono number, the h2, and the fade line live on a single flex row with `gap-4` and a `mb-16` separator below. Two accent colors (amber default, violet alternate). This is the single non-negotiable layout pattern: every primary section uses it, identically, for visual rhythm.

### Signature Component: Hero Photo Frame
A 16:10 framed photo on mobile (max-height `14rem`) and an `8rem × 8rem` square on tablet, both with 1rem corner radius, 1px amber-tinted border (18–22% amber), and the system's only resting warm shadow. The image is positioned `object-cover object-[50%_20%]` to keep the face at the top third. Desktop uses a separate `PhotoCard` component, not this frame.

## 6. Do's and Don'ts

### Do:
- **Do** keep Workbench Amber under 10% of any screen. The accent is rare on purpose.
- **Do** use the numbered + mono section header on every primary section. The rhythm is the brand.
- **Do** use warm amber-tinted shadows for state changes. Cool grey shadows look generic.
- **Do** lift cards by `-6px` and buttons by `-2px` on hover. Same easing (`cubic-bezier(0.25, 1, 0.5, 1)` or `ease 0.25s`). Subtle, consistent.
- **Do** tint every neutral. Graphite Black (`#080810`) for backgrounds, Text Primary Dark (`#F8FAFC`) for foreground. Never `#000` or `#fff`.
- **Do** name shipped systems by their actual name in copy (Saferpay, Onfido KYC, Section 508, App Store). PRODUCT.md principle "Concrete over abstract" is a visual responsibility too: long, real names need room.
- **Do** keep transitions ≤300ms and respect `prefers-reduced-motion`. The global rule is already enforced; new motion must keep the contract.
- **Do** pair amber text with darker amber (`#B45309`, `#92400E`) in light mode for WCAG AA contrast.
- **Do** give app icons, proof logos, inline external/private link logos, and store-button icons enough contrast on warm-white light surfaces using tokenized color, filter, background, or border rules.
- **Do** keep body line length under 34rem max-width. Tagline 34rem, description 32rem.

### Don't:
- **Don't** look or feel like a "generic dev portfolio template": pastel gradients, tilted cards, floating GitHub icons, "Hi I'm X, a passionate developer," identical project tiles in a 3-up grid. PRODUCT.md anti-reference 1.
- **Don't** cosplay a SaaS landing page: the hero-metric template (big number / small label / supporting stats), three-feature icon-card grid, testimonial slider, corner gradient blob. This is a person, not a product company. PRODUCT.md anti-reference 2.
- **Don't** go "crypto / neon-cyber futuristic dev": neon on black, glowing borders, matrix rain, 3D laptop renders, decorative terminal-green. The site is technical, not a hackathon submission. PRODUCT.md anti-reference 3.
- **Don't** project corporate consultant gravitas: stock photos, "enterprise solutions," navy-and-gold, McKinsey-style stiff serif headlines. This is a craftsperson, not a firm. PRODUCT.md anti-reference 4.
- **Don't** add a `border-left` greater than 1px as a colored accent on cards, callouts, or list items. The side-stripe is banned absolutely.
- **Don't** apply `background-clip: text` with a gradient to anything other than the existing brand wordmark gradient (`text-gradient` utility). Gradient text is decorative and forbidden as a default.
- **Don't** sprinkle `glassmorphism` decoratively. The `glass` and `glass-amber` utilities are for nav, menu, and overlay surfaces only.
- **Don't** use a third saturated color alongside amber. Violet/teal/green appear only as semantic roles (alternate section accent, status, success) and never as decoration.
- **Don't** introduce flat type scales. Adjacent roles must differ by ≥1.25× in size or by a weight class.
- **Don't** use em dashes (`—` or `--`) in any copy, ever. Voice rule, enforced in spec.
- **Don't** restate the section heading in the first line of body copy below it. Every word earns its place.
- **Don't** animate CSS layout properties. Use `transform` and `opacity`; never `width`, `height`, `top`, or `padding`.
- **Don't** ease with bounce or elastic curves. Use ease-out exponentials (`cubic-bezier(0.25, 1, 0.5, 1)` is the canonical one in this project).
