"use client";

import { useEffect, useState } from "react";

type TypewriterProps = {
  roles: string[]
}

export function Typewriter({ roles }: TypewriterProps) {
  const [displayed, setDisplayed] = useState("");
  const [roleIdx, setRoleIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const role = roles[roleIdx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (displayed.length < role.length) {
          setDisplayed(role.slice(0, displayed.length + 1));
        } else {
          setTimeout(() => setDeleting(true), 1800);
        }
      } else {
        if (displayed.length > 0) {
          setDisplayed(displayed.slice(0, -1));
        } else {
          setDeleting(false);
          setRoleIdx((i) => (i + 1) % roles.length);
        }
      }
    }, deleting ? 60 : 100);
    return () => clearTimeout(timeout);
  }, [displayed, roleIdx, deleting, roles]);

  return (
    <span className="text-amber-400 font-medium cursor">
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  );
}
