import { describe, expect, it } from "vitest";
import { buildWebSiteSchema } from "./website";

const t = (key: string) => `t:${key}`;

describe("buildWebSiteSchema", () => {
  const schema = buildWebSiteSchema(t);

  it("declares WebSite with the canonical @id and absolute url", () => {
    expect(schema["@type"]).toBe("WebSite");
    expect(schema["@id"]).toBe("https://berliziev.dev/#website");
    expect(schema.url).toBe("https://berliziev.dev");
  });

  it("references Person by @id without duplicating fields", () => {
    expect(schema.author).toEqual({ "@id": "https://berliziev.dev/#person" });
  });

  it("declares the language and pulls name from i18n", () => {
    expect(schema.inLanguage).toBe("en");
    expect(schema.name).toBe("t:title");
  });

  it("does not declare a potentialAction (no real site search exists)", () => {
    expect(schema).not.toHaveProperty("potentialAction");
  });
});
