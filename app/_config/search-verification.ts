import type { Metadata } from "next";
import { siteConfig } from "@/app/_config/site-config";

type SearchVerificationTokens = {
  google: string;
  bing: string;
};

export function buildSearchVerificationMetadata(
  tokens: SearchVerificationTokens,
): Metadata["verification"] | undefined {
  const google = tokens.google.trim();
  const bing = tokens.bing.trim();

  if (!google && !bing) return undefined;

  return {
    ...(google ? { google } : {}),
    ...(bing
      ? {
          other: {
            "msvalidate.01": bing,
          },
        }
      : {}),
  };
}

export function getSearchVerificationMetadata(): Metadata["verification"] | undefined {
  return buildSearchVerificationMetadata(siteConfig.verification);
}
