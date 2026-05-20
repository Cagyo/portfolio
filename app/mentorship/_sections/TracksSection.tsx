import { getTranslations } from "next-intl/server";
import { ArrowRightIcon } from "@/assets/icons/ArrowRightIcon";
import { CalendarIcon } from "@/assets/icons/CalendarIcon";
import { CheckIcon } from "@/assets/icons/CheckIcon";
import { BlobBackground } from "@/app/_components/BlobBackground";
import { Button } from "@/app/_components/button/Button";
import { SectionHeader } from "@/app/_components/SectionHeader";
import { TrackedLink } from "@/app/_components/tracked-link/TrackedLink";
import { siteConfig } from "@/app/_config/site-config";
type TrackAccent = "amber" | "violet"

function DeliverablesList({ items, accent }: { items: string[]; accent: TrackAccent }) {
  const checkColor = accent === "amber" ? "text-amber-foreground" : "text-violet-400";
  return (
    <>
      {items.map((item) => (
        <div key={item} className="flex items-start gap-3">
          <CheckIcon className={`w-4 h-4 ${checkColor} mt-0.5 flex-shrink-0`} strokeWidth={2.5} />
          <span className="text-muted-foreground text-sm">{item}</span>
        </div>
      ))}
    </>
  );
}

function ScopeTags({ items, accent }: { items: string[]; accent: TrackAccent }) {
  const tagClass = accent === "amber"
    ? "bg-card text-faint-foreground border border-border"
    : "bg-violet-500/10 text-violet-400/70 border border-violet-500/20";
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((tag) => (
        <span key={tag} className={`text-xs px-2 py-0.5 rounded ${tagClass}`}>
          {tag}
        </span>
      ))}
    </div>
  );
}

export async function TracksSection() {
  const t = await getTranslations("mentorshipPage.tracks");
  const fastDeliverables = t.raw("fastTrack.deliverables") as string[];
  const deepDeliverables = t.raw("deepDive.deliverables") as string[];
  const fastScope = t.raw("fastTrack.scope") as string[];
  const deepScope = t.raw("deepDive.scope") as string[];

  return (
    <section id="plans" className="py-16 relative overflow-hidden">
      <BlobBackground tone="violet" shade={700} position="top-0 -right-32" opacity={0.08} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader number={t("sectionNumber")} title={t("sectionTitle")} accentColor="violet" />

        <p className="reveal text-muted-foreground text-lg leading-relaxed max-w-2xl mb-16">
          {t("body")}
        </p>

        {/* Track cards */}
        <div className="grid sm:grid-cols-2 gap-6 items-stretch mb-8">

          {/* Fast Track */}
          <div className="reveal glass rounded-2xl overflow-hidden flex flex-col hover:border-border-amber transition-colors duration-300">
            <div className="bg-gradient-to-r from-amber/10 to-amber-dark/10 px-6 pt-6 pb-5 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber/10 border border-border-amber text-amber-foreground">
                  {t("fastTrack.badge")}
                </span>
                <span className="text-ghost-foreground text-xs font-medium">{t("fastTrack.duration")}</span>
              </div>
              <h3 className="font-heading font-black text-2xl text-foreground mb-1">{t("fastTrack.name")}</h3>
              <p className="text-muted-foreground text-sm">{t("fastTrack.tagline")}</p>
            </div>

            <div className="px-6 py-5 border-b border-border flex items-baseline gap-2">
              <span
                className="font-heading font-black text-4xl text-gradient-amber"
              >
                {t("fastTrack.price")}
              </span>
              <span className="text-ghost-foreground text-sm">{t("fastTrack.pricePer")}</span>
              <span className="ml-auto text-ghost-foreground text-xs">{t("fastTrack.priceBreakdown")}</span>
            </div>

            <div className="px-6 py-5 flex-1 space-y-3">
              <p className="text-faint-foreground text-xs uppercase tracking-widest font-bold mb-4">{t("deliverableLabel")}</p>
              <DeliverablesList items={fastDeliverables} accent="amber" />
            </div>

            <div className="px-6 pb-5">
              <p className="text-ghost-foreground text-xs uppercase tracking-widest font-bold mb-3">{t("scopeLabel")}</p>
              <ScopeTags items={fastScope} accent="amber" />
            </div>

            <div className="px-6 pb-6">
              <Button href="/#contact" className="w-full py-3 rounded-xl text-sm cursor-pointer flex items-center justify-center gap-2">
                {t("fastTrack.cta")}
              </Button>
            </div>
          </div>

          {/* Deep Dive */}
          <div className="reveal relative glass rounded-2xl overflow-hidden flex flex-col delay-[100ms]">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-600 via-violet-400 to-violet-600 pointer-events-none" />

            <div className="bg-gradient-to-r from-violet-500/15 to-violet-600/8 px-6 pt-6 pb-5 border-b border-border">
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-violet-500/15 border border-violet-500/25 text-violet-400">
                  {t("deepDive.badge")}
                </span>
                <span className="text-ghost-foreground text-xs font-medium flex items-center gap-1">
                  {t("deepDive.duration")}
                  <span className="px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-400 text-xs font-bold">{t("deepDive.fullStackLabel")}</span>
                </span>
              </div>
              <h3 className="font-heading font-black text-2xl text-foreground mb-1">{t("deepDive.name")}</h3>
              <p className="text-muted-foreground text-sm">{t("deepDive.tagline")}</p>
            </div>

            <div className="px-6 py-5 border-b border-border flex items-baseline gap-2">
              <span
                className="font-heading font-black text-4xl text-gradient-violet"
              >
                {t("deepDive.price")}
              </span>
              <span className="text-ghost-foreground text-sm">{t("deepDive.pricePer")}</span>
              <span className="ml-auto text-ghost-foreground text-xs">{t("deepDive.priceBreakdown")}</span>
            </div>

            <div className="px-6 py-5 flex-1 space-y-3">
              <p className="text-faint-foreground text-xs uppercase tracking-widest font-bold mb-4">{t("deliverableLabel")}</p>
              <DeliverablesList items={deepDeliverables} accent="violet" />
            </div>

            <div className="px-6 pb-5">
              <p className="text-ghost-foreground text-xs uppercase tracking-widest font-bold mb-3">{t("scopeLabel")}</p>
              <ScopeTags items={deepScope} accent="violet" />
            </div>

            <div className="px-6 pb-6">
              <Button href="/#contact" className="w-full py-3 rounded-xl text-sm cursor-pointer flex items-center justify-center gap-2">
                {t("deepDive.cta")}
                <ArrowRightIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Scarcity strip */}
        <div
          className="reveal glass rounded-2xl px-7 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 delay-[200ms]"
        >
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-slow flex-shrink-0" />
            <div>
              <p className="text-muted-foreground text-sm font-medium">{t("scarcityText")}</p>
              <p className="text-faint-foreground text-xs mt-0.5">{t("scarcitySubtext")}</p>
            </div>
          </div>
          <TrackedLink
            href={siteConfig.calendly.url}
            target="_blank"
            rel="noopener noreferrer"
            tracking={{ action: "calendly" }}
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold cursor-pointer text-foreground bg-[var(--gradient-purple)]"
          >
            <CalendarIcon className="w-4 h-4" />
            {t("bookCall")}
          </TrackedLink>
        </div>
      </div>
    </section>
  );
}
