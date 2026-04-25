/**
 * Server Component primitive for emitting schema.org JSON-LD.
 *
 * Renders a plain `<script type="application/ld+json">` in the page tree.
 * Google parses JSON-LD from anywhere in the document — no `<head>` injection
 * or `next/script` required (the latter is for executable JS).
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
