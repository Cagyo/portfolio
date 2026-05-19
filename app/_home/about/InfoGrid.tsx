import { getTranslations } from "next-intl/server";
import { AcademicCapIcon } from "@/assets/icons/AcademicCapIcon";
import { BriefcaseIcon } from "@/assets/icons/BriefcaseIcon";
import { LightBulbIcon } from "@/assets/icons/LightBulbIcon";
import { MapPinIcon } from "@/assets/icons/MapPinIcon";

type InfoCellProps = { label: string; value: string; icon: React.ReactNode }

function InfoCell({ label, value, icon }: InfoCellProps) {
  return (
    <div className="grid grid-cols-[auto_1fr] items-center gap-3 min-w-0 p-4 bg-card">
      <div
        className="inline-flex items-center justify-center w-8 h-8 border border-amber/[26%] rounded-[0.625rem] bg-amber/[9%] text-amber-light [html[data-theme=light]_&]:text-amber-dark [html[data-theme=light]_&]:bg-amber/[7%] [html[data-theme=light]_&]:border-[color-mix(in_srgb,var(--amber-dark)_24%,transparent)]"
        aria-hidden="true"
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="m-0 mb-[0.2rem] text-faint-foreground text-[0.6875rem] font-bold tracking-normal uppercase leading-[1.2]">{label}</p>
        <p className="m-0 text-foreground font-[650] leading-[1.3] break-all">{value}</p>
      </div>
    </div>
  )
}

export async function InfoGrid() {
  const t = await getTranslations("about.infoGrid")

  const cells: InfoCellProps[] = [
    { label: t("locationLabel"),   value: t("locationValue"),   icon: <MapPinIcon className="w-4 h-4 flex-shrink-0" /> },
    { label: t("experienceLabel"), value: t("experienceValue"), icon: <BriefcaseIcon className="w-4 h-4 flex-shrink-0" /> },
    { label: t("educationLabel"),  value: t("educationValue"),  icon: <AcademicCapIcon className="w-4 h-4 flex-shrink-0" /> },
    { label: t("focusLabel"),      value: t("focusValue"),      icon: <LightBulbIcon className="w-4 h-4 flex-shrink-0" /> },
  ]

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden border border-border rounded-2xl bg-border max-[540px]:grid-cols-1">
      {cells.map((cell) => (
        <InfoCell key={cell.label} {...cell} />
      ))}
    </div>
  )
}
