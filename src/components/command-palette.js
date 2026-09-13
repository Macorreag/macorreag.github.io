import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { navigate } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faArrowRight,
  faCheck,
  faEnvelope,
  faGraduationCap,
  faMicrochip,
  faCode,
  faNewspaper,
  faTerminal,
  faXmark,
  faArrowUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';
import { faGithub, faMedium, faDev } from '@fortawesome/free-brands-svg-icons';

import skillsFile from '../data/notion/skills.json';
import presencialFile from '../data/education/presencial.json';
import onlineFile from '../data/education/online.json';
import othersFile from '../data/education/others.json';

/**
 * Paleta de comandos (Ctrl/Cmd + K).
 *
 * Es el primitivo de navegación agéntica más barato que existe: cero backend,
 * cero latencia y cero llamadas a un LLM. Todo se resuelve en el cliente contra
 * datos que ya están en el bundle o en la caché de sesión, así que funciona
 * incluso si el Worker del copiloto está caído.
 *
 * El LLM, si algún día entra aquí, debe ser el *fallback* para lo ambiguo: el
 * caso común (ir a una sección, abrir un repo, copiar el correo) no lo necesita.
 */

export const OPEN_EVENT = 'mc:open-command-palette';

const CONTACT_EMAIL = 'macorreag@unal.edu.co';
const GITHUB_URL = 'https://github.com/macorreag';
const MEDIUM_URL = 'https://medium.com/@macorreag';
const DEV_URL = 'https://dev.to/macorreag';
const MAX_RESULTS = 40;
const HIGHLIGHT_MS = 1800;

const REPOS_CACHE_KEY = 'repos';
const BLOG_CACHE_KEY = 'blog';
const MAX_CACHED_REPOS = 25;
const MAX_CACHED_POSTS = 12;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const scrollBehavior = () => (prefersReducedMotion() ? 'auto' : 'smooth');

/** minúsculas sin acentos, para que "formacion" encuentre "Formación". */
const normalize = text =>
  String(text == null ? '' : text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

/**
 * Puntúa una coincidencia. Devuelve -1 si no hay ninguna.
 * Prioriza coincidencia exacta > prefijo > inclusión > subsecuencia, que es
 * suficiente para listas cortas y evita traer una librería de fuzzy search.
 */
const scoreOf = (haystack, query) => {
  if (!query) return 1;
  const text = normalize(haystack);
  if (!text) return -1;
  if (text === query) return 100;
  if (text.startsWith(query)) return 70 - Math.min(text.length - query.length, 20);
  const at = text.indexOf(query);
  if (at >= 0) return 40 - Math.min(at, 25);
  // subsecuencia: "rct" encuentra "React"
  let cursor = 0;
  for (let i = 0; i < text.length && cursor < query.length; i += 1) {
    if (text[i] === query[cursor]) cursor += 1;
  }
  return cursor === query.length ? 8 : -1;
};

/** Resalta un elemento tras el scroll; se limpia solo. */
const flashElement = element => {
  if (!element || !element.style) return;
  const previous = {
    outline: element.style.outline,
    offset: element.style.outlineOffset,
    transition: element.style.transition,
  };
  element.style.transition = 'outline-color .2s ease';
  element.style.outline = '2px solid rgba(0, 255, 65, .8)';
  element.style.outlineOffset = '4px';
  window.setTimeout(() => {
    element.style.outline = previous.outline;
    element.style.outlineOffset = previous.offset;
    element.style.transition = previous.transition;
  }, HIGHLIGHT_MS);
};

/**
 * Busca el elemento más específico dentro de una sección que contenga el texto.
 * Se queda con el de texto más corto: en una lista anidada, el contenedor
 * exterior también contiene la palabra, y no es lo que queremos resaltar.
 */
const findDeepestMatch = (root, needle) => {
  const target = normalize(needle);
  if (!target) return null;
  const nodes = Array.from(root.querySelectorAll('h1, h2, h3, h4, li, article'));
  let best = null;
  let bestLength = Infinity;
  for (const node of nodes) {
    const text = normalize(node.textContent);
    if (!text.includes(target)) continue;
    const length = String(node.textContent || '').length;
    if (length < bestLength) {
      best = node;
      bestLength = length;
    }
  }
  return best;
};

/**
 * Lleva a una sección de la landing. Si la sección no está en el documento
 * actual (estamos en /presencial, por ejemplo), navega con el hash y espera a
 * que Gatsby monte la landing: el elemento no existe en el primer frame.
 */
const goToSection = (id, needle) => {
  if (typeof window === 'undefined') return;

  if (id === 'top') {
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
    return;
  }

  const reveal = (attemptsLeft) => {
    const section = document.getElementById(id);
    if (section) {
      const target = (needle && findDeepestMatch(section, needle)) || section;
      target.scrollIntoView({
        behavior: scrollBehavior(),
        block: needle && target !== section ? 'center' : 'start',
      });
      if (target !== section) flashElement(target);
      return;
    }
    if (attemptsLeft > 0) window.requestAnimationFrame(() => reveal(attemptsLeft - 1));
  };

  if (!document.getElementById(id)) {
    navigate('/#' + id);
    // ~90 frames ≈ 1,5 s de margen para el routing cliente de Gatsby.
    window.requestAnimationFrame(() => reveal(90));
    return;
  }

  reveal(0);
};

const copyText = async text => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    // sigue el fallback
  }
  try {
    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.appendChild(field);
    field.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(field);
    return ok;
  } catch (err) {
    return false;
  }
};

const openExternal = url => {
  window.open(url, '_blank', 'noopener');
};

// ── Registro de comandos ────────────────────────────────────────────────────
// Estático y determinista. Cada comando trae sus propias palabras clave para
// que la búsqueda funcione con el vocabulario real de la gente.

const SECTION_COMMANDS = [
  { id: 'top', title: 'Inicio', subtitle: 'Arriba de todo', keywords: 'home portada principio' },
  { id: 'formation', title: 'Formación', subtitle: 'Estudios e instituciones', keywords: 'educacion universidad academia estudios' },
  { id: 'skills', title: 'Skills', subtitle: 'Habilidades técnicas', keywords: 'habilidades stack tecnologias' },
  { id: 'experience', title: 'Experiencia', subtitle: 'Trayectoria profesional', keywords: 'trabajo empleo empresas carrera cv' },
  { id: 'open-source', title: 'Proyectos', subtitle: 'Repositorios en GitHub', keywords: 'repos open source codigo github proyectos' },
  { id: 'courses', title: 'Cursos', subtitle: 'Cursos de Código Facilito', keywords: 'cursos codigofacilito formacion' },
  { id: 'posts', title: 'Posts', subtitle: 'Artículos en Medium y DEV', keywords: 'blog articulos medium dev escritos' },
].map(item => ({
  id: 'section:' + item.id,
  group: 'Ir a',
  title: item.title,
  subtitle: item.subtitle,
  keywords: item.keywords,
  icon: faTerminal,
  run: () => goToSection(item.id),
}));

const educationPages = [presencialFile, onlineFile, othersFile];

const PAGE_COMMANDS = educationPages.map(page => ({
  id: 'page:' + page.slug,
  group: 'Páginas',
  title: page.title,
  subtitle: page.description,
  keywords: 'formacion academica ' + page.slug + ' ' + page.items.map(i => i.name).join(' '),
  icon: faGraduationCap,
  run: () => navigate('/' + page.slug),
}));

/** Categorías de skills, derivadas del mismo JSON que alimenta la sección. */
const skillCategories = () => {
  const counts = new Map();
  for (const skill of skillsFile) {
    const categories =
      skill.skills && skill.skills.length > 0 ? skill.skills : ['Otras'];
    for (const category of categories) {
      counts.set(category, (counts.get(category) || 0) + 1);
    }
  }
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
};

const SKILL_COMMANDS = skillCategories().map(([category, count]) => ({
  id: 'skill:' + category,
  group: 'Habilidades',
  title: category,
  subtitle: count + (count === 1 ? ' habilidad' : ' habilidades'),
  keywords: 'skill habilidad ' + category,
  icon: faMicrochip,
  run: () => goToSection('skills', category),
}));

const CONTACT_COMMANDS = [
  {
    id: 'contact:email',
    group: 'Contacto',
    title: 'Copiar email',
    subtitle: CONTACT_EMAIL,
    keywords: 'contacto correo mail escribir',
    icon: faEnvelope,
    copy: CONTACT_EMAIL,
    run: () => copyText(CONTACT_EMAIL),
  },
  {
    id: 'contact:github',
    group: 'Contacto',
    title: 'Abrir GitHub',
    subtitle: 'github.com/macorreag',
    keywords: 'contacto codigo perfil repos',
    icon: faGithub,
    external: true,
    run: () => openExternal(GITHUB_URL),
  },
  {
    id: 'contact:medium',
    group: 'Contacto',
    title: 'Abrir Medium',
    subtitle: 'medium.com/@macorreag',
    keywords: 'contacto blog articulos',
    icon: faMedium,
    external: true,
    run: () => openExternal(MEDIUM_URL),
  },
  {
    id: 'contact:dev',
    group: 'Contacto',
    title: 'Abrir DEV',
    subtitle: 'dev.to/macorreag',
    keywords: 'contacto blog articulos comunidad',
    icon: faDev,
    external: true,
    run: () => openExternal(DEV_URL),
  },
  {
    id: 'contact:all-repos',
    group: 'Contacto',
    title: 'Ver todos los repositorios',
    subtitle: 'github.com/macorreag',
    keywords: 'proyectos repos open source github',
    icon: faCode,
    external: true,
    run: () => openExternal(GITHUB_URL + '?tab=repositories'),
  },
];

/**
 * Contenido ya cargado por la página, leído de la caché de sesión que
 * escriben `repos.js` y `blog.js`. No se hace ninguna petición nueva: si la
 * sección aún no se ha cargado, esos comandos simplemente no aparecen.
 * La caché vive en sessionStorage, así que su antigüedad está acotada por la
 * pestaña y no hace falta comprobar el TTL aquí.
 */
export const readCachedCommands = () => {
  const commands = [];
  if (typeof window === 'undefined' || !window.sessionStorage) return commands;

  try {
    const raw = window.sessionStorage.getItem(REPOS_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const repos = (parsed && parsed.repos) || [];
      repos.slice(0, MAX_CACHED_REPOS).forEach(repo => {
        if (!repo || !repo.name || !repo.html_url) return;
        commands.push({
          id: 'repo:' + repo.id,
          group: 'Proyectos',
          title: repo.name,
          subtitle: repo.description || repo.language || 'Repositorio en GitHub',
          keywords:
            'repo proyecto ' +
            [repo.language, repo.name, (repo.topics || []).join(' ')].join(' '),
          icon: faCode,
          external: true,
          run: () => openExternal(repo.html_url),
        });
      });
    }
  } catch (err) {
    // caché corrupta: se ignora
  }

  try {
    const raw = window.sessionStorage.getItem(BLOG_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const items = (parsed && parsed.items) || [];
      items.slice(0, MAX_CACHED_POSTS).forEach(post => {
        if (!post || !post.title || !post.link) return;
        commands.push({
          id: 'post:' + post.link,
          group: 'Posts',
          title: post.title,
          subtitle: post.source ? 'Artículo en ' + post.source : 'Artículo',
          keywords: 'post articulo blog ' + post.source,
          icon: faNewspaper,
          external: true,
          run: () => openExternal(post.link),
        });
      });
    }
  } catch (err) {
    // caché corrupta: se ignora
  }

  return commands;
};

const BASE_COMMANDS = [
  ...SECTION_COMMANDS,
  ...PAGE_COMMANDS,
  ...SKILL_COMMANDS,
  ...CONTACT_COMMANDS,
];

const GROUP_ORDER = ['Ir a', 'Páginas', 'Habilidades', 'Proyectos', 'Posts', 'Contacto'];

const rank = (commands, query) => {
  const scored = [];
  for (const command of commands) {
    const best = Math.max(
      scoreOf(command.title, query),
      scoreOf(command.subtitle, query) * 0.6,
      scoreOf(command.keywords, query) * 0.5,
    );
    if (best > 0) scored.push({ command, score: best });
  }
  scored.sort((a, b) => {
    const groupDelta =
      GROUP_ORDER.indexOf(a.command.group) - GROUP_ORDER.indexOf(b.command.group);
    if (!query && groupDelta !== 0) return groupDelta;
    if (b.score !== a.score) return b.score - a.score;
    return groupDelta;
  });
  return scored.slice(0, MAX_RESULTS).map(entry => entry.command);
};

// ── UI ──────────────────────────────────────────────────────────────────────

export const CommandPaletteTrigger = ({ className = '' }) => {
  const [hint, setHint] = useState('Ctrl K');

  useEffect(() => {
    const platform = (navigator.platform || navigator.userAgent || '').toLowerCase();
    if (platform.includes('mac')) setHint('\u2318K');
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_EVENT))}
      aria-keyshortcuts="Control+K Meta+K"
      className={
        'flex items-center gap-2 text-white/60 hover:text-primary border border-white/15 hover:border-primary/50 px-2.5 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded-sm ' +
        className
      }
    >
      <FontAwesomeIcon icon={faMagnifyingGlass} size="xs" aria-hidden="true" />
      {/* El texto y la tecla solo aparecen cuando hay sitio de sobra: en md/lg el
          nav ya va justo de ancho con sus 7 enlaces, así que ahí queda el icono. */}
      <span className="hidden xl:inline text-[11px] font-bold uppercase tracking-widest">
        Buscar
      </span>
      <kbd className="hidden xl:inline text-[10px] font-mono border border-white/20 px-1.5 py-0.5 rounded-sm text-white/45">
        {hint}
      </kbd>
      <span className="sr-only">Abrir la paleta de comandos</span>
    </button>
  );
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [cached, setCached] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [mounted, setMounted] = useState(false);

  const inputRef = useRef(null);
  const listRef = useRef(null);
  const previousFocus = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActiveIndex(0);
    setCopiedId(null);
  }, []);

  const openPalette = useCallback(() => {
    previousFocus.current = document.activeElement;
    setCached(readCachedCommands());
    setQuery('');
    setActiveIndex(0);
    setOpen(true);
  }, []);

  // Atajo global. Ctrl+K lo usa el navegador para su barra de búsqueda, así que
  // hay que interceptarlo antes de que lo haga él.
  useEffect(() => {
    const onKeyDown = event => {
      const isPaletteKey =
        (event.key === 'k' || event.key === 'K') && (event.metaKey || event.ctrlKey);
      if (isPaletteKey) {
        event.preventDefault();
        if (open) close();
        else openPalette();
      }
    };
    const onOpenEvent = () => openPalette();

    document.addEventListener('keydown', onKeyDown);
    window.addEventListener(OPEN_EVENT, onOpenEvent);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener(OPEN_EVENT, onOpenEvent);
    };
  }, [open, close, openPalette]);

  // Bloqueo del scroll de fondo mientras la paleta está abierta.
  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // Foco al input al abrir, y de vuelta a donde estaba al cerrar.
  useEffect(() => {
    if (open) {
      const timer = window.setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 0);
      return () => window.clearTimeout(timer);
    }
    if (previousFocus.current && previousFocus.current.focus) {
      previousFocus.current.focus();
    }
    return undefined;
  }, [open]);

  const commands = useMemo(
    () => (open ? rank([...cached, ...BASE_COMMANDS], normalize(query)) : []),
    [open, cached, query],
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Mantiene visible la opción activa al navegar con el teclado.
  useEffect(() => {
    if (!open || !listRef.current) return;
    const node = listRef.current.querySelector('[data-index="' + activeIndex + '"]');
    if (node && node.scrollIntoView) node.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  const runCommand = useCallback(
    async command => {
      if (!command) return;
      if (command.copy) {
        const ok = await copyText(command.copy);
        if (ok) {
          setCopiedId(command.id);
          window.setTimeout(() => close(), 900);
          return;
        }
      }
      close();
      // Se ejecuta tras cerrar para que el scroll no compita con el desmontaje.
      window.setTimeout(() => command.run(), 0);
    },
    [close],
  );

  const onKeyDown = event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex(index => (commands.length ? (index + 1) % commands.length : 0));
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex(index =>
        commands.length ? (index - 1 + commands.length) % commands.length : 0,
      );
      return;
    }
    if (event.key === 'Home') {
      event.preventDefault();
      setActiveIndex(0);
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      setActiveIndex(Math.max(0, commands.length - 1));
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      runCommand(commands[activeIndex]);
      return;
    }
    // Trampa de foco: la paleta es modal y el único foco vive dentro.
    if (event.key === 'Tab') {
      event.preventDefault();
      if (inputRef.current) inputRef.current.focus();
    }
  };

  if (!mounted || !open) return null;

  const listId = 'mc-palette-list';
  const activeCommand = commands[activeIndex];
  const activeId = activeCommand
    ? 'mc-palette-option-' + activeCommand.id.replace(/[^a-zA-Z0-9_-]/g, '_')
    : undefined;

  let lastGroup = null;

  const dialog = (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh] pb-4"
      style={{ fontFamily: "'Fira Code', ui-monospace, monospace" }}
    >
      <div
        className="mc-palette-backdrop absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Paleta de comandos"
        onKeyDown={onKeyDown}
        className="mc-palette-panel relative w-full max-w-xl bg-[#0d0d14] border border-primary/40 shadow-[0_0_60px_rgba(0,255,65,0.18)] rounded-sm overflow-hidden"
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="text-primary" size="sm" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Ir a una sección, buscar un repo, copiar el correo…"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={activeId}
            aria-autocomplete="list"
            aria-label="Buscar comandos"
            autoComplete="off"
            spellCheck="false"
            className="flex-1 bg-transparent border-0 outline-none text-white text-sm placeholder:text-white/30"
          />
          <button
            type="button"
            onClick={close}
            aria-label="Cerrar la paleta"
            className="text-white/40 hover:text-primary transition-colors p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded-sm"
          >
            <FontAwesomeIcon icon={faXmark} size="sm" aria-hidden="true" />
          </button>
        </div>

        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label="Comandos disponibles"
          className="mc-palette-scroll max-h-[52vh] overflow-y-auto py-1"
        >
          {commands.length === 0 && (
            <li className="px-4 py-6 text-center text-white/40 text-xs">
              Sin resultados para «{query}». Prueba con <span className="text-primary">skills</span>,{' '}
              <span className="text-primary">react</span> o{' '}
              <span className="text-primary">correo</span>.
            </li>
          )}
          {commands.map((command, index) => {
            const header = command.group !== lastGroup ? command.group : null;
            lastGroup = command.group;
            const isActive = index === activeIndex;
            const optionId = 'mc-palette-option-' + command.id.replace(/[^a-zA-Z0-9_-]/g, '_');
            return (
              <React.Fragment key={command.id}>
                {header && (
                  <li
                    role="presentation"
                    className="px-4 pt-3 pb-1 text-[10px] uppercase tracking-[0.2em] text-white/30"
                  >
                    {header}
                  </li>
                )}
                <li
                  id={optionId}
                  data-index={index}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => runCommand(command)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={
                    'mx-2 px-3 py-2 rounded-sm flex items-center gap-3 cursor-pointer ' +
                    (isActive ? 'bg-primary/12 border-l-2 border-primary' : 'border-l-2 border-transparent')
                  }
                >
                  <FontAwesomeIcon
                    icon={copiedId === command.id ? faCheck : command.icon}
                    className={copiedId === command.id ? 'text-primary' : 'text-teal'}
                    size="sm"
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-white truncate">
                      {copiedId === command.id ? 'Copiado' : command.title}
                    </span>
                    {command.subtitle && (
                      <span className="block text-[11px] text-white/40 truncate">
                        {command.subtitle}
                      </span>
                    )}
                  </span>
                  <FontAwesomeIcon
                    icon={command.external ? faArrowUpRightFromSquare : faArrowRight}
                    className={isActive ? 'text-primary' : 'text-white/20'}
                    size="xs"
                    aria-hidden="true"
                  />
                </li>
              </React.Fragment>
            );
          })}
        </ul>

        <div className="flex items-center justify-between gap-3 px-4 py-2 border-t border-white/10 text-[10px] text-white/35">
          <span className="flex items-center gap-3">
            <span>
              <kbd className="font-mono border border-white/20 px-1 rounded-sm">↑↓</kbd> navegar
            </span>
            <span>
              <kbd className="font-mono border border-white/20 px-1 rounded-sm">↵</kbd> abrir
            </span>
            <span>
              <kbd className="font-mono border border-white/20 px-1 rounded-sm">esc</kbd> cerrar
            </span>
          </span>
          <span>{commands.length} resultado{commands.length === 1 ? '' : 's'}</span>
        </div>

        <p role="status" aria-live="polite" className="sr-only">
          {commands.length} resultados disponibles
        </p>
      </div>
    </div>
  );

  return ReactDOM.createPortal(dialog, document.body);
}
