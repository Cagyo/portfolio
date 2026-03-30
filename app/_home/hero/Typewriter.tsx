"use client";

import { useEffect, useRef } from "react";

type TypewriterProps = {
  roles: string[]
}

export function Typewriter({ roles }: TypewriterProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const state = useRef({ text: "", idx: 0, deleting: false });

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    function tick() {
      const s = state.current;
      const role = roles[s.idx];

      if (!s.deleting) {
        if (s.text.length < role.length) {
          s.text = role.slice(0, s.text.length + 1);
          if (textRef.current) textRef.current.textContent = s.text;
          timer = setTimeout(tick, 100);
        } else {
          timer = setTimeout(() => { s.deleting = true; tick(); }, 1800);
        }
      } else {
        if (s.text.length > 0) {
          s.text = s.text.slice(0, -1);
          if (textRef.current) textRef.current.textContent = s.text;
          timer = setTimeout(tick, 60);
        } else {
          s.deleting = false;
          s.idx = (s.idx + 1) % roles.length;
          tick();
        }
      }
    }

    timer = setTimeout(tick, 100);
    return () => clearTimeout(timer);
  }, [roles]);

  return (
    <span className="text-amber-400 font-medium">
      <span ref={textRef} />
      <span className="cursor" />
    </span>
  );
}
