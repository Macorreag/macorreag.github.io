import React, { useEffect, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faNewspaper,
  faArrowUpRightFromSquare,
  faRotateRight,
} from '@fortawesome/free-solid-svg-icons';
import Post from './post';
import { useLoadMore, LoadMoreButton } from './load-more';

const CACHE_KEY = 'blog';
const CACHE_TTL_MS = 60 * 60 * 1000;
const MEDIUM_RSS_API =
  'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2F%40macorreag';
const DEVTO_API = 'https://dev.to/api/articles?username=macorreag&per_page=30';

const SOURCES = [
  {
    id: 'medium',
    label: 'Medium',
    profileUrl: 'https://medium.com/@macorreag',
    load: async () => {
      const response = await fetch(MEDIUM_RSS_API);
      if (!response.ok) throw new Error(`rss2json error: ${response.status}`);
      const data = await response.json();
      if (data.status !== 'ok' || !data.items) throw new Error('Respuesta inválida de rss2json');
      return data.items.map(item => ({
        title: item.title,
        link: item.link,
        thumbnail: item.thumbnail || null,
        pubDate: item.pubDate,
        description: item.description,
        source: 'Medium',
      }));
    },
  },
  {
    id: 'devto',
    label: 'DEV',
    profileUrl: 'https://dev.to/macorreag',
    load: async () => {
      const response = await fetch(DEVTO_API);
      if (!response.ok) throw new Error(`dev.to api error: ${response.status}`);
      const articles = await response.json();
      if (!Array.isArray(articles)) throw new Error('Respuesta inválida de dev.to');
      return articles.map(article => ({
        title: article.title,
        link: article.url,
        thumbnail: article.cover_image || article.social_image || null,
        pubDate: article.published_at,
        description: article.description,
        source: 'DEV',
      }));
    },
  },
];

const sortByDateDesc = (a, b) => new Date(b.pubDate) - new Date(a.pubDate);

const readCache = () => {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.items || Date.now() - parsed.t > CACHE_TTL_MS) return null;
    return { items: parsed.items, failedSources: parsed.failedSources || [] };
  } catch (err) {
    return null;
  }
};

const writeCache = (items, failedSources) => {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), items, failedSources }));
  } catch (err) {
    // sessionStorage no disponible: ignorar caché
  }
};

export default () => {
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState('loading');
  const [usingCache, setUsingCache] = useState(false);
  const [failedSources, setFailedSources] = useState([]);
  const { visibleCount, remaining, canLoadMore, loadMore } = useLoadMore({
    total: posts.length,
    resetKey: posts,
  });

  const fetchPosts = useCallback(async () => {
    setStatus('loading');
    const results = await Promise.allSettled(SOURCES.map(source => source.load()));
    const items = [];
    const failed = [];
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        items.push(...result.value);
      } else {
        failed.push(SOURCES[index].label);
        console.error(`Error fetching ${SOURCES[index].label} posts:`, result.reason?.message);
      }
    });
    items.sort(sortByDateDesc);
    if (items.length > 0) {
      setPosts(items);
      setFailedSources(failed);
      setUsingCache(false);
      setStatus('ok');
      writeCache(items, failed);
      return;
    }
    const cached = readCache();
    if (cached && cached.items.length > 0) {
      setPosts(cached.items);
      setFailedSources(cached.failedSources);
      setUsingCache(true);
      setStatus('ok');
    } else {
      setPosts([]);
      setFailedSources(failed);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    const cached = readCache();
    if (cached && cached.items.length > 0) {
      setPosts(cached.items);
      setFailedSources(cached.failedSources);
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
              BLOG
              <span className="text-teal">.posts</span>
            </h2>
            <div className="h-0.5 w-24 bg-teal mt-1" />
          </div>
          <div className="text-xs tracking-widest text-gray-400 uppercase font-mono">
            Posts_Count:{' '}
            <span className="text-primary font-bold">{String(posts.length).padStart(2, '0')}</span>{' '}
            | Sources: <span className="text-teal font-bold">Medium.RSS</span> +{' '}
            <span className="text-teal font-bold">DEV.API</span>
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
                No se pudieron cargar los artículos.
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
              {failedSources.length > 0 && (
                <p className="mb-4 text-center text-xs text-amber-400/70 font-mono uppercase tracking-widest">
                  No disponible temporalmente: {failedSources.join(' + ')}
                </p>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {posts.slice(0, visibleCount).map((post, index) => (
                  <Post key={post.link || index} element={post} index={index} />
                ))}
              </div>
              {canLoadMore && (
                <LoadMoreButton
                  remaining={remaining}
                  onLoadMore={loadMore}
                  shown={Math.min(visibleCount, posts.length)}
                  total={posts.length}
                />
              )}
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
        <div className="relative z-20 border-t border-white/20 p-3 md:p-4 bg-black/60 flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="text-xs text-primary font-mono flex items-center gap-3">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_#00ff41]" />
            ACTIVE_SESSION: BLOG.LOG
          </div>
          <div className="flex items-center gap-4">
            {SOURCES.map(source => (
              <a
                key={source.id}
                href={source.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono font-bold text-teal hover:text-white transition-colors tracking-widest uppercase flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} size="xs" />
                {source.id === 'medium' ? 'medium.com/@macorreag' : 'dev.to/macorreag'}
              </a>
            ))}
          </div>
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
