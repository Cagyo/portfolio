import Link from "next/link";
import type { HeroLogoProject } from "@/app/_data/projects/get-hero-logo-projects";

type HeroLogosProps = {
  label: string;
  logos: HeroLogoProject[];
};

export function HeroLogos({ label, logos }: HeroLogosProps) {
  if (logos.length === 0) return null;
  return (
    <div className="flex flex-col gap-2 pt-2">
      <span className="text-[0.6875rem] font-semibold tracking-[0.18em] pb-2 uppercase text-faint-foreground [html[data-theme=light]_&]:text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-y-3 gap-x-4">
        {logos.map((logo) => (
          <Link
            key={logo.slug}
            href={`/projects/${logo.slug}`}
            className="inline-flex items-center justify-center w-8 h-8 opacity-55 grayscale transition-[opacity,transform,filter] duration-200 ease hover:opacity-95 hover:-translate-y-px [html[data-theme=light]_&]:opacity-[0.72] [html[data-theme=light]_&]:[filter:invert(1)_grayscale(1)] [html[data-theme=light]_&]:hover:opacity-95"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- tiny static logos, next/image's aspect-ratio API fights mixed-aspect uniform square slots */}
            <img src={logo.logo} alt={logo.title} className="w-full h-full object-contain" />
          </Link>
        ))}
      </div>
    </div>
  );
}
