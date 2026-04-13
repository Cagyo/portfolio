import { getTranslations } from "next-intl/server";
import { PROJECTS, getProjectTitle } from "../../_data/projects-data";
import { BlobBackground } from "../../_components/BlobBackground";
import { SectionHeader } from "../../_components/SectionHeader";
import { ArrowLeftIcon } from "../../../assets/icons/ArrowLeftIcon";
import { GolfFlagIcon } from "../../../assets/icons/GolfFlagIcon";
import { GolfersIcon } from "../../../assets/icons/GolfersIcon";
import { MapPinIcon } from "../../../assets/icons/MapPinIcon";
import { SmartphoneWithFlagIcon } from "../../../assets/icons/SmartphoneWithFlagIcon";
import { MoneyExchangeIcon } from "../../../assets/icons/MoneyExchangeIcon";
import { Button } from "../../_components/button/Button";
import { ProjectCard } from "./ProjectCard";
import { GolfTournamentIcon } from "../../../assets/icons/GolfTournamentIcon";
import { GolfSocialIcon } from "../../../assets/icons/GolfSocialIcon";
import { GolfBookingIcon } from "../../../assets/icons/GolfBookingIcon";
import { CurrencyExchangeIcon } from "../../../assets/icons/CurrencyExchangeIcon";
import { CarWashIcon } from "../../../assets/icons/CarWashIcon";
import { ProjectLinkOverlay } from "./ProjectLinkOverlay";

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

  return (
    <section id="projects" className="py-16 relative overflow-hidden">
      <BlobBackground size="w-96 h-96" color="bg-amber-500" position="top-0 right-0" opacity={0.1} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader number={t("sectionNumber")} title={t("sectionTitle")} />
        <p className="reveal text-white/50 mb-16 max-w-xl">
          {t("subtitle")}
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => {
            const meta = PROJECT_META[index];

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
                linkOverlay={
                  <ProjectLinkOverlay
                    overlayType={meta.overlayType}
                    url={meta.url}
                    appStoreUrl={meta.appStoreUrl}
                    playStoreUrl={meta.playStoreUrl}
                  />
                }
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

