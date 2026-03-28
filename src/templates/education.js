import React from 'react';
import { graphql, Link } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faExternalLinkAlt, faCheck } from '@fortawesome/free-solid-svg-icons';
import EdNav from '../components/education-nav';

export default props => {
  const pageData = props.data.educationJson;

  return (
    <div style={{ backgroundColor: '#0d0d14', minHeight: '100vh' }} className="pb-16">
      {/* Header */}
      <div className="w-full max-w-6xl mx-auto mt-8 px-4">
        <Link
          to="/"
          className="text-teal font-mono text-sm flex items-center gap-2 hover:opacity-70 transition-opacity mb-8"
        >
          <FontAwesomeIcon icon={faArrowLeft} size="xs" />
          REGRESAR AL INICIO
        </Link>

        <div
          className="relative border border-white/10 shadow-2xl overflow-hidden rounded-sm mb-8"
          style={{ backgroundColor: '#1a1a22' }}
        >
          {/* Grid background */}
          <div className="absolute inset-0 grid-lines-bg pointer-events-none opacity-40" />

          {/* Header section */}
          <div className="relative z-20 border-b border-white/10 p-6 md:p-8 bg-black/20">
            <h1 className="font-display text-3xl md:text-4xl font-bold tracking-widest text-white uppercase mb-2">
              {pageData.title}
            </h1>
            <div className="h-1 w-32 bg-primary mb-4" />
            <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-2xl font-mono">
              {pageData.description}
            </p>
          </div>

          {/* Items list */}
          <div className="relative z-20 p-6 md:p-8">
            <div className="space-y-4">
              {pageData.items.map((item, index) => {
                const isCoral = index % 2 === 0;
                return (
                  <div
                    key={index}
                    className="p-4 border transition-all hover:shadow-lg"
                    style={{
                      borderColor: isCoral ? 'rgba(255,102,0,0.3)' : 'rgba(0,245,255,0.3)',
                      backgroundColor: isCoral ? 'rgba(255,102,0,0.05)' : 'rgba(0,245,255,0.05)',
                    }}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <FontAwesomeIcon
                        icon={faCheck}
                        size="xs"
                        className={`mt-1 flex-shrink-0 ${isCoral ? 'text-primary' : 'text-teal'}`}
                      />
                      <div className="flex-1">
                        <h3
                          className={`font-bold text-sm md:text-base ${
                            isCoral ? 'text-primary' : 'text-teal'
                          }`}
                        >
                          {item.name}
                        </h3>
                        {item.platform && (
                          <p className="text-xs text-white/60 font-mono mt-1">
                            Plataforma: <span className="text-white/70">{item.platform}</span>
                          </p>
                        )}
                      </div>
                    </div>
                    {item.url && (
                      <div className="pl-8">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-2 px-4 py-2 border text-xs font-mono font-bold uppercase tracking-widest transition-all hover:shadow-lg ${
                            isCoral
                              ? 'border-primary/50 text-primary hover:bg-primary/10'
                              : 'border-teal/50 text-teal hover:bg-teal/10'
                          }`}
                        >
                          <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />
                          Ver Credencial
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Statistics footer */}
            <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center text-xs font-mono text-gray-400">
              <span>
                TOTAL_CURSOS:{' '}
                <span className="text-teal font-bold">
                  {String(pageData.items.length).padStart(2, '0')}
                </span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-teal rounded-full animate-pulse" />
                ACTIVE
              </span>
            </div>
          </div>

          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-4 h-4 md:w-6 md:h-6 border-t-2 border-l-2 border-primary/60 z-30" />
          <div className="absolute top-0 right-0 w-4 h-4 md:w-6 md:h-6 border-t-2 border-r-2 border-teal/60 z-30" />
          <div className="absolute bottom-0 left-0 w-4 h-4 md:w-6 md:h-6 border-b-2 border-l-2 border-teal/60 z-30" />
          <div className="absolute bottom-0 right-0 w-4 h-4 md:w-6 md:h-6 border-b-2 border-r-2 border-primary/60 z-30" />
        </div>
      </div>

      <EdNav></EdNav>
    </div>
  );
};

export const query = graphql`
  query($slug: String) {
    educationJson(slug: { eq: $slug }) {
      title
      description
      slug
      items {
        name
        platform
        url
      }
    }
  }
`;
