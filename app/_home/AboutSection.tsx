import { FigmaLogo } from "../../assets/logos/FigmaLogo";
import { StripeLogo } from "../../assets/logos/StripeLogo";
import { VercelLogo } from "../../assets/logos/VercelLogo";
import { BlobBackground } from "../_components/BlobBackground";
import { SectionHeader } from "../_components/SectionHeader";
import { BusinessImpact } from "./BusinessImpact";
import { ExperienceCard } from "./ExperienceCard";
import { InfoGrid } from "./InfoGrid";
import { SocialLinks } from "./SocialLinks";

const STRIPE_LOGO = (
  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#635BFF" }}>
    <StripeLogo className="w-5 h-5" />
  </div>
);

const VERCEL_LOGO = (
  <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-black border border-white/10">
    <VercelLogo className="w-4 h-4" />
  </div>
);

const FIGMA_LOGO = (
  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#1e1e1e", border: "1px solid rgba(255,255,255,0.1)" }}>
    <FigmaLogo className="w-5 h-5" />
  </div>
);

export function AboutSection() {
  return (
    <section id="about" className="py-16 relative overflow-hidden">
      <BlobBackground size="w-96 h-96" color="bg-amber-500" position="-top-32 -right-32" opacity="0.1" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader number="01." title="About Me" />

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Text content */}
          <div className="lg:col-span-3 reveal space-y-6">
            <p className="text-white/70 text-lg leading-relaxed">
              I&apos;m a passionate full-stack developer with{" "}
              <span className="text-amber-400 font-semibold">5+ years of experience</span> building scalable web
              applications. I specialize in React, Node.js, and cloud infrastructure — creating products that users love.
            </p>
            <p className="text-white/60 leading-relaxed">
              My approach combines clean code with thoughtful UX. I believe great software isn&apos;t just functional —
              it should feel intuitive and delightful. From startups to enterprise, I&apos;ve helped teams ship products
              that make an impact.
            </p>
            <p className="text-white/60 leading-relaxed">
              When I&apos;m not coding, you&apos;ll find me exploring open-source projects, writing technical articles,
              or mentoring junior developers in the community.
            </p>
            <InfoGrid />
            <SocialLinks />
          </div>

          {/* Timeline */}
          <div className="lg:col-span-2 reveal space-y-4" style={{ transitionDelay: "0.15s" }}>
            <h3 className="text-white/40 text-xs uppercase tracking-widest mb-6">Experience</h3>
            <ExperienceCard
              title="Senior Full-Stack Engineer"
              company="Stripe"
              period="2022 – Now"
              description="Led development of payment dashboard serving 10M+ merchants. Reduced load time by 60%."
              tags={["React", "Node.js", "AWS"]}
              logo={STRIPE_LOGO}
            />
            <ExperienceCard
              title="Full-Stack Developer"
              company="Vercel"
              period="2020 – 2022"
              description="Built Next.js deployment infrastructure and contributed to open-source tooling used by 1M+ devs."
              tags={["Next.js", "TypeScript", "Docker"]}
              logo={VERCEL_LOGO}
              accentOpacity="0.6"
            />
            <ExperienceCard
              title="Frontend Engineer"
              company="Figma"
              period="2019 – 2020"
              description="Built real-time collaboration features in the core editor. Shipped the Comments redesign."
              tags={["Canvas API", "WebSockets", "Vue"]}
              logo={FIGMA_LOGO}
              accentOpacity="0.3"
            />
          </div>
        </div>

        <BusinessImpact />
      </div>
    </section>
  );
}
