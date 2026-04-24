export type Category = {
  id: number
  label: string
}

export type Skill = {
  name: string
  cat: number
  top?: boolean
  buried?: boolean
}

export const SKILLS = [
  // Core expertise
  { name: "TypeScript", cat: 3, top: true },
  { name: "React Native", cat: 8, top: true },
  { name: "Next.js", cat: 1, top: true },
  { name: "NestJS", cat: 2, top: true },
  { name: "GraphQL", cat: 2, top: true },
  { name: "React", cat: 1,  top: true },
  { name: "AWS", cat: 6, top: true },
  { name: "Stripe", cat: 7, top: true },
  { name: "Vercel", cat: 6, top: true },
  // AI tooling
  { name: "Claude Code", cat: 9 },
  { name: "Cursor", cat: 9 },
  { name: "GitHub Copilot", cat: 9 },
  // Additional skills — sorted by global importance/popularity
  { name: "Node.js", cat: 2 },
  { name: "Expo", cat: 8 },
  { name: "PostgreSQL", cat: 4 },
  { name: "Prisma", cat: 2 },
  { name: "Docker", cat: 5 },
  { name: "Apollo Client", cat: 1 },
  { name: "Apollo Server", cat: 2 },
  { name: "WebSockets", cat: 2 },
  { name: "JavaScript", cat: 3 },
  { name: "Redis", cat: 4 },
  { name: "MongoDB", cat: 4 },
  { name: "REST APIs", cat: 2 },
  { name: "Express", cat: 2 },
  { name: "GitHub Actions", cat: 5 },
  { name: "Tailwind CSS", cat: 1 },
  { name: "Redux", cat: 8 },
  { name: "React Query", cat: 1 },
  { name: "MySQL", cat: 4 },
  { name: "Supabase", cat: 4 },
  { name: "Jest", cat: 7 },
  { name: "Google Cloud", cat: 6 },
  { name: "TypeORM", cat: 2 },
  { name: "Vitest", cat: 7 },
  { name: "Cloudflare", cat: 6 },
  { name: "Onfido", cat: 7 },
  { name: "Saferpay", cat: 7 },
  { name: "Fastlane", cat: 5 },
  { name: "CircleCI", cat: 5 },
  { name: "DigitalOcean", cat: 6 },
  { name: "SQL", cat: 4 },
  { name: "Mongoose", cat: 2 },
  { name: "Kotlin", cat: 3 },
  { name: "Swift", cat: 3 },
  { name: "Material UI", cat: 1 },
  { name: "Google Maps", cat: 7 },
  { name: "MariaDB", cat: 4 },
  { name: "D3.js", cat: 1 },
  { name: "SASS", cat: 1 },
  { name: "CSS Modules", cat: 1 },
  { name: "Web hooks", cat: 2 },
  // Buried — still shown to technical buyers via "Show all", hidden from default founder view
  { name: "Figma", cat: 7, buried: true },
  { name: "Sequelize", cat: 2, buried: true },
  { name: "Detox", cat: 7, buried: true },
  { name: "Nginx", cat: 5, buried: true },
  { name: "Redux-Saga", cat: 8, buried: true },
  { name: "Git", cat: 7, buried: true },
  { name: "OneSignal", cat: 7, buried: true },
  { name: "FCM", cat: 7, buried: true },
  { name: "PM2", cat: 5, buried: true },
  { name: "Typegoose", cat: 2, buried: true },
  { name: "SQLite", cat: 4, buried: true },
  { name: "MJML", cat: 7, buried: true },
  { name: "PDFKit", cat: 7, buried: true },
  { name: "Jira", cat: 7, buried: true },
  { name: "Trello", cat: 7, buried: true },
  { name: "Clickup", cat: 7, buried: true },
  { name: "Mocha", cat: 7, buried: true },
  { name: "Chai", cat: 7, buried: true },
] as const satisfies readonly Skill[];

export type SkillName = (typeof SKILLS)[number]["name"];

const SKILL_NAME_SET: ReadonlySet<string> = new Set(SKILLS.map((skill) => skill.name));

export function isSkillName(value: string): value is SkillName {
  return SKILL_NAME_SET.has(value);
}

/**
 * The subset of skill names that can be used as project filters in the UI.
 * Source of truth for `ProjectBase.stackFilters[]` and `FILTER_GROUPS["stackFilters"].options`.
 * Adding a value here that is not a `SkillName` is a compile error.
 */
export const STACK_FILTER_NAMES = ["React Native", "NestJS", "Next.js", "GraphQL", "AWS", "Stripe", "Saferpay"] as const satisfies readonly SkillName[];

export type StackFilterName = (typeof STACK_FILTER_NAMES)[number];

export const CATEGORIES: Category[] = [
  { id: 0, label: "All" },
  { id: 8, label: "Mobile" },
  { id: 2, label: "Backend" },
  { id: 1, label: "Frontend" },
  { id: 9, label: "AI" },
  { id: 3, label: "Languages" },
  { id: 4, label: "Database" },
  { id: 5, label: "DevOps" },
  { id: 6, label: "Cloud" },
  { id: 7, label: "Tools" },
];
