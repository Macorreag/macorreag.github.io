import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';

// Componente para la barra de progreso de una habilidad
const SkillProgressBar = ({ skill, index }) => {
  // Calcular el nivel basado en experiencia (máximo 10)
  const level = Math.min((skill.experience || 1) * 2, 10);
  const percentage = level * 10;
  
  // Alternar colores entre teal y coral
  const isTeal = index % 2 === 0;
  const colorClass = isTeal ? 'bg-teal' : 'bg-primary';
  const glowClass = isTeal ? 'glow-teal' : 'glow-coral';
  const textColorClass = isTeal ? 'text-teal' : 'text-primary';

  return (
    <div className="group">
      <div className="flex justify-between items-end mb-1">
        <label className="text-xs font-bold text-white uppercase tracking-wider font-mono">
          {skill.title}
        </label>
        <span className={`${textColorClass} font-mono text-[11px] font-semibold`}>
          {level.toFixed(1)} / 10.0
        </span>
      </div>
      <div className="w-full bg-black/40 h-1.5 rounded-none overflow-hidden border border-white/5">
        <div 
          className={`${colorClass} h-full ${glowClass} transition-all duration-500`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Componente para mostrar las etiquetas de skills
const SkillTags = ({ skill, colorVariant }) => {
  const variants = {
    teal: 'bg-teal/10 border-teal/40 text-teal hover:bg-teal/20 hover:border-teal',
    coral: 'bg-primary/10 border-primary/40 text-primary hover:bg-primary/20 hover:border-primary',
    neutral: 'bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/60',
  };
  
  const tagClass = variants[colorVariant] || variants.teal;

  return (
    <div>
      <div className="text-xs text-white font-bold tracking-[0.1em] mb-2 uppercase border-l-2 border-primary pl-2 font-mono">
        {skill.title.replace(/\s+/g, '_')}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {skill.skills && skill.skills.map((tag, i) => (
          <span
            key={i}
            className={`px-2 py-0.5 border text-[11px] transition-all cursor-crosshair font-mono ${tagClass}`}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
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

  const skills = data.allSkillsJson.nodes;
  
  // Variantes de color para los módulos
  const colorVariants = ['teal', 'coral', 'neutral'];

  return (
    <div className="w-full max-w-6xl mx-auto mt-12 px-4 font-mono">
      {/* Terminal Container */}
      <div className="bg-terminal-bg relative border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden rounded-sm">
        {/* Grid Background */}
        <div className="absolute inset-0 grid-lines-bg pointer-events-none opacity-40" />
        
        {/* Header */}
        <div className="relative z-20 border-b border-white/10 p-4 md:p-6 flex flex-col md:flex-row justify-between items-baseline gap-4 bg-black/20">
          <div>
            <h2 className="font-display text-xl md:text-2xl font-bold tracking-[0.2em] text-white flex items-center gap-3">
              <span className="text-primary animate-pulse">::</span> SKILLS_MANIFEST
            </h2>
            <div className="h-0.5 w-24 bg-primary mt-1" />
          </div>
          <div className="text-xs tracking-widest text-gray-400 uppercase font-mono">
            System.Status: <span className="text-teal font-bold">Optimal</span> | Notion.Sync: <span className="text-teal font-bold">Active</span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 relative z-20">
          {/* Core Competencies Panel - Progress Bars */}
          <div className="border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col h-[280px]">
            <div className="p-4 md:p-6 border-b border-teal/20 bg-teal/5">
              <h3 className="font-display text-sm tracking-[0.2em] text-teal uppercase font-bold">
                01_Core_Competencies
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto skills-terminal-scrollbar p-4 md:p-6 space-y-5">
              {skills.map((skill, index) => (
                <SkillProgressBar key={skill.id} skill={skill} index={index} />
              ))}
            </div>
          </div>

          {/* Data Modules Panel - Tags */}
          <div className="flex flex-col h-[280px]">
            <div className="p-4 md:p-6 border-b border-primary/20 bg-primary/5">
              <h3 className="font-display text-sm tracking-[0.2em] text-primary uppercase font-bold">
                02_Data_Modules
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto skills-terminal-scrollbar p-4 md:p-6 space-y-5 bg-black/10">
              {skills.map((skill, index) => (
                <SkillTags 
                  key={skill.id} 
                  skill={skill} 
                  colorVariant={colorVariants[index % colorVariants.length]} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-20 border-t border-white/20 p-3 md:p-4 bg-black/60 flex flex-col md:flex-row justify-between items-center gap-2 overflow-hidden">
          <div className="text-xs text-teal font-mono flex items-center gap-3">
            <span className="w-2 h-2 bg-teal rounded-full animate-pulse shadow-[0_0_8px_#00f5ff]" />
            ACTIVE_SESSION: SKILLS.EXE
          </div>
          <div className="text-xs text-primary font-mono tracking-tight">
            NOTION@SYNC:~/skills$ <span className="text-white ml-1 font-semibold">fetch --all</span>
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

export default Skills;
