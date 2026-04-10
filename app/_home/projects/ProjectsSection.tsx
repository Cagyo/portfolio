import { getTranslations } from "next-intl/server";
import { PROJECTS, getProjectTitle } from "../../_data/projects-data";
import { BlobBackground } from "../../_components/BlobBackground";
import { SectionHeader } from "../../_components/SectionHeader";
import { ArrowLeftIcon } from "../../../assets/icons/ArrowLeftIcon";
import { ExternalLinkIcon } from "../../../assets/icons/ExternalLinkIcon";
import { LockIcon } from "../../../assets/icons/LockIcon";
import { GolfFlagIcon } from "../../../assets/icons/GolfFlagIcon";
import { GolfersIcon } from "../../../assets/icons/GolfersIcon";
import { MapPinIcon } from "../../../assets/icons/MapPinIcon";
import { SmartphoneWithFlagIcon } from "../../../assets/icons/SmartphoneWithFlagIcon";
import { MoneyExchangeIcon } from "../../../assets/icons/MoneyExchangeIcon";
import { AppStoreLogo } from "../../../assets/logos/AppStoreLogo";
import { GooglePlayLogo } from "../../../assets/logos/GooglePlayLogo";
import { Button } from "../../_components/button/Button";
import { ProjectCard } from "./ProjectCard";
import { GolfTournamentIcon } from "../../../assets/icons/GolfTournamentIcon";
import { GolfSocialIcon } from "../../../assets/icons/GolfSocialIcon";
import { GolfBookingIcon } from "../../../assets/icons/GolfBookingIcon";
import { CurrencyExchangeIcon } from "../../../assets/icons/CurrencyExchangeIcon";
import { CarWashIcon } from "../../../assets/icons/CarWashIcon";

type OverlayType = "live-lg" | "live-stores" | "stores" | "private"

type ProjectMeta = {
  icon: React.ReactNode
  imageBg: string
  overlayType: OverlayType
  imageContent: React.ReactNode
  badgeLabel: string
  url?: string
  appStoreUrl?: string
  playStoreUrl?: string
  featured?: boolean
}

// Projects to feature on the home page, in display order (ids from projects-data.json)
const HOME_PROJECT_IDS = [1, 2, 3, 6, 4]

const PROJECT_META: ProjectMeta[] = [
  {
    // Golf Tournament Platform (OEM) — red
    icon: <GolfTournamentIcon className="w-3.5 h-3.5 text-amber-500" />,
    imageBg: "bg-gradient-to-br from-red-900/40 via-red-800/20 to-transparent",
    overlayType: "live-stores",
    featured: true,
    badgeLabel: "High-load · no-code page builder · ticket system",
    url: "https://www.omegaeuropeanmasters.com/",
    appStoreUrl: "https://itunes.apple.com/us/app/omega-european-masters/id440218156",
    playStoreUrl: "https://market.android.com/details?id=ch.iomedia.oem2011",
    imageContent: (
      <>
        <div className="w-44 h-44 rounded-full bg-red-500/15 blur-3xl" />
        <GolfFlagIcon className="absolute w-20 h-20 text-red-400" strokeWidth={1.5} fillOpacity={0.3} />
      </>
    ),
  },
  {
    // Golf Social Network (Allsquare) — green
    icon: <GolfSocialIcon className="w-3.5 h-3.5 text-amber-500" />,
    imageBg: "bg-gradient-to-br from-green-900/30 to-transparent",
    overlayType: "live-stores",
    badgeLabel: "Mature · Legacy",
    url: "https://www.allsquaregolf.com/",
    appStoreUrl: "https://apps.apple.com/lu/app/all-square-golf/id793801635",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.allsquaregolf.rnapp",
    imageContent: (
      <>
        <div className="w-44 h-44 rounded-full bg-green-500/15 blur-3xl" />
        <GolfersIcon className="absolute w-32 h-24 text-green-400/60" />
      </>
    ),
  },
  {
    // Golf Club Booking App (Golfcrans) — emerald
    icon: <GolfBookingIcon className="w-3.5 h-3.5 text-amber-500" />,
    imageBg: "bg-gradient-to-br from-emerald-900/30 to-transparent",
    overlayType: "stores",
    badgeLabel: "Mobile App Lead · payments",
    appStoreUrl: "https://apps.apple.com/us/app/golf-club-crans-sur-sierre/id1382210998",
    playStoreUrl: "https://play.google.com/store/apps/details?id=ch.iomedia.golfcrans",
    imageContent: (
      <>
        <div className="w-44 h-44 rounded-full bg-emerald-500/15 blur-3xl" />
        <SmartphoneWithFlagIcon className="absolute w-20 h-20 text-emerald-400/60 rotate-12" strokeWidth={1.5} />
      </>
    ),
  },
  {
    // Currency Exchange App (B-Sharpe) — indigo
    icon: <CurrencyExchangeIcon className="w-3.5 h-3.5 text-amber-500" />,
    imageBg: "bg-gradient-to-br from-indigo-900/30 to-transparent",
    overlayType: "stores",
    badgeLabel: "Mobile App Lead · Swiss Fintech",
    appStoreUrl: "https://apps.apple.com/ch/app/b-sharpe-currency-exchange/id1499627995",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.bsharpe.app",
    imageContent: (
      <>
        <div className="w-44 h-44 rounded-full bg-indigo-500/15 blur-3xl" />
        <MoneyExchangeIcon className="absolute w-16 h-16 text-indigo-400/65" strokeWidth={1.5} />
      </>
    ),
  },
  {
    // On-Demand Car Wash (PinClean) — sky
    icon: <CarWashIcon className="w-3.5 h-3.5 text-amber-500" />,
    imageBg: "bg-gradient-to-br from-sky-900/30 to-transparent",
    overlayType: "private",
    badgeLabel: "Full stack · Google Maps",
    imageContent: (
      <>
        <div className="w-44 h-44 rounded-full bg-sky-500/15 blur-3xl" />
        <MapPinIcon className="absolute w-16 h-16 text-sky-400/70" />
      </>
    ),
  },
]

export async function ProjectsSection() {
  const t = await getTranslations("projects");

  const projects = HOME_PROJECT_IDS.map((id) => PROJECTS.find((project) => project.id === id)!)

  const privateOverlay = (
    <div className="relative group/stub">
      <div className="glass px-4 py-2.5 rounded-xl text-sm font-medium text-white/30 cursor-not-allowed flex items-center gap-2 select-none">
        <LockIcon className="w-4 h-4" />
        {t("privateBuild")}
      </div>
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-900 border border-white/10 text-white/50 text-xs rounded-lg px-3 py-1.5 whitespace-nowrap opacity-0 group-hover/stub:opacity-100 transition-opacity duration-200 pointer-events-none">
        {t("nda")}
      </div>
    </div>
  );

  return (
    <section id="projects" className="py-16 relative overflow-hidden">
      <BlobBackground size="w-96 h-96" color="bg-amber-500" position="top-0 right-0" opacity="0.1" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader number={t("sectionNumber")} title={t("sectionTitle")} />
        <p className="reveal text-white/50 mb-16 max-w-xl">
          {t("subtitle")}
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => {
            const meta = PROJECT_META[i];

            let linkOverlay: React.ReactNode;

            if (meta.overlayType === "private") {
              linkOverlay = privateOverlay;
            } else if (meta.overlayType === "stores") {
              linkOverlay = (
                <div className="flex flex-col items-center justify-center gap-2">
                  <a href={meta.appStoreUrl} target="_blank" rel="noopener noreferrer" className="glass px-4 py-1.5 rounded-lg text-xs font-semibold text-white/80 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5 w-36 justify-center">
                    <AppStoreLogo className="w-3.5 h-3.5 flex-shrink-0" />
                    {t("appStore")}
                  </a>
                  <a href={meta.playStoreUrl} target="_blank" rel="noopener noreferrer" className="glass px-4 py-1.5 rounded-lg text-xs font-semibold text-white/80 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5 w-36 justify-center">
                    <GooglePlayLogo className="w-3.5 h-3.5 flex-shrink-0" />
                    {t("googlePlay")}
                  </a>
                </div>
              );
            } else if (meta.overlayType === "live-stores") {
              linkOverlay = (
                <div className="flex flex-col items-center justify-center gap-2">
                  <a href={meta.url} target="_blank" rel="noopener noreferrer" className="glass px-4 py-1.5 rounded-lg text-xs font-semibold text-white/80 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5 w-36 justify-center">
                    <ExternalLinkIcon className="w-3.5 h-3.5 flex-shrink-0" />
                    {t("viewLive")}
                  </a>
                  <a href={meta.appStoreUrl} target="_blank" rel="noopener noreferrer" className="glass px-4 py-1.5 rounded-lg text-xs font-semibold text-white/80 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5 w-36 justify-center">
                    <AppStoreLogo className="w-3.5 h-3.5 flex-shrink-0" />
                    {t("appStore")}
                  </a>
                  <a href={meta.playStoreUrl} target="_blank" rel="noopener noreferrer" className="glass px-4 py-1.5 rounded-lg text-xs font-semibold text-white/80 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5 w-36 justify-center">
                    <GooglePlayLogo className="w-3.5 h-3.5 flex-shrink-0" />
                    {t("googlePlay")}
                  </a>
                </div>
              );
            } else {
              // live-lg (fallback)
              linkOverlay = (
                <a href={meta.url} target="_blank" rel="noopener noreferrer" className="glass px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-2">
                  <ExternalLinkIcon className="w-4 h-4" />
                  {t("viewLive")}
                </a>
              );
            }

            return (
              <ProjectCard
                key={project.id}
                title={getProjectTitle(project)}
                description={project.description}
                meta={{ category: project.industry, role: project.role, year: project.year }}
                badge={{ icon: meta.icon, label: meta.badgeLabel }}
                tags={project.stackFilters}
                imageBg={meta.imageBg}
                imageContent={meta.imageContent}
                linkOverlay={linkOverlay}
                featured={meta.featured}
              />
            );
          })}
        </div>

        <div className="text-center mt-12 reveal">
          <Button href="/projects" variant="outline" className="px-8 py-3.5 rounded-xl text-sm gap-2">
            <ArrowLeftIcon className="w-4 h-4" />
            {t("viewAll")}
          </Button>
        </div>
      </div>
    </section>
  );
}

