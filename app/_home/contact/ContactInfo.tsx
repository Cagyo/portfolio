import { getTranslations } from "next-intl/server";
import { ClockIcon } from "@/assets/icons/ClockIcon";
import { EnvelopeIcon } from "@/assets/icons/EnvelopeIcon";
import { MapPinIcon } from "@/assets/icons/MapPinIcon";
import { ContactInfoCard } from "./ContactInfoCard";

type ContactCard = { icon: React.ReactNode; label: string; value: string; href?: string }

export async function ContactInfo() {
  const t = await getTranslations("contact");

  const iconClass = "w-4 h-4 text-amber-foreground [html[data-theme=light]_&]:text-[var(--tag-color)]";

  const cards: ContactCard[] = [
    { icon: <EnvelopeIcon className={iconClass} />, label: t("emailLabel"),        value: t("emailValue"),        href: `mailto:${t("emailValue")}` },
    { icon: <MapPinIcon   className={iconClass} />, label: t("locationLabel"),     value: t("locationValue") },
    { icon: <ClockIcon    className={iconClass} />, label: t("responseTimeLabel"), value: t("responseTimeValue") },
  ]

  return (
    <div className="lg:col-span-2 reveal order-2 lg:order-1 flex flex-col gap-4 lg:sticky lg:top-24">
      <div>
        <div className="flex items-center gap-2.5 w-fit max-w-full px-3 py-2 rounded-full text-amber-foreground bg-amber/9 border border-amber/22 [html[data-theme=light]_&]:text-[var(--tag-color)] [html[data-theme=light]_&]:bg-amber/8 [html[data-theme=light]_&]:border-border-amber">
          <span className="w-2 h-2 rounded-full bg-[var(--green)] shadow-[0_0_0_4px_color-mix(in_srgb,var(--green)_14%,transparent)] shrink-0" />
          <span className="text-[0.8125rem] font-bold leading-[1.2]">{t("availabilityTitle")}</span>
        </div>
        {t("availabilityBody") && (
          <p className="text-muted-foreground text-[0.8125rem] leading-[1.5] mt-1">
            {t("availabilityBody")}
          </p>
        )}
      </div>

      <div className="grid gap-2.5">
        {cards.map((card) => (
          <ContactInfoCard key={card.label} {...card} />
        ))}
      </div>

      <div className="pt-2 border-t border-border">
        <h3 className="text-foreground font-heading text-[clamp(1.375rem,2.1vw,1.875rem)] font-black leading-[1.08] max-w-[12.5em]">
          {t.rich("heading", {
            gradient: (chunks) => (
              <span className="text-amber-foreground [html[data-theme=light]_&]:text-[var(--tag-color)]">
                {chunks}
              </span>
            ),
          })}
        </h3>
        <p className="text-muted-foreground text-[0.9375rem] leading-[1.65] max-w-[34rem] mt-[0.875rem]">
          {t("subheading")}
        </p>
      </div>
    </div>
  );
}
