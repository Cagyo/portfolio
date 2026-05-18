import { getTranslations } from "next-intl/server";
import { ArrowRightIcon } from "@/assets/icons/ArrowRightIcon";
import { SectionHeader } from "@/app/_components/SectionHeader";
import { TrackedLink } from "@/app/_components/tracked-link/TrackedLink";
import { getFaq } from "@/app/_data/faq/get-faq";
import { HomeFaqList } from "./HomeFaqList";
import styles from "./FaqSection.module.css";

type FaqSectionProps = { sectionNumber?: string };

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
            className={styles.cta}
          >
            <span className={styles.ctaInner}>
              {t("ctaSeeAll")}
              <ArrowRightIcon className="w-4 h-4" />
            </span>
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}
