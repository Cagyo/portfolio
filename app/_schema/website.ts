import { absoluteUrl } from "./absolute-url";
import type { Translator } from "./person";

/**
 * schema.org WebSite, referencing the Person node by `@id`.
 *
 * Emit ONCE in the root layout. Do NOT re-emit on subpages.
 *
 * No `potentialAction`/`SearchAction` is declared — the site has no search
 * endpoint, and inventing one would mislead crawlers.
 */
export function buildWebSiteSchema(t: Translator): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    url: absoluteUrl(),
    name: t("title"),
    inLanguage: "en",
    author: { "@id": absoluteUrl("/#person") },
  };
}
