import { getTranslations } from "next-intl/server";
import { ClockIcon } from "@/assets/icons/ClockIcon";
import { EnvelopeIcon } from "@/assets/icons/EnvelopeIcon";
import { MapPinIcon } from "@/assets/icons/MapPinIcon";
import { ContactInfoCard } from "./ContactInfoCard";

type ContactCard = { icon: React.ReactNode; label: string; value: string; href?: string }

export async function ContactInfo() {
  const t = await getTranslations("contact");

  const cards: ContactCard[] = [
    { icon: <EnvelopeIcon className="w-5 h-5 text-amber-400" />, label: t("emailLabel"),        value: t("emailValue"),        href: `mailto:${t("emailValue")}` },
    { icon: <MapPinIcon   className="w-5 h-5 text-amber-400" />, label: t("locationLabel"),     value: t("locationValue") },
    { icon: <ClockIcon    className="w-5 h-5 text-amber-400" />, label: t("responseTimeLabel"), value: t("responseTimeValue") },
  ]

  return (
    <div className="lg:col-span-2 reveal space-y-8">
      <div>
        <h3 className="font-heading font-black text-3xl text-white mb-4">
          {t.rich("heading", {
            gradient: (chunks) => <span className="text-gradient">{chunks}</span>,
          })}
        </h3>
        <p className="text-white/50 leading-relaxed">
          {t("subheading")}
        </p>
      </div>

      <div className="space-y-4">
        {cards.map((card) => (
          <ContactInfoCard key={card.label} {...card} />
        ))}
      </div>

      <div className="glass-amber rounded-2xl p-5">
        <div className={`flex items-center gap-3 ${t("availabilityBody") ? "mb-3" : ""}`}>
          <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse-slow" />
          <span className="text-amber-400 font-semibold text-sm">{t("availabilityTitle")}</span>
        </div>
        {t("availabilityBody") && (
          <p className="text-white/50 text-sm leading-relaxed">
            {t("availabilityBody")}
          </p>
        )}
      </div>
    </div>
  );
}
