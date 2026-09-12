const React = require('react');

// WebMCP — expone herramientas del sitio a agentes a través de navigator.modelContext
// (API experimental; se registra solo si el navegador lo soporta, sin romper nada).
const webmcpScript = `
(function () {
  var mc = (typeof navigator !== 'undefined' && navigator.modelContext) || null;
  if (!mc || typeof mc.registerTool !== 'function') return;
  function ok(text) { return { content: [{ type: 'text', text: text }] }; }
  function scrollTo(id) {
    if (typeof document === 'undefined') return ok('Navegación no disponible en este contexto.');
    var el = document.getElementById(id);
    if (!el) return ok('Sección no encontrada: ' + id);
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return ok('Navegando a la sección "' + id + '".');
  }
  var tools = [
    {
      name: 'navigate_to_section',
      description: 'Desplaza la página a una sección del portafolio de Miller Correa.',
      inputSchema: {
        type: 'object',
        properties: {
          section: {
            type: 'string',
            description: 'Identificador de la sección.',
            enum: ['formation', 'courses', 'skills', 'experience', 'open-source', 'posts']
          }
        },
        required: ['section']
      },
      execute: function (args) { return scrollTo(args && args.section); }
    },
    {
      name: 'get_contact',
      description: 'Devuelve los datos de contacto de Miller Correa (email y GitHub).',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      execute: function () {
        return ok('Email: macorreag@unal.edu.co | GitHub: https://github.com/macorreag');
      }
    }
  ];
  tools.forEach(function (t) { try { mc.registerTool(t); } catch (e) {} });
})();
`;

// Transición sutil de entrada por página, 100% CSS (sin wrapper ni APIs de
// React): la raíz de la página (#___gatsby > div > div) se recrea en cada
// cambio de ruta, así la animación se repite en cada navegación.
const pageFadeCss =
  '@keyframes mcpPageFade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}' +
  '#___gatsby>div>div{animation:mcpPageFade .3s ease both}' +
  '@media (prefers-reduced-motion:reduce){#___gatsby>div>div{animation:none}}';

// Copiloto de IA (M.C.) — lanzador servido por el Worker del MCP del portafolio.
exports.onRenderBody = ({ setHeadComponents, setPostBodyComponents }) => {
  setHeadComponents([
    React.createElement('style', {
      key: 'mcp-page-fade-css',
      dangerouslySetInnerHTML: { __html: pageFadeCss },
    }),
  ]);
  setPostBodyComponents([
    React.createElement('script', {
      key: 'mcp-assistant',
      async: true,
      src: 'https://macorreag-portfolio-mcp.macorreag.workers.dev/assistant.js',
    }),
    React.createElement('script', {
      key: 'webmcp',
      dangerouslySetInnerHTML: {
        __html: webmcpScript,
      },
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
    React.createElement('link', {
      key: 'ai-catalog',
      rel: 'ai-catalog',
      href: '/.well-known/ai-catalog.json',
      type: 'application/json',
    }),
    React.createElement('link', {
      key: 'icon-svg',
      rel: 'icon',
      type: 'image/svg+xml',
      href: '/favicon.svg',
    }),
    React.createElement('link', {
      key: 'icon-png',
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: '/favicon-32.png',
    }),
    React.createElement('link', {
      key: 'apple-touch-icon',
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/apple-touch-icon.png',
    }),
  ]);
};
