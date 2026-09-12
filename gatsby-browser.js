import './src/styles/global.css';
import './src/styles/personalization.css';

// ---- Navegación fluida entre páginas (landing <-> /presencial /on-line /others)
// Al llegar a una ruta con hash (#sección), scroll suave al elemento con
// reintentos cortos mientras las animaciones Reveal terminan de montar.
const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const onRouteUpdate = ({ location }, pluginOptions = {}) => {
  if (!location.hash || location.hash.length < 2) return undefined;
  const offset = typeof pluginOptions.offset === 'number' ? pluginOptions.offset : 0;
  const id = decodeURIComponent(location.hash.slice(1));
  let tries = 0;
  let timer;
  const scroll = () => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
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

// Transición sutil de entrada en cada cambio de página (sin dependencias).
export const wrapPageElement = ({ element, props }) => (
  <div key={props.location.pathname} className="mcp-page-fade">
    {element}
  </div>
);
