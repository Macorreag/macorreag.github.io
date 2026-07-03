import React from 'react';
import { Helmet } from 'react-helmet';

const Seo = ({ title, description }) => (
  <Helmet>
    <html lang="es" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
  </Helmet>
);

export default Seo;