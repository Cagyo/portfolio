"use client";

import { cva } from "class-variance-authority";
import { EmptyFaceIcon } from "@/assets/icons/EmptyFaceIcon";
import { Button } from "@/app/_components/button/Button";

const clearButtonVariants = cva(
  "cursor-pointer border-0 transition-[background,color,transform] duration-200 focus-visible:outline-2 focus-visible:outline-amber focus-visible:outline-offset-[3px] motion-reduce:transition-none",
  {
    variants: {
      variant: {
        primary:
          "min-h-10 px-6 py-2 rounded-xl bg-amber text-[#0D0D0D] text-sm font-bold hover:bg-amber-light hover:-translate-y-px motion-reduce:hover:translate-y-0",
        secondary:
          "min-h-[2.25rem] px-1.5 py-1 rounded-md bg-transparent text-amber-foreground text-xs font-semibold underline underline-offset-[0.2em] hover:bg-amber/10 hover:text-amber-light",
      },
    },
    defaultVariants: { variant: "secondary" },
  }
);

type EmptyStateProps = {
  message: string
  clearLabel: string
  hint?: string
  onClear: () => void
  ctaHref?: string
  ctaLabel?: string
  primaryClear?: boolean
}

export function EmptyState({ message, clearLabel, hint, onClear, ctaHref, ctaLabel, primaryClear = false }: EmptyStateProps) {
  const clearButton = (
    <button
      type="button"
      onClick={onClear}
      className={clearButtonVariants({ variant: primaryClear ? "primary" : "secondary" })}
    >
      {clearLabel}
    </button>
  );

  return (
    <div className="py-16 text-center">
      <EmptyFaceIcon className="w-10 h-10 mx-auto mb-3 text-invisible-foreground" />
      <p className="m-0 text-sm leading-relaxed text-ghost-foreground">{message}</p>
      {hint && <p className="m-0 text-sm leading-relaxed text-invisible-foreground">{hint}</p>}
      <div className="flex flex-col items-center gap-3 mt-6">
        {primaryClear && clearButton}
        {ctaHref && ctaLabel && (
          <Button href={ctaHref} className="px-6 py-2 rounded-xl text-sm">
            {ctaLabel}
          </Button>
        )}
        {!primaryClear && clearButton}
      </div>
    </div>
  );
}
