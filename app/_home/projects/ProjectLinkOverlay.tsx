import { getTranslations } from "next-intl/server";
import { ExternalLinkIcon } from "@/assets/icons/ExternalLinkIcon";
import { LockIcon } from "@/assets/icons/LockIcon";
import { AppStoreLogo } from "@/assets/logos/AppStoreLogo";
import { GooglePlayLogo } from "@/assets/logos/GooglePlayLogo";
import type { OverlayType, ProjectPageLink } from "@/app/_data/projects/types";
import styles from "./ProjectLinkOverlay.module.css";

type ProjectLinkOverlayProps = {
  overlayType: OverlayType
  link: ProjectPageLink
  hasBlurredImage?: boolean
}

function StoreLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
       className={`glass ${styles.storeLink}`}>
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
      <span className={styles.privateAnonymized}>
        {t("ndaAnonymized")}
      </span>
    )
  }

  if (overlayType === "private") {
    return (
      <div className={styles.privateWrap}>
        <div className={`glass ${styles.privateStub}`}>
          <LockIcon className="w-4 h-4" />
          {t("privateBuild")}
        </div>
        <div className={styles.privateTooltip}>
          {t("nda")}
        </div>
      </div>
    )
  }

  if (overlayType === "stores" && link.type === "mobile") {
    return (
      <div className={styles.linkStack}>
        <StoreLink href={link.appStore} icon={<AppStoreLogo className="w-3.5 h-3.5 flex-shrink-0" />} label={t("appStore")} />
        <StoreLink href={link.playStore} icon={<GooglePlayLogo className="w-3.5 h-3.5 flex-shrink-0" />} label={t("googlePlay")} />
      </div>
    )
  }

  if (overlayType === "live-stores" && link.type === "web+mobile") {
    return (
      <div className={styles.linkStack}>
        <StoreLink href={link.url} icon={<ExternalLinkIcon className="w-3.5 h-3.5 flex-shrink-0" />} label={t("viewLive")} />
        <StoreLink href={link.appStore} icon={<AppStoreLogo className="w-3.5 h-3.5 flex-shrink-0" />} label={t("appStore")} />
        <StoreLink href={link.playStore} icon={<GooglePlayLogo className="w-3.5 h-3.5 flex-shrink-0" />} label={t("googlePlay")} />
      </div>
    )
  }

  // live-lg
  if (link.type === "web" || link.type === "web+mobile") {
    return (
      <a href={link.url} target="_blank" rel="noopener noreferrer" className={`glass ${styles.liveLink}`}>
        <ExternalLinkIcon className="w-4 h-4" />
        {t("viewLive")}
      </a>
    )
  }

  return null
}
