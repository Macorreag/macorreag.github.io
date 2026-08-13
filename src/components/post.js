import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

export default ({ element, index }) => {
  const post = element;
  const isPrimary = index % 2 === 0;

  return (
    <div
      className="flex flex-col overflow-hidden border hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,255,65,0.1)] transition duration-200"
      style={{
        borderColor: isPrimary ? 'rgba(0,255,65,0.25)' : 'rgba(0,204,102,0.25)',
        backgroundColor: isPrimary ? 'rgba(0,255,65,0.03)' : 'rgba(0,204,102,0.03)',
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
            className={`text-xs font-mono font-bold uppercase tracking-widest hover:opacity-80 transition-opacity flex items-center gap-2 ${
              isPrimary ? 'text-primary' : 'text-teal'
            }`}
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} size="xs" />
            Leer_Artículo
          </a>
        </div>
      </div>
    </div>
  );
};
