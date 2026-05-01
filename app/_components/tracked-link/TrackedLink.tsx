"use client";

import { useCallback, type AnchorHTMLAttributes, type MouseEvent } from "react";
import {
  trackLinkAction,
  type LinkTracking,
} from "@/app/_analytics/analytics";

type TrackedLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
> & {
  href: string;
  tracking: LinkTracking;
};

export function TrackedLink({
  href,
  tracking,
  className = "",
  children,
  onClick,
  ...anchorProps
}: TrackedLinkProps) {
  const handleClick = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    trackLinkAction(tracking);
    onClick?.(event);
  }, [tracking, onClick]);

  return (
    <a
      href={href}
      className={className}
      onClick={handleClick}
      {...anchorProps}
    >
      {children}
    </a>
  );
}
