import { getTranslations } from "next-intl/server";
import { ClockIcon } from "@/assets/icons/ClockIcon";
import { EnvelopeIcon } from "@/assets/icons/EnvelopeIcon";
import { MapPinIcon } from "@/assets/icons/MapPinIcon";
import { ContactInfoCard } from "./ContactInfoCard";
import styles from "./ContactInfo.module.css";

type ContactCard = { icon: React.ReactNode; label: string; value: string; href?: string }

export async function ContactInfo() {
  const t = await getTranslations("contact");

  const cards: ContactCard[] = [
    { icon: <EnvelopeIcon className={styles.icon} />, label: t("emailLabel"),        value: t("emailValue"),        href: `mailto:${t("emailValue")}` },
    { icon: <MapPinIcon   className={styles.icon} />, label: t("locationLabel"),     value: t("locationValue") },
    { icon: <ClockIcon    className={styles.icon} />, label: t("responseTimeLabel"), value: t("responseTimeValue") },
  ]

  return (
    <div className={`lg:col-span-2 reveal order-2 lg:order-1 ${styles.rail}`}>
      <div>
        <div className={styles.status}>
          <span className={styles.statusDot} />
          <span className={styles.statusTitle}>{t("availabilityTitle")}</span>
        </div>
        {t("availabilityBody") && (
          <p className={styles.statusBody}>
            {t("availabilityBody")}
          </p>
        )}
      </div>

      <div className={styles.facts}>
        {cards.map((card) => (
          <ContactInfoCard key={card.label} {...card} />
        ))}
      </div>

      <div className={styles.intro}>
        <h3 className={styles.heading}>
          {t.rich("heading", {
            gradient: (chunks) => <span className={styles.emphasis}>{chunks}</span>,
          })}
        </h3>
        <p className={styles.subheading}>
          {t("subheading")}
        </p>
      </div>
    </div>
  );
}
