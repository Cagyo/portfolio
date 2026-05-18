"use client";

type BackToTopLinkProps = {
  label: string;
  className?: string;
};

export function BackToTopLink({ label, className = "" }: BackToTopLinkProps) {
  function handleClick() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      className={className}
      onClick={handleClick}
    >
      {label}
    </button>
  );
}