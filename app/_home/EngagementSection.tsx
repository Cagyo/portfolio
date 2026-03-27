import { BlobBackground } from "../_components/BlobBackground";
import { SectionHeader } from "../_components/SectionHeader";
import { BadgeCheckIcon } from "../../assets/icons/BadgeCheckIcon";
import { ExternalLinkIcon } from "../../assets/icons/ExternalLinkIcon";
import { LightningIcon } from "../../assets/icons/LightningIcon";
import { WarningIcon } from "../../assets/icons/WarningIcon";
import { EngagementCard } from "./EngagementCard";

const LIGHTNING_ICON = <LightningIcon className="w-3 h-3" />;
const BADGE_ICON = <BadgeCheckIcon className="w-3 h-3" />;
const WARNING_ICON = <WarningIcon className="w-3 h-3" />;

export function EngagementSection() {
  return (
    <section id="engagement" className="py-16 relative overflow-hidden">
      <BlobBackground size="w-96 h-96" color="bg-amber-500" position="-bottom-24 left-1/4" opacity="0.1" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader number="05." title="Ways to work together" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          <EngagementCard
            tag="Ship fast"
            tagIcon={LIGHTNING_ICON}
            tagVariant="amber"
            title="MVP & Fast Builds"
            body="This website was built in days using AI-assisted development. That's the pace I bring to your project — a working solution in weeks, not months, without the overhead of a full agency process."
            bestFor="Founders who need to validate an idea, test a market, or ship something real before committing to a full build."
            note="Focused scope, no bureaucracy — shipped in weeks, not months."
            order="order-2 lg:order-1"
          />
          <EngagementCard
            tag="Long-term"
            tagIcon={BADGE_ICON}
            tagVariant="purple"
            title="Full Product Build & Support"
            body="Solid architecture from day one, built to scale. I'm embedded in your product long-term — designing, building, leading, and evolving it as your business grows."
            bestFor="Clients building something serious who want one technical partner for the long haul — not a series of handoffs."
            note="One partner. Full ownership. Zero handoffs."
            featured
            order="order-1 lg:order-2"
            delay="0.1s"
          />
          <EngagementCard
            tag="Existing project"
            tagIcon={WARNING_ICON}
            tagVariant="teal"
            title="Project SOS"
            body="You have an existing product — but it's messy, slow, or needs a senior hand. I come in, review the codebase and architecture, scope what needs fixing, and take ownership of moving it forward."
            bestFor="Teams with technical debt, founders who inherited a codebase, or products that need stabilising before the next growth phase."
            note="Rescue, refactor, and scale — without starting over."
            order="order-3"
            delay="0.2s"
          />
        </div>

        <div
          className="reveal mt-10 glass rounded-2xl px-7 py-5 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ transitionDelay: "0.25s" }}
        >
          <p className="text-white/50 text-sm text-center sm:text-left">
            Not sure which fits? Start with a discovery call — we&apos;ll figure it out together.
          </p>
          <a href="#contact" className="btn-amber px-6 py-2.5 rounded-xl text-sm flex-shrink-0 cursor-pointer inline-flex items-center gap-2">
            <span>Book a call</span>
            <ExternalLinkIcon className="w-4 h-4 relative z-10" />
          </a>
        </div>
      </div>
    </section>
  );
}
