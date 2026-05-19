import { getTranslations } from "next-intl/server";
import { ArrowRightIcon } from "@/assets/icons/ArrowRightIcon";
import { SectionHeader } from "@/app/_components/SectionHeader";
import { TrackedLink } from "@/app/_components/tracked-link/TrackedLink";
import { getFaq } from "@/app/_data/faq/get-faq";
import { HomeFaqList } from "./HomeFaqList";

type FaqSectionProps = { sectionNumber?: string };

const ctaClassName = "btn-shimmer relative inline-flex min-h-11 items-center overflow-hidden rounded-xl border border-transparent bg-[linear-gradient(135deg,var(--amber),var(--amber-dark))] px-6 py-2.5 text-sm font-semibold text-[#0D0D0D] transition-[transform,box-shadow] duration-[250ms] ease-[ease] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_color-mix(in_srgb,var(--amber)_40%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-amber-light motion-reduce:transition-[box-shadow] motion-reduce:hover:translate-y-0";

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
