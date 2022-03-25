import React, { useEffect, useState } from 'react';
import Posts from './posts';
import Post from './post';

export default () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const data = sessionStorage.getItem('posts');
    if (data) {
      setPosts(JSON.parse(data));
    }
    let myPosts;
    async function getMediumPosts() {
      const response = await fetch(
        'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fmedium.com%2Ffeed%2F%40macorreag',
      );
      myPosts = await response.json();
      sessionStorage.setItem('posts', JSON.stringify(myPosts));

      setPosts(myPosts.items);
    }

    getMediumPosts();
  }, []);
  return (
    <div className="max-w-4xl mx-auto overflow-x-scroll">
      <Posts data={posts} card={Post} title="Mis publicaciones en Medium"></Posts>
    </div>
  );
};
