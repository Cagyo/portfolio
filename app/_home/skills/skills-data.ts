export type Category = {
  id: number
  label: string
}

export type Skill = {
  name: string
  cat: number
  top?: boolean
}

export const SKILLS: Skill[] = [
  // Top 7 (highlighted)
  { name: "TypeScript", cat: 3, top: true },
  { name: "React", cat: 1, top: true },
  { name: "Next.js", cat: 1, top: true },
  { name: "Node.js", cat: 2, top: true },
  { name: "PostgreSQL", cat: 4, top: true },
  { name: "Docker", cat: 5, top: true },
  { name: "AWS", cat: 6, top: true },
  // Frontend
  { name: "Vue.js", cat: 1 },
  { name: "Svelte", cat: 1 },
  { name: "Tailwind CSS", cat: 1 },
  { name: "Framer Motion", cat: 1 },
  { name: "Three.js", cat: 1 },
  { name: "CSS / Sass", cat: 1 },
  { name: "Storybook", cat: 1 },
  { name: "Vite", cat: 1 },
  { name: "Webpack", cat: 1 },
  // Backend
  { name: "Express", cat: 2 },
  { name: "Fastify", cat: 2 },
  { name: "GraphQL", cat: 2 },
  { name: "REST APIs", cat: 2 },
  { name: "tRPC", cat: 2 },
  { name: "WebSockets", cat: 2 },
  { name: "Redis", cat: 2 },
  { name: "Prisma", cat: 2 },
  // Languages
  { name: "JavaScript", cat: 3 },
  { name: "Python", cat: 3 },
  { name: "Go", cat: 3 },
  { name: "Rust", cat: 3 },
  { name: "SQL", cat: 3 },
  // Database
  { name: "MongoDB", cat: 4 },
  { name: "MySQL", cat: 4 },
  { name: "Supabase", cat: 4 },
  { name: "Drizzle ORM", cat: 4 },
  { name: "SQLite", cat: 4 },
  // DevOps
  { name: "Kubernetes", cat: 5 },
  { name: "GitHub Actions", cat: 5 },
  { name: "Terraform", cat: 5 },
  { name: "Nginx", cat: 5 },
  { name: "Linux", cat: 5 },
  { name: "CI/CD", cat: 5 },
  // Cloud
  { name: "GCP", cat: 6 },
  { name: "Vercel", cat: 6 },
  { name: "Cloudflare", cat: 6 },
  { name: "Firebase", cat: 6 },
  // Tools
  { name: "Git", cat: 7 },
  { name: "Figma", cat: 7 },
  { name: "VS Code", cat: 7 },
  { name: "Postman", cat: 7 },
  { name: "Linear", cat: 7 },
  { name: "Jest", cat: 7 },
  { name: "Cursor", cat: 7 },
];

export const CATEGORIES: Category[] = [
  { id: 0, label: "All" },
  { id: 1, label: "Frontend" },
  { id: 2, label: "Backend" },
  { id: 3, label: "Languages" },
  { id: 4, label: "Database" },
  { id: 5, label: "DevOps" },
  { id: 6, label: "Cloud" },
  { id: 7, label: "Tools" },
];
