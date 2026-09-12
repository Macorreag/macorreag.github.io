import './src/styles/global.css';
import './src/styles/personalization.css';

// ---- Navegación fluida entre páginas (landing <-> /presencial /on-line /others)
// Sin JSX ni APIs de React aquí: este archivo corre antes del montaje y un
// error suyo tumba TODO el runtime cliente.
//
// Al llegar a una ruta con hash (#sección), scroll suave al elemento con
// reintentos cortos mientras las animaciones Reveal terminan de montar.
const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const onRouteUpdate = ({ location }) => {
  if (!location.hash || location.hash.length < 2) return undefined;
  const id = decodeURIComponent(location.hash.slice(1));
  let tries = 0;
  let timer;
  const scroll = () => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'start',
      });
      return;
    }
    if (tries++ < 10) timer = setTimeout(scroll, 100);
  };
  timer = setTimeout(scroll, 50);
  return () => clearTimeout(timer);
};

// Con hash el scroll lo maneja onRouteUpdate; sin hash, comportamiento por
// defecto de Gatsby (ir al inicio de la página nueva).
export const shouldUpdateScroll = ({ routerProps: { location } }) => {
  if (location.hash && location.hash.length > 1) return false;
  return true;
};
