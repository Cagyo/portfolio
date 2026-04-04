import { getTranslations } from "next-intl/server";
import { BlobBackground } from "../../_components/BlobBackground";
import { SectionHeader } from "../../_components/SectionHeader";
import { TestimonialsSlider } from "./TestimonialsSlider";

const GRADIENT_CLASSES = [
  "bg-gradient-to-br from-amber-500 to-amber-700",
  "bg-gradient-to-br from-slate-500 to-slate-700",
];
const INITIALS_COLORS: (string | undefined)[] = [undefined, "text-white"];

export async function RecommendationsSection() {
  const t = await getTranslations("recommendations");
  const items = t.raw("items") as {
    quotePreview: string;
    quoteRest?: string;
    authorName: string;
    authorRole: string;
    authorInitials: string;
    authorPhoto?: string;
    linkedinUrl?: string;
  }[];

  const viewOnLinkedInLabel = t("viewOnLinkedIn");
  const readMoreLabel = t("readMore");
  const readLessLabel = t("readLess");

  const sliderItems = items.map((item, index) => ({
    quotePreview: item.quotePreview,
    quoteRest: item.quoteRest,
    authorName: item.authorName,
    authorRole: item.authorRole,
    authorInitials: item.authorInitials,
    gradientClass: GRADIENT_CLASSES[index % GRADIENT_CLASSES.length],
    initialsColor: INITIALS_COLORS[index % INITIALS_COLORS.length],
    photoUrl: item.authorPhoto,
    linkedinUrl: item.linkedinUrl,
    viewOnLinkedInLabel,
    readMoreLabel,
    readLessLabel,
  }));

  return (
    <section id="recommendations" className="py-16 relative overflow-hidden">
      <BlobBackground size="w-80 h-80" color="bg-amber-500" position="top-0 -right-20" opacity="0.1" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader number={t("sectionNumber")} title={t("sectionTitle")} />

        <div className="reveal">
          <TestimonialsSlider items={sliderItems} />
        </div>
      </div>
    </section>
  );
}
