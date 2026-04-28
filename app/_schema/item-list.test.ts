import { describe, expect, it } from "vitest";
import { getProjectTitle, type Project } from "@/app/_data/projects/types";
import { buildProjectsItemListSchema } from "./item-list";

function makeProject(overrides: Partial<Project>): Project {
  return {
    id: 1,
    slug: "example-project",
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
  // CONTRACT CHANGE (PR 3): every ListItem.url now points at the per-project
  // slug URL on berliziev.dev, regardless of link.type. The "this person built
  // that live product" signal moved to Article.about.sameAs on the detail
  // page (see app/_schema/case-study.ts).
  const projects: Project[] = [
    makeProject({ id: 1, slug: "alpha", link: { type: "web", url: "https://web.example.com" } }),
    makeProject({
      id: 2,
      slug: "beta",
      link: {
        type: "web+mobile",
        url: "https://wm.example.com",
        appStore: "https://apps.apple.com/app/2",
        playStore: "https://play.google.com/store/apps/details?id=2",
      },
    }),
    makeProject({
      id: 3,
      slug: "gamma",
      link: {
        type: "mobile",
        appStore: "https://apps.apple.com/app/3",
        playStore: "https://play.google.com/store/apps/details?id=3",
      },
    }),
    makeProject({ id: 4, slug: "delta", link: { type: "private" } }),
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

  it("uses the internal /projects/{slug} URL for every project regardless of link.type", () => {
    expect(list[0].url).toBe("https://berliziev.dev/projects/alpha");
    expect(list[1].url).toBe("https://berliziev.dev/projects/beta");
    expect(list[2].url).toBe("https://berliziev.dev/projects/gamma");
    expect(list[3].url).toBe("https://berliziev.dev/projects/delta");
  });
});
