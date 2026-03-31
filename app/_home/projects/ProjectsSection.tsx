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
import { SmartphoneIcon } from "../../../assets/icons/SmartphoneIcon";
import { AppStoreLogo } from "../../../assets/logos/AppStoreLogo";
import { GooglePlayLogo } from "../../../assets/logos/GooglePlayLogo";
import { ProjectCard } from "./ProjectCard";

type OverlayType = "live-lg" | "live-stores" | "stores" | "private"

type ProjectMeta = {
  iconPath: string
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
    iconPath: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z",
    imageBg: "bg-gradient-to-br from-red-900/40 via-red-800/20 to-transparent",
    overlayType: "live-stores",
    featured: true,
    badgeLabel: "High-load · no-code page builder · ticket system",
    url: "https://www.omegaeuropeanmasters.com/",
    appStoreUrl: "https://itunes.apple.com/us/app/omega-european-masters/id440218156",
    playStoreUrl: "https://market.android.com/details?id=ch.iomedia.oem2011",
    imageContent: (
      <>
        <div className="w-40 h-40 rounded-full bg-red-500/20 blur-2xl" />
        <div className="absolute w-28 h-28 rounded-full border-2 border-red-500/20 animate-spin-slow" />
        <GolfFlagIcon className="absolute w-20 h-20 text-red-400/70" strokeWidth={1.5} />
      </>
    ),
  },
  {
    // Golf Social Network (Allsquare) — green
    iconPath: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    imageBg: "bg-gradient-to-br from-green-900/30 to-transparent",
    overlayType: "live-stores",
    badgeLabel: "Mature · Legacy",
    url: "https://www.allsquaregolf.com/",
    appStoreUrl: "https://apps.apple.com/lu/app/all-square-golf/id793801635",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.allsquaregolf.rnapp",
    imageContent: (
      <>
        <div className="w-32 h-32 rounded-full bg-green-500/20 blur-2xl" />
        <GolfersIcon className="absolute w-28 h-20 text-green-400/50" />
      </>
    ),
  },
  {
    // Golf Club Booking App (Golfcrans) — emerald
    iconPath: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
    imageBg: "bg-gradient-to-br from-emerald-900/30 to-transparent",
    overlayType: "stores",
    badgeLabel: "Mobile App Lead · payments",
    appStoreUrl: "https://apps.apple.com/us/app/golf-club-crans-sur-sierre/id1382210998",
    playStoreUrl: "https://play.google.com/store/apps/details?id=ch.iomedia.golfcrans",
    imageContent: (
      <>
        <div className="w-32 h-32 rounded-full bg-emerald-500/20 blur-2xl" />
        <SmartphoneIcon className="absolute w-16 h-16 text-emerald-400/60 rotate-6" />
        <GolfFlagIcon className="absolute w-10 h-10 text-emerald-300/70 translate-x-6 -translate-y-4" />
      </>
    ),
  },
  {
    // Currency Exchange App (B-Sharpe) — indigo
    iconPath: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    imageBg: "bg-gradient-to-br from-indigo-900/30 to-transparent",
    overlayType: "stores",
    badgeLabel: "Mobile App Lead · Swiss Fintech",
    appStoreUrl: "https://apps.apple.com/ch/app/b-sharpe-currency-exchange/id1499627995",
    playStoreUrl: "https://play.google.com/store/apps/details?id=com.bsharpe.app",
    imageContent: (
      <div className="flex items-end gap-2 opacity-50">
        <div className="w-6 h-12 bg-indigo-400/70 rounded-t" />
        <div className="w-6 h-20 bg-indigo-300/70 rounded-t" />
        <div className="w-6 h-8 bg-indigo-500/70 rounded-t" />
        <div className="w-6 h-16 bg-indigo-400/70 rounded-t" />
      </div>
    ),
  },
  {
    // On-Demand Car Wash (PinClean) — sky
    iconPath: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z",
    imageBg: "bg-gradient-to-br from-sky-900/30 to-transparent",
    overlayType: "private",
    badgeLabel: "Full stack · Google Maps",
    imageContent: (
      <>
        <div className="w-32 h-32 rounded-full bg-sky-500/20 blur-2xl" />
        <div className="absolute w-20 h-20 rounded-full border border-sky-400/20 animate-pulse" />
        <MapPinIcon className="absolute w-14 h-14 text-sky-400/50" />
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
                badge={{ iconPath: meta.iconPath, label: meta.badgeLabel }}
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
          <a href="/projects" className="btn-outline px-8 py-3.5 rounded-xl text-sm cursor-pointer inline-flex items-center gap-2">
            <ArrowLeftIcon className="w-4 h-4" />
            {t("viewAll")}
          </a>
        </div>
      </div>
    </section>
  );
}

