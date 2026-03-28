export type ProjectPageLink =
  | { type: "web"; url: string }
  | { type: "web+mobile"; url: string; appStore: string; playStore: string }
  | { type: "mobile"; appStore: string; playStore: string }
  | { type: "private" }

export type ProjectData = {
  id: number
  title: string
  company: string
  industry: string
  productType: string
  devTypes: string[]
  role: string
  skills: string
  teamLabel: string
  teamDetail: string
  scale: string
  description: string
  achievements: string[]
  duties: string[]
  stack: string[]
  stackFilters: string[]
  year: string
  link: ProjectPageLink
}

export type FilterGroupConfig = {
  key: string
  label: string
  options: string[]
  match: (project: ProjectData, values: string[]) => boolean
}

export const PROJECTS: ProjectData[] = [
  {
    id: 1,
    title: "Omega European Masters",
    industry: "Sports",
    company: "Allsquare",
    productType: "SaaS",
    devTypes: ["Full Stack"],
    role: "Tech Lead",
    skills: "Full ownership",
    teamLabel: "7–11",
    teamDetail: "2–5 devs · 1–2 QA · 2 BA · 1 PO · 1 PM",
    scale: "Team",
    description:
      "Applications for handling golf tournament and related activities. Includes ticket selling, ticketing system, page building system (customers can tweak the whole system without involving the dev team, unless something unusual is needed), leaderboard, history, and more.",
    achievements: ["Platform handled 5,000+ concurrent users"],
    duties: [
      "Architecture of the platform",
      "Web app development",
      "Mobile application development (during last year completely solo)",
      "Backend development (almost completely solo)",
      "Highload optimization",
      "Deployment infrastructure setup and support",
      "CircleCI builds automation",
      "Code review",
    ],
    stack: ["React Native", "OneSignal", "Next.js", "NestJS", "Apollo Client/Server", "PostgreSQL", "Prisma"],
    stackFilters: ["React Native", "Next.js", "NestJS", "GraphQL"],
    year: "2021–2024",
    link: { type: "web+mobile", url: "https://omegaeuropeanmasters.com", appStore: "https://apps.apple.com", playStore: "https://play.google.com" },
  },
  {
    id: 2,
    title: "Golfcrans",
    industry: "Sports",
    company: "Avocado Technologies",
    productType: "SaaS",
    devTypes: ["Mobile"],
    role: "Mobile Lead",
    skills: "Mobile app development",
    teamLabel: "8",
    teamDetail: "2 mobile devs · 1 backend · 1–2 QA · 2 BA · 1 PM",
    scale: "Team",
    description:
      "Golf-club application with booking features and integrated payments. Built from the ground up with a focus on performance and offline reliability.",
    achievements: ["Platform handled 5,000+ concurrent users"],
    duties: [
      "Mobile app architecture",
      "Mobile app development",
      "Code review",
    ],
    stack: ["React Native", "React Query", "REST APIs", "TypeScript"],
    stackFilters: ["React Native"],
    year: "2020–2021",
    link: { type: "mobile", appStore: "https://apps.apple.com", playStore: "https://play.google.com" },
  },
  {
    id: 3,
    title: "Fintech Trading Dashboard",
    industry: "Fintech",
    company: "Confidential",
    productType: "SaaS",
    devTypes: ["Full Stack"],
    role: "Tech Lead",
    skills: "Full ownership",
    teamLabel: "6",
    teamDetail: "2 devs · 1 QA · 1 BA · 1 PO · 1 PM",
    scale: "Team",
    description:
      "Real-time trading analytics platform with live market data feeds, portfolio tracking, and compliance reporting. Built for institutional clients under strict regulatory requirements.",
    achievements: ["Sub-200ms data refresh across 50k+ data points"],
    duties: [
      "System architecture and technical decisions",
      "Real-time WebSocket data pipeline",
      "Frontend dashboard development",
      "Compliance reporting module",
      "Performance optimisation",
      "Code review and team mentoring",
    ],
    stack: ["Next.js", "NestJS", "PostgreSQL", "Redis", "TypeScript", "WebSocket"],
    stackFilters: ["NestJS", "Next.js"],
    year: "2022–2023",
    link: { type: "private" },
  },
];

export const FILTER_GROUPS: FilterGroupConfig[] = [
  {
    key: "devTypes",
    label: "Type",
    options: ["Mobile", "Full Stack", "Web", "Backend"],
    match: (p, values) => values.some((v) => p.devTypes.includes(v)),
  },
  {
    key: "role",
    label: "Role",
    options: ["Developer", "Mobile Lead", "Full-Stack Lead", "Tech Lead"],
    match: (p, values) => values.includes(p.role),
  },
  {
    key: "industry",
    label: "Industry",
    options: ["Fintech", "Sports", "On-demand", "Gov", "Social"],
    match: (p, values) => values.includes(p.industry),
  },
  {
    key: "scale",
    label: "Scale",
    options: ["Solo build", "Team"],
    match: (p, values) => values.includes(p.scale),
  },
  {
    key: "stackFilters",
    label: "Stack",
    options: ["React Native", "NestJS", "Next.js", "GraphQL", "AWS"],
    match: (p, values) => values.some((v) => p.stackFilters.includes(v)),
  },
  {
    key: "company",
    label: "Company",
    options: ["Solo", "Avocado Technologies", "Allsquare", "Confidential"],
    match: (p, values) => values.includes(p.company),
  },
];
