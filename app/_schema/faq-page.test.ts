import { describe, expect, it } from "vitest";
import { buildFaqPageSchema } from "./faq-page";

describe("buildFaqPageSchema", () => {
  it("returns null for empty input", () => {
    expect(buildFaqPageSchema([])).toBeNull();
  });

  it("declares FAQPage with matching mainEntity length", () => {
    const schema = buildFaqPageSchema([
      {
        question: "Can you help with an MVP?",
        answer: "Yes.",
        slug: "can-you-help-with-an-mvp",
      },
      {
        question: "Who owns the code?",
        answer: "You do.",
        slug: "who-owns-the-code",
      },
    ]);

    expect(schema?.["@context"]).toBe("https://schema.org");
    expect(schema?.["@type"]).toBe("FAQPage");
    expect(schema?.["@id"]).toBe("https://berliziev.dev/faq");
    expect(schema?.mainEntity).toHaveLength(15);
  });
});
