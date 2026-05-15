import { describe, expect, it } from "vitest";
import { getProjectStackGroups } from "./stack-groups";

describe("getProjectStackGroups", () => {
  it("groups primary stack entries by existing skill category", () => {
    const groups = getProjectStackGroups([
      "GraphQL",
      "NestJS",
      "React",
      "Next.js",
      "TypeScript",
    ]);

    expect(groups.primaryGroups).toEqual([
      {
        category: "Backend",
        entries: [{ name: "GraphQL" }, { name: "NestJS" }],
      },
      {
        category: "Frontend",
        entries: [{ name: "React" }, { name: "Next.js" }],
      },
      {
        category: "Languages",
        entries: [{ name: "TypeScript" }],
      },
    ]);
    expect(groups.secondaryGroups).toEqual([]);
  });

  it("preserves each project's original order inside a category", () => {
    const groups = getProjectStackGroups([
      "GraphQL",
      "Apollo Server",
      "Node.js",
      "NestJS",
    ]);

    expect(groups.primaryGroups).toEqual([
      {
        category: "Backend",
        entries: [
          { name: "GraphQL" },
          { name: "Node.js" },
          { name: "NestJS" },
        ],
      },
    ]);
    expect(groups.secondaryGroups).toEqual([
      {
        category: "Backend",
        entries: [{ name: "Apollo Server" }],
      },
    ]);
  });

  it("falls extra stack entries back to the existing Tools category", () => {
    const groups = getProjectStackGroups([
      "TypeScript",
      { name: "Bull", extra: true },
      "Saferpay",
      "OneSignal",
    ]);

    expect(groups.primaryGroups).toEqual([
      {
        category: "Languages",
        entries: [{ name: "TypeScript" }],
      },
    ]);
    expect(groups.secondaryGroups).toEqual([
      {
        category: "Tools",
        entries: [
          { name: "Bull" },
          { name: "Saferpay" },
          { name: "OneSignal" },
        ],
      },
    ]);
  });
});
