const React = require('react');

exports.onPreRenderHTML = ({ getHeadComponents, replaceHeadComponents }) => {
  const headComponents = getHeadComponents();
  replaceHeadComponents([
    ...headComponents,
    React.createElement('meta', {
      key: 'theme-color',
      name: 'theme-color',
      content: '#0d0d14',
    }),
    React.createElement('meta', {
      key: 'og-description',
      name: 'description',
      content:
        'Portafolio de Miller Correa — Ingeniero de Sistemas, desarrollo web y proyectos open source.',
    }),
  ]);
};
