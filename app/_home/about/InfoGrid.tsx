import { getTranslations } from "next-intl/server";
import { AcademicCapIcon } from "../../../assets/icons/AcademicCapIcon";
import { BriefcaseIcon } from "../../../assets/icons/BriefcaseIcon";
import { LightBulbIcon } from "../../../assets/icons/LightBulbIcon";
import { MapPinIcon } from "../../../assets/icons/MapPinIcon";

export async function InfoGrid() {
  const t = await getTranslations("about.infoGrid");

  return (
    <div className="grid grid-cols-2 gap-4 pt-4">
      <div className="glass rounded-xl p-4">
        <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{t("locationLabel")}</p>
        <p className="text-white font-medium flex items-center gap-2">
          <MapPinIcon className="w-4 h-4 text-amber-500" />
          {t("locationValue")}
        </p>
      </div>
      <div className="glass rounded-xl p-4">
        <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{t("experienceLabel")}</p>
        <p className="text-white font-medium flex items-center gap-2">
          <BriefcaseIcon className="w-4 h-4 text-amber-500" />
          {t("experienceValue")}
        </p>
      </div>
      <div className="glass rounded-xl p-4">
        <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{t("educationLabel")}</p>
        <p className="text-white font-medium flex items-center gap-2">
          <AcademicCapIcon className="w-4 h-4 text-amber-500" />
          {t("educationValue")}
        </p>
      </div>
      <div className="glass rounded-xl p-4">
        <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{t("focusLabel")}</p>
        <p className="text-white font-medium flex items-center gap-2">
          <LightBulbIcon className="w-4 h-4 text-amber-500" />
          {t("focusValue")}
        </p>
      </div>
    </div>
  );
}
