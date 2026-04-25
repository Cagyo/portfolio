import { describe, expect, it } from "vitest";
import { getProjectTitle, type Project } from "@/app/_data/projects/types";
import { buildProjectsItemListSchema } from "./item-list";

function makeProject(overrides: Partial<Project>): Project {
  return {
    id: 1,
    year: "2024",
    link: { type: "web", url: "https://example.com" },
    stackFilters: [],
    stack: [],
    title: "Real Title",
    titleGeneric: "Generic Title",
    company: "",
    industry: "",
    productType: "",
    devTypes: [],
    role: "",
    skills: "",
    teamLabel: "",
    teamDetail: "",
    scale: "",
    description: "",
    achievements: [],
    duties: [],
    ...overrides,
  } as Project;
}

describe("buildProjectsItemListSchema", () => {
  const projects: Project[] = [
    makeProject({ id: 1, link: { type: "web", url: "https://web.example.com" } }),
    makeProject({
      id: 2,
      link: {
        type: "web+mobile",
        url: "https://wm.example.com",
        appStore: "https://apps.apple.com/app/2",
        playStore: "https://play.google.com/store/apps/details?id=2",
      },
    }),
    makeProject({
      id: 3,
      link: {
        type: "mobile",
        appStore: "https://apps.apple.com/app/3",
        playStore: "https://play.google.com/store/apps/details?id=3",
      },
    }),
    makeProject({ id: 4, link: { type: "private" } }),
  ];
  const schema = buildProjectsItemListSchema(projects);
  const list = schema.itemListElement as Array<Record<string, unknown>>;

  it("declares ItemList with matching numberOfItems", () => {
    expect(schema["@type"]).toBe("ItemList");
    expect(schema.numberOfItems).toBe(projects.length);
    expect(list).toHaveLength(projects.length);
  });

  it("emits 1-indexed positions", () => {
    list.forEach((entry, index) => {
      expect(entry.position).toBe(index + 1);
    });
  });

  it("aligns each entry name with getProjectTitle (cloaking guard)", () => {
    list.forEach((entry, index) => {
      expect(entry.name).toBe(getProjectTitle(projects[index]));
    });
  });

  it("uses link.url for web and web+mobile projects", () => {
    expect(list[0].url).toBe("https://web.example.com");
    expect(list[1].url).toBe("https://wm.example.com");
  });

  it("uses link.appStore for mobile-only projects", () => {
    expect(list[2].url).toBe("https://apps.apple.com/app/3");
  });

  it("falls back to /projects#project-{id} for private projects", () => {
    expect(list[3].url).toBe("https://berliziev.dev/projects#project-4");
  });
});
