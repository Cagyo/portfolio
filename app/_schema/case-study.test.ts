import { describe, expect, it } from "vitest";
import type { Project } from "@/app/_data/projects/types";
import {
  _CASE_STUDY_PERSON_ID,
  _parseStartYear,
  buildCaseStudySchema,
  buildCaseStudyUrls,
} from "./case-study";

function makeProject(overrides: Partial<Project>): Project {
  return {
    id: 1,
    slug: "example",
    year: "2022",
    link: { type: "web", url: "https://example.com" },
    stackFilters: [],
    stack: [],
    title: "Real Title",
    titleGeneric: "Generic Title",
    company: "Co",
    industry: "Sports",
    productType: "SaaS",
    devTypes: ["Full Stack"],
    role: "Developer",
    skills: "",
    teamLabel: "",
    teamDetail: "",
    scale: "Team",
    description: "A description that is long enough to be sliced for the description fallback if no problem is set on the project entry.",
    achievements: [],
    duties: [],
    ...overrides,
  } as Project;
}

const URLS = buildCaseStudyUrls("example");

describe("buildCaseStudySchema", () => {
  it("public web project: about === WebApplication, sameAs includes link.url", () => {
    const project = makeProject({
      link: { type: "web", url: "https://web.example.com" },
    });
    const schema = buildCaseStudySchema({ project, ...URLS });
    const about = schema.about as Record<string, unknown>;
    expect(about["@type"]).toBe("WebApplication");
    expect(about.sameAs).toEqual(["https://web.example.com"]);
    expect(about.operatingSystem).toBe("Web");
  });

  it("public web+mobile project: WebApplication with all three sameAs URLs", () => {
    const project = makeProject({
      link: {
        type: "web+mobile",
        url: "https://wm.example.com",
        appStore: "https://apps.apple.com/app/2",
        playStore: "https://play.google.com/store/apps/details?id=2",
      },
    });
    const schema = buildCaseStudySchema({ project, ...URLS });
    const about = schema.about as Record<string, unknown>;
    expect(about["@type"]).toBe("WebApplication");
    expect(about.sameAs).toEqual([
      "https://wm.example.com",
      "https://apps.apple.com/app/2",
      "https://play.google.com/store/apps/details?id=2",
    ]);
  });

  it("public mobile project: SoftwareApplication, sameAs includes appStore + playStore", () => {
    const project = makeProject({
      devTypes: ["Mobile"],
      link: {
        type: "mobile",
        appStore: "https://apps.apple.com/app/3",
        playStore: "https://play.google.com/store/apps/details?id=3",
      },
    });
    const schema = buildCaseStudySchema({ project, ...URLS });
    const about = schema.about as Record<string, unknown>;
    expect(about["@type"]).toBe("SoftwareApplication");
    expect(about.sameAs).toEqual([
      "https://apps.apple.com/app/3",
      "https://play.google.com/store/apps/details?id=3",
    ]);
    expect(about.operatingSystem).toBe("iOS, Android");
  });

  it("private project: omits the about key entirely (no NDA leak)", () => {
    const project = makeProject({ link: { type: "private" } });
    const schema = buildCaseStudySchema({ project, ...URLS });
    expect(schema.about).toBeUndefined();
    expect("about" in schema).toBe(false);
  });

  it("emits required fields and references Person by @id (never inline)", () => {
    const project = makeProject({});
    const schema = buildCaseStudySchema({ project, ...URLS });
    expect(schema.headline).toBeTruthy();
    expect(schema.datePublished).toBeTruthy();
    expect(schema.image).toBe(URLS.imageUrl);
    expect(schema.mainEntityOfPage).toBe(URLS.pageUrl);
    const author = schema.author as Record<string, unknown>;
    expect(author).toEqual({ "@id": _CASE_STUDY_PERSON_ID });
    expect(author["@type"]).toBeUndefined();
    expect(author.name).toBeUndefined();
  });

  it("uses seoTitle for headline when set, otherwise getProjectTitle output", () => {
    const withOverride = makeProject({ seoTitle: "Custom SEO headline" });
    expect(buildCaseStudySchema({ project: withOverride, ...URLS }).headline).toBe(
      "Custom SEO headline",
    );
    const withoutOverride = makeProject({});
    expect(buildCaseStudySchema({ project: withoutOverride, ...URLS }).headline).toBe(
      "Generic Title",
    );
  });

  it("derives datePublished from the first 4-digit year in project.year", () => {
    const project = makeProject({ year: "2022–2026" });
    expect(buildCaseStudySchema({ project, ...URLS }).datePublished).toBe("2022-01-01");
    expect(_parseStartYear("2015–2017")).toBe(2015);
    expect(_parseStartYear("2024")).toBe(2024);
  });
});

describe("buildCaseStudyUrls", () => {
  it("returns absolute page + image URLs for a slug", () => {
    const urls = buildCaseStudyUrls("omega-european-masters");
    expect(urls.pageUrl).toBe("https://berliziev.dev/projects/omega-european-masters");
    expect(urls.imageUrl).toBe(
      "https://berliziev.dev/projects/omega-european-masters/opengraph-image",
    );
  });
});
