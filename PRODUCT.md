# Product

## Register

brand

## Users

Founders evaluating a Fractional CTO / Tech Lead for production work. Two arrival shapes:

1. **Referral or warm intro.** Already heard the name, here to verify craft and fit. Reads case studies, scans recommendations, books a call. High intent, low patience for fluff.
2. **Cold discovery.** Came via search, social, or a community link. Knows they need senior engineering help but is comparing options. Reads the bio, scrolls projects, decides if this person is worth a conversation.

Both audiences are technical enough to recognize hand-waving. Many have already shipped a prototype with Cursor / Claude Code and need someone to take it further; the rest have a working idea and need a senior partner to architect and ship it end-to-end.

**Out of scope for this register:** mentorship students. The `/mentorship` subroute exists in the codebase but is a separate audience and should not drive home-page or top-level design decisions.

## Product Purpose

A personal site that converts qualified founders into a discovery call or a real contact thread.

Success is one of two actions:

- A founder books a discovery call via Calendly.
- A founder starts a contact thread (form, email, Telegram, WhatsApp).

The site exists because the case for hiring a fractional CTO is made by craft, not claims. The work shown and the way it's shown both serve as proof. If a founder reads three sections and doesn't yet feel "this person ships," the site has failed regardless of traffic.

## Brand Personality

**Confident & direct, senior / craft-obsessed, warm / human.**

- **Confident & direct.** Short sentences, concrete nouns, no hedging. "I don't hand off when my part is done." No marketing-speak; no "passionate about." Numbers and named systems instead of adjectives (Saferpay, Onfido KYC, three editions live, Section 508).
- **Senior / craft-obsessed.** Restraint is the seniority signal. Every spacing decision, every type choice, every animation is deliberate. The site signals 10+ years by being calm and precise, not by listing it.
- **Warm / human.** First-person voice, real tone, a person you'd want to work with for years. Not cold, not corporate, not vendor. The reader should finish the page wanting to start a conversation, not request a proposal.

**Voice rules (already in effect, keep them):**

- No em dashes. Use commas, colons, semicolons, periods, or parentheses.
- No restated headings or filler intros that repeat the section title.
- Every word earns its place.

## Anti-references

This site should **not** look or feel like any of:

- **Generic dev portfolio template.** Pastel gradients, tilted cards, floating GitHub icons, "Hi I'm X, a passionate developer," identical project tiles in a 3-up grid.
- **SaaS landing-page cosplay.** The hero-metric template (big number / small label / supporting stats), three-feature icon-card grid, testimonial slider, corner gradient blob. This is a person, not a product company.
- **Crypto / neon-cyber "futuristic dev."** Neon on black, glowing borders, matrix rain, 3D laptop renders, decorative terminal-green. The site is technical, but it is not a hackathon submission.
- **Corporate consultant gravitas.** Stock photos, "enterprise solutions," navy-and-gold, McKinsey-style stiff serif headlines. This is a craftsperson, not a firm.

If a design choice would land in any of these four lanes, rework it.

## Design Principles

1. **Practice what you preach.** The site itself is the strongest evidence that this person ships production-grade work. Every detail must hold up to a senior engineer reading the source. Cut-corners on the portfolio invalidate every claim on the portfolio.

2. **Concrete over abstract.** Show real shipped systems with names (Saferpay, Onfido KYC, no-code page builder, App Store + Play). Never substitute "scalable solutions" or "modern stack" for the actual thing. Specific beats generic every time.

3. **Restraint is the seniority signal.** Anything that visibly tries to impress weakens the case. The amber-on-dark identity, the numbered sections, the type rhythm: these work because they're calm. Bold by precision, not by volume.

4. **Treat the reader as a peer.** Write and design for someone who reads source code for fun. No sales funnels, no FOMO, no "limited spots." The reader is sophisticated; the site respects that.

5. **Invite the long arc, not the transaction.** Tone, copy, and CTAs should feel like the start of a multi-year partnership, not the close of a quarterly contract. "Start a conversation" beats "Book your free strategy session."

## Accessibility & Inclusion

- **Target:** WCAG 2.2 AA across all surfaces. AA contrast for text and meaningful UI in both dark and light themes.
- **Keyboard:** every interactive element reachable and operable by keyboard alone. Visible focus styles.
- **Reduced motion:** `prefers-reduced-motion` respected for any motion added from this point forward.
- **Existing animations are grandfathered.** Do not retrofit reduced-motion gates onto current animations as part of unrelated work; only flag and suggest changes when motion is the explicit subject of the task.
- **Color is not the only carrier of meaning.** The amber accent does heavy work; make sure status, filter, and category distinctions also use shape, label, or position.
