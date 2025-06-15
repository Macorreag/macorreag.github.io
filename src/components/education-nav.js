import React from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';

export default props => {
  const data = useStaticQuery(graphql`
    {
      allEducationJson {
        edges {
          node {
            slug
            title
            description
          }
        }
      }
    }
  `);

  return (
    <div className="max-w-4xl mx-auto mt-20">
      <h2 className="text-3xl font-bold text-center"> Conoce sobre mi formación educativa</h2>
      <nav className="flex flex-wrap justify-center mt-8">
        {data.allEducationJson.edges.map((element, index) => {
          const { node } = element;
          return (
            <article className="flex flex-1 bg-white shadow m-4 max-w-sm p-4">
              <header className="flex flex-col justify-between">
                <p className="font-bold leading-loose">{node.title}</p>
                <p className="font-light">{node.description}</p>
                <div className="mt-6">
                  <Link to={`/${node.slug}`} className="btn">
                    Ir
                  </Link>
                </div>
              </header>
            </article>
          );
        })}
      </nav>
    </div>
  );
};
