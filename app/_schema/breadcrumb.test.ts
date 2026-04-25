import { describe, expect, it } from "vitest";
import { buildBreadcrumbSchema } from "./breadcrumb";

describe("buildBreadcrumbSchema", () => {
  const items = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
  ];
  const schema = buildBreadcrumbSchema(items);
  const list = schema.itemListElement as Array<Record<string, unknown>>;

  it("declares BreadcrumbList", () => {
    expect(schema["@type"]).toBe("BreadcrumbList");
  });

  it("matches the input length", () => {
    expect(list).toHaveLength(items.length);
  });

  it("uses 1-indexed positions", () => {
    expect(list[0].position).toBe(1);
    expect(list[1].position).toBe(2);
  });

  it("emits absolute URLs in `item`", () => {
    expect(list[0].item).toBe("https://berliziev.dev");
    expect(list[1].item).toBe("https://berliziev.dev/projects");
  });

  it("preserves item names", () => {
    expect(list[0].name).toBe("Home");
    expect(list[1].name).toBe("Projects");
  });
});
