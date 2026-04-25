import { siteConfig } from "@/app/_config/site-config";
import { SKILLS } from "@/app/_data/skills-data";
import { absoluteUrl } from "./absolute-url";

export type Translator = (key: string) => string;

/**
 * schema.org Person describing the site owner.
 *
 * Emit ONCE in the root layout — covers every route under it.
 * Do NOT re-emit on subpages.
 */
export function buildPersonSchema(t: Translator): Record<string, unknown> {
  const sameAs = [
    siteConfig.social.github.url,
    siteConfig.social.linkedin.url,
    siteConfig.social.twitter.url,
  ].filter((url) => url.length > 0);

  const knowsAbout = SKILLS.filter((skill) => "top" in skill && skill.top).map(
    (skill) => skill.name,
  );

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": absoluteUrl("/#person"),
    name: siteConfig.author.name,
    url: absoluteUrl(),
    email: siteConfig.author.email,
    image: absoluteUrl("/og/avatar.png"),
    jobTitle: t("jobTitle"),
    description: t("description"),
    knowsAbout,
    sameAs,
  };
}
