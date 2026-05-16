import { getTranslations } from "next-intl/server";
import { AcademicCapIcon } from "@/assets/icons/AcademicCapIcon";
import { BriefcaseIcon } from "@/assets/icons/BriefcaseIcon";
import { LightBulbIcon } from "@/assets/icons/LightBulbIcon";
import { MapPinIcon } from "@/assets/icons/MapPinIcon";
import styles from "./InfoGrid.module.css";

type InfoCellProps = { label: string; value: string; icon: React.ReactNode }

function InfoCell({ label, value, icon }: InfoCellProps) {
  return (
    <div className={styles.cell}>
      <div className={styles.iconFrame} aria-hidden="true">
        {icon}
      </div>
      <div className={styles.copy}>
        <p className={styles.label}>{label}</p>
        <p className={styles.value}>{value}</p>
      </div>
    </div>
  )
}

export async function InfoGrid() {
  const t = await getTranslations("about.infoGrid")

  const cells: InfoCellProps[] = [
    { label: t("locationLabel"),   value: t("locationValue"),   icon: <MapPinIcon className={styles.icon} /> },
    { label: t("experienceLabel"), value: t("experienceValue"), icon: <BriefcaseIcon className={styles.icon} /> },
    { label: t("educationLabel"),  value: t("educationValue"),  icon: <AcademicCapIcon className={styles.icon} /> },
    { label: t("focusLabel"),      value: t("focusValue"),      icon: <LightBulbIcon className={styles.icon} /> },
  ]

  return (
    <div className={styles.grid}>
      {cells.map((cell) => (
        <InfoCell key={cell.label} {...cell} />
      ))}
    </div>
  )
}
