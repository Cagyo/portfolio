import { getTranslations } from "next-intl/server";
import { BlobBackground } from "@/app/_components/BlobBackground";
import { SectionHeader } from "@/app/_components/SectionHeader";
import { TypeScriptLogo } from "@/assets/logos/TypeScriptLogo";
import { NestJSLogo } from "@/assets/logos/NestJSLogo";
import { NextJSLogo } from "@/assets/logos/NextJSLogo";
import { ReactLogo } from "@/assets/logos/ReactLogo";
import { DockerLogo } from "@/assets/logos/DockerLogo";
import { SparklesIcon } from "@/assets/icons/SparklesIcon";
import { CpuChipIcon } from "@/assets/icons/CpuChipIcon";
import { PresentationIcon } from "@/assets/icons/PresentationIcon";
import { BoltIcon } from "@/assets/icons/BoltIcon";
import { LinkIcon } from "@/assets/icons/LinkIcon";

type StackItem = {
  label: string
  iconColor: string
  icon: React.ReactNode
}

function getStackItems(): StackItem[] {
  return [
    { label: "TypeScript",   iconColor: "#3178C6",  icon: <TypeScriptLogo className="w-3.5 h-3.5" /> },
    { label: "NestJS",       iconColor: "#E0234E",  icon: <NestJSLogo className="w-3.5 h-3.5" /> },
    { label: "Next.js",      iconColor: "rgba(255,255,255,0.8)", icon: <NextJSLogo className="w-3.5 h-3.5" /> },
    { label: "React Native", iconColor: "#61DAFB",  icon: <ReactLogo className="w-3.5 h-3.5" /> },
    { label: "React",        iconColor: "#61DAFB",  icon: <ReactLogo className="w-3.5 h-3.5" /> },
    { label: "Docker",       iconColor: "#2496ED",  icon: <DockerLogo className="w-3.5 h-3.5" /> },
    { label: "AI Tools",     iconColor: "#a78bfa",  icon: <SparklesIcon className="w-3.5 h-3.5" /> },
    { label: "AI Agent",     iconColor: "#a78bfa",  icon: <CpuChipIcon className="w-3.5 h-3.5" /> },
    { label: "Architecture", iconColor: "#fbbf24",  icon: <PresentationIcon className="w-3.5 h-3.5" /> },
    { label: "Highload",     iconColor: "#f87171",  icon: <BoltIcon className="w-3.5 h-3.5" /> },
    { label: "3rd-party APIs", iconColor: "#2dd4bf", icon: <LinkIcon className="w-3.5 h-3.5" /> },
  ]
}

export async function StackSection() {
  const t = await getTranslations("mentorshipPage.stack");
  const stackItems = getStackItems();

  return (
    <section id="stack" className="py-16 relative overflow-hidden">
      <BlobBackground size="md" tone="violet" shade={700} position="-bottom-20 -left-20" opacity={0.08} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader number={t("sectionNumber")} title={t("sectionTitle")} accentColor="violet" />

        <p className="reveal text-white/50 text-lg leading-relaxed max-w-2xl mb-12">
          {t("body")}
        </p>

        <div className="reveal flex flex-wrap gap-2">
          {stackItems.map((item) => (
            <span
              key={item.label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs font-medium hover:border-violet-500/40 hover:text-violet-400 transition-colors duration-200 cursor-default"
            >
              <span style={{ color: item.iconColor }}>{item.icon}</span>
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
