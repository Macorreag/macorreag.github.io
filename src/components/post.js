import React from 'react';

export default props => {
  const post = props.element;
  return (
    <div className="shadow p-8 bg-white mr-4 rounded flex-shrink-0" style={{ width: '300px' }}>
      <header
        className="h-40 bg-cover bg-center"
        style={{ backgroundImage: `url(${post.thumbnail})` }}
      ></header>
      <h4 className="font-bold h-40 overflow-y-hidden">{post.title}</h4>
      <div className="text-center">
        <a className="btn" href={post.link}>
          Leer Articulo
        </a>
      </div>
    </div>
  );
};
