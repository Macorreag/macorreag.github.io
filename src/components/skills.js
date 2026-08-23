import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrochip, faBolt } from '@fortawesome/free-solid-svg-icons';
import syncStatusFile from '../data/notion/sync-status.json';

// Convierte el campo "experiencia" (años) en un valor numérico seguro.
// Si no es numérico (o está vacío), devuelve null para no mostrar la barra.
const parseYears = experience => {
  const num = Number(experience);
  return Number.isFinite(num) && num > 0 ? num : null;
};

// Etiqueta legible para la experiencia: "3 años", "1 año".
const formatYears = years => `${years} ${years === 1 ? 'año' : 'años'}`;

// Variantes de color por tarjeta (clases literales para que Tailwind JIT las detecte).
const ACCENTS = {
  primary: {
    badge: 'text-primary border-primary/40 bg-primary/10',
    bolt: 'text-primary',
    years: 'text-primary',
    bar: 'bg-primary glow-coral',
    tag: 'border-primary/40 text-white/80 bg-white/5 hover:bg-white/10',
  },
  teal: {
    badge: 'text-teal border-teal/40 bg-teal/10',
    bolt: 'text-teal',
    years: 'text-teal',
    bar: 'bg-teal glow-teal',
    tag: 'border-teal/40 text-white/80 bg-white/5 hover:bg-white/10',
  },
};

// Tarjeta individual de una competencia. Muestra TODA la información útil
// que viene de Notion: título, descripción, años de experiencia y tecnologías.
const SkillCard = ({ skill, index, maxYears }) => {
  const isPrimary = index % 2 === 0;
  const accent = ACCENTS[isPrimary ? 'primary' : 'teal'];
  const years = parseYears(skill.experience);

  // Ancho relativo de la barra respecto a la competencia con más años.
  const barWidth = years && maxYears ? Math.round((years / maxYears) * 100) : 0;

  return (
    <article
      className="bg-black/20 border border-white/10 rounded-sm p-5 flex flex-col gap-3 hover:border-white/25 transition-colors"
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0))',
      }}
    >
      {/* Título + años de experiencia */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-base md:text-lg font-bold text-white tracking-tight leading-snug">
          {skill.title}
        </h3>
        {years && (
          <span
            className={`shrink-0 text-xs font-bold font-mono uppercase tracking-wider px-2.5 py-1 border rounded-sm ${accent.badge}`}
          >
            {formatYears(years)}
          </span>
        )}
      </div>

      {/* Descripción (antes no se mostraba) */}
      <p className="text-sm leading-relaxed text-white/70">
        {skill.description || 'Sin descripción disponible.'}
      </p>

      {/* Barra de experiencia relativa + etiqueta */}
      {years && (
        <div className="mt-auto pt-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-mono flex items-center gap-1.5">
              <FontAwesomeIcon
                icon={faBolt}
                className={`${accent.bolt} text-[9px]`}
                aria-hidden="true"
              />
              Experiencia
            </span>
            <span className={`text-xs font-mono font-semibold ${accent.years}`}>
              {formatYears(years)}
            </span>
          </div>
          <div className="w-full h-1.5 bg-black/40 border border-white/5 overflow-hidden">
            <div className={`h-full ${accent.bar}`} style={{ width: `${barWidth}%` }} />
          </div>
        </div>
      )}

      {/* Tecnologías */}
      {skill.skills && skill.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {skill.skills.map((tag, i) => (
            <span
              key={i}
              className={`px-2 py-0.5 border text-[11px] font-mono transition cursor-default ${accent.tag}`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
};

const Skills = () => {
  const data = useStaticQuery(graphql`
    query SkillsQuery {
      allSkillsJson {
        nodes {
          id
          title
          description
          skills
          experience
        }
      }
    }
  `);

  // Ordena por años de experiencia (mayor a menor) para que lo más relevante aparezca primero.
  const skills = [...data.allSkillsJson.nodes].sort((a, b) => {
    const aYears = parseYears(a.experience) || 0;
    const bYears = parseYears(b.experience) || 0;
    return bYears - aYears;
  });

  const maxYears = Math.max(...skills.map(s => parseYears(s.experience) || 0), 1);

  const syncStatus = syncStatusFile.skills || {};
  const isSynced = syncStatus.source === 'notion';
  const lastSyncLabel =
    syncStatus && syncStatus.lastSyncedAt
      ? new Date(syncStatus.lastSyncedAt).toISOString().slice(0, 10)
      : null;

  return (
    <section id="skills" className="w-full max-w-6xl mx-auto mt-12 px-4 font-mono scroll-mt-20">
      {/* Terminal Container */}
      <div className="bg-terminal-bg relative border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden rounded-sm">
        {/* Grid Background */}
        <div className="absolute inset-0 grid-lines-bg pointer-events-none opacity-40" />

        {/* Header */}
        <div className="relative z-20 border-b border-white/10 p-4 md:p-6 flex flex-col md:flex-row justify-between items-baseline gap-4 bg-black/20">
          <div>
            <h2 className="font-display text-xl md:text-2xl font-bold tracking-[0.2em] text-white flex items-center gap-3">
              <FontAwesomeIcon
                icon={faMicrochip}
                className="text-primary animate-pulse"
                size="sm"
              />
              SKILLS
            </h2>
            <p className="text-xs text-white/50 tracking-widest uppercase mt-2 font-mono">
              Habilidades técnicas y tecnologías
            </p>
            <div className="h-0.5 w-24 bg-primary mt-2" />
          </div>
          <div className="text-xs tracking-widest text-gray-400 uppercase font-mono text-right">
            <div>
              Módulos:{' '}
              <span className="text-primary font-bold">
                {String(skills.length).padStart(2, '0')}
              </span>
            </div>
            {isSynced ? (
              <div className="mt-1">
                <span className="text-teal font-bold">Sincronizado</span> · {lastSyncLabel}
              </div>
            ) : (
              <div className="mt-1 text-amber-400 font-bold">Datos de ejemplo</div>
            )}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-20 p-4 md:p-6">
          {skills.map((skill, index) => (
            <SkillCard key={skill.id} skill={skill} index={index} maxYears={maxYears} />
          ))}
        </div>

        {/* Footer */}
        <div className="relative z-20 border-t border-white/20 p-3 md:p-4 bg-black/60 flex flex-col md:flex-row justify-between items-center gap-2 overflow-hidden">
          <div className="text-xs text-teal font-mono flex items-center gap-3">
            <span className="w-2 h-2 bg-teal rounded-full animate-pulse shadow-[0_0_8px_#00ff41]" />
            {skills.length} competencias cargadas
          </div>
          <div className="text-xs text-white/50 font-mono">
            Fuente: {isSynced ? 'Notion' : 'placeholder local'} (src/data/notion/skills.json)
          </div>
        </div>

        {/* Corner Decorations */}
        <div className="absolute top-0 left-0 w-4 h-4 md:w-6 md:h-6 border-t-2 border-l-2 border-primary/60 z-30" />
        <div className="absolute top-0 right-0 w-4 h-4 md:w-6 md:h-6 border-t-2 border-r-2 border-teal/60 z-30" />
        <div className="absolute bottom-0 left-0 w-4 h-4 md:w-6 md:h-6 border-b-2 border-l-2 border-teal/60 z-30" />
        <div className="absolute bottom-0 right-0 w-4 h-4 md:w-6 md:h-6 border-b-2 border-r-2 border-primary/60 z-30" />
      </div>
    </section>
  );
};

export default Skills;
