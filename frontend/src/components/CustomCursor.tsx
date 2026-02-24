"use client";

import React from "react";
import useCursor from "@/hooks/useCursor";

export default function CustomCursor() {
  const { wrapperRef, dotRef, outlineRef, labelRef, enabled } = useCursor();

  if (!enabled) return null;

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-0 pointer-events-none custom-cursor z-9999 mix-blend-screen"
      aria-hidden
    >
      <div
        ref={outlineRef}
        className="cursor-outline absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/2 shadow-[0_8px_30px_rgba(99,102,241,0.08)] transition-transform duration-300 will-change-transform"
      />

      <div
        ref={dotRef}
        className="cursor-dot absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-100 shadow-[0_6px_20px_rgba(99,102,241,0.12)] transition-transform duration-150"
      />

      <div
        ref={labelRef}
        className="absolute px-2 py-1 text-xs transition-all duration-200 -translate-x-1/2 -translate-y-6 rounded opacity-0 pointer-events-none cursor-label bg-slate-800/80 text-white/90"
      />
    </div>
  );
}
