import { CheckIcon } from "../../assets/icons/CheckIcon";
import { XMarkIcon } from "../../assets/icons/XMarkIcon";

type FitItem = { text: string }

type FitListProps = {
  goodFit: FitItem[]
  notFit: FitItem[]
  goodFitHeading: string
  notFitHeading: string
}

export function FitList({ goodFit, notFit, goodFitHeading, notFitHeading }: FitListProps) {
  return (
    <div className="grid sm:grid-cols-2 gap-5">
      {/* Good fit */}
      <div
        className="reveal rounded-2xl p-7 order-1"
        style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.12)" }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.2)" }}
          >
            <CheckIcon className="w-4 h-4 text-green-400" strokeWidth={2.5} />
          </div>
          <h3 className="font-heading font-bold text-white text-lg">{goodFitHeading}</h3>
        </div>
        <ul className="space-y-4">
          {goodFit.map((item) => (
            <li key={item.text} className="flex items-start gap-3 text-white/65 text-sm leading-relaxed">
              <CheckIcon className="w-4 h-4 text-green-400/60 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
              {item.text}
            </li>
          ))}
        </ul>
      </div>

      {/* Not a fit */}
      <div
        className="reveal rounded-2xl p-7 order-2"
        style={{ background: "rgba(239,68,68,0.03)", border: "1px solid rgba(239,68,68,0.1)" }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.18)" }}
          >
            <XMarkIcon className="w-4 h-4 text-red-400" />
          </div>
          <h3 className="font-heading font-bold text-white text-lg">{notFitHeading}</h3>
        </div>
        <ul className="space-y-4">
          {notFit.map((item) => (
            <li key={item.text} className="flex items-start gap-3 text-white/65 text-sm leading-relaxed">
              <XMarkIcon className="w-4 h-4 text-red-400/60 flex-shrink-0 mt-0.5" />
              {item.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
