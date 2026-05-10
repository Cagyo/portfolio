import Link from "next/link";
import type { HeroLogoProject } from "@/app/_data/projects/get-hero-logo-projects";
import styles from "./HeroLogos.module.css";

type HeroLogosProps = {
  label: string;
  logos: HeroLogoProject[];
};

export function HeroLogos({ label, logos }: HeroLogosProps) {
  if (logos.length === 0) return null;
  return (
    <div className={styles.wrapper}>
      <span className={styles.eyebrow}>{label}</span>
      <div className={styles.row}>
        {logos.map((logo) => (
          <Link
            key={logo.slug}
            href={`/projects/${logo.slug}`}
            className={styles.logoLink}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- tiny static logos, next/image's aspect-ratio API fights mixed-aspect uniform square slots */}
            <img src={logo.logo} alt={logo.title} className={styles.logoImg} />
          </Link>
        ))}
      </div>
    </div>
  );
}
