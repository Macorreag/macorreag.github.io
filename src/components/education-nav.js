import React from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default props => {
  const data = useStaticQuery(graphql`
    {
      allEducationJson {
        edges {
          node {
            slug
            title
            description
          }
        }
      }
    }
  `);

  const educationItems = data.allEducationJson.edges;

  return (
    <div className="w-full max-w-6xl mx-auto mt-12 px-4 font-mono">
      <div className="bg-terminal-bg relative border border-white/10 shadow-2xl overflow-hidden rounded-sm">
        {/* Grid background */}
        <div className="absolute inset-0 grid-lines-bg pointer-events-none opacity-40" />

        {/* Header */}
        <div className="relative z-20 border-b border-white/10 p-4 md:p-6 flex flex-col md:flex-row justify-between items-baseline gap-4 bg-black/20">
          <div>
            <h2 className="font-display text-xl md:text-2xl font-bold tracking-widest text-white flex items-center gap-3 uppercase">
              <FontAwesomeIcon icon={faGraduationCap} className="text-primary animate-pulse" size="sm" />
              FORMATION
              <span className="text-teal">.path</span>
            </h2>
            <div className="h-0.5 w-24 bg-primary mt-1" />
          </div>
          <div className="text-xs tracking-widest text-gray-400 uppercase font-mono">
            Modules_Loaded:{' '}
            <span className="text-teal font-bold">{String(educationItems.length).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Cards grid */}
        <div className="relative z-20 p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {educationItems.map((element, index) => {
              const { node } = element;
              const isCoral = index % 2 === 0;
              return (
                <article
                  key={node.slug}
                  className="flex flex-col justify-between p-4 border transition-colors"
                  style={{
                    borderColor: isCoral ? 'rgba(255,102,0,0.25)' : 'rgba(0,245,255,0.25)',
                    backgroundColor: isCoral ? 'rgba(255,102,0,0.03)' : 'rgba(0,245,255,0.03)',
                  }}
                >
                  <div>
                    <p className={`font-bold font-mono text-sm mb-2 ${isCoral ? 'text-primary' : 'text-teal'}`}>
                      {node.title}
                    </p>
                    <p className="text-xs text-white/50 font-mono leading-relaxed">{node.description}</p>
                  </div>
                  <div className="mt-4">
                    <Link
                      to={`/${node.slug}`}
                      className={`text-xs font-mono font-bold uppercase tracking-widest hover:opacity-80 transition-opacity flex items-center gap-2 ${isCoral ? 'text-primary' : 'text-teal'}`}
                    >
                      <FontAwesomeIcon icon={faArrowRight} size="xs" />
                      Ir
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-20 border-t border-white/20 p-3 md:p-4 bg-black/60 flex justify-between items-center">
          <div className="text-xs text-teal font-mono flex items-center gap-3">
            <span className="w-2 h-2 bg-teal rounded-full animate-pulse shadow-[0_0_8px_#00f5ff]" />
            ACTIVE_SESSION: EDUCATION.LOG
          </div>
          <div className="text-xs text-primary/60 font-mono tracking-tight">
            FORMATION@PATH:~/education$
          </div>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-4 h-4 md:w-6 md:h-6 border-t-2 border-l-2 border-primary/60 z-30" />
        <div className="absolute top-0 right-0 w-4 h-4 md:w-6 md:h-6 border-t-2 border-r-2 border-teal/60 z-30" />
        <div className="absolute bottom-0 left-0 w-4 h-4 md:w-6 md:h-6 border-b-2 border-l-2 border-teal/60 z-30" />
        <div className="absolute bottom-0 right-0 w-4 h-4 md:w-6 md:h-6 border-b-2 border-r-2 border-primary/60 z-30" />
      </div>
    </div>
  );
};
