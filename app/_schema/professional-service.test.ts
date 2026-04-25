import { describe, expect, it } from "vitest";
import { buildMentorshipServiceSchema } from "./professional-service";

describe("buildMentorshipServiceSchema", () => {
  const schema = buildMentorshipServiceSchema({
    name: "Mentorship & Courses",
    description: "Production-grade full-stack mentorship.",
  });

  it("declares ProfessionalService with the canonical @id and url", () => {
    expect(schema["@type"]).toBe("ProfessionalService");
    expect(schema["@id"]).toBe("https://berliziev.dev/mentorship#service");
    expect(schema.url).toBe("https://berliziev.dev/mentorship");
  });

  it("references Person as provider via @id", () => {
    expect(schema.provider).toEqual({ "@id": "https://berliziev.dev/#person" });
  });

  it("declares worldwide service area", () => {
    expect(schema.areaServed).toBe("Worldwide");
  });

  it("does not declare hasOfferCatalog (regression guard against fabricated commerce data)", () => {
    expect(schema).not.toHaveProperty("hasOfferCatalog");
    expect(schema).not.toHaveProperty("offers");
  });
});
