"use client";

import type { AnchorHTMLAttributes } from "react";
import {
  trackLinkAction,
  type LinkTracking,
} from "@/app/_analytics/analytics";

type TrackedLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "onClick"
> & {
  href: string;
  tracking: LinkTracking;
};

export function TrackedLink({
  href,
  tracking,
  className = "",
  children,
  ...anchorProps
}: TrackedLinkProps) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => trackLinkAction(tracking)}
      {...anchorProps}
    >
      {children}
    </a>
  );
}
