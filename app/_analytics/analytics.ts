"use client";

import { track } from "@vercel/analytics";

export const portfolioAnalyticsEvents = {
  resumeDownload: "resume_download",
  contactSubmitSuccess: "contact_submit_success",
  calendlyOpen: "calendly_open",
  outboundClick: "outbound_click",
} as const;

export type OutboundTarget = "github" | "linkedin" | "twitter";
export type ContactSubmitMode = "text" | "voice";

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
  [portfolioAnalyticsEvents.calendlyOpen]: AnalyticsContext & { target: "calendly" };
  [portfolioAnalyticsEvents.outboundClick]: AnalyticsContext & { target: OutboundTarget };
};

export type LinkTracking =
  | { action: "resume" }
  | { action: "calendly" }
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
