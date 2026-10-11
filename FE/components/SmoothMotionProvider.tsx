'use client';

import React, { useEffect, useRef } from 'react';

export function SmoothMotionProvider({ children }: { children: React.ReactNode }) {
  const dotRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable custom cursor and tilt on desktop devices with mouse
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    const dot = dotRef.current;
    const aura = auraRef.current;
    if (!dot || !aura) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let dotX = targetX;
    let dotY = targetY;
    let auraX = targetX;
    let auraY = targetY;
    let isVisible = false;

    // 1. Mouse Move Tracking
    const handlePointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        dot.style.opacity = '1';
        aura.style.opacity = '1';
      }
    };

    // 2. Interactive Element Hover Magnification
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isInteractive = target.closest('a, button, input, textarea, [role="button"], .tilt-3d, .interactive-card');
      if (isInteractive) {
        dot.classList.add('cursor-active');
        aura.classList.add('cursor-active');
      } else {
        dot.classList.remove('cursor-active');
        aura.classList.remove('cursor-active');
      }
    };

    // 3. 3D Perspective Tilt on Mouse Glide
    const tiltContainers = document.querySelectorAll<HTMLElement>(
      '.tilt-3d, .interactive-card, .b-card, article, .group\\/card'
    );

    const handleTiltMove = (e: MouseEvent) => {
      const el = e.currentTarget as HTMLElement;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const relX = (x / rect.width - 0.5) * 2;
      const relY = (y / rect.height - 0.5) * 2;

      el.style.transform = `perspective(1000px) rotateX(${(-relY * 9).toFixed(2)}deg) rotateY(${(relX * 9).toFixed(2)}deg) translateZ(10px) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleTiltLeave = (e: MouseEvent) => {
      const el = e.currentTarget as HTMLElement;
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0) scale3d(1, 1, 1)';
    };

    tiltContainers.forEach((el) => {
      el.style.transformStyle = 'preserve-3d';
      el.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s ease';
      el.addEventListener('mousemove', handleTiltMove);
      el.addEventListener('mouseleave', handleTiltLeave);
    });

    // 4. Cursor Physics Animation Loop
    let animId: number;
    const tick = () => {
      dotX += (targetX - dotX) * 0.35;
      dotY += (targetY - dotY) * 0.35;
      auraX += (targetX - auraX) * 0.11;
      auraY += (targetY - auraY) * 0.11;

      dot.style.transform = `translate3d(${dotX.toFixed(1)}px, ${dotY.toFixed(1)}px, 0)`;
      aura.style.transform = `translate3d(${auraX.toFixed(1)}px, ${auraY.toFixed(1)}px, 0)`;

      animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseover', handleMouseOver);
      tiltContainers.forEach((el) => {
        el.removeEventListener('mousemove', handleTiltMove);
        el.removeEventListener('mouseleave', handleTiltLeave);
      });
    };
  }, []);

  return (
    <>
      {/* Golden Glowing Cursor Dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="fixed top-0 left-0 -ml-1.5 -mt-1.5 w-3 h-3 rounded-full pointer-events-none z-[9999] opacity-0 transition-opacity duration-300 bg-[#ffd700] shadow-[0_0_14px_#ffd700,0_0_28px_rgba(245,158,11,0.5)] [&.cursor-active]:w-9 [&.cursor-active]:h-9 [&.cursor-active]:-ml-4.5 [&.cursor-active]:-mt-4.5 [&.cursor-active]:bg-amber-400/20 [&.cursor-active]:border [&.cursor-active]:border-amber-400/80 [&.cursor-active]:backdrop-blur-[2px]"
      />

      {/* Trailing Ambient Golden Halo Aura */}
      <div
        ref={auraRef}
        aria-hidden="true"
        className="fixed top-0 left-0 -ml-8 -mt-8 w-16 h-16 rounded-full pointer-events-none z-[9998] opacity-0 transition-opacity duration-500 bg-[radial-gradient(circle,rgba(255,215,0,0.15)_0%,rgba(201,162,74,0.05)_55%,transparent_75%)] [&.cursor-active]:w-24 [&.cursor-active]:h-24 [&.cursor-active]:-ml-12 [&.cursor-active]:-mt-12 [&.cursor-active]:bg-[radial-gradient(circle,rgba(255,215,0,0.25)_0%,rgba(224,35,28,0.1)_60%,transparent_80%)]"
      />

      {children}
    </>
  );
}
