import { siteConfig } from "@/app/_config/site-config";

/**
 * Resolve a path against `siteConfig.url`, returning an absolute URL.
 *
 * - Empty path → site root (no trailing slash)
 * - Already-absolute URL (starts with http) → returned untouched
 * - Path without leading `/` → joined with `/`
 *
 * Every `@id`, `url`, `image`, breadcrumb item, and ListItem url in the
 * schema builders must go through this helper. No string concatenation
 * in the builders themselves.
 */
export function absoluteUrl(path = ""): string {
  const base = siteConfig.url.replace(/\/$/, "");
  if (!path || path === "/") return base;
  if (path.startsWith("http")) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
