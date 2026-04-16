import { getTranslations } from "next-intl/server";
import { ExternalLinkIcon } from "../../../assets/icons/ExternalLinkIcon";
import { LockIcon } from "../../../assets/icons/LockIcon";
import { AppStoreLogo } from "../../../assets/logos/AppStoreLogo";
import { GooglePlayLogo } from "../../../assets/logos/GooglePlayLogo";
import type { OverlayType, ProjectPageLink } from "../../_data/projects-data";

type ProjectLinkOverlayProps = {
  overlayType: OverlayType
  link: ProjectPageLink
}

function StoreLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
       className="glass px-4 py-1.5 rounded-lg text-xs font-semibold text-white/80 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5 w-36 justify-center">
      {icon}
      {label}
    </a>
  )
}

export async function ProjectLinkOverlay({
  overlayType,
  link,
}: ProjectLinkOverlayProps) {
  const t = await getTranslations("projects")

  if (overlayType === "private") {
    return (
      <div className="relative group/stub">
        <div className="glass px-4 py-2.5 rounded-xl text-sm font-medium text-white/30 cursor-not-allowed flex items-center gap-2 select-none">
          <LockIcon className="w-4 h-4" />
          {t("privateBuild")}
        </div>
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-zinc-900 border border-white/10 text-white/50 text-xs rounded-lg px-3 py-1.5 whitespace-nowrap opacity-0 group-hover/stub:opacity-100 transition-opacity duration-200 pointer-events-none">
          {t("nda")}
        </div>
      </div>
    )
  }

  if (overlayType === "stores" && link.type === "mobile") {
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        <StoreLink href={link.appStore} icon={<AppStoreLogo className="w-3.5 h-3.5 flex-shrink-0" />} label={t("appStore")} />
        <StoreLink href={link.playStore} icon={<GooglePlayLogo className="w-3.5 h-3.5 flex-shrink-0" />} label={t("googlePlay")} />
      </div>
    )
  }

  if (overlayType === "live-stores" && link.type === "web+mobile") {
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        <StoreLink href={link.url} icon={<ExternalLinkIcon className="w-3.5 h-3.5 flex-shrink-0" />} label={t("viewLive")} />
        <StoreLink href={link.appStore} icon={<AppStoreLogo className="w-3.5 h-3.5 flex-shrink-0" />} label={t("appStore")} />
        <StoreLink href={link.playStore} icon={<GooglePlayLogo className="w-3.5 h-3.5 flex-shrink-0" />} label={t("googlePlay")} />
      </div>
    )
  }

  // live-lg
  if (link.type === "web" || link.type === "web+mobile") {
    return (
      <a href={link.url} target="_blank" rel="noopener noreferrer" className="glass px-5 py-2.5 rounded-xl text-sm font-semibold text-white hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-2">
        <ExternalLinkIcon className="w-4 h-4" />
        {t("viewLive")}
      </a>
    )
  }

  return null
}
