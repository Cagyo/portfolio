import { getTranslations } from "next-intl/server";
import { AcademicCapIcon } from "../../../assets/icons/AcademicCapIcon";
import { BriefcaseIcon } from "../../../assets/icons/BriefcaseIcon";
import { LightBulbIcon } from "../../../assets/icons/LightBulbIcon";
import { MapPinIcon } from "../../../assets/icons/MapPinIcon";

type InfoCellProps = { label: string; value: string; icon: React.ReactNode }

function InfoCell({ label, value, icon }: InfoCellProps) {
  return (
    <div className="glass rounded-xl p-4">
      <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{label}</p>
      <p className="text-white font-medium flex items-center gap-2">
        {icon}
        {value}
      </p>
    </div>
  )
}

export async function InfoGrid() {
  const t = await getTranslations("about.infoGrid")

  const cells: InfoCellProps[] = [
    { label: t("locationLabel"),   value: t("locationValue"),   icon: <MapPinIcon className="w-4 h-4 text-amber-500" /> },
    { label: t("experienceLabel"), value: t("experienceValue"), icon: <BriefcaseIcon className="w-4 h-4 text-amber-500" /> },
    { label: t("educationLabel"),  value: t("educationValue"),  icon: <AcademicCapIcon className="w-4 h-4 text-amber-500" /> },
    { label: t("focusLabel"),      value: t("focusValue"),      icon: <LightBulbIcon className="w-4 h-4 text-amber-500" /> },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 pt-4">
      {cells.map((cell) => (
        <InfoCell key={cell.label} {...cell} />
      ))}
    </div>
  )
}
