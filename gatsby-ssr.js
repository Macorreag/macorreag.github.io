const React = require('react');

// Copiloto de IA (M.C.) — lanzador servido por el Worker del MCP del portafolio.
exports.onRenderBody = ({ setPostBodyComponents }) => {
  setPostBodyComponents([
    React.createElement('script', {
      key: 'mcp-assistant',
      async: true,
      src: 'https://macorreag-portfolio-mcp.macorreag.workers.dev/assistant.js',
    }),
  ]);
};

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
