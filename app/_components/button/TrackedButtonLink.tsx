"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import {
  trackLinkAction,
  type LinkTracking,
} from "@/app/_analytics/analytics";
import { Button } from "./Button";

type TrackedButtonLinkProps = Omit<
  ComponentPropsWithoutRef<"a">,
  "href" | "onClick"
> & {
  href: string;
  tracking: LinkTracking;
  variant?: "primary" | "outline";
  className?: string;
  children: ReactNode;
};

export function TrackedButtonLink({
  tracking,
  ...buttonProps
}: TrackedButtonLinkProps) {
  return (
    <Button
      {...buttonProps}
      onClick={() => trackLinkAction(tracking)}
    />
  );
}
