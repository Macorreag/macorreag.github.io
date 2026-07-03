/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
  siteMetadata: {
    title: 'Miller Correa',
    description:
      'Portafolio de Miller Correa con experiencia, proyectos, skills y contenido técnico actualizado.',
    author: '@macorreag',
    siteUrl: 'https://macorreag.github.io',
  },
  /* Your site config here */
  plugins: [
    'gatsby-plugin-postcss',
    'gatsby-transformer-json',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'data',
        path: `${__dirname}/src/data`,
      },
    },

  ],
};
