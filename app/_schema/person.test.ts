import { describe, expect, it } from "vitest";
import { siteConfig } from "@/app/_config/site-config";
import { buildPersonSchema } from "./person";

const t = (key: string) => `t:${key}`;

describe("buildPersonSchema", () => {
  const schema = buildPersonSchema(t);

  it("declares Person with the canonical @id", () => {
    expect(schema["@context"]).toBe("https://schema.org");
    expect(schema["@type"]).toBe("Person");
    expect(schema["@id"]).toBe("https://berliziev.dev/#person");
  });

  it("uses author config for name and email", () => {
    expect(schema.name).toBe(siteConfig.author.name);
    expect(schema.email).toBe(siteConfig.author.email);
  });

  it("emits an absolute image URL for the avatar", () => {
    expect(schema.image).toBe("https://berliziev.dev/og/avatar.png");
  });

  it("filters empty social URLs out of sameAs", () => {
    const sameAs = schema.sameAs as string[];
    expect(sameAs).toContain(siteConfig.social.github.url);
    expect(sameAs).toContain(siteConfig.social.linkedin.url);
    expect(sameAs).not.toContain("");
    expect(sameAs.every((url) => url.length > 0)).toBe(true);
  });

  it("sources job title and description from i18n", () => {
    expect(schema.jobTitle).toBe("t:jobTitle");
    expect(schema.description).toBe("t:description");
  });

  it("populates knowsAbout from top-tier skills", () => {
    const knowsAbout = schema.knowsAbout as string[];
    expect(knowsAbout.length).toBeGreaterThan(0);
    expect(knowsAbout).toContain("TypeScript");
  });
});
