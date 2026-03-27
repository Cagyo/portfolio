import { AcademicCapIcon } from "../../assets/icons/AcademicCapIcon";
import { BriefcaseIcon } from "../../assets/icons/BriefcaseIcon";
import { LightBulbIcon } from "../../assets/icons/LightBulbIcon";
import { MapPinIcon } from "../../assets/icons/MapPinIcon";

export function InfoGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 pt-4">
      <div className="glass rounded-xl p-4">
        <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Location</p>
        <p className="text-white font-medium flex items-center gap-2">
          <MapPinIcon className="w-4 h-4 text-amber-500" />
          San Francisco, CA
        </p>
      </div>
      <div className="glass rounded-xl p-4">
        <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Experience</p>
        <p className="text-white font-medium flex items-center gap-2">
          <BriefcaseIcon className="w-4 h-4 text-amber-500" />
          5+ Years
        </p>
      </div>
      <div className="glass rounded-xl p-4">
        <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Education</p>
        <p className="text-white font-medium flex items-center gap-2">
          <AcademicCapIcon className="w-4 h-4 text-amber-500" />
          CS, MIT
        </p>
      </div>
      <div className="glass rounded-xl p-4">
        <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Focus</p>
        <p className="text-white font-medium flex items-center gap-2">
          <LightBulbIcon className="w-4 h-4 text-amber-500" />
          Full-Stack
        </p>
      </div>
    </div>
  );
}
