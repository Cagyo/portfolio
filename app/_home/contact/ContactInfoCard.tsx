import styles from "./ContactInfoCard.module.css"

type ContactInfoCardProps = {
  icon: React.ReactNode
  label: string
  value: string
  href?: string
}

export function ContactInfoCard({ icon, label, value, href }: ContactInfoCardProps) {
  const content = (
    <>
      <div className={styles.iconWrap}>
        {icon}
      </div>
      <div className={styles.copy}>
        <p className={styles.label}>{label}</p>
        <p className={styles.value}>{value}</p>
      </div>
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        className={`${styles.card} ${styles.link}`}
      >
        {content}
      </a>
    )
  }

  return (
    <div className={styles.card}>
      {content}
    </div>
  )
}
