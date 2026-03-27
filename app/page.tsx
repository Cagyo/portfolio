import { Nav } from "./_components/Nav";
import { AboutSection } from "./_home/AboutSection";
import { ContactSection } from "./_home/ContactSection";
import { EngagementSection } from "./_home/EngagementSection";
import { FitSection } from "./_home/FitSection";
import { Footer } from "./_home/Footer";
import { HeroSection } from "./_home/HeroSection";
import { MentorshipTeaser } from "./_home/MentorshipTeaser";
import { ProjectsSection } from "./_home/ProjectsSection";
import { RecommendationsSection } from "./_home/RecommendationsSection";
import { RevealProvider } from "./_home/RevealProvider";
import { SkillsSection } from "./_home/SkillsSection";

export default function Page() {
  return (
    <div className="min-h-screen bg-[var(--bg)] font-body text-[var(--text-primary)] scroll-smooth">
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
