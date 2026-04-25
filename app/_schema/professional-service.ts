import { absoluteUrl } from "./absolute-url";

/**
 * schema.org ProfessionalService describing the mentorship offering.
 *
 * Emit ONLY on `/mentorship`. Do NOT re-emit Person/WebSite there —
 * the root layout already covers them.
 *
 * No `hasOfferCatalog` is declared. Pricing/duration are not authoritative
 * commercial values in `siteConfig` or i18n; publishing them from on-page
 * marketing copy risks the "structured data inconsistent with on-page
 * content" manual action. Add the catalog only when real prices land in
 * a dedicated config block.
 */
export function buildMentorshipServiceSchema(args: {
  name: string;
  description: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": absoluteUrl("/mentorship#service"),
    name: args.name,
    description: args.description,
    provider: { "@id": absoluteUrl("/#person") },
    areaServed: "Worldwide",
    url: absoluteUrl("/mentorship"),
  };
}
