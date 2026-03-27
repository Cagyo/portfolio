import { BlobBackground } from "../_components/BlobBackground";
import { SectionHeader } from "../_components/SectionHeader";
import { TestimonialCard } from "./TestimonialCard";

export function RecommendationsSection() {
  return (
    <section id="recommendations" className="py-16 relative overflow-hidden">
      <BlobBackground size="w-80 h-80" color="bg-amber-500" position="top-0 -right-20" opacity="0.1" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader number="04." title="What people say" />

        <div className="grid sm:grid-cols-2 gap-6">
          <TestimonialCard
            quote="Working with Alex was a game-changer for our product. He didn't just write code — he thought about the business, challenged our assumptions, and delivered something we're genuinely proud of. Rare to find someone who can do architecture, mobile, and backend all at a senior level."
            author={{
              name: "James Donovan",
              role: "CTO · Allsquare Golf",
              initials: "JD",
              gradientClass: "bg-gradient-to-br from-amber-500 to-amber-700",
            }}
            linkedinUrl="#"
          />
          <TestimonialCard
            quote="Alex took ownership of our mobile app from day one. He set up the architecture, handled code reviews, kept the team aligned, and shipped on time. Beyond technical skill, he communicates clearly and keeps the bigger picture in mind. Exactly what you need in a tech lead."
            author={{
              name: "Sarah Kim",
              role: "Product Manager · Avocado Technologies",
              initials: "SK",
              gradientClass: "bg-gradient-to-br from-slate-500 to-slate-700",
              initialsColor: "text-white",
            }}
            linkedinUrl="#"
            delay="0.1s"
          />
        </div>
      </div>
    </section>
  );
}
