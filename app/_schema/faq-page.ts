import { absoluteUrl } from "./absolute-url";

type FaqPageEntry = {
  question: string;
  answer: string;
  slug: string;
};

export function buildFaqPageSchema(entries: FaqPageEntry[]): Record<string, unknown> | null {
  if (entries.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": absoluteUrl("/faq"),
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      "@id": absoluteUrl(`/faq#${entry.slug}`),
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: "",
      },
    })),
  };
}
