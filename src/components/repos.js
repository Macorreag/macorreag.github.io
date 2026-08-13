import React, { useEffect, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faCircleDot, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import Repo from './repo';

const CACHE_KEY = 'repos';
const CACHE_TTL_MS = 30 * 60 * 1000;
const MAX_VISIBLE_REPOS = 12;
const GITHUB_REPOS_API = 'https://api.github.com/users/macorreag/repos?per_page=100';

const readCache = () => {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.repos || Date.now() - parsed.t > CACHE_TTL_MS) return null;
    return parsed.repos;
  } catch (err) {
    return null;
  }
};

const writeCache = repos => {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), repos }));
  } catch (err) {
    // sessionStorage no disponible: ignorar caché
  }
};

export default () => {
  const [repos, setRepos] = useState([]);
  const [reposCount, setReposCount] = useState(0);
  const [status, setStatus] = useState('loading');
  const [usingCache, setUsingCache] = useState(false);

  const fetchRepos = useCallback(async () => {
    setStatus('loading');
    try {
      const response = await fetch(GITHUB_REPOS_API);
      if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('Respuesta inesperada de GitHub API');
      const sorted = data.sort((a, b) => new Date(b.pushed_at || 0) - new Date(a.pushed_at || 0));
      writeCache(sorted);
      setReposCount(sorted.length);
      setRepos(sorted.slice(0, MAX_VISIBLE_REPOS));
      setUsingCache(false);
      setStatus('ok');
    } catch (err) {
      console.error('Error fetching GitHub repos:', err.message);
      const cached = readCache();
      if (cached) {
        setReposCount(cached.length);
        setRepos(cached.slice(0, MAX_VISIBLE_REPOS));
        setUsingCache(true);
        setStatus('ok');
      } else {
        setRepos([]);
        setReposCount(0);
        setStatus('error');
      }
    }
  }, []);

  useEffect(() => {
    const cached = readCache();
    if (cached) {
      setReposCount(cached.length);
      setRepos(cached.slice(0, MAX_VISIBLE_REPOS));
      setUsingCache(true);
      setStatus('ok');
      return;
    }
    fetchRepos();
  }, [fetchRepos]);

  return (
    <section
      id="open-source"
      className="w-full max-w-6xl mx-auto mt-12 px-4 font-mono scroll-mt-20"
    >
      <div className="bg-terminal-bg relative border border-white/10 shadow-2xl overflow-hidden rounded-sm">
        {/* Grid background */}
        <div className="absolute inset-0 grid-lines-bg pointer-events-none opacity-40" />

        {/* Header */}
        <div className="relative z-20 border-b border-white/10 p-4 md:p-6 flex flex-col md:flex-row justify-between items-baseline gap-4 bg-black/20">
          <div>
            <h2 className="font-display text-xl md:text-2xl font-bold tracking-widest text-white flex items-center gap-3 uppercase">
              <FontAwesomeIcon icon={faCode} className="text-primary animate-pulse" size="sm" />
              OPEN_SOURCE
              <span className="text-teal">.repos</span>
            </h2>
            <div className="h-0.5 w-24 bg-teal mt-1" />
          </div>
          <div className="text-xs tracking-widest text-gray-400 uppercase font-mono">
            Repos_Count:{' '}
            <span className="text-primary font-bold">{String(reposCount).padStart(2, '0')}</span> |
            Source: <span className="text-teal font-bold">GitHub.API</span>
          </div>
        </div>

        {/* Status bar */}
        <div className="relative z-20 border-b border-white/10 px-4 md:px-6 py-3 bg-black/10 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={faCircleDot}
              className={
                status === 'error'
                  ? 'text-red-500 animate-pulse'
                  : status === 'loading'
                  ? 'text-amber-400 animate-pulse'
                  : 'text-green-500 animate-pulse'
              }
              size="xs"
            />
            <span
              className={`text-xs uppercase font-bold tracking-widest ${
                status === 'error'
                  ? 'text-red-500'
                  : status === 'loading'
                  ? 'text-amber-400'
                  : 'text-green-500'
              }`}
            >
              {status === 'error'
                ? 'API_Unreachable'
                : status === 'loading'
                ? 'Connecting...'
                : 'API_Connected'}
            </span>
            {status === 'error' && (
              <button
                onClick={fetchRepos}
                className="ml-2 text-xs font-mono font-bold uppercase tracking-widest text-primary hover:text-white transition-colors flex items-center gap-1 border border-primary/40 px-2 py-1"
              >
                <FontAwesomeIcon icon={faRotateRight} size="xs" />
                Retry
              </button>
            )}
          </div>
          <span className="text-xs text-white/40 uppercase tracking-widest">
            Cache_Status:{' '}
            <span className={usingCache ? 'text-amber-400' : 'text-teal'}>
              {usingCache ? 'SessionStorage_TTL' : 'Live'}
            </span>
          </span>
        </div>

        {/* Repos grid */}
        <div className="relative z-20 p-4 md:p-6">
          {status === 'error' ? (
            <p className="text-center text-white/30 font-mono text-sm py-8">
              <span className="text-red-500">{'> '}</span>
              No se pudo conectar con GitHub API. Verifica tu conexión o intenta de nuevo.
            </p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {repos.map(repo => (
                <Repo repo={repo} key={repo.id} />
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="relative z-20 border-t border-white/20 p-3 md:p-4 bg-black/60 flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="text-xs text-teal font-mono flex items-center gap-3">
            <span className="w-2 h-2 bg-teal rounded-full animate-pulse shadow-[0_0_8px_#00ff41]" />
            ACTIVE_SESSION: REPOS.LOG
          </div>
          <a
            href="https://github.com/macorreag"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono font-bold text-primary hover:text-white transition-colors tracking-widest uppercase flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faGithub} size="sm" />
            github.com/macorreag
          </a>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-4 h-4 md:w-6 md:h-6 border-t-2 border-l-2 border-primary/60 z-30" />
        <div className="absolute top-0 right-0 w-4 h-4 md:w-6 md:h-6 border-t-2 border-r-2 border-teal/60 z-30" />
        <div className="absolute bottom-0 left-0 w-4 h-4 md:w-6 md:h-6 border-b-2 border-l-2 border-teal/60 z-30" />
        <div className="absolute bottom-0 right-0 w-4 h-4 md:w-6 md:h-6 border-b-2 border-r-2 border-primary/60 z-30" />
      </div>
    </section>
  );
};
