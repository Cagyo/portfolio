"use client";

import { track } from "@vercel/analytics";
import { readConsent } from "@/app/_components/cookie-consent/consent-storage";

export const portfolioAnalyticsEvents = {
  resumeDownload: "resume_download",
  contactSubmitSuccess: "contact_submit_success",
  contactSectionView: "contact_section_view",
  contactSuccessCtaClick: "contact_success_cta_click",
  calendlyOpen: "calendly_open",
  outboundClick: "outbound_click",
  faqOpen: "faq_open",
  faqSeeAllClick: "faq_see_all_click",
} as const;

export type OutboundTarget = "github" | "linkedin" | "twitter" | "telegram" | "whatsapp";
export type ContactSubmitMode = "text" | "voice";
export type ContactSuccessCtaTarget = "calendly" | "linkedin" | "projects";
export type FaqTrack = "scratch" | "rescue" | "universal";
export type FaqLocation = "faq_page" | "home_section";

type AnalyticsPrimitive = string | number | boolean;

type AnalyticsContext = {
  path: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
};

type PortfolioEventPayloads = {
  [portfolioAnalyticsEvents.resumeDownload]: AnalyticsContext & { target: "resume" };
  [portfolioAnalyticsEvents.contactSubmitSuccess]: AnalyticsContext & {
    target: "contact_form";
    mode: ContactSubmitMode;
  };
  [portfolioAnalyticsEvents.contactSectionView]: AnalyticsContext;
  [portfolioAnalyticsEvents.contactSuccessCtaClick]: AnalyticsContext & {
    target: ContactSuccessCtaTarget;
  };
  [portfolioAnalyticsEvents.calendlyOpen]: AnalyticsContext & { target: "calendly" };
  [portfolioAnalyticsEvents.outboundClick]: AnalyticsContext & { target: OutboundTarget };
  [portfolioAnalyticsEvents.faqOpen]: AnalyticsContext & {
    slug: string;
    track: FaqTrack;
    location: FaqLocation;
  };
  [portfolioAnalyticsEvents.faqSeeAllClick]: AnalyticsContext & { target: "faq" };
};

export type LinkTracking =
  | { action: "resume" }
  | { action: "calendly" }
  | { action: "faqSeeAll" }
  | { action: "outbound"; target: OutboundTarget };

function getAnalyticsContext(): AnalyticsContext {
  if (typeof window === "undefined") return { path: "" };

  const searchParams = new URLSearchParams(window.location.search);

  return {
    path: window.location.pathname,
    utm_source: searchParams.get("utm_source") ?? undefined,
    utm_medium: searchParams.get("utm_medium") ?? undefined,
    utm_campaign: searchParams.get("utm_campaign") ?? undefined,
  };
}

function compactPayload(
  payload: Record<string, AnalyticsPrimitive | undefined>,
): Record<string, AnalyticsPrimitive> {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  ) as Record<string, AnalyticsPrimitive>;
}

function trackPortfolioEvent<EventName extends keyof PortfolioEventPayloads>(
  eventName: EventName,
  payload: PortfolioEventPayloads[EventName],
): void {
  if (readConsent() !== "granted") return;

  track(eventName, compactPayload(payload));
}

export function trackLinkAction(tracking: LinkTracking): void {
  if (tracking.action === "resume") {
    trackPortfolioEvent(portfolioAnalyticsEvents.resumeDownload, {
      ...getAnalyticsContext(),
      target: "resume",
    });
    return;
  }

  if (tracking.action === "calendly") {
    trackPortfolioEvent(portfolioAnalyticsEvents.calendlyOpen, {
      ...getAnalyticsContext(),
      target: "calendly",
    });
    return;
  }

  if (tracking.action === "faqSeeAll") {
    trackPortfolioEvent(portfolioAnalyticsEvents.faqSeeAllClick, {
      ...getAnalyticsContext(),
      target: "faq",
    });
    return;
  }

  trackPortfolioEvent(portfolioAnalyticsEvents.outboundClick, {
    ...getAnalyticsContext(),
    target: tracking.target,
  });
}

export function trackContactSubmitSuccess(mode: ContactSubmitMode): void {
  trackPortfolioEvent(portfolioAnalyticsEvents.contactSubmitSuccess, {
    ...getAnalyticsContext(),
    target: "contact_form",
    mode,
  });
}

export function trackContactSectionView(): void {
  trackPortfolioEvent(portfolioAnalyticsEvents.contactSectionView, {
    ...getAnalyticsContext(),
  });
}

export function trackContactSuccessCtaClick(target: ContactSuccessCtaTarget): void {
  trackPortfolioEvent(portfolioAnalyticsEvents.contactSuccessCtaClick, {
    ...getAnalyticsContext(),
    target,
  });
}

export function trackFaqOpen({
  slug,
  track,
  location,
}: {
  slug: string;
  track: FaqTrack;
  location: FaqLocation;
}): void {
  trackPortfolioEvent(portfolioAnalyticsEvents.faqOpen, {
    ...getAnalyticsContext(),
    slug,
    track,
    location,
  });
}
