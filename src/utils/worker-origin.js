/**
 * Origen del Worker del portafolio — única fuente de verdad.
 *
 * Se importa desde `gatsby-ssr.js` (que corre en Node durante el build, por eso
 * este archivo usa CommonJS) y desde el cliente, para que la URL del Worker no
 * viva duplicada en dos sitios que se puedan desincronizar.
 */
const WORKER_ORIGIN = 'https://macorreag-portfolio-mcp.macorreag.workers.dev';

module.exports = { WORKER_ORIGIN };
