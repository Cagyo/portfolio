/**
 * OG image design tokens — mirror of brand values from app/globals.css.
 *
 * Satori (used by next/og) cannot read CSS variables, so we re-declare the
 * subset of brand tokens needed for OG rendering here. Values MUST match
 * the corresponding CSS custom properties in app/globals.css; the unit test
 * in og-template.test.ts asserts each value to catch silent drift.
 *
 * ↔ Cross-reference: app/globals.css :root
 */
export const OG_TOKENS = {
  amber:      '#F59E0B',
  amberLight: '#FBBF24',
  amberDark:  '#D97706',

  bg:          '#080810',
  bgSecondary: '#0c0c18',

  textPrimary:   '#F8FAFC',
  textSecondary: 'rgba(248,250,252,0.70)',
  textMuted:     'rgba(248,250,252,0.50)',

  cardShadow:    '0 20px 60px rgba(245,158,11,0.15)',
  gradientAmber: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #D97706 100%)',
  bgWash:        'linear-gradient(135deg, #080810 0%, #080810 55%, rgba(245,158,11,0.18) 85%, rgba(251,191,36,0.28) 100%)',
} as const
