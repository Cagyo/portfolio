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
      const typewriterState = state.current;
      const role = roles[typewriterState.idx];

      if (!typewriterState.deleting) {
        if (typewriterState.text.length < role.length) {
          typewriterState.text = role.slice(0, typewriterState.text.length + 1);
          if (textRef.current) textRef.current.textContent = typewriterState.text;
          timer = setTimeout(tick, 100);
        } else {
          timer = setTimeout(() => { typewriterState.deleting = true; tick(); }, 1800);
        }
      } else {
        if (typewriterState.text.length > 0) {
          typewriterState.text = typewriterState.text.slice(0, -1);
          if (textRef.current) textRef.current.textContent = typewriterState.text;
          timer = setTimeout(tick, 60);
        } else {
          typewriterState.deleting = false;
          typewriterState.idx = (typewriterState.idx + 1) % roles.length;
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
