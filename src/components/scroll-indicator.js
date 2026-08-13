import React, { useEffect, useState } from 'react';

const THRESHOLD = 220;

export default () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let ticking = false;
    let raf = 0;

    const snap = () => setProgress(window.scrollY > THRESHOLD ? 1 : 0);

    const smooth = () => {
      const p = Math.min(1, Math.max(0, window.scrollY / THRESHOLD));
      setProgress(prev => {
        if (p === 0 || p === 1) return p;
        return Math.abs(prev - p) > 0.01 ? p : prev;
      });
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      raf = requestAnimationFrame(reducedMotion ? snap : smooth);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    if (reducedMotion) snap();
    else smooth();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const hidden = progress >= 1;

  return (
    <div
      aria-hidden="true"
      className="fixed bottom-6 left-0 right-0 z-40 flex flex-col items-center gap-2 pointer-events-none"
      style={{ opacity: hidden ? 0 : 0.85, transition: 'opacity 0.2s ease' }}
    >
      <span
        className="font-mono text-[9px] uppercase tracking-[0.5em] font-bold"
        style={{
          color: 'rgba(0, 255, 65, 0.5)',
          opacity: 1 - progress,
          transform: `translateY(${-8 * progress}px)`,
        }}
      >
        Initiating Scroll Sequence
      </span>
      <div
        className="flex flex-col items-center"
        style={{ opacity: 1 - progress, transform: `translateY(${-4 * progress}px)` }}
      >
        <div className="relative w-px h-12 overflow-hidden">
          <div
            className="scroll-indicator-line absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, #00FF41, rgba(0, 255, 65, 0.1))',
              boxShadow: '0 0 10px rgba(0, 255, 65, 0.6)',
              transform: `scaleY(${1 - progress})`,
              transformOrigin: 'bottom',
            }}
          />
        </div>
        <div
          className="h-px"
          style={{
            width: `${120 * progress}px`,
            opacity: progress,
            backgroundColor: 'rgba(0, 255, 65, 0.5)',
            boxShadow: '0 0 10px rgba(0, 255, 65, 0.6)',
          }}
        />
      </div>
    </div>
  );
};
