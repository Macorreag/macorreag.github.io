import React, { useEffect, useState } from 'react';
import { getVisibleHeroEl, dockAvatarEl } from '../utils/avatar-flight-refs';

const GITHUB_AVATAR = 'https://github.com/macorreag.png';
export const AVATAR_DOCK_THRESHOLD = 360;

const FLIGHT_START = 0.15;
const FLIGHT_END = 0.8;
const FADE_START = 0.8;
const FADE_END = 0.95;

const easeInOutCubic = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const clamp01 = v => Math.min(1, Math.max(0, v));

const FlyingAvatar = () => {
  const [style, setStyle] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let ticking = false;
    let raf = 0;

    const update = () => {
      ticking = false;
      const hero = getVisibleHeroEl();
      const dock = dockAvatarEl.current;
      if (!hero || !dock) {
        setStyle(null);
        return;
      }
      const p = clamp01(window.scrollY / AVATAR_DOCK_THRESHOLD);
      const e = clamp01((p - FLIGHT_START) / (FLIGHT_END - FLIGHT_START));
      if (e <= 0 || p >= FADE_END) {
        setStyle(null);
        return;
      }
      const hr = hero.getBoundingClientRect();
      const dr = dock.getBoundingClientRect();
      const t = easeInOutCubic(e);
      const s = 1 + (dr.width / hr.width - 1) * t;
      const opacity = p <= FADE_START ? 1 : 1 - clamp01((p - FADE_START) / (FADE_END - FADE_START));
      setStyle({
        width: hr.width,
        height: hr.height,
        transform: `translate(${(hr.left + (dr.left - hr.left) * t).toFixed(1)}px, ${(
          hr.top +
          (dr.top - hr.top) * t
        ).toFixed(1)}px) scale(${s.toFixed(4)})`,
        opacity,
      });
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      raf = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!style) return null;

  return (
    <img
      src={GITHUB_AVATAR}
      alt=""
      aria-hidden="true"
      className="fixed left-0 top-0 z-[80] rounded-full pointer-events-none object-cover"
      style={{
        ...style,
        transformOrigin: 'top left',
        border: '2px solid rgba(0, 255, 65, 0.7)',
        boxShadow: '0 0 24px rgba(0, 255, 65, 0.55)',
        willChange: 'transform',
      }}
    />
  );
};

export default FlyingAvatar;
