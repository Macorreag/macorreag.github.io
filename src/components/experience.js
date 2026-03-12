import React, { useState } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faBolt, faLocationDot, faChevronDown } from '@fortawesome/free-solid-svg-icons';

const formatDate = (dateStr) => {
  if (!dateStr) return 'Presente';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('es-CO', { month: '2-digit', year: 'numeric' });
};

const ExperienceItem = ({ item, index, isOpen, onToggle }) => {
  const isCoral = index % 2 === 0;
  const accentColor = isCoral ? 'primary' : 'teal';
  const glowStyle = isCoral
    ? {
        border: '1px solid rgba(255, 102, 0, 0.3)',
        boxShadow: '0 0 15px rgba(255, 102, 0, 0.1), inset 0 0 10px rgba(255, 102, 0, 0.05)',
      }
    : {
        border: '1px solid rgba(0, 245, 255, 0.3)',
        boxShadow: '0 0 15px rgba(0, 245, 255, 0.1), inset 0 0 10px rgba(0, 245, 255, 0.05)',
      };

  const nodeId = `${item.compania || 'NODE'}_v${index + 1}.0`
    .toUpperCase()
    .replace(/\s+/g, '_');
  const startYear = item.fechaInicio ? new Date(item.fechaInicio).getFullYear() : 'N/A';

  return (
    <div className="relative flex gap-8 md:gap-12 group">
      {/* Year column */}
      <div className="flex flex-col items-center w-16 md:w-20 shrink-0">
        <div
          className="relative z-20 mt-2"
          style={{
            width: '12px',
            height: '12px',
            background: isCoral ? '#FF6600' : '#00F5FF',
            border: '1px solid rgba(255,255,255,0.5)',
            boxShadow: isCoral ? '0 0 15px #FF6600' : '0 0 15px #00F5FF',
          }}
        />
        <span
          className={`font-display text-xs md:text-sm font-black tracking-tighter mt-6 ${isCoral ? 'text-primary' : 'text-teal'}`}
        >
          {startYear}
        </span>
      </div>

      {/* Card */}
      <div className="flex-1 mb-0">
        <div
          className="bg-terminal-bg rounded-sm overflow-hidden"
          style={{
            backdropFilter: 'blur(16px) saturate(180%)',
            backgroundColor: 'rgba(20, 20, 25, 0.6)',
            ...glowStyle,
          }}
        >
          {/* Terminal header bar */}
          <div className="bg-white/5 border-b border-white/10 px-4 py-2 flex justify-between items-center">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-primary/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-teal/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
            </div>
            <span className="text-xs font-bold font-mono uppercase tracking-widest hidden sm:block" style={{ color: 'rgba(0, 245, 255, 0.5)' }}>
              Node_Identity: {nodeId}
            </span>
          </div>

          {/* Toggle button / summary row */}
          <button
            className="w-full text-left p-4 md:p-6 focus:outline-none group/btn text-white"
            onClick={onToggle}
            aria-expanded={isOpen}
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
              <div>
                <h3 className="font-display text-lg md:text-2xl font-black text-white tracking-tight">
                  {item.compania || '—'}
                </h3>
                <p
                  className={`text-xs uppercase tracking-widest font-bold opacity-80 mt-1 font-mono ${isCoral ? 'text-primary' : 'text-teal'}`}
                >
                  {item.nombre || '—'}
                </p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <span className="text-xs text-white/40 block mb-1 font-mono uppercase tracking-widest">
                    Timestamp
                  </span>
                  <span
                    className={`text-xs font-bold tracking-widest font-mono ${isCoral ? 'text-primary' : 'text-teal'}`}
                  >
                    {formatDate(item.fechaInicio)} — {formatDate(item.fechaFin)}
                  </span>
                </div>
                {/* Expand/collapse icon */}
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`text-sm font-bold transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} ${isCoral ? 'text-primary' : 'text-teal'}`}
                  style={{ display: 'inline-block' }}
                />
              </div>
            </div>
          </button>

          {/* Collapsible content */}
          {isOpen && (
            <div className="px-4 md:px-6 pb-6 border-t border-white/10">
              <div className="mt-6 relative">
                <FontAwesomeIcon
                  icon={faBolt}
                  className={`text-xs absolute -left-2 top-0 italic font-bold opacity-40 ${isCoral ? 'text-primary' : 'text-teal'}`}
                />
                <p className="text-sm leading-relaxed pl-3" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  {item.descripcion || 'Sin descripción disponible.'}
                </p>
              </div>
              {/* Metadata footer */}
              <div
                className={`mt-6 p-4 bg-black/40 border-l-2 space-y-2 text-xs font-mono ${isCoral ? 'border-primary/40' : 'border-teal/40'}`}
              >
                <div className="flex justify-between">
                  <span className="uppercase tracking-widest" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>Compañía:</span>
                  <span className="uppercase" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>{item.compania || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="uppercase tracking-widest" style={{ color: 'rgba(255, 255, 255, 0.3)' }}>Estado:</span>
                  <span className={isCoral ? 'text-primary' : 'text-teal'}>
                    {item.fechaFin ? 'Finalizado' : 'Activo'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Experience = () => {
  const data = useStaticQuery(graphql`
    query ExperienceQuery {
      allExperienceJson {
        nodes {
          id
          nombre
          compania
          fechaInicio
          fechaFin
          descripcion
        }
      }
    }
  `);

  const experiences = data.allExperienceJson.nodes;
  const [openIndices, setOpenIndices] = useState(new Set([0]));

  const handleToggle = (index) => {
    setOpenIndices(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-12 px-4 font-mono">
      {/* Terminal Container */}
      <div className="bg-terminal-bg relative border border-white/10 shadow-2xl overflow-hidden rounded-sm">
        {/* Grid Background */}
        <div className="absolute inset-0 grid-lines-bg pointer-events-none opacity-40" />

        {/* Header */}
        <div className="relative z-20 border-b border-white/10 p-4 md:p-6 flex flex-col md:flex-row justify-between items-baseline gap-4 bg-black/20">
          <div>
            <h2 className="font-display text-xl md:text-2xl font-bold tracking-widest text-white flex items-center gap-3 uppercase">
              <FontAwesomeIcon icon={faBriefcase} className="text-primary animate-pulse" size="sm" />
              EXEC_PATH
              <span className="text-teal">.history</span>
            </h2>
            <div className="h-0.5 w-24 bg-primary mt-1" />
          </div>
          <div className="text-xs tracking-widest text-gray-400 uppercase font-mono">
            Nodes_Located:{' '}
            <span className="text-primary font-bold">{String(experiences.length).padStart(2, '0')}</span>{' '}
            | Notion.Sync: <span className="text-teal font-bold">Active</span>
          </div>
        </div>

        {/* Status bar */}
        <div className="relative z-20 border-b border-white/10 px-4 md:px-6 py-3 bg-black/10 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-green-500 uppercase font-bold tracking-widest">
              Connection_Stable
            </span>
          </div>
          <span className="text-xs text-white/40 uppercase tracking-widest">
            Buffer_Status: <span className="text-teal">Optimal</span>
          </span>
        </div>

        {/* Timeline */}
        <div className="relative z-20 p-4 md:p-8">
          {/* Vertical timeline line */}
          <div
            className="absolute left-[55px] md:left-[71px] top-4 bottom-4 w-px opacity-30 pointer-events-none"
            style={{
              background:
                'linear-gradient(to bottom, transparent, #FF6600 15%, #00F5FF 50%, #FF6600 85%, transparent)',
            }}
          />

          <div className="space-y-10 md:space-y-14">
            {experiences.map((item, index) => (
              <ExperienceItem
                key={item.id}
                item={item}
                index={index}
                isOpen={openIndices.has(index)}
                onToggle={() => handleToggle(index)}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-20 border-t border-white/20 p-3 md:p-4 bg-black/60 flex flex-col md:flex-row justify-between items-center gap-2 overflow-hidden">
          <div className="text-xs text-teal font-mono flex items-center gap-3">
            <span className="w-2 h-2 bg-teal rounded-full animate-pulse shadow-[0_0_8px_#00f5ff]" />
            ACTIVE_SESSION: EXPERIENCE.LOG
          </div>
          <div className="text-xs text-primary font-mono tracking-tight">
            NOTION@SYNC:~/experience${' '}
            <span className="text-white ml-1 font-semibold">fetch --all</span>
          </div>
        </div>

        {/* Corner Decorations */}
        <div className="absolute top-0 left-0 w-4 h-4 md:w-6 md:h-6 border-t-2 border-l-2 border-primary/60 z-30" />
        <div className="absolute top-0 right-0 w-4 h-4 md:w-6 md:h-6 border-t-2 border-r-2 border-teal/60 z-30" />
        <div className="absolute bottom-0 left-0 w-4 h-4 md:w-6 md:h-6 border-b-2 border-l-2 border-teal/60 z-30" />
        <div className="absolute bottom-0 right-0 w-4 h-4 md:w-6 md:h-6 border-b-2 border-r-2 border-primary/60 z-30" />
      </div>
    </div>
  );
};

export default Experience;
