import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

export default props => (
  <li
    className="flex flex-col gap-2 p-4 border border-white/10 hover:border-teal/30 transition-colors"
    style={{ backgroundColor: 'rgba(0,245,255,0.03)' }}
  >
    <div className="flex justify-between items-start gap-2">
      <h4 className="text-primary font-bold font-mono text-sm truncate">{props.repo.name}</h4>
      <a
        href={props.repo.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs font-mono text-teal/60 hover:text-teal transition-colors whitespace-nowrap shrink-0"
        aria-label={`Open ${props.repo.name} on GitHub`}
      >
        <FontAwesomeIcon icon={faArrowUpRightFromSquare} size="xs" />
      </a>
    </div>
    <p className="text-xs text-white/40 font-mono leading-relaxed line-clamp-2">
      {props.repo.description || '// No description'}
    </p>
    {props.repo.language && (
      <span className="text-xs text-white/30 font-mono mt-auto">
        <span className="text-teal">#</span> {props.repo.language}
      </span>
    )}
  </li>
);
