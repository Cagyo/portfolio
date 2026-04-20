import { siteConfig } from "./_config/site-config";
import { Nav } from "./_components/nav/Nav";
import { AboutSection } from "./_home/about/AboutSection";
import { ContactSection } from "./_home/contact/ContactSection";
import { EngagementSection } from "./_home/engagement/EngagementSection";
import { FitSection } from "./_home/FitSection";
import { Footer } from "./_home/Footer";
import { HeroSection } from "./_home/hero/HeroSection";
import { MentorshipTeaser } from "./_home/MentorshipTeaser";
import { ProjectsSection } from "./_home/projects/ProjectsSection";
import { RecommendationsSection } from "./_home/recommendations/RecommendationsSection";
import { RevealProvider } from "./_home/RevealProvider";
import { SkillsSection } from "./_home/skills/SkillsSection";

function getSectionComponent(id: string, sectionNumber?: string) {
  switch (id) {
    case 'about':             return <AboutSection sectionNumber={sectionNumber} />
    case 'skills':            return <SkillsSection sectionNumber={sectionNumber} />
    case 'projects':          return <ProjectsSection sectionNumber={sectionNumber} />
    case 'recommendations':   return <RecommendationsSection sectionNumber={sectionNumber} />
    case 'engagement':        return <EngagementSection sectionNumber={sectionNumber} />
    case 'fit':               return <FitSection sectionNumber={sectionNumber} />
    case 'contact':           return <ContactSection sectionNumber={sectionNumber} />
    case 'mentorship-teaser': return <MentorshipTeaser />
    default:                  return null
  }
}

export default function Page() {
  const enabled = siteConfig.sections.filter((section) => section.enabled)
  let numberedCount = 0
  const renderable = enabled.map((section) => {
    const sectionNumber = section.numbered
      ? `${String(++numberedCount).padStart(2, '0')}.`
      : undefined
    return { id: section.id, sectionNumber }
  })

  return (
    <div className="min-h-screen bg-[var(--bg)] font-body text-[var(--text-primary)]">
      <RevealProvider />
      <Nav />
      <HeroSection />
      {renderable.map((section) => (
        <div key={section.id}>{getSectionComponent(section.id, section.sectionNumber)}</div>
      ))}
      <Footer />
    </div>
  );
}
