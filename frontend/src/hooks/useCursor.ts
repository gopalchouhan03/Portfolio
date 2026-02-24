"use client";

import { useEffect, useRef, useState } from "react";

type CursorRefs = {
  wrapperRef: React.RefObject<HTMLDivElement>;
  dotRef: React.RefObject<HTMLDivElement>;
  outlineRef: React.RefObject<HTMLDivElement>;
  labelRef: React.RefObject<HTMLDivElement>;
};

export default function useCursor(): CursorRefs & { enabled: boolean } {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const outlineRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);

  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const dotX = useRef(0);
  const dotY = useRef(0);
  const requestRef = useRef<number | null>(null);
  const isHoveringRef = useRef<null | Element>(null);
  const isMobile = useRef(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Detect touch devices / coarse pointers and disable custom cursor
    if (typeof window === "undefined") return;
    const mq = window.matchMedia && window.matchMedia("(pointer: coarse)");
    isMobile.current = !!("ontouchstart" in window) || (mq && mq.matches);
    if (isMobile.current) {
      const t = setTimeout(() => {
        setEnabled(false);
        document.documentElement.style.cursor = "auto";
      }, 0);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      setEnabled(true);
      document.documentElement.style.cursor = "none";
    }, 0);

    const onMove = (e: PointerEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
      // show dot immediately
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const onDown = () => {
      if (outlineRef.current) outlineRef.current.style.transform += " scale(0.85)";
    };

    const onUp = () => {
      if (outlineRef.current) outlineRef.current.style.transform = outlineRef.current.style.transform.replace(" scale(0.85)", "");
    };

    const onEnter = (e: Event) => {
      const target = e.target as Element;
      if (!target) return;
      const tag = target.tagName.toLowerCase();
      if (tag === "a") {
        if (labelRef.current) labelRef.current.textContent = "View";
        if (outlineRef.current) outlineRef.current.classList.add("cursor-link");
      } else if (tag === "button") {
        if (outlineRef.current) outlineRef.current.classList.add("cursor-button");
        isHoveringRef.current = target;
      } else if (target.getAttribute && target.getAttribute("data-cursor") === "text") {
        if (outlineRef.current) outlineRef.current.classList.add("cursor-text");
      }
    };

    const onLeave = (e: Event) => {
      const target = e.target as Element;
      if (!target) return;
      const tag = target.tagName.toLowerCase();
      if (tag === "a") {
        if (labelRef.current) labelRef.current.textContent = "";
        if (outlineRef.current) outlineRef.current.classList.remove("cursor-link");
      } else if (tag === "button") {
        if (outlineRef.current) outlineRef.current.classList.remove("cursor-button");
        isHoveringRef.current = null;
      } else if (target.getAttribute && target.getAttribute("data-cursor") === "text") {
        if (outlineRef.current) outlineRef.current.classList.remove("cursor-text");
      }
    };

    const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

    const loop = () => {
      dotX.current = lerp(dotX.current, mouseX.current, 0.45);
      dotY.current = lerp(dotY.current, mouseY.current, 0.45);

      if (outlineRef.current) {
        const dx = dotX.current;
        const dy = dotY.current;
        outlineRef.current.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      }

      // Magnetic buttons: when hovering a button, pull cursor slightly toward element center
      if (isHoveringRef.current && isHoveringRef.current.tagName.toLowerCase() === "button") {
        const rect = (isHoveringRef.current as HTMLElement).getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const pullX = lerp(dotX.current, cx, 0.08);
        const pullY = lerp(dotY.current, cy, 0.08);
        if (outlineRef.current) outlineRef.current.style.transform = `translate3d(${pullX}px, ${pullY}px, 0) scale(1.15)`;
      }

      requestRef.current = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerover", onEnter);
    document.addEventListener("pointerout", onLeave);

    requestRef.current = requestAnimationFrame(loop);

    return () => {
      clearTimeout(t);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerover", onEnter);
      document.removeEventListener("pointerout", onLeave);
      document.documentElement.style.cursor = "auto";
    };
  }, []);

  return {
    wrapperRef,
    dotRef,
    outlineRef,
    labelRef,
    enabled,
  };
}
