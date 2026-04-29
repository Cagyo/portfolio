import styles from "./HeroLogos.module.css";

type HeroLogo = { name: string };

type HeroLogosProps = {
  label: string;
  logos: HeroLogo[];
};

export function HeroLogos({ label, logos }: HeroLogosProps) {
  if (logos.length === 0) return null;
  return (
    <div className={styles.row}>
      <span className={styles.eyebrow}>{label}</span>
      {logos.map((logo) => (
        <span key={logo.name} className={styles.wordmark}>
          {logo.name}
        </span>
      ))}
    </div>
  );
}
