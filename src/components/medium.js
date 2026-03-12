import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNewspaper, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import Post from './post';

export default () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const data = sessionStorage.getItem('posts');
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed && parsed.items) {
        setPosts(parsed.items);
        return;
      }
    }

    async function getMediumPosts() {
      const response = await fetch(
        'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2F%40macorreag',
      );
      const myPosts = await response.json();
      sessionStorage.setItem('posts', JSON.stringify(myPosts));
      if (myPosts && myPosts.items) setPosts(myPosts.items);
    }

    getMediumPosts();
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
              <FontAwesomeIcon icon={faNewspaper} className="text-primary animate-pulse" size="sm" />
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
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {posts.map((post, index) => (
                <Post key={post.link || post.guid || index} element={post} index={index} />
              ))}
            </div>
          ) : (
            <p className="text-center text-white/30 font-mono text-sm py-8">
              <span className="text-primary">{'> '}</span>
              Fetching posts...
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="relative z-20 border-t border-white/20 p-3 md:p-4 bg-black/60 flex justify-between items-center">
          <div className="text-xs text-primary font-mono flex items-center gap-3">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_#FF6600]" />
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
    </div>
  );
};
