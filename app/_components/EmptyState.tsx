"use client";

import { EmptyFaceIcon } from "@/assets/icons/EmptyFaceIcon";
import { Button } from "@/app/_components/button/Button";

type EmptyStateProps = {
  message: string
  clearLabel: string
  hint?: string
  onClear: () => void
  ctaHref?: string
  ctaLabel?: string
}

export function EmptyState({ message, clearLabel, hint, onClear, ctaHref, ctaLabel }: EmptyStateProps) {
  return (
    <div className="py-16 text-center">
      <EmptyFaceIcon className="w-10 h-10 text-white/10 mx-auto mb-3" />
      <p className="text-white/30 text-sm">{message}</p>
      {hint && <p className="text-white/20 text-sm">{hint}</p>}
      <div className="mt-6 flex flex-col items-center gap-3">
        {ctaHref && ctaLabel && (
          <Button href={ctaHref} className="px-6 py-2 rounded-xl text-sm cursor-pointer">
            {ctaLabel}
          </Button>
        )}
        <button
          type="button"
          onClick={onClear}
          className="text-amber-500 text-xs hover:text-amber-400 cursor-pointer underline underline-offset-2"
        >
          {clearLabel}
        </button>
      </div>
    </div>
  );
}
