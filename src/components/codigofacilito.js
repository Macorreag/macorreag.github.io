import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Posts from './posts';
import certificate from './certificate';
export default () => {
  var data = useStaticQuery(graphql`
    {
      codigofaciltoJson {
        id
        data {
          username
          courses {
            title
            progress
            url
          }
        }
      }
    }
  `);

  console.log(data);

  return (
    <section>
      <div className="mt-24">
        <div className="max-w-4xl mx-auto">
          <Posts
            data={data.codigofaciltoJson.data.courses}
            card={certificate}
            title="Mis cursos en CódigoFacilito"
          ></Posts>
        </div>
      </div>
    </section>
  );
};
