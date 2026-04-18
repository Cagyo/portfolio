import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { BlobBackground } from "@/app/_components/BlobBackground";
import { SectionHeader } from "@/app/_components/SectionHeader";
import { ContactForm } from "./ContactForm";
import { ContactInfo } from "./ContactInfo";

export async function ContactSection() {
  const t = await getTranslations("contact");

  return (
    <section id="contact" className="py-16 relative overflow-hidden">
      <BlobBackground size="w-96 h-96" color="bg-amber-500" position="-bottom-32 left-1/2 -translate-x-1/2" opacity={0.1} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader number={t("sectionNumber")} title={t("sectionTitle")} />

        <div className="grid lg:grid-cols-5 gap-12">
          <ContactInfo />
          <Suspense>
            <ContactForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
