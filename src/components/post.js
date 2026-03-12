import React from 'react';

export default ({ element, index }) => {
  const post = element;
  const isCoral = index % 2 === 0;

  return (
    <div
      className="flex flex-col overflow-hidden border transition-colors"
      style={{
        borderColor: isCoral ? 'rgba(255,111,97,0.25)' : 'rgba(0,245,255,0.25)',
        backgroundColor: isCoral ? 'rgba(255,111,97,0.03)' : 'rgba(0,245,255,0.03)',
      }}
    >
      {post.thumbnail && (
        <div className="h-32 overflow-hidden">
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-full object-cover opacity-60 hover:opacity-90 transition-opacity"
          />
        </div>
      )}
      <div className="p-4 flex flex-col flex-1">
        <h4 className="font-bold font-mono text-white text-sm leading-snug mb-3 line-clamp-3">
          {post.title}
        </h4>
        <div className="mt-auto">
          <a
            className={`text-xs font-mono font-bold uppercase tracking-widest hover:opacity-80 transition-opacity ${isCoral ? 'text-primary' : 'text-teal'}`}
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            [ Leer_Artículo → ]
          </a>
        </div>
      </div>
    </div>
  );
};
