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

export default function Page() {
  return (
    <div className="min-h-screen bg-[var(--bg)] font-body text-[var(--text-primary)]">
      <RevealProvider />
      <Nav />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <RecommendationsSection />
      <EngagementSection />
      <FitSection />
      <ContactSection />
      <MentorshipTeaser />
      <Footer />
    </div>
  );
}
