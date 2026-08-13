import React, { useEffect, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faNewspaper,
  faArrowUpRightFromSquare,
  faRotateRight,
} from '@fortawesome/free-solid-svg-icons';
import Post from './post';

const CACHE_KEY = 'posts';
const CACHE_TTL_MS = 60 * 60 * 1000;
const RSS_API =
  'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2F%40macorreag';

const readCache = () => {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.items || Date.now() - parsed.t > CACHE_TTL_MS) return null;
    return parsed.items;
  } catch (err) {
    return null;
  }
};

const writeCache = items => {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), items }));
  } catch (err) {
    // sessionStorage no disponible: ignorar caché
  }
};

export default () => {
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState('loading');
  const [usingCache, setUsingCache] = useState(false);

  const fetchPosts = useCallback(async () => {
    setStatus('loading');
    try {
      const response = await fetch(RSS_API);
      if (!response.ok) throw new Error(`rss2json error: ${response.status}`);
      const myPosts = await response.json();
      if (myPosts.status !== 'ok' || !myPosts.items)
        throw new Error('Respuesta inválida de rss2json');
      writeCache(myPosts.items);
      setPosts(myPosts.items);
      setUsingCache(false);
      setStatus('ok');
    } catch (err) {
      console.error('Error fetching Medium posts:', err.message);
      const cached = readCache();
      if (cached) {
        setPosts(cached);
        setUsingCache(true);
        setStatus('ok');
      } else {
        setPosts([]);
        setStatus('error');
      }
    }
  }, []);

  useEffect(() => {
    const cached = readCache();
    if (cached) {
      setPosts(cached);
      setUsingCache(true);
      setStatus('ok');
      return;
    }
    fetchPosts();
  }, [fetchPosts]);

  return (
    <section id="posts" className="w-full max-w-6xl mx-auto mt-12 px-4 font-mono scroll-mt-20">
      <div className="bg-terminal-bg relative border border-white/10 shadow-2xl overflow-hidden rounded-sm">
        {/* Grid background */}
        <div className="absolute inset-0 grid-lines-bg pointer-events-none opacity-40" />

        {/* Header */}
        <div className="relative z-20 border-b border-white/10 p-4 md:p-6 flex flex-col md:flex-row justify-between items-baseline gap-4 bg-black/20">
          <div>
            <h2 className="font-display text-xl md:text-2xl font-bold tracking-widest text-white flex items-center gap-3 uppercase">
              <FontAwesomeIcon
                icon={faNewspaper}
                className="text-primary animate-pulse"
                size="sm"
              />
              MEDIUM
              <span className="text-teal">.posts</span>
            </h2>
            <div className="h-0.5 w-24 bg-teal mt-1" />
          </div>
          <div className="text-xs tracking-widest text-gray-400 uppercase font-mono">
            Posts_Count:{' '}
            <span className="text-primary font-bold">{String(posts.length).padStart(2, '0')}</span>{' '}
            | Source: <span className="text-teal font-bold">Medium.RSS</span>
          </div>
        </div>

        {/* Posts grid */}
        <div className="relative z-20 p-4 md:p-6">
          {status === 'loading' && (
            <p className="text-center text-white/30 font-mono text-sm py-8">
              <span className="text-primary">{'> '}</span>
              Fetching posts...
            </p>
          )}
          {status === 'error' && (
            <div className="text-center py-8 flex flex-col items-center gap-3">
              <p className="text-white/30 font-mono text-sm">
                <span className="text-red-500">{'> '}</span>
                No se pudieron cargar los artículos de Medium.
              </p>
              <button
                onClick={fetchPosts}
                className="text-xs font-mono font-bold uppercase tracking-widest text-primary hover:text-white transition-colors flex items-center gap-2 border border-primary/40 px-3 py-2"
              >
                <FontAwesomeIcon icon={faRotateRight} size="xs" />
                Retry
              </button>
            </div>
          )}
          {status === 'ok' && posts.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {posts.map((post, index) => (
                  <Post key={post.link || post.guid || index} element={post} index={index} />
                ))}
              </div>
              {usingCache && (
                <p className="mt-4 text-center text-xs text-amber-400/70 font-mono uppercase tracking-widest">
                  Mostrando datos en caché
                </p>
              )}
            </>
          )}
          {status === 'ok' && posts.length === 0 && (
            <p className="text-center text-white/30 font-mono text-sm py-8">
              <span className="text-primary">{'> '}</span>
              No hay artículos publicados aún.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="relative z-20 border-t border-white/20 p-3 md:p-4 bg-black/60 flex justify-between items-center">
          <div className="text-xs text-primary font-mono flex items-center gap-3">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_#00ff41]" />
            ACTIVE_SESSION: MEDIUM.LOG
          </div>
          <a
            href="https://medium.com/@macorreag"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono font-bold text-teal hover:text-white transition-colors tracking-widest uppercase flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} size="xs" />
            medium.com/@macorreag
          </a>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-4 h-4 md:w-6 md:h-6 border-t-2 border-l-2 border-teal/60 z-30" />
        <div className="absolute top-0 right-0 w-4 h-4 md:w-6 md:h-6 border-t-2 border-r-2 border-primary/60 z-30" />
        <div className="absolute bottom-0 left-0 w-4 h-4 md:w-6 md:h-6 border-b-2 border-l-2 border-primary/60 z-30" />
        <div className="absolute bottom-0 right-0 w-4 h-4 md:w-6 md:h-6 border-b-2 border-r-2 border-teal/60 z-30" />
      </div>
    </section>
  );
};
