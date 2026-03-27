import { getTranslations } from "next-intl/server";
import { BlobBackground } from "../_components/BlobBackground";
import { SectionHeader } from "../_components/SectionHeader";
import { TestimonialCard } from "./TestimonialCard";

const GRADIENT_CLASSES = [
  "bg-gradient-to-br from-amber-500 to-amber-700",
  "bg-gradient-to-br from-slate-500 to-slate-700",
];
const INITIALS_COLORS = [undefined, "text-white"];

export async function RecommendationsSection() {
  const t = await getTranslations("recommendations");
  const items = t.raw("items") as {
    quote: string;
    authorName: string;
    authorRole: string;
    authorInitials: string;
  }[];

  return (
    <section id="recommendations" className="py-16 relative overflow-hidden">
      <BlobBackground size="w-80 h-80" color="bg-amber-500" position="top-0 -right-20" opacity="0.1" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader number={t("sectionNumber")} title={t("sectionTitle")} />

        <div className="grid sm:grid-cols-2 gap-6">
          {items.map((item, i) => (
            <TestimonialCard
              key={item.authorName}
              quote={item.quote}
              author={{
                name: item.authorName,
                role: item.authorRole,
                initials: item.authorInitials,
                gradientClass: GRADIENT_CLASSES[i],
                initialsColor: INITIALS_COLORS[i],
              }}
              linkedinUrl="#"
              delay={i > 0 ? `${i * 0.1}s` : undefined}
              viewOnLinkedInLabel={t("viewOnLinkedIn")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
