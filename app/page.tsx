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

function getSectionComponent(id: string) {
  switch (id) {
    case 'about':             return <AboutSection />
    case 'skills':            return <SkillsSection />
    case 'projects':          return <ProjectsSection />
    case 'recommendations':   return <RecommendationsSection />
    case 'engagement':        return <EngagementSection />
    case 'fit':               return <FitSection />
    case 'contact':           return <ContactSection />
    case 'mentorship-teaser': return <MentorshipTeaser />
    default:                  return null
  }
}

export default function Page() {
  return (
    <div className="min-h-screen bg-[var(--bg)] font-body text-[var(--text-primary)]">
      <RevealProvider />
      <Nav />
      <HeroSection />
      {siteConfig.sections
        .filter((section) => section.enabled)
        .map((section) => (
          <div key={section.id}>{getSectionComponent(section.id)}</div>
        ))}
      <Footer />
    </div>
  );
}
