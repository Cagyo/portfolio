import { absoluteUrl } from "./absolute-url";

export type BreadcrumbItem = { name: string; path: string };

/**
 * schema.org BreadcrumbList. Emit per route alongside the route's
 * page-specific schema (e.g. ItemList, ProfessionalService).
 */
export function buildBreadcrumbSchema(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
