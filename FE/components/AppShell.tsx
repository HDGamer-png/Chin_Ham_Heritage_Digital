'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { SylvaHero } from '@designcodeio/threeui';
import '@designcodeio/threeui/style.css';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isKageLanding = pathname === '/';

  // Synchronize cursor pointer movement with 3D background scene
  useEffect(() => {
    if (isKageLanding) return;

    const handlePointerMove = (e: PointerEvent) => {
      try {
        const frame = document.querySelector<HTMLIFrameElement>('.sylva-bg-world iframe');
        if (frame?.contentWindow) {
          frame.contentWindow.dispatchEvent(
            new PointerEvent('pointermove', {
              clientX: e.clientX,
              clientY: e.clientY,
              pointerType: e.pointerType || 'mouse',
              bubbles: true,
            })
          );
        }
      } catch {
        // Ignore cross-context exceptions if any
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [isKageLanding]);

  if (isKageLanding) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-[#121714] text-stone-100 selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* 3D Living Green (SylvaHero) World as Immersive Persistent Background */}
      <div className="sylva-bg-world fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute inset-0 w-full h-full opacity-100">
          <SylvaHero
            variant="living-green"
            presentation="background"
            headingFont="lexend"
            bodyFont="lexend"
            headingWeight="300"
            bodyWeight="300"
            primaryColor="#ffffff"
            headingSize={63}
            bodySize={16.5}
            headingLetterSpacing={-0.006}
          />
        </div>
        {/* Living Green atmospheric gradient & subtle botanical depth overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/50 pointer-events-none" />
      </div>

      {/* Main Page Layout positioned cleanly above the 3D layer */}
      <div className="relative z-10 flex flex-col min-h-screen justify-between">
        <SiteHeader />
        <main className="flex-1 relative z-10">{children}</main>
        <SiteFooter />
      </div>
    </div>
  );
}
