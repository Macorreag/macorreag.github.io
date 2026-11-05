import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard } from '@fortawesome/free-solid-svg-icons';

/**
 * id.card — la tarjeta de presentación que se auto-anota.
 *
 * Una sola cadena puede ser el email, el dominio y el usuario solo si todo vive
 * en el mismo dominio. Aquí no: el correo está en unal.edu.co y la web en
 * github.io, así que el elemento común es el handle. La tarjeta lo deja fijo en
 * el centro y cambia el protocolo que se le pega al lado: prefijo para
 * github/linkedin, sufijo para la web y el correo.
 *
 * El trazo del marco es puro CSS (flujo + inset), sin medición por JS: cuando
 * la dirección crece o se acorta, el marco la sigue solo.
 */

const HANDLE = 'macorreag';
const GLYPHS = 'abcdefghijklmnopqrstuvwxyz0123456789@./:_-';

const DOORS = [
  {
    id: 'github',
    side: 'pre',
    text: 'github.com/',
    address: 'github.com/macorreag',
    href: 'https://github.com/macorreag',
    label: 'github',
  },
  {
    id: 'website',
    side: 'suf',
    text: '.github.io',
    address: 'macorreag.github.io',
    href: 'https://macorreag.github.io/',
    label: 'website',
  },
  {
    id: 'linkedin',
    side: 'pre',
    text: 'linkedin.com/in/',
    address: 'linkedin.com/in/macorreag',
    href: 'https://www.linkedin.com/in/macorreag/',
    label: 'linkedin',
  },
  {
    id: 'email',
    side: 'suf',
    text: '@unal.edu.co',
    address: 'macorreag@unal.edu.co',
    href: 'mailto:macorreag@unal.edu.co',
    label: 'email',
  },
];

/** Resuelve el fragmento con scramble de caracteres (300 ms, ease-out). */
const useScramble = (target, motionOK, revealed) => {
  const [display, setDisplay] = useState(target);
  const settled = useRef(target);

  useEffect(() => {
    if (!revealed || !motionOK || settled.current === target) {
      settled.current = target;
      setDisplay(target);
      return undefined;
    }

    let raf = 0;
    let started = 0;
    const duration = 300;

    const tick = now => {
      if (!started) started = now;
      const progress = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      const shown = Math.round(eased * target.length);
      let out = '';

      for (let i = 0; i < target.length; i += 1) {
        out +=
          i < shown
            ? target.charAt(i)
            : GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
      }

      setDisplay(out);

      if (progress < 1) {
        raf = window.requestAnimationFrame(tick);
      } else {
        settled.current = target;
        setDisplay(target);
      }
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [target, motionOK, revealed]);

  return display;
};

const IdCard = () => {
  const [activeId, setActiveId] = useState('website');
  const [revealed, setRevealed] = useState(false);
  const [motionOK, setMotionOK] = useState(true);
  const plateRef = useRef(null);

  const door = DOORS.find(item => item.id === activeId) || DOORS[0];
  const frag = useScramble(door.text, motionOK, revealed);
  const isMail = door.href.indexOf('mailto:') === 0;

  // Preferencia de movimiento, sincronizada en vivo (el usuario puede cambiarla
  // sin recargar). En SSR se asume movimiento; el efecto corrige al montar.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;

    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setMotionOK(!query.matches);

    apply();

    if (query.addEventListener) query.addEventListener('change', apply);
    else if (query.addListener) query.addListener(apply);

    return () => {
      if (query.removeEventListener) query.removeEventListener('change', apply);
      else if (query.removeListener) query.removeListener(apply);
    };
  }, []);

  // Entrada al viewport (mismo patrón que components/reveal.js).
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return undefined;
    }

    const el = plateRef.current;
    if (!el) {
      setRevealed(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Sin movimiento: aparece de una, sin esperar al scroll.
  useEffect(() => {
    if (!motionOK) setRevealed(true);
  }, [motionOK]);

  // Trazo del marco: se reinicia en cada cambio de puerta. `mc-snap` apaga las
  // transiciones un instante para que el reinicio sea visible.
  useEffect(() => {
    const plate = plateRef.current;
    if (!plate || !revealed) return;

    if (!motionOK) {
      plate.setAttribute('data-draw', 'on');
      return;
    }

    plate.classList.add('mc-snap');
    plate.setAttribute('data-draw', 'off');
    void plate.offsetWidth;
    plate.classList.remove('mc-snap');
    plate.setAttribute('data-draw', 'on');
  }, [revealed, activeId, motionOK]);

  return (
    <section id="identidad" className="w-full max-w-6xl mx-auto mt-12 px-4 font-mono scroll-mt-20">
      <div className="bg-terminal-bg relative border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden rounded-sm">
        <div className="absolute inset-0 grid-lines-bg pointer-events-none opacity-40" />

        <div className="relative z-20 border-b border-white/10 p-4 md:p-6 flex flex-col md:flex-row justify-between items-baseline gap-4 bg-black/20">
          <div>
            <h2 className="font-display text-xl md:text-2xl font-bold tracking-[0.2em] text-white flex items-center gap-3">
              <FontAwesomeIcon icon={faIdCard} className="text-primary animate-pulse" size="sm" />
              ID.CARD
            </h2>
            <p className="text-xs text-white/50 tracking-widest uppercase mt-2 font-mono">
              Un handle, cuatro puertas. Cada anotación es una dirección real
            </p>
            <div className="h-0.5 w-24 bg-primary mt-2" />
          </div>
          <div className="text-xs tracking-widest text-gray-400 uppercase font-mono text-right">
            <div>
              <span className="text-primary font-bold">1</span> handle ·{' '}
              <span className="text-teal font-bold">4</span> puertas
            </div>
            <div className="mt-1">Toca una pestaña para reensamblar</div>
          </div>
        </div>

        <div className={`mc-idcard relative z-10 ${revealed ? 'is-in' : ''}`}>
          <div className="mc-plate" ref={plateRef} data-draw="off">
            <p className="mc-prompt" aria-hidden="true">
              <span>ID@CARD:~$</span> cat ./address
            </p>

            <div className="mc-line">
              <div className="mc-bracket" aria-hidden="true">
                <i className="mc-side mc-top" />
                <i className="mc-side mc-right" />
                <i className="mc-side mc-bottom" />
                <i className="mc-side mc-left" />
              </div>

              <a
                className="mc-addr"
                href={door.href}
                aria-label={`${door.label}: ${door.address}`}
                target={isMail ? undefined : '_blank'}
                rel={isMail ? undefined : 'noopener noreferrer'}
              >
                <span className="mc-slot" data-side="pre" aria-hidden="true">
                  {door.side === 'pre' && <span className="mc-frag">{frag}</span>}
                  {door.side === 'pre' && <span className="mc-tag mc-tag--door">{door.label}</span>}
                </span>

                <span className="mc-handle">
                  {HANDLE}
                  <span className="mc-tag mc-tag--me" aria-hidden="true">
                    me
                  </span>
                </span>

                <span className="mc-slot" data-side="suf" aria-hidden="true">
                  {door.side === 'suf' && <span className="mc-frag">{frag}</span>}
                  {door.side === 'suf' && <span className="mc-tag mc-tag--door">{door.label}</span>}
                </span>

                <span className="mc-caret" aria-hidden="true" />
              </a>
            </div>

            <div className="mc-tabs" role="group" aria-label="Elegir destino">
              {DOORS.map(item => (
                <button
                  key={item.id}
                  type="button"
                  className="mc-tab"
                  data-door={item.id}
                  aria-pressed={item.id === door.id}
                  onClick={() => setActiveId(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <p className="mc-hint">click en una pestaña cambia la dirección · click en la dirección la abre</p>
          </div>

          <p className="sr-only" aria-live="polite">
            {door.label}: {door.address}
          </p>
        </div>

        <div className="absolute top-0 left-0 w-4 h-4 md:w-6 md:h-6 border-t-2 border-l-2 border-primary/60 z-30" />
        <div className="absolute top-0 right-0 w-4 h-4 md:w-6 md:h-6 border-t-2 border-r-2 border-teal/60 z-30" />
        <div className="absolute bottom-0 left-0 w-4 h-4 md:w-6 md:h-6 border-b-2 border-l-2 border-teal/60 z-30" />
        <div className="absolute bottom-0 right-0 w-4 h-4 md:w-6 md:h-6 border-b-2 border-r-2 border-primary/60 z-30" />
      </div>
    </section>
  );
};

export default IdCard;
