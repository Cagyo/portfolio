import styles from "./ProfileCard.module.css";
import { Tag } from "../../_components/tag/Tag";

export function ProfileCard() {
  return (
    <div className="animate-float relative z-10">
    <div
      className={`glass-amber rounded-3xl p-6 text-center w-64 ${styles.card}`}
    >
      {/* Photo placeholder */}
      <div className="w-28 h-28 mx-auto rounded-2xl mb-4 shadow-lg relative overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 112 112" fill="none">
          <rect width="112" height="112" fill="url(#photoGrad)" />
          <defs>
            <linearGradient id="photoGrad" x1="0" y1="0" x2="112" y2="112" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>
          <circle cx="56" cy="38" r="18" fill="#334155" />
          <ellipse cx="56" cy="90" rx="28" ry="22" fill="#334155" />
        </svg>
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white/40 text-xs py-1 text-center font-medium tracking-wide">
          Photo
        </div>
      </div>
      <p className="font-heading font-bold text-white text-lg">Oleksii Berliziev</p>
      <div className="flex flex-wrap gap-2 justify-center mt-4">
        <Tag>React</Tag>
        <Tag>Node</Tag>
        <Tag>TypeScript</Tag>
        <Tag>AWS</Tag>
      </div>
    </div>
    </div>
  );
}
