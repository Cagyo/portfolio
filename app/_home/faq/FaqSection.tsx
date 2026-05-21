import { getTranslations } from "next-intl/server";
import { ArrowRightIcon } from "@/assets/icons/ArrowRightIcon";
import { SectionHeader } from "@/app/_components/SectionHeader";
import { TrackedLink } from "@/app/_components/tracked-link/TrackedLink";
import { buttonStyles } from "@/app/_components/ui/button";
import { getFaq } from "@/app/_data/faq/get-faq";
import { cn } from "@/app/_lib/cn";
import { HomeFaqList } from "./HomeFaqList";

type FaqSectionProps = { sectionNumber?: string };

const ctaClassName = cn(buttonStyles({ variant: "primary" }), "min-h-11 px-6 py-2.5 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-amber-light");

export async function FaqSection({ sectionNumber }: FaqSectionProps) {
  const faq = await getFaq();
  const t = await getTranslations("faqPage");

  return (
    <section id="faq" className="py-16 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader number={sectionNumber} title={faq.sectionTitle} />
        <div className="reveal">
          <HomeFaqList items={faq.homeFeaturedItems} tracks={faq.tracks} />
        </div>
        <div className="mt-10 flex justify-center reveal">
          <TrackedLink
            href="/faq"
            tracking={{ action: "faqSeeAll" }}
            className={ctaClassName}
          >
            <span className="relative z-[1] inline-flex items-center gap-2">
              {t("ctaSeeAll")}
              <ArrowRightIcon className="w-4 h-4" />
            </span>
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}
