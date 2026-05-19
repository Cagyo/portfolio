import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { BlobBackground } from "@/app/_components/BlobBackground";
import { SectionHeader } from "@/app/_components/SectionHeader";
import { siteConfig } from "@/app/_config/site-config";
import { ContactCallCard } from "./ContactCallCard";
import { ChannelChooser } from "./ChannelChooser";
import { ContactForm } from "./ContactForm";
import { ContactInfo } from "./ContactInfo";
import { ContactSectionView } from "./ContactSectionView";

type ContactSectionProps = { sectionNumber?: string }

export async function ContactSection({ sectionNumber }: ContactSectionProps) {
  const t = await getTranslations("contact");

  return (
    <section
      id="contact"
      className="relative overflow-hidden pt-[clamp(4rem,7vw,5rem)] pb-[clamp(2.75rem,5vw,4.25rem)] bg-[linear-gradient(180deg,transparent_0%,transparent_74%,color-mix(in_srgb,var(--bg-secondary)_36%,transparent)_100%)]"
    >
      <BlobBackground position="-bottom-40 left-1/2 -translate-x-1/2" opacity={0.08} />
      <ContactSectionView />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader number={sectionNumber} title={t("sectionTitle")} />

        <div className="grid lg:grid-cols-5 gap-10 lg:gap-12 items-start">
          <ContactInfo />
          <div className="lg:col-span-3 reveal order-1 lg:order-2 flex flex-col gap-4 [transition-delay:0.15s]">
            <ContactCallCard />
            <Suspense>
              <ContactForm />
            </Suspense>
            {siteConfig.features.contactChannels && <ChannelChooser />}
          </div>
        </div>
      </div>
    </section>
  );
}
