export const heroAvatarEl = { current: null };
export const heroAvatarDesktopEl = { current: null };
export const dockAvatarEl = { current: null };

export const getVisibleHeroEl = () => {
  const mobile = heroAvatarEl.current;
  const desktop = heroAvatarDesktopEl.current;
  if (desktop && desktop.getBoundingClientRect().width > 0) return desktop;
  if (mobile && mobile.getBoundingClientRect().width > 0) return mobile;
  return desktop || mobile;
};
