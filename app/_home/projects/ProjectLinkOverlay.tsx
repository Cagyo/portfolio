import { getTranslations } from "next-intl/server";
import { cva } from "class-variance-authority";
import { ExternalLinkIcon } from "@/assets/icons/ExternalLinkIcon";
import { LockIcon } from "@/assets/icons/LockIcon";
import { AppStoreLogo } from "@/assets/logos/AppStoreLogo";
import { GooglePlayLogo } from "@/assets/logos/GooglePlayLogo";
import type { OverlayType, ProjectPageLink } from "@/app/_data/projects/types";

type ProjectLinkOverlayProps = {
  overlayType: OverlayType
  link: ProjectPageLink
  hasBlurredImage?: boolean
}

const overlayControlStyles = cva(
  "glass inline-flex items-center justify-center gap-1.5 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber",
  {
    variants: {
      variant: {
        store:
          "w-36 cursor-pointer rounded-lg px-4 py-1.5 text-xs font-semibold text-foreground-soft hover:text-amber-foreground",
        live:
          "cursor-pointer rounded-xl px-5 py-2.5 text-sm font-semibold text-foreground hover:text-amber-foreground",
        private:
          "cursor-not-allowed select-none rounded-xl px-4 py-2.5 text-sm font-medium text-ghost-foreground",
      },
    },
  }
)

function StoreLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={overlayControlStyles({ variant: "store" })}>
      {icon}
      {label}
    </a>
  )
}

export async function ProjectLinkOverlay({
  overlayType,
  link,
  hasBlurredImage,
}: ProjectLinkOverlayProps) {
  const t = await getTranslations("projects")

  if (overlayType === "private" && hasBlurredImage) {
    return (
      <span className="rounded bg-background/60 px-2 py-0.5 text-[0.625rem] font-medium text-muted-foreground backdrop-blur">
        {t("ndaAnonymized")}
      </span>
    )
  }

  if (overlayType === "private") {
    return (
      <div className="group/tooltip relative">
        <div className={overlayControlStyles({ variant: "private" })}>
          <LockIcon className="w-4 h-4" />
          {t("privateBuild")}
        </div>
        <div className="pointer-events-none absolute top-[-2.5rem] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-border bg-background-elevated px-3 py-1.5 text-xs text-faint-foreground opacity-0 shadow-[var(--card-shadow)] transition-opacity duration-200 group-hover/tooltip:opacity-100">
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
      <a href={link.url} target="_blank" rel="noopener noreferrer" className={overlayControlStyles({ variant: "live" })}>
        <ExternalLinkIcon className="w-4 h-4" />
        {t("viewLive")}
      </a>
    )
  }

  return null
}
