import { CheckIcon } from "@/assets/icons/CheckIcon";
import { XMarkIcon } from "@/assets/icons/XMarkIcon";

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
      <div className="reveal rounded-2xl p-7 order-1 bg-[color-mix(in_srgb,var(--green)_4%,transparent)] border border-[color-mix(in_srgb,var(--green)_12%,transparent)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-[color-mix(in_srgb,var(--green)_12%,transparent)] border border-[color-mix(in_srgb,var(--green)_20%,transparent)]">
            <CheckIcon className="w-4 h-4 text-green-400" strokeWidth={2.5} />
          </div>
          <h3 className="font-heading font-bold text-foreground text-lg">{goodFitHeading}</h3>
        </div>
        <ul className="space-y-4">
          {goodFit.map((item) => (
            <li key={item.text} className="flex items-start gap-3 text-foreground-soft text-sm leading-relaxed">
              <CheckIcon className="w-4 h-4 text-green-400/60 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
              {item.text}
            </li>
          ))}
        </ul>
      </div>

      {/* Not a fit */}
      <div className="reveal rounded-2xl p-7 order-2 bg-[color-mix(in_srgb,var(--red)_3%,transparent)] border border-[color-mix(in_srgb,var(--red)_10%,transparent)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-[color-mix(in_srgb,var(--red)_10%,transparent)] border border-[color-mix(in_srgb,var(--red)_18%,transparent)]">
            <XMarkIcon className="w-4 h-4 text-red-400" />
          </div>
          <h3 className="font-heading font-bold text-foreground text-lg">{notFitHeading}</h3>
        </div>
        <ul className="space-y-4">
          {notFit.map((item) => (
            <li key={item.text} className="flex items-start gap-3 text-foreground-soft text-sm leading-relaxed">
              <XMarkIcon className="w-4 h-4 text-red-400/60 flex-shrink-0 mt-0.5" />
              {item.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
