import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark, faTerminal } from '@fortawesome/free-solid-svg-icons';
import useAvatarDock from '../hooks/useAvatarDock';
import { dockAvatarEl } from '../utils/avatar-flight-refs';

const GITHUB_AVATAR = 'https://github.com/macorreag.png';

const NAV_ITEMS = [
  { id: 'top', label: 'Inicio' },
  { id: 'formation', label: 'Formación' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experiencia' },
  { id: 'open-source', label: 'Proyectos' },
  { id: 'courses', label: 'Cursos' },
  { id: 'posts', label: 'Posts' },
];

const scrollToSection = id => {
  if (id === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export default () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState('top');
  const [landed, setLanded] = useState(false);
  const dockProgress = useAvatarDock();

  const dockOpacity = Math.min(1, Math.max(0, (dockProgress - 0.72) / 0.22));
  const dockScale = 0.7 + 0.3 * dockOpacity;

  useEffect(() => {
    if (dockProgress >= 1) {
      setLanded(true);
      const timer = setTimeout(() => setLanded(false), 950);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [dockProgress]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16);
      if (window.scrollY < 80) setActiveId('top');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const sections = NAV_ITEMS.filter(item => item.id !== 'top')
      .map(item => document.getElementById(item.id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: 0 },
    );

    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleNav = id => {
    setMenuOpen(false);
    scrollToSection(id);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 font-mono transition-colors duration-200 border-b ${
        scrolled
          ? 'bg-[#0d0d14]/95 backdrop-blur-md border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
          : 'bg-[#0d0d14]/70 backdrop-blur-sm border-transparent'
      }`}
    >
      <nav
        className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between h-14"
        aria-label="Navegación principal"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            ref={el => {
              dockAvatarEl.current = el;
            }}
            aria-hidden="true"
            className="relative h-7 w-7 shrink-0 rounded-full overflow-hidden border border-primary/60 shadow-[0_0_10px_rgba(0,255,65,0.4)]"
            style={{
              opacity: dockOpacity,
              transform: `scale(${dockScale})`,
              willChange: 'opacity, transform',
            }}
          >
            <span
              className={`absolute inset-0 rounded-full pointer-events-none z-10 ${
                landed ? 'avatar-dock-ring' : ''
              }`}
            />
            <img
              src={GITHUB_AVATAR}
              alt=""
              width={28}
              height={28}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <a
            href="#top"
            onClick={e => {
              e.preventDefault();
              handleNav('top');
            }}
            className="flex items-center gap-2 text-primary font-bold tracking-[0.2em] text-sm hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded-sm px-1 py-0.5"
          >
            <FontAwesomeIcon
              icon={faTerminal}
              className="text-primary"
              size="xs"
              aria-hidden="true"
            />
            MILLER_CORREA
            <span className="hidden sm:inline text-teal/60 font-normal text-xs tracking-widest">
              @portfolio
            </span>
          </a>
        </div>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(item => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={e => {
                  e.preventDefault();
                  handleNav(item.id);
                }}
                aria-current={activeId === item.id ? 'true' : undefined}
                className={`relative px-3 py-2 text-xs uppercase tracking-widest font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded-sm group ${
                  activeId === item.id ? 'text-primary' : 'text-white/60 hover:text-white'
                }`}
              >
                {activeId === item.id && (
                  <span className="absolute left-3 right-3 -bottom-0.5 h-px bg-primary shadow-[0_0_8px_#00ff41]" />
                )}
                <span className="hidden lg:inline text-primary/40 mr-1 text-[9px]">
                  {String(NAV_ITEMS.indexOf(item) + 1).padStart(2, '0')}_
                </span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white/70 hover:text-primary p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded-sm"
          onClick={() => setMenuOpen(prev => !prev)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          style={{ touchAction: 'manipulation' }}
        >
          <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} size="lg" aria-hidden="true" />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Menú móvil"
          className="md:hidden border-t border-white/10 bg-[#0d0d14]/98 backdrop-blur-md"
        >
          <ul className="px-4 py-3 flex flex-col gap-1">
            {NAV_ITEMS.map(item => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={e => {
                    e.preventDefault();
                    handleNav(item.id);
                  }}
                  aria-current={activeId === item.id ? 'true' : undefined}
                  className={`block px-3 py-2.5 text-sm uppercase tracking-widest font-bold border-l-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 ${
                    activeId === item.id
                      ? 'text-primary border-primary bg-primary/5'
                      : 'text-white/60 border-transparent hover:text-white hover:border-white/20'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};
