import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrochip, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import syncStatusFile from '../data/notion/sync-status.json';

// Agrupa las habilidades por su categoría (campo "skills" de Notion).
// Cada registro de Notion es: title = habilidad específica, skills = categorías.
const groupByCategory = nodes => {
  const groups = new Map();

  for (const skill of nodes) {
    const title = (skill.title || '').trim();
    if (!title) continue; // omite filas vacías

    const categories = skill.skills && skill.skills.length > 0 ? skill.skills : ['Otras'];

    for (const category of categories) {
      if (!groups.has(category)) groups.set(category, []);
      groups.get(category).push({
        title,
        description: (skill.description || '').trim(),
      });
    }
  }

  return [...groups.entries()]
    .sort((a, b) => b[1].length - a[1].length) // categorías con más items primero
    .map(([category, items]) => ({
      category,
      items: items.sort((a, b) => a.title.localeCompare(b.title, 'es')),
    }));
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
        }
      }
    }
  `);

  const categories = groupByCategory(data.allSkillsJson.nodes);
  const totalSkills = categories.reduce((sum, c) => sum + c.items.length, 0);

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
              Habilidades técnicas y blandas, agrupadas por categoría
            </p>
            <div className="h-0.5 w-24 bg-primary mt-2" />
          </div>
          <div className="text-xs tracking-widest text-gray-400 uppercase font-mono text-right">
            <div>
              <span className="text-primary font-bold">{totalSkills}</span> habilidades ·{' '}
              <span className="text-teal font-bold">{categories.length}</span> categorías
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

        {/* Categorías */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-20 p-4 md:p-6">
          {categories.map((group, index) => {
            const isPrimary = index % 2 === 0;
            const accentText = isPrimary ? 'text-primary' : 'text-teal';
            const accentBar = isPrimary ? 'bg-primary glow-coral' : 'bg-teal glow-teal';
            const accentBorder = isPrimary ? 'border-primary/40' : 'border-teal/40';
            const accentBg = isPrimary ? 'bg-primary/10' : 'bg-teal/10';

            return (
              <div
                key={group.category}
                className="bg-black/20 border border-white/10 rounded-sm p-5"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0))',
                }}
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <h3 className="font-display text-sm md:text-base font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faLayerGroup}
                      className={accentText}
                      size="xs"
                      aria-hidden="true"
                    />
                    {group.category}
                  </h3>
                  <span
                    className={`shrink-0 text-xs font-bold font-mono px-2 py-0.5 border rounded-sm ${accentText} ${accentBorder} ${accentBg}`}
                  >
                    {String(group.items.length).padStart(2, '0')}
                  </span>
                </div>

                <ul className="space-y-1.5">
                  {group.items.map(item => (
                    <li key={item.title} className="text-sm leading-snug">
                      <span className="text-white/85">
                        <span className={`mr-2 ${accentText}`} aria-hidden="true">
                          ▸
                        </span>
                        {item.title}
                      </span>
                      {item.description && (
                        <span className="block pl-5 text-xs text-white/45 mt-0.5 leading-relaxed">
                          {item.description}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="relative z-20 border-t border-white/20 p-3 md:p-4 bg-black/60 flex flex-col md:flex-row justify-between items-center gap-2 overflow-hidden">
          <div className="text-xs text-teal font-mono flex items-center gap-3">
            <span className="w-2 h-2 bg-teal rounded-full animate-pulse shadow-[0_0_8px_#00ff41]" />
            {totalSkills} habilidades · {categories.length} categorías
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
