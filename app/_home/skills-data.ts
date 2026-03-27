export type Skill = {
  name: string
  cat: string
  top?: boolean
}

export const SKILLS: Skill[] = [
  // Top 7 (highlighted)
  { name: "TypeScript", cat: "Languages", top: true },
  { name: "React", cat: "Frontend", top: true },
  { name: "Next.js", cat: "Frontend", top: true },
  { name: "Node.js", cat: "Backend", top: true },
  { name: "PostgreSQL", cat: "Database", top: true },
  { name: "Docker", cat: "DevOps", top: true },
  { name: "AWS", cat: "Cloud", top: true },
  // Frontend
  { name: "Vue.js", cat: "Frontend" },
  { name: "Svelte", cat: "Frontend" },
  { name: "Tailwind CSS", cat: "Frontend" },
  { name: "Framer Motion", cat: "Frontend" },
  { name: "Three.js", cat: "Frontend" },
  { name: "CSS / Sass", cat: "Frontend" },
  { name: "Storybook", cat: "Frontend" },
  { name: "Vite", cat: "Frontend" },
  { name: "Webpack", cat: "Frontend" },
  // Backend
  { name: "Express", cat: "Backend" },
  { name: "Fastify", cat: "Backend" },
  { name: "GraphQL", cat: "Backend" },
  { name: "REST APIs", cat: "Backend" },
  { name: "tRPC", cat: "Backend" },
  { name: "WebSockets", cat: "Backend" },
  { name: "Redis", cat: "Backend" },
  { name: "Prisma", cat: "Backend" },
  // Languages
  { name: "JavaScript", cat: "Languages" },
  { name: "Python", cat: "Languages" },
  { name: "Go", cat: "Languages" },
  { name: "Rust", cat: "Languages" },
  { name: "SQL", cat: "Languages" },
  // Database
  { name: "MongoDB", cat: "Database" },
  { name: "MySQL", cat: "Database" },
  { name: "Supabase", cat: "Database" },
  { name: "Drizzle ORM", cat: "Database" },
  { name: "SQLite", cat: "Database" },
  // DevOps
  { name: "Kubernetes", cat: "DevOps" },
  { name: "GitHub Actions", cat: "DevOps" },
  { name: "Terraform", cat: "DevOps" },
  { name: "Nginx", cat: "DevOps" },
  { name: "Linux", cat: "DevOps" },
  { name: "CI/CD", cat: "DevOps" },
  // Cloud
  { name: "GCP", cat: "Cloud" },
  { name: "Vercel", cat: "Cloud" },
  { name: "Cloudflare", cat: "Cloud" },
  { name: "Firebase", cat: "Cloud" },
  // Tools
  { name: "Git", cat: "Tools" },
  { name: "Figma", cat: "Tools" },
  { name: "VS Code", cat: "Tools" },
  { name: "Postman", cat: "Tools" },
  { name: "Linear", cat: "Tools" },
  { name: "Jest", cat: "Tools" },
  { name: "Cursor", cat: "Tools" },
];

export const CATEGORIES = ["All", "Frontend", "Backend", "Languages", "Database", "DevOps", "Cloud", "Tools"] as const;
