import { Tag } from "../../_components/tag/Tag";
import { ProjectMeta } from "./ProjectMeta";
import styles from "./ProjectCard.module.css";

type ProjectCardProps = {
  title: string
  description: string
  meta: { category: string; role: string; year: string }
  badge: { icon: React.ReactNode; label: string }
  tags: string[]
  imageBg: string
  imageContent: React.ReactNode
  linkOverlay: React.ReactNode
  featured?: boolean
}

export function ProjectCard({
  title,
  description,
  meta,
  badge,
  tags,
  imageBg,
  imageContent,
  linkOverlay,
  featured,
}: ProjectCardProps) {
  const imageH = featured ? "h-48" : "h-40";
  const padding = featured ? "p-6" : "p-5";
  const titleSize = featured ? "text-xl" : "text-lg";

  return (
    <div className={`${styles.projectCard} glass rounded-3xl overflow-hidden cursor-pointer group reveal${featured ? " md:col-span-2" : ""}`}>
      <div className={`relative ${imageH} overflow-hidden ${imageBg}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          {imageContent}
        </div>
        <div className={`${styles.projectOverlay} absolute inset-0 bg-black/50 flex items-center justify-center`}>
          {linkOverlay}
        </div>
      </div>
      <div className={padding}>
        <ProjectMeta {...meta} />
        <h3 className={`font-heading font-bold ${titleSize} text-white mb-2`}>{title}</h3>
        <p className="text-white/50 text-sm leading-relaxed mb-4">{description}</p>
        <div className="inline-flex items-center gap-1.5 glass-amber rounded-lg px-3 py-1.5 mb-4">
          {badge.icon}
          <span className="text-amber-400 text-xs font-bold">{badge.label}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </div>
    </div>
  );
}
