import { getTranslations } from "next-intl/server";
import { ArrowRightIcon } from "@/assets/icons/ArrowRightIcon";
import { BlobBackground } from "@/app/_components/BlobBackground";
import { Button } from "@/app/_components/button/Button";
import { SubpageNav } from "@/app/_components/nav/SubpageNav";
import { ThemeToggle } from "@/app/_components/theme/ThemeToggle";
import { getInitialIsDark } from "@/app/_components/theme/get-initial-is-dark";
import { siteConfig } from "@/app/_config/site-config";
import { FAQ_TRACK_ORDER } from "@/app/_data/faq/base";
import { getFaq } from "@/app/_data/faq/get-faq";
import type { FaqItem, TrackKey } from "@/app/_data/faq/types";
import { JsonLd } from "@/app/_schema/JsonLd";
import { absoluteUrl } from "@/app/_schema/absolute-url";
import { buildBreadcrumbSchema } from "@/app/_schema/breadcrumb";
import { buildFaqPageSchema } from "@/app/_schema/faq-page";
import { FaqList } from "./_components/FaqList";
import listStyles from "./_components/FaqList.module.css";

function getItemsByTrack(items: FaqItem[], track: TrackKey): FaqItem[] {
  return items.filter((item) => item.track === track);
}

export async function generateMetadata() {
  const faqPage = await getTranslations("faqPage");
  const og = await getTranslations("og.faq");
  const title = `${og("title")} — ${siteConfig.author.name}`;
  const description = faqPage("subtitle");
  const url = absoluteUrl("/faq");

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: og("title"),
      description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: og("title"),
      description,
    },
  };
}

export default async function Page({ params }: PageProps<"/faq">) {
  await params;

  const faq = await getFaq();
  const t = await getTranslations("faqPage");
  const initialIsDark = await getInitialIsDark();
  const scratchItems = getItemsByTrack(faq.items, "scratch");
  const rescueItems = getItemsByTrack(faq.items, "rescue");
  const universalItems = getItemsByTrack(faq.items, "universal");
  const trackJumpLinks = [
    { label: t("trackJumpScratch"), href: "#track-scratch" },
    { label: t("trackJumpRescue"), href: "#track-rescue" },
    { label: t("trackJumpUniversal"), href: "#track-universal" },
  ];
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: t("title"), path: "/faq" },
  ]);
  const faqPageSchema = buildFaqPageSchema(
    faq.items.map((item) => ({ question: item.question, answer: item.answer, slug: item.slug })),
  );

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {faqPageSchema && <JsonLd data={faqPageSchema} />}
      <SubpageNav
        backHref="/"
        sections={trackJumpLinks}
        cta={{ href: "/#contact", label: t("ctaContact") }}
        rightExtras={<ThemeToggle initialIsDark={initialIsDark} />}
        maxWidth="max-w-6xl"
      />
      <BlobBackground position="top-0 right-0" opacity={0.1} />
      <BlobBackground shade={600} position="bottom-0 left-0" opacity={0.08} />
      <main className="relative z-10 pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <header className="max-w-3xl mx-auto">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-amber-400">{t("eyebrow")}</p>
          <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
            {t("title")}
          </h1>
          <p className="mt-5 text-base sm:text-lg leading-relaxed text-white/50">
            {t("subtitle")}
          </p>
        </header>

        <div className="mt-16 max-w-6xl mx-auto grid gap-12 lg:grid-cols-2 lg:gap-8">
          <section id={`track-${FAQ_TRACK_ORDER[0]}`} className="scroll-mt-24">
            <FaqList items={scratchItems} tracks={faq.tracks} renderEyebrowOnFirstItem />
          </section>
          <section id={`track-${FAQ_TRACK_ORDER[1]}`} className="scroll-mt-24">
            <FaqList items={rescueItems} tracks={faq.tracks} renderEyebrowOnFirstItem />
          </section>
        </div>

        <section id={`track-${FAQ_TRACK_ORDER[2]}`} className="mt-20 max-w-3xl mx-auto scroll-mt-24">
          <p className={listStyles.trackEyebrow}>{faq.tracks.universal.eyebrow}</p>
          <hr className={listStyles.universalDivider} />
          <FaqList items={universalItems} tracks={faq.tracks} />
        </section>

        <section className="mt-20 max-w-3xl mx-auto text-center">
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-white">
            {t("stillQuestionsHeading")}
          </h2>
          <p className="mt-3 text-white/50 leading-relaxed">
            {t("stillQuestionsBody")}
          </p>
          <div className="mt-7 flex justify-center">
            <Button href="/#contact" className="px-6 py-2.5 rounded-xl text-sm cursor-pointer inline-flex items-center gap-2">
              {t("ctaContact")}
              <ArrowRightIcon className="w-4 h-4" />
            </Button>
          </div>
        </section>
      </main>
    </>
  );
}
