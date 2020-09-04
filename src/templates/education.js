import React from 'react';
import { graphql } from 'gatsby';

export default props => {
  const pageData = props.data.educationJson;
  return (
    <div>
      <header className="py-12 border-purple-500 border-solid border-t-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="capitalize text-6xl font-bold">{pageData.title}</h2>
          <p className="text-xl">{pageData.description}</p>
        </div>
      </header>
      <ul>
        {pageData.items.map((item, index) => (
          <li className="bg-white shadow mt-4 flex">
            <p className="vertical-text">{pageData.slug}</p>
            <div className="flex items-center flex-1 p-8">
              <div className="flex-1 ">
                <h3>{item.name}</h3>
                {item.degree && (
                  <span className="inline-block p-2 radius bg-ṕurple-100 text-purple-700">
                    {item.degree}
                  </span>
                )}
                {item.url && (
                  <a href={item.url} className="btn">
                    Ver más
                  </a>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const query = graphql`
  query($slug: String) {
    educationJson(slug: { eq: $slug }) {
      title
      description
      slug
      items {
        name
        degree
      }
    }
  }
`;
