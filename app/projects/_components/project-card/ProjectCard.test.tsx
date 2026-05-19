import type { AnchorHTMLAttributes, ImgHTMLAttributes, ReactNode } from "react"
import { renderWithIntl } from "@/test/helpers/render-with-intl"
import type { Project } from "@/app/_data/projects/types"
import { ProjectCard } from "./ProjectCard"

vi.mock("next/image", () => ({
  default: ({ src, alt, ...props }: ImgHTMLAttributes<HTMLImageElement> & { src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt ?? ""} {...props} />
  ),
}))

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    prefetch,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode; prefetch?: boolean }) => {
    void prefetch

    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  },
}))

const BASE_PROJECT: Project = {
  id: 101,
  slug: "sample-project",
  year: "2026",
  updatedAt: "2026-05-19T12:00:00+03:00",
  link: {
    type: "web",
    url: "https://example.com",
  },
  logo: "/assets/projects/logo/sample.svg",
  stack: ["TypeScript"],
  title: "Sample Project",
  titleGeneric: "Sample Project",
  company: "Sample Company",
  industry: "SaaS",
  productType: "App",
  devTypes: ["Full Stack"],
  role: "Developer",
  skills: "Frontend",
  teamLabel: "1",
  teamDetail: "1 dev",
  scale: "Solo build",
  shapes: ["greenfield"],
  description: "A compact project card test fixture.",
  problem: "A logo needs to keep its authored colors unless overridden.",
  achievements: ["Fallback color behavior is explicit"],
  duties: ["Build UI"],
}

function renderProject(project: Partial<Project> = {}) {
  return renderWithIntl(<ProjectCard project={{ ...BASE_PROJECT, ...project }} />)
}

function getLogo(size: "app" | "inline") {
  const logo = document.querySelector(`[data-project-logo="${size}"]`)
  expect(logo).toBeInTheDocument()
  return logo as HTMLElement
}

describe("ProjectCard project logos", () => {
  it("renders the authored SVG when no icon color is specified", () => {
    renderProject()

    const appLogo = getLogo("app")
    const inlineLogo = getLogo("inline")

    expect(appLogo).not.toHaveAttribute("data-has-dark-icon-color")
    expect(appLogo).not.toHaveAttribute("data-has-light-icon-color")
    expect(appLogo.style.getPropertyValue("--project-icon-mask")).toBe("")
    expect(document.querySelectorAll("img")).toHaveLength(2)
    expect(inlineLogo).not.toHaveAttribute("data-has-dark-icon-color")
  })

  it("emits only dark mode mask variables for a dark icon color", () => {
    renderProject({ iconColor: { dark: "#f8fafc" } })

    const appLogo = getLogo("app")
    const inlineLogo = getLogo("inline")

    expect(appLogo).toHaveAttribute("data-has-dark-icon-color", "true")
    expect(appLogo).not.toHaveAttribute("data-has-light-icon-color")
    expect(appLogo.style.getPropertyValue("--project-icon-color-dark")).toBe("#f8fafc")
    expect(appLogo.style.getPropertyValue("--project-icon-mask")).toBe("url(\"/assets/projects/logo/sample.svg\")")
    expect(inlineLogo).toHaveAttribute("data-has-dark-icon-color", "true")
    expect(document.querySelectorAll("img")).toHaveLength(2)
  })

  it("emits only light mode mask variables for a light icon color", () => {
    renderProject({ iconColor: { light: "#0f172a" } })

    const appLogo = getLogo("app")
    const inlineLogo = getLogo("inline")

    expect(appLogo).not.toHaveAttribute("data-has-dark-icon-color")
    expect(appLogo).toHaveAttribute("data-has-light-icon-color", "true")
    expect(appLogo.style.getPropertyValue("--project-icon-color-light")).toBe("#0f172a")
    expect(appLogo.style.getPropertyValue("--project-icon-mask")).toBe("url(\"/assets/projects/logo/sample.svg\")")
    expect(inlineLogo).toHaveAttribute("data-has-light-icon-color", "true")
    expect(document.querySelectorAll("img")).toHaveLength(2)
  })

  it("emits both dark and light mask variables when both icon colors are provided", () => {
    renderProject({ iconColor: { dark: "#f8fafc", light: "#0f172a" } })

    const appLogo = getLogo("app")
    const inlineLogo = getLogo("inline")

    expect(appLogo).toHaveAttribute("data-has-dark-icon-color", "true")
    expect(appLogo).toHaveAttribute("data-has-light-icon-color", "true")
    expect(appLogo.style.getPropertyValue("--project-icon-color-dark")).toBe("#f8fafc")
    expect(appLogo.style.getPropertyValue("--project-icon-color-light")).toBe("#0f172a")
    expect(appLogo.style.getPropertyValue("--project-icon-mask")).toBe("url(\"/assets/projects/logo/sample.svg\")")
    expect(inlineLogo).toHaveAttribute("data-has-dark-icon-color", "true")
    expect(inlineLogo).toHaveAttribute("data-has-light-icon-color", "true")
  })
})
