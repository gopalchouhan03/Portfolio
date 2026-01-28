'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<HTMLDivElement>(null);
  const isPointerRef = useRef(false);
  const animationRef = useRef<number>();

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let outerX = 0;
    let outerY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Check if hovering clickable
      const target = e.target as HTMLElement;
      const isClickable =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        !!target.closest('button') ||
        !!target.closest('a') ||
        target.classList.contains('cursor-pointer') ||
        target.classList.contains('group');

      if (isClickable !== isPointerRef.current) {
        isPointerRef.current = isClickable;
        if (pointerRef.current) {
          pointerRef.current.setAttribute('data-pointer', isClickable ? 'true' : 'false');
        }
      }
    };

    const updateCursor = () => {
      // Smooth easing for outer ring
      outerX += (mouseX - outerX) * 0.2;
      outerY += (mouseY - outerY) * 0.2;

      // Use transform instead of left/top for better performance
      if (innerRef.current) {
        innerRef.current.style.transform = `translate(calc(-50% + ${mouseX}px), calc(-50% + ${mouseY}px))`;
      }

      if (outerRef.current) {
        outerRef.current.style.transform = `translate(calc(-50% + ${outerX}px), calc(-50% + ${outerY}px))`;
      }

      animationRef.current = requestAnimationFrame(updateCursor);
    };

    const handleMouseEnter = () => {
      if (outerRef.current) outerRef.current.style.opacity = '1';
      if (innerRef.current) innerRef.current.style.opacity = '1';
      animationRef.current = requestAnimationFrame(updateCursor);
    };

    const handleMouseLeave = () => {
      if (outerRef.current) outerRef.current.style.opacity = '0';
      if (innerRef.current) innerRef.current.style.opacity = '0';
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true, capture: true });
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div ref={pointerRef} data-pointer="false">
      {/* Inner dot - instant follow */}
      <div
        ref={innerRef}
        className="fixed hidden pointer-events-none lg:block"
        style={{
          width: '8px',
          height: '8px',
          backgroundColor: 'rgb(59, 130, 246)',
          borderRadius: '50%',
          willChange: 'transform',
          opacity: 0,
          transition: 'opacity 0.2s ease-out',
        }}
      />

      {/* Outer ring - smooth follow */}
      <div
        ref={outerRef}
        className="fixed hidden pointer-events-none lg:block"
        style={{
          width: '32px',
          height: '32px',
          border: '1.5px solid rgba(96, 165, 250, 0.6)',
          borderRadius: '50%',
          willChange: 'transform',
          opacity: 0,
          transition: 'opacity 0.2s ease-out',
        }}
      />
    </div>
  );
}
