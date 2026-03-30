import { getTranslations } from "next-intl/server";
import { BlobBackground } from "../../_components/BlobBackground";
import { SectionHeader } from "../../_components/SectionHeader";
import { ArrowLeftIcon } from "../../../assets/icons/ArrowLeftIcon";
import { ExternalLinkIcon } from "../../../assets/icons/ExternalLinkIcon";
import { LayersIcon } from "../../../assets/icons/LayersIcon";
import { LockIcon } from "../../../assets/icons/LockIcon";
import { MonitorIcon } from "../../../assets/icons/MonitorIcon";
import { AppStoreLogo } from "../../../assets/logos/AppStoreLogo";
import { GooglePlayLogo } from "../../../assets/logos/GooglePlayLogo";
import { ProjectCard } from "./ProjectCard";

type ProjectItem = {
  title: string
  description: string
  category: string
  role: string
  year: string
  badgeLabel: string
  tags: string[]
}

type OverlayType = "live-lg" | "live-sm" | "stores" | "private"

const PROJECT_META: { iconPath: string; imageBg: string; overlayType: OverlayType; imageContent: React.ReactNode; featured?: boolean }[] = [
  {
    iconPath: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
    imageBg: "bg-gradient-to-br from-amber-900/40 via-amber-800/20 to-transparent",
    overlayType: "live-lg",
    featured: true,
    imageContent: (
      <>
        <div className="w-40 h-40 rounded-full bg-amber-500/20 blur-2xl" />
        <div className="absolute w-24 h-24 rounded-2xl border-2 border-amber-500/30 rotate-12 group-hover:rotate-6 transition-transform duration-500" />
        <div className="absolute w-16 h-16 rounded-xl bg-amber-500/20 -rotate-6 group-hover:rotate-3 transition-transform duration-500" />
        <LayersIcon className="absolute w-20 h-20 text-amber-500/40" />
      </>
    ),
  },
  {
    iconPath: "",
    imageBg: "bg-gradient-to-br from-purple-900/30 to-transparent",
    overlayType: "live-sm",
    imageContent: (
      <div className="w-20 h-20 rounded-full border-2 border-purple-500/40 animate-spin-slow flex items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-purple-500/20" />
      </div>
    ),
  },
  {
    iconPath: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    imageBg: "bg-gradient-to-br from-green-900/30 to-transparent",
    overlayType: "live-sm",
    imageContent: (
      <div className="grid grid-cols-3 gap-2 opacity-40">
        <div className="w-8 h-8 rounded bg-green-500/60" />
        <div className="w-8 h-12 rounded bg-amber-500/60 -mt-2" />
        <div className="w-8 h-6 rounded bg-green-400/60 mt-1" />
        <div className="w-8 h-10 rounded bg-amber-400/60 -mt-1" />
        <div className="w-8 h-8 rounded bg-green-300/60" />
        <div className="w-8 h-14 rounded bg-amber-300/60 -mt-3" />
      </div>
    ),
  },
  {
    iconPath: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
    imageBg: "bg-gradient-to-br from-rose-900/30 to-transparent",
    overlayType: "stores",
    imageContent: <MonitorIcon className="w-24 h-24 text-rose-400/60" />,
  },
  {
    iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
    imageBg: "bg-gradient-to-br from-cyan-900/30 to-transparent",
    overlayType: "private",
    imageContent: (
      <div className="flex gap-3 opacity-50">
        <div className="w-2 h-16 bg-cyan-400/60 rounded-full animate-pulse" />
        <div className="w-2 h-10 bg-amber-400/60 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
        <div className="w-2 h-20 bg-cyan-300/60 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
        <div className="w-2 h-8 bg-amber-300/60 rounded-full animate-pulse" style={{ animationDelay: "0.6s" }} />
      </div>
    ),
  },
];

export async function ProjectsSection() {
  const t = await getTranslations("projects");
  const items = t.raw("items") as ProjectItem[];

  const viewLiveLg = (
    <a href="#" className="glass px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-2">
      <ExternalLinkIcon className="w-4 h-4" />
      {t("viewLive")}
    </a>
  );

  const viewLiveSm = (
    <a href="#" className="glass px-4 py-2 rounded-xl text-sm font-semibold text-white hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-2">
      <ExternalLinkIcon className="w-3.5 h-3.5" />
      {t("viewLive")}
    </a>
  );

  const storesOverlay = (
    <div className="flex flex-col items-center justify-center gap-2">
      <a href="#" className="glass px-4 py-1.5 rounded-lg text-xs font-semibold text-white/80 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5 w-36 justify-center">
        <AppStoreLogo className="w-3.5 h-3.5 flex-shrink-0" />
        {t("appStore")}
      </a>
      <a href="#" className="glass px-4 py-1.5 rounded-lg text-xs font-semibold text-white/80 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5 w-36 justify-center">
        <GooglePlayLogo className="w-3.5 h-3.5 flex-shrink-0" />
        {t("googlePlay")}
      </a>
    </div>
  );

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

  const overlayMap: Record<OverlayType, React.ReactNode> = {
    "live-lg": viewLiveLg,
    "live-sm": viewLiveSm,
    stores: storesOverlay,
    private: privateOverlay,
  };

  return (
    <section id="projects" className="py-16 relative overflow-hidden">
      <BlobBackground size="w-96 h-96" color="bg-amber-500" position="top-0 right-0" opacity="0.1" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader number={t("sectionNumber")} title={t("sectionTitle")} />
        <p className="reveal text-white/50 mb-16 max-w-xl">
          {t("subtitle")}
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => {
            const meta = PROJECT_META[i];
            return (
              <ProjectCard
                key={item.title}
                title={item.title}
                description={item.description}
                meta={{ category: item.category, role: item.role, year: item.year }}
                badge={{ iconPath: meta.iconPath, label: item.badgeLabel }}
                tags={item.tags}
                imageBg={meta.imageBg}
                imageContent={meta.imageContent}
                linkOverlay={overlayMap[meta.overlayType]}
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

