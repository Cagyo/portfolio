"use client";

type BackToTopLinkProps = {
  label: string;
};

export function BackToTopLink({ label }: BackToTopLinkProps) {
  function handleClick() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      className="bg-transparent border-0 p-0 text-white/30 hover:text-amber-400 text-sm transition-colors cursor-pointer"
      onClick={handleClick}
    >
      {label}
    </button>
  );
}