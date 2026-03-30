import { getTranslations } from "next-intl/server";
import { ArrowRightIcon } from "../../../assets/icons/ArrowRightIcon";
import { EnvelopeIcon } from "../../../assets/icons/EnvelopeIcon";
import { BlobBackground } from "../../_components/BlobBackground";
import { Button } from "../../_components/button/Button";
import { PulseBadge } from "../../_components/PulseBadge";
import { ScrollIndicator } from "../../_components/ScrollIndicator";
import { StatRow } from "../../_components/StatRow";
import { OrbitRings } from "./OrbitRings";
import { ProfileCard } from "./ProfileCard";
import { Typewriter } from "./Typewriter";

export async function HeroSection() {
  const t = await getTranslations("hero");
  const stats = t.raw("stats") as { value: string; label: string }[];
  const typewriterRoles = t.raw("typewriterRoles") as string[];

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-24">
      <BlobBackground size="w-96 h-96" color="bg-amber-500" position="top-20 -left-32" delay="0s" />
      <BlobBackground size="w-80 h-80" color="bg-amber-400" position="bottom-20 -right-24" delay="3s" opacity="0.1" />
      <BlobBackground size="w-64 h-64" color="bg-amber-600" position="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" delay="1.5s" opacity="0.08" />

      <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
        {/* Text */}
        <div className="space-y-8">
          {/* Small mobile: full-width photo */}
          <div
            className="block sm:hidden w-full rounded-2xl relative overflow-hidden"
            style={{ aspectRatio: "4/5", maxHeight: 300, border: "1px solid rgba(245,158,11,0.2)", boxShadow: "0 0 50px rgba(245,158,11,0.12)" }}
          >
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 375" fill="none" preserveAspectRatio="xMidYMid slice">
              <rect width="300" height="375" fill="url(#mobileFullGrad)" />
              <defs>
                <linearGradient id="mobileFullGrad" x1="0" y1="0" x2="300" y2="375" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
              </defs>
              <circle cx="150" cy="120" r="55" fill="#334155" />
              <ellipse cx="150" cy="310" rx="90" ry="70" fill="#334155" />
            </svg>
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white/40 text-xs py-2 text-center font-medium tracking-wide">
              {t("photoAlt")}
            </div>
          </div>

          {/* <PulseBadge>{t("badge")}</PulseBadge> */}

          {/* Name & role */}
          <div className="flex items-center justify-between gap-8">
            <div className="space-y-4">
              <h1 className="font-heading font-black text-5xl sm:text-6xl lg:text-7xl leading-none tracking-tight">
                {t("firstName")}
                <br />
                <span className="text-gradient">{t("lastName")}</span>
              </h1>
              <p className="text-xl sm:text-2xl text-white/60 font-light">
                {t("tagline")} <Typewriter roles={typewriterRoles} />
              </p>
            </div>
            {/* Medium mobile photo */}
            <div className="flex-shrink-0 hidden sm:block lg:hidden">
              <div
                className="w-32 h-32 rounded-2xl relative overflow-hidden border border-amber-500/30"
                style={{ boxShadow: "0 0 36px rgba(245,158,11,0.18)" }}
              >
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 128 128" fill="none">
                  <rect width="128" height="128" fill="url(#mobilePhotoGrad)" />
                  <defs>
                    <linearGradient id="mobilePhotoGrad" x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#1e293b" />
                      <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>
                  </defs>
                  <circle cx="64" cy="44" r="21" fill="#334155" />
                  <ellipse cx="64" cy="104" rx="32" ry="24" fill="#334155" />
                </svg>
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white/40 text-[9px] py-0.5 text-center font-medium tracking-wide">
                  {t("photoAlt")}
                </div>
              </div>
            </div>
          </div>

          <p className="text-white/50 text-lg leading-relaxed max-w-md">
            {t("description")}
          </p>

          <div className="flex flex-wrap gap-4">
            <Button href="#projects" className="px-7 py-3.5 rounded-xl text-base cursor-pointer inline-flex items-center gap-2">
              {t("ctaWork")}
              <ArrowRightIcon className="w-4 h-4" />
            </Button>
            <Button href="#contact" variant="outline" className="px-7 py-3.5 rounded-xl text-base cursor-pointer inline-flex items-center gap-2">
              <EnvelopeIcon className="w-4 h-4" />
              {t("ctaContact")}
            </Button>
          </div>

          <StatRow stats={stats} />
        </div>

        {/* Visual — floating card */}
        <div className="relative hidden lg:flex items-center justify-center">
          {/* <OrbitRings />
          <ProfileCard /> */}
        </div>
      </div>

      <ScrollIndicator />
    </section>
  );
}
