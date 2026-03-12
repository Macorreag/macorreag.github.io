import React, { useEffect, useState } from 'react';
import Repo from './repo';

export default () => {
  const [repos, setRepos] = useState([]);
  const [reposCount, setReposCount] = useState(0);

  useEffect(() => {
    const data = sessionStorage.getItem('repos');
    let myRepos;
    if (data) {
      myRepos = JSON.parse(data);
      setReposCount(myRepos.length);
      myRepos = myRepos.slice(1, 13);
      return setRepos(myRepos);
    }

    async function fetchRepos() {
      const response = await fetch('https://api.github.com/users/macorreag/repos');
      let myRepos = await response.json();
      setReposCount(myRepos.length);
      sessionStorage.setItem('repos', JSON.stringify(myRepos));
      myRepos = myRepos.slice(1, 13);
      setRepos(myRepos);
    }

    fetchRepos();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto mt-12 px-4 font-mono">
      <div className="bg-terminal-bg relative border border-white/10 shadow-2xl overflow-hidden rounded-sm">
        {/* Grid background */}
        <div className="absolute inset-0 grid-lines-bg pointer-events-none opacity-40" />

        {/* Header */}
        <div className="relative z-20 border-b border-white/10 p-4 md:p-6 flex flex-col md:flex-row justify-between items-baseline gap-4 bg-black/20">
          <div>
            <h2 className="font-display text-xl md:text-2xl font-bold tracking-widest text-white flex items-center gap-3 uppercase">
              <span className="text-primary animate-pulse">::</span> OPEN_SOURCE
              <span className="text-teal">.repos</span>
            </h2>
            <div className="h-0.5 w-24 bg-teal mt-1" />
          </div>
          <div className="text-xs tracking-widest text-gray-400 uppercase font-mono">
            Repos_Count:{' '}
            <span className="text-primary font-bold">{String(reposCount).padStart(2, '0')}</span>{' '}
            | Source: <span className="text-teal font-bold">GitHub.API</span>
          </div>
        </div>

        {/* Status bar */}
        <div className="relative z-20 border-b border-white/10 px-4 md:px-6 py-3 bg-black/10 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-green-500 uppercase font-bold tracking-widest">
              API_Connected
            </span>
          </div>
          <span className="text-xs text-white/40 uppercase tracking-widest">
            Cache_Status: <span className="text-teal">SessionStorage</span>
          </span>
        </div>

        {/* Repos grid */}
        <div className="relative z-20 p-4 md:p-6">
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {repos.map(repo => (
              <Repo repo={repo} key={repo.id} />
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="relative z-20 border-t border-white/20 p-3 md:p-4 bg-black/60 flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="text-xs text-teal font-mono flex items-center gap-3">
            <span className="w-2 h-2 bg-teal rounded-full animate-pulse shadow-[0_0_8px_#00f5ff]" />
            ACTIVE_SESSION: REPOS.LOG
          </div>
          <a
            href="https://github.com/macorreag"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono font-bold text-primary hover:text-white transition-colors tracking-widest uppercase"
          >
            [ github.com/macorreag → ]
          </a>
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
