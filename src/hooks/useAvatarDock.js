import { useEffect, useState } from 'react';

export const AVATAR_DOCK_THRESHOLD = 360;

const useAvatarDock = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let ticking = false;
    let raf = 0;

    const snap = () => setProgress(window.scrollY > AVATAR_DOCK_THRESHOLD ? 1 : 0);

    const smooth = () => {
      const p = Math.min(1, Math.max(0, window.scrollY / AVATAR_DOCK_THRESHOLD));
      setProgress(prev => {
        if (p === 0 || p === 1) return p;
        return Math.abs(prev - p) > 0.015 ? p : prev;
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

  return progress;
};

export default useAvatarDock;
